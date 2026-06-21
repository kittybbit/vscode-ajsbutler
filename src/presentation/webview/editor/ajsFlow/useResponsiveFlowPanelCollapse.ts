import { useCallback, useEffect, useReducer } from "react";

export type ResponsiveFlowPanelCollapseState = {
  collapsed: boolean;
  isNarrow: boolean;
};

export type ResponsiveFlowPanelCollapseAction =
  | { type: "collapse" }
  | { type: "expand" }
  | { isNarrow: boolean; type: "viewportChanged" };

export const createResponsiveFlowPanelCollapseState = (
  isNarrow: boolean,
): ResponsiveFlowPanelCollapseState => ({
  collapsed: isNarrow,
  isNarrow,
});

export const reduceResponsiveFlowPanelCollapseState = (
  state: ResponsiveFlowPanelCollapseState,
  action: ResponsiveFlowPanelCollapseAction,
): ResponsiveFlowPanelCollapseState => {
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

export const useResponsiveFlowPanelCollapse = (isNarrow: boolean) => {
  const [state, dispatch] = useReducer(
    reduceResponsiveFlowPanelCollapseState,
    isNarrow,
    createResponsiveFlowPanelCollapseState,
  );

  useEffect(() => {
    dispatch({ type: "viewportChanged", isNarrow });
  }, [isNarrow]);

  const collapse = useCallback(() => dispatch({ type: "collapse" }), []);
  const expand = useCallback(() => dispatch({ type: "expand" }), []);

  return { collapse, collapsed: state.collapsed, expand };
};
