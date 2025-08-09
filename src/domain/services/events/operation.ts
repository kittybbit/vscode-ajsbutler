import { TelemetryReporter } from "@vscode/extension-telemetry";
import * as vscode from "vscode";
import { OPERATION } from "./constant";

export const operation = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
  reporter: TelemetryReporter,
  operation: string,
) => {
  console.log(
    `post a message of operation. (${document.uri.toString()}, ${operation})`,
  );
  reporter.sendTelemetryEvent(OPERATION, {
    development: String(DEVELOPMENT),
    viewType: panel.viewType,
    operation: operation,
  });
};
