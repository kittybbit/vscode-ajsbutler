import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { MyExtension } from "../MyExtension";

export const createExtensionRuntime = (
  context: vscode.ExtensionContext,
  telemetry: TelemetryPort,
): MyExtension => MyExtension.init(context, telemetry);
