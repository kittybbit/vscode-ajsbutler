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
  createFindParameterHover,
  type FindParameterHover,
} from "../../application/editor-feedback/findParameterHover";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createBuildUnitList,
  type BuildUnitList,
} from "../../application/unit-list/buildUnitList";
import {
  createBuildSemanticDiffReport,
  type BuildSemanticDiffReport,
} from "../../application/semantic-diff/buildSemanticDiffReport";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { ParameterSyntaxResourceAdapter } from "../../infrastructure/i18n/ParameterSyntaxResourceAdapter";
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
  semanticDiff: {
    buildSemanticDiffReport: BuildSemanticDiffReport;
  };
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
      const errorCount = result.ok === true ? 0 : result.errors.length;
      const event = createPerformanceTelemetryEvent({
        operation: "parse",
        result: result.ok ? "success" : "failed",
        host: getTelemetryHost(),
        durationBucket: toDurationBucket(performance.now() - startedAt),
        diagnosticCountBucket: toCountBucket(errorCount),
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
  const parameterSyntaxLookup = new ParameterSyntaxResourceAdapter();

  return {
    telemetry,
    buildSyntaxDiagnostics: createBuildSyntaxDiagnostics(parser),
    buildUnitList: createBuildUnitList(parser),
    findParameterHover: createFindParameterHover(parameterSyntaxLookup),
    semanticDiff: {
      buildSemanticDiffReport: createBuildSemanticDiffReport(parser),
    },
    webApiImport: {
      storeCredential: (credentialRef, credential) =>
        credentialStore.storeCredential(credentialRef, credential),
      importPort: new Jp1Ajs3WebApiImportAdapter({
        credentialProvider: credentialStore,
      }),
    },
  };
};
