import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
  type ImportAjsDefinitionCommandDeps,
  executeImportAjsDefinitionViaWebApiCommand,
} from "../commands/importAjsDefinitionViaWebApiCommand";

export type WebApiImportWiringDeps = Pick<
  ImportAjsDefinitionCommandDeps,
  "storeCredential" | "importPort"
> & {
  telemetry: TelemetryPort;
};

export const createWebApiImportSubscriptions = ({
  telemetry,
  storeCredential,
  importPort,
}: WebApiImportWiringDeps): vscode.Disposable[] => {
  return [
    vscode.commands.registerCommand(
      IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
      () =>
        executeImportAjsDefinitionViaWebApiCommand({
          getHost: () =>
            vscode.env.uiKind === vscode.UIKind.Web ? "web" : "desktop",
          getLanguage: () => vscode.env.language,
          showInputBox: (options) => vscode.window.showInputBox(options),
          showInformationMessage: (message) =>
            vscode.window.showInformationMessage(message),
          showErrorMessage: (message) =>
            vscode.window.showErrorMessage(message),
          storeCredential,
          importPort,
          trackEvent: (eventName, properties) =>
            telemetry.trackEvent(eventName, properties),
        }),
    ),
  ];
};
