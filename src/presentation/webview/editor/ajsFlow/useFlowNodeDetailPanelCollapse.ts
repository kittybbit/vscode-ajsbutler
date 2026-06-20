import { useCallback, useEffect, useReducer } from "react";

export type FlowNodeDetailPanelCollapseState = {
  collapsed: boolean;
  isNarrow: boolean;
};

export type FlowNodeDetailPanelCollapseAction =
  | { type: "collapse" }
  | { type: "expand" }
  | { isNarrow: boolean; type: "viewportChanged" };

export const createFlowNodeDetailPanelCollapseState = (
  isNarrow: boolean,
): FlowNodeDetailPanelCollapseState => ({
  collapsed: isNarrow,
  isNarrow,
});

export const reduceFlowNodeDetailPanelCollapseState = (
  state: FlowNodeDetailPanelCollapseState,
  action: FlowNodeDetailPanelCollapseAction,
): FlowNodeDetailPanelCollapseState => {
  if (action.type === "collapse") {
    return state.collapsed ? state : { ...state, collapsed: true };
  }
  if (action.type === "expand") {
    return state.collapsed ? { ...state, collapsed: false } : state;
  }
  if (action.isNarrow === state.isNarrow) {
    return state;
  }
  return {
    collapsed: action.isNarrow ? true : state.collapsed,
    isNarrow: action.isNarrow,
  };
};

export const useFlowNodeDetailPanelCollapse = (isNarrow: boolean) => {
  const [state, dispatch] = useReducer(
    reduceFlowNodeDetailPanelCollapseState,
    isNarrow,
    createFlowNodeDetailPanelCollapseState,
  );

  useEffect(() => {
    dispatch({ type: "viewportChanged", isNarrow });
  }, [isNarrow]);

  const collapse = useCallback(() => dispatch({ type: "collapse" }), []);
  const expand = useCallback(() => dispatch({ type: "expand" }), []);

  return { collapse, collapsed: state.collapsed, expand };
};
