import type * as vscode from "vscode";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import { createPerformanceTelemetryEvent } from "../../application/telemetry/performanceTelemetry";
import {
  toCountBucket,
  toDurationBucket,
} from "../../application/telemetry/telemetryBuckets";
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
import type { ImportAjsDefinitionCommandDeps } from "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand";
import { VscodeWebApiCredentialStore } from "../../infrastructure/webapi/VscodeWebApiCredentialStore";
import { createTelemetry } from "./createTelemetry";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";

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

export const instrumentParserPerformance = (
  parser: AjsParserPort,
  telemetry: TelemetryPort,
): AjsParserPort => ({
  parse: (content) => {
    const startedAt = performance.now();
    const result = parser.parse(content);
    try {
      const event = createPerformanceTelemetryEvent({
        operation: "parse",
        result: result.errors.length > 0 ? "failed" : "success",
        host: getTelemetryHost(),
        durationBucket: toDurationBucket(performance.now() - startedAt),
        diagnosticCountBucket: toCountBucket(result.errors.length),
      });
      telemetry.trackEvent(event.name, event.properties);
    } catch {
      // Performance telemetry must not affect parsing.
    }
    return result;
  },
});

export const createExtensionDependencies = (
  context: vscode.ExtensionContext,
): ExtensionDependencies => {
  const telemetry = createTelemetry();
  const parser = instrumentParserPerformance(new AntlrAjsParser(), telemetry);
  const credentialStore = new VscodeWebApiCredentialStore(context.secrets);

  return {
    telemetry,
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
