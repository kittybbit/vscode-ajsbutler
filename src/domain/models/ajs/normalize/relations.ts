import { findUnitParameterValues } from "../../../values/unitParameterLookupHelpers";
import { Unit } from "../../../values/Unit";
import {
  normalizeAjsRelationType,
  parseUnitEdge,
} from "../../parameters/unitEdgeHelpers";
import { AjsNormalizationWarning, AjsRelation, AjsUnit } from "../AjsDocument";
import {
  buildInvalidRelationWarning,
  buildMissingRelationTargetWarning,
} from "./warnings";

type ParsedNormalizedRelation = {
  sourceName: string;
  targetName: string;
  type: AjsRelation["type"];
};

type RelationResolutionContext = {
  childByName: Map<string, AjsUnit>;
  unitPath: string;
  warnings: AjsNormalizationWarning[];
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

const buildChildLookup = (children: AjsUnit[]): Map<string, AjsUnit> =>
  new Map(children.map((child) => [child.name, child]));

const recordInvalidRelationWarning = (
  context: RelationResolutionContext,
): void => {
  context.warnings.push(buildInvalidRelationWarning(context.unitPath));
};

const recordMissingRelationTargetWarning = (
  context: RelationResolutionContext,
): void => {
  context.warnings.push(buildMissingRelationTargetWarning(context.unitPath));
};

const buildResolvedRelation = (
  relation: ParsedNormalizedRelation,
  childByName: Map<string, AjsUnit>,
): AjsRelation | undefined => {
  const sourceUnit = childByName.get(relation.sourceName);
  const targetUnit = childByName.get(relation.targetName);

  if (!sourceUnit || !targetUnit) {
    return undefined;
  }

  return {
    sourceUnitId: sourceUnit.id,
    targetUnitId: targetUnit.id,
    type: relation.type,
  };
};

const resolveNormalizedRelationValue = (
  parameterValue: string,
  context: RelationResolutionContext,
): AjsRelation[] => {
  const relation = parseNormalizedRelation(parameterValue);
  if (!relation) {
    recordInvalidRelationWarning(context);
    return [];
  }

  const resolvedRelation = buildResolvedRelation(relation, context.childByName);
  if (!resolvedRelation) {
    recordMissingRelationTargetWarning(context);
    return [];
  }

  return [resolvedRelation];
};

export const resolveNormalizedRelations = (
  unit: Unit,
  children: AjsUnit[],
  warnings: AjsNormalizationWarning[],
): AjsRelation[] => {
  const context: RelationResolutionContext = {
    childByName: buildChildLookup(children),
    unitPath: unit.absolutePath(),
    warnings,
  };

  return findUnitParameterValues(unit, "ar").flatMap((parameterValue) =>
    resolveNormalizedRelationValue(parameterValue, context),
  );
};
