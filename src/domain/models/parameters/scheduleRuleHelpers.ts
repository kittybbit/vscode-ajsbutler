export const resolveScheduleRuleNumber = (
  rawRuleNumber: string | undefined,
): number => (rawRuleNumber === undefined ? 1 : Number(rawRuleNumber));

export type ParsedRuleValue = {
  rule: number;
  value: string;
};

const parseRuleValue = (
  rawValue: string | undefined,
  valuePattern: RegExp,
): ParsedRuleValue | undefined => {
  const matched = /^((\d{1,3}),)?(.+)$/.exec(rawValue ?? "");
  if (!matched) {
    return undefined;
  }
  const value = matched[3];
  return valuePattern.test(value)
    ? {
        rule: resolveScheduleRuleNumber(matched[2]),
        value,
      }
    : undefined;
};

export type ParsedScheduleDateValue = {
  rule: number;
  yearMonth?: string;
  day?: string;
};

export const parseScheduleDateValue = (
  rawValue: string | undefined,
): ParsedScheduleDateValue | undefined => {
  const matched =
    /^((\d{1,3}),)?((\d{4}\/)?\d{2}\/)?(([+*@])?\d{2}|([+*@])?b(-\d{2})?|\+?(su|mo|tu|we|th|fr|sa)(:(\d|b))?|en|ud)$/.exec(
      rawValue ?? "",
    );
  return matched
    ? {
        rule: resolveScheduleRuleNumber(matched[2]),
        yearMonth: matched[3],
        day: matched[5],
      }
    : undefined;
};

export const parseParentScheduleRuleValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined => parseRuleValue(rawValue, /^\d{1,3}$/);

export const parseCycleValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined =>
  parseRuleValue(rawValue, /^\((\d{1,3},[ymwd])\)$/);

export const parseClosedDaySubstitutionValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined => parseRuleValue(rawValue, /^(be|af|ca|no)$/);

export const parseShiftDaysValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined => parseRuleValue(rawValue, /^\d{1,3}$/);

export const parseStartTimeValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined => parseRuleValue(rawValue, /^\+?\d{2}:\d{2}$/);

export const parseDelayTimeValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined =>
  parseRuleValue(rawValue, /^(\d{2}:\d{2}|[MCU]\d{1,4})$/);

export const parseWaitTimeValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined =>
  parseRuleValue(rawValue, /^(no|\d{2}:\d{2}|\d{1,4}|un)$/);

export const parseAnyScheduleTimeValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined =>
  parseStartTimeValue(rawValue) ??
  parseDelayTimeValue(rawValue) ??
  parseWaitTimeValue(rawValue);

export const parseWaitCountValue = (
  rawValue: string | undefined,
): ParsedRuleValue | undefined => parseRuleValue(rawValue, /^(no|\d{1,3}|un)$/);

export type EffectiveStartConditionMonitoringPair = {
  numberOfTimes?: string;
  time?: string;
};

export const resolveEffectiveStartConditionMonitoringPair = (
  waitCountRawValue: string | undefined,
  waitTimeRawValue: string | undefined,
): EffectiveStartConditionMonitoringPair => {
  const waitCount = parseWaitCountValue(waitCountRawValue ?? "no");
  const waitTime = parseWaitTimeValue(waitTimeRawValue ?? "no");

  if (
    waitCount === undefined ||
    waitTime === undefined ||
    waitCount.value === "no" ||
    waitTime.value === "no"
  ) {
    return {};
  }

  return {
    numberOfTimes: waitCount.value,
    time: waitTime.value,
  };
};

export type ParsedScheduleByDaysFromStartValue = {
  rule: number;
  type: "no" | "be" | "af" | "db" | "da";
  scheduleByDaysFromStart?: string;
  maxShiftableDays?: string;
};

type ScheduleByDaysFromStartType = ParsedScheduleByDaysFromStartValue["type"];

type ScheduleByDaysFromStartMatch = RegExpExecArray & {
  2: string | undefined;
  3: ScheduleByDaysFromStartType;
  5: string | undefined;
  7: string | undefined;
};

const CFTD_TYPES_WITHOUT_SCHEDULE_BY_DAYS =
  new Set<ScheduleByDaysFromStartType>(["no"]);

const CFTD_TYPES_WITH_MAX_SHIFTABLE_DAYS = new Set<ScheduleByDaysFromStartType>(
  ["be", "af"],
);

const parseScheduleByDaysFromStartMatch = (
  rawValue: string | undefined,
): ScheduleByDaysFromStartMatch | undefined =>
  /^((\d{1,3}),)?(no|be|af|db|da)(,(\d{1,2})(,(\d{1,2}))?)?$/.exec(
    rawValue ?? "",
  ) as ScheduleByDaysFromStartMatch | null | undefined;

const resolveScheduleByDaysFromStart = (
  type: ScheduleByDaysFromStartType,
  rawScheduleByDaysFromStart: string | undefined,
): string | undefined =>
  CFTD_TYPES_WITHOUT_SCHEDULE_BY_DAYS.has(type)
    ? undefined
    : (rawScheduleByDaysFromStart ?? "1");

const resolveMaxShiftableDays = (
  type: ScheduleByDaysFromStartType,
  rawMaxShiftableDays: string | undefined,
): string | undefined =>
  CFTD_TYPES_WITH_MAX_SHIFTABLE_DAYS.has(type)
    ? (rawMaxShiftableDays ?? "10")
    : undefined;

export const parseScheduleByDaysFromStartValue = (
  rawValue: string | undefined,
): ParsedScheduleByDaysFromStartValue | undefined => {
  const matched = parseScheduleByDaysFromStartMatch(rawValue);
  if (!matched) {
    return undefined;
  }

  const type = matched[3];
  return {
    rule: resolveScheduleRuleNumber(matched[2]),
    type,
    scheduleByDaysFromStart: resolveScheduleByDaysFromStart(type, matched[5]),
    maxShiftableDays: resolveMaxShiftableDays(type, matched[7]),
  };
};
