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
    isNumberInRange(parsedValue.ruleNumber, 1, 144));

export const normalizeScheduleLimitYear = (
  scheduleLimitYear: number | undefined,
): number | undefined =>
  Number.isInteger(scheduleLimitYear) &&
  scheduleLimitYear !== undefined &&
  isNumberInRange(scheduleLimitYear, 2036, 2099)
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
    isNumberInRange(parsed.hours, 0, 47) &&
    isNumberInRange(parsed.minutes, 0, 59)
  );
};

const isValidMinuteRangeValue = (
  rawValue: string,
  pattern: RegExp,
): boolean => {
  const matched = pattern.exec(rawValue);
  if (!matched) {
    return false;
  }

  const minutes = Number(matched[1]);
  return isNumberInRange(minutes, 1, 2879);
};

export const isValidDelayMinutesRange = (rawValue: string): boolean =>
  isValidMinuteRangeValue(rawValue, /^[MCU](\d{1,4})$/);

export const isValidWaitMinutesRange = (rawValue: string): boolean =>
  isValidMinuteRangeValue(rawValue, /^(\d{1,4})$/);

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
  isNumberInRange(Number(rawValue), minimum, maximum);

const maximumExplicitCycleByUnit = {
  y: 10,
  m: 12,
  w: 5,
  d: 31,
} as const;

type ExplicitCycleUnit = keyof typeof maximumExplicitCycleByUnit;

type ExplicitScheduleRuleValueValidator = (rawValue: string) => boolean;

const isExplicitCycleUnit = (
  rawValue: string | undefined,
): rawValue is ExplicitCycleUnit =>
  rawValue !== undefined && rawValue in maximumExplicitCycleByUnit;

const parseExplicitCycleValue = (
  rawValue: string,
): { cycle: number; unitType: ExplicitCycleUnit } | undefined => {
  const matched = /^\((\d{1,3}),([ymwd])\)$/.exec(rawValue);
  if (!isExplicitCycleUnit(matched?.[2])) {
    return undefined;
  }

  return {
    cycle: Number(matched[1]),
    unitType: matched[2],
  };
};

const isWeeklyCycleValue = (rawValue: string): boolean =>
  parseExplicitCycleValue(rawValue)?.unitType === "w";

const isOpenOrClosedDayScheduleValue = (rawValue: string): boolean =>
  /^((\d{4}\/)?\d{2}\/)?[*@]/.test(rawValue);

const parseMatchingExplicitScheduleRuleValue = (
  parameter: UnitParameter,
  matchesValue: (rawValue: string) => boolean,
): ParsedExplicitScheduleRuleValue | undefined => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return parsed !== undefined && matchesValue(parsed.value)
    ? parsed
    : undefined;
};

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
  return hasValidExplicitScheduleRuleValue(parameter, [isValidHourMinuteRange]);
};

export const isValidExplicitCycle = (parameter: UnitParameter): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  const cycle = parsed ? parseExplicitCycleValue(parsed.value) : undefined;
  return (
    cycle !== undefined &&
    isNumberInRange(cycle.cycle, 1, maximumExplicitCycleByUnit[cycle.unitType])
  );
};

export const isExplicitWeeklyCycle = (
  parameter: UnitParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  return parseMatchingExplicitScheduleRuleValue(parameter, isWeeklyCycleValue);
};

export const usesOpenOrClosedDaySchedule = (
  parameter: UnitParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  return parseMatchingExplicitScheduleRuleValue(
    parameter,
    isOpenOrClosedDayScheduleValue,
  );
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
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return parsed !== undefined && isExplicitNumberInRange(parsed.value, 1, 31);
};

export const isValidOptionalOneToThirtyOne = (
  rawValue: string | undefined,
): boolean =>
  rawValue === undefined ||
  (/^\d{1,2}$/.test(rawValue) && isNumberInRange(Number(rawValue), 1, 31));

const scheduleByDaysFromStartRules = {
  no: { maximumSegments: 1, boundedSegmentIndexes: [] },
  be: { maximumSegments: 3, boundedSegmentIndexes: [1, 2] },
  af: { maximumSegments: 3, boundedSegmentIndexes: [1, 2] },
  db: { maximumSegments: 2, boundedSegmentIndexes: [1] },
  da: { maximumSegments: 2, boundedSegmentIndexes: [1] },
} as const;

type ScheduleByDaysFromStartType = keyof typeof scheduleByDaysFromStartRules;
type ScheduleByDaysFromStartRule =
  (typeof scheduleByDaysFromStartRules)[ScheduleByDaysFromStartType];

const isScheduleByDaysFromStartType = (
  rawValue: string,
): rawValue is ScheduleByDaysFromStartType =>
  rawValue in scheduleByDaysFromStartRules;

const scheduleByDaysFromStartRuleFor = (
  rawValue: string,
): ScheduleByDaysFromStartRule | undefined =>
  isScheduleByDaysFromStartType(rawValue)
    ? scheduleByDaysFromStartRules[rawValue]
    : undefined;

const hasNoEmptyScheduleByDaysFromStartSegments = (
  segments: readonly string[],
): boolean => segments.every((segment) => segment.length > 0);

const hasValidScheduleByDaysFromStartSegmentCount = (
  segments: readonly string[],
  rule: ScheduleByDaysFromStartRule,
): boolean => segments.length <= rule.maximumSegments;

const hasValidScheduleByDaysFromStartBounds = (
  segments: readonly string[],
  rule: ScheduleByDaysFromStartRule,
): boolean =>
  rule.boundedSegmentIndexes.every((index) =>
    isValidOptionalOneToThirtyOne(segments[index]),
  );

const isValidScheduleByDaysFromStartSegments = (
  segments: readonly string[],
): boolean => {
  const rule = scheduleByDaysFromStartRuleFor(segments[0]);
  return (
    rule !== undefined &&
    hasNoEmptyScheduleByDaysFromStartSegments(segments) &&
    hasValidScheduleByDaysFromStartSegmentCount(segments, rule) &&
    hasValidScheduleByDaysFromStartBounds(segments, rule)
  );
};

const parseScheduleByDaysFromStartSegments = (
  parameter: UnitParameter,
): readonly string[] | undefined =>
  parseValidExplicitScheduleRuleValue(parameter)?.value.split(",");

export const isValidExplicitScheduleByDaysFromStart = (
  parameter: UnitParameter,
): boolean => {
  const segments = parseScheduleByDaysFromStartSegments(parameter);
  return (
    segments !== undefined && isValidScheduleByDaysFromStartSegments(segments)
  );
};

const hasValidExplicitScheduleRuleValue = (
  parameter: UnitParameter,
  validators: readonly ExplicitScheduleRuleValueValidator[],
): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return (
    parsed !== undefined &&
    validators.some((validateValue) => validateValue(parsed.value))
  );
};

const delayTimeValueValidators: readonly ExplicitScheduleRuleValueValidator[] =
  [isValidHourMinuteRange, isValidDelayMinutesRange];

export const isValidExplicitDelayTime = (parameter: UnitParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, delayTimeValueValidators);
};

const waitBypassValues = new Set(["no", "un"]);

const isNoOrUn = (rawValue: string): boolean => waitBypassValues.has(rawValue);

const isValidWaitCountRange = (rawValue: string): boolean =>
  isExplicitNumberInRange(rawValue, 1, 999);

const waitCountValueValidators: readonly ExplicitScheduleRuleValueValidator[] =
  [isNoOrUn, isValidWaitCountRange];

export const isValidExplicitWaitCount = (parameter: UnitParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, waitCountValueValidators);
};

const waitTimeValueValidators: readonly ExplicitScheduleRuleValueValidator[] = [
  isNoOrUn,
  isValidHourMinuteRange,
  isValidWaitMinutesRange,
];

export const isValidExplicitWaitTime = (parameter: UnitParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, waitTimeValueValidators);
};
