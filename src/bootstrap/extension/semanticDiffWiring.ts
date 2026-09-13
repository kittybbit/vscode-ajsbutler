import * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../application/semantic-diff/buildSemanticDiffReportData";
import type { BuildSemanticDiffPresentationArtifacts } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
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
import { presentSemanticDiffOutput } from "../../presentation/semantic-diff/semanticDiffOutput";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { createOpenSemanticDiffExplorer } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerPanel";
import type { SemanticDiffSourceCaptureFactory } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceHandleIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import type {
  SemanticDiffExplorerActionIdAllocator,
  SemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";
import type { SemanticDiffSourceCaptureEntry } from "../../presentation/vscode/semantic-diff/source/semanticDiffExplorerSourceTypes";
import type { SemanticDiffFlowViewerBridge } from "./semanticDiffFlowViewerBridge";
import {
  createSemanticDiffFlowAction,
  SemanticDiffFlowOverlayRegistry,
  type SemanticDiffFlowSourceSnapshot,
} from "../../presentation/vscode/semantic-diff/semanticDiffExplorerFlow";
import { createScheduleAwareExplorerSession } from "./createScheduleAwareExplorerSession";
import { ScheduleImpactSidecarRegistry } from "./scheduleImpactSidecarRegistry";
import { ScheduleImpactCalendarSessionRegistry } from "../../presentation/vscode/webview/scheduleImpactCalendarSessionRegistry";
import type { ReadGitHeadDefinition } from "../../application/semantic-diff/GitHeadDefinitionSourcePort";
import {
  GIT_HEAD_CONTENT_SCHEME,
  VscodeGitHeadContentProvider,
} from "../../infrastructure/git/VscodeGitHeadContentProvider";

export type SemanticDiffWiringDeps = {
  extensionContext: vscode.ExtensionContext;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  buildSemanticDiffPresentationArtifacts?: BuildSemanticDiffPresentationArtifacts;
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

const createSourceSnapshotGetter =
  (contextRegistry: SemanticDiffExplorerContextRegistry) =>
  (
    side: "before" | "after",
    context: SemanticDiffOutputContext,
  ): SemanticDiffFlowSourceSnapshot | undefined => {
    const source = contextRegistry.sourceCapture(context)?.sources[side];
    return source
      ? {
          sourceHandleId: source.sourceHandleId,
          version: source.version,
          text: source.text,
          uri: source.uri.toString(),
        }
      : undefined;
  };

const sourceIdentityMatches = (
  current: SemanticDiffFlowSourceSnapshot,
  snapshot: SemanticDiffFlowSourceSnapshot,
): boolean =>
  current.sourceHandleId === snapshot.sourceHandleId &&
  current.uri === snapshot.uri;

const sourceVersionMatches = (
  currentVersion: number | null,
  snapshotVersion: number | null,
): boolean => snapshotVersion === null || currentVersion === snapshotVersion;

const sourceSnapshotMatches = (
  current: SemanticDiffFlowSourceSnapshot,
  snapshot: SemanticDiffFlowSourceSnapshot,
): boolean =>
  sourceVersionMatches(current.version, snapshot.version) &&
  current.text === snapshot.text;

const documentSnapshotMatches = (
  document: vscode.TextDocument | undefined,
  snapshot: SemanticDiffFlowSourceSnapshot,
): boolean =>
  document !== undefined &&
  sourceVersionMatches(document.version, snapshot.version) &&
  document.getText() === snapshot.text;

const isSourceCurrent = ({
  getSourceSnapshot,
  side,
  context,
  snapshot,
}: Readonly<{
  getSourceSnapshot: ReturnType<typeof createSourceSnapshotGetter>;
  side: "before" | "after";
  context: SemanticDiffOutputContext;
  snapshot: SemanticDiffFlowSourceSnapshot;
}>): boolean => {
  const current = getSourceSnapshot(side, context);
  if (current === undefined || !sourceIdentityMatches(current, snapshot)) {
    return false;
  }
  const currentDocument = vscode.workspace.textDocuments.find(
    (document) => document.uri.toString() === snapshot.uri,
  );
  return (
    sourceSnapshotMatches(current, snapshot) &&
    documentSnapshotMatches(currentDocument, snapshot)
  );
};

const openFlowSource = async ({
  flowBridge,
  contextRegistry,
  side,
  targetUnitId,
  context,
}: Readonly<{
  flowBridge: SemanticDiffFlowViewerBridge;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  side: "before" | "after";
  targetUnitId: string;
  context: SemanticDiffOutputContext;
}>) => {
  const source = contextRegistry.sourceCapture(context)?.sources[side];
  if (!source) throw new Error("Semantic Diff source is unavailable.");
  return flowBridge.open(source.uri, targetUnitId);
};

const createFlowHost = ({
  flowBridge,
  contextRegistry,
  getSourceSnapshot,
}: Readonly<{
  flowBridge: SemanticDiffFlowViewerBridge;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  getSourceSnapshot: ReturnType<typeof createSourceSnapshotGetter>;
}>) => ({
  getSourceSnapshot,
  isSourceCurrent: (
    side: "before" | "after",
    context: SemanticDiffOutputContext,
    snapshot: SemanticDiffFlowSourceSnapshot,
  ) => isSourceCurrent({ getSourceSnapshot, side, context, snapshot }),
  open: (
    side: "before" | "after",
    targetUnitId: string,
    context: SemanticDiffOutputContext,
  ) =>
    openFlowSource({
      flowBridge,
      contextRegistry,
      side,
      targetUnitId,
      context,
    }),
});

export const createSourceCaptureRegistrar =
  (
    contextRegistry: SemanticDiffExplorerContextRegistry,
  ): SourceCaptureRegistration =>
  (context, entry: SemanticDiffSourceCaptureEntry) => {
    contextRegistry.registerSourceCapture(context, entry);
  };

const createReportDocuments = (): SemanticDiffReportDocumentProvider =>
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
  });

const createOpenExplorer = ({
  deps,
  reportDocuments,
  contextRegistry,
  flowOverlayRegistry,
  getSourceSnapshot,
}: Readonly<{
  deps: SemanticDiffWiringDeps;
  reportDocuments: SemanticDiffReportDocumentProvider;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  flowOverlayRegistry: SemanticDiffFlowOverlayRegistry;
  getSourceSnapshot: ReturnType<typeof createSourceSnapshotGetter>;
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
          host: createFlowHost({
            flowBridge: deps.flowBridge,
            contextRegistry,
            getSourceSnapshot,
          }),
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
  openScheduleAwareExplorerSession,
  contextRegistry,
  gitHeadContentProvider,
}: Readonly<{
  deps: SemanticDiffWiringDeps;
  reportDocuments: SemanticDiffReportDocumentProvider;
  openExplorer: ReturnType<typeof createOpenExplorer>;
  openScheduleAwareExplorerSession: ReturnType<
    typeof createScheduleAwareExplorerSession
  >;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  gitHeadContentProvider: VscodeGitHeadContentProvider;
}>): vscode.Disposable => {
  const commandDeps: SemanticDiffCommandDeps = {
    getActiveEditor: () => vscode.window.activeTextEditor,
    showQuickPick: (items, options) =>
      vscode.window.showQuickPick(items, options),
    showWorkflowQuickPick: (items, options) =>
      vscode.window.showQuickPick(items, options),
    showInputBox: (options) => vscode.window.showInputBox(options),
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
    openScheduleAwareExplorerSession,
    beginSemanticDiffSourceCapture: deps.beginSemanticDiffSourceCapture,
    sourceHandleIdAllocator: deps.sourceHandleIdAllocator,
    readGitHeadDefinition: deps.readGitHeadDefinition,
    gitHeadSnapshotProvider: gitHeadContentProvider,
    registerSemanticDiffSourceCapture:
      createSourceCaptureRegistrar(contextRegistry),
    unregisterSemanticDiffSourceCapture: (context) =>
      contextRegistry.unregisterSourceCapture(context),
  };
  if (deps.buildSemanticDiffPresentationArtifacts) {
    commandDeps.buildSemanticDiffPresentationArtifacts =
      deps.buildSemanticDiffPresentationArtifacts;
  }
  return vscode.commands.registerCommand(COMPARE_SEMANTIC_DIFF_COMMAND, () =>
    executeCompareSemanticDiffCommand(commandDeps),
  );
};

export const createSemanticDiffSubscriptions = (
  deps: SemanticDiffWiringDeps,
): vscode.Disposable[] => {
  const contextRegistry = new SemanticDiffExplorerContextRegistry();
  const flowOverlayRegistry = new SemanticDiffFlowOverlayRegistry();
  const getSourceSnapshot = createSourceSnapshotGetter(contextRegistry);
  const reportDocuments = createReportDocuments();
  const openExplorer = createOpenExplorer({
    deps,
    reportDocuments,
    contextRegistry,
    flowOverlayRegistry,
    getSourceSnapshot,
  });
  const sidecarRegistry = new ScheduleImpactSidecarRegistry();
  const calendarSessionRegistry = new ScheduleImpactCalendarSessionRegistry();
  const gitHeadContentProvider = new VscodeGitHeadContentProvider();
  const openScheduleAwareExplorerSession = createScheduleAwareExplorerSession({
    openExplorer,
    sidecarRegistry,
    releaseCalendarParent: (parentSessionId) =>
      calendarSessionRegistry.releaseParent(parentSessionId),
  });

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
      openScheduleAwareExplorerSession,
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
