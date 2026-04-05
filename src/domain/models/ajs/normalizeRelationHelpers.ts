import { findUnitParameterValues } from "../../values/unitParameterLookupHelpers";
import { Unit } from "../../values/Unit";
import {
  normalizeAjsRelationType,
  parseUnitEdge,
} from "../parameters/unitEdgeHelpers";
import { AjsNormalizationWarning, AjsRelation, AjsUnit } from "./AjsDocument";
import {
  buildInvalidRelationWarning,
  buildMissingRelationTargetWarning,
} from "./normalizeWarningHelpers";

type ParsedNormalizedRelation = {
  sourceName: string;
  targetName: string;
  type: AjsRelation["type"];
};

export const parseNormalizedRelation = (
  parameterValue: string,
): ParsedNormalizedRelation | undefined => {
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

export const resolveNormalizedRelations = (
  unit: Unit,
  children: AjsUnit[],
  warnings: AjsNormalizationWarning[],
): AjsRelation[] => {
  const childByName = new Map(children.map((child) => [child.name, child]));

  return findUnitParameterValues(unit, "ar")
    .map(parseNormalizedRelation)
    .flatMap((relation) => {
      if (!relation) {
        warnings.push(buildInvalidRelationWarning(unit.absolutePath()));
        return [];
      }

      const sourceUnit = childByName.get(relation.sourceName);
      const targetUnit = childByName.get(relation.targetName);
      if (!sourceUnit || !targetUnit) {
        warnings.push(buildMissingRelationTargetWarning(unit.absolutePath()));
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
};
