import * as vscode from "vscode";
import { MyExtension } from "../MyExtension";
import { createTelemetry } from "../telemetry/createTelemetry";

export const createExtensionRuntime = (
  context: vscode.ExtensionContext,
): MyExtension => {
  const telemetry = createTelemetry();
  return MyExtension.init(context, telemetry);
};
