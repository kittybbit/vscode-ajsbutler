import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AjsTableViewerApp } from "./ajsTable/AjsTableViewerApp";
import { AjsFlowViewerApp } from "./ajsFlow/AjsFlowViewerApp";

const App: React.FC = () => {
  console.log("render App.");

  const [ready, setReady] = useState(false);
  const [viewType, setViewType] = useState("");

  useEffect(() => {
    const hiddenInput = document.getElementById("viewType") as HTMLInputElement;
    if (hiddenInput) {
      setViewType(hiddenInput.value);
      setReady(() => true);
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <StrictMode>
      {viewType === "ajsbutler.tableViewer" && <AjsTableViewerApp />}
      {viewType === "ajsbutler.flowViewer" && <AjsFlowViewerApp />}
    </StrictMode>
  );
};

window.vscode = acquireVsCodeApi();
window.EventBridge = {
  callbacks: {}, // {[type: string]: (type: string, data: unknown) => void}
  dispatch: (event) => {
    const type = event.data.type;
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
    functions = functions.filter((item) => item !== fn);
    window.EventBridge.callbacks[type] = functions;
  },
};

// Add event receiver in webview.
window.addEventListener("message", (event) => {
  window.EventBridge.dispatch(event);
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
