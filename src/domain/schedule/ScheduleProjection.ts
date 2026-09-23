import type { AjsParameter, AjsUnit } from "../models/ajs/AjsDocument";
import {
  classifyScheduleCalendarDay,
  isFullyQualifiedRelativeScheduleDate,
  isSyntacticallyInvalidRelativeScheduleDate,
  relativeScheduleDateRequiresContext,
  type ScheduleCalendarContext,
  type ScheduleCalendarDayResult,
} from "./ScheduleCalendar";
import {
  resolveScheduleDateCandidates,
  type ScheduleDateCandidateResult,
} from "./ScheduleCandidateResolver";
import { formatScheduleDate, toUtcDate } from "./ScheduleDate";
import {
  parseClosedDaySubstitutionValue,
  parseShiftDaysValue,
} from "./ScheduleRule";
import type {
  ScheduleEvidence,
  ScheduleInterpretation,
  ScheduleRuleInterpretation,
  ScheduleStatus,
} from "./ScheduleInterpretation";

export type ScheduleProjectionPeriod = Readonly<{ from: string; to: string }>;

export type ScheduleProjectionInput = Readonly<{
  interpretation: ScheduleInterpretation;
  period: ScheduleProjectionPeriod;
  calendarContext?: ScheduleCalendarContext;
}>;

export type ScheduleRun = {
  unitPath: string;
  unitName: string;
  rule: number;
  date: string;
  time: string;
};

export type ScheduleProjection = {
  unit: AjsUnit;
  status: ScheduleStatus;
  completeness: "complete" | "partial" | "none";
  runs: ScheduleRun[];
  rules: ScheduleRuleInterpretation[];
  evidence: ScheduleEvidence[];
};

type ValidSchedulePeriod = { from: Date; to: Date };

const projectionPeriodOrEmptyBounds = (
  period: ScheduleProjectionPeriod | undefined,
): ScheduleProjectionPeriod => {
  if (
    !period ||
    typeof period.from !== "string" ||
    typeof period.to !== "string"
  ) {
    return { from: "", to: "" };
  }
  return { from: period.from, to: period.to };
};

const parsePeriod = (
  period: ScheduleProjectionPeriod | undefined,
): ValidSchedulePeriod | undefined => {
  const bounds = projectionPeriodOrEmptyBounds(period);
  const from = toUtcDate(bounds.from);
  const to = toUtcDate(bounds.to);
  return from && to && from < to ? { from, to } : undefined;
};

const addUtcDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 86_400_000);

const emptyProjection = (
  interpretation: ScheduleInterpretation,
  status: ScheduleProjection["status"],
  completeness: ScheduleProjection["completeness"],
): ScheduleProjection => ({
  unit: interpretation.unit,
  status,
  completeness,
  runs: [],
  rules: interpretation.rules,
  evidence: interpretation.rules.map((rule) => rule.evidence),
});

const unresolvedWholeRules = (
  interpretation: ScheduleInterpretation,
): Set<number> =>
  new Set(
    interpretation.rules
      .filter(
        (rule) => rule.parameter.key === "cy" || rule.parameter.key === "cftd",
      )
      .map(
        (rule) =>
          rule.rule ??
          Number(/^([0-9]{1,3}),/.exec(rule.parameter.value)?.[1] ?? "1"),
      ),
  );

const candidatePeriod = (input: {
  period: ValidSchedulePeriod;
  substitutions: ReturnType<typeof createSubstitutionAnalysis>;
}): ValidSchedulePeriod =>
  hasScheduleSubstitution(input.substitutions)
    ? {
        from: addUtcDays(input.period.from, -31),
        to: addUtcDays(input.period.to, 31),
      }
    : input.period;

const isCompleteRule = (rule: ScheduleRuleInterpretation): boolean =>
  rule.status === "supported" || rule.status === "no-runs";

const scheduleDateRules = (
  rules: ScheduleRuleInterpretation[],
): ScheduleRuleInterpretation[] =>
  rules.filter((rule) => rule.parameter.key === "sd");

const completenessForRules = (
  rules: ScheduleRuleInterpretation[],
): "complete" | "partial" | "none" => {
  const dates = scheduleDateRules(rules);
  const complete = rules.every(isCompleteRule);
  const partial = dates.some(isCompleteRule);
  const key = `${dates.length > 0}-${complete}-${partial}`;
  return {
    "false-false-false": "none",
    "false-true-false": "none",
    "false-false-true": "none",
    "false-true-true": "none",
    "true-true-true": "complete",
    "true-true-false": "complete",
    "true-false-true": "partial",
    "true-false-false": "none",
  }[key] as "complete" | "partial" | "none";
};

const incompleteStatus = (
  rules: ScheduleRuleInterpretation[],
): ScheduleProjection["status"] => {
  const invalid = rules.some((rule) => rule.status === "invalid");
  const missing = rules.some((rule) => rule.status === "missing-context");
  const key = `${invalid}-${missing}` as
    | "true-true"
    | "true-false"
    | "false-true"
    | "false-false";
  return (
    {
      "true-true": "invalid",
      "true-false": "invalid",
      "false-true": "missing-context",
      "false-false": "unsupported",
    } as const
  )[key];
};

const projectionStatus = (input: {
  completeness: "complete" | "partial" | "none";
  runs: ScheduleRun[];
  rules: ScheduleRuleInterpretation[];
}): ScheduleProjection["status"] => {
  const complete = input.runs.length === 0 ? "no-runs" : "supported";
  return {
    complete,
    partial: "supported",
    none: incompleteStatus(input.rules),
  }[input.completeness] as ScheduleProjection["status"];
};

const summarizeScheduleProjection = (input: {
  interpretation: ScheduleInterpretation;
  projected: ReturnType<typeof projectScheduleRules>;
}): ScheduleProjection => {
  const completeness = input.interpretation.hasRuleZeroUndefined
    ? "complete"
    : completenessForRules(input.projected.rules);
  return {
    unit: input.interpretation.unit,
    status: projectionStatus({
      completeness,
      runs: input.projected.runs,
      rules: input.projected.rules,
    }),
    completeness,
    runs: input.projected.runs,
    rules: input.projected.rules,
    evidence: input.projected.rules.map((rule) => rule.evidence),
  };
};

const projectValidatedSchedule = (input: {
  interpretation: ScheduleInterpretation;
  period: ValidSchedulePeriod;
  calendarContext: ScheduleProjectionInput["calendarContext"];
}): ScheduleProjection => {
  const substitutions = createSubstitutionAnalysis(input.interpretation);
  const projected = projectScheduleRules({
    interpretation: input.interpretation,
    parsedPeriod: input.period,
    candidatePeriod: candidatePeriod({
      period: input.period,
      substitutions,
    }),
    calendarContext: input.calendarContext,
    substitutions,
    unresolvedWholeRules: unresolvedWholeRules(input.interpretation),
  });
  return summarizeScheduleProjection({
    interpretation: input.interpretation,
    projected,
  });
};

const invalidPeriodProjection = (input: {
  interpretation: ScheduleInterpretation;
  period: ScheduleProjectionPeriod | undefined;
  parsedPeriod: ValidSchedulePeriod | undefined;
}): ScheduleProjection | undefined =>
  !input.period || !input.parsedPeriod
    ? emptyProjection(input.interpretation, "invalid", "none")
    : undefined;

const zeroRunProjection = (
  interpretation: ScheduleInterpretation,
): ScheduleProjection | undefined =>
  interpretation.hasRuleZeroUndefined
    ? emptyProjection(interpretation, "no-runs", "complete")
    : undefined;

const earlyProjection = (input: {
  interpretation: ScheduleInterpretation;
  period: ScheduleProjectionPeriod | undefined;
  parsedPeriod: ValidSchedulePeriod | undefined;
}): ScheduleProjection | undefined =>
  invalidPeriodProjection(input) ?? zeroRunProjection(input.interpretation);

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

const updateSubstitutionContextState = (input: {
  association: SubstitutionAssociation;
  status: "invalid" | "missing-context";
  calendarRawParameters: AjsParameter[];
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
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
  calendarContext: ScheduleCalendarContext | undefined;
  fullyQualified: boolean;
  unresolvedWholeRule: boolean;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
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

const projectScheduleRules = (input: RuleProjectionInput): ProjectedRules => {
  const startTimes = firstStartTimes(input.interpretation.startTimeRules);
  const projected = input.interpretation.rules.map((rule) =>
    projectRule({ rule, startTimes, context: input }),
  );
  return {
    rules: projected.map(({ rule }) => rule),
    runs: projected.flatMap(({ runs }) => runs),
  };
};

type SubstitutionMode = "be" | "af" | "ca" | "no";

type SubstitutionResolution = {
  candidates: string[];
  contextStatus?: "invalid" | "missing-context";
  contextEvidenceId?: string;
};

type ParsedSubstitutionRule = {
  interpretationRule: ScheduleRuleInterpretation;
  value: SubstitutionMode;
  rule: number;
};

type ParsedShiftDaysRule = {
  interpretationRule: ScheduleRuleInterpretation;
  value: number;
  rule: number;
  rawValue?: string;
};

type SubstitutionAssociation = {
  sh: ParsedSubstitutionRule[];
  invalidSh: ScheduleRuleInterpretation[];
  shd: ParsedShiftDaysRule[];
  invalidShiftDays: ParsedShiftDaysRule[];
  mode?: SubstitutionMode;
  modeConflict: boolean;
  shiftDays?: number;
  shiftDaysConflict: boolean;
};

type SubstitutionRuleState = {
  status: ScheduleRuleInterpretation["status"];
  reason?: ScheduleRuleInterpretation["reason"];
  evidenceId: string;
  rawParameters: AjsParameter[];
  rule?: number;
};

type SubstitutionAnalysis = {
  associations: Map<number, SubstitutionAssociation>;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
  fullyQualifiedDateRules: Set<number>;
};

type SubstitutionContext = NonNullable<
  Parameters<typeof classifyScheduleCalendarDay>[0]
>;

type Classification =
  | "open"
  | "closed"
  | { status: "invalid" | "missing-context"; evidenceId: string };

type CandidateResolution = {
  candidate?: string;
  failure?: SubstitutionResolution;
};

type ShiftSearch = CandidateResolution;

type ParsedRuleInput = {
  rule: ScheduleRuleInterpretation;
  associations: Map<number, SubstitutionAssociation>;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
};

const substitutionState = (input: {
  status: SubstitutionRuleState["status"];
  reason?: SubstitutionRuleState["reason"];
  evidenceId: string;
  rawParameters: AjsParameter[];
  rule?: number;
}): SubstitutionRuleState => ({
  status: input.status,
  ...(input.reason === undefined ? {} : { reason: input.reason }),
  evidenceId: input.evidenceId,
  rawParameters: [...input.rawParameters],
  ...(input.rule === undefined ? {} : { rule: input.rule }),
});

const emptyAssociation = (): SubstitutionAssociation => ({
  sh: [],
  invalidSh: [],
  shd: [],
  invalidShiftDays: [],
  modeConflict: false,
  shiftDaysConflict: false,
});

const associationFor = (
  associations: Map<number, SubstitutionAssociation>,
  rule: number,
): SubstitutionAssociation => {
  const existing = associations.get(rule);
  if (existing) {
    return existing;
  }
  const created = emptyAssociation();
  associations.set(rule, created);
  return created;
};

const rawRuleNumber = (value: string): number =>
  Number(/^([0-9]{1,3}),/.exec(value)?.[1] ?? "1");

const malformedShiftDays = (
  value: string,
): {
  ruleNumber: number;
  rawValue?: string;
} => {
  const hasExplicitRule = /^([0-9]{1,3}),/.test(value);
  return {
    ruleNumber: rawRuleNumber(value),
    ...(hasExplicitRule ? {} : { rawValue: value }),
  };
};

const recordInvalidSubstitution = (input: {
  rule: ScheduleRuleInterpretation;
  association: SubstitutionAssociation;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
}): void => {
  input.association.invalidSh.push(input.rule);
  input.states.set(
    input.rule,
    substitutionState({
      status: "invalid",
      reason: "closed-day-substitution",
      evidenceId: `schedule:sh:invalid:${input.rule.parameter.value}`,
      rawParameters: [input.rule.parameter],
    }),
  );
};

const analyzeShRule = (input: ParsedRuleInput): void => {
  const parsed = parseClosedDaySubstitutionValue(input.rule.parameter.value);
  if (!parsed) {
    recordInvalidSubstitution({
      rule: input.rule,
      association: associationFor(
        input.associations,
        rawRuleNumber(input.rule.parameter.value),
      ),
      states: input.states,
    });
    return;
  }
  associationFor(input.associations, parsed.rule).sh.push({
    interpretationRule: input.rule,
    value: parsed.value as SubstitutionMode,
    rule: parsed.rule,
  });
};

const recordInvalidShiftDays = (input: {
  rule: ScheduleRuleInterpretation;
  association: SubstitutionAssociation;
  ruleNumber: number;
  rawValue?: string;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
}): void => {
  input.association.invalidShiftDays.push({
    interpretationRule: input.rule,
    value: Number.NaN,
    rule: input.ruleNumber,
    ...(input.rawValue === undefined ? {} : { rawValue: input.rawValue }),
  });
  input.states.set(
    input.rule,
    substitutionState({
      status: "invalid",
      reason: "shift-days",
      evidenceId: `schedule:shd:invalid:${input.rawValue ?? input.ruleNumber}`,
      rawParameters: [input.rule.parameter],
      ...(input.rawValue === undefined ? { rule: input.ruleNumber } : {}),
    }),
  );
};

const analyzeShdRule = (input: ParsedRuleInput): void => {
  const parsed = parseShiftDaysValue(input.rule.parameter.value);
  if (parsed) {
    analyzeParsedShiftDays({ input, parsed });
  } else {
    const malformed = malformedShiftDays(input.rule.parameter.value);
    recordInvalidShiftDays({
      rule: input.rule,
      association: associationFor(input.associations, malformed.ruleNumber),
      ...malformed,
      states: input.states,
    });
  }
};

const analyzeParsedShiftDays = (input: {
  input: ParsedRuleInput;
  parsed: NonNullable<ReturnType<typeof parseShiftDaysValue>>;
}): void => {
  const { input: parsedInput, parsed } = input;
  const value = Number(parsed.value);
  const association = associationFor(parsedInput.associations, parsed.rule);
  const parsedRule: ParsedShiftDaysRule = {
    interpretationRule: parsedInput.rule,
    value,
    rule: parsed.rule,
  };
  if (value < 1 || value > 31) {
    recordInvalidShiftDays({
      rule: parsedInput.rule,
      association,
      ruleNumber: parsed.rule,
      states: parsedInput.states,
    });
  } else {
    association.shd.push(parsedRule);
  }
};

const substitutionAnalyzers: Record<string, (input: ParsedRuleInput) => void> =
  {
    sh: analyzeShRule,
    shd: analyzeShdRule,
  };

const analyzeSubstitutionRule = (input: ParsedRuleInput): void => {
  substitutionAnalyzers[input.rule.parameter.key]?.(input);
};

const ruleNumbers = (
  interpretation: ScheduleInterpretation,
): { dateRules: Set<number>; fullyQualifiedDateRules: Set<number> } => ({
  dateRules: new Set(
    interpretation.scheduleDateRules
      .map((rule) => rule.rule)
      .filter((rule): rule is number => rule !== undefined),
  ),
  fullyQualifiedDateRules: new Set(
    interpretation.scheduleDateRules
      .filter(
        (rule) =>
          rule.date?.year !== undefined && rule.date.month !== undefined,
      )
      .map((rule) => rule.rule)
      .filter((rule): rule is number => rule !== undefined),
  ),
});

const completeAssociation = (input: {
  association: SubstitutionAssociation;
  ruleNumber: number;
  dateRules: Set<number>;
  fullyQualifiedDateRules: Set<number>;
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
}): void => {
  const modeValues = new Set(input.association.sh.map((rule) => rule.value));
  input.association.modeConflict = modeValues.size > 1;
  input.association.mode = modeValues.values().next().value as
    | SubstitutionMode
    | undefined;
  const shiftValues = new Set(input.association.shd.map((rule) => rule.value));
  input.association.shiftDaysConflict = shiftValues.size > 1;
  input.association.shiftDays = shiftValues.values().next().value;
  const rawParameters = associationParameters(input.association);
  recordSubstitutionStates({ ...input, rawParameters });
};

const associationParameters = (
  association: SubstitutionAssociation,
): AjsParameter[] => [
  ...association.sh.map((rule) => rule.interpretationRule.parameter),
  ...association.invalidSh.map((rule) => rule.parameter),
  ...association.shd.map((rule) => rule.interpretationRule.parameter),
  ...association.invalidShiftDays.map(
    (rule) => rule.interpretationRule.parameter,
  ),
];

const substitutionStatus = (input: {
  association: SubstitutionAssociation;
  ruleNumber: number;
  dateRules: Set<number>;
  fullyQualifiedDateRules: Set<number>;
}): {
  status: SubstitutionRuleState["status"];
  reason?: SubstitutionRuleState["reason"];
  evidenceId: string;
} => {
  const kind = substitutionStatusKind(input);
  const evidenceId = {
    invalid: `schedule:sh:invalid:${input.ruleNumber}`,
    "missing-context": `schedule:sh:missing-context:${input.ruleNumber}`,
    unsupported: `schedule:sh:unsupported:${input.ruleNumber}`,
    supported: "JP1-PARAM-SCHEDULE-SHIFT-001",
  }[kind];
  const reason =
    kind === "supported" ? undefined : ("closed-day-substitution" as const);
  return {
    status: kind,
    ...(reason === undefined ? {} : { reason }),
    evidenceId,
  };
};

type SubstitutionStatusKind =
  | "invalid"
  | "missing-context"
  | "unsupported"
  | "supported";

const substitutionStatusKind = (input: {
  association: SubstitutionAssociation;
  ruleNumber: number;
  dateRules: Set<number>;
  fullyQualifiedDateRules: Set<number>;
}): SubstitutionStatusKind => {
  const invalid = invalidSubstitutionAssociation(input);
  const mode = input.association.mode === "no";
  const qualified = input.fullyQualifiedDateRules.has(input.ruleNumber);
  const key = `${invalid}-${mode}-${qualified}`;
  return {
    "true-true-true": "invalid",
    "true-true-false": "invalid",
    "true-false-true": "invalid",
    "true-false-false": "invalid",
    "false-true-true": "missing-context",
    "false-true-false": "missing-context",
    "false-false-true": "supported",
    "false-false-false": "unsupported",
  }[key] as SubstitutionStatusKind;
};

const invalidSubstitutionAssociation = (input: {
  association: SubstitutionAssociation;
  ruleNumber: number;
  dateRules: Set<number>;
}): boolean => {
  const missingDateRule =
    input.association.mode !== "no" && !input.dateRules.has(input.ruleNumber);
  return (
    input.association.modeConflict ||
    input.association.invalidSh.length > 0 ||
    missingDateRule
  );
};

const shiftDaysStatus = (input: {
  association: SubstitutionAssociation;
  ruleNumber: number;
  fullyQualifiedDateRules: Set<number>;
}): {
  status: SubstitutionRuleState["status"];
  reason?: SubstitutionRuleState["reason"];
  evidenceId: string;
} => {
  const invalid =
    input.association.shiftDaysConflict || input.association.sh.length === 0;
  const qualified = input.fullyQualifiedDateRules.has(input.ruleNumber);
  const kind = `${invalid}-${qualified}`;
  const evidenceId = {
    "true-true": `schedule:shd:invalid:${input.ruleNumber}`,
    "true-false": `schedule:shd:invalid:${input.ruleNumber}`,
    "false-true": "JP1-PARAM-SCHEDULE-SHIFT-001",
    "false-false": `schedule:shd:unsupported:${input.ruleNumber}`,
  }[kind as "true-true" | "true-false" | "false-true" | "false-false"];
  const status = (
    {
      "true-true": "invalid",
      "true-false": "invalid",
      "false-true": "supported",
      "false-false": "unsupported",
    } as const
  )[
    kind as "true-true" | "true-false" | "false-true" | "false-false"
  ] as SubstitutionRuleState["status"];
  return {
    status,
    ...(status === "supported" ? {} : { reason: "shift-days" as const }),
    evidenceId,
  };
};

const recordSubstitutionStates = (input: {
  association: SubstitutionAssociation;
  ruleNumber: number;
  dateRules: Set<number>;
  fullyQualifiedDateRules: Set<number>;
  rawParameters: AjsParameter[];
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
}): void => {
  input.association.sh.forEach((rule) => {
    const status = substitutionStatus(input);
    input.states.set(
      rule.interpretationRule,
      substitutionState({
        ...status,
        rawParameters: input.rawParameters,
        rule: input.ruleNumber,
      }),
    );
  });
  input.association.shd.forEach((rule) => {
    const status = shiftDaysStatus(input);
    input.states.set(
      rule.interpretationRule,
      substitutionState({
        ...status,
        rawParameters: input.rawParameters,
        rule: input.ruleNumber,
      }),
    );
  });
  input.association.invalidShiftDays.forEach((rule) => {
    input.states.set(
      rule.interpretationRule,
      substitutionState({
        status: "invalid",
        reason: "shift-days",
        evidenceId: `schedule:shd:invalid:${rule.rawValue ?? input.ruleNumber}`,
        rawParameters: input.rawParameters,
        rule: input.ruleNumber,
      }),
    );
  });
};

const contextFailure = (
  classification: Exclude<Classification, "open" | "closed">,
): SubstitutionResolution => ({
  candidates: [],
  contextStatus: classification.status,
  contextEvidenceId: classification.evidenceId,
});

const classifyDate = (
  context: SubstitutionContext,
  date: Date,
): Classification => {
  const result: ScheduleCalendarDayResult = classifyScheduleCalendarDay(
    context,
    date,
  );
  return "evidenceId" in result
    ? { status: result.status, evidenceId: result.evidenceId }
    : result.status;
};

const shiftedDate = (input: {
  offset: number;
  baseDate: Date;
  mode: SubstitutionMode;
}): Date => {
  const direction = input.mode === "be" ? -1 : 1;
  return new Date(
    input.baseDate.getTime() + direction * input.offset * 86_400_000,
  );
};

const shiftResult = (input: {
  date: Date;
  classification: Classification;
}): ShiftSearch | undefined => {
  if (typeof input.classification !== "string") {
    return { failure: contextFailure(input.classification) };
  }
  if (input.classification !== "open") {
    return undefined;
  }
  return {
    candidate: formatScheduleDate(
      input.date.getUTCFullYear(),
      input.date.getUTCMonth() + 1,
      input.date.getUTCDate(),
    ),
  };
};

const continueShift = (
  state: ShiftSearch,
  next: ShiftSearch | undefined,
): ShiftSearch => {
  if (state.candidate !== undefined || state.failure !== undefined) {
    return state;
  }
  return next ?? state;
};

const shiftStep = (input: {
  state: ShiftSearch;
  offset: number;
  baseDate: Date;
  mode: SubstitutionMode;
  context: SubstitutionContext;
}): ShiftSearch => {
  const date = shiftedDate(input);
  const classification = classifyDate(input.context, date);
  return continueShift(input.state, shiftResult({ date, classification }));
};

const shiftedCandidate = (input: {
  baseDate: Date;
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionContext;
}): ShiftSearch => {
  const offsets = Array.from(
    { length: input.shiftDays },
    (_, index) => index + 1,
  );
  return offsets.reduce<ShiftSearch>(
    (state, offset) => shiftStep({ ...input, state, offset }),
    {},
  );
};

type ClassifiedCandidateInput = {
  candidate: string;
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionContext;
  baseDate: Date;
  classification: Classification;
  failure: SubstitutionResolution | undefined;
};

const cancelCandidate = (
  input: ClassifiedCandidateInput,
): CandidateResolution =>
  (input.failure ? { failure: input.failure } : undefined) ??
  (input.classification === "open" ? { candidate: input.candidate } : {});

const openOrShiftedCandidate = (
  input: ClassifiedCandidateInput,
): CandidateResolution =>
  (input.failure ? { failure: input.failure } : undefined) ??
  (input.classification === "open"
    ? { candidate: input.candidate }
    : shiftedCandidate({
        baseDate: input.baseDate,
        mode: input.mode,
        shiftDays: input.shiftDays,
        context: input.context,
      }));

const candidateHandlers: Record<
  SubstitutionMode,
  (input: ClassifiedCandidateInput) => CandidateResolution
> = {
  ca: cancelCandidate,
  be: openOrShiftedCandidate,
  af: openOrShiftedCandidate,
  no: cancelCandidate,
};

/** Resolve one candidate while preserving substitution order and stop rules. */
const resolveSubstitutionCandidate = (input: {
  candidate: string;
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionContext;
}): CandidateResolution => {
  const baseDate = toUtcDate(input.candidate);
  if (!baseDate) {
    return {};
  }
  const classification = classifyDate(input.context, baseDate);
  const failure =
    typeof classification !== "string"
      ? contextFailure(classification)
      : undefined;
  return candidateHandlers[input.mode]({
    ...input,
    baseDate,
    classification,
    failure,
  });
};

const createSubstitutionAnalysis = (
  interpretation: ScheduleInterpretation,
): SubstitutionAnalysis => {
  const associations = new Map<number, SubstitutionAssociation>();
  const states = new Map<ScheduleRuleInterpretation, SubstitutionRuleState>();
  interpretation.rules.forEach((rule) =>
    analyzeSubstitutionRule({ rule, associations, states }),
  );
  const { dateRules, fullyQualifiedDateRules } = ruleNumbers(interpretation);
  associations.forEach((association, ruleNumber) =>
    completeAssociation({
      association,
      ruleNumber,
      dateRules,
      fullyQualifiedDateRules,
      states,
    }),
  );
  return { associations, states, fullyQualifiedDateRules };
};

const hasScheduleSubstitution = (input: SubstitutionAnalysis): boolean =>
  [...input.associations.entries()].some(
    ([ruleNumber, association]) =>
      input.fullyQualifiedDateRules.has(ruleNumber) &&
      association.sh.some((rule) => rule.value !== "no"),
  );

type SubstitutionProjectionContext = NonNullable<
  Parameters<typeof resolveSubstitutionCandidate>[0]["context"]
>;

type ResolutionSetup =
  | { kind: "skip"; resolution: SubstitutionResolution }
  | {
      kind: "ready";
      context: SubstitutionProjectionContext;
      mode: SubstitutionMode;
      shiftDays: number;
    };

type SubstitutionCandidateResolution = ReturnType<
  typeof resolveSubstitutionCandidate
>;

type DatePreflight =
  | { kind: "return"; rule: ScheduleRuleInterpretation }
  | {
      kind: "project";
      candidates: string[];
      startTime: SupportedStartTimeRule;
    };

type SupportedStartTimeRule = ScheduleRuleInterpretation & {
  startTime: NonNullable<ScheduleRuleInterpretation["startTime"]>;
};

const cloneSubstitutionRule = (
  rule: ScheduleRuleInterpretation,
  patch: Partial<ScheduleRuleInterpretation>,
): ScheduleRuleInterpretation => ({ ...rule, ...patch });

const scheduleRuleEvidenceId = (input: {
  rule: ScheduleRuleInterpretation;
  kind: "projected" | "invalid" | "missing-start-time";
  runs?: ScheduleRun[];
}): string => {
  const generated = {
    projected: `schedule:sd:${input.runs?.length === 0 ? "no-runs" : "supported"}:${input.rule.rule ?? 1}`,
    invalid: `schedule:sd:invalid-calendar-day:${input.rule.rule ?? input.rule.parameter.value}`,
    "missing-start-time": `schedule:sd:missing-start-time:${input.rule.rule ?? 1}`,
  }[input.kind];
  return input.rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")
    ? input.rule.evidence.id
    : generated;
};

const startTimeParameter = (
  startTime: ScheduleRuleInterpretation | undefined,
): AjsParameter[] => (startTime?.parameter ? [startTime.parameter] : []);

const calendarRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  status: ScheduleRuleInterpretation["status"];
  reason: ScheduleRuleInterpretation["reason"];
  evidenceId: string;
  calendarContext?: ScheduleCalendarContext;
}): ScheduleRuleInterpretation =>
  cloneSubstitutionRule(input.rule, {
    status: input.status,
    reason: input.reason,
    evidence: {
      id: input.evidenceId,
      rawParameters: input.calendarContext
        ? [input.rule.parameter, ...input.calendarContext.rawParameters]
        : [input.rule.parameter, ...startTimeParameter(input.startTime)],
      rule: input.rule.rule,
    },
  });

type RelativeDateMode = "none" | "invalid" | "unqualified" | "qualified";

const relativeDateMode = (
  date: ScheduleRuleInterpretation["date"],
): RelativeDateMode => {
  const facts =
    date === undefined
      ? { exists: false, requires: false, invalid: false, qualified: false }
      : {
          exists: true,
          requires: relativeScheduleDateRequiresContext(date),
          invalid: isSyntacticallyInvalidRelativeScheduleDate(date),
          qualified: isFullyQualifiedRelativeScheduleDate(date),
        };
  return (
    {
      "false-false-false-false": "none",
      "true-false-false-false": "none",
      "true-true-true-false": "invalid",
      "true-true-false-true": "qualified",
      "true-true-false-false": "unqualified",
    } as Record<string, RelativeDateMode>
  )[`${facts.exists}-${facts.requires}-${facts.invalid}-${facts.qualified}`];
};

const relativeDateContextOutcome = (input: {
  rule: ScheduleRuleInterpretation;
  calendarContext: ScheduleCalendarContext | undefined;
}): ScheduleRuleInterpretation | undefined => {
  const context = input.calendarContext;
  const handlers: Record<
    ScheduleCalendarContext["status"],
    () => ScheduleRuleInterpretation | undefined
  > = {
    supported: () => undefined,
    invalid: () =>
      calendarRule({
        rule: input.rule,
        startTime: undefined,
        status: "invalid",
        reason: "calendar-selection",
        evidenceId: context!.evidenceId,
        calendarContext: context,
      }),
    "missing-context": () =>
      calendarRule({
        rule: input.rule,
        startTime: undefined,
        status: "missing-context",
        reason: "calendar-selection",
        evidenceId: context!.evidenceId,
        calendarContext: context,
      }),
  };
  return context ? handlers[context.status]() : input.rule;
};

const relativeDateOutcome = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: ScheduleCalendarContext | undefined;
}): ScheduleRuleInterpretation | undefined => {
  const handlers: Record<
    RelativeDateMode,
    () => ScheduleRuleInterpretation | undefined
  > = {
    none: () => undefined,
    invalid: () =>
      calendarRule({
        ...input,
        status: "invalid",
        reason: "invalid-calendar-day",
        evidenceId: scheduleRuleEvidenceId({
          rule: input.rule,
          kind: "invalid",
        }),
      }),
    unqualified: () => input.rule,
    qualified: () => relativeDateContextOutcome(input),
  };
  return handlers[relativeDateMode(input.rule.date)]();
};

const unsupportedDateOutcome = (input: {
  rule: ScheduleRuleInterpretation;
}): ScheduleRuleInterpretation | undefined =>
  input.rule.date &&
  input.rule.status !== "supported" &&
  relativeDateMode(input.rule.date) === "none"
    ? input.rule
    : undefined;

const contextFailureDetails = (
  candidateResult: ScheduleDateCandidateResult,
): { status?: "invalid" | "missing-context"; evidenceId?: string } => {
  const key = [
    candidateResult.contextInvalid ?? false,
    candidateResult.contextMissing ?? false,
  ]
    .map(String)
    .join("-") as "true-false" | "false-true" | "false-false";
  return (
    {
      "true-false": {
        status: "invalid",
        evidenceId: "schedule:calendar:invalid-base-or-conflict:sdd",
      },
      "false-true": {
        status: "missing-context",
        evidenceId: "schedule:calendar:missing-context:calendar",
      },
      "false-false": {},
    } as const
  )[key];
};

const contextFailureRule = (input: {
  rule: ScheduleRuleInterpretation;
  contextParameters: AjsParameter[];
  candidateResult: ScheduleDateCandidateResult;
}): ScheduleRuleInterpretation | undefined => {
  const details = contextFailureDetails(input.candidateResult);
  const status = details.status;
  const evidenceId =
    input.candidateResult.contextEvidenceId ?? details.evidenceId;
  return status
    ? cloneSubstitutionRule(input.rule, {
        status,
        reason: "calendar-selection",
        evidence: {
          id: evidenceId!,
          rawParameters: input.contextParameters,
          rule: input.rule.rule,
        },
      })
    : undefined;
};

const invalidCandidateRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  candidateResult: ScheduleDateCandidateResult;
}): ScheduleRuleInterpretation | undefined =>
  input.candidateResult.invalid ||
  (input.candidateResult.candidates.length > 0 &&
    input.candidateResult.candidates.every(
      (candidate) => !toUtcDate(candidate),
    ))
    ? cloneSubstitutionRule(input.rule, {
        status: "invalid",
        reason: "invalid-calendar-day",
        evidence: {
          id: scheduleRuleEvidenceId({ rule: input.rule, kind: "invalid" }),
          rawParameters: [
            input.rule.parameter,
            ...startTimeParameter(input.startTime),
          ],
          rule: input.rule.rule,
        },
      })
    : undefined;

type StartTimeDecision = {
  failure?: ScheduleRuleInterpretation;
  supported?: SupportedStartTimeRule;
};

const startTimeDecision = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
}): StartTimeDecision => {
  const key = startTimeKind(input.startTime);
  const decisions: Record<string, StartTimeDecision> = {
    missing: {
      failure: cloneSubstitutionRule(input.rule, {
        status: "missing-context",
        reason: "missing-start-time",
        evidence: {
          id: scheduleRuleEvidenceId({
            rule: input.rule,
            kind: "missing-start-time",
          }),
          rawParameters: [
            input.rule.parameter,
            ...startTimeParameter(input.startTime),
          ],
          rule: input.rule.rule,
        },
      }),
    },
    unsupported: { failure: input.rule },
    supported: {
      supported: input.startTime as SupportedStartTimeRule,
    },
  };
  return decisions[key];
};

const startTimeKind = (
  startTime: ScheduleRuleInterpretation | undefined,
): "missing" | "unsupported" | "supported" => {
  if (startTime === undefined) {
    return "missing";
  }
  if (supportedStartTime(startTime)) {
    return "supported";
  }
  return "unsupported";
};

const supportedStartTime = (startTime: ScheduleRuleInterpretation): boolean =>
  startTime.status === "supported" && startTime.startTime !== undefined;

const candidatePreflight = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: ScheduleCalendarContext | undefined;
  candidatePeriod: ValidSchedulePeriod;
}): DatePreflight => {
  const candidateResult = resolveScheduleDateCandidates({
    parameter: input.rule.parameter,
    period: input.candidatePeriod,
    calendarContext: input.calendarContext,
  });
  const candidateFailure = candidateResult.deferred
    ? undefined
    : candidateFailureRule({ ...input, candidateResult });
  const startDecision = startTimeDecision(input);
  const startFailure = preflightStartFailure({
    candidateResult,
    candidateFailure,
    startFailure: startDecision.failure,
  });
  const returnedRule = preflightReturnedRule({
    rule: input.rule,
    candidateResult,
    candidateFailure,
    startFailure,
  });
  return returnedRule
    ? { kind: "return", rule: returnedRule }
    : {
        kind: "project",
        candidates: candidateResult.candidates,
        startTime: startDecision.supported!,
      };
};

const candidateFailureRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: ScheduleCalendarContext | undefined;
  candidateResult: ScheduleDateCandidateResult;
}): ScheduleRuleInterpretation | undefined => {
  const contextParameters = [
    input.rule.parameter,
    ...(input.calendarContext?.rawParameters ?? []),
  ];
  return (
    contextFailureRule({ ...input, contextParameters }) ??
    invalidCandidateRule(input)
  );
};

const preflightStartFailure = (input: {
  candidateResult: ScheduleDateCandidateResult;
  candidateFailure: ScheduleRuleInterpretation | undefined;
  startFailure: ScheduleRuleInterpretation | undefined;
}): ScheduleRuleInterpretation | undefined => {
  if (input.candidateResult.deferred || input.candidateFailure !== undefined) {
    return undefined;
  }
  return input.startFailure;
};

const preflightReturnedRule = (input: {
  rule: ScheduleRuleInterpretation;
  candidateResult: ScheduleDateCandidateResult;
  candidateFailure: ScheduleRuleInterpretation | undefined;
  startFailure: ScheduleRuleInterpretation | undefined;
}): ScheduleRuleInterpretation | undefined =>
  input.candidateResult.deferred
    ? input.rule
    : (input.candidateFailure ?? input.startFailure);

const datePreflight = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: ScheduleCalendarContext | undefined;
  candidatePeriod: ValidSchedulePeriod;
}): DatePreflight => {
  const preparedRule =
    relativeDateOutcome(input) ?? unsupportedDateOutcome(input);
  return preparedRule
    ? { kind: "return", rule: preparedRule }
    : candidatePreflight(input);
};

const isInvalidSubstitutionAssociation = (
  association: SubstitutionAssociation,
): boolean =>
  association.modeConflict ||
  association.invalidSh.length > 0 ||
  association.shiftDaysConflict ||
  association.invalidShiftDays.length > 0;

const noSubstitutionMode = (
  association: SubstitutionAssociation | undefined,
): boolean =>
  association === undefined ||
  association.mode === undefined ||
  association.mode === "no";

const unsupportedContextResolution = (
  context: SubstitutionProjectionContext,
): SubstitutionResolution | undefined =>
  context.status === "supported"
    ? undefined
    : {
        candidates: [],
        contextStatus: context.status,
        contextEvidenceId: context.evidenceId,
      };

const setupResolution = (input: {
  association: SubstitutionAssociation | undefined;
  calendarContext: SubstitutionProjectionContext | undefined;
}): SubstitutionResolution | undefined => {
  const association = input.association;
  const context = input.calendarContext;
  const resolutions = [
    {
      when: noSubstitutionMode(association),
      resolution: { candidates: [] },
    },
    {
      when:
        association !== undefined &&
        isInvalidSubstitutionAssociation(association),
      resolution: { candidates: [] },
    },
    {
      when: context === undefined,
      resolution: { candidates: [], contextStatus: "missing-context" as const },
    },
    {
      when: context !== undefined && context.status !== "supported",
      resolution: unsupportedContextResolution(context!),
    },
  ];
  return resolutions.find((candidate) => candidate.when)?.resolution;
};

const substitutionSetup = (input: {
  association: SubstitutionAssociation | undefined;
  calendarContext: SubstitutionProjectionContext | undefined;
}): ResolutionSetup => {
  const association = input.association;
  const resolution = setupResolution(input);
  return resolution
    ? { kind: "skip", resolution }
    : {
        kind: "ready",
        context: input.calendarContext!,
        mode: association!.mode!,
        shiftDays: association!.shiftDays ?? 2,
      };
};

type CandidateAccumulator = {
  candidates: string[];
  failure?: SubstitutionResolution;
};

const resolveCandidateList = (input: {
  candidates: string[];
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionProjectionContext;
}): CandidateAccumulator =>
  input.candidates.reduce<CandidateAccumulator>(
    (state, candidate) => appendCandidate({ state, input, candidate }),
    { candidates: [] },
  );

const appendCandidate = (input: {
  state: CandidateAccumulator;
  candidate: string;
  input: {
    candidates: string[];
    mode: SubstitutionMode;
    shiftDays: number;
    context: SubstitutionProjectionContext;
  };
}): CandidateAccumulator => {
  const result = resolveSubstitutionCandidate({
    ...input.input,
    candidate: input.candidate,
  });
  return input.state.failure
    ? input.state
    : candidateAccumulator({ state: input.state, result });
};

const candidateAccumulator = (input: {
  state: CandidateAccumulator;
  result: SubstitutionCandidateResolution;
}): CandidateAccumulator => {
  const candidates =
    input.result.candidate === undefined
      ? input.state.candidates
      : [...input.state.candidates, input.result.candidate];
  return input.result.failure
    ? { candidates: [], failure: input.result.failure }
    : { candidates };
};

/** Resolve closed-day substitution without changing candidate order or bounds. */
const resolveSubstitutedCandidates = (input: {
  candidates: string[];
  association: SubstitutionAssociation | undefined;
  calendarContext: SubstitutionProjectionContext | undefined;
}): SubstitutionResolution => {
  const setup = substitutionSetup(input);
  if (setup.kind === "skip") {
    return setup.resolution;
  }
  const result = resolveCandidateList({
    candidates: input.candidates,
    mode: setup.mode,
    shiftDays: setup.shiftDays,
    context: setup.context,
  });
  return result.failure ?? { candidates: result.candidates };
};

/** Project one interpreted unit over a schedule-owned half-open period. */
export const projectScheduleRuns = (
  input: ScheduleProjectionInput,
): ScheduleProjection => {
  const parsedPeriod = parsePeriod(input.period);
  const early = earlyProjection({
    interpretation: input.interpretation,
    period: input.period,
    parsedPeriod,
  });
  return (
    early ??
    projectValidatedSchedule({
      interpretation: input.interpretation,
      period: parsedPeriod!,
      calendarContext: input.calendarContext,
    })
  );
};
