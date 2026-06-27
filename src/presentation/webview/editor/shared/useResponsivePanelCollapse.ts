import { useCallback, useEffect, useReducer } from "react";

export type ResponsivePanelCollapseState = {
  collapsed: boolean;
  isNarrow: boolean;
};

export type ResponsivePanelCollapseAction =
  | { type: "collapse" }
  | { type: "expand" }
  | { isNarrow: boolean; type: "viewportChanged" };

export const createResponsivePanelCollapseState = (
  isNarrow: boolean,
): ResponsivePanelCollapseState => ({
  collapsed: isNarrow,
  isNarrow,
});

export const reduceResponsivePanelCollapseState = (
  state: ResponsivePanelCollapseState,
  action: ResponsivePanelCollapseAction,
): ResponsivePanelCollapseState => {
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

export const useResponsivePanelCollapse = (isNarrow: boolean) => {
  const [state, dispatch] = useReducer(
    reduceResponsivePanelCollapseState,
    isNarrow,
    createResponsivePanelCollapseState,
  );

  useEffect(() => {
    dispatch({ type: "viewportChanged", isNarrow });
  }, [isNarrow]);

  const collapse = useCallback(() => dispatch({ type: "collapse" }), []);
  const expand = useCallback(() => dispatch({ type: "expand" }), []);

  return { collapse, collapsed: state.collapsed, expand };
};
