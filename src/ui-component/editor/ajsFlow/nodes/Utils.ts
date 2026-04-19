import { AjsNode } from "./AjsNode";
import { createNavigationEvent } from "../../../../shared/webviewEvents";

export const handleClickDialogOpen = (data: AjsNode) => () => {
  const { unitDefinition, setDialogData } = data;
  setDialogData(() => unitDefinition);
};

export const handleKeyDownDialogOpen =
  (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    const { unitDefinition, setDialogData } = data;
    event.key === "Enter" && setDialogData(() => unitDefinition);
  };

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

export const handleClickNavigateToTable = (data: AjsNode) => () => {
  window.vscode.postMessage(createNavigationEvent("table", data.absolutePath));
};

export const handleKeyDownNavigateToTable =
  (data: AjsNode) => (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      window.vscode.postMessage(
        createNavigationEvent("table", data.absolutePath),
      );
    }
  };
