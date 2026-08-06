import type { FlowNodeData } from "../flowNodePresentationModel";
import {
  createViewerNavigationRequest,
  createViewerOperationRequest,
} from "../../../viewerRequestMessages";

export const handleClickChildOpen = (data: FlowNodeData) => () => {
  const { unitId, setCurrentUnitId } = data;
  window.vscode.postMessage(createViewerOperationRequest("flow.scope.open"));
  setCurrentUnitId(() => unitId);
};

export const handleClickNestedToggle = (data: FlowNodeData) => () => {
  const { unitId, toggleExpandedUnitId } = data;
  window.vscode.postMessage(createViewerOperationRequest("flow.nested.toggle"));
  toggleExpandedUnitId?.(unitId);
};

export const navigateToTable = (absolutePath: string): void => {
  window.vscode.postMessage(
    createViewerNavigationRequest("table", absolutePath),
  );
};
