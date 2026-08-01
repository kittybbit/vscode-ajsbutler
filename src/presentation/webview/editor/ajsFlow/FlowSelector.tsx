import React, { FC, memo, useCallback, useMemo } from "react";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import UnitTreeSelector, {
  type UnitTreeFocusRequest,
} from "../shared/UnitTreeSelector";
import { CurrentUnitIdStateType } from "./flowViewerStateTypes";
import { isUnitInCurrentFlowScope } from "./flowTreeSelection";

type FlowSelectorProps = {
  rootUnits: FlowGraphUnitDto[];
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
  currentUnitIdState: CurrentUnitIdStateType;
  focusRequest?: UnitTreeFocusRequest;
  hoveredUnitId?: string;
  selectedUnitId?: string;
  title?: string;
  ariaLabel?: string;
  collapsedAriaLabel?: string;
  onHoverUnit: (unitId: string) => void;
  onLeaveUnit: (unitId: string) => void;
  onEscape?: VoidFunction;
  onEnterUnit?: (unitId: string) => void;
  onOpenScope?: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
};

const isRootJobnetUnit = (unit: FlowGraphUnitDto): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

export const isSelectableFlowScopeUnit = (unit: FlowGraphUnitDto): boolean =>
  isRootJobnetUnit(unit);

function* walkFlowScopeUnits(
  units: readonly FlowGraphUnitDto[],
): Generator<FlowGraphUnitDto> {
  for (const unit of units) {
    yield unit;
    yield* walkFlowScopeUnits(unit.children);
  }
}

const findFirstSelectableFlowScopeUnit = (
  units: readonly FlowGraphUnitDto[],
): FlowGraphUnitDto | undefined =>
  Array.from(walkFlowScopeUnits(units)).find(isSelectableFlowScopeUnit);

export const resolveFlowSelectorFocusTarget = (
  currentUnitId: string | undefined,
  rootUnits: readonly FlowGraphUnitDto[],
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): string | undefined =>
  currentUnitId && unitById.has(currentUnitId)
    ? currentUnitId
    : findFirstSelectableFlowScopeUnit(rootUnits)?.id;

const FlowSelector: FC<FlowSelectorProps> = ({
  rootUnits,
  unitById,
  currentUnitIdState,
  focusRequest,
  hoveredUnitId,
  selectedUnitId,
  title,
  ariaLabel,
  collapsedAriaLabel,
  onHoverUnit,
  onLeaveUnit,
  onEscape,
  onEnterUnit,
  onOpenScope,
  onSelectUnit,
}) => {
  console.log("render FlowSelector.");

  const { currentUnitId, setCurrentUnitId } = currentUnitIdState;
  const currentUnit = currentUnitId ? unitById.get(currentUnitId) : undefined;
  const isUnitEnabled = useCallback(
    (unit: FlowGraphUnitDto) =>
      isUnitInCurrentFlowScope(unit, currentUnit, unitById),
    [currentUnit, unitById],
  );
  const canOpenScopeUnit = useMemo(() => isSelectableFlowScopeUnit, []);

  return (
    <UnitTreeSelector
      rootUnits={rootUnits}
      unitById={unitById}
      currentUnitId={currentUnitId}
      focusRequest={focusRequest}
      hoveredUnitId={hoveredUnitId}
      selectedUnitId={selectedUnitId}
      title={title}
      ariaLabel={ariaLabel}
      collapsedAriaLabel={collapsedAriaLabel}
      canOpenScopeUnit={canOpenScopeUnit}
      isUnitEnabled={isUnitEnabled}
      onHoverUnit={onHoverUnit}
      onLeaveUnit={onLeaveUnit}
      onEscape={onEscape}
      onEnterUnit={onEnterUnit}
      onOpenScope={onOpenScope ?? setCurrentUnitId}
      onSelectUnit={onSelectUnit}
    />
  );
};

export default memo(FlowSelector);
