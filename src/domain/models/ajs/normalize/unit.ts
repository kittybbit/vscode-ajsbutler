import { TySymbol, isTySymbol } from "../../../values/AjsType";
import { Unit } from "../../../values/Unit";
import {
  findUnitParameterValue,
  findUnitParameterValues,
} from "../../../values/unitParameterLookupHelpers";
import { decodeEncodedString } from "../../parameters/encodedStringHelpers";
import { resolveGroupType } from "../../units/unitGroupStateHelpers";
import { resolveIsRootJobnet } from "../../units/unitJobnetStateHelpers";
import type { UnitLayout } from "../../units/unitLayoutHelpers";
import { resolveUnitLayout } from "../../units/unitLayoutHelpers";
import { resolveHasSchedule } from "../../units/unitScheduleStateHelpers";
import { resolveHasWaitedFor } from "../../units/unitWaitStateHelpers";
import { AjsGroupType, AjsNormalizationWarning } from "../AjsDocument";
import { buildMissingUnitTypeWarning } from "./warnings";

export const resolveNormalizedUnitType = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): TySymbol => {
  const tyValue = findUnitParameterValue(unit, "ty");
  if (tyValue && isTySymbol(tyValue)) {
    return tyValue;
  }

  warnings.push(buildMissingUnitTypeWarning(unit.absolutePath()));
  return "g";
};

export const resolveNormalizedGroupType = (
  unit: Unit,
): AjsGroupType | undefined =>
  resolveGroupType(findUnitParameterValue(unit, "gty"));

export const resolveNormalizedComment = (unit: Unit): string | undefined =>
  decodeEncodedString(findUnitParameterValue(unit, "cm"));

const ROOT_UNIT_LAYOUT: UnitLayout = { h: 0, v: 0 };

const resolveChildLayout = (unit: Unit, parent: Unit): UnitLayout =>
  resolveUnitLayout(unit.name, findUnitParameterValues(parent, "el"));

export const resolveNormalizedLayout = (unit: Unit): UnitLayout =>
  unit.parent ? resolveChildLayout(unit, unit.parent) : ROOT_UNIT_LAYOUT;

export const resolveNormalizedHasWaitedFor = (unit: Unit): boolean =>
  resolveHasWaitedFor(findUnitParameterValues(unit, "eun"));

const isNormalizedJobnet = (unitType: TySymbol): boolean => unitType === "n";

export const resolveNormalizedHasSchedule = (
  unit: Unit,
  unitType: TySymbol,
): boolean =>
  isNormalizedJobnet(unitType)
    ? resolveHasSchedule(findUnitParameterValues(unit, "sd"))
    : false;

export const resolveNormalizedIsRootJobnet = (
  unit: Unit,
  unitType: TySymbol,
): boolean =>
  isNormalizedJobnet(unitType)
    ? resolveIsRootJobnet(findUnitParameterValue(unit.parent, "ty"))
    : false;
