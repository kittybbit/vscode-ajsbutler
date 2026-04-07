import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import { createViewerSubscriptions } from "./viewerWiring";

const createEditorAdapterSubscriptions = (): vscode.Disposable[] => [
  registerDiagnostics(),
  registerHoverProvider(),
];

export const createExtensionSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  ...createEditorAdapterSubscriptions(),
  ...createViewerSubscriptions(myExtension),
];
