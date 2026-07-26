import { TySymbol, isTySymbol } from "../../../../domain/values/AjsType";
import { AjsRawUnit } from "../../raw/AjsRawUnit";
import {
  findUnitParameterValue,
  findUnitParameterValues,
} from "../rawUnitParameterLookup";
import { decodeEncodedString } from "../../../../domain/models/parameters/encodedStringHelpers";
import {
  AjsGroupType,
  AjsNormalizationWarning,
  AjsUnitLayout,
} from "../../../../domain/models/ajs/AjsDocument";
import {
  resolveAjsGroupType,
  resolveAjsUnitHasSchedule,
  resolveAjsUnitHasWaitedFor,
  resolveAjsUnitIsRootJobnet,
  resolveAjsUnitLayout,
} from "../../../../domain/models/ajs/AjsUnitState";
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
  resolveAjsGroupType(findUnitParameterValue(unit, "gty"));

export const resolveNormalizedComment = (
  unit: AjsRawUnit,
): string | undefined =>
  decodeEncodedString(findUnitParameterValue(unit, "cm"));

const ROOT_UNIT_LAYOUT: AjsUnitLayout = { h: 0, v: 0 };

const resolveChildLayout = (
  unit: AjsRawUnit,
  parent: AjsRawUnit,
): AjsUnitLayout =>
  resolveAjsUnitLayout(unit.name, findUnitParameterValues(parent, "el"));

export const resolveNormalizedLayout = (unit: AjsRawUnit): AjsUnitLayout =>
  unit.parent ? resolveChildLayout(unit, unit.parent) : ROOT_UNIT_LAYOUT;

export const resolveNormalizedHasWaitedFor = (unit: AjsRawUnit): boolean =>
  resolveAjsUnitHasWaitedFor(findUnitParameterValues(unit, "eun"));

const isNormalizedJobnet = (unitType: TySymbol): boolean => unitType === "n";

export const resolveNormalizedHasSchedule = (
  unit: AjsRawUnit,
  unitType: TySymbol,
): boolean =>
  isNormalizedJobnet(unitType)
    ? resolveAjsUnitHasSchedule(findUnitParameterValues(unit, "sd"))
    : false;

export const resolveNormalizedIsRootJobnet = (
  unit: AjsRawUnit,
  unitType: TySymbol,
): boolean =>
  isNormalizedJobnet(unitType)
    ? resolveAjsUnitIsRootJobnet(findUnitParameterValue(unit.parent, "ty"))
    : false;
