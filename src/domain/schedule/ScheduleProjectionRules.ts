import type { AjsParameter } from "../models/ajs/AjsDocument";
import {
  relativeScheduleDateRequiresContext,
  type ScheduleCalendarContext,
} from "./ScheduleCalendar";
import { toUtcDate } from "./ScheduleDate";
import {
  updateSubstitutionContextState,
  substitutionResolution,
} from "./ScheduleSubstitutionResolution";
import {
  type SubstitutionAnalysis,
  type SubstitutionAssociation,
  type SubstitutionRuleState,
} from "./ScheduleSubstitutionAnalysis";
import {
  datePreflight,
  scheduleRuleEvidenceId,
  type DatePreflight,
} from "./ScheduleProjectionOutcomes";
import type {
  ScheduleInterpretation,
  ScheduleRuleInterpretation,
} from "./ScheduleInterpretation";
import type { ScheduleRun } from "./ScheduleProjection";

type ValidSchedulePeriod = { from: Date; to: Date };

type RuleProjectionInput = {
  interpretation: ScheduleInterpretation;
  parsedPeriod: ValidSchedulePeriod;
  candidatePeriod: ValidSchedulePeriod;
  calendarContext?: ScheduleCalendarContext;
  substitutions: SubstitutionAnalysis;
  unresolvedWholeRules: Set<number>;
};

type ProjectedRule = {
  rule: ScheduleRuleInterpretation;
  runs: ScheduleRun[];
};

type ProjectedRules = {
  rules: ScheduleRuleInterpretation[];
  runs: ScheduleRun[];
};

const cloneRule = (
  rule: ScheduleRuleInterpretation,
  patch: Partial<ScheduleRuleInterpretation>,
): ScheduleRuleInterpretation => ({ ...rule, ...patch });

const isWithin = (date: Date, period: ValidSchedulePeriod): boolean =>
  date >= period.from && date < period.to;

export type CandidateProjectionInput = {
  candidates: string[];
  association: SubstitutionAssociation | undefined;
  calendarContext: ScheduleCalendarContext | undefined;
  fullyQualified: boolean;
  unresolvedWholeRule: boolean;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
};

const projectedCandidates = (input: CandidateProjectionInput): string[] => {
  const result = substitutionResolution(input);
  const contextState =
    result.contextStatus && input.association
      ? updateSubstitutionContextState({
          association: input.association,
          status: result.contextStatus,
          calendarRawParameters: input.calendarContext?.rawParameters ?? [],
          states: input.states,
        })
      : undefined;
  void contextState;
  return result.candidates;
};

const projectedRuns = (input: {
  candidates: string[];
  period: ValidSchedulePeriod;
  interpretation: ScheduleInterpretation;
  rule: ScheduleRuleInterpretation;
  startTime: Extract<DatePreflight, { kind: "project" }>["startTime"];
}): ScheduleRun[] =>
  input.candidates
    .map((candidate) => ({ date: candidate, parsed: toUtcDate(candidate) }))
    .filter(
      (candidate): candidate is { date: string; parsed: Date } =>
        candidate.parsed !== undefined &&
        isWithin(candidate.parsed, input.period),
    )
    .map(({ date }) => ({
      unitPath: input.interpretation.unit.absolutePath,
      unitName: input.interpretation.unit.name,
      rule: input.rule.rule ?? 1,
      date,
      time: input.startTime.startTime.value,
    }));

const substitutionParameters = (
  association: SubstitutionAssociation,
): AjsParameter[] => [
  ...association.sh.map(
    (substitutionRule) => substitutionRule.interpretationRule.parameter,
  ),
  ...association.invalidSh.map((invalidRule) => invalidRule.parameter),
  ...association.shd.map((shiftRule) => shiftRule.interpretationRule.parameter),
  ...association.invalidShiftDays.map(
    (shiftRule) => shiftRule.interpretationRule.parameter,
  ),
];

const projectedEvidenceParameters = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: Extract<DatePreflight, { kind: "project" }>["startTime"];
  association: SubstitutionAssociation | undefined;
  calendarContext: ScheduleCalendarContext | undefined;
}): AjsParameter[] => [
  input.rule.parameter,
  input.startTime.parameter,
  ...(relativeScheduleDateRequiresContext(input.rule.date)
    ? (input.calendarContext?.rawParameters ?? [])
    : []),
  ...(input.association
    ? [
        ...(input.calendarContext?.rawParameters ?? []),
        ...substitutionParameters(input.association),
      ]
    : []),
];

const projectReadyDateRule = (input: {
  rule: ScheduleRuleInterpretation;
  preflight: Extract<DatePreflight, { kind: "project" }>;
  context: RuleProjectionInput;
}): ProjectedRule => {
  const { rule, preflight, context } = input;
  const association = context.substitutions.associations.get(rule.rule ?? 1);
  const candidates = projectedCandidates({
    candidates: preflight.candidates,
    association,
    calendarContext: context.calendarContext,
    fullyQualified:
      rule.date?.year !== undefined && rule.date.month !== undefined,
    unresolvedWholeRule: context.unresolvedWholeRules.has(rule.rule ?? 1),
    states: context.substitutions.states,
  });
  const runs = projectedRuns({
    candidates,
    period: context.parsedPeriod,
    interpretation: context.interpretation,
    rule,
    startTime: preflight.startTime,
  });
  return {
    rule: cloneRule(rule, {
      status: runs.length === 0 ? "no-runs" : "supported",
      reason: undefined,
      evidence: {
        id: scheduleRuleEvidenceId({ rule, kind: "projected", runs }),
        rawParameters: projectedEvidenceParameters({
          rule,
          startTime: preflight.startTime,
          association,
          calendarContext: context.calendarContext,
        }),
        rule: rule.rule,
      },
    }),
    runs,
  };
};

const projectDateRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  context: RuleProjectionInput;
}): ProjectedRule => {
  const { rule, startTime, context } = input;
  const preflight = datePreflight({
    rule,
    startTime,
    calendarContext: context.calendarContext,
    candidatePeriod: context.candidatePeriod,
  });
  return preflight.kind === "return"
    ? { rule: preflight.rule, runs: [] }
    : projectReadyDateRule({ rule, preflight, context });
};

const calendarSelection = (input: {
  rule: ScheduleRuleInterpretation;
  calendarContext: ScheduleCalendarContext | undefined;
}): ScheduleCalendarContext["selection"] | undefined =>
  input.rule.parameter.key === "jc"
    ? input.calendarContext?.selection
    : undefined;

const calendarSelectionRule = (input: {
  rule: ScheduleRuleInterpretation;
  calendarContext: ScheduleCalendarContext | undefined;
}): ProjectedRule | undefined => {
  const selection = calendarSelection(input);
  if (!selection) {
    return undefined;
  }
  return {
    rule: calendarSelectionResult(input.rule, selection),
    runs: [],
  };
};

const calendarSelectionResult = (
  rule: ScheduleRuleInterpretation,
  selection: NonNullable<ScheduleCalendarContext["selection"]>,
): ScheduleRuleInterpretation =>
  cloneRule(rule, {
    status: selection.status,
    reason: selection.status === "supported" ? undefined : "calendar-selection",
    evidence: {
      id: selection.evidenceId,
      rawParameters: [...selection.rawParameters],
      rule: rule.rule,
    },
  });

const substitutionStateRule = (input: {
  rule: ScheduleRuleInterpretation;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
}): ProjectedRule | undefined => {
  const substitution = input.states.get(input.rule);
  return substitution
    ? {
        rule: cloneRule(input.rule, {
          status: substitution.status,
          reason: substitution.reason,
          evidence: {
            id: substitution.evidenceId,
            rawParameters: [...substitution.rawParameters],
            rule: substitution.rule,
          },
        }),
        runs: [],
      }
    : undefined;
};

const projectRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTimes: Map<number, ScheduleRuleInterpretation>;
  context: RuleProjectionInput;
}): ProjectedRule => {
  const { rule, startTimes, context } = input;
  const specialRule = calendarSelectionRule({
    rule,
    calendarContext: context.calendarContext,
  });
  const substitutionRule = substitutionStateRule({
    rule,
    states: context.substitutions.states,
  });
  const dateRule =
    rule.parameter.key !== "sd" || !rule.date
      ? { rule, runs: [] }
      : projectDateRule({
          rule,
          startTime: startTimes.get(rule.rule ?? 1),
          context,
        });
  return specialRule ?? substitutionRule ?? dateRule;
};

const firstStartTimes = (
  rules: ScheduleRuleInterpretation[],
): Map<number, ScheduleRuleInterpretation> => {
  const startTimes = new Map<number, ScheduleRuleInterpretation>();
  rules.forEach((rule) => {
    if (rule.rule !== undefined && !startTimes.has(rule.rule)) {
      startTimes.set(rule.rule, rule);
    }
  });
  return startTimes;
};

export const projectScheduleRules = (
  input: RuleProjectionInput,
): ProjectedRules => {
  const startTimes = firstStartTimes(input.interpretation.startTimeRules);
  const projected = input.interpretation.rules.map((rule) =>
    projectRule({ rule, startTimes, context: input }),
  );
  return {
    rules: projected.map(({ rule }) => rule),
    runs: projected.flatMap(({ runs }) => runs),
  };
};
