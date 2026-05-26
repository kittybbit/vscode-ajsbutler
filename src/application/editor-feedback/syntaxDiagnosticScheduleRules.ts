import { parseScheduleDateValue } from "../../domain/models/parameters/scheduleRuleHelpers";
import type { Unit, UnitParameter } from "../../domain/values/Unit";
import { findParameters } from "./syntaxDiagnosticUnitLookup";

export const DEFAULT_SCHEDULE_LIMIT_YEAR = 2036;

export type ParsedExplicitScheduleRuleValue = {
  hasExplicitRuleNumber: boolean;
  ruleNumber: number;
  value: string;
};

export type ParsedExplicitScheduleDateValue = {
  hasExplicitRuleNumber: boolean;
  ruleNumber: number;
  year?: number;
  month?: number;
  dayValue: string;
};

export const parseExplicitScheduleRuleValue = (
  rawValue: string | undefined,
): ParsedExplicitScheduleRuleValue | undefined => {
  const matched = /^((\d{1,3}),)?(.+)$/.exec(rawValue ?? "");
  if (!matched) {
    return undefined;
  }

  return {
    hasExplicitRuleNumber: matched[2] !== undefined,
    ruleNumber: matched[2] === undefined ? 1 : Number(matched[2]),
    value: matched[3],
  };
};

export const isValidScheduleRuleNumber = (
  parsedValue: ParsedExplicitScheduleRuleValue | undefined,
): boolean =>
  parsedValue !== undefined &&
  (!parsedValue.hasExplicitRuleNumber ||
    (parsedValue.ruleNumber >= 1 && parsedValue.ruleNumber <= 144));

export const normalizeScheduleLimitYear = (
  scheduleLimitYear: number | undefined,
): number | undefined =>
  Number.isInteger(scheduleLimitYear) &&
  scheduleLimitYear !== undefined &&
  scheduleLimitYear >= 2036 &&
  scheduleLimitYear <= 2099
    ? scheduleLimitYear
    : undefined;

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
    year: yearMonthMatch?.[2] ? Number(yearMonthMatch[2]) : undefined,
    month: yearMonthMatch ? Number(yearMonthMatch[3]) : undefined,
    dayValue: parsed.day,
  };
};

export const getCalendarMonthDayLimit = (
  year: number | undefined,
  month: number | undefined,
): number => {
  if (month === undefined) {
    return 31;
  }

  if (year === undefined) {
    return month === 2 ? 29 : new Date(2000, month, 0).getDate();
  }

  return new Date(year, month, 0).getDate();
};

export const isValidScheduleDateYear = (
  year: number | undefined,
  scheduleLimitYear: number | undefined,
): boolean =>
  year === undefined ||
  (year >= 1994 &&
    (scheduleLimitYear === undefined || year <= scheduleLimitYear));

export const isValidScheduleDateMonth = (month: number | undefined): boolean =>
  month === undefined || (month >= 1 && month <= 12);

const isReservedScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  if (parsed.dayValue === "en") {
    return parsed.month === undefined;
  }

  if (parsed.dayValue === "ud") {
    return parsed.month === undefined;
  }

  return undefined;
};

const isExplicitCalendarDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  const explicitDayMatch = /^(\d{2})$/.exec(parsed.dayValue);
  if (!explicitDayMatch) {
    return undefined;
  }

  const day = Number(explicitDayMatch[1]);
  return day >= 1 && day <= getCalendarMonthDayLimit(parsed.year, parsed.month);
};

const isRelativeScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean | undefined => {
  const relativeDayMatch = /^([+*@])(\d{2})$/.exec(parsed.dayValue);
  if (!relativeDayMatch) {
    return undefined;
  }

  const day = Number(relativeDayMatch[2]);
  return day >= 1 && day <= 35;
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
  offset === undefined ||
  (offset >= 0 &&
    offset <= getBackwardScheduleDateOffsetLimit(parsed, direction));

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
  return (
    occurrence === undefined ||
    occurrence === "b" ||
    (Number(occurrence) >= 1 && Number(occurrence) <= 5)
  );
};

export const isValidScheduleDateDayToken = (
  parsed: ParsedExplicitScheduleDateValue,
): boolean =>
  [
    isReservedScheduleDateDayToken,
    isExplicitCalendarDayToken,
    isRelativeScheduleDateDayToken,
    isBackwardScheduleDateDayToken,
    isWeekdayScheduleDateDayToken,
  ].find((validateDayToken) => validateDayToken(parsed) !== undefined)?.(
    parsed,
  ) ?? false;

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

export const parseHourMinuteValue = (
  rawValue: string,
): { hours: number; minutes: number } | undefined => {
  const matched = /^\+?(\d{2}):(\d{2})$/.exec(rawValue);
  if (!matched) {
    return undefined;
  }

  return {
    hours: Number(matched[1]),
    minutes: Number(matched[2]),
  };
};

export const isValidHourMinuteRange = (rawValue: string): boolean => {
  const parsed = parseHourMinuteValue(rawValue);
  return (
    parsed !== undefined &&
    parsed.hours >= 0 &&
    parsed.hours <= 47 &&
    parsed.minutes >= 0 &&
    parsed.minutes <= 59
  );
};

export const isValidDelayMinutesRange = (rawValue: string): boolean => {
  const matched = /^[MCU](\d{1,4})$/.exec(rawValue);
  if (!matched) {
    return false;
  }

  const minutes = Number(matched[1]);
  return minutes >= 1 && minutes <= 2879;
};

export const isValidWaitMinutesRange = (rawValue: string): boolean => {
  if (!/^\d{1,4}$/.test(rawValue)) {
    return false;
  }

  const minutes = Number(rawValue);
  return minutes >= 1 && minutes <= 2879;
};

const parseValidExplicitScheduleRuleValue = (
  parameter: UnitParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  return isValidScheduleRuleNumber(parsed) && parsed !== undefined
    ? parsed
    : undefined;
};

const isExplicitNumberInRange = (
  rawValue: string,
  minimum: number,
  maximum: number,
): boolean =>
  /^\d{1,3}$/.test(rawValue) &&
  Number(rawValue) >= minimum &&
  Number(rawValue) <= maximum;

export const isValidExplicitParentScheduleRule = (
  parameter: UnitParameter,
  unit: Unit,
  rootUnits: readonly Unit[],
): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return (
    rootUnits.includes(unit) ||
    (parsed !== undefined && isExplicitNumberInRange(parsed.value, 1, 144))
  );
};

export const isValidExplicitStartTime = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  return (
    isValidScheduleRuleNumber(parsed) &&
    parsed !== undefined &&
    isValidHourMinuteRange(parsed.value)
  );
};

export const isValidExplicitCycle = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  const matched = /^\((\d{1,3}),([ymwd])\)$/.exec(parsed.value);
  if (!matched) {
    return false;
  }

  const cycle = Number(matched[1]);
  const unitType = matched[2];
  const maximumByUnit = {
    y: 10,
    m: 12,
    w: 5,
    d: 31,
  } as const;
  return cycle >= 1 && cycle <= maximumByUnit[unitType];
};

export const isExplicitWeeklyCycle = (
  parameter: UnitParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return undefined;
  }

  return /^\(\d{1,3},w\)$/.test(parsed.value) ? parsed : undefined;
};

export const usesOpenOrClosedDaySchedule = (
  parameter: UnitParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return undefined;
  }

  return /^((\d{4}\/)?\d{2}\/)?[*@]/.test(parsed.value) ? parsed : undefined;
};

export const hasInvalidExplicitWeeklyCycleScheduleCompatibility = (
  parameter: UnitParameter,
  unit: Unit,
): boolean => {
  const weeklyCycle = isExplicitWeeklyCycle(parameter);
  if (!weeklyCycle) {
    return false;
  }

  return findParameters(unit, "sd").some((scheduleDateParameter) => {
    const scheduleDate = usesOpenOrClosedDaySchedule(scheduleDateParameter);
    return scheduleDate?.ruleNumber === weeklyCycle.ruleNumber;
  });
};

export const isValidExplicitShiftDays = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  if (!/^\d{1,3}$/.test(parsed.value)) {
    return false;
  }

  const shiftDays = Number(parsed.value);
  return shiftDays >= 1 && shiftDays <= 31;
};

export const isValidOptionalOneToThirtyOne = (
  rawValue: string | undefined,
): boolean =>
  rawValue === undefined ||
  (/^\d{1,2}$/.test(rawValue) &&
    Number(rawValue) >= 1 &&
    Number(rawValue) <= 31);

const scheduleByDaysFromStartRules = {
  no: { maximumSegments: 1, boundedSegmentIndexes: [] },
  be: { maximumSegments: 3, boundedSegmentIndexes: [1, 2] },
  af: { maximumSegments: 3, boundedSegmentIndexes: [1, 2] },
  db: { maximumSegments: 2, boundedSegmentIndexes: [1] },
  da: { maximumSegments: 2, boundedSegmentIndexes: [1] },
} as const;

const isScheduleByDaysFromStartType = (
  rawValue: string,
): rawValue is keyof typeof scheduleByDaysFromStartRules =>
  rawValue in scheduleByDaysFromStartRules;

const hasNoEmptyScheduleByDaysFromStartSegments = (
  segments: readonly string[],
): boolean => segments.every((segment) => segment.length > 0);

const isValidScheduleByDaysFromStartSegments = (
  segments: readonly string[],
): boolean => {
  const scheduleType = segments[0];
  const rule = isScheduleByDaysFromStartType(scheduleType)
    ? scheduleByDaysFromStartRules[scheduleType]
    : undefined;
  return (
    rule !== undefined &&
    hasNoEmptyScheduleByDaysFromStartSegments(segments) &&
    segments.length <= rule.maximumSegments &&
    rule.boundedSegmentIndexes.every((index) =>
      isValidOptionalOneToThirtyOne(segments[index]),
    )
  );
};

export const isValidExplicitScheduleByDaysFromStart = (
  parameter: UnitParameter,
): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return (
    parsed !== undefined &&
    isValidScheduleByDaysFromStartSegments(parsed.value.split(","))
  );
};

export const isValidExplicitDelayTime = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  return (
    isValidHourMinuteRange(parsed.value) ||
    isValidDelayMinutesRange(parsed.value)
  );
};

export const isValidExplicitWaitCount = (parameter: UnitParameter): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return (
    parsed !== undefined &&
    (parsed.value === "no" ||
      parsed.value === "un" ||
      isExplicitNumberInRange(parsed.value, 1, 999))
  );
};

export const isValidExplicitWaitTime = (parameter: UnitParameter): boolean => {
  const parsed = parseExplicitScheduleRuleValue(parameter.value);
  if (!isValidScheduleRuleNumber(parsed) || parsed === undefined) {
    return false;
  }

  return (
    parsed.value === "no" ||
    parsed.value === "un" ||
    isValidHourMinuteRange(parsed.value) ||
    isValidWaitMinutesRange(parsed.value)
  );
};
