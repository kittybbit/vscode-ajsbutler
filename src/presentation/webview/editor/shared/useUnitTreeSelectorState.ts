import { useCallback, useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { collectUnitTreeAncestorUnitIds } from "./unitTreeSelection";

const isDefinedUnitId = (unitId: string | undefined): unitId is string =>
  unitId !== undefined && unitId.length > 0;

export const mergeUnitIds = (
  current: Set<string>,
  requiredUnitIds: readonly (string | undefined)[],
): Set<string> => {
  const newUnitIds = requiredUnitIds.filter(
    (unitId): unitId is string =>
      isDefinedUnitId(unitId) && !current.has(unitId),
  );
  return newUnitIds.length > 0 ? new Set([...current, ...newUnitIds]) : current;
};

const collectRequiredExpandedUnitIds = (
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
  focusUnitId: string | undefined,
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>,
): readonly (string | undefined)[] => [
  ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
  currentUnitId,
  ...collectUnitTreeAncestorUnitIds(selectedUnitId, unitById),
  ...collectUnitTreeAncestorUnitIds(focusUnitId, unitById),
];

export const collectCurrentPathUnitIds = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>,
): ReadonlySet<string> =>
  new Set([
    ...collectUnitTreeAncestorUnitIds(currentUnitId, unitById),
    ...[currentUnitId].filter(isDefinedUnitId),
  ]);

const setUnitExpanded = (
  current: Set<string>,
  unitId: string,
  expanded: boolean,
): Set<string> => {
  const next = new Set(current);
  if (expanded) {
    next.add(unitId);
  } else {
    next.delete(unitId);
  }
  return next;
};

export type UnitTreeExpansionState = {
  expandedUnitIds: ReadonlySet<string>;
  setExpanded: (unitId: string, expanded: boolean) => void;
};

export const useExpandedUnitTreeState = (
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
  focusUnitId: string | undefined,
  unitById: ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">>,
): UnitTreeExpansionState => {
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  useEffect(() => {
    setExpandedUnitIds((current) =>
      mergeUnitIds(
        current,
        collectRequiredExpandedUnitIds(
          currentUnitId,
          selectedUnitId,
          focusUnitId,
          unitById,
        ),
      ),
    );
  }, [currentUnitId, focusUnitId, selectedUnitId, unitById]);

  const setExpanded = useCallback((unitId: string, expanded: boolean) => {
    setExpandedUnitIds((current) => setUnitExpanded(current, unitId, expanded));
  }, []);

  return { expandedUnitIds, setExpanded };
};

const scheduleSelectedTreeRowScroll = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  selectedUnitId: string,
): (() => void) => {
  let scrollFrameId: number | undefined;
  const expansionFrameId = window.requestAnimationFrame(() => {
    scrollFrameId = window.requestAnimationFrame(() => {
      rowByUnitId.get(selectedUnitId)?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    });
  });
  return () => {
    window.cancelAnimationFrame(expansionFrameId);
    if (scrollFrameId !== undefined) {
      window.cancelAnimationFrame(scrollFrameId);
    }
  };
};

const setUnitTreeRowRef = (
  rowByUnitId: Map<string, HTMLElement>,
  unitId: string,
  element: HTMLElement | null,
): void => {
  if (element) {
    rowByUnitId.set(unitId, element);
  } else {
    rowByUnitId.delete(unitId);
  }
};

const maybeScheduleSelectedTreeRowScroll = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  autoScrollSelectedUnit: boolean,
  selectedUnitId: string | undefined,
): (() => void) | undefined =>
  selectedUnitId && autoScrollSelectedUnit
    ? scheduleSelectedTreeRowScroll(rowByUnitId, selectedUnitId)
    : undefined;

export type UnitTreeRowScrollState = {
  rowByUnitIdRef: MutableRefObject<Map<string, HTMLElement>>;
  setRowRef: (unitId: string, element: HTMLElement | null) => void;
};

export const useSelectedTreeRowScroll = (
  autoScrollSelectedUnit: boolean,
  selectedUnitId: string | undefined,
  expandedUnitIds: ReadonlySet<string>,
): UnitTreeRowScrollState => {
  const rowByUnitIdRef = useRef(new Map<string, HTMLElement>());
  const setRowRef = useCallback(
    (unitId: string, element: HTMLElement | null) => {
      setUnitTreeRowRef(rowByUnitIdRef.current, unitId, element);
    },
    [],
  );

  useEffect(() => {
    return maybeScheduleSelectedTreeRowScroll(
      rowByUnitIdRef.current,
      autoScrollSelectedUnit,
      selectedUnitId,
    );
  }, [autoScrollSelectedUnit, expandedUnitIds, selectedUnitId]);

  return { rowByUnitIdRef, setRowRef };
};

export const focusUnitTreeRow = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  unitId: string,
): boolean => {
  const treeItem = rowByUnitId.get(unitId);
  if (!treeItem) return false;
  treeItem.focus({ preventScroll: true });
  treeItem
    .querySelector<HTMLElement>("[data-unit-tree-row]")
    ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  return true;
};
