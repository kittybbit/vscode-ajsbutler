import type { MouseEvent } from "react";
import { notifyEnabledUnit } from "./unitTreeSelectorModel";

type UnitTreeRowPointerEvent = Pick<
  MouseEvent<HTMLElement>,
  "currentTarget" | "target"
>;

export type UnitTreeRowInteractionOptions = {
  isEnabled: boolean;
  onSelectUnit: (unitId: string) => void;
  unitId: string;
};

export type UnitTreeRowInteraction = {
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onMouseDown: (event: MouseEvent<HTMLElement>) => void;
};

export const isUnitTreeRowEventTarget = (
  event: UnitTreeRowPointerEvent,
): boolean => {
  const owningTreeItem = (event.target as HTMLElement | null)?.closest?.(
    '[role="treeitem"]',
  );
  return owningTreeItem === event.currentTarget;
};

export const createUnitTreeRowInteraction = ({
  isEnabled,
  onSelectUnit,
  unitId,
}: UnitTreeRowInteractionOptions): UnitTreeRowInteraction => ({
  onClick: (event) => {
    if (!isUnitTreeRowEventTarget(event)) return;
    notifyEnabledUnit(isEnabled, unitId, onSelectUnit);
  },
  onMouseDown: (event) => {
    if (!isEnabled || !isUnitTreeRowEventTarget(event)) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
  },
});
