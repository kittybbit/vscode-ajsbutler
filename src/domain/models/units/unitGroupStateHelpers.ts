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

export const resolveGroupWeekState = (
  openCalendars: WeekStateSource[] | undefined,
  closeCalendars: WeekStateSource[] | undefined,
  week: WeekSymbol,
): boolean | undefined => {
  if (openCalendars === undefined && closeCalendars === undefined) {
    return undefined;
  }
  if (openCalendars?.find((calendar) => calendar[week])) {
    return true;
  }
  if (closeCalendars?.find((calendar) => calendar[week])) {
    return false;
  }
  return undefined;
};
