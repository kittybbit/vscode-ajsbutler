import {
  parseAnyScheduleTimeValue,
  parseClosedDaySubstitutionValue,
  parseCycleValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseShiftDaysValue,
  parseWaitCountValue,
  resolveEffectiveStartConditionMonitoringPair,
  type ParsedScheduleByDaysFromStartValue,
} from "../../domain/models/parameters/scheduleRuleHelpers";
import {
  interpretScheduleDateValue,
  type ScheduleDateDay,
  type ScheduleDateInterpretation,
} from "../../domain/models/parameters/scheduleDateInterpreter";

export const parseLnParentRule = (value: string): string =>
  parseParentScheduleRuleValue(value)?.value ?? "";

const formatScheduleDateDayValue = (day: ScheduleDateDay): string => {
  switch (day.kind) {
    case "calendar":
    case "relative":
    case "open":
    case "closed":
      return String(day.value).padStart(2, "0");
    case "backward":
      return day.offset === undefined
        ? "b"
        : `b-${day.offset.toString().padStart(2, "0")}`;
    case "weekday":
      return `${day.weekday}${day.occurrence === undefined ? "" : `:${day.occurrence}`}`;
    case "en":
    case "ud":
      return "";
  }
};

const scheduleDateType = (day: ScheduleDateDay): string => {
  switch (day.kind) {
    case "calendar":
      return "";
    case "relative":
      return "+";
    case "open":
      return "*";
    case "closed":
      return "@";
    case "backward":
    case "weekday":
      return day.prefix ?? "";
    case "en":
      return "en";
    case "ud":
      return "ud";
  }
};

const scheduleDateYearMonth = (parsed: ScheduleDateInterpretation): string =>
  parsed.month === undefined
    ? ""
    : `${parsed.year === undefined ? "" : `${String(parsed.year).padStart(4, "0")}/`}${String(parsed.month).padStart(2, "0")}`;

export const parseSd = (
  value: string,
): { type: string; yearMonth: string; day: string } => {
  const parsed = interpretScheduleDateValue(value);
  return {
    type: parsed ? scheduleDateType(parsed.day) : "",
    yearMonth: parsed ? scheduleDateYearMonth(parsed) : "",
    day: parsed ? formatScheduleDateDayValue(parsed.day) : "",
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
