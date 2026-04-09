import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { ViewerFactory } from "../webview/ViewerFactory";
import { mountViewerPanel } from "../webview/mountViewerPanel";

type PreviewPanelFactory = Pick<ViewerFactory, "getPanel">;

type OpenPreviewCommandDependencies = {
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

const createDependencies = (
  myExtension: MyExtension,
): OpenPreviewCommandDependencies => ({
  getActiveEditor: () => vscode.window.activeTextEditor,
  showErrorMessage: (message) => vscode.window.showErrorMessage(message),
  mountPanel: (panel, viewType) => {
    mountViewerPanel(myExtension.context, panel, viewType);
  },
  trackEvent: (viewType, properties) => {
    myExtension.telemetry.trackEvent(viewType, properties);
  },
});

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
  myExtension: MyExtension,
): void => {
  executeOpenPreviewCommand({
    viewType,
    panelFactory,
    deps: createDependencies(myExtension),
  });
};
