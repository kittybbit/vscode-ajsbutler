import { WeekSymbol, isWeekSymbol } from "../../domain/values/AjsType";

const weekSymbols: WeekSymbol[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];

const getCalendarWeekSymbol = (value: string): WeekSymbol | undefined => {
  const parsedValue = value.split(":")[0];
  return isWeekSymbol(parsedValue) ? parsedValue : undefined;
};

const includesCalendarWeekSymbol = (
  values: string[],
  weekSymbol: WeekSymbol,
): boolean =>
  values.some((value) => getCalendarWeekSymbol(value) === weekSymbol);

const calendarWeekState = (
  weekSymbol: WeekSymbol,
  openValues: string[],
  closeValues: string[],
): boolean | undefined => {
  if (includesCalendarWeekSymbol(openValues, weekSymbol)) return true;
  if (includesCalendarWeekSymbol(closeValues, weekSymbol)) return false;
  return undefined;
};

export const buildCalendarWeekView = (
  openValues: string[],
  closeValues: string[],
): Record<WeekSymbol, boolean | undefined> =>
  Object.fromEntries(
    weekSymbols.map((weekSymbol) => [
      weekSymbol,
      calendarWeekState(weekSymbol, openValues, closeValues),
    ]),
  ) as Record<WeekSymbol, boolean | undefined>;

export const isNonWeekCalendarValue = (value: string): boolean =>
  getCalendarWeekSymbol(value) === undefined;
