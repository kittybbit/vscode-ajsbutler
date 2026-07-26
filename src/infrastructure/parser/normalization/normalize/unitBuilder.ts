import { AjsRawUnit } from "../../raw/AjsRawUnit";
import {
  resolveAjsUnitDepth,
  resolveAjsUnitIsRecovery,
} from "../../../../domain/models/ajs/AjsUnitState";
import {
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../../../domain/models/ajs/AjsDocument";
import {
  resolveNormalizedComment,
  resolveNormalizedGroupType,
  resolveNormalizedHasSchedule,
  resolveNormalizedHasWaitedFor,
  resolveNormalizedIsRootJobnet,
  resolveNormalizedLayout,
} from "./unit";

export type NormalizedUnitInput = {
  unit: AjsRawUnit;
  unitType: AjsUnitType;
  relations: AjsRelation[];
  children: AjsUnit[];
};

export const buildNormalizedUnit = ({
  unit,
  unitType,
  relations,
  children,
}: NormalizedUnitInput): AjsUnit => ({
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
  depth: resolveAjsUnitDepth(unit.absolutePath()),
  parentId: unit.parent?.absolutePath(),
  isRoot: unit.isRoot(),
  isRecovery: resolveAjsUnitIsRecovery(unitType),
  isRootJobnet: resolveNormalizedIsRootJobnet(unit, unitType),
  hasSchedule: resolveNormalizedHasSchedule(unit, unitType),
  hasWaitedFor: resolveNormalizedHasWaitedFor(unit),
  layout: resolveNormalizedLayout(unit),
  parameters: unit.parameters.map((parameter) => ({
    key: parameter.key,
    value: parameter.value,
    position: parameter.position,
    line: parameter.line,
    column: parameter.column,
    length: parameter.length,
  })),
  relations,
  children,
});
