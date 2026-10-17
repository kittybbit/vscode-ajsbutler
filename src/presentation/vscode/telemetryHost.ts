import * as vscode from "vscode";
import type { TelemetryHost } from "../../application/telemetry/telemetryEvent";

export const resolveTelemetryHost = (uiKind: vscode.UIKind): TelemetryHost =>
  uiKind === vscode.UIKind.Web ? "web" : "desktop";

export const getTelemetryHost = (): TelemetryHost =>
  resolveTelemetryHost(vscode.env.uiKind);
