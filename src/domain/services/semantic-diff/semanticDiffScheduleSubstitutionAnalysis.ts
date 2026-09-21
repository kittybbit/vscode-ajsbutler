import type { AjsParameter } from "../../models/ajs/AjsDocument";
import { classifyScheduleCalendarDay } from "./semanticDiffScheduleCalendarContext";
import type { SemanticDiffScheduleCalendarDayResult } from "./semanticDiffScheduleCalendarTypes";
import { formatScheduleDate, toUtcDate } from "../../schedule/ScheduleDate";
import {
  parseClosedDaySubstitutionValue,
  parseShiftDaysValue,
} from "../../schedule/ScheduleRule";
import type {
  ScheduleInterpretation,
  ScheduleRuleInterpretation,
} from "../../schedule/ScheduleInterpretation";

export type SubstitutionMode = "be" | "af" | "ca" | "no";

export type SubstitutionResolution = {
  candidates: string[];
  contextStatus?: "invalid" | "missing-context";
  contextEvidenceId?: string;
};

export type ParsedSubstitutionRule = {
  interpretationRule: ScheduleRuleInterpretation;
  value: SubstitutionMode;
  rule: number;
};

export type ParsedShiftDaysRule = {
  interpretationRule: ScheduleRuleInterpretation;
  value: number;
  rule: number;
  rawValue?: string;
};

export type SubstitutionAssociation = {
  sh: ParsedSubstitutionRule[];
  invalidSh: ScheduleRuleInterpretation[];
  shd: ParsedShiftDaysRule[];
  invalidShiftDays: ParsedShiftDaysRule[];
  mode?: SubstitutionMode;
  modeConflict: boolean;
  shiftDays?: number;
  shiftDaysConflict: boolean;
};

export type SubstitutionRuleState = {
  status: ScheduleRuleInterpretation["status"];
  reason?: ScheduleRuleInterpretation["reason"];
  evidenceId: string;
  rawParameters: AjsParameter[];
  rule?: number;
};

export type SubstitutionAnalysis = {
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

export const substitutionState = (input: {
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
  const result: SemanticDiffScheduleCalendarDayResult =
    classifyScheduleCalendarDay(context, date);
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
export const resolveSubstitutionCandidate = (input: {
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

export const createSubstitutionAnalysis = (
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

export const hasScheduleSubstitution = (input: SubstitutionAnalysis): boolean =>
  [...input.associations.entries()].some(
    ([ruleNumber, association]) =>
      input.fullyQualifiedDateRules.has(ruleNumber) &&
      association.sh.some((rule) => rule.value !== "no"),
  );
