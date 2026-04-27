export const resolveScheduleRuleNumber = (
  rawRuleNumber: string | undefined,
): number => (rawRuleNumber === undefined ? 1 : Number(rawRuleNumber));

type ParsedRuleValue = {
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

export type ParsedScheduleByDaysFromStartValue = {
  rule: number;
  type: "no" | "be" | "af" | "db" | "da";
  scheduleByDaysFromStart?: string;
  maxShiftableDays?: string;
};

export const parseScheduleByDaysFromStartValue = (
  rawValue: string | undefined,
): ParsedScheduleByDaysFromStartValue | undefined => {
  const matched =
    /^((\d{1,3}),)?(no|be|af|db|da)(,(\d{1,2})(,(\d{1,2}))?)?$/.exec(
      rawValue ?? "",
    );
  if (!matched) {
    return undefined;
  }

  const type = matched[3] as ParsedScheduleByDaysFromStartValue["type"];
  return {
    rule: resolveScheduleRuleNumber(matched[2]),
    type,
    scheduleByDaysFromStart: type === "no" ? undefined : (matched[5] ?? "1"),
    maxShiftableDays:
      type === "be" || type === "af" ? (matched[7] ?? "10") : undefined,
  };
};
