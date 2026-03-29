import * as vscode from "vscode";
import { ViewerFactory } from "../webview/ViewerFactory";
import { MyExtension } from "../MyExtension";
import { initReactPanel } from "../webview/reactPanel";
import { BUNDLE_SRC } from "../webview/constant";

type ExecuteOpenPreviewCommandArgs = {
  panelFactory: ViewerFactory;
  myExtension: MyExtension;
};

export const executeOpenPreviewCommand = ({
  panelFactory,
  myExtension,
}: ExecuteOpenPreviewCommandArgs): void => {
  const viewType = panelFactory.viewType;
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    void vscode.window.showErrorMessage("No active editor found to open.");
    return;
  }

  console.log(
    `invoke open.${viewType}. (${activeEditor.document.uri.toString()})`,
  );
  const document = activeEditor.document;
  const panel = panelFactory.getPanel(document);
  initReactPanel(myExtension.context, panel, viewType, BUNDLE_SRC);
  myExtension.reporter.sendTelemetryEvent(viewType, {
    development: String(DEVELOPMENT),
  });
};

export const registerPreviewCommand = (
  panelFactory: ViewerFactory,
  myExtension: MyExtension,
): vscode.Disposable => {
  const viewType = panelFactory.viewType;
  console.log(`invoke registerPreview. (${viewType})`);
  return vscode.commands.registerCommand(`open.${viewType}`, () => {
    executeOpenPreviewCommand({ panelFactory, myExtension });
  });
};
