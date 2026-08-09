import type { AjsParameter } from "../../models/ajs/AjsDocument";
import {
  interpretScheduleDateValue,
  type ScheduleDateDay,
} from "../../models/parameters/scheduleDateInterpreter";

export type ParsedExplicitScheduleDateValue = {
  hasExplicitRuleNumber: boolean;
  ruleNumber: number;
  year?: number;
  month?: number;
  dayValue: string;
  day: ScheduleDateDay;
};

const isNumberInRange = (
  value: number,
  minimum: number,
  maximum: number,
): boolean => value >= minimum && value <= maximum;

const isOptionalNumberInRange = (
  value: number | undefined,
  minimum: number,
  maximum: number,
): boolean => value === undefined || isNumberInRange(value, minimum, maximum);

export const parseExplicitScheduleDateDiagnosticValue = (
  rawValue: string | undefined,
): ParsedExplicitScheduleDateValue | undefined => {
  const parsed = interpretScheduleDateValue(rawValue);
  if (!parsed) {
    return undefined;
  }

  return {
    hasExplicitRuleNumber: parsed.hasExplicitRuleNumber,
    ruleNumber: parsed.rule,
    year: parsed.year,
    month: parsed.month,
    dayValue: parsed.dayValue,
    day: parsed.day,
  };
};

export const getCalendarMonthDayLimit = (
  year: number | undefined,
  month: number | undefined,
): number =>
  month === undefined ? 31 : new Date(year ?? 2020, month, 0).getDate();

export const isValidScheduleDateYear = (
  year: number | undefined,
  scheduleLimitYear: number | undefined,
): boolean =>
  year === undefined ||
  (isNumberInRange(year, 1994, scheduleLimitYear ?? year) &&
    isOptionalNumberInRange(scheduleLimitYear, year, scheduleLimitYear));

export const isValidScheduleDateMonth = (month: number | undefined): boolean =>
  isOptionalNumberInRange(month, 1, 12);

type ScheduleDateDayTokenValidator = (
  parsed: ParsedExplicitScheduleDateValue,
) => boolean | undefined;

const isReservedScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined =>
  parsed.day.kind === "en" || parsed.day.kind === "ud"
    ? parsed.month === undefined
    : undefined;

const isExplicitCalendarDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  if (parsed.day.kind !== "calendar") {
    return undefined;
  }

  return isNumberInRange(
    parsed.day.value,
    1,
    getCalendarMonthDayLimit(parsed.year, parsed.month),
  );
};

const isRelativeScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  if (
    parsed.day.kind !== "relative" &&
    parsed.day.kind !== "open" &&
    parsed.day.kind !== "closed"
  ) {
    return undefined;
  }

  return isNumberInRange(parsed.day.value, 1, 35);
};

const getBackwardScheduleDateOffsetLimit = (
  parsed: ParsedExplicitScheduleDateValue,
  prefix: "+" | "*" | "@" | undefined,
): number =>
  prefix ? 34 : getCalendarMonthDayLimit(parsed.year, parsed.month) - 1;

const isValidBackwardScheduleDateOffset = (
  parsed: ParsedExplicitScheduleDateValue,
  offset: number | undefined,
  prefix: "+" | "*" | "@" | undefined,
): boolean =>
  isOptionalNumberInRange(
    offset,
    0,
    getBackwardScheduleDateOffsetLimit(parsed, prefix),
  );

const isBackwardScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  if (parsed.day.kind !== "backward") {
    return undefined;
  }

  return isValidBackwardScheduleDateOffset(
    parsed,
    parsed.day.offset,
    parsed.day.prefix,
  );
};

const isWeekdayScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  if (parsed.day.kind !== "weekday" || parsed.day.prefix !== "+") {
    return undefined;
  }

  const occurrence = parsed.day.occurrence;
  return (
    occurrence === undefined ||
    occurrence === "b" ||
    (typeof occurrence === "number" && isNumberInRange(occurrence, 1, 5))
  );
};

const scheduleDateDayTokenValidators: readonly ScheduleDateDayTokenValidator[] =
  [
    isReservedScheduleDateDayToken,
    isExplicitCalendarDayToken,
    isRelativeScheduleDateDayToken,
    isBackwardScheduleDateDayToken,
    isWeekdayScheduleDateDayToken,
  ];

export const isValidScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean =>
  scheduleDateDayTokenValidators
    .map((validateDayToken) => validateDayToken(parsed))
    .find((result) => result !== undefined) ?? false;

const isValidUserDefinedScheduleDate = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean =>
  parsed.hasExplicitRuleNumber &&
  parsed.ruleNumber === 0 &&
  parsed.day.kind === "ud" &&
  parsed.month === undefined;

const isValidExplicitScheduleDateRuleNumber = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean =>
  !parsed.hasExplicitRuleNumber ||
  (parsed.ruleNumber >= 1 && parsed.ruleNumber <= 144);

const isValidExplicitScheduleDateFields = (
  parsed: ParsedExplicitScheduleDateValue,
  scheduleLimitYear: number | undefined,
): boolean =>
  isValidScheduleDateMonth(parsed.month) &&
  isValidScheduleDateYear(parsed.year, scheduleLimitYear) &&
  isValidScheduleDateDayToken(parsed);

export const isValidExplicitScheduleDate = (
  parameter: AjsParameter,
  scheduleLimitYear: number | undefined,
): boolean => {
  const parsed = parseExplicitScheduleDateDiagnosticValue(parameter.value);
  return (
    parsed !== undefined &&
    (parsed.day.kind === "ud"
      ? isValidUserDefinedScheduleDate(parsed)
      : isValidExplicitScheduleDateRuleNumber(parsed) &&
        isValidExplicitScheduleDateFields(parsed, scheduleLimitYear))
  );
};
