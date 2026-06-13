import {
  AjsUnit,
  findAjsUnitParameterValue,
} from "../../domain/models/ajs/AjsDocument";
import type { ParamSymbol } from "../../domain/values/AjsType";
import type {
  UnitListGroup1View,
  UnitListGroup2View,
  UnitListGroup3View,
  UnitListGroup4View,
  UnitListGroup5View,
  UnitListLinkedUnitView,
} from "./buildUnitListView";

const isManagerUnit = (unit: AjsUnit): boolean =>
  unit.unitType === "mg" || unit.unitType === "mn";

const isJobGroup = (unit: AjsUnit): boolean => unit.unitType === "g";

const parentAbsolutePath = (unit: AjsUnit): string =>
  unit.depth > 0
    ? unit.absolutePath.split("/").slice(0, -1).join("/") || "/"
    : "/";

const layoutHv = (unit: AjsUnit): string | undefined =>
  unit.depth > 0 ? `+${unit.layout.h}+${unit.layout.v}` : undefined;

const findJobGroupParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
): string | undefined =>
  isJobGroup(unit) ? findAjsUnitParameterValue(unit, key) : undefined;

export const buildGroup1View = (unit: AjsUnit): UnitListGroup1View => ({
  name: unit.name,
  parentAbsolutePath: parentAbsolutePath(unit),
  parentId: unit.parentId,
  unitType: unit.unitType,
  groupType: unit.groupType,
  cty: findAjsUnitParameterValue(unit, "cty"),
  layoutHv: layoutHv(unit),
  size: findAjsUnitParameterValue(unit, "sz"),
});

export const buildGroup2View = (
  unit: AjsUnit,
  previousUnits: UnitListLinkedUnitView[],
  nextUnits: UnitListLinkedUnitView[],
): UnitListGroup2View => ({
  comment: unit.comment,
  previousUnits,
  nextUnits,
  executionAgent: findAjsUnitParameterValue(unit, "ex"),
  nestedConnectionLimit: findAjsUnitParameterValue(unit, "ncl"),
  nestedConnectionName: findAjsUnitParameterValue(unit, "ncn"),
  nestedConnectionService: findAjsUnitParameterValue(unit, "ncsv"),
  nestedConnectionEnabled: findAjsUnitParameterValue(unit, "ncs"),
  nestedConnectionExternal: findAjsUnitParameterValue(unit, "ncex"),
  nestedConnectionHost: findAjsUnitParameterValue(unit, "nchn"),
});

export const buildGroup3View = (unit: AjsUnit): UnitListGroup3View => ({
  hardAttribute: findAjsUnitParameterValue(unit, "ha"),
  isRecovery: unit.isRecovery,
  jp1Username: unit.jp1Username,
  jp1ResourceGroup: unit.jp1ResourceGroup,
});

export const buildGroup4View = (unit: AjsUnit): UnitListGroup4View => ({
  managerHost: isManagerUnit(unit)
    ? findAjsUnitParameterValue(unit, "mh")
    : undefined,
  managerUnit: isManagerUnit(unit)
    ? findAjsUnitParameterValue(unit, "mu")
    : undefined,
});

export const buildGroup5View = (unit: AjsUnit): UnitListGroup5View => ({
  startDeadlineDate: findJobGroupParameterValue(unit, "sdd"),
  maximumDuration: findJobGroupParameterValue(unit, "md"),
  startTimeType: findJobGroupParameterValue(unit, "stt"),
  jobGroupType: isJobGroup(unit) ? unit.groupType : undefined,
});
