import * as vscode from "vscode";
import { ViewerFactory } from "../webview/ViewerFactory";
import { MyExtension } from "../MyExtension";
import { initReactPanel } from "../webview/reactPanel";
import { BUNDLE_SRC } from "../webview/constant";

export const registerPreview = (
  panelFactory: ViewerFactory,
  myExtension: MyExtension,
) => {
  const viewType = panelFactory.viewType;
  console.log(`invoke registerPreview. (${viewType})`);
  vscode.commands.registerCommand(`open.${viewType}`, () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      console.log(
        `invoke open.${viewType}. (${activeEditor.document.uri.toString()})`,
      );
      const document = activeEditor.document;
      const panel = panelFactory.getPanel(document);
      initReactPanel(myExtension.context, panel, viewType, BUNDLE_SRC);
      myExtension.reporter.sendTelemetryEvent(viewType, {
        development: String(DEVELOPMENT),
      });
    } else {
      vscode.window.showErrorMessage("No active editor found to open.");
    }
  });
};
