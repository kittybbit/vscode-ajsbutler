import * as vscode from "vscode";
import { ViewerFactory } from "../webview/ViewerFactory";
import { MyExtension } from "../MyExtension";
import { openPreviewCommand } from "./openPreviewCommand";

export const registerPreviewCommand = (
  panelFactory: ViewerFactory,
  myExtension: MyExtension,
): vscode.Disposable => {
  const viewType = panelFactory.viewType;
  console.log(`invoke registerPreview. (${viewType})`);
  return vscode.commands.registerCommand(`open.${viewType}`, () => {
    openPreviewCommand(panelFactory, myExtension);
  });
};
