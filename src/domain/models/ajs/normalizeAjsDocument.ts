import { Unit } from "../../values/Unit";
import { resolveUnitDepth } from "../units/unitDepthHelpers";
import { resolveIsRecovery } from "../units/unitTypeHelpers";
import { AjsDocument, AjsNormalizationWarning, AjsUnit } from "./AjsDocument";
import { resolveNormalizedRelations } from "./normalizeRelationHelpers";
import {
  resolveNormalizedComment,
  resolveNormalizedGroupType,
  resolveNormalizedHasSchedule,
  resolveNormalizedHasWaitedFor,
  resolveNormalizedIsRootJobnet,
  resolveNormalizedLayout,
  resolveNormalizedUnitType,
} from "./normalizeUnitHelpers";

const normalizeUnit = (
  unit: Unit,
  warnings: AjsNormalizationWarning[],
): AjsUnit => {
  const unitType = resolveNormalizedUnitType(unit, warnings);
  const children = unit.children.map((child) => normalizeUnit(child, warnings));
  const relations = resolveNormalizedRelations(unit, children, warnings);

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
