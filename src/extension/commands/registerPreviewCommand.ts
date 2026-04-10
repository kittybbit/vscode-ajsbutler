import * as vscode from "vscode";

export const registerPreviewCommand = (
  viewType: string,
  execute: () => void,
): vscode.Disposable => {
  console.log(`invoke registerPreview. (${viewType})`);
  return vscode.commands.registerCommand(`open.${viewType}`, execute);
};
