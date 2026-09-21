import type { AjsParameter } from "../../models/ajs/AjsDocument";
import { interpretScheduleDateValue } from "../../schedule/ScheduleDate";
import {
  parseCycleValue,
  parseClosedDaySubstitutionValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseShiftDaysValue,
  parseStartTimeValue,
  type ParsedRuleValue,
} from "../../schedule/ScheduleRule";
import {
  calendarIndependentDateEvidence,
  createScheduleRuleResult,
  relativeDateEvidence,
  type ScheduleRuleResultInput,
} from "./semanticDiffScheduleRuleEvidence";
import type {
  SemanticDiffScheduleRuleInterpretation,
  SemanticDiffScheduleUnsupportedReason,
} from "./semanticDiffScheduleTypes";

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
  date: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
): DateRuleClassification =>
  date.rule === 0
    ? { status: "no-runs", id: "JP1-PARAM-SCHEDULE-UD-001" }
    : {
        status: "invalid",
        id: `schedule:sd:ud-nonzero-invalid:${date.rule}`,
        reason: "unsupported-schedule-date",
      };

const calendarIndependentDateRuleClassification = (
  date: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
): DateRuleClassification | undefined => {
  const id = calendarIndependentDateEvidence(date);
  return id === undefined ? undefined : { status: "supported", id };
};

const relativeDateRuleClassification = (
  date: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
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
  date: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
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
  date: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
): DateRuleClassification => {
  const classifications = [
    date.day.kind === "ud" ? undefinedDateRuleClassification(date) : undefined,
    calendarIndependentDateRuleClassification(date),
    relativeDateRuleClassification(date),
    fallbackDateRuleClassification(date),
  ];
  return classifications.find(isDefined) as DateRuleClassification;
};

export const interpretScheduleDateRule = (
  parameter: AjsParameter,
): SemanticDiffScheduleRuleInterpretation => {
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

export const interpretStartTimeRule = (
  parameter: AjsParameter,
): SemanticDiffScheduleRuleInterpretation => {
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
  reason: SemanticDiffScheduleUnsupportedReason;
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

export const interpretUnsupportedParameter = (
  parameter: AjsParameter,
): SemanticDiffScheduleRuleInterpretation | undefined => {
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
  result: SemanticDiffScheduleRuleInterpretation,
  scheduleRules: Set<number>,
): boolean =>
  result.status === "supported" &&
  result.rule !== undefined &&
  !scheduleRules.has(result.rule);

export const withUnpairedStartTime = (
  result: SemanticDiffScheduleRuleInterpretation,
  scheduleRules: Set<number>,
): SemanticDiffScheduleRuleInterpretation =>
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
