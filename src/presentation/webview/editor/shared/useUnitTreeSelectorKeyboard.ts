import { useCallback, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { isTreeNavigationKey } from "./unitTreeSelectorModel";
import {
  resolveUnitTreeNavigationKey,
  type UnitTreeNavigationAction,
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

type UnitTreeNavigationActions = Pick<
  UseUnitTreeSelectorKeyboardOptions,
  | "onEnterUnit"
  | "onOpenScope"
  | "onSelectUnit"
  | "requestRowFocus"
  | "setExpanded"
>;

type UnitTreeNavigationOptions = UnitTreeNavigationActions &
  Pick<UseUnitTreeSelectorKeyboardOptions, "visibleRows">;

type UnitTreeNavigationActionHandler = (
  targetUnitId: string,
  event: KeyboardEvent<HTMLElement>,
  actions: UnitTreeNavigationActions,
) => void;

const applyUnitTreeSelection: UnitTreeNavigationActionHandler = (
  targetUnitId,
  event,
  actions,
) => {
  actions.onSelectUnit(targetUnitId);
  if (event.key === "Enter") actions.onEnterUnit?.(targetUnitId);
};

const unitTreeNavigationActionHandlers: Record<
  UnitTreeNavigationAction["kind"],
  UnitTreeNavigationActionHandler
> = {
  collapse: (targetUnitId, _event, actions) =>
    actions.setExpanded(targetUnitId, false),
  expand: (targetUnitId, _event, actions) =>
    actions.setExpanded(targetUnitId, true),
  focus: (targetUnitId, _event, actions) =>
    actions.requestRowFocus(targetUnitId),
  select: applyUnitTreeSelection,
  "open-scope": (targetUnitId, _event, actions) =>
    actions.onOpenScope?.(targetUnitId),
};

const applyUnitTreeNavigationAction = (
  action: UnitTreeNavigationAction,
  event: KeyboardEvent<HTMLElement>,
  actions: UnitTreeNavigationActions,
): void =>
  unitTreeNavigationActionHandlers[action.kind](
    action.targetUnitId,
    event,
    actions,
  );

const handleUnitTreeNavigationKey = (
  event: KeyboardEvent<HTMLElement>,
  unitId: string,
  options: UnitTreeNavigationOptions,
): void => {
  const result = resolveUnitTreeNavigationKey(options.visibleRows, unitId, {
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    key: event.key,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  });
  if (!result.suppressDefault) return;
  event.preventDefault();
  event.stopPropagation();
  if (!result.action) return;
  applyUnitTreeNavigationAction(result.action, event, options);
};

const isOwnedUnitTreeRowKeyDown = (
  event: KeyboardEvent<HTMLElement>,
): boolean => {
  const target = event.target as HTMLElement | null;
  return (
    target?.closest?.('[role="treeitem"]') === event.currentTarget &&
    (event.target === event.currentTarget || isTreeNavigationKey(event.key))
  );
};

const handleOwnedUnitTreeRowKeyDown = (
  event: KeyboardEvent<HTMLElement>,
  unitId: string,
  handleNavigationKey: (
    event: KeyboardEvent<HTMLElement>,
    unitId: string,
  ) => void,
): void => {
  if (!isOwnedUnitTreeRowKeyDown(event)) return;
  handleNavigationKey(event, unitId);
};

const isUnmodifiedEscape = (event: KeyboardEvent<HTMLElement>): boolean =>
  event.key === "Escape" &&
  ![event.altKey, event.ctrlKey, event.metaKey, event.shiftKey].some(Boolean);

const isWithinUnitTreeRow = (event: KeyboardEvent<HTMLElement>): boolean => {
  const target = event.target as HTMLElement | null;
  return Boolean(target?.closest?.('[role="treeitem"]'));
};

const handleUnitTreeEscapeCapture = (
  event: KeyboardEvent<HTMLElement>,
  onEscape: VoidFunction | undefined,
): void => {
  if (!onEscape || !isUnmodifiedEscape(event) || !isWithinUnitTreeRow(event)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  onEscape();
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
  const options = useMemo(
    () => ({
      onEnterUnit,
      onOpenScope,
      onSelectUnit,
      requestRowFocus,
      setExpanded,
      visibleRows,
    }),
    [
      onEnterUnit,
      onOpenScope,
      onSelectUnit,
      requestRowFocus,
      setExpanded,
      visibleRows,
    ],
  );
  const handleUnitTreeKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, unitId: string) => {
      handleUnitTreeNavigationKey(event, unitId, options);
    },
    [options],
  );

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, unitId: string) =>
      handleOwnedUnitTreeRowKeyDown(event, unitId, handleUnitTreeKeyDown),
    [handleUnitTreeKeyDown],
  );

  const handleSelectorKeyDownCapture = useCallback(
    (event: KeyboardEvent<HTMLElement>) =>
      handleUnitTreeEscapeCapture(event, onEscape),
    [onEscape],
  );

  return {
    handleRowKeyDown,
    handleSelectorKeyDownCapture,
  };
};
