import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { collectUnitTreeParentUnitIds } from "../shared/unitTreeSelection";
import { collectExpandedAncestorUnitIds } from "./flowExpandedAncestors";

export type FlowTreeSelectionTarget = {
  selectedUnitId: string;
  expandedNestedUnitIds: string[];
};

export const collectFlowTreeAncestorUnitIds = (
  unitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): string[] =>
  unitId
    ? collectUnitTreeParentUnitIds(unitById.get(unitId), unitById).reverse()
    : [];

export const isUnitInCurrentFlowScope = (
  unit: AjsUnit,
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean => {
  if (!currentUnit || unit.id === currentUnit.id) {
    return Boolean(currentUnit);
  }
  return (
    collectUnitTreeParentUnitIds(unit, unitById).includes(currentUnit.id) ||
    collectUnitTreeParentUnitIds(currentUnit, unitById).includes(unit.id)
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

  const isDescendant = collectUnitTreeParentUnitIds(unit, unitById).includes(
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
