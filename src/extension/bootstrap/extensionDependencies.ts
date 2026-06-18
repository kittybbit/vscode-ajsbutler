import type * as vscode from "vscode";
import {
  createBuildSyntaxDiagnostics,
  type BuildSyntaxDiagnostics,
} from "../../application/editor-feedback/buildSyntaxDiagnostics";
import {
  findParameterHover,
  type FindParameterHover,
} from "../../application/editor-feedback/findParameterHover";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createBuildUnitList,
  type BuildUnitList,
} from "../../application/unit-list/buildUnitList";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { Jp1Ajs3WebApiImportAdapter } from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";
import type { ImportAjsDefinitionCommandDeps } from "../commands/importAjsDefinitionViaWebApiCommand";
import { createTelemetry } from "../telemetry/createTelemetry";
import { VscodeWebApiCredentialStore } from "../webapi/VscodeWebApiCredentialStore";

export type ExtensionDependencies = {
  telemetry: TelemetryPort;
  buildSyntaxDiagnostics: BuildSyntaxDiagnostics;
  buildUnitList: BuildUnitList;
  findParameterHover: FindParameterHover;
  webApiImport: Pick<
    ImportAjsDefinitionCommandDeps,
    "storeCredential" | "importPort"
  >;
};

export const createExtensionDependencies = (
  context: vscode.ExtensionContext,
): ExtensionDependencies => {
  const parser = new AntlrAjsParser();
  const credentialStore = new VscodeWebApiCredentialStore(context.secrets);

  return {
    telemetry: createTelemetry(),
    buildSyntaxDiagnostics: createBuildSyntaxDiagnostics(parser),
    buildUnitList: createBuildUnitList(parser),
    findParameterHover,
    webApiImport: {
      storeCredential: (credentialRef, credential) =>
        credentialStore.storeCredential(credentialRef, credential),
      importPort: new Jp1Ajs3WebApiImportAdapter({
        credentialProvider: credentialStore,
      }),
    },
  };
};
