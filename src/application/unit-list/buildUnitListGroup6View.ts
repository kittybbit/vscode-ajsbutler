import {
  AjsUnit,
  findAjsUnitParameterValues,
} from "../../domain/models/ajs/AjsDocument";
import type { UnitListGroup6View } from "./buildUnitListView";
import {
  buildCalendarWeekView,
  isNonWeekCalendarValue,
} from "./unitListViewHelpers";

export const buildUnitListGroup6View = (unit: AjsUnit): UnitListGroup6View => {
  if (unit.unitType !== "g") {
    return {
      openDates: [],
      closeDates: [],
    };
  }

  const openValues = findAjsUnitParameterValues(unit, "op");
  const closeValues = findAjsUnitParameterValues(unit, "cl");

  return {
    ...buildCalendarWeekView(openValues, closeValues),
    openDates: openValues.filter(isNonWeekCalendarValue),
    closeDates: closeValues.filter(isNonWeekCalendarValue),
  };
};
