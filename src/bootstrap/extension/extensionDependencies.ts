import type * as vscode from "vscode";
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
  const parser = new AntlrAjsParser({ sourceIndexIdAllocator });
  const enrichedParser = new AntlrAjsParser({ sourceIndexIdAllocator });
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
