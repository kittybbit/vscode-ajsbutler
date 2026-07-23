import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffLimitation,
  SemanticDiffScheduleComparison,
  SemanticDiffScheduleRunChange,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";
import {
  evaluateSemanticDiffSchedule,
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
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  matches: ScheduleDiffMatchedUnit[];
  period?: ScheduleDiffPeriodOption;
  toUnitTarget: (
    unit: AjsUnit,
    unitById: Map<string, AjsUnit>,
  ) => SemanticDiffTarget;
};

export type ScheduleDiffResult = {
  scheduleComparison?: SemanticDiffScheduleComparison;
  confirmationRequired: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems: SemanticDiffUnsupportedItem[];
  limitations: SemanticDiffLimitation[];
};

const scheduleBasisConstraint =
  "Rule basis: JP1/AJS3 v13 unit definition schedule parameters sd and st for explicit directly defined jobnet schedules.";

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
  unitById: Map<string, AjsUnit>,
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
  target: toUnitTarget(decision.unit, unitById),
  message: `${decision.unit.absolutePath} ${decision.parameter.key}=${
    decision.parameter.value
  }: ${unsupportedScheduleMessage(decision)}`,
});

const createPeriodUnsupportedItem = (
  unit: AjsUnit | undefined,
  period: ScheduleDiffPeriodOption,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
  unitById: Map<string, AjsUnit>,
): SemanticDiffUnsupportedItem => ({
  id: "uncalculated:schedule:period",
  kind: "uncalculated",
  target: unit ? toUnitTarget(unit, unitById) : undefined,
  message: `schedule comparison period is invalid: from=${period.from}, to=${period.to}`,
});

const createPeriodLimitation = (
  period: ScheduleDiffPeriodOption,
): SemanticDiffLimitation => ({
  code: "invalid_schedule_comparison_period",
  kind: "uncalculated",
  message: `schedule comparison period is invalid: from=${period.from}, to=${period.to}`,
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
      summary: `${decision.unitPath} run on ${decision.date} changed from ${decision.before.time} to ${decision.after.time}`,
    };
  }

  const run = decision.kind === "removed" ? decision.before : decision.after;
  return {
    id: `schedule:${decision.kind}:${decision.unitPath}:${decision.date}:${run.time}`,
    kind: decision.kind,
    unitPath: decision.unitPath,
    date: decision.date,
    before: decision.kind === "removed" ? decision.before : undefined,
    after: decision.kind === "added" ? decision.after : undefined,
    summary: `${decision.unitPath} run on ${decision.date} ${run.time} ${decision.kind}`,
  };
};

const createZeroRunConfirmation = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  period: SemanticDiffComparisonPeriod,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffConfirmationRequiredItem => ({
  id: `confirm:schedule-zero-runs:${unit.id}`,
  target: toUnitTarget(unit, unitById),
  changeContent: `${unit.name} has no calculated runs in the schedule comparison period`,
  rationale:
    "a schedule-defined jobnet may no longer have an execution opportunity in the compared period",
  relatedTargets: [],
  constraints: [
    scheduleBasisConstraint,
    `Comparison period: ${period.from} to ${period.to} (exclusive)`,
  ],
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
          input.afterUnitById,
        ),
      ],
      limitations: [createPeriodLimitation(evaluation.period)],
    };
  }

  return {
    scheduleComparison: {
      period: evaluation.period,
      runChanges: evaluation.runDecisions.map(toScheduleRunChange),
    },
    confirmationRequired: evaluation.zeroRunCandidates.map((unit) =>
      createZeroRunConfirmation(
        unit,
        input.afterUnitById,
        evaluation.period,
        input.toUnitTarget,
      ),
    ),
    unsupportedItems: evaluation.unsupportedDecisions.map((decision) =>
      createUnsupportedItem(
        decision,
        decision.side === "before" ? input.beforeUnitById : input.afterUnitById,
        input.toUnitTarget,
      ),
    ),
    limitations: [],
  };
};
