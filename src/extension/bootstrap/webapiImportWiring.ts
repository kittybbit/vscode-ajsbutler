import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { Jp1Ajs3WebApiImportAdapter } from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";
import {
  IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
  executeImportAjsDefinitionViaWebApiCommand,
} from "../commands/importAjsDefinitionViaWebApiCommand";
import { VscodeWebApiCredentialStore } from "../webapi/VscodeWebApiCredentialStore";

export type WebApiImportWiringDeps = {
  context: vscode.ExtensionContext;
  telemetry: TelemetryPort;
};

export const createWebApiImportSubscriptions = ({
  context,
  telemetry,
}: WebApiImportWiringDeps): vscode.Disposable[] => {
  const credentialStore = new VscodeWebApiCredentialStore(context.secrets);
  const importPort = new Jp1Ajs3WebApiImportAdapter({
    credentialProvider: credentialStore,
  });

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
          storeCredential: (credentialRef, credential) =>
            credentialStore.storeCredential(credentialRef, credential),
          importPort,
          trackEvent: (eventName, properties) =>
            telemetry.trackEvent(eventName, properties),
        }),
    ),
  ];
};
