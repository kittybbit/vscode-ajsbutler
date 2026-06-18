import * as vscode from "vscode";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import type { ExtensionDependencies } from "./extensionDependencies";
import { createWebApiImportSubscriptions } from "./webapiImportWiring";
import { createViewerSubscriptions } from "./viewerWiring";

export const createExtensionSubscriptions = (
  context: vscode.ExtensionContext,
  dependencies: ExtensionDependencies,
): vscode.Disposable[] => [
  registerDiagnostics(dependencies.buildSyntaxDiagnostics),
  registerHoverProvider(dependencies.findParameterHover),
  ...createWebApiImportSubscriptions({
    telemetry: dependencies.telemetry,
    ...dependencies.webApiImport,
  }),
  ...createViewerSubscriptions({
    context,
    telemetry: dependencies.telemetry,
    buildUnitList: dependencies.buildUnitList,
  }),
];
