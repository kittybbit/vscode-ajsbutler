import * as vscode from "vscode";
import type { BuildSyntaxDiagnostics } from "../../application/editor-feedback/buildSyntaxDiagnostics";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import { createWebApiImportSubscriptions } from "./webapiImportWiring";
import { createViewerSubscriptions } from "./viewerWiring";

export const createExtensionSubscriptions = (
  context: vscode.ExtensionContext,
  telemetry: TelemetryPort,
  application: {
    buildSyntaxDiagnostics: BuildSyntaxDiagnostics;
    buildUnitList: BuildUnitList;
  },
): vscode.Disposable[] => [
  registerDiagnostics(application.buildSyntaxDiagnostics),
  registerHoverProvider(),
  ...createWebApiImportSubscriptions({ context, telemetry }),
  ...createViewerSubscriptions({
    context,
    telemetry,
    buildUnitList: application.buildUnitList,
  }),
];
