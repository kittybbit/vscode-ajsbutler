import * as vscode from "vscode";
import { mountViewerPanel } from "../webview/mountViewerPanel";

export type PreviewPanelFactory = {
  getPanel(document: vscode.TextDocument): vscode.WebviewPanel;
};

export type OpenPreviewCommandDependencies = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  trackEvent: (viewType: string, properties: Record<string, string>) => void;
};

type ExecuteOpenPreviewCommandArgs = {
  viewType: string;
  panelFactory: PreviewPanelFactory;
  deps: OpenPreviewCommandDependencies;
};

export const executeOpenPreviewCommand = ({
  viewType,
  panelFactory,
  deps,
}: ExecuteOpenPreviewCommandArgs): void => {
  const activeEditor = deps.getActiveEditor();
  if (!activeEditor) {
    void deps.showErrorMessage("No active editor found to open.");
    return;
  }

  console.log(
    `invoke open.${viewType}. (${activeEditor.document.uri.toString()})`,
  );
  const panel = panelFactory.getPanel(activeEditor.document);
  deps.mountPanel(panel, viewType);
  deps.trackEvent(viewType, {
    development: String(DEVELOPMENT),
  });
};

export const openPreviewCommand = (
  viewType: string,
  panelFactory: PreviewPanelFactory,
  deps: OpenPreviewCommandDependencies,
): void => {
  executeOpenPreviewCommand({
    viewType,
    panelFactory,
    deps,
  });
};

export const createOpenPreviewCommandDependencies = (
  context: vscode.ExtensionContext,
  trackEvent: (viewType: string, properties: Record<string, string>) => void,
): OpenPreviewCommandDependencies => ({
  getActiveEditor: () => vscode.window.activeTextEditor,
  showErrorMessage: (message) => vscode.window.showErrorMessage(message),
  mountPanel: (panel, viewType) => {
    mountViewerPanel(context, panel, viewType);
  },
  trackEvent,
});
