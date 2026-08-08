import { useCallback } from "react";
import type { KeyboardEvent } from "react";
import { isTreeNavigationKey } from "./unitTreeSelectorModel";
import {
  resolveUnitTreeNavigationKey,
  type UnitTreeNavigationRow,
} from "./unitTreeNavigation";

type UseUnitTreeSelectorKeyboardOptions = {
  onEnterUnit?: (unitId: string) => void;
  onEscape?: VoidFunction;
  onOpenScope?: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
  requestRowFocus: (unitId: string) => void;
  setExpanded: (unitId: string, expanded: boolean) => void;
  visibleRows: readonly UnitTreeNavigationRow[];
};

export type UnitTreeSelectorKeyboardHandlers = {
  handleRowKeyDown: (event: KeyboardEvent<HTMLElement>, unitId: string) => void;
  handleSelectorKeyDownCapture: (event: KeyboardEvent<HTMLElement>) => void;
};

export const useUnitTreeSelectorKeyboard = ({
  onEnterUnit,
  onEscape,
  onOpenScope,
  onSelectUnit,
  requestRowFocus,
  setExpanded,
  visibleRows,
}: UseUnitTreeSelectorKeyboardOptions): UnitTreeSelectorKeyboardHandlers => {
  const handleUnitTreeKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, unitId: string) => {
      if (
        event.key === "Escape" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        onEscape
      ) {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
        return;
      }
      const result = resolveUnitTreeNavigationKey(visibleRows, unitId, {
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        key: event.key,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      });
      if (!result.suppressDefault) return;
      event.preventDefault();
      event.stopPropagation();
      const action = result.action;
      if (!action) return;
      switch (action.kind) {
        case "collapse":
        case "expand":
          setExpanded(action.targetUnitId, action.kind === "expand");
          return;
        case "focus":
          requestRowFocus(action.targetUnitId);
          return;
        case "select":
          onSelectUnit(action.targetUnitId);
          if (event.key === "Enter") {
            onEnterUnit?.(action.targetUnitId);
          }
          return;
        case "open-scope":
          onOpenScope?.(action.targetUnitId);
          return;
      }
    },
    [
      onEnterUnit,
      onEscape,
      onOpenScope,
      onSelectUnit,
      requestRowFocus,
      setExpanded,
      visibleRows,
    ],
  );

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, unitId: string) => {
      const target = event.target as HTMLElement | null;
      const owningTreeItem = target?.closest?.('[role="treeitem"]');
      if (owningTreeItem !== event.currentTarget) return;
      if (
        event.target !== event.currentTarget &&
        !isTreeNavigationKey(event.key)
      ) {
        return;
      }
      handleUnitTreeKeyDown(event, unitId);
    },
    [handleUnitTreeKeyDown],
  );

  const handleSelectorKeyDownCapture = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (
        !onEscape ||
        event.key !== "Escape" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.('[role="treeitem"]')) return;
      event.preventDefault();
      event.stopPropagation();
      onEscape();
    },
    [onEscape],
  );

  return {
    handleRowKeyDown,
    handleSelectorKeyDownCapture,
  };
};
