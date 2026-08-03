import * as vscode from "vscode";
import { getViewerBundleSrc } from "./constant";
import { initReactPanel } from "./reactPanel";

type MountViewerPanelDeps = {
  getViewerBundleSrc: typeof getViewerBundleSrc;
  initReactPanel: typeof initReactPanel;
};

const defaultDeps: MountViewerPanelDeps = {
  getViewerBundleSrc,
  initReactPanel,
};

export const mountViewerPanel = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  viewType: string,
  deps: MountViewerPanelDeps = defaultDeps,
): void => {
  deps.initReactPanel(context, panel, deps.getViewerBundleSrc(viewType));
};
