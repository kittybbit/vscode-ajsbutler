import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import { createViewerSubscriptions } from "./viewerWiring";

export const createExtensionSubscriptions = (
  myExtension: MyExtension,
): vscode.Disposable[] => [
  registerDiagnostics(),
  registerHoverProvider(),
  ...createViewerSubscriptions(myExtension),
];
