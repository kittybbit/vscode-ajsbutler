import type { AjsGroupType } from "../ajs/AjsDocument";
import type { WeekSymbol } from "../../values/AjsType";

export const resolveGroupType = (
  groupTypeValue: string | undefined,
): AjsGroupType | undefined =>
  groupTypeValue === "n" || groupTypeValue === "p" ? groupTypeValue : undefined;

export const resolveIsPlanning = (
  groupTypeValue: string | undefined,
): boolean => resolveGroupType(groupTypeValue) === "p";

type WeekStateSource = Partial<Record<WeekSymbol, boolean>>;

const hasWeekState = (
  calendars: WeekStateSource[] | undefined,
  week: WeekSymbol,
): boolean => calendars?.some((calendar) => calendar[week] === true) ?? false;

const resolveWeekStateSource = (
  calendars: WeekStateSource[] | undefined,
  week: WeekSymbol,
  state: boolean,
): boolean | undefined => (hasWeekState(calendars, week) ? state : undefined);

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

export const resolveGroupWeekState = (
  openCalendars: WeekStateSource[] | undefined,
  closeCalendars: WeekStateSource[] | undefined,
  week: WeekSymbol,
): boolean | undefined =>
  [
    resolveWeekStateSource(openCalendars, week, true),
    resolveWeekStateSource(closeCalendars, week, false),
  ].find(isDefined);
