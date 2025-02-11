import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AjsTableViewerApp } from "./ajsTable/AjsTableViewerApp";
import { AjsFlowViewerApp } from "./ajsFlow/AjfFlowViewerApp";

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

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
