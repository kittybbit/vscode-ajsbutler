import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { MyExtension } from "./MyExtension";

export type ExtensionHostKind = "desktop" | "web";

export const resolveExtensionHost = (
  uiKind: vscode.UIKind,
): ExtensionHostKind => (uiKind === vscode.UIKind.Web ? "web" : "desktop");

export const createExtensionRuntime = (
  context: vscode.ExtensionContext,
  telemetry: TelemetryPort,
): MyExtension => MyExtension.init(context, telemetry);
