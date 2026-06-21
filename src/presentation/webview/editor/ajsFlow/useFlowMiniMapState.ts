import { useCallback, useReducer } from "react";

export const initialFlowMiniMapVisibility = true;

export const reduceFlowMiniMapVisibility = (visible: boolean): boolean =>
  !visible;

export const useFlowMiniMapState = () => {
  const [showMiniMap, toggle] = useReducer(
    reduceFlowMiniMapVisibility,
    initialFlowMiniMapVisibility,
  );
  const toggleMiniMap = useCallback(() => toggle(), []);

  return { showMiniMap, toggleMiniMap };
};
