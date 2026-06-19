import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

type ViewerComponent = React.ComponentType;

const installViewerBridge = () => {
  window.vscode = acquireVsCodeApi();
  window.EventBridge = {
    callbacks: {}, // {[type: string]: (type: string, data: unknown) => void}
    dispatch: (event) => {
      if (!event.data || typeof event.data !== "object") {
        return;
      }
      const type = event.data.type;
      if (typeof type !== "string") {
        return;
      }
      const functions = window.EventBridge.callbacks[type];
      if (functions) {
        functions.forEach((fn) => {
          fn(event.data.type, event.data.data);
        });
      }
    },
    addCallback: (type, fn) => {
      let functions = window.EventBridge.callbacks[type];
      if (!functions) {
        functions = [];
        window.EventBridge.callbacks[type] = functions;
      }
      functions.push(fn);
    },
    removeCallback: (type, fn) => {
      let functions = window.EventBridge.callbacks[type];
      if (!functions) {
        return;
      }
      functions = functions.filter((item) => item !== fn);
      window.EventBridge.callbacks[type] = functions;
    },
  };

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
