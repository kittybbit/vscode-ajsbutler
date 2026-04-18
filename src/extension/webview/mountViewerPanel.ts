import * as vscode from "vscode";
import { getViewerBundleSrc } from "./constant";
import { initReactPanel } from "./reactPanel";

export const mountViewerPanel = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  viewType: string,
): void => {
  initReactPanel(context, panel, getViewerBundleSrc(viewType));
};
