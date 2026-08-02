import * as vscode from "vscode";
import { registerDiagnostics } from "../../presentation/vscode/diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../../presentation/vscode/languages/registerHoverProvider";
import type { ExtensionDependencies } from "./extensionDependencies";
import { createWebApiImportSubscriptions } from "./webapiImportWiring";
import { createViewerSubscriptions } from "./viewerWiring";
import { createSemanticDiffSubscriptions } from "./semanticDiffWiring";

export const createExtensionSubscriptions = (
  context: vscode.ExtensionContext,
  dependencies: ExtensionDependencies,
): vscode.Disposable[] => [
  registerDiagnostics(
    dependencies.diagnoseAjsDefinition,
    dependencies.telemetry,
  ),
  registerHoverProvider(
    dependencies.findParameterHover,
    dependencies.telemetry,
  ),
  ...createWebApiImportSubscriptions({
    host: dependencies.host,
    importCapability: dependencies.webApiImport,
    telemetry: dependencies.telemetry,
  }),
  ...createSemanticDiffSubscriptions(dependencies.semanticDiff),
  ...createViewerSubscriptions({
    context,
    telemetry: dependencies.telemetry,
    buildUnitList: dependencies.buildUnitList,
  }),
];
