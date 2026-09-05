import type {
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
  type SemanticDiffScheduleRunDecision,
  type SemanticDiffScheduleUnsupportedDecision,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";
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

const ruleValueId = (parameter: AjsParameter): string =>
  `${parameter.key}:${parameter.value}`;

const unsupportedScheduleMessage = (
  decision: SemanticDiffScheduleUnsupportedDecision,
): string => {
  switch (decision.reason) {
    case "cycle-schedule":
      return "cycle schedules are not calculated in this slice";
    case "closed-day-substitution":
      return "closed-day substitution is not calculated in this slice";
    case "shift-days":
      return "shift days are not calculated in this slice";
    case "calendar-selection":
      return "calendar selection is not calculated in this slice";
    case "inherited-parent-rule":
      return "inherited parent-rule schedules are not calculated in this slice";
    case "days-from-start":
      return "schedule-by-days-from-start is not calculated in this slice";
    case "invalid-start-time":
      return "start time is missing, unparsable, offset-based, day-crossing, or outside HH:MM";
    case "unpaired-start-time":
      return "matching sd for this start-time rule is missing";
    case "unsupported-schedule-date":
      return "schedule date is not a supported explicit calendar day in YYYY/MM/DD, MM/DD, or DD form";
    case "missing-start-time":
      return `matching st for schedule rule ${decision.scheduleRule} is missing or uncalculated`;
    case "invalid-calendar-day":
      return "schedule date is not a valid calendar day in the comparison period";
  }
};

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

const toScheduleRunChange = (
  decision: SemanticDiffScheduleRunDecision,
): SemanticDiffScheduleRunChange => {
  const dateKey = `${decision.unitPath}:${decision.date}`;
  if (decision.kind === "changed-time") {
    return {
      id: `schedule:changed-time:${dateKey}`,
      kind: decision.kind,
      unitPath: decision.unitPath,
      date: decision.date,
      before: decision.before,
      after: decision.after,
    };
  }

  const run = decision.kind === "removed" ? decision.before : decision.after;
  return {
    id: `schedule:${decision.kind}:${decision.unitPath}:${decision.date}:${run.time}`,
    kind: decision.kind,
    unitPath: decision.unitPath,
    date: decision.date,
    before: decision.kind === "removed" ? decision.before : null,
    after: decision.kind === "added" ? decision.after : null,
  };
};

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

export const compareScheduleDiff = (
  input: ScheduleDiffInput,
): ScheduleDiffResult => {
  const evaluation = evaluateSemanticDiffSchedule({
    beforeUnits: input.beforeUnits,
    afterUnits: input.afterUnits,
    matches: input.matches,
    period: input.period,
  });

  if (evaluation.kind === "not-requested") {
    return {
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
    };
  }

  if (evaluation.kind === "invalid-period") {
    return {
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

  return createEvaluatedScheduleDiffResult(evaluation, input);
};
