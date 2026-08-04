import { Dispatch, SetStateAction, useCallback, useState } from "react";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { collectUnitTreeParentUnitIds } from "../shared/unitTreeSelection";
import { collectExpandedAncestorUnitIds } from "./flowExpandedAncestors";
import type { FlowViewportFocusRequest } from "./flowViewportFocus";

export type FlowTreeSelectionTarget = {
  selectedUnitId: string;
  expandedNestedUnitIds: string[];
};

type FlowTreeSelectionStateParams = {
  currentUnit?: FlowGraphUnitDto;
  selectUnit: (unitId: string) => void;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
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

const mergeExpandedUnitIds = (
  currentUnitIds: string[],
  requiredUnitIds: readonly string[],
): string[] => {
  const mergedUnitIds = [...new Set([...currentUnitIds, ...requiredUnitIds])];
  return mergedUnitIds.length === currentUnitIds.length
    ? currentUnitIds
    : mergedUnitIds;
};

export const useFlowTreeSelectionState = ({
  currentUnit,
  selectUnit,
  setExpandedUnitIds,
  unitById,
}: FlowTreeSelectionStateParams) => {
  const [selectionFocusRequest, setSelectionFocusRequest] =
    useState<FlowViewportFocusRequest>({ version: 0 });
  const selectTreeUnit = useCallback(
    (unitId: string) => {
      const target = resolveFlowTreeSelectionTarget(
        unitId,
        currentUnit,
        unitById,
      );
      if (!target) {
        return;
      }
      setExpandedUnitIds((current) =>
        mergeExpandedUnitIds(current, target.expandedNestedUnitIds),
      );
      selectUnit(target.selectedUnitId);
      setSelectionFocusRequest((current) => ({
        targetUnitId: target.selectedUnitId,
        version: current.version + 1,
      }));
    },
    [currentUnit, selectUnit, setExpandedUnitIds, unitById],
  );

  return { selectTreeUnit, selectionFocusRequest };
};
