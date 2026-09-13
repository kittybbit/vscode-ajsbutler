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
import type { ReadGitHeadDefinition } from "../../application/semantic-diff/GitHeadDefinitionSourcePort";
import {
  createBuildUnitList,
  type BuildUnitList,
} from "../../application/unit-list/buildUnitList";
import {
  createBuildSemanticDiffReportData,
  type BuildSemanticDiffReportData,
} from "../../application/semantic-diff/buildSemanticDiffReportData";
import {
  createBuildSemanticDiffPresentationArtifacts,
  type BuildSemanticDiffPresentationArtifacts,
} from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import { createBeginSemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceCaptureFactory } from "../../application/semantic-diff/semanticDiffSourceCapture";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
  type SemanticDiffCaptureScopeIdAllocator,
  type SemanticDiffSourceHandleIdAllocator,
  type SemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
  type SemanticDiffExplorerActionIdAllocator,
  type SemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { ParameterSyntaxResourceAdapter } from "../../infrastructure/i18n/ParameterSyntaxResourceAdapter";
import { Jp1Ajs3WebApiImportAdapter } from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";
import type { ImportAjsDefinitionCapability } from "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand";
import { VscodeWebApiCredentialStore } from "../../infrastructure/webapi/VscodeWebApiCredentialStore";
import { createTelemetry } from "./createTelemetry";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import type { ExtensionHostKind } from "./extensionRuntime";
import { createWebApiImportCapability } from "./webapiImportWiring";
import { createVscodeGitHeadDefinitionSourceAdapter } from "../../infrastructure/git/VscodeGitHeadDefinitionSourceAdapter";

export type ExtensionDependencies = {
  host: ExtensionHostKind;
  telemetry: TelemetryPort;
  diagnoseAjsDefinition: DiagnoseAjsDefinition;
  buildUnitList: BuildUnitList;
  findParameterHover: FindParameterHover;
  semanticDiff: {
    buildSemanticDiffReportData: BuildSemanticDiffReportData;
    buildSemanticDiffPresentationArtifacts?: BuildSemanticDiffPresentationArtifacts;
    beginSemanticDiffSourceCapture: SemanticDiffSourceCaptureFactory;
    sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator;
    sessionIdAllocator: SemanticDiffExplorerSessionIdAllocator;
    actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
    readGitHeadDefinition?: ReadGitHeadDefinition;
  };
  webApiImport: ImportAjsDefinitionCapability;
};

type ExtensionDependencyFactories = {
  createDesktopWebApiImportCapability: (
    context: vscode.ExtensionContext,
  ) => ImportAjsDefinitionCapability;
};

const reportParserPerformance = ({
  result,
  startedAt,
  telemetry,
}: Readonly<{
  result: ReturnType<AjsParserPort["parse"]>;
  startedAt: number;
  telemetry: TelemetryPort;
}>): void => {
  const errorCount = result.ok === true ? 0 : result.errors.length;
  telemetry.report(
    createPerformanceTelemetryEvent({
      operation: "parse",
      result: result.ok ? "success" : "failed",
      host: getTelemetryHost(),
      durationBucket: toDurationBucket(performance.now() - startedAt),
      diagnosticCountBucket: toCountBucket(errorCount),
    }),
  );
};

const parseWithPerformance = (
  parser: AjsParserPort,
  telemetry: TelemetryPort,
  content: string,
): ReturnType<AjsParserPort["parse"]> => {
  const startedAt = performance.now();
  const result = parser.parse(content);
  reportParserPerformance({ result, startedAt, telemetry });
  return result;
};

export const instrumentParserPerformance = (
  parser: AjsParserPort,
  telemetry: TelemetryPort,
): AjsParserPort => ({
  parse: (content) => parseWithPerformance(parser, telemetry, content),
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
  const sourceIndexIdAllocator: SemanticDiffSourceIndexIdAllocator =
    createSemanticDiffSourceIndexIdAllocator();
  const sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator =
    createSemanticDiffSourceHandleIdAllocator();
  const captureScopeIdAllocator: SemanticDiffCaptureScopeIdAllocator =
    createSemanticDiffCaptureScopeIdAllocator();
  const sessionIdAllocator: SemanticDiffExplorerSessionIdAllocator =
    createSemanticDiffExplorerSessionIdAllocator();
  const actionIdAllocator: SemanticDiffExplorerActionIdAllocator =
    createSemanticDiffExplorerActionIdAllocator();
  const parser = instrumentParserPerformance(
    new AntlrAjsParser({ sourceIndexIdAllocator }),
    telemetry,
  );
  const enrichedParser = new AntlrAjsParser({ sourceIndexIdAllocator });
  const buildPresentationArtifacts =
    createBuildSemanticDiffPresentationArtifacts(parser);
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
      buildSemanticDiffPresentationArtifacts: buildPresentationArtifacts,
      beginSemanticDiffSourceCapture: createBeginSemanticDiffSourceCapture(
        enrichedParser,
        captureScopeIdAllocator,
      ),
      sourceHandleIdAllocator,
      sessionIdAllocator,
      actionIdAllocator,
      readGitHeadDefinition: createVscodeGitHeadDefinitionSourceAdapter(),
    },
    webApiImport,
  };
};
