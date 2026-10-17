import * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../application/semantic-diff/buildSemanticDiffReportData";
import {
  createSemanticDiffCompletedEvent,
  createSemanticDiffExportedEvent,
} from "../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  COMPARE_SEMANTIC_DIFF_COMMAND,
  executeCompareSemanticDiffCommand,
  type SemanticDiffCommandDeps,
} from "../../presentation/vscode/commands/semanticDiffCommand";
import {
  COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND,
  SAVE_SEMANTIC_DIFF_OUTPUT_COMMAND,
  SEMANTIC_DIFF_REPORT_SCHEME,
  SemanticDiffReportDocumentProvider,
} from "../../presentation/vscode/semantic-diff/report/semanticDiffReportDocument";
import { presentSemanticDiffOutput } from "../../presentation/semantic-diff/report/semanticDiffOutput";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { createOpenSemanticDiffExplorer } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel";
import type { SemanticDiffSourceCaptureFactory } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceHandleIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import type {
  SemanticDiffExplorerActionIdAllocator,
  SemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry";
import type { SemanticDiffSourceCaptureEntry } from "../../presentation/vscode/semantic-diff/source/semanticDiffExplorerSourceTypes";
import type { SemanticDiffFlowViewerBridge } from "./semanticDiffFlowViewerBridge";
import {
  createSemanticDiffFlowAction,
  SemanticDiffFlowOverlayRegistry,
} from "../../presentation/vscode/semantic-diff/flow/semanticDiffExplorerFlow";
import { createSemanticDiffFlowSourceHost } from "../../presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost";
import type { ReadGitHeadDefinition } from "../../application/semantic-diff/GitHeadDefinitionSourcePort";
import {
  GIT_HEAD_CONTENT_SCHEME,
  VscodeGitHeadContentProvider,
} from "../../infrastructure/git/VscodeGitHeadContentProvider";

export type SemanticDiffWiringDeps = {
  extensionContext: vscode.ExtensionContext;
  telemetry: TelemetryPort;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  beginSemanticDiffSourceCapture: SemanticDiffSourceCaptureFactory;
  sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator;
  sessionIdAllocator: SemanticDiffExplorerSessionIdAllocator;
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
  readGitHeadDefinition?: ReadGitHeadDefinition;
  flowBridge?: SemanticDiffFlowViewerBridge;
};

type SourceCaptureRegistration = NonNullable<
  SemanticDiffCommandDeps["registerSemanticDiffSourceCapture"]
>;

export const createSourceCaptureRegistrar =
  (
    contextRegistry: SemanticDiffExplorerContextRegistry,
  ): SourceCaptureRegistration =>
  (context, entry: SemanticDiffSourceCaptureEntry) => {
    contextRegistry.registerSourceCapture(context, entry);
  };

const reportTelemetrySafely = (
  telemetry: TelemetryPort,
  event: Parameters<TelemetryPort["report"]>[0],
): void => {
  try {
    telemetry.report(event);
  } catch {
    // Reporting cannot change comparison or export behavior.
  }
};

const createReportDocuments = (
  telemetry: TelemetryPort,
): SemanticDiffReportDocumentProvider =>
  new SemanticDiffReportDocumentProvider({
    openTextDocument: (uri) => vscode.workspace.openTextDocument(uri),
    showTextDocument: (document, options) =>
      vscode.window.showTextDocument(document, options),
    getActiveEditor: () => vscode.window.activeTextEditor,
    writeClipboard: (text) => vscode.env.clipboard.writeText(text),
    showInformationMessage: (message) =>
      vscode.window.showInformationMessage(message),
    showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    createUri: (components) => vscode.Uri.from(components),
    showSaveDialog: (options) => vscode.window.showSaveDialog(options),
    writeFile: (uri, content) => vscode.workspace.fs.writeFile(uri, content),
    onExportCompleted: (method) =>
      reportTelemetrySafely(telemetry, createSemanticDiffExportedEvent(method)),
  });

const createOpenExplorer = ({
  deps,
  reportDocuments,
  contextRegistry,
  flowOverlayRegistry,
  flowSourceHost,
}: Readonly<{
  deps: SemanticDiffWiringDeps;
  reportDocuments: SemanticDiffReportDocumentProvider;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  flowOverlayRegistry: SemanticDiffFlowOverlayRegistry;
  flowSourceHost: ReturnType<typeof createSemanticDiffFlowSourceHost>;
}>) =>
  createOpenSemanticDiffExplorer({
    extensionContext: deps.extensionContext,
    showQuickPick: (items, options) =>
      vscode.window.showQuickPick(items, options),
    openReport: (output) => reportDocuments.openReport(output),
    presentOutput: presentSemanticDiffOutput,
    language: vscode.env.language,
    openTextDocument: (uri) => vscode.workspace.openTextDocument(uri),
    showTextDocument: (document, options) =>
      vscode.window.showTextDocument(document, options),
    contextRegistry,

    sessionIdAllocator: deps.sessionIdAllocator,
    actionIdAllocator: deps.actionIdAllocator,
    flowAction: deps.flowBridge
      ? createSemanticDiffFlowAction({
          host: flowSourceHost,
          registry: flowOverlayRegistry,
        })
      : undefined,
    disposeFlowSession: (sessionId) =>
      flowOverlayRegistry.clearSession(sessionId),
  });

const createCompareCommand = ({
  deps,
  reportDocuments,
  openExplorer,

  contextRegistry,
  gitHeadContentProvider,
}: Readonly<{
  deps: SemanticDiffWiringDeps;
  reportDocuments: SemanticDiffReportDocumentProvider;
  openExplorer: ReturnType<typeof createOpenExplorer>;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  gitHeadContentProvider: VscodeGitHeadContentProvider;
}>): vscode.Disposable => {
  const commandDeps: SemanticDiffCommandDeps = {
    getActiveEditor: () => vscode.window.activeTextEditor,
    showQuickPick: (items, options) =>
      vscode.window.showQuickPick(items, options),
    showWorkflowQuickPick: (items, options) =>
      vscode.window.showQuickPick(items, options),
    showOpenDialog: (options) => vscode.window.showOpenDialog(options),
    showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    readFile: (uri) => vscode.workspace.fs.readFile(uri),
    openTextDocument: (uri) => vscode.workspace.openTextDocument(uri),
    openReport: (output) => reportDocuments.openReport(output),
    language: vscode.env.language,
    buildSemanticDiffReportData: deps.buildSemanticDiffReportData,
    buildSemanticDiffOutputContext,
    presentSemanticDiffOutput,
    openExplorer,
    reportCompleted: (result) =>
      reportTelemetrySafely(
        deps.telemetry,
        createSemanticDiffCompletedEvent(result),
      ),

    beginSemanticDiffSourceCapture: deps.beginSemanticDiffSourceCapture,
    sourceHandleIdAllocator: deps.sourceHandleIdAllocator,
    readGitHeadDefinition: deps.readGitHeadDefinition,
    gitHeadSnapshotProvider: gitHeadContentProvider,
    registerSemanticDiffSourceCapture:
      createSourceCaptureRegistrar(contextRegistry),
    unregisterSemanticDiffSourceCapture: (context) =>
      contextRegistry.unregisterSourceCapture(context),
  };
  return vscode.commands.registerCommand(COMPARE_SEMANTIC_DIFF_COMMAND, () =>
    executeCompareSemanticDiffCommand(commandDeps),
  );
};

export const createSemanticDiffSubscriptions = (
  deps: SemanticDiffWiringDeps,
): vscode.Disposable[] => {
  const contextRegistry = new SemanticDiffExplorerContextRegistry();
  const flowOverlayRegistry = new SemanticDiffFlowOverlayRegistry();
  const flowBridge = deps.flowBridge;
  const flowSourceHost = createSemanticDiffFlowSourceHost({
    sourceCapture: (context) => contextRegistry.sourceCapture(context),
    getOpenTextDocuments: () => vscode.workspace.textDocuments,
    openFlow: (uri, targetUnitId) =>
      flowBridge
        ? flowBridge.open(uri, targetUnitId)
        : Promise.reject(new Error("Flow viewer is not registered.")),
  });
  const reportDocuments = createReportDocuments(deps.telemetry);
  const openExplorer = createOpenExplorer({
    deps,
    reportDocuments,
    contextRegistry,
    flowOverlayRegistry,
    flowSourceHost,
  });
  const gitHeadContentProvider = new VscodeGitHeadContentProvider();

  return [
    gitHeadContentProvider,
    vscode.workspace.registerTextDocumentContentProvider(
      GIT_HEAD_CONTENT_SCHEME,
      gitHeadContentProvider,
    ),
    vscode.workspace.registerTextDocumentContentProvider(
      SEMANTIC_DIFF_REPORT_SCHEME,
      reportDocuments,
    ),
    createCompareCommand({
      deps,
      reportDocuments,
      openExplorer,

      contextRegistry,
      gitHeadContentProvider,
    }),
    vscode.commands.registerCommand(
      COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND,
      (uri?: vscode.Uri) => reportDocuments.copyReport(uri),
    ),
    vscode.commands.registerCommand(
      SAVE_SEMANTIC_DIFF_OUTPUT_COMMAND,
      (uri?: vscode.Uri) => reportDocuments.saveReport(uri),
    ),
    reportDocuments,
  ];
};
