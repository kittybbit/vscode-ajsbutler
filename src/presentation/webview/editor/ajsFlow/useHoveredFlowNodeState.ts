import { useCallback, useEffect, useReducer } from "react";

export type FlowHoverSource = "tree" | "graph";

export type HoveredFlowNodeState = {
  source: FlowHoverSource;
  unitId: string;
};

export type HoveredFlowNodeAction =
  | { type: "enter"; source: FlowHoverSource; unitId: string }
  | { type: "leave"; source: FlowHoverSource; unitId: string }
  | { type: "contextChanged" };

export const reduceHoveredFlowNodeState = (
  state: HoveredFlowNodeState | undefined,
  action: HoveredFlowNodeAction,
): HoveredFlowNodeState | undefined => {
  if (action.type === "enter") {
    if (state?.source === action.source && state.unitId === action.unitId) {
      return state;
    }
    return { source: action.source, unitId: action.unitId };
  }
  if (action.type === "leave") {
    return state?.source === action.source && state.unitId === action.unitId
      ? undefined
      : state;
  }
  return undefined;
};

export const useHoveredFlowNodeState = (
  documentIdentity: object | undefined,
  currentUnitId: string | undefined,
) => {
  const [hoveredState, dispatch] = useReducer(
    reduceHoveredFlowNodeState,
    undefined,
  );

  useEffect(() => {
    dispatch({ type: "contextChanged" });
  }, [currentUnitId, documentIdentity]);

  const enter = useCallback(
    (source: FlowHoverSource, unitId: string) =>
      dispatch({ type: "enter", source, unitId }),
    [],
  );
  const leave = useCallback(
    (source: FlowHoverSource, unitId: string) =>
      dispatch({ type: "leave", source, unitId }),
    [],
  );

  return {
    clearGraphHoveredUnit: useCallback(
      (unitId: string) => leave("graph", unitId),
      [leave],
    ),
    clearTreeHoveredUnit: useCallback(
      (unitId: string) => leave("tree", unitId),
      [leave],
    ),
    graphHoveredUnit: useCallback(
      (unitId: string) => enter("graph", unitId),
      [enter],
    ),
    hoveredUnitId: hoveredState?.unitId,
    treeHoveredUnit: useCallback(
      (unitId: string) => enter("tree", unitId),
      [enter],
    ),
    treeHoveredUnitId:
      hoveredState?.source === "tree" ? hoveredState.unitId : undefined,
  };
};
