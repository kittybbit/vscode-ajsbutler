import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { findParameters } from "./syntaxDiagnosticUnitLookup";
export {
  getCalendarMonthDayLimit,
  isValidExplicitScheduleDate,
  isValidScheduleDateDayToken,
  isValidScheduleDateMonth,
  isValidScheduleDateYear,
  parseExplicitScheduleDateDiagnosticValue,
  type ParsedExplicitScheduleDateValue,
} from "./syntaxDiagnosticScheduleDateRules";

export const DEFAULT_SCHEDULE_LIMIT_YEAR = 2036;

export type ParsedExplicitScheduleRuleValue = {
  hasExplicitRuleNumber: boolean;
  ruleNumber: number;
  value: string;
};

const isNumberInRange = (
  value: number,
  minimum: number,
  maximum: number,
): boolean => value >= minimum && value <= maximum;

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
  parameter: AjsParameter,
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
  y: 9,
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
  parameter: AjsParameter,
  matchesValue: (rawValue: string) => boolean,
): ParsedExplicitScheduleRuleValue | undefined => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return parsed !== undefined && matchesValue(parsed.value)
    ? parsed
    : undefined;
};

export const isValidExplicitParentScheduleRule = (
  parameter: AjsParameter,
  unit: AjsUnit,
): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  return (
    unit.isRoot ||
    (parsed !== undefined && isExplicitNumberInRange(parsed.value, 1, 144))
  );
};

export const isValidExplicitStartTime = (parameter: AjsParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, [isValidHourMinuteRange]);
};

export const isValidExplicitCycle = (parameter: AjsParameter): boolean => {
  const parsed = parseValidExplicitScheduleRuleValue(parameter);
  const cycle = parsed ? parseExplicitCycleValue(parsed.value) : undefined;
  return (
    cycle !== undefined &&
    isNumberInRange(cycle.cycle, 1, maximumExplicitCycleByUnit[cycle.unitType])
  );
};

export const isExplicitWeeklyCycle = (
  parameter: AjsParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  return parseMatchingExplicitScheduleRuleValue(parameter, isWeeklyCycleValue);
};

export const usesOpenOrClosedDaySchedule = (
  parameter: AjsParameter,
): ParsedExplicitScheduleRuleValue | undefined => {
  return parseMatchingExplicitScheduleRuleValue(
    parameter,
    isOpenOrClosedDayScheduleValue,
  );
};

export const hasInvalidExplicitWeeklyCycleScheduleCompatibility = (
  parameter: AjsParameter,
  unit: AjsUnit,
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

export const isValidExplicitShiftDays = (parameter: AjsParameter): boolean => {
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
  parameter: AjsParameter,
): readonly string[] | undefined =>
  parseValidExplicitScheduleRuleValue(parameter)?.value.split(",");

export const isValidExplicitScheduleByDaysFromStart = (
  parameter: AjsParameter,
): boolean => {
  const segments = parseScheduleByDaysFromStartSegments(parameter);
  return (
    segments !== undefined && isValidScheduleByDaysFromStartSegments(segments)
  );
};

const hasValidExplicitScheduleRuleValue = (
  parameter: AjsParameter,
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

export const isValidExplicitDelayTime = (parameter: AjsParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, delayTimeValueValidators);
};

const waitBypassValues = new Set(["no", "un"]);

const isNoOrUn = (rawValue: string): boolean => waitBypassValues.has(rawValue);

const isValidWaitCountRange = (rawValue: string): boolean =>
  isExplicitNumberInRange(rawValue, 1, 999);

const waitCountValueValidators: readonly ExplicitScheduleRuleValueValidator[] =
  [isNoOrUn, isValidWaitCountRange];

export const isValidExplicitWaitCount = (parameter: AjsParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, waitCountValueValidators);
};

const waitTimeValueValidators: readonly ExplicitScheduleRuleValueValidator[] = [
  isNoOrUn,
  isValidHourMinuteRange,
  isValidWaitMinutesRange,
];

export const isValidExplicitWaitTime = (parameter: AjsParameter): boolean => {
  return hasValidExplicitScheduleRuleValue(parameter, waitTimeValueValidators);
};
