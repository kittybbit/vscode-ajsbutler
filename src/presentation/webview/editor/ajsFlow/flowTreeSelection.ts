import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { collectExpandedAncestorUnitIds } from "./flowExpandedAncestors";

export type FlowTreeSelectionTarget = {
  selectedUnitId: string;
  expandedNestedUnitIds: string[];
};

const collectParentUnitIds = (
  unit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): string[] => {
  const parentUnitIds: string[] = [];
  const visited = new Set<string>();
  let parentId = unit?.parentId;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    parentUnitIds.push(parentId);
    parentId = unitById.get(parentId)?.parentId;
  }

  return parentUnitIds;
};

export const collectFlowTreeAncestorUnitIds = (
  unitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): string[] =>
  unitId ? collectParentUnitIds(unitById.get(unitId), unitById).reverse() : [];

export const isUnitInCurrentFlowScope = (
  unit: AjsUnit,
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean => {
  if (!currentUnit || unit.id === currentUnit.id) {
    return Boolean(currentUnit);
  }
  return (
    collectParentUnitIds(unit, unitById).includes(currentUnit.id) ||
    collectParentUnitIds(currentUnit, unitById).includes(unit.id)
  );
};

export const resolveFlowTreeSelectionTarget = (
  unitId: string,
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): FlowTreeSelectionTarget | undefined => {
  const unit = unitById.get(unitId);
  if (
    !unit ||
    !currentUnit ||
    !isUnitInCurrentFlowScope(unit, currentUnit, unitById)
  ) {
    return undefined;
  }

  const isDescendant = collectParentUnitIds(unit, unitById).includes(
    currentUnit.id,
  );
  return {
    selectedUnitId: unit.id,
    expandedNestedUnitIds: isDescendant
      ? collectExpandedAncestorUnitIds({
          scopeUnit: currentUnit,
          unit,
          unitById,
        })
      : [],
  };
};
