import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createImportAjsDefinitionError,
  type ImportAjsDefinitionHostKind,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";
import {
  IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
  type ImportAjsDefinitionCapability,
  executeImportAjsDefinitionViaWebApiCommand,
} from "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand";

export type WebApiImportWiringDeps = {
  host: ImportAjsDefinitionHostKind;
  importCapability: ImportAjsDefinitionCapability;
  telemetry: TelemetryPort;
};

export const createWebApiImportSubscriptions = ({
  host,
  importCapability,
  telemetry,
}: WebApiImportWiringDeps): vscode.Disposable[] => {
  return [
    vscode.commands.registerCommand(
      IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
      () =>
        executeImportAjsDefinitionViaWebApiCommand({
          getHost: () => host,
          getLanguage: () => vscode.env.language,
          showInputBox: (options) => vscode.window.showInputBox(options),
          showInformationMessage: (message) =>
            vscode.window.showInformationMessage(message),
          showErrorMessage: (message) =>
            vscode.window.showErrorMessage(message),
          importCapability,
          now: () => Date.now(),
          reportTelemetry: (event) => telemetry.report(event),
        }),
    ),
  ];
};

export const createWebApiImportCapability = (
  host: ImportAjsDefinitionHostKind,
  createDesktopCapability: () => ImportAjsDefinitionCapability,
): ImportAjsDefinitionCapability => {
  if (host === "desktop") {
    return createDesktopCapability();
  }

  const unavailable = {
    ok: false as const,
    error: createImportAjsDefinitionError(
      "unsupported-host",
      "JP1/AJS WebAPI import beta is available only in the desktop extension host.",
    ),
  };
  return {
    unavailable,
    importDefinition: async () => unavailable,
  };
};
