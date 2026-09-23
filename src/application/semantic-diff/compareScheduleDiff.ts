import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffConstraint,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffDetail,
  SemanticDiffLimitation,
  SemanticDiffScheduleComparison,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
} from "./semanticDiffDto";
import {
  createSemanticDiffDetail,
  createSemanticDiffWarning,
} from "./semanticDiffStructuredFacts";
import {
  evaluateSemanticDiffSchedule,
  type SemanticDiffScheduleEvaluation,
  type SemanticDiffSchedulePairEvaluation,
  type SemanticDiffScheduleUnsupportedDecision,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";
import type { ScheduleRun } from "../../domain/schedule/ScheduleProjection";
import type { SemanticDiffScheduleRunDecision } from "../../domain/services/semantic-diff/semanticDiffScheduleComparison";
import {
  isSemanticDiffJobnetUnit,
  type SemanticDiffUnitMatch,
} from "../../domain/services/semantic-diff/semanticDiffStructuralRules";

export type ScheduleDiffPeriodOption = SemanticDiffComparisonPeriod;

export type ScheduleDiffMatchedUnit = Pick<
  SemanticDiffUnitMatch,
  "before" | "after"
>;

export type ScheduleDiffInput = {
  beforeDocument: AjsDocument;
  afterDocument: AjsDocument;
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  matches: ScheduleDiffMatchedUnit[];
  period?: ScheduleDiffPeriodOption;
  toUnitTarget: (unit: AjsUnit) => SemanticDiffTarget;
};

export type ScheduleDiffResult = {
  scheduleComparison?: SemanticDiffScheduleComparison;
  confirmationRequired: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems: SemanticDiffUnsupportedItem[];
  limitations: SemanticDiffLimitation[];
};

export type ScheduleDiffResultWithEvaluation = ScheduleDiffResult & {
  evaluation: SemanticDiffScheduleEvaluation;
};

const ruleValueId = (parameter: AjsParameter): string =>
  `${parameter.key}:${parameter.value}`;

type UnsupportedScheduleMessage = (
  decision: SemanticDiffScheduleUnsupportedDecision,
) => string;

const unsupportedScheduleMessages: Readonly<
  Record<
    SemanticDiffScheduleUnsupportedDecision["reason"],
    UnsupportedScheduleMessage
  >
> = {
  "cycle-schedule": () => "cycle schedules are not calculated in this slice",
  "closed-day-substitution": () =>
    "closed-day substitution is not calculated in this slice",
  "shift-days": () => "shift days are not calculated in this slice",
  "calendar-selection": () =>
    "calendar selection is not calculated in this slice",
  "inherited-parent-rule": () =>
    "inherited parent-rule schedules are not calculated in this slice",
  "days-from-start": () =>
    "schedule-by-days-from-start is not calculated in this slice",
  "invalid-start-time": () =>
    "start time is missing, unparsable, offset-based, day-crossing, or outside HH:MM",
  "unpaired-start-time": () =>
    "matching sd for this start-time rule is missing",
  "unsupported-schedule-date": () =>
    "schedule date is not a supported explicit calendar day in YYYY/MM/DD, MM/DD, or DD form",
  "missing-start-time": (decision) =>
    `matching st for schedule rule ${decision.scheduleRule} is missing or uncalculated`,
  "invalid-calendar-day": () =>
    "schedule date is not a valid calendar day in the comparison period",
};

const unsupportedScheduleMessage = (
  decision: SemanticDiffScheduleUnsupportedDecision,
): string => unsupportedScheduleMessages[decision.reason](decision);

const createUnsupportedItem = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffUnsupportedItem => ({
  id: [
    "uncalculated",
    "schedule",
    decision.side,
    decision.unit.id,
    ruleValueId(decision.parameter),
  ].join(":"),
  kind: "uncalculated",
  side: decision.side,
  reasonCode: decision.reason,
  target: toUnitTarget(decision.unit),
  detail: createSemanticDiffDetail({
    unitPath: decision.unit.absolutePath,
    parameterKey: decision.parameter.key,
    scheduleRule: decision.scheduleRule,
    rawValues: [decision.parameter.value],
  }),
  warning: createSemanticDiffWarning({
    code: decision.reason,
    detail: createSemanticDiffDetail({
      unitPath: decision.unit.absolutePath,
      parameterKey: decision.parameter.key,
      scheduleRule: decision.scheduleRule,
      rawValues: [decision.parameter.value],
    }),
    fallbackText: `${decision.unit.absolutePath} ${decision.parameter.key}=${
      decision.parameter.value
    }: ${unsupportedScheduleMessage(decision)}`,
  }),
});

const createPeriodUnsupportedItem = (
  unit: AjsUnit | undefined,
  period: ScheduleDiffPeriodOption,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffUnsupportedItem => ({
  id: "uncalculated:schedule:period",
  kind: "uncalculated",
  side: null,
  reasonCode: "invalid-schedule-comparison-period",
  target: unit ? toUnitTarget(unit) : null,
  detail: createSemanticDiffDetail({ period }),
  warning: createSemanticDiffWarning({
    code: "invalid-schedule-comparison-period",
    detail: createSemanticDiffDetail({ period }),
    fallbackText: `schedule comparison period is invalid: from=${period.from}, to=${period.to}`,
  }),
});

const createPeriodLimitation = (
  period: ScheduleDiffPeriodOption,
): SemanticDiffLimitation => ({
  code: "invalid_schedule_comparison_period",
  kind: "uncalculated",
  side: null,
  unitPath: null,
  detail: createSemanticDiffDetail({ period }),
  warning: createSemanticDiffWarning({
    code: "invalid-schedule-comparison-period",
    detail: createSemanticDiffDetail({ period }),
    fallbackText: `schedule comparison period is invalid: from=${period.from}, to=${period.to}`,
  }),
});

type ChangedTimeDecision = Extract<
  SemanticDiffScheduleRunDecision,
  { kind: "changed-time" }
>;

type SingleRunDecision = Exclude<
  SemanticDiffScheduleRunDecision,
  ChangedTimeDecision
>;

const toSemanticDiffScheduleRunDto = (
  run: ScheduleRun,
): SemanticDiffScheduleRun => ({
  unitPath: run.unitPath,
  unitName: run.unitName,
  rule: run.rule,
  date: run.date,
  time: run.time,
});

const toChangedTimeRunChange = (
  decision: ChangedTimeDecision,
): SemanticDiffScheduleRunChange => ({
  id: `schedule:changed-time:${decision.unitPath}:${decision.date}`,
  kind: decision.kind,
  unitPath: decision.unitPath,
  date: decision.date,
  before: toSemanticDiffScheduleRunDto(decision.before),
  after: toSemanticDiffScheduleRunDto(decision.after),
});

const singleRunChangeSides = (
  decision: SingleRunDecision,
): Pick<SemanticDiffScheduleRunChange, "before" | "after"> =>
  decision.kind === "removed"
    ? { before: toSemanticDiffScheduleRunDto(decision.before), after: null }
    : { before: null, after: toSemanticDiffScheduleRunDto(decision.after) };

const singleRunChangeRun = (decision: SingleRunDecision): ScheduleRun =>
  decision.kind === "removed" ? decision.before : decision.after;

const toSingleRunChange = (
  decision: SingleRunDecision,
): SemanticDiffScheduleRunChange => {
  const run = singleRunChangeRun(decision);
  return {
    id: `schedule:${decision.kind}:${decision.unitPath}:${decision.date}:${run.time}`,
    kind: decision.kind,
    unitPath: decision.unitPath,
    date: decision.date,
    ...singleRunChangeSides(decision),
  };
};

const toScheduleRunChange = (
  decision: SemanticDiffScheduleRunDecision,
): SemanticDiffScheduleRunChange =>
  decision.kind === "changed-time"
    ? toChangedTimeRunChange(decision)
    : toSingleRunChange(decision);

const createScheduleConstraint = (
  code: SemanticDiffConstraint["code"],
  detail: SemanticDiffDetail,
): SemanticDiffConstraint => ({
  code,
  detail,
  warning: null,
});

const createZeroRunConfirmation = (
  unit: AjsUnit,
  period: SemanticDiffComparisonPeriod,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffConfirmationRequiredItem => ({
  id: `confirm:schedule-zero-runs:${unit.id}`,
  reasonCode: "no-calculated-schedule-run",
  target: toUnitTarget(unit),
  relatedTargets: [],
  detail: createSemanticDiffDetail({
    unitPath: unit.absolutePath,
    period,
  }),
  constraints: [
    createScheduleConstraint(
      "jp1-ajs3-v13-rule-basis",
      createSemanticDiffDetail({ unitPath: unit.absolutePath, period }),
    ),
    createScheduleConstraint(
      "runtime-state-not-verified",
      createSemanticDiffDetail({ unitPath: unit.absolutePath, period }),
    ),
    createScheduleConstraint(
      "comparison-period",
      createSemanticDiffDetail({ unitPath: unit.absolutePath, period }),
    ),
  ],
  warning: null,
});

const createRemovedRunConfirmation = (input: {
  decision: Extract<SemanticDiffScheduleRunDecision, { kind: "removed" }>;
  unit: AjsUnit;
  period: SemanticDiffComparisonPeriod;
  toUnitTarget: ScheduleDiffInput["toUnitTarget"];
}): SemanticDiffConfirmationRequiredItem => {
  const run = input.decision.before;
  const detail = createSemanticDiffDetail({
    unitPath: input.unit.absolutePath,
    scheduleRule: run.rule,
    period: input.period,
    beforeValues: [`date=${run.date}`, `time=${run.time}`],
  });
  return {
    id: `confirm:schedule-run-removed:${input.unit.id}:${run.date}:${run.time}:${run.rule}`,
    reasonCode: "calculated-schedule-run-removed",
    target: input.toUnitTarget(input.unit),
    relatedTargets: [],
    detail,
    constraints: [
      createScheduleConstraint("jp1-ajs3-v13-rule-basis", detail),
      createScheduleConstraint("runtime-state-not-verified", detail),
      createScheduleConstraint("comparison-period", detail),
    ],
    warning: null,
  };
};

type EvaluatedSchedule = Extract<
  SemanticDiffScheduleEvaluation,
  { kind: "evaluated" }
>;

type RemovedRunDecision = Extract<
  SemanticDiffScheduleRunDecision,
  { kind: "removed" }
>;

const isRemovedRunDecision = (
  decision: SemanticDiffScheduleRunDecision,
): decision is RemovedRunDecision => decision.kind === "removed";

const isSupportedSchedulePair = (
  pair: SemanticDiffSchedulePairEvaluation | undefined,
): pair is SemanticDiffSchedulePairEvaluation =>
  pair !== undefined &&
  pair.before.supportedPairCount > 0 &&
  pair.after.supportedPairCount > 0;

const createRemovedRunConfirmations = (
  evaluation: EvaluatedSchedule,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffConfirmationRequiredItem[] => {
  const pairEvaluationByAfterPath = new Map(
    evaluation.pairEvaluations.map((pair) => [
      pair.after.unit.absolutePath,
      pair,
    ]),
  );
  const confirmations = evaluation.runDecisions
    .filter(isRemovedRunDecision)
    .flatMap((decision) => {
      const pair = pairEvaluationByAfterPath.get(decision.unitPath);
      return isSupportedSchedulePair(pair)
        ? [
            createRemovedRunConfirmation({
              decision,
              unit: pair.after.unit,
              period: evaluation.period,
              toUnitTarget,
            }),
          ]
        : [];
    });
  return [
    ...new Map(
      confirmations.map((confirmation) => [confirmation.id, confirmation]),
    ).values(),
  ];
};

const createEvaluatedScheduleDiffResult = (
  evaluation: EvaluatedSchedule,
  input: ScheduleDiffInput,
): ScheduleDiffResult => ({
  scheduleComparison: {
    period: evaluation.period,
    runChanges: evaluation.runDecisions.map(toScheduleRunChange),
  },
  confirmationRequired: [
    ...evaluation.zeroRunCandidates.map((unit) =>
      createZeroRunConfirmation(unit, evaluation.period, input.toUnitTarget),
    ),
    ...createRemovedRunConfirmations(evaluation, input.toUnitTarget),
  ],
  unsupportedItems: evaluation.unsupportedDecisions.map((decision) =>
    createUnsupportedItem(decision, input.toUnitTarget),
  ),
  limitations: [],
});

export const compareScheduleDiffWithEvaluation = (
  input: ScheduleDiffInput,
): ScheduleDiffResultWithEvaluation => {
  const evaluation = evaluateSemanticDiffSchedule({
    beforeUnits: input.beforeUnits,
    afterUnits: input.afterUnits,
    matches: input.matches,
    period: input.period,
    beforeDocument: input.beforeDocument,
    afterDocument: input.afterDocument,
  });

  if (evaluation.kind === "not-requested") {
    return {
      evaluation,
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
    };
  }

  if (evaluation.kind === "invalid-period") {
    return {
      evaluation,
      confirmationRequired: [],
      unsupportedItems: [
        createPeriodUnsupportedItem(
          input.afterUnits.find(isSemanticDiffJobnetUnit),
          evaluation.period,
          input.toUnitTarget,
        ),
      ],
      limitations: [createPeriodLimitation(evaluation.period)],
    };
  }

  return {
    evaluation,
    ...createEvaluatedScheduleDiffResult(evaluation, input),
  };
};

export const compareScheduleDiff = (
  input: ScheduleDiffInput,
): ScheduleDiffResult => {
  const result = compareScheduleDiffWithEvaluation(input);
  return {
    ...(result.scheduleComparison
      ? { scheduleComparison: result.scheduleComparison }
      : {}),
    confirmationRequired: result.confirmationRequired,
    unsupportedItems: result.unsupportedItems,
    limitations: result.limitations,
  };
};
