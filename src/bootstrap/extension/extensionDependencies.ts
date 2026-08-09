import type * as vscode from "vscode";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import { createPerformanceTelemetryEvent } from "../../application/telemetry/performanceTelemetry";
import {
  toCountBucket,
  toDurationBucket,
} from "../../application/telemetry/telemetryBuckets";
import {
  createDiagnoseAjsDefinition,
  type DiagnoseAjsDefinition,
} from "../../application/editor-feedback/diagnoseAjsDefinition";
import {
  createFindParameterHover,
  type FindParameterHover,
} from "../../application/editor-feedback/findParameterHover";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createImportAjsDefinitionViaWebApi } from "../../application/webapi-import/importAjsDefinitionViaWebApi";
import {
  createBuildUnitList,
  type BuildUnitList,
} from "../../application/unit-list/buildUnitList";
import {
  createBuildSemanticDiffReportData,
  type BuildSemanticDiffReportData,
} from "../../application/semantic-diff/buildSemanticDiffReportData";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { ParameterSyntaxResourceAdapter } from "../../infrastructure/i18n/ParameterSyntaxResourceAdapter";
import { Jp1Ajs3WebApiImportAdapter } from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";
import type { ImportAjsDefinitionCapability } from "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand";
import { VscodeWebApiCredentialStore } from "../../infrastructure/webapi/VscodeWebApiCredentialStore";
import { createTelemetry } from "./createTelemetry";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import type { ExtensionHostKind } from "./extensionRuntime";
import { createWebApiImportCapability } from "./webapiImportWiring";

export type ExtensionDependencies = {
  host: ExtensionHostKind;
  telemetry: TelemetryPort;
  diagnoseAjsDefinition: DiagnoseAjsDefinition;
  buildUnitList: BuildUnitList;
  findParameterHover: FindParameterHover;
  semanticDiff: {
    buildSemanticDiffReportData: BuildSemanticDiffReportData;
  };
  webApiImport: ImportAjsDefinitionCapability;
};

type ExtensionDependencyFactories = {
  createDesktopWebApiImportCapability: (
    context: vscode.ExtensionContext,
  ) => ImportAjsDefinitionCapability;
};

export const instrumentParserPerformance = (
  parser: AjsParserPort,
  telemetry: TelemetryPort,
): AjsParserPort => ({
  parse: (content) => {
    const startedAt = performance.now();
    const result = parser.parse(content);
    const errorCount = result.ok === true ? 0 : result.errors.length;
    const event = createPerformanceTelemetryEvent({
      operation: "parse",
      result: result.ok ? "success" : "failed",
      host: getTelemetryHost(),
      durationBucket: toDurationBucket(performance.now() - startedAt),
      diagnosticCountBucket: toCountBucket(errorCount),
    });
    telemetry.report(event);
    return result;
  },
});

const createDesktopWebApiImportCapability = (
  context: vscode.ExtensionContext,
): ImportAjsDefinitionCapability => {
  const credentialStore = new VscodeWebApiCredentialStore(context.secrets);
  const importAjsDefinitionViaWebApi = createImportAjsDefinitionViaWebApi(
    new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: credentialStore,
    }),
  );

  return {
    importDefinition: async ({ connection, scope, credential }) => {
      const credentialRef = await credentialStore.storeCredentialForImport(
        connection,
        scope,
        credential,
      );
      return await importAjsDefinitionViaWebApi({
        connection,
        scope,
        credentialRef,
      });
    },
  };
};

export const createExtensionDependencies = (
  context: vscode.ExtensionContext,
  host: ExtensionHostKind,
  factories: ExtensionDependencyFactories = {
    createDesktopWebApiImportCapability,
  },
): ExtensionDependencies => {
  const telemetry = createTelemetry();
  const parser = instrumentParserPerformance(new AntlrAjsParser(), telemetry);
  const parameterSyntaxLookup = new ParameterSyntaxResourceAdapter();
  const webApiImport = createWebApiImportCapability(host, () =>
    factories.createDesktopWebApiImportCapability(context),
  );

  return {
    host,
    telemetry,
    diagnoseAjsDefinition: createDiagnoseAjsDefinition(parser),
    buildUnitList: createBuildUnitList(parser),
    findParameterHover: createFindParameterHover(parameterSyntaxLookup),
    semanticDiff: {
      buildSemanticDiffReportData: createBuildSemanticDiffReportData(parser),
    },
    webApiImport,
  };
};
