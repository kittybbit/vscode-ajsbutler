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

type HoveredFlowNodeActionType = HoveredFlowNodeAction["type"];
type HoveredFlowNodeActionByType<Type extends HoveredFlowNodeActionType> =
  Extract<HoveredFlowNodeAction, { type: Type }>;
type HoveredFlowNodeStateReducer<Type extends HoveredFlowNodeActionType> = (
  state: HoveredFlowNodeState | undefined,
  action: HoveredFlowNodeActionByType<Type>,
) => HoveredFlowNodeState | undefined;

const isSameHoveredTarget = (
  state: HoveredFlowNodeState | undefined,
  action: Pick<HoveredFlowNodeState, "source" | "unitId">,
): boolean => state?.source === action.source && state.unitId === action.unitId;

const enterHoveredFlowNode: HoveredFlowNodeStateReducer<"enter"> = (
  state,
  action,
) => (isSameHoveredTarget(state, action) ? state : action);

const leaveHoveredFlowNode: HoveredFlowNodeStateReducer<"leave"> = (
  state,
  action,
) => (isSameHoveredTarget(state, action) ? undefined : state);

const clearHoveredFlowNode: HoveredFlowNodeStateReducer<
  "contextChanged"
> = () => undefined;

const hoveredFlowNodeReducers: {
  readonly [Type in HoveredFlowNodeActionType]: HoveredFlowNodeStateReducer<Type>;
} = {
  contextChanged: clearHoveredFlowNode,
  enter: enterHoveredFlowNode,
  leave: leaveHoveredFlowNode,
};

export const reduceHoveredFlowNodeState = (
  state: HoveredFlowNodeState | undefined,
  action: HoveredFlowNodeAction,
): HoveredFlowNodeState | undefined =>
  (
    hoveredFlowNodeReducers[action.type] as (
      state: HoveredFlowNodeState | undefined,
      action: HoveredFlowNodeAction,
    ) => HoveredFlowNodeState | undefined
  )(state, action);

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
