import React from "react";
import { MyAppContextProvider } from "../MyContexts";
import FlowContents from "./FlowContents";

export const AjsFlowViewerApp = () => {
  console.log("render AjsFlowViewerApp.");

  return (
    <MyAppContextProvider>
      <FlowContents />
    </MyAppContextProvider>
  );
};
