import { useCallback, useEffect, useReducer } from "react";

export type SelectedFlowNodeAction =
  | { type: "select"; unitId: string }
  | { type: "clear" }
  | { type: "contextChanged" };

export const reduceSelectedFlowNodeId = (
  _selectedUnitId: string | undefined,
  action: SelectedFlowNodeAction,
): string | undefined => (action.type === "select" ? action.unitId : undefined);

export const useSelectedFlowNodeState = (
  documentIdentity: object | undefined,
  currentUnitId: string | undefined,
) => {
  const [selectedUnitId, dispatch] = useReducer(
    reduceSelectedFlowNodeId,
    undefined,
  );

  useEffect(() => {
    dispatch({ type: "contextChanged" });
  }, [currentUnitId, documentIdentity]);

  const selectUnit = useCallback(
    (unitId: string) => dispatch({ type: "select", unitId }),
    [],
  );
  const clearSelection = useCallback(() => dispatch({ type: "clear" }), []);

  return { clearSelection, selectedUnitId, selectUnit };
};
