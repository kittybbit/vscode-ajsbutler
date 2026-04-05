import { TySymbol, isTySymbol } from "../../values/AjsType";
import { Unit } from "../../values/Unit";
import {
  findUnitParameterValue,
  findUnitParameterValues,
} from "../../values/unitParameterLookupHelpers";
import { decodeEncodedString } from "../parameters/encodedStringHelpers";
import { resolveGroupType } from "../units/unitGroupStateHelpers";
import { resolveIsRootJobnet } from "../units/unitJobnetStateHelpers";
import { resolveUnitLayout } from "../units/unitLayoutHelpers";
import { resolveHasSchedule } from "../units/unitScheduleStateHelpers";
import { resolveHasWaitedFor } from "../units/unitWaitStateHelpers";
import { AjsGroupType, AjsNormalizationWarning } from "./AjsDocument";

export const resolveNormalizedUnitType = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): TySymbol => {
  const tyValue = findUnitParameterValue(unit, "ty");
  if (tyValue && isTySymbol(tyValue)) {
    return tyValue;
  }

  warnings.push({
    code: "missing-unit-type",
    message: `Unit type could not be resolved for ${unit.absolutePath()}.`,
    unitPath: unit.absolutePath(),
  });
  return "g";
};

export const resolveNormalizedGroupType = (
  unit: Unit,
): AjsGroupType | undefined =>
  resolveGroupType(findUnitParameterValue(unit, "gty"));

export const resolveNormalizedComment = (unit: Unit): string | undefined =>
  decodeEncodedString(findUnitParameterValue(unit, "cm"));

export const resolveNormalizedLayout = (
  unit: Unit,
): { h: number; v: number } =>
  unit.parent
    ? resolveUnitLayout(unit.name, findUnitParameterValues(unit.parent, "el"))
    : { h: 0, v: 0 };

export const resolveNormalizedHasWaitedFor = (unit: Unit): boolean =>
  resolveHasWaitedFor(findUnitParameterValues(unit, "eun"));

export const resolveNormalizedHasSchedule = (
  unit: Unit,
  unitType: TySymbol,
): boolean =>
  unitType === "n"
    ? resolveHasSchedule(findUnitParameterValues(unit, "sd"))
    : false;

export const resolveNormalizedIsRootJobnet = (
  unit: Unit,
  unitType: TySymbol,
): boolean =>
  unitType === "n"
    ? resolveIsRootJobnet(findUnitParameterValue(unit.parent, "ty"))
    : false;
