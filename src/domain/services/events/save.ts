import * as vscode from "vscode";
import { SaveEventType } from "./event.types";

export const save = (e: SaveEventType) => {
  console.log("invoke save.");
  vscode.window.showSaveDialog().then((uri) => {
    if (uri) {
      if (typeof e.data === "string") {
        vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(e.data));
        vscode.window.showInformationMessage("The file has been saved.", {
          detail: uri.toString(),
          modal: true,
        });
      } else {
        vscode.window.showErrorMessage(
          "Data is not a string and cannot be saved.",
        );
      }
    } else {
      vscode.window.showErrorMessage("The file has not been saved.");
    }
  });
};
