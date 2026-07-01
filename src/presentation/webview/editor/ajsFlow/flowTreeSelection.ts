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

const isSelectableFlowTreeTarget = (
  unit: AjsUnit | undefined,
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): unit is AjsUnit =>
  Boolean(
    currentUnit &&
      unit &&
      isUnitInCurrentFlowScope(unit, currentUnit, unitById),
  );

const resolveSelectableFlowTreeUnit = (
  unitId: string,
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): AjsUnit | undefined => {
  const unit = unitById.get(unitId);
  return isSelectableFlowTreeTarget(unit, currentUnit, unitById)
    ? unit
    : undefined;
};

const isDescendantOfCurrentFlowScope = (
  unit: AjsUnit,
  currentUnit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean =>
  collectUnitTreeParentUnitIds(unit, unitById).includes(currentUnit.id);

const collectRequiredExpandedNestedUnitIds = (
  unit: AjsUnit,
  currentUnit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): string[] =>
  isDescendantOfCurrentFlowScope(unit, currentUnit, unitById)
    ? collectExpandedAncestorUnitIds({
        scopeUnit: currentUnit,
        unit,
        unitById,
      })
    : [];

export const resolveFlowTreeSelectionTarget = (
  unitId: string,
  currentUnit: AjsUnit | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
): FlowTreeSelectionTarget | undefined => {
  const unit = resolveSelectableFlowTreeUnit(unitId, currentUnit, unitById);
  if (!unit || !currentUnit) {
    return undefined;
  }

  return {
    selectedUnitId: unit.id,
    expandedNestedUnitIds: collectRequiredExpandedNestedUnitIds(
      unit,
      currentUnit,
      unitById,
    ),
  };
};
