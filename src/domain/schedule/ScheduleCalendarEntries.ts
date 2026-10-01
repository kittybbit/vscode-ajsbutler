import type { AjsParameter, AjsUnit } from "../models/ajs/AjsDocument";
import {
  isImpossibleYearDay,
  isInvalidCalendarDay,
  isInvalidCalendarMonth,
  type ScheduleDateWeekday,
} from "./ScheduleDate";
import type {
  ScheduleCalendarDayClassification,
  ScheduleCalendarDayResult,
  ScheduleCalendarEntry,
  ScheduleCalendarGroup,
  ScheduleCalendarSelector,
} from "./ScheduleCalendar";

const isInvalidExactSelector = (
  year: number | undefined,
  month: number,
  day: number,
): boolean =>
  isInvalidCalendarMonth(month) ||
  isInvalidCalendarDay(day) ||
  isImpossibleYearDay(year, month, day);

const createExactSelector = (
  year: number | undefined,
  month: number,
  day: number,
): ScheduleCalendarSelector => {
  const selector = {
    kind: "exact" as const,
    month,
    day,
    key: `exact:${year ?? "*"}/${month}/${day}`,
  };
  return year === undefined ? selector : { ...selector, year };
};

const exactSelectorFromMatch = (
  exact: RegExpExecArray,
): ScheduleCalendarSelector | undefined => {
  const year = exact[1] === undefined ? undefined : Number(exact[1]);
  const month = Number(exact[2]);
  const day = Number(exact[3]);
  return isInvalidExactSelector(year, month, day)
    ? undefined
    : createExactSelector(year, month, day);
};

const parseExactSelector = (
  value: string,
): ScheduleCalendarSelector | undefined => {
  const exact = /^(?:(\d{4})\/)?(\d{2})\/(\d{2})$/.exec(value);
  return exact === null ? undefined : exactSelectorFromMatch(exact);
};

const parseWeekdaySelector = (
  value: string,
): ScheduleCalendarSelector | undefined => {
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::(?:[1-5]|b))?$/.exec(value);
  return weekday
    ? {
        kind: "weekday",
        weekday: weekday[1] as ScheduleDateWeekday,
        key: `weekday:${weekday[1]}`,
      }
    : undefined;
};

const parseCalendarSelector = (
  value: string,
): ScheduleCalendarSelector | undefined =>
  parseExactSelector(value) ?? parseWeekdaySelector(value);

export const baseCalendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );

type CalendarEntryResult =
  | { status: "supported"; entry: ScheduleCalendarEntry }
  | { status: "invalid"; invalidKey: string };

const classificationForParameter = (
  parameter: AjsParameter,
): ScheduleCalendarDayClassification =>
  parameter.key === "op" ? "open" : "closed";

const hasConflictingClassification = (
  existing: ScheduleCalendarDayClassification | undefined,
  classification: ScheduleCalendarDayClassification,
): boolean => existing !== undefined && existing !== classification;

const resolveCalendarEntry = (
  parameter: AjsParameter,
  classifications: Map<string, ScheduleCalendarDayClassification>,
): CalendarEntryResult => {
  const selector = parseCalendarSelector(parameter.value);
  if (!selector) {
    return { status: "invalid", invalidKey: parameter.key };
  }
  const classification = classificationForParameter(parameter);
  const existing = classifications.get(selector.key);
  if (hasConflictingClassification(existing, classification)) {
    return { status: "invalid", invalidKey: parameter.key };
  }
  classifications.set(selector.key, classification);
  return {
    status: "supported",
    entry: { selector, classification, parameter },
  };
};

type CalendarGroupResult =
  | { status: "supported"; group: ScheduleCalendarGroup }
  | { status: "invalid"; invalidKey: string };

type CalendarEntriesState = {
  entries: ScheduleCalendarEntry[];
  classifications: Map<string, ScheduleCalendarDayClassification>;
  invalidKey?: string;
};

const appendCalendarEntry = (
  state: CalendarEntriesState,
  parameter: AjsParameter,
): CalendarEntriesState => {
  if (state.invalidKey) {
    return state;
  }
  const result = resolveCalendarEntry(parameter, state.classifications);
  return result.status === "invalid"
    ? { ...state, invalidKey: result.invalidKey }
    : { ...state, entries: [...state.entries, result.entry] };
};

const resolveCalendarEntries = (group: AjsUnit): CalendarEntriesState =>
  calendarParameters(group).reduce(appendCalendarEntry, {
    entries: [],
    classifications: new Map(),
  });

const resolveCalendarGroup = (group: AjsUnit): CalendarGroupResult => {
  const result = resolveCalendarEntries(group);
  return result.invalidKey
    ? { status: "invalid", invalidKey: result.invalidKey }
    : { status: "supported", group: { entries: result.entries } };
};

type CalendarGroupsResult = {
  groups: ScheduleCalendarGroup[];
  invalidKey?: string;
};

type CalendarGroupsState = {
  groups: ScheduleCalendarGroup[];
  invalidKey?: string;
};

const appendCalendarGroup = (
  state: CalendarGroupsState,
  group: AjsUnit,
): CalendarGroupsState => {
  if (state.invalidKey) {
    return state;
  }
  const result = resolveCalendarGroup(group);
  return result.status === "invalid"
    ? { groups: state.groups, invalidKey: result.invalidKey }
    : { groups: [...state.groups, result.group] };
};

export const resolveCalendarGroups = (
  groups: AjsUnit[],
): CalendarGroupsResult => groups.reduce(appendCalendarGroup, { groups: [] });

const matchesExactSelector = (
  selector: Extract<ScheduleCalendarSelector, { kind: "exact" }>,
  date: Date,
): boolean => {
  const matchesMonthAndDay =
    selector.month === date.getUTCMonth() + 1 &&
    selector.day === date.getUTCDate();
  const matchesYear =
    selector.year === undefined || selector.year === date.getUTCFullYear();
  return matchesMonthAndDay && matchesYear;
};

const selectorMatchesDate = (
  selector: ScheduleCalendarSelector,
  date: Date,
): boolean =>
  selector.kind === "exact"
    ? matchesExactSelector(selector, date)
    : selector.weekday ===
      (["su", "mo", "tu", "we", "th", "fr", "sa"][
        date.getUTCDay()
      ] as ScheduleDateWeekday);

const classificationForMatches = (
  matches: ScheduleCalendarEntry[],
): ScheduleCalendarDayResult | undefined => {
  if (matches.length === 0) {
    return undefined;
  }
  const classifications = new Set(matches.map((entry) => entry.classification));
  if (classifications.size > 1) {
    return {
      status: "invalid",
      evidenceId: `schedule:calendar:invalid-base-or-conflict:${matches[0].parameter.key}`,
    };
  }
  return { status: matches[0].classification };
};

const classifyCalendarGroup = (
  group: ScheduleCalendarGroup,
  date: Date,
  kind: "exact" | "weekday",
): ScheduleCalendarDayResult | undefined =>
  classificationForMatches(
    group.entries.filter(
      (entry) =>
        entry.selector.kind === kind &&
        selectorMatchesDate(entry.selector, date),
    ),
  );

export const classifyCalendarSelector = (
  groups: ScheduleCalendarGroup[],
  date: Date,
  kind: "exact" | "weekday",
): ScheduleCalendarDayResult | undefined =>
  groups
    .map((group) => classifyCalendarGroup(group, date, kind))
    .find(
      (result): result is ScheduleCalendarDayResult => result !== undefined,
    );

/** Resolve one operational-calendar day with exact-date precedence. */

export const calendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );
