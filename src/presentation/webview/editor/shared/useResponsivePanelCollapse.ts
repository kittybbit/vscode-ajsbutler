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

const setResponsivePanelCollapsed = (
  state: ResponsivePanelCollapseState,
  collapsed: boolean,
): ResponsivePanelCollapseState =>
  state.collapsed === collapsed ? state : { ...state, collapsed };

const reduceViewportChanged = (
  state: ResponsivePanelCollapseState,
  isNarrow: boolean,
): ResponsivePanelCollapseState =>
  isNarrow === state.isNarrow
    ? state
    : {
        collapsed: isNarrow || state.collapsed,
        isNarrow,
      };

export const reduceResponsivePanelCollapseState = (
  state: ResponsivePanelCollapseState,
  action: ResponsivePanelCollapseAction,
): ResponsivePanelCollapseState => {
  switch (action.type) {
    case "collapse":
      return setResponsivePanelCollapsed(state, true);
    case "expand":
      return setResponsivePanelCollapsed(state, false);
    case "viewportChanged":
      return reduceViewportChanged(state, action.isNarrow);
  }
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
