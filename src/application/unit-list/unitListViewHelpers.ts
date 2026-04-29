import {
  AjsDocument,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameter,
  findParentAjsUnit,
} from "../../domain/models/ajs/AjsDocument";
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
} from "../../domain/models/parameters/scheduleRuleHelpers";
import { WeekSymbol, isWeekSymbol } from "../../domain/values/AjsType";

const weekSymbols: WeekSymbol[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];

const getCalendarWeekSymbol = (value: string): WeekSymbol | undefined => {
  const parsedValue = value.split(":")[0];
  return isWeekSymbol(parsedValue) ? parsedValue : undefined;
};

export const buildCalendarWeekView = (
  openValues: string[],
  closeValues: string[],
): Record<WeekSymbol, boolean | undefined> =>
  Object.fromEntries(
    weekSymbols.map((weekSymbol) => [
      weekSymbol,
      openValues.some((value) => getCalendarWeekSymbol(value) === weekSymbol)
        ? true
        : closeValues.some(
              (value) => getCalendarWeekSymbol(value) === weekSymbol,
            )
          ? false
          : undefined,
    ]),
  ) as Record<WeekSymbol, boolean | undefined>;

export const isNonWeekCalendarValue = (value: string): boolean =>
  getCalendarWeekSymbol(value) === undefined;

const toNiPriority = (value: string): number => {
  const nice = Number(value);
  if (nice > 10) {
    return 5;
  }
  if (nice > 0) {
    return 4;
  }
  if (nice === 0) {
    return 3;
  }
  if (nice > -11) {
    return 2;
  }
  return 1;
};

export const getPriorityForUnitTypes = (
  document: AjsDocument,
  unit: AjsUnit,
  priorityById: Map<string, number>,
  targetUnitTypes: readonly AjsUnitType[],
): number | undefined => {
  const cachedPriority = priorityById.get(unit.id);
  if (cachedPriority !== undefined) {
    return cachedPriority;
  }
  if (!targetUnitTypes.includes(unit.unitType)) {
    return undefined;
  }

  const pr = findAjsUnitParameter(unit, "pr");
  const ni = findAjsUnitParameter(unit, "ni");

  const prPriority =
    pr && pr.value !== undefined && pr.value !== ""
      ? Number(pr.value)
      : undefined;
  const niPriority = ni ? toNiPriority(ni.value) : undefined;

  if (prPriority !== undefined && niPriority !== undefined) {
    const priority =
      (pr.position ?? -1) > (ni.position ?? -1) ? prPriority : niPriority;
    priorityById.set(unit.id, priority);
    return priority;
  }
  if (prPriority !== undefined) {
    priorityById.set(unit.id, prPriority);
    return prPriority;
  }
  if (niPriority !== undefined) {
    priorityById.set(unit.id, niPriority);
    return niPriority;
  }

  const parent = findParentAjsUnit(document, unit);
  if (parent && (parent.unitType === "n" || parent.unitType === "rn")) {
    const parentPriority = getPriorityForUnitTypes(
      document,
      parent,
      priorityById,
      ["n", "rn"],
    );
    if (parentPriority !== undefined) {
      priorityById.set(unit.id, parentPriority);
      return parentPriority;
    }
  }
  priorityById.set(unit.id, 1);
  return 1;
};

export const parseLnParentRule = (value: string): string =>
  parseParentScheduleRuleValue(value)?.value ?? "";

export const parseSd = (
  value: string,
): { type: string; yearMonth: string; day: string } => {
  const parsed = parseScheduleDateValue(value);
  const yearMonth = parsed?.yearMonth?.slice(0, -1) ?? "";
  const dayValue = parsed?.day ?? "";
  const type =
    dayValue === "en" || dayValue === "ud"
      ? dayValue
      : dayValue.startsWith("+")
        ? "+"
        : dayValue.startsWith("*")
          ? "*"
          : dayValue.startsWith("@")
            ? "@"
            : "";
  const day =
    dayValue && dayValue !== "en" && dayValue !== "ud"
      ? dayValue.replace(/^[+*@]/, "")
      : "";
  return { type, yearMonth, day };
};

export const parseTimeValue = (value: string, fallback = ""): string =>
  parseAnyScheduleTimeValue(value)?.value ?? fallback;

export const parseCy = (value: string): string =>
  parseCycleValue(value)?.value.slice(1, -1) ?? "";

export const parseSh = (value: string): string =>
  parseClosedDaySubstitutionValue(value)?.value ?? "";

export const parseShd = (value: string): string =>
  parseShiftDaysValue(value)?.value ?? "2";

export const parseCftd = (
  value: string,
): { scheduleByDaysFromStart: string; maxShiftableDays: string } => {
  const parsed = parseScheduleByDaysFromStartValue(value);
  const type = parsed?.type ?? "no";
  return {
    scheduleByDaysFromStart:
      type === "no"
        ? "no"
        : `${type},${parsed?.scheduleByDaysFromStart ?? "1"}`,
    maxShiftableDays:
      type && ["no", "db", "da"].includes(type)
        ? ""
        : (parsed?.maxShiftableDays ?? "10"),
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
