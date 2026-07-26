import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { collectUnitTreeParentUnitIds } from "../shared/unitTreeSelection";
import { collectExpandedAncestorUnitIds } from "./flowExpandedAncestors";

export type FlowTreeSelectionTarget = {
  selectedUnitId: string;
  expandedNestedUnitIds: string[];
};

export const collectFlowTreeAncestorUnitIds = (
  unitId: string | undefined,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): string[] =>
  unitId
    ? collectUnitTreeParentUnitIds(unitById.get(unitId), unitById).reverse()
    : [];

export const isUnitInCurrentFlowScope = (
  unit: FlowGraphUnitDto,
  currentUnit: FlowGraphUnitDto | undefined,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
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
  unit: FlowGraphUnitDto | undefined,
  currentUnit: FlowGraphUnitDto | undefined,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): unit is FlowGraphUnitDto =>
  Boolean(
    currentUnit &&
      unit &&
      isUnitInCurrentFlowScope(unit, currentUnit, unitById),
  );

const resolveSelectableFlowTreeUnit = (
  unitId: string,
  currentUnit: FlowGraphUnitDto | undefined,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): FlowGraphUnitDto | undefined => {
  const unit = unitById.get(unitId);
  return isSelectableFlowTreeTarget(unit, currentUnit, unitById)
    ? unit
    : undefined;
};

const isDescendantOfCurrentFlowScope = (
  unit: FlowGraphUnitDto,
  currentUnit: FlowGraphUnitDto,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): boolean =>
  collectUnitTreeParentUnitIds(unit, unitById).includes(currentUnit.id);

const collectRequiredExpandedNestedUnitIds = (
  unit: FlowGraphUnitDto,
  currentUnit: FlowGraphUnitDto,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
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
  currentUnit: FlowGraphUnitDto | undefined,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
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
