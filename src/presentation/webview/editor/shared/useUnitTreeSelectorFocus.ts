import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import type { UnitTreeFocusRequest } from "./unitTreeSelectorModel";
import {
  resolveUnitTreeFocusCandidate,
  resolveUnitTreeFocusRequestTarget,
  shouldRestoreUnitTreeFallbackFocus,
} from "./unitTreeFocusModel";
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

const setActiveUnitTreeRow = (
  focusedUnitIdRef: MutableRefObject<string | undefined>,
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  unitId: string | undefined,
): void => {
  const previousUnitId = focusedUnitIdRef.current;
  if (previousUnitId !== unitId) {
    rowByUnitId.get(previousUnitId ?? "")?.setAttribute("tabindex", "-1");
  }
  rowByUnitId.get(unitId ?? "")?.setAttribute("tabindex", "0");
  focusedUnitIdRef.current = unitId;
};

const resolvePendingUnitTreeFocus = (
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
  unitId: string,
): string | undefined =>
  focusUnitTreeRow(rowByUnitId, unitId) ? undefined : unitId;

const applyPendingUnitTreeFocus = (
  pendingFocusUnitIdRef: MutableRefObject<string | undefined>,
  visibleUnitIds: readonly string[],
  rowByUnitId: ReadonlyMap<string, HTMLElement>,
): void => {
  const pendingUnitId = pendingFocusUnitIdRef.current;
  if (
    pendingUnitId &&
    (!visibleUnitIds.includes(pendingUnitId) ||
      focusUnitTreeRow(rowByUnitId, pendingUnitId))
  ) {
    pendingFocusUnitIdRef.current = undefined;
  }
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
  const navigableVisibleUnitIds = useMemo(
    () => navigableVisibleRows.map((row) => row.id),
    [navigableVisibleRows],
  );

  const setActiveRow = useCallback(
    (unitId: string | undefined) =>
      setActiveUnitTreeRow(focusedUnitIdRef, rowByUnitIdRef.current, unitId),
    [rowByUnitIdRef],
  );

  useEffect(() => {
    const currentUnitId = focusedUnitIdRef.current;
    const fallbackUnitId = resolveUnitTreeFocusCandidate(
      navigableVisibleUnitIds,
      currentUnitId,
      selectedUnitId,
    );
    const focusWasInsideFocusedRow =
      rowByUnitIdRef.current
        .get(currentUnitId ?? "")
        ?.contains(document.activeElement) ?? false;
    if (
      shouldRestoreUnitTreeFallbackFocus(
        currentUnitId,
        fallbackUnitId,
        focusWasInsideFocusedRow,
      )
    ) {
      pendingFocusUnitIdRef.current = fallbackUnitId;
    }
    setActiveRow(fallbackUnitId);
  }, [navigableVisibleUnitIds, rowByUnitIdRef, selectedUnitId, setActiveRow]);

  const requestRowFocus = useCallback(
    (unitId: string) => {
      setActiveRow(unitId);
      pendingFocusUnitIdRef.current = resolvePendingUnitTreeFocus(
        rowByUnitIdRef.current,
        unitId,
      );
    },
    [rowByUnitIdRef, setActiveRow],
  );

  useEffect(() => {
    const requestRevision = focusRequest?.revision;
    if (
      requestRevision === undefined ||
      requestRevision <= handledFocusRequestRevisionRef.current
    ) {
      return;
    }
    if (collapsed) {
      expand();
      return;
    }
    const targetUnitId = resolveUnitTreeFocusRequestTarget(
      navigableVisibleUnitIds,
      focusRequest.targetUnitId,
    );
    if (targetUnitId) {
      requestRowFocus(targetUnitId);
      handledFocusRequestRevisionRef.current = requestRevision;
    }
  }, [
    collapsed,
    expand,
    focusRequest,
    navigableVisibleUnitIds,
    requestRowFocus,
  ]);

  useEffect(() => {
    applyPendingUnitTreeFocus(
      pendingFocusUnitIdRef,
      navigableVisibleUnitIds,
      rowByUnitIdRef.current,
    );
  }, [navigableVisibleUnitIds, rowByUnitIdRef]);

  const handleRowFocus = useCallback(
    (unitId: string) => {
      setActiveRow(unitId);
    },
    [setActiveRow],
  );

  return { handleRowFocus, requestRowFocus };
};
