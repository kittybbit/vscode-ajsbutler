import { useCallback, useEffect, useReducer } from "react";

export type FlowFocusModeAction =
  | { canEnable: boolean; type: "toggle" }
  | { type: "reset" };

export const reduceFlowFocusModeEnabled = (
  enabled: boolean,
  action: FlowFocusModeAction,
): boolean => {
  if (action.type === "reset" || !action.canEnable) {
    return false;
  }
  return !enabled;
};

export const useFlowFocusModeState = (
  documentIdentity: object | undefined,
  currentUnitId: string | undefined,
  selectedUnitId: string | undefined,
) => {
  const [enabled, dispatch] = useReducer(reduceFlowFocusModeEnabled, false);
  const canEnable = Boolean(selectedUnitId);

  useEffect(
    () => dispatch({ type: "reset" }),
    [currentUnitId, documentIdentity],
  );
  useEffect(() => {
    if (!selectedUnitId) {
      dispatch({ type: "reset" });
    }
  }, [selectedUnitId]);

  const toggleFocusMode = useCallback(
    () => dispatch({ type: "toggle", canEnable }),
    [canEnable],
  );

  return {
    canEnableFocusMode: canEnable,
    focusModeEnabled: enabled && canEnable,
    toggleFocusMode,
  };
};
