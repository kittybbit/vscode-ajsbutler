import * as vscode from "vscode";
import {
  ActivatedExtension,
  activateExtension,
  deactivateExtension,
} from "./extension/bootstrap/activateExtension";

let activatedExtension: ActivatedExtension | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-ajsbutler" is now active.');
  activatedExtension = activateExtension(context);
}

export function deactivate(): void {
  deactivateExtension(activatedExtension);
  console.log('"vscode-ajsbutler" is deactive.');
}
