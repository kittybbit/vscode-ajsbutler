import { AjsNode } from "./AjsNode";
import { createNavigationEvent } from "../../../../../shared/webviewEvents";

export const handleClickChildOpen = (data: AjsNode) => () => {
  const { unitId, setCurrentUnitId } = data;
  setCurrentUnitId(() => unitId);
};

export const handleKeyDownChildOpen =
  (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitId, setCurrentUnitId } = data;
    event.key === "Enter" && setCurrentUnitId(() => unitId);
  };

export const handleClickNestedToggle = (data: AjsNode) => () => {
  const { unitId, toggleExpandedUnitId } = data;
  toggleExpandedUnitId?.(unitId);
};

export const handleKeyDownNestedToggle =
  (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitId, toggleExpandedUnitId } = data;
    if (event.key === "Enter") {
      toggleExpandedUnitId?.(unitId);
    }
  };

export const navigateToTable = (absolutePath: string): void => {
  window.vscode.postMessage(createNavigationEvent("table", absolutePath));
};
