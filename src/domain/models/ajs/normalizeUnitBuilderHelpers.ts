import { Unit } from "../../values/Unit";
import { resolveUnitDepth } from "../units/unitDepthHelpers";
import { resolveIsRecovery } from "../units/unitTypeHelpers";
import { AjsRelation, AjsUnit, AjsUnitType } from "./AjsDocument";
import {
  resolveNormalizedComment,
  resolveNormalizedGroupType,
  resolveNormalizedHasSchedule,
  resolveNormalizedHasWaitedFor,
  resolveNormalizedIsRootJobnet,
  resolveNormalizedLayout,
} from "./normalizeUnitHelpers";

export const buildNormalizedUnit = (
  unit: Unit,
  unitType: AjsUnitType,
  relations: AjsRelation[],
  children: AjsUnit[],
): AjsUnit => ({
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
});
