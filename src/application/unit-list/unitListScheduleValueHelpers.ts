import {
  parseAnyScheduleTimeValue,
  parseClosedDaySubstitutionValue,
  parseCycleValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseScheduleDateValue,
  parseShiftDaysValue,
  parseWaitCountValue,
  resolveEffectiveStartConditionMonitoringPair,
  type ParsedScheduleByDaysFromStartValue,
} from "../../domain/models/parameters/scheduleRuleHelpers";

export const parseLnParentRule = (value: string): string =>
  parseParentScheduleRuleValue(value)?.value ?? "";

const scheduleDateDayTypePrefixes = ["+", "*", "@"] as const;

const isScheduleDateSpecialDayType = (dayValue: string): boolean =>
  dayValue === "en" || dayValue === "ud";

const scheduleDateType = (dayValue: string): string => {
  if (isScheduleDateSpecialDayType(dayValue)) {
    return dayValue;
  }

  return (
    scheduleDateDayTypePrefixes.find((prefix) => dayValue.startsWith(prefix)) ??
    ""
  );
};

const scheduleDateDay = (dayValue: string): string =>
  dayValue && !isScheduleDateSpecialDayType(dayValue)
    ? dayValue.replace(/^[+*@]/, "")
    : "";

export const parseSd = (
  value: string,
): { type: string; yearMonth: string; day: string } => {
  const parsed = parseScheduleDateValue(value);
  const yearMonth = parsed?.yearMonth?.slice(0, -1) ?? "";
  const dayValue = parsed?.day ?? "";

  return {
    type: scheduleDateType(dayValue),
    yearMonth,
    day: scheduleDateDay(dayValue),
  };
};

export const parseTimeValue = (value: string, fallback = ""): string =>
  parseAnyScheduleTimeValue(value)?.value ?? fallback;

export const parseCy = (value: string): string =>
  parseCycleValue(value)?.value.slice(1, -1) ?? "";

export const parseSh = (value: string): string =>
  parseClosedDaySubstitutionValue(value)?.value ?? "";

export const parseShd = (value: string): string =>
  parseShiftDaysValue(value)?.value ?? "2";

const cftdTypesWithoutMaxShiftableDays: readonly ParsedScheduleByDaysFromStartValue["type"][] =
  ["no", "db", "da"];

const cftdScheduleByDaysFromStart = (
  type: ParsedScheduleByDaysFromStartValue["type"],
  scheduleByDaysFromStart: string | undefined,
): string =>
  type === "no" ? "no" : `${type},${scheduleByDaysFromStart ?? "1"}`;

const cftdMaxShiftableDays = (
  type: ParsedScheduleByDaysFromStartValue["type"],
  maxShiftableDays: string | undefined,
): string =>
  cftdTypesWithoutMaxShiftableDays.includes(type)
    ? ""
    : (maxShiftableDays ?? "10");

export const parseCftd = (
  value: string,
): { scheduleByDaysFromStart: string; maxShiftableDays: string } => {
  const parsed = parseScheduleByDaysFromStartValue(value);
  const type = parsed?.type ?? "no";
  return {
    scheduleByDaysFromStart: cftdScheduleByDaysFromStart(
      type,
      parsed?.scheduleByDaysFromStart,
    ),
    maxShiftableDays: cftdMaxShiftableDays(type, parsed?.maxShiftableDays),
  };
};

export const parseWc = (value: string): string =>
  parseWaitCountValue(value)?.value ?? "1";

export const buildEffectiveStartConditionMonitoringViews = (
  waitCountValues: string[],
  waitTimeValues: string[],
): { waitCounts: string[]; waitTimes: string[] } => {
  const pairCount = Math.max(waitCountValues.length, waitTimeValues.length);
  const waitCounts: string[] = [];
  const waitTimes: string[] = [];

  for (let index = 0; index < pairCount; index += 1) {
    const effectivePair = resolveEffectiveStartConditionMonitoringPair(
      waitCountValues[index],
      waitTimeValues[index],
    );

    waitCounts.push(effectivePair.numberOfTimes ?? "");
    waitTimes.push(effectivePair.time ?? "");
  }

  return { waitCounts, waitTimes };
};
