import type { AjsParameter, AjsUnit } from "../../models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffScheduleRun,
} from "../../models/semantic-diff/SemanticDiff";
import { compareScheduleRuns } from "./semanticDiffScheduleDiffer";
import { interpretSchedule } from "./semanticDiffScheduleInterpreter";
import { projectScheduleRuns } from "./semanticDiffScheduleProjector";
import type {
  SemanticDiffScheduleEvidence,
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleProjection,
  SemanticDiffScheduleRuleInterpretation,
  SemanticDiffScheduleSide,
  SemanticDiffScheduleStatus,
  SemanticDiffScheduleUnsupportedReason,
} from "./semanticDiffScheduleTypes";
import type { SemanticDiffUnitMatch } from "./semanticDiffStructuralRules";

export type SemanticDiffScheduleMatchedUnit = Pick<
  SemanticDiffUnitMatch,
  "before" | "after"
>;

export type {
  SemanticDiffScheduleEvidence,
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleProjection,
  SemanticDiffScheduleRuleInterpretation,
  SemanticDiffScheduleStatus,
  SemanticDiffScheduleUnsupportedReason,
};
export type { SemanticDiffScheduleSide } from "./semanticDiffScheduleTypes";
export { interpretSchedule, projectScheduleRuns, compareScheduleRuns };

export type SemanticDiffScheduleUnsupportedDecision = {
  side: SemanticDiffScheduleSide;
  unit: AjsUnit;
  parameter: AjsParameter;
  reason: SemanticDiffScheduleUnsupportedReason;
  scheduleRule?: number;
};

export type SemanticDiffScheduleRunDecision =
  | {
      kind: "changed-time";
      unitPath: string;
      date: string;
      before: SemanticDiffScheduleRun;
      after: SemanticDiffScheduleRun;
    }
  | {
      kind: "removed";
      unitPath: string;
      date: string;
      before: SemanticDiffScheduleRun;
    }
  | {
      kind: "added";
      unitPath: string;
      date: string;
      after: SemanticDiffScheduleRun;
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
  runs: SemanticDiffScheduleRun[];
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
      pairEvaluations: SemanticDiffSchedulePairEvaluation[];
    };

export type EvaluateSemanticDiffScheduleInput = {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  matches: SemanticDiffScheduleMatchedUnit[];
  period?: SemanticDiffComparisonPeriod;
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

const toUtcDate = (value: string): Date | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return undefined;
  }
  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : undefined;
};

const parsePeriod = (
  period: SemanticDiffComparisonPeriod,
): SemanticDiffComparisonPeriod | undefined => {
  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from < to ? period : undefined;
};

const unsupportedDecision = (
  side: SemanticDiffScheduleSide,
  interpretation: SemanticDiffScheduleInterpretation,
  rule: SemanticDiffScheduleRuleInterpretation,
): SemanticDiffScheduleUnsupportedDecision | undefined => {
  if (!rule.reason) {
    return undefined;
  }
  return {
    side,
    unit: interpretation.unit,
    parameter: rule.parameter,
    reason: rule.reason,
    ...(rule.rule === undefined ? {} : { scheduleRule: rule.rule }),
  };
};

const collectUnsupportedDecisions = (
  side: SemanticDiffScheduleSide,
  interpretation: SemanticDiffScheduleInterpretation,
  projection: SemanticDiffScheduleProjection,
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
  runs: SemanticDiffScheduleRun[];
  unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
  zeroRunCandidates: AjsUnit[];
  unitEvaluation: SemanticDiffScheduleSideEvaluation;
};

const collectScheduleUnit = (
  side: SemanticDiffScheduleSide,
  unit: AjsUnit,
  period: SemanticDiffComparisonPeriod,
): ScheduleUnitCollection => {
  const interpretation = interpretSchedule(unit);
  const projection = projectScheduleRuns({ interpretation, period });
  const unsupportedDecisions = collectUnsupportedDecisions(
    side,
    interpretation,
    projection,
  );
  const supportedPairCount = interpretation.hasRuleZeroUndefined
    ? 1
    : projection.rules.filter(
        (rule) =>
          rule.parameter.key === "sd" &&
          (rule.status === "supported" || rule.status === "no-runs"),
      ).length;
  const zeroRunCandidates =
    projection.completeness === "complete" && projection.runs.length === 0
      ? [unit]
      : [];
  return {
    runs: projection.runs,
    unsupportedDecisions,
    zeroRunCandidates,
    unitEvaluation: {
      unit,
      evidence: sideEvaluationEvidence(
        supportedPairCount,
        unsupportedDecisions.length,
      ),
      supportedPairCount,
      runs: projection.runs,
    },
  };
};

type ScheduleCollection = {
  runs: SemanticDiffScheduleRun[];
  unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
  zeroRunCandidates: AjsUnit[];
  unitEvaluations: SemanticDiffScheduleSideEvaluation[];
};

const collectScheduleSide = (
  side: SemanticDiffScheduleSide,
  units: AjsUnit[],
  period: SemanticDiffComparisonPeriod,
): ScheduleCollection => {
  const unitCollections = units
    .filter(isJobnetUnit)
    .filter(hasDirectScheduleParameters)
    .map((unit) => collectScheduleUnit(side, unit, period));
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
  run: SemanticDiffScheduleRun,
  canonicalPathByPath: Map<string, string>,
): SemanticDiffScheduleRun => ({
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
  const before = collectScheduleSide("before", input.beforeUnits, period);
  const after = collectScheduleSide("after", input.afterUnits, period);
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
    pairEvaluations: toPairEvaluations(
      input.matches,
      before.unitEvaluations,
      after.unitEvaluations,
    ),
  };
};
