import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createViewerEventBridge } from "./viewerEventBridge";

type ViewerComponent = React.ComponentType;

const installViewerBridge = () => {
  window.vscode = acquireVsCodeApi();
  window.EventBridge = createViewerEventBridge();

  window.addEventListener("message", (event) => {
    window.EventBridge.dispatch(event);
  });
};

export const bootstrapViewer = (ViewerApp: ViewerComponent): void => {
  installViewerBridge();

  const container = document.getElementById("root");
  if (!container) {
    return;
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ViewerApp />
    </StrictMode>,
  );
};
