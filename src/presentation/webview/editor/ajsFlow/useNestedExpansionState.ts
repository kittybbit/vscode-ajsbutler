import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { NestedExpansionStateType } from "./flowViewerStateTypes";
import {
  collapseExpandedNestedUnitIds,
  collectExpandableNestedUnitIds,
  hasExpandedAllNestedUnitIds,
} from "./nestedExpansion";

type UseNestedExpansionStateParams = {
  currentUnit?: FlowGraphUnitDto;
  expandedUnitIds: string[];
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

const toggleNestedUnitId = (
  expandedUnitIds: readonly string[],
  unitId: string,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): string[] =>
  expandedUnitIds.includes(unitId)
    ? collapseExpandedNestedUnitIds(
        expandedUnitIds,
        unitId,
        unitById.get(unitId),
      )
    : [...expandedUnitIds, unitId];

const toggleAllNestedUnitIds = (
  expandedUnitIds: readonly string[],
  expandableUnitIds: readonly string[],
): string[] => {
  const expandedUnitIdSet = new Set(expandedUnitIds);
  if (hasExpandedAllNestedUnitIds(expandableUnitIds, expandedUnitIdSet)) {
    return expandedUnitIds.filter(
      (unitId) => !expandableUnitIds.includes(unitId),
    );
  }

  return [...new Set([...expandedUnitIds, ...expandableUnitIds])];
};

export const useNestedExpansionState = ({
  currentUnit,
  expandedUnitIds,
  setExpandedUnitIds,
  unitById,
}: UseNestedExpansionStateParams) => {
  const expandedUnitIdSet = useMemo(
    () => new Set(expandedUnitIds),
    [expandedUnitIds],
  );
  const expandableNestedUnitIds = useMemo(
    () => collectExpandableNestedUnitIds(currentUnit),
    [currentUnit],
  );
  const hasExpandedAllNestedUnits = useMemo(
    () =>
      hasExpandedAllNestedUnitIds(expandableNestedUnitIds, expandedUnitIdSet),
    [expandableNestedUnitIds, expandedUnitIdSet],
  );

  const toggleExpandedUnitId = useCallback(
    (unitId: string) => {
      setExpandedUnitIds((prev) => toggleNestedUnitId(prev, unitId, unitById));
    },
    [setExpandedUnitIds, unitById],
  );

  const toggleExpandAllNestedUnits = useCallback(() => {
    if (expandableNestedUnitIds.length === 0) {
      return;
    }
    setExpandedUnitIds((prev) =>
      toggleAllNestedUnitIds(prev, expandableNestedUnitIds),
    );
  }, [expandableNestedUnitIds, setExpandedUnitIds]);

  const nestedExpansionState = useMemo<NestedExpansionStateType>(
    () => ({
      expandedUnitIds: expandedUnitIdSet,
      toggleExpandedUnitId,
    }),
    [expandedUnitIdSet, toggleExpandedUnitId],
  );

  return {
    expandableNestedUnitIds,
    hasExpandedAllNestedUnits,
    nestedExpansionState,
    toggleExpandAllNestedUnits,
  };
};
