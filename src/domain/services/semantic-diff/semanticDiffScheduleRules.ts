import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../models/ajs/AjsDocument";
import type { SemanticDiffComparisonPeriod } from "../../models/semantic-diff/SemanticDiff";
import { compareScheduleRuns } from "./semanticDiffScheduleComparison";
import type {
  SemanticDiffScheduleRunDecision,
  SemanticDiffScheduleSide,
} from "./semanticDiffScheduleComparison";
import { interpretSchedule } from "../../schedule/ScheduleInterpretation";
import {
  projectScheduleRuns,
  type ScheduleProjection,
  type ScheduleProjectionPeriod,
  type ScheduleRun,
} from "../../schedule/ScheduleProjection";
import {
  createScheduleCalendarContextIndex,
  isFullyQualifiedRelativeScheduleDate,
  resolveScheduleCalendarContext,
  type ScheduleCalendarContextIndex,
} from "../../schedule/ScheduleCalendar";
import type {
  ScheduleInterpretation,
  ScheduleRuleInterpretation,
  ScheduleStatus,
  ScheduleUnsupportedReason,
} from "../../schedule/ScheduleInterpretation";
import type { SemanticDiffUnitMatch } from "./semanticDiffStructuralRules";

export type SemanticDiffScheduleMatchedUnit = Pick<
  SemanticDiffUnitMatch,
  "before" | "after"
>;

export type SemanticDiffScheduleUnsupportedDecision = {
  side: SemanticDiffScheduleSide;
  unit: AjsUnit;
  parameter: AjsParameter;
  reason: ScheduleUnsupportedReason;
  status?: Extract<
    ScheduleStatus,
    "invalid" | "missing-context" | "unsupported"
  >;
  scheduleRule?: number;
};

export type SemanticDiffScheduleEvidenceKind =
  | "supported"
  | "mixed"
  | "unsupported-or-uncalculated-only";

/** Compatibility view retained for application and report consumers. */
export type SemanticDiffScheduleSideEvaluation = {
  unit: AjsUnit;
  evidence: SemanticDiffScheduleEvidenceKind;
  supportedPairCount: number;
  runs: ScheduleRun[];
};

export type SemanticDiffSchedulePairEvaluation = {
  before: SemanticDiffScheduleSideEvaluation;
  after: SemanticDiffScheduleSideEvaluation;
};

export type SemanticDiffScheduleEvaluation =
  | { kind: "not-requested" }
  | { kind: "invalid-period"; period: SemanticDiffComparisonPeriod }
  | {
      kind: "evaluated";
      period: SemanticDiffComparisonPeriod;
      runDecisions: SemanticDiffScheduleRunDecision[];
      unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
      zeroRunCandidates: AjsUnit[];
      zeroRunCandidatesBySide: {
        before: AjsUnit[];
        after: AjsUnit[];
      };
      pairEvaluations: SemanticDiffSchedulePairEvaluation[];
    };

export type EvaluateSemanticDiffScheduleInput = {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  matches: SemanticDiffScheduleMatchedUnit[];
  period?: SemanticDiffComparisonPeriod;
  beforeDocument?: AjsDocument;
  afterDocument?: AjsDocument;
};

const jobnetTypes = new Set(["n", "rn", "rm", "rr"]);
const scheduleParameterKeys = new Set([
  "sd",
  "st",
  "cy",
  "sh",
  "shd",
  "jc",
  "ln",
  "cftd",
]);

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

const isJobnetUnit = (unit: AjsUnit): boolean => jobnetTypes.has(unit.unitType);

const hasDirectScheduleParameters = (unit: AjsUnit): boolean =>
  unit.parameters.some((parameter) => scheduleParameterKeys.has(parameter.key));

type UtcDateParts = readonly [year: number, month: number, day: number];

const parseUtcDateParts = (value: string): UtcDateParts | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return matched
    ? [Number(matched[1]), Number(matched[2]), Number(matched[3])]
    : undefined;
};

const matchesUtcDateParts = (
  date: Date,
  [year, month, day]: UtcDateParts,
): boolean =>
  date.getUTCFullYear() === year &&
  date.getUTCMonth() === month - 1 &&
  date.getUTCDate() === day;

const toUtcDate = (value: string): Date | undefined => {
  const parts = parseUtcDateParts(value);
  if (!parts) {
    return undefined;
  }
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  return matchesUtcDateParts(date, parts) ? date : undefined;
};

const parsePeriod = (
  period: SemanticDiffComparisonPeriod,
): SemanticDiffComparisonPeriod | undefined => {
  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from < to ? period : undefined;
};

const toScheduleProjectionPeriod = (
  period: SemanticDiffComparisonPeriod,
): ScheduleProjectionPeriod => ({
  from: period.from,
  to: period.to,
});

const projectionStatusReasons = new Set<ScheduleUnsupportedReason>([
  "calendar-selection",
  "closed-day-substitution",
]);

const isProjectionStatus = (
  status: ScheduleStatus,
): status is Extract<
  ScheduleStatus,
  "invalid" | "missing-context" | "unsupported"
> =>
  status === "invalid" ||
  status === "missing-context" ||
  status === "unsupported";

const unsupportedDecisionStatus = (
  rule: ScheduleRuleInterpretation,
): SemanticDiffScheduleUnsupportedDecision["status"] =>
  rule.reason &&
  projectionStatusReasons.has(rule.reason) &&
  isProjectionStatus(rule.status)
    ? rule.status
    : undefined;

const optionalDecisionStatus = (
  status: SemanticDiffScheduleUnsupportedDecision["status"],
):
  | Pick<SemanticDiffScheduleUnsupportedDecision, "status">
  | Record<never, never> => (status === undefined ? {} : { status });

const optionalScheduleRule = (
  rule: number | undefined,
):
  | Pick<SemanticDiffScheduleUnsupportedDecision, "scheduleRule">
  | Record<never, never> => (rule === undefined ? {} : { scheduleRule: rule });

const unsupportedDecision = (
  side: SemanticDiffScheduleSide,
  interpretation: ScheduleInterpretation,
  rule: ScheduleRuleInterpretation,
): SemanticDiffScheduleUnsupportedDecision | undefined => {
  if (!rule.reason) {
    return undefined;
  }
  const status = unsupportedDecisionStatus(rule);
  return {
    side,
    unit: interpretation.unit,
    parameter: rule.parameter,
    reason: rule.reason,
    ...optionalDecisionStatus(status),
    ...optionalScheduleRule(rule.rule),
  };
};

const collectUnsupportedDecisions = (
  side: SemanticDiffScheduleSide,
  interpretation: ScheduleInterpretation,
  projection: ScheduleProjection,
): SemanticDiffScheduleUnsupportedDecision[] =>
  projection.rules
    // Rule-zero `ud` makes the rest of the schedule input ineffective. Keep
    // it in the interpretation's raw evidence, but do not report the
    // ineffective `st`/other schedule values as independent failures.
    .filter(
      (rule) =>
        !interpretation.hasRuleZeroUndefined ||
        (rule.parameter.key === "sd" && rule.rule !== 0),
    )
    .map((rule) => unsupportedDecision(side, interpretation, rule))
    .filter(
      (decision): decision is SemanticDiffScheduleUnsupportedDecision =>
        decision !== undefined,
    );

const sideEvaluationEvidence = (
  supportedPairCount: number,
  unsupportedCount: number,
): SemanticDiffScheduleEvidenceKind => {
  if (supportedPairCount === 0) {
    return "unsupported-or-uncalculated-only";
  }
  return unsupportedCount === 0 ? "supported" : "mixed";
};

type ScheduleUnitCollection = {
  runs: ScheduleRun[];
  unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
  zeroRunCandidates: AjsUnit[];
  unitEvaluation: SemanticDiffScheduleSideEvaluation;
};

type ScheduleUnitCollectionInput = {
  side: SemanticDiffScheduleSide;
  unit: AjsUnit;
  period: SemanticDiffComparisonPeriod;
  document?: AjsDocument;
  contextIndex?: ScheduleCalendarContextIndex;
};

const hasContextRelativeDate = (
  interpretation: ScheduleInterpretation,
): boolean =>
  interpretation.scheduleDateRules.some(
    (rule) =>
      rule.date !== undefined &&
      isFullyQualifiedRelativeScheduleDate(rule.date),
  );

const hasClosedDaySubstitution = (
  interpretation: ScheduleInterpretation,
): boolean => interpretation.rules.some((rule) => rule.parameter.key === "sh");

const resolveUnitCalendarContext = (input: {
  interpretation: ScheduleInterpretation;
  unit: AjsUnit;
  document?: AjsDocument;
  contextIndex?: ScheduleCalendarContextIndex;
}): ReturnType<typeof resolveScheduleCalendarContext> | undefined => {
  const needsContext =
    hasContextRelativeDate(input.interpretation) ||
    hasClosedDaySubstitution(input.interpretation);
  return input.document && input.contextIndex && needsContext
    ? resolveScheduleCalendarContext(
        input.document,
        input.unit,
        input.contextIndex,
      )
    : undefined;
};

const supportedSchedulePairCount = (
  interpretation: ScheduleInterpretation,
  projection: ScheduleProjection,
): number =>
  interpretation.hasRuleZeroUndefined
    ? 1
    : projection.rules.filter(
        (rule) =>
          rule.parameter.key === "sd" &&
          (rule.status === "supported" || rule.status === "no-runs"),
      ).length;

const zeroRunCandidates = (
  unit: AjsUnit,
  projection: ScheduleProjection,
): AjsUnit[] =>
  projection.completeness === "complete" && projection.runs.length === 0
    ? [unit]
    : [];

const collectScheduleUnit = (
  input: ScheduleUnitCollectionInput,
): ScheduleUnitCollection => {
  const interpretation = interpretSchedule(input.unit);
  const calendarContext = resolveUnitCalendarContext({
    interpretation,
    unit: input.unit,
    document: input.document,
    contextIndex: input.contextIndex,
  });
  const projection = projectScheduleRuns({
    interpretation,
    period: toScheduleProjectionPeriod(input.period),
    ...(calendarContext === undefined ? {} : { calendarContext }),
  });
  const unsupportedDecisions = collectUnsupportedDecisions(
    input.side,
    interpretation,
    projection,
  );
  const supportedPairCount = supportedSchedulePairCount(
    interpretation,
    projection,
  );
  const unitZeroRunCandidates = zeroRunCandidates(input.unit, projection);
  return {
    runs: projection.runs,
    unsupportedDecisions,
    zeroRunCandidates: unitZeroRunCandidates,
    unitEvaluation: {
      unit: input.unit,
      evidence: sideEvaluationEvidence(
        supportedPairCount,
        unsupportedDecisions.length,
      ),
      supportedPairCount,
      runs: projection.runs,
    },
  };
};

type ScheduleSideCollectionInput = {
  side: SemanticDiffScheduleSide;
  units: AjsUnit[];
  period: SemanticDiffComparisonPeriod;
  document?: AjsDocument;
};

type ScheduleCollection = {
  runs: ScheduleRun[];
  unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
  zeroRunCandidates: AjsUnit[];
  unitEvaluations: SemanticDiffScheduleSideEvaluation[];
};

const collectScheduleSide = (
  input: ScheduleSideCollectionInput,
): ScheduleCollection => {
  const contextIndex = input.document
    ? createScheduleCalendarContextIndex(input.document)
    : undefined;
  const unitCollections = input.units
    .filter(isJobnetUnit)
    .filter(hasDirectScheduleParameters)
    .map((unit) =>
      collectScheduleUnit({
        side: input.side,
        unit,
        period: input.period,
        document: input.document,
        contextIndex,
      }),
    );
  return {
    runs: unitCollections
      .flatMap((collection) => collection.runs)
      .sort((left, right) =>
        compareStrings(
          `${left.unitPath}:${left.date}:${left.time}:${left.rule}`,
          `${right.unitPath}:${right.date}:${right.time}:${right.rule}`,
        ),
      ),
    unsupportedDecisions: unitCollections.flatMap(
      (collection) => collection.unsupportedDecisions,
    ),
    zeroRunCandidates: unitCollections.flatMap(
      (collection) => collection.zeroRunCandidates,
    ),
    unitEvaluations: unitCollections.map(
      (collection) => collection.unitEvaluation,
    ),
  };
};

const canonicalRun = (
  run: ScheduleRun,
  canonicalPathByPath: Map<string, string>,
): ScheduleRun => ({
  ...run,
  unitPath: canonicalPathByPath.get(run.unitPath) ?? run.unitPath,
});

const toPairEvaluations = (
  matches: SemanticDiffScheduleMatchedUnit[],
  before: SemanticDiffScheduleSideEvaluation[],
  after: SemanticDiffScheduleSideEvaluation[],
): SemanticDiffSchedulePairEvaluation[] => {
  const beforeByPath = new Map(
    before.map((evaluation) => [evaluation.unit.absolutePath, evaluation]),
  );
  const afterByPath = new Map(
    after.map((evaluation) => [evaluation.unit.absolutePath, evaluation]),
  );
  return matches.flatMap((match) => {
    const beforeEvaluation = beforeByPath.get(match.before.absolutePath);
    const afterEvaluation = afterByPath.get(match.after.absolutePath);
    return beforeEvaluation && afterEvaluation
      ? [{ before: beforeEvaluation, after: afterEvaluation }]
      : [];
  });
};

/** Compatibility facade for the separated interpreter/projector/differ pipeline. */
export const evaluateSemanticDiffSchedule = (
  input: EvaluateSemanticDiffScheduleInput,
): SemanticDiffScheduleEvaluation => {
  if (!input.period) {
    return { kind: "not-requested" };
  }
  const period = parsePeriod(input.period);
  if (!period) {
    return { kind: "invalid-period", period: input.period };
  }
  const before = collectScheduleSide({
    side: "before",
    units: input.beforeUnits,
    period,
    document: input.beforeDocument,
  });
  const after = collectScheduleSide({
    side: "after",
    units: input.afterUnits,
    period,
    document: input.afterDocument,
  });
  const afterPathByBeforePath = new Map(
    input.matches.map((match) => [
      match.before.absolutePath,
      match.after.absolutePath,
    ]),
  );
  return {
    kind: "evaluated",
    period,
    runDecisions: compareScheduleRuns(
      before.runs.map((run) => canonicalRun(run, afterPathByBeforePath)),
      after.runs,
    ),
    unsupportedDecisions: [
      ...before.unsupportedDecisions,
      ...after.unsupportedDecisions,
    ],
    zeroRunCandidates: after.zeroRunCandidates,
    zeroRunCandidatesBySide: {
      before: before.zeroRunCandidates,
      after: after.zeroRunCandidates,
    },
    pairEvaluations: toPairEvaluations(
      input.matches,
      before.unitEvaluations,
      after.unitEvaluations,
    ),
  };
};
