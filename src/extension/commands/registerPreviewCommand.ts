import * as vscode from "vscode";
import { ViewerFactory } from "../webview/ViewerFactory";
import { MyExtension } from "../MyExtension";
import { openPreviewCommand } from "./openPreviewCommand";

export const registerPreviewCommand = (
  viewType: string,
  panelFactory: ViewerFactory,
  myExtension: MyExtension,
): vscode.Disposable => {
  console.log(`invoke registerPreview. (${viewType})`);
  return vscode.commands.registerCommand(`open.${viewType}`, () => {
    openPreviewCommand(viewType, panelFactory, myExtension);
  });
};
