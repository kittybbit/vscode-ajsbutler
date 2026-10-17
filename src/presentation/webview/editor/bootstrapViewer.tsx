import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createViewerDisplayAcknowledgementRequest } from "../viewerRequestMessages";
import { createViewerEventBridge } from "./viewerEventBridge";

type ViewerComponent = React.ComponentType;

const installViewerBridge = () => {
  window.vscode = acquireVsCodeApi();
  window.EventBridge = createViewerEventBridge();

  window.addEventListener("message", (event) => {
    window.EventBridge.dispatch(event);
  });
};

const reportDisplayFailure = (): void => {
  try {
    window.vscode?.postMessage(
      createViewerDisplayAcknowledgementRequest("failed"),
    );
  } catch {
    // Startup failure remains isolated when the transport is unavailable.
  }
};

export const bootstrapViewer = (ViewerApp: ViewerComponent): void => {
  try {
    installViewerBridge();
    const container = document.getElementById("root");
    if (!container) {
      reportDisplayFailure();
      return;
    }

    const root = createRoot(container, {
      onUncaughtError: reportDisplayFailure,
    });
    root.render(
      <StrictMode>
        <ViewerApp />
      </StrictMode>,
    );
  } catch {
    reportDisplayFailure();
  }
};
