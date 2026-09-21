import type { AjsParameter } from "../../models/ajs/AjsDocument";
import type { SemanticDiffScheduleRun } from "../../models/semantic-diff/SemanticDiff";
import {
  relativeScheduleDateRequiresContext,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";
import type { ValidSchedulePeriod } from "./semanticDiffScheduleCandidateTypes";
import { toUtcDate } from "../../schedule/ScheduleDate";
import {
  datePreflight,
  scheduleRuleEvidenceId,
  resolveSubstitutedCandidates,
  type DatePreflight,
} from "./semanticDiffScheduleSubstitutionProjection";
import {
  substitutionState,
  type SubstitutionAnalysis,
  type SubstitutionAssociation,
  type SubstitutionRuleState,
} from "./semanticDiffScheduleSubstitutionAnalysis";
import type {
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleRuleInterpretation,
} from "./semanticDiffScheduleTypes";

type RuleProjectionInput = {
  interpretation: SemanticDiffScheduleInterpretation;
  parsedPeriod: ValidSchedulePeriod;
  candidatePeriod: ValidSchedulePeriod;
  calendarContext?: SemanticDiffScheduleCalendarContext;
  substitutions: SubstitutionAnalysis;
  unresolvedWholeRules: Set<number>;
};

type ProjectedRule = {
  rule: SemanticDiffScheduleRuleInterpretation;
  runs: SemanticDiffScheduleRun[];
};

type ProjectedRules = {
  rules: SemanticDiffScheduleRuleInterpretation[];
  runs: SemanticDiffScheduleRun[];
};

const cloneRule = (
  rule: SemanticDiffScheduleRuleInterpretation,
  patch: Partial<SemanticDiffScheduleRuleInterpretation>,
): SemanticDiffScheduleRuleInterpretation => ({ ...rule, ...patch });

const isWithin = (date: Date, period: ValidSchedulePeriod): boolean =>
  date >= period.from && date < period.to;

const updateSubstitutionContextState = (input: {
  association: SubstitutionAssociation;
  status: "invalid" | "missing-context";
  calendarRawParameters: AjsParameter[];
  states: Map<SemanticDiffScheduleRuleInterpretation, SubstitutionRuleState>;
}): void => {
  input.association.sh.forEach((substitutionRule) => {
    const current = input.states.get(substitutionRule.interpretationRule);
    if (!current || current.status !== "supported") {
      return;
    }
    input.states.set(
      substitutionRule.interpretationRule,
      substitutionState({
        status: input.status,
        reason: "closed-day-substitution",
        evidenceId: `schedule:sh:${input.status}:${substitutionRule.rule}`,
        rawParameters: [
          ...current.rawParameters,
          ...input.calendarRawParameters,
        ],
        rule: substitutionRule.rule,
      }),
    );
  });
};

type CandidateProjectionInput = {
  candidates: string[];
  association: SubstitutionAssociation | undefined;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
  fullyQualified: boolean;
  unresolvedWholeRule: boolean;
  states: Map<SemanticDiffScheduleRuleInterpretation, SubstitutionRuleState>;
};

const invalidAssociation = (association: SubstitutionAssociation): boolean => {
  const invalidMode = association.modeConflict || association.mode === "no";
  const invalidRules = association.invalidSh.length > 0;
  const invalidShiftDays =
    association.shiftDaysConflict || association.invalidShiftDays.length > 0;
  return invalidMode || invalidRules || invalidShiftDays;
};

type SubstitutionModeInput = Pick<
  CandidateProjectionInput,
  "association" | "fullyQualified" | "unresolvedWholeRule"
>;

const hasAssociationMode = (input: SubstitutionModeInput): boolean =>
  input.association?.mode !== undefined;

const hasForcedEmptySubstitution = (input: SubstitutionModeInput): boolean =>
  (input.association?.invalidSh.length ?? 0) !== 0 ||
  input.association?.mode === "no";

const isDirectSubstitutionProjection = (
  input: SubstitutionModeInput,
): boolean =>
  !hasForcedEmptySubstitution(input) &&
  (!hasAssociationMode(input) || !input.fullyQualified);

const isEmptySubstitutionProjection = (input: SubstitutionModeInput): boolean =>
  hasForcedEmptySubstitution(input) ||
  (hasAssociationMode(input) &&
    (invalidAssociation(input.association!) || input.unresolvedWholeRule));

const substitutionMode = (
  input: SubstitutionModeInput,
): "direct" | "empty" | "resolve" => {
  const direct = isDirectSubstitutionProjection(input);
  const empty = isEmptySubstitutionProjection(input);
  const key = `${direct}-${empty}`;
  return {
    "true-false": "direct",
    "true-true": "direct",
    "false-true": "empty",
    "false-false": "resolve",
  }[key] as "direct" | "empty" | "resolve";
};

const directResolution = (
  input: CandidateProjectionInput,
  mode: "direct" | "empty",
): ReturnType<typeof resolveSubstitutedCandidates> => ({
  candidates: mode === "empty" ? [] : input.candidates,
});

const substitutionResolution = (
  input: CandidateProjectionInput,
): ReturnType<typeof resolveSubstitutedCandidates> => {
  const mode = substitutionMode(input);
  return mode === "resolve"
    ? resolveSubstitutedCandidates({
        candidates: input.candidates,
        association: input.association,
        calendarContext: input.calendarContext,
      })
    : directResolution(input, mode);
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
  interpretation: SemanticDiffScheduleInterpretation;
  rule: SemanticDiffScheduleRuleInterpretation;
  startTime: Extract<DatePreflight, { kind: "project" }>["startTime"];
}): SemanticDiffScheduleRun[] =>
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
  rule: SemanticDiffScheduleRuleInterpretation;
  startTime: Extract<DatePreflight, { kind: "project" }>["startTime"];
  association: SubstitutionAssociation | undefined;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
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
  rule: SemanticDiffScheduleRuleInterpretation;
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
  rule: SemanticDiffScheduleRuleInterpretation;
  startTime: SemanticDiffScheduleRuleInterpretation | undefined;
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
  rule: SemanticDiffScheduleRuleInterpretation;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
}): SemanticDiffScheduleCalendarContext["selection"] | undefined =>
  input.rule.parameter.key === "jc"
    ? input.calendarContext?.selection
    : undefined;

const calendarSelectionRule = (input: {
  rule: SemanticDiffScheduleRuleInterpretation;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
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
  rule: SemanticDiffScheduleRuleInterpretation,
  selection: NonNullable<SemanticDiffScheduleCalendarContext["selection"]>,
): SemanticDiffScheduleRuleInterpretation =>
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
  rule: SemanticDiffScheduleRuleInterpretation;
  states: Map<SemanticDiffScheduleRuleInterpretation, SubstitutionRuleState>;
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
  rule: SemanticDiffScheduleRuleInterpretation;
  startTimes: Map<number, SemanticDiffScheduleRuleInterpretation>;
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
  rules: SemanticDiffScheduleRuleInterpretation[],
): Map<number, SemanticDiffScheduleRuleInterpretation> => {
  const startTimes = new Map<number, SemanticDiffScheduleRuleInterpretation>();
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
