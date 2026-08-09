import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";

export type UnitTreeFocusRequest = {
  revision: number;
  targetUnitId?: string;
};

export type UnitTreeRowState = {
  hasChildren: boolean;
  isCurrent: boolean;
  isEnabled: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isInCurrentPath: boolean;
  isSelected: boolean;
  canOpenScope: boolean;
};

export type UnitTreeRowStateInput = {
  canOpenScopeUnit: (unit: FlowGraphUnitDto) => boolean;
  currentPathUnitIds: ReadonlySet<string>;
  currentUnitId?: string;
  expandedUnitIds: ReadonlySet<string>;
  hoveredUnitId?: string;
  isUnitEnabled: (unit: FlowGraphUnitDto) => boolean;
  hasOpenScopeHandler: boolean;
  selectedUnitId?: string;
};

export const isTreeNavigationKey = (key: string): boolean =>
  key === "ArrowDown" ||
  key === "ArrowUp" ||
  key === "ArrowLeft" ||
  key === "ArrowRight" ||
  key === "Home" ||
  key === "End";

export const resolveUnitTreeRowState = (
  unit: FlowGraphUnitDto,
  props: UnitTreeRowStateInput,
): UnitTreeRowState => {
  const hasChildren = unit.children.length > 0;
  return {
    hasChildren,
    isCurrent: props.currentUnitId === unit.id,
    isEnabled: props.isUnitEnabled(unit),
    isExpanded: hasChildren && props.expandedUnitIds.has(unit.id),
    isHovered: props.hoveredUnitId === unit.id,
    isInCurrentPath: props.currentPathUnitIds.has(unit.id),
    isSelected: props.selectedUnitId === unit.id,
    canOpenScope: props.canOpenScopeUnit(unit) && props.hasOpenScopeHandler,
  };
};

export const notifyEnabledUnit = (
  isEnabled: boolean,
  unitId: string,
  callback: ((unitId: string) => void) | undefined,
): void => {
  if (isEnabled) {
    callback?.(unitId);
  }
};

export const resolveUnitTreeRowBackgroundColor = ({
  isHovered,
  isInCurrentPath,
  isSelected,
}: UnitTreeRowState): string =>
  [
    { matches: isSelected, color: "action.selected" },
    { matches: isHovered, color: "action.hover" },
    { matches: isInCurrentPath, color: "action.hover" },
  ].find(({ matches }) => matches)?.color ?? "transparent";

export const resolveUnitTreeRowBorderColor = (
  rowState: UnitTreeRowState,
  selectedColor: string,
): string => (rowState.isSelected ? selectedColor : "transparent");

export const resolveUnitTreeRowBorderStyle = (
  rowState: Pick<UnitTreeRowState, "isSelected" | "isInCurrentPath">,
): "double" | "dashed" | "solid" =>
  rowState.isSelected
    ? "double"
    : rowState.isInCurrentPath
      ? "dashed"
      : "solid";

export const resolveUnitTreeRowOutline = (
  rowState: UnitTreeRowState,
  hoveredColor: string,
): string => (rowState.isHovered ? `2px solid ${hoveredColor}` : "none");
