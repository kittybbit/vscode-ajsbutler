import { TySymbol, isTySymbol } from "../../values/AjsType";
import { Unit } from "../../values/Unit";
import {
  findUnitParameterValue,
  findUnitParameterValues,
} from "../../values/unitParameterLookupHelpers";
import { decodeEncodedString } from "../parameters/encodedStringHelpers";
import { parseUnitEdge } from "../parameters/unitEdgeHelpers";
import { resolveGroupType } from "../units/unitGroupStateHelpers";
import { resolveUnitDepth } from "../units/unitDepthHelpers";
import { resolveIsRootJobnet } from "../units/unitJobnetStateHelpers";
import { resolveUnitLayout } from "../units/unitLayoutHelpers";
import { resolveHasSchedule } from "../units/unitScheduleStateHelpers";
import { resolveHasWaitedFor } from "../units/unitWaitStateHelpers";
import { resolveIsRecovery } from "../units/unitTypeHelpers";
import {
  AjsDependency,
  AjsDependencyType,
  AjsDocument,
  AjsGroupType,
  AjsNormalizationWarning,
  AjsUnit,
} from "./AjsDocument";

const getUnitType = (
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

const getGroupType = (unit: Unit): AjsGroupType | undefined => {
  return resolveGroupType(findUnitParameterValue(unit, "gty"));
};

const getComment = (unit: Unit): string | undefined => {
  return decodeEncodedString(findUnitParameterValue(unit, "cm"));
};

const getLayout = (unit: Unit): { h: number; v: number } => {
  if (!unit.parent) {
    return { h: 0, v: 0 };
  }

  return resolveUnitLayout(
    unit.name,
    unit.parent.parameters
      .filter((parameter) => parameter.key === "el")
      .map((parameter) => parameter.value),
  );
};

const getHasWaitedFor = (unit: Unit): boolean =>
  resolveHasWaitedFor(findUnitParameterValues(unit, "eun"));

const getHasSchedule = (unit: Unit, unitType: TySymbol): boolean => {
  if (unitType !== "n") {
    return false;
  }

  return resolveHasSchedule(findUnitParameterValues(unit, "sd"));
};

const getIsRootJobnet = (unit: Unit, unitType: TySymbol): boolean =>
  unitType === "n"
    ? resolveIsRootJobnet(findUnitParameterValue(unit.parent, "ty"))
    : false;

const toDependencyType = (
  relationType: string | undefined,
): AjsDependencyType => (relationType === "con" ? "con" : "seq");

const parseDependency = (
  parameterValue: string,
):
  | { sourceName: string; targetName: string; type: AjsDependencyType }
  | undefined => {
  const relation = parseUnitEdge(parameterValue);
  if (!relation) {
    return undefined;
  }

  return {
    sourceName: relation.sourceName,
    targetName: relation.targetName,
    type: toDependencyType(relation.relationType),
  };
};

const normalizeUnit = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): AjsUnit => {
  const unitType = getUnitType(unit, warnings);
  const children = unit.children.map((child) => normalizeUnit(child, warnings));
  const childByName = new Map(children.map((child) => [child.name, child]));
  const dependencies: AjsDependency[] = findUnitParameterValues(unit, "ar")
    .map(parseDependency)
    .flatMap((dependency) => {
      if (!dependency) {
        warnings.push({
          code: "invalid-dependency",
          message: `Dependency could not be parsed for ${unit.absolutePath()}.`,
          unitPath: unit.absolutePath(),
        });
        return [];
      }

      const sourceUnit = childByName.get(dependency.sourceName);
      const targetUnit = childByName.get(dependency.targetName);
      if (!sourceUnit || !targetUnit) {
        warnings.push({
          code: "missing-dependency-target",
          message: `Dependency target was not found for ${unit.absolutePath()}.`,
          unitPath: unit.absolutePath(),
        });
        return [];
      }

      return [
        {
          sourceUnitId: sourceUnit.id,
          targetUnitId: targetUnit.id,
          type: dependency.type,
        },
      ];
    });

  return {
    id: unit.absolutePath(),
    name: unit.name,
    unitAttribute: unit.unitAttribute,
    permission: unit.permission,
    jp1Username: unit.jp1Username,
    jp1ResourceGroup: unit.jp1ResourceGroup,
    unitType,
    groupType: getGroupType(unit),
    comment: getComment(unit),
    absolutePath: unit.absolutePath(),
    depth: resolveUnitDepth(unit.absolutePath()),
    parentId: unit.parent?.absolutePath(),
    isRoot: unit.isRoot(),
    isRecovery: resolveIsRecovery(unitType),
    isRootJobnet: getIsRootJobnet(unit, unitType),
    hasSchedule: getHasSchedule(unit, unitType),
    hasWaitedFor: getHasWaitedFor(unit),
    layout: getLayout(unit),
    parameters: unit.parameters.map((parameter) => ({ ...parameter })),
    dependencies,
    children,
  };
};

export const normalizeAjsDocument = (rootUnits: Unit[]): AjsDocument => {
  const warnings: AjsNormalizationWarning[] = [];
  return {
    rootUnits: rootUnits.map((rootUnit) => normalizeUnit(rootUnit, warnings)),
    warnings,
  };
};
