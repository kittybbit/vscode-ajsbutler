import React, { FC, memo, useCallback, useMemo } from "react";
import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import UnitTreeSelector from "../shared/UnitTreeSelector";
import { CurrentUnitIdStateType } from "./flowViewerStateTypes";
import { isUnitInCurrentFlowScope } from "./flowTreeSelection";

type FlowSelectorProps = {
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  currentUnitIdState: CurrentUnitIdStateType;
  hoveredUnitId?: string;
  selectedUnitId?: string;
  onHoverUnit: (unitId: string) => void;
  onLeaveUnit: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
};

const isRootJobnetUnit = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

export const isSelectableFlowScopeUnit = (unit: AjsUnit): boolean =>
  isRootJobnetUnit(unit);

const FlowSelector: FC<FlowSelectorProps> = ({
  rootUnits,
  unitById,
  currentUnitIdState,
  hoveredUnitId,
  selectedUnitId,
  onHoverUnit,
  onLeaveUnit,
  onSelectUnit,
}) => {
  console.log("render FlowSelector.");

  const { currentUnitId, setCurrentUnitId } = currentUnitIdState;
  const currentUnit = currentUnitId ? unitById.get(currentUnitId) : undefined;
  const isUnitEnabled = useCallback(
    (unit: AjsUnit) => isUnitInCurrentFlowScope(unit, currentUnit, unitById),
    [currentUnit, unitById],
  );
  const canOpenScopeUnit = useMemo(() => isSelectableFlowScopeUnit, []);

  return (
    <UnitTreeSelector
      rootUnits={rootUnits}
      unitById={unitById}
      currentUnitId={currentUnitId}
      hoveredUnitId={hoveredUnitId}
      selectedUnitId={selectedUnitId}
      canOpenScopeUnit={canOpenScopeUnit}
      isUnitEnabled={isUnitEnabled}
      onHoverUnit={onHoverUnit}
      onLeaveUnit={onLeaveUnit}
      onOpenScope={setCurrentUnitId}
      onSelectUnit={onSelectUnit}
    />
  );
};

export default memo(FlowSelector);
