import type { FlowNodeData } from "../flowNodePresentationModel";
import { createViewerNavigationRequest } from "../../../viewerRequestMessages";

export const handleClickChildOpen = (data: FlowNodeData) => () => {
  const { unitId, setCurrentUnitId } = data;
  setCurrentUnitId(() => unitId);
};

export const handleClickNestedToggle = (data: FlowNodeData) => () => {
  const { unitId, toggleExpandedUnitId } = data;
  toggleExpandedUnitId?.(unitId);
};

export const navigateToTable = (absolutePath: string): void => {
  window.vscode.postMessage(
    createViewerNavigationRequest("table", absolutePath),
  );
};
