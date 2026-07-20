import { TySymbol, isTySymbol } from "../../../../domain/values/AjsType";
import { AjsRawUnit } from "../../raw/AjsRawUnit";
import {
  findUnitParameterValue,
  findUnitParameterValues,
} from "../rawUnitParameterLookup";
import { decodeEncodedString } from "../../../../domain/models/parameters/encodedStringHelpers";
import { resolveGroupType } from "../../../../domain/models/units/unitGroupStateHelpers";
import { resolveIsRootJobnet } from "../../../../domain/models/units/unitJobnetStateHelpers";
import type { UnitLayout } from "../../../../domain/models/units/unitLayoutHelpers";
import { resolveUnitLayout } from "../../../../domain/models/units/unitLayoutHelpers";
import { resolveHasSchedule } from "../../../../domain/models/units/unitScheduleStateHelpers";
import { resolveHasWaitedFor } from "../../../../domain/models/units/unitWaitStateHelpers";
import {
  AjsGroupType,
  AjsNormalizationWarning,
} from "../../../../domain/models/ajs/AjsDocument";
import { buildMissingUnitTypeWarning } from "./warnings";

export const resolveNormalizedUnitType = (
  unit: AjsRawUnit,
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
  unit: AjsRawUnit,
): AjsGroupType | undefined =>
  resolveGroupType(findUnitParameterValue(unit, "gty"));

export const resolveNormalizedComment = (
  unit: AjsRawUnit,
): string | undefined =>
  decodeEncodedString(findUnitParameterValue(unit, "cm"));

const ROOT_UNIT_LAYOUT: UnitLayout = { h: 0, v: 0 };

const resolveChildLayout = (unit: AjsRawUnit, parent: AjsRawUnit): UnitLayout =>
  resolveUnitLayout(unit.name, findUnitParameterValues(parent, "el"));

export const resolveNormalizedLayout = (unit: AjsRawUnit): UnitLayout =>
  unit.parent ? resolveChildLayout(unit, unit.parent) : ROOT_UNIT_LAYOUT;

export const resolveNormalizedHasWaitedFor = (unit: AjsRawUnit): boolean =>
  resolveHasWaitedFor(findUnitParameterValues(unit, "eun"));

const isNormalizedJobnet = (unitType: TySymbol): boolean => unitType === "n";

export const resolveNormalizedHasSchedule = (
  unit: AjsRawUnit,
  unitType: TySymbol,
): boolean =>
  isNormalizedJobnet(unitType)
    ? resolveHasSchedule(findUnitParameterValues(unit, "sd"))
    : false;

export const resolveNormalizedIsRootJobnet = (
  unit: AjsRawUnit,
  unitType: TySymbol,
): boolean =>
  isNormalizedJobnet(unitType)
    ? resolveIsRootJobnet(findUnitParameterValue(unit.parent, "ty"))
    : false;
