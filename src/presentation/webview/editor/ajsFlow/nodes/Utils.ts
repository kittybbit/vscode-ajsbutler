import { AjsNode } from "./AjsNode";
import {
  createViewerNavigationRequest,
  createViewerOperationRequest,
} from "../../../viewerRequestMessages";

export const handleClickChildOpen = (data: AjsNode) => () => {
  const { unitId, setCurrentUnitId } = data;
  window.vscode.postMessage(createViewerOperationRequest("flow.scope.open"));
  setCurrentUnitId(() => unitId);
};

export const handleClickNestedToggle = (data: AjsNode) => () => {
  const { unitId, toggleExpandedUnitId } = data;
  window.vscode.postMessage(createViewerOperationRequest("flow.nested.toggle"));
  toggleExpandedUnitId?.(unitId);
};

export const navigateToTable = (absolutePath: string): void => {
  window.vscode.postMessage(
    createViewerNavigationRequest("table", absolutePath),
  );
};
