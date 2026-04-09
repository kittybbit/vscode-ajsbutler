import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import {
  openPreviewCommand,
  type PreviewPanelFactory,
} from "./openPreviewCommand";

export const registerPreviewCommand = (
  viewType: string,
  panelFactory: PreviewPanelFactory,
  myExtension: MyExtension,
): vscode.Disposable => {
  console.log(`invoke registerPreview. (${viewType})`);
  return vscode.commands.registerCommand(`open.${viewType}`, () => {
    openPreviewCommand(viewType, panelFactory, myExtension);
  });
};
