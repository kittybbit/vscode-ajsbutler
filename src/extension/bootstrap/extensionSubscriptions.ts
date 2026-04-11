import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { registerDiagnostics } from "../diagnostics/registerDiagnostics";
import { registerHoverProvider } from "../languages/registerHoverProvider";
import { createViewerSubscriptions } from "./viewerWiring";

export const createExtensionSubscriptions = (
  context: vscode.ExtensionContext,
  telemetry: TelemetryPort,
): vscode.Disposable[] => [
  registerDiagnostics(),
  registerHoverProvider(),
  ...createViewerSubscriptions({ context, telemetry }),
];
