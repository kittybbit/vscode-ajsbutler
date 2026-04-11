import {
  AjsDocument,
  AjsUnit,
  AjsUnitType,
  findAjsUnitParameter,
  findParentAjsUnit,
} from "../../domain/models/ajs/AjsDocument";
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

const parseRulePrefix = (value: string): { rule?: string; body: string } => {
  const matched = /^(\d{1,3}),(.*)$/.exec(value);
  return matched ? { rule: matched[1], body: matched[2] } : { body: value };
};

export const parseLnParentRule = (value: string): string =>
  parseRulePrefix(value).body;

export const parseSd = (
  value: string,
): { type: string; yearMonth: string; day: string } => {
  const matched =
    /^((\d{1,3}),)?((\d{4}\/)?\d{2}\/)?(([+*@])?\d{2}|([+*@])?b(-\d{2})?|\+?(su|mo|tu|we|th|fr|sa)(:(\d|b))?|en|ud)/.exec(
      value,
    );
  const yearMonth = matched?.[3]?.slice(0, -1) ?? "";
  const dayValue = matched?.[5] ?? "";
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
  /^((\d{1,3}),)?(no|([+]?)\d{2}:\d{2}|([MCU])?\d{1,4}|un)?/.exec(value)?.[3] ??
  fallback;

export const parseCy = (value: string): string =>
  /^((\d{1,3}),)?\(((\d{1,3}),([ymwd]))\)/.exec(value)?.[3] ?? "";

export const parseSh = (value: string): string =>
  /^((\d{1,3}),)?(be|af|ca|no)/.exec(value)?.[3] ?? "";

export const parseShd = (value: string): string =>
  /^((\d{1,3}),)?(\d{1,3})/.exec(value)?.[3] ?? "2";

export const parseCftd = (
  value: string,
): { scheduleByDaysFromStart: string; maxShiftableDays: string } => {
  const matched =
    /^((\d{1,3}),)?(no|be|af|db|da)((,(\d{1,2}))(,(\d{1,2}))?)?/.exec(value);
  const type = matched?.[3] ?? "no";
  return {
    scheduleByDaysFromStart:
      type === "no" ? "no" : `${type},${matched?.[6] ?? "1"}`,
    maxShiftableDays:
      type && ["no", "db", "da"].includes(type) ? "" : (matched?.[8] ?? "10"),
  };
};

export const parseWc = (value: string): string =>
  /^((\d{1,3}),)?(.+)/.exec(value)?.[3] ?? "1";
