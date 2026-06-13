import { parseScheduleDateValue } from "../../domain/models/parameters/scheduleRuleHelpers";
import type { UnitParameter } from "../../domain/values/Unit";

export type ParsedExplicitScheduleDateValue = {
  hasExplicitRuleNumber: boolean;
  ruleNumber: number;
  year?: number;
  month?: number;
  dayValue: string;
};

const toOptionalNumber = (rawValue: string | undefined): number | undefined =>
  rawValue === undefined ? undefined : Number(rawValue);

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
  const parsed = parseScheduleDateValue(rawValue);
  if (!parsed?.day) {
    return undefined;
  }

  const yearMonthMatch = /^((\d{4})\/)?(\d{2})\/$/.exec(parsed.yearMonth ?? "");
  return {
    hasExplicitRuleNumber: /^\d{1,3},/.test(rawValue ?? ""),
    ruleNumber: parsed.rule,
    year: toOptionalNumber(yearMonthMatch?.[2]),
    month: toOptionalNumber(yearMonthMatch?.[3]),
    dayValue: parsed.day,
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

const reservedScheduleDateDayTokens = new Set(["en", "ud"]);

type ScheduleDateDayTokenValidator = (
  parsed: ParsedExplicitScheduleDateValue,
) => boolean | undefined;

const toMatchedNumber = (
  pattern: RegExp,
  value: string,
  groupIndex: number,
): number | undefined => {
  const matched = pattern.exec(value);
  return matched ? Number(matched[groupIndex]) : undefined;
};

const isReservedScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined =>
  reservedScheduleDateDayTokens.has(parsed.dayValue)
    ? parsed.month === undefined
    : undefined;

const isExplicitCalendarDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  const day = toMatchedNumber(/^(\d{2})$/, parsed.dayValue, 1);
  if (day === undefined) {
    return undefined;
  }

  return isNumberInRange(
    day,
    1,
    getCalendarMonthDayLimit(parsed.year, parsed.month),
  );
};

const isRelativeScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  const day = toMatchedNumber(/^([+*@])(\d{2})$/, parsed.dayValue, 2);
  if (day === undefined) {
    return undefined;
  }

  return isNumberInRange(day, 1, 35);
};

const getBackwardScheduleDateOffsetLimit = (
  parsed: ParsedExplicitScheduleDateValue,
  direction: string | undefined,
): number =>
  direction ? 34 : getCalendarMonthDayLimit(parsed.year, parsed.month) - 1;

const isValidBackwardScheduleDateOffset = (
  parsed: ParsedExplicitScheduleDateValue,
  offset: number | undefined,
  direction: string | undefined,
): boolean =>
  isOptionalNumberInRange(
    offset,
    0,
    getBackwardScheduleDateOffsetLimit(parsed, direction),
  );

const isBackwardScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  const backwardDayMatch = /^([+*@])?b(?:-(\d{2}))?$/.exec(parsed.dayValue);
  if (!backwardDayMatch) {
    return undefined;
  }

  const direction = backwardDayMatch[1];
  const offset = backwardDayMatch[2] ? Number(backwardDayMatch[2]) : undefined;

  return isValidBackwardScheduleDateOffset(parsed, offset, direction);
};

const isWeekdayScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  const weekdayMatch = /^\+(su|mo|tu|we|th|fr|sa)(?::(\d|b))?$/.exec(
    parsed.dayValue,
  );
  if (!weekdayMatch) {
    return undefined;
  }

  const occurrence = weekdayMatch[2];
  return occurrence === undefined || /^[1-5b]$/.test(occurrence);
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
  parameter: UnitParameter,
  scheduleLimitYear: number | undefined,
): boolean => {
  const parsed = parseExplicitScheduleDateDiagnosticValue(parameter.value);
  return (
    parsed !== undefined &&
    (parsed.dayValue === "ud"
      ? isValidUserDefinedScheduleDate(parsed)
      : isValidExplicitScheduleDateRuleNumber(parsed) &&
        isValidExplicitScheduleDateFields(parsed, scheduleLimitYear))
  );
};
