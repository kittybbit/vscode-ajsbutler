import * as vscode from "vscode";
import { BUNDLE_SRC } from "./constant";
import { initReactPanel } from "./reactPanel";

export const mountViewerPanel = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  viewType: string,
): void => {
  initReactPanel(context, panel, viewType, BUNDLE_SRC);
};
