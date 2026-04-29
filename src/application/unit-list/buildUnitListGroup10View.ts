import {
  AjsUnit,
  findAjsUnitParameterValue,
  findAjsUnitParameterValues,
} from "../../domain/models/ajs/AjsDocument";
import type { UnitListGroup10View } from "./buildUnitListView";
import {
  buildEffectiveStartConditionMonitoringViews,
  parseCftd,
  parseCy,
  parseLnParentRule,
  parseSd,
  parseSh,
  parseShd,
  parseTimeValue,
} from "./unitListViewHelpers";

export const buildUnitListGroup10View = (
  unit: AjsUnit,
): UnitListGroup10View => {
  const waitCountValues = findAjsUnitParameterValues(unit, "wc");
  const waitTimeValues = findAjsUnitParameterValues(unit, "wt");
  const waitViews = buildEffectiveStartConditionMonitoringViews(
    waitCountValues,
    waitTimeValues,
  );

  return {
    deleteAfterExecution: findAjsUnitParameterValue(unit, "de"),
    executionDate: findAjsUnitParameterValue(unit, "ed"),
    jobGroupPath: findAjsUnitParameterValue(unit, "jc"),
    exclusiveJobnetName: findAjsUnitParameterValue(unit, "ejn"),
    parentRules: unit.isRootJobnet
      ? []
      : findAjsUnitParameterValues(unit, "ln").map(parseLnParentRule),
    scheduleDateTypes: findAjsUnitParameterValues(unit, "sd").map(
      (value) => parseSd(value).type,
    ),
    scheduleDateYearMonths: findAjsUnitParameterValues(unit, "sd").map(
      (value) => parseSd(value).yearMonth,
    ),
    scheduleDateDays: findAjsUnitParameterValues(unit, "sd").map(
      (value) => parseSd(value).day,
    ),
    startTimes: findAjsUnitParameterValues(unit, "st").map((value) =>
      parseTimeValue(value, "+00:00"),
    ),
    cycles: findAjsUnitParameterValues(unit, "cy").map(parseCy),
    substitutes: findAjsUnitParameterValues(unit, "sh").map(parseSh),
    shiftDays: findAjsUnitParameterValues(unit, "shd").map(parseShd),
    scheduleByDaysFromStart: findAjsUnitParameterValues(unit, "cftd").map(
      (value) => parseCftd(value).scheduleByDaysFromStart,
    ),
    maxShiftableDays: findAjsUnitParameterValues(unit, "cftd").map(
      (value) => parseCftd(value).maxShiftableDays,
    ),
    startRangeTimes: findAjsUnitParameterValues(unit, "sy").map((value) =>
      parseTimeValue(value),
    ),
    endRangeTimes: findAjsUnitParameterValues(unit, "ey").map((value) =>
      parseTimeValue(value),
    ),
    waitCounts: waitViews.waitCounts,
    waitTimes: waitViews.waitTimes,
  };
};
