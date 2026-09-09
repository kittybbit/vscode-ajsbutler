import * as vscode from "vscode";
import {
  createSemanticDiffExplorerSession,
  type SemanticDiffExplorerActionId,
  type SemanticDiffExplorerActionIdAllocator,
  type SemanticDiffExplorerSession,
  type SemanticDiffExplorerSessionId,
  type SemanticDiffExplorerSessionIdAllocator,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/semanticDiffDto";
import {
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputModeItem,
} from "../../semantic-diff/semanticDiffOutput";
import type { SemanticDiffFlowActionRequest } from "./semanticDiffExplorerFlow";
import {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
  type SemanticDiffExplorerContextEntry,
} from "./semanticDiffExplorerRegistry";
import { installSemanticDiffExplorerPanel } from "./semanticDiffExplorerPanelInstall";
import { postSemanticDiffExplorerMessage } from "./semanticDiffExplorerPanelTransport";
import { disposeSemanticDiffExplorerPanel } from "./semanticDiffExplorerPanelLifecycle";

export const SEMANTIC_DIFF_EXPLORER_VIEW_TYPE =
  "ajsbutler.semanticDiffExplorer";
export const SEMANTIC_DIFF_EXPLORER_BUNDLE_SRC =
  "./out/semanticDiffExplorer.js";

/** The host-only handle intentionally does not expose the application session. */
export type SemanticDiffExplorerSessionHandle = Readonly<{
  sessionId: SemanticDiffExplorerSessionId;
  panel: vscode.WebviewPanel;
  dispose(): void;
}>;

export type SemanticDiffExplorerPanelDeps = Readonly<{
  extensionContext: vscode.ExtensionContext;
  createWebviewPanel?: typeof vscode.window.createWebviewPanel;
  showQuickPick: (
    items: readonly SemanticDiffOutputModeItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffOutputModeItem | undefined>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  presentOutput?: typeof presentSemanticDiffOutput;
  language?: string;
  sourceLifetimeRelease?: () => void;
  openTextDocument?: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  showTextDocument?: (
    document: vscode.TextDocument,
    options?: vscode.TextDocumentShowOptions,
  ) => Thenable<vscode.TextEditor>;
  contextRegistry?: SemanticDiffExplorerContextRegistry;
  actionRegistry?: SemanticDiffExplorerActionRegistry;
  sessionIdAllocator: SemanticDiffExplorerSessionIdAllocator;
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
  /** Host-owned Flow adapter; viewer transport remains unchanged. */
  flowAction?: (
    request: SemanticDiffFlowActionRequest,
    context: SemanticDiffOutputContext,
    isCurrent: () => boolean,
  ) => Promise<
    | Readonly<{ ok: true }>
    | Readonly<{
        ok: false;
        code: "flow-not-ready" | "flow-target-missing";
        targetId?: string;
      }>
  >;
  disposeFlowSession?: (sessionId: SemanticDiffExplorerSessionId) => void;
}>;

type PanelEntry = {
  context: SemanticDiffOutputContext;
  session: SemanticDiffExplorerSession;
  panel: vscode.WebviewPanel;
  outputActionId: SemanticDiffExplorerActionId;
  dispose: () => void;
};

const hostActionIds = (
  session: SemanticDiffExplorerSession,
  outputActionId: SemanticDiffExplorerActionId,
) => {
  const ids = new Set(session.actionIds.toArray());
  ids.add(outputActionId);
  return {
    size: ids.size,
    has: (value: unknown): value is SemanticDiffExplorerActionId =>
      typeof value === "string" &&
      ids.has(value as SemanticDiffExplorerActionId),
    toArray: () => Object.freeze([...ids]),
  };
};

const panelTitle = (language: string): string =>
  language.toLowerCase().startsWith("ja")
    ? "セマンティック差分エクスプローラー"
    : "Semantic Diff Explorer";

const releaseFailedPanelSource = (
  context: SemanticDiffOutputContext,
  contextRegistry: SemanticDiffExplorerContextRegistry,
  releaseSourceLifetime: () => void,
): void => {
  const sourceEntry = contextRegistry.sourceCapture(context);
  contextRegistry.unregisterSourceCapture(context);
  try {
    (sourceEntry?.release ?? releaseSourceLifetime)();
  } catch {
    // A panel creation failure must not hide the original host error.
  }
};

type ExplorerOpenerResources = Readonly<{
  deps: SemanticDiffExplorerPanelDeps;
  createWebviewPanel: typeof vscode.window.createWebviewPanel;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  actionRegistry: SemanticDiffExplorerActionRegistry;
  releaseSourceLifetime: () => void;
}>;

const createExplorerOpenerResources = (
  deps: SemanticDiffExplorerPanelDeps,
): ExplorerOpenerResources => ({
  deps,
  createWebviewPanel:
    deps.createWebviewPanel ?? vscode.window.createWebviewPanel,
  contextRegistry:
    deps.contextRegistry ?? new SemanticDiffExplorerContextRegistry(),
  actionRegistry:
    deps.actionRegistry ?? new SemanticDiffExplorerActionRegistry(),
  releaseSourceLifetime: deps.sourceLifetimeRelease ?? (() => undefined),
});

const createExplorerPanel = (
  resources: ExplorerOpenerResources,
  context: SemanticDiffOutputContext,
  language: string,
): vscode.WebviewPanel => {
  try {
    return resources.createWebviewPanel(
      SEMANTIC_DIFF_EXPLORER_VIEW_TYPE,
      panelTitle(language),
      vscode.ViewColumn.Active,
      { enableScripts: true, retainContextWhenHidden: true },
    );
  } catch (error) {
    releaseFailedPanelSource(
      context,
      resources.contextRegistry,
      resources.releaseSourceLifetime,
    );
    throw error;
  }
};

type ExplorerPanelRuntimeOptions = Readonly<{
  resources: ExplorerOpenerResources;
  context: SemanticDiffOutputContext;
  session: SemanticDiffExplorerSession;
  outputActionId: SemanticDiffExplorerActionId;
  panel: vscode.WebviewPanel;
}>;

const createExplorerPanelRuntime = (options: ExplorerPanelRuntimeOptions) => {
  const { resources, context, session, outputActionId, panel } = options;
  const { deps, contextRegistry, actionRegistry, releaseSourceLifetime } =
    resources;
  const entry: PanelEntry = {
    context,
    session,
    panel,
    outputActionId,
    dispose: () => undefined,
  };
  let disposed = false;
  let disposeEpoch = 0;
  let latestRequestId = 0;
  let receiveMessageDisposable: vscode.Disposable | undefined;
  let panelDisposeDisposable: vscode.Disposable | undefined;
  const registeredActionIds = hostActionIds(session, outputActionId);
  const sourceCapture = contextRegistry.sourceCapture(context);
  const post = (
    message: Parameters<typeof postSemanticDiffExplorerMessage>[0],
    expectedEpoch = disposeEpoch,
  ) =>
    postSemanticDiffExplorerMessage(
      message,
      {
        panel,
        session,
        actionIds: registeredActionIds,
        isDisposed: () => disposed,
        disposeEpoch: () => disposeEpoch,
      },
      expectedEpoch,
    );
  const disposeEntry = (disposePanel: boolean): void =>
    disposeSemanticDiffExplorerPanel(
      {
        context,
        entry: entry as SemanticDiffExplorerContextEntry,
        session,
        panel,
        contextRegistry,
        actionRegistry,
        deps,
        sourceEntry: contextRegistry.sourceCapture(context),
        releaseSourceLifetime,
        receiveMessageDisposable,
        panelDisposeDisposable,
        isDisposed: () => disposed,
        markDisposed: () => {
          disposed = true;
        },
        advanceEpoch: () => {
          disposeEpoch += 1;
        },
      },
      disposePanel,
    );
  entry.dispose = () => disposeEntry(true);
  const actionOptions = {
    session,
    context,
    actionRegistry,
    sourceCapture,
    deps,
    post,
    isCurrent: (epoch: number) => !disposed && epoch === disposeEpoch,
  };
  const requestOptions = {
    session,
    actionIds: registeredActionIds,
    isDisposed: () => disposed,
    disposeEpoch: () => disposeEpoch,
    latestRequestId: () => latestRequestId,
    setLatestRequestId: (requestId: number) => {
      latestRequestId = requestId;
    },
    post,
    actionOptions,
  };
  const install = (): void =>
    installSemanticDiffExplorerPanel({
      context,
      entry: entry as SemanticDiffExplorerContextEntry,
      session,
      outputActionId,
      panel,
      deps,
      contextRegistry,
      actionRegistry,
      requestOptions,
      setReceiveMessageDisposable: (disposable) => {
        receiveMessageDisposable = disposable;
      },
      setPanelDisposeDisposable: (disposable) => {
        panelDisposeDisposable = disposable;
      },
      disposeEntry,
    });
  return {
    install,
    dispose: () => disposeEntry(true),
  };
};

const openExplorerSession = async (
  resources: ExplorerOpenerResources,
  context: SemanticDiffOutputContext,
): Promise<SemanticDiffExplorerSessionHandle> => {
  resources.contextRegistry.get(context)?.dispose();
  const language = resources.deps.language ?? vscode.env.language;
  const session = createSemanticDiffExplorerSession(context, {
    displayLanguage: language,
    sessionIdAllocator: resources.deps.sessionIdAllocator,
    actionIdAllocator: resources.deps.actionIdAllocator,
  });
  const outputActionId = resources.deps.actionIdAllocator();
  const panel = createExplorerPanel(resources, context, language);
  const runtime = createExplorerPanelRuntime({
    resources,
    context,
    session,
    outputActionId,
    panel,
  });
  runtime.install();
  return {
    sessionId: session.sessionId,
    panel,
    dispose: runtime.dispose,
  };
};

/**
 * Creates the one-argument Explorer opener consumed by the comparison command.
 * Registries and all VS Code resources remain private to this host adapter.
 */
export const createOpenSemanticDiffExplorer = (
  deps: SemanticDiffExplorerPanelDeps,
): ((
  context: SemanticDiffOutputContext,
) => Promise<SemanticDiffExplorerSessionHandle>) => {
  const resources = createExplorerOpenerResources(deps);
  return (context: SemanticDiffOutputContext) =>
    openExplorerSession(resources, context);
};

export const openSemanticDiffExplorer = createOpenSemanticDiffExplorer;
