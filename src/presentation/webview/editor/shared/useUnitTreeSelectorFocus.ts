import { useCallback, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { UnitTreeFocusRequest } from "./unitTreeSelectorModel";
import { focusUnitTreeRow } from "./useUnitTreeSelectorState";
import type { UnitTreeNavigationRow } from "./unitTreeNavigation";

type UseUnitTreeSelectorFocusOptions = {
  collapsed: boolean;
  expand: () => void;
  focusRequest?: UnitTreeFocusRequest;
  navigableVisibleRows: readonly UnitTreeNavigationRow[];
  rowByUnitIdRef: MutableRefObject<Map<string, HTMLElement>>;
  selectedUnitId?: string;
};

export type UnitTreeSelectorFocusHandlers = {
  handleRowFocus: (unitId: string) => void;
  requestRowFocus: (unitId: string) => void;
};

export const useUnitTreeSelectorFocus = ({
  collapsed,
  expand,
  focusRequest,
  navigableVisibleRows,
  rowByUnitIdRef,
  selectedUnitId,
}: UseUnitTreeSelectorFocusOptions): UnitTreeSelectorFocusHandlers => {
  const focusedUnitIdRef = useRef<string | undefined>(undefined);
  const pendingFocusUnitIdRef = useRef<string | undefined>(undefined);
  const handledFocusRequestRevisionRef = useRef(0);

  const setActiveRow = useCallback(
    (unitId: string | undefined) => {
      const previousUnitId = focusedUnitIdRef.current;
      if (previousUnitId && previousUnitId !== unitId) {
        rowByUnitIdRef.current
          .get(previousUnitId)
          ?.setAttribute("tabindex", "-1");
      }
      if (unitId) {
        rowByUnitIdRef.current.get(unitId)?.setAttribute("tabindex", "0");
      }
      focusedUnitIdRef.current = unitId;
    },
    [rowByUnitIdRef],
  );

  useEffect(() => {
    const currentUnitId = focusedUnitIdRef.current;
    if (
      currentUnitId &&
      navigableVisibleRows.some((row) => row.id === currentUnitId)
    ) {
      setActiveRow(currentUnitId);
      return;
    }
    const fallbackUnitId =
      navigableVisibleRows.find((row) => row.id === selectedUnitId)?.id ??
      navigableVisibleRows[0]?.id;
    if (
      currentUnitId &&
      fallbackUnitId &&
      rowByUnitIdRef.current
        .get(currentUnitId)
        ?.contains(document.activeElement)
    ) {
      pendingFocusUnitIdRef.current = fallbackUnitId;
    }
    setActiveRow(fallbackUnitId);
  }, [navigableVisibleRows, rowByUnitIdRef, selectedUnitId, setActiveRow]);

  const requestRowFocus = useCallback(
    (unitId: string) => {
      setActiveRow(unitId);
      pendingFocusUnitIdRef.current = focusUnitTreeRow(
        rowByUnitIdRef.current,
        unitId,
      )
        ? undefined
        : unitId;
    },
    [rowByUnitIdRef, setActiveRow],
  );

  useEffect(() => {
    const revision = focusRequest?.revision ?? 0;
    if (revision <= handledFocusRequestRevisionRef.current) return;
    if (collapsed) {
      expand();
      return;
    }
    const requestedUnitId = focusRequest?.targetUnitId;
    if (
      requestedUnitId &&
      !navigableVisibleRows.some((row) => row.id === requestedUnitId)
    ) {
      return;
    }
    const targetUnitId = requestedUnitId ?? navigableVisibleRows[0]?.id;
    if (!targetUnitId) return;
    requestRowFocus(targetUnitId);
    handledFocusRequestRevisionRef.current = revision;
  }, [collapsed, expand, focusRequest, navigableVisibleRows, requestRowFocus]);

  useEffect(() => {
    const pendingUnitId = pendingFocusUnitIdRef.current;
    if (!pendingUnitId) return;
    if (!navigableVisibleRows.some((row) => row.id === pendingUnitId)) {
      pendingFocusUnitIdRef.current = undefined;
      return;
    }
    if (focusUnitTreeRow(rowByUnitIdRef.current, pendingUnitId)) {
      pendingFocusUnitIdRef.current = undefined;
    }
  }, [navigableVisibleRows, rowByUnitIdRef]);

  const handleRowFocus = useCallback(
    (unitId: string) => {
      setActiveRow(unitId);
    },
    [setActiveRow],
  );

  return { handleRowFocus, requestRowFocus };
};
