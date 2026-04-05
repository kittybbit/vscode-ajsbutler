import { TySymbol, isTySymbol } from "../../values/AjsType";
import { Unit } from "../../values/Unit";
import { resolveGroupType } from "../units/unitGroupStateHelpers";
import { resolveIsRootJobnet } from "../units/unitJobnetStateHelpers";
import { resolveUnitLayout } from "../units/unitLayoutHelpers";
import { resolveHasSchedule } from "../units/unitScheduleStateHelpers";
import { resolveIsRecovery } from "../units/unitTypeHelpers";
import {
  AjsDependency,
  AjsDependencyType,
  AjsDocument,
  AjsGroupType,
  AjsNormalizationWarning,
  AjsUnit,
} from "./AjsDocument";

const getParameterValues = (unit: Unit, key: string): string[] =>
  unit.parameters
    .filter((parameter) => parameter.key === key)
    .map((parameter) => parameter.value);

const getFirstParameterValue = (unit: Unit, key: string): string | undefined =>
  getParameterValues(unit, key)[0];

const getUnitType = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): TySymbol => {
  const tyValue = getFirstParameterValue(unit, "ty");
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
  return resolveGroupType(getFirstParameterValue(unit, "gty"));
};

const getComment = (unit: Unit): string | undefined => {
  const comment = getFirstParameterValue(unit, "cm");
  return comment?.replace(/^"|"$/g, "");
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
  getParameterValues(unit, "eun").some((value) => value.length > 0);

const getHasSchedule = (unit: Unit, unitType: TySymbol): boolean => {
  if (unitType !== "n") {
    return false;
  }

  return resolveHasSchedule(getParameterValues(unit, "sd"));
};

const getIsRootJobnet = (unit: Unit, unitType: TySymbol): boolean =>
  unitType === "n"
    ? resolveIsRootJobnet(getFirstParameterValue(unit.parent, "ty"))
    : false;

const toDependencyType = (
  relationType: string | undefined,
): AjsDependencyType => (relationType === "con" ? "con" : "seq");

const parseDependency = (
  parameterValue: string,
):
  | { sourceName: string; targetName: string; type: AjsDependencyType }
  | undefined => {
  const sourceName = parameterValue.match(/f=([^,)\s]+)/)?.[1];
  const targetName = parameterValue.match(/t=([^,)\s]+)/)?.[1];
  if (!sourceName || !targetName) {
    return undefined;
  }

  const relationType = parameterValue
    .split(",")
    .map((part) => part.trim())
    .at(-1)
    ?.replace(/\)$/, "");

  return {
    sourceName,
    targetName,
    type: toDependencyType(relationType),
  };
};

const normalizeUnit = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): AjsUnit => {
  const unitType = getUnitType(unit, warnings);
  const children = unit.children.map((child) => normalizeUnit(child, warnings));
  const childByName = new Map(children.map((child) => [child.name, child]));
  const dependencies: AjsDependency[] = getParameterValues(unit, "ar")
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
    depth: unit.absolutePath().split("/").filter(Boolean).length - 1,
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
