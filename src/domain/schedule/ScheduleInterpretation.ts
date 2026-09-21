import {
  findAjsUnitParameters,
  type AjsParameter,
  type AjsUnit,
} from "../models/ajs/AjsDocument";
import {
  interpretScheduleDateValue,
  type ScheduleDateDay,
} from "./ScheduleDate";
import {
  parseClosedDaySubstitutionValue,
  parseCycleValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseShiftDaysValue,
  parseStartTimeValue,
  type ParsedRuleValue,
} from "./ScheduleRule";

export type ScheduleStatus =
  | "supported"
  | "no-runs"
  | "invalid"
  | "unsupported"
  | "missing-context";

export type ScheduleUnsupportedReason =
  | "cycle-schedule"
  | "closed-day-substitution"
  | "shift-days"
  | "calendar-selection"
  | "inherited-parent-rule"
  | "days-from-start"
  | "invalid-start-time"
  | "unpaired-start-time"
  | "unsupported-schedule-date"
  | "missing-start-time"
  | "invalid-calendar-day";

export type ScheduleEvidence = {
  id: string;
  rawParameters: AjsParameter[];
  rule?: number;
};

type ParsedScheduleDate = NonNullable<
  ReturnType<typeof interpretScheduleDateValue>
>;

export type ScheduleRuleInterpretation = {
  parameter: AjsParameter;
  rule?: number;
  status: ScheduleStatus;
  reason?: ScheduleUnsupportedReason;
  evidence: ScheduleEvidence;
  date?: ParsedScheduleDate;
  startTime?: ParsedRuleValue;
};

export type ScheduleInterpretation = {
  unit: AjsUnit;
  rules: ScheduleRuleInterpretation[];
  scheduleDateRules: ScheduleRuleInterpretation[];
  startTimeRules: ScheduleRuleInterpretation[];
  hasRuleZeroUndefined: boolean;
};

type ScheduleRuleEvidenceInput = {
  parameter: AjsParameter;
  id: string;
  rule?: number;
  rawParameters?: AjsParameter[];
};

type ScheduleRuleResultInput = {
  parameter: AjsParameter;
  status: ScheduleStatus;
  id: string;
  rule?: number;
  reason?: ScheduleUnsupportedReason;
  date?: ParsedScheduleDate;
  startTime?: ParsedRuleValue;
  rawParameters?: AjsParameter[];
};

const withRule = (rule: number | undefined): { rule?: number } =>
  rule === undefined ? {} : { rule };

const withReason = (
  reason: ScheduleUnsupportedReason | undefined,
): { reason?: ScheduleUnsupportedReason } =>
  reason === undefined ? {} : { reason };

const withDate = (
  date: ParsedScheduleDate | undefined,
): { date?: ParsedScheduleDate } => (date === undefined ? {} : { date });

const withStartTime = (
  startTime: ParsedRuleValue | undefined,
): { startTime?: ParsedRuleValue } =>
  startTime === undefined ? {} : { startTime };

const createScheduleRuleEvidence = (
  input: ScheduleRuleEvidenceInput,
): ScheduleEvidence => ({
  id: input.id,
  rawParameters: [...(input.rawParameters ?? [input.parameter])],
  ...withRule(input.rule),
});

const createScheduleRuleResult = (
  input: ScheduleRuleResultInput,
): ScheduleRuleInterpretation => ({
  parameter: input.parameter,
  ...withRule(input.rule),
  status: input.status,
  ...withReason(input.reason),
  evidence: createScheduleRuleEvidence({
    parameter: input.parameter,
    id: input.id,
    rule: input.rule,
    rawParameters: input.rawParameters,
  }),
  ...withDate(input.date),
  ...withStartTime(input.startTime),
});

const hasAbsoluteMonth = (
  date: ParsedScheduleDate | undefined,
): date is ParsedScheduleDate => {
  if (!date) {
    return false;
  }
  return date.year !== undefined && date.month !== undefined;
};

const calendarIndependentEvidenceRules: ReadonlyArray<{
  matches: (day: ScheduleDateDay) => boolean;
  id: string;
}> = [
  {
    matches: (day) => day.kind === "backward" && day.prefix === undefined,
    id: "JP1-PARAM-SCHEDULE-MONTH-END-001",
  },
  {
    matches: (day) => day.kind === "weekday" && day.prefix === "",
    id: "JP1-PARAM-SCHEDULE-WEEKDAY-001",
  },
];

const calendarIndependentDateEvidence = (
  date: ReturnType<typeof interpretScheduleDateValue>,
): string | undefined => {
  if (!hasAbsoluteMonth(date)) {
    return undefined;
  }
  return calendarIndependentEvidenceRules.find((rule) => rule.matches(date.day))
    ?.id;
};

const openClosedDayKinds = new Set<ScheduleDateDay["kind"]>(["open", "closed"]);
const openClosedBackwardPrefixes = new Set(["*", "@"]);

const isOpenOrClosedDay = (day: ScheduleDateDay): boolean =>
  openClosedDayKinds.has(day.kind) ||
  (day.kind === "backward" && openClosedBackwardPrefixes.has(day.prefix ?? ""));

const isRelativeDay = (day: ScheduleDateDay): boolean =>
  day.kind === "relative" ||
  (day.kind === "backward" && day.prefix === "+") ||
  (day.kind === "weekday" && day.prefix === "+");

const relativeEvidenceRules: ReadonlyArray<{
  matches: (day: ScheduleDateDay) => boolean;
  id: string;
}> = [
  {
    matches: isOpenOrClosedDay,
    id: "JP1-PARAM-SCHEDULE-OPEN-CLOSED-001",
  },
  { matches: isRelativeDay, id: "JP1-PARAM-SCHEDULE-RELATIVE-001" },
];

const relativeDateEvidence = (
  date: ReturnType<typeof interpretScheduleDateValue>,
): string | undefined => {
  if (!hasAbsoluteMonth(date)) {
    return undefined;
  }
  return relativeEvidenceRules.find((rule) => rule.matches(date.day))?.id;
};

const unsupportedParameterEvidence = (parameter: AjsParameter): string =>
  `schedule:${parameter.key}:unsupported:${parameter.value}`;

const invalidParameterEvidence = (
  parameter: AjsParameter,
  rule?: number,
): string =>
  `schedule:${parameter.key}:invalid:${rule === undefined ? parameter.value : rule}`;

type DateRuleClassification = Pick<
  ScheduleRuleResultInput,
  "status" | "id" | "reason"
>;

const undefinedDateRuleClassification = (
  date: ParsedScheduleDate,
): DateRuleClassification =>
  date.rule === 0
    ? { status: "no-runs", id: "JP1-PARAM-SCHEDULE-UD-001" }
    : {
        status: "invalid",
        id: `schedule:sd:ud-nonzero-invalid:${date.rule}`,
        reason: "unsupported-schedule-date",
      };

const calendarIndependentDateRuleClassification = (
  date: ParsedScheduleDate,
): DateRuleClassification | undefined => {
  const id = calendarIndependentDateEvidence(date);
  return id === undefined ? undefined : { status: "supported", id };
};

const relativeDateRuleClassification = (
  date: ParsedScheduleDate,
): DateRuleClassification | undefined => {
  const id = relativeDateEvidence(date);
  return id === undefined
    ? undefined
    : {
        status: "unsupported",
        id,
        reason: "unsupported-schedule-date",
      };
};

const fallbackDateRuleClassification = (
  date: ParsedScheduleDate,
): DateRuleClassification =>
  date.day.kind === "calendar"
    ? { status: "supported", id: `schedule:sd:supported:${date.rule}` }
    : {
        status: "unsupported",
        id: `schedule:sd:unsupported:${date.rule}`,
        reason: "unsupported-schedule-date",
      };

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const classifyScheduleDateRule = (
  date: ParsedScheduleDate,
): DateRuleClassification => {
  const classifications = [
    date.day.kind === "ud" ? undefinedDateRuleClassification(date) : undefined,
    calendarIndependentDateRuleClassification(date),
    relativeDateRuleClassification(date),
    fallbackDateRuleClassification(date),
  ];
  return classifications.find(isDefined) as DateRuleClassification;
};

const interpretScheduleDateRule = (
  parameter: AjsParameter,
): ScheduleRuleInterpretation => {
  const date = interpretScheduleDateValue(parameter.value);
  if (!date) {
    return createScheduleRuleResult({
      parameter,
      status: "unsupported",
      id: unsupportedParameterEvidence(parameter),
      reason: "unsupported-schedule-date",
    });
  }
  return createScheduleRuleResult({
    parameter,
    ...classifyScheduleDateRule(date),
    rule: date.rule,
    date,
  });
};

const hasStartTimeFormat = (
  parsed: ParsedRuleValue | undefined,
): parsed is ParsedRuleValue =>
  parsed !== undefined && /^\d{2}:\d{2}$/.test(parsed.value);

const hasValidClockRange = (parsed: ParsedRuleValue): boolean => {
  const [hours, minutes] = parsed.value.split(":").map(Number);
  return hours < 24 && minutes < 60;
};

const isValidStartTime = (
  parsed: ParsedRuleValue | undefined,
): parsed is ParsedRuleValue =>
  hasStartTimeFormat(parsed) && hasValidClockRange(parsed);

type StartTimeClassification = Pick<
  ScheduleRuleResultInput,
  "status" | "id" | "reason"
>;

const classifyStartTime = (
  parameter: AjsParameter,
  parsed: ParsedRuleValue | undefined,
): StartTimeClassification => {
  const parsedRule = parsed === undefined ? undefined : parsed.rule;
  return isValidStartTime(parsed)
    ? { status: "supported", id: `schedule:st:supported:${parsed.rule}` }
    : {
        status: "invalid",
        id: invalidParameterEvidence(parameter, parsedRule),
        reason: "invalid-start-time",
      };
};

const interpretStartTimeRule = (
  parameter: AjsParameter,
): ScheduleRuleInterpretation => {
  const parsed = parseStartTimeValue(parameter.value);
  return createScheduleRuleResult({
    parameter,
    ...classifyStartTime(parameter, parsed),
    rule: parsed?.rule,
    startTime: parsed,
  });
};

type UnsupportedParameterParser = (
  rawValue: string | undefined,
) => { rule: number } | undefined;

type UnsupportedParameterHandler = {
  reason: ScheduleUnsupportedReason;
  parse: UnsupportedParameterParser;
};

const unsupportedParameterHandlers: ReadonlyMap<
  string,
  UnsupportedParameterHandler
> = new Map([
  ["cy", { reason: "cycle-schedule", parse: parseCycleValue }],
  [
    "sh",
    {
      reason: "closed-day-substitution",
      parse: parseClosedDaySubstitutionValue,
    },
  ],
  ["shd", { reason: "shift-days", parse: parseShiftDaysValue }],
  ["jc", { reason: "calendar-selection", parse: () => undefined }],
  [
    "ln",
    {
      reason: "inherited-parent-rule",
      parse: parseParentScheduleRuleValue,
    },
  ],
  [
    "cftd",
    {
      reason: "days-from-start",
      parse: parseScheduleByDaysFromStartValue,
    },
  ],
]);

const interpretUnsupportedParameter = (
  parameter: AjsParameter,
): ScheduleRuleInterpretation | undefined => {
  const handler = unsupportedParameterHandlers.get(parameter.key);
  if (!handler) {
    return undefined;
  }
  const parsed = handler.parse(parameter.value);
  return createScheduleRuleResult({
    parameter,
    status: "unsupported",
    id: unsupportedParameterEvidence(parameter),
    rule: parsed?.rule,
    reason: handler.reason,
  });
};

const isUnpairedStartTime = (
  result: ScheduleRuleInterpretation,
  scheduleRules: Set<number>,
): boolean =>
  result.status === "supported" &&
  result.rule !== undefined &&
  !scheduleRules.has(result.rule);

const withUnpairedStartTime = (
  result: ScheduleRuleInterpretation,
  scheduleRules: Set<number>,
): ScheduleRuleInterpretation =>
  isUnpairedStartTime(result, scheduleRules)
    ? createScheduleRuleResult({
        parameter: result.parameter,
        status: "invalid",
        id: `schedule:st:unpaired:${result.rule}`,
        rule: result.rule,
        reason: "unpaired-start-time",
        startTime: result.startTime,
      })
    : result;

/** Interpret one normalized unit without reading a comparison period. */
export const interpretSchedule = (
  input: AjsUnit | { unit: AjsUnit },
): ScheduleInterpretation => {
  const unit = "unit" in input ? input.unit : input;
  const scheduleDateRules = findAjsUnitParameters(unit, "sd").map(
    interpretScheduleDateRule,
  );
  const dateRuleNumbers = new Set(
    scheduleDateRules
      .map((rule) => rule.rule)
      .filter((rule): rule is number => rule !== undefined),
  );
  const startTimeRules = findAjsUnitParameters(unit, "st").map((parameter) =>
    withUnpairedStartTime(interpretStartTimeRule(parameter), dateRuleNumbers),
  );
  const otherRules = unit.parameters
    .map(interpretUnsupportedParameter)
    .filter((rule): rule is ScheduleRuleInterpretation => rule !== undefined);
  const rules = [...scheduleDateRules, ...startTimeRules, ...otherRules];
  return {
    unit,
    rules,
    scheduleDateRules,
    startTimeRules,
    hasRuleZeroUndefined: scheduleDateRules.some(
      (rule) => rule.status === "no-runs" && rule.rule === 0,
    ),
  };
};
