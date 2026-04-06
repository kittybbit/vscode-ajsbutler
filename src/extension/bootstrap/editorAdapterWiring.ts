import * as vscode from "vscode";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../languages/registerHoverProvider";

export const createEditorAdapterSubscriptions = (): vscode.Disposable[] => [
  registerDiagnostics(),
  registerHoverProvider(),
];
