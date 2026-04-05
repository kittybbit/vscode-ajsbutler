import { Unit } from "../../values/Unit";
import { findUnitParameterValues } from "../../values/unitParameterLookupHelpers";
import {
  normalizeAjsRelationType,
  parseUnitEdge,
} from "../parameters/unitEdgeHelpers";
import { resolveUnitDepth } from "../units/unitDepthHelpers";
import { resolveIsRecovery } from "../units/unitTypeHelpers";
import {
  AjsDocument,
  AjsNormalizationWarning,
  AjsRelation,
  AjsUnit,
} from "./AjsDocument";
import {
  resolveNormalizedComment,
  resolveNormalizedGroupType,
  resolveNormalizedHasSchedule,
  resolveNormalizedHasWaitedFor,
  resolveNormalizedIsRootJobnet,
  resolveNormalizedLayout,
  resolveNormalizedUnitType,
} from "./normalizeUnitHelpers";

const parseRelation = (
  parameterValue: string,
):
  | { sourceName: string; targetName: string; type: AjsRelation["type"] }
  | undefined => {
  const relation = parseUnitEdge(parameterValue);
  if (!relation) {
    return undefined;
  }

  return {
    sourceName: relation.sourceName,
    targetName: relation.targetName,
    type: normalizeAjsRelationType(relation.relationType),
  };
};

const normalizeUnit = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): AjsUnit => {
  const unitType = resolveNormalizedUnitType(unit, warnings);
  const children = unit.children.map((child) => normalizeUnit(child, warnings));
  const childByName = new Map(children.map((child) => [child.name, child]));
  const relations: AjsRelation[] = findUnitParameterValues(unit, "ar")
    .map(parseRelation)
    .flatMap((relation) => {
      if (!relation) {
        warnings.push({
          code: "invalid-dependency",
          message: `Dependency could not be parsed for ${unit.absolutePath()}.`,
          unitPath: unit.absolutePath(),
        });
        return [];
      }

      const sourceUnit = childByName.get(relation.sourceName);
      const targetUnit = childByName.get(relation.targetName);
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
          type: relation.type,
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
    groupType: resolveNormalizedGroupType(unit),
    comment: resolveNormalizedComment(unit),
    absolutePath: unit.absolutePath(),
    depth: resolveUnitDepth(unit.absolutePath()),
    parentId: unit.parent?.absolutePath(),
    isRoot: unit.isRoot(),
    isRecovery: resolveIsRecovery(unitType),
    isRootJobnet: resolveNormalizedIsRootJobnet(unit, unitType),
    hasSchedule: resolveNormalizedHasSchedule(unit, unitType),
    hasWaitedFor: resolveNormalizedHasWaitedFor(unit),
    layout: resolveNormalizedLayout(unit),
    parameters: unit.parameters.map((parameter) => ({ ...parameter })),
    relations,
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
