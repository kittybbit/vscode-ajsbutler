import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
  createSemanticDiffExplorerSession,
  type SemanticDiffExplorerActionId,
  type SemanticDiffExplorerSession,
  type SemanticDiffExplorerSessionId,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import {
  createSemanticDiffExplorerActionResultMessage,
  createSemanticDiffExplorerError,
  createSemanticDiffExplorerFailureMessage,
  createSemanticDiffExplorerSessionMessage,
  parseSemanticDiffExplorerRequest,
  serializeSemanticDiffExplorerMessage,
  validateSemanticDiffExplorerMessage,
  type SemanticDiffExplorerActionOutcome,
  type SemanticDiffExplorerHostMessage,
  type SemanticDiffExplorerRequest,
} from "../../../application/semantic-diff/semanticDiffExplorerMessages";
import type {
  SemanticDiffOutputContext,
  SemanticDiffSide,
} from "../../../application/semantic-diff/semanticDiffDto";
import {
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputModeItem,
} from "../../semantic-diff/semanticDiffOutput";
import { executeSemanticDiffExplorerReportAction } from "./semanticDiffExplorerReportAction";
import {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
  type SemanticDiffExplorerContextEntry,
} from "./semanticDiffExplorerRegistry";

export const SEMANTIC_DIFF_EXPLORER_VIEW_TYPE =
  "ajsbutler.semanticDiffExplorer";
export const SEMANTIC_DIFF_EXPLORER_BUNDLE_SRC =
  "./out/semanticDiffExplorer.js";

const sessionIds = createSemanticDiffExplorerSessionIdAllocator();
const actionIds = createSemanticDiffExplorerActionIdAllocator();

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
  contextRegistry?: SemanticDiffExplorerContextRegistry;
  actionRegistry?: SemanticDiffExplorerActionRegistry;
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

const htmlEscape = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const explorerHtml = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  sessionId: SemanticDiffExplorerSessionId,
  outputActionId: SemanticDiffExplorerActionId,
): string => {
  const nonce = uuid();
  const bundleUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "out", "semanticDiffExplorer.js"),
  );
  const title = htmlEscape(panel.title);
  const session = htmlEscape(sessionId);
  const actionId = htmlEscape(outputActionId);
  return `<!DOCTYPE html>
<html lang="${htmlEscape(vscode.env.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${panel.webview.cspSource} 'nonce-${nonce}'; style-src ${panel.webview.cspSource} 'unsafe-inline';">
<style>
html,body,#root{width:100%;height:100%;margin:0;padding:0}body{box-sizing:border-box;background:transparent;font-family:var(--vscode-font-family);color:var(--vscode-foreground)}*,*:before,*:after{box-sizing:inherit}
</style>
</head>
<body data-semantic-diff-session-id="${session}" data-semantic-diff-output-action-id="${actionId}">
<div id="root"></div>
<script nonce="${nonce}" src="${bundleUri}"></script>
</body>
</html>`;
};

const actionOutcome = (
  kind: SemanticDiffExplorerActionOutcome["kind"],
  status: SemanticDiffExplorerActionOutcome["status"],
  side: SemanticDiffSide | null,
  targetId: string | null,
): SemanticDiffExplorerActionOutcome => ({ kind, status, side, targetId });

const isThenableBoolean = (value: unknown): value is Thenable<boolean> =>
  typeof value === "object" && value !== null && "then" in value;

/**
 * Creates the one-argument Explorer opener consumed by the comparison command.
 * Registries and all VS Code resources remain private to this host adapter.
 */
export const createOpenSemanticDiffExplorer = (
  deps: SemanticDiffExplorerPanelDeps,
): ((
  context: SemanticDiffOutputContext,
) => Promise<SemanticDiffExplorerSessionHandle>) => {
  const createWebviewPanel =
    deps.createWebviewPanel ?? vscode.window.createWebviewPanel;
  const contextRegistry =
    deps.contextRegistry ?? new SemanticDiffExplorerContextRegistry();
  const actionRegistry =
    deps.actionRegistry ?? new SemanticDiffExplorerActionRegistry();
  const releaseSourceLifetime = deps.sourceLifetimeRelease ?? (() => undefined);
  let nextOutputAction = 1_000_000_000;

  return async (context: SemanticDiffOutputContext) => {
    const previous = contextRegistry.get(context);
    previous?.dispose();
    const outputActionId =
      `sde-action-${nextOutputAction++}` as SemanticDiffExplorerActionId;
    const session = createSemanticDiffExplorerSession(context, {
      displayLanguage: deps.language ?? vscode.env.language,
      sessionIdAllocator: sessionIds,
      actionIdAllocator: actionIds,
    });
    const panel = createWebviewPanel(
      SEMANTIC_DIFF_EXPLORER_VIEW_TYPE,
      (deps.language ?? vscode.env.language).toLowerCase().startsWith("ja")
        ? "セマンティック差分エクスプローラー"
        : "Semantic Diff Explorer",
      vscode.ViewColumn.Active,
      { enableScripts: true, retainContextWhenHidden: true },
    );
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

    const post = async (
      message: SemanticDiffExplorerHostMessage,
      expectedEpoch = disposeEpoch,
    ): Promise<void> => {
      if (disposed || expectedEpoch !== disposeEpoch) return;
      const serialized = serializeSemanticDiffExplorerMessage(message, {
        expectedSessionId: session.sessionId,
        actionIds: registeredActionIds,
      });
      if ("error" in serialized) {
        if (serialized.error.code === "payload-too-large") {
          // A large session cannot carry correlation fields safely. Send one
          // tiny, nullable-correlation failure and never recurse through post.
          const fallback = serializeSemanticDiffExplorerMessage(
            createSemanticDiffExplorerFailureMessage(
              null,
              null,
              null,
              createSemanticDiffExplorerError("payload-too-large"),
            ),
          );
          if ("error" in fallback) return;
          const fallbackPosted = panel.webview.postMessage(
            JSON.parse(fallback.json),
          );
          if (
            isThenableBoolean(fallbackPosted) &&
            (await fallbackPosted) === false
          ) {
            throw new Error("Explorer message could not be posted.");
          }
          return;
        }
        throw new Error(`Explorer message rejected: ${serialized.error.code}`);
      }
      const posted = panel.webview.postMessage(JSON.parse(serialized.json));
      if (isThenableBoolean(posted) && (await posted) === false) {
        throw new Error("Explorer message could not be posted.");
      }
    };

    const disposeEntry = (disposePanel: boolean): void => {
      if (disposed) return;
      disposed = true;
      disposeEpoch += 1;
      // The borrowed context entry must disappear before the source hook runs.
      contextRegistry.unregister(
        context,
        entry as SemanticDiffExplorerContextEntry,
      );
      actionRegistry.remove(session.sessionId);
      try {
        releaseSourceLifetime();
      } catch {
        // Resource release is best effort during panel disposal.
      }
      receiveMessageDisposable?.dispose();
      receiveMessageDisposable = undefined;
      panelDisposeDisposable?.dispose();
      panelDisposeDisposable = undefined;
      if (disposePanel) {
        try {
          panel.dispose();
        } catch {
          // A host disposal failure must not escape the idempotent handle.
        }
      }
    };
    entry.dispose = () => disposeEntry(true);

    const handleExplorerRequest = async (value: unknown): Promise<void> => {
      if (disposed) return;
      const validation = validateSemanticDiffExplorerMessage(value, {
        expectedSessionId: session.sessionId,
        actionIds: registeredActionIds,
        minimumRequestId: latestRequestId,
      });
      const request = parseSemanticDiffExplorerRequest(value, {
        expectedSessionId: session.sessionId,
        actionIds: registeredActionIds,
        minimumRequestId: latestRequestId,
      });
      if (!request) {
        const errorCode =
          "code" in validation ? validation.code : "invalid-request";
        const failure = createSemanticDiffExplorerFailureMessage(
          null,
          null,
          null,
          createSemanticDiffExplorerError(errorCode),
        );
        await post(failure);
        return;
      }
      latestRequestId = request.requestId;
      await processExplorerRequest(request);
    };

    const processExplorerRequest = async (
      request: SemanticDiffExplorerRequest,
    ): Promise<void> => {
      const requestEpoch = disposeEpoch;
      if (disposed) return;
      if (request.type === "ready" || request.type === "refresh") {
        await post(
          createSemanticDiffExplorerSessionMessage(
            session.sessionId,
            session.viewModel,
          ),
          requestEpoch,
        );
        return;
      }
      await processActionRequest(request, requestEpoch);
    };

    const processActionRequest = async (
      request: Extract<SemanticDiffExplorerRequest, { type: "action" }>,
      requestEpoch: number,
    ): Promise<void> => {
      if (disposed || requestEpoch !== disposeEpoch) return;
      const metadata = actionRegistry.metadata(
        request.actionId,
        session.sessionId,
      );
      if (!metadata) {
        await post(
          createSemanticDiffExplorerActionResultMessage(
            session.sessionId,
            request.requestId,
            request.actionId,
            null,
            createSemanticDiffExplorerError("unknown-action"),
          ),
          requestEpoch,
        );
        return;
      }
      if (metadata.kind !== "output") {
        if (disposed || requestEpoch !== disposeEpoch) return;
        await post(
          createSemanticDiffExplorerActionResultMessage(
            session.sessionId,
            request.requestId,
            request.actionId,
            actionOutcome(
              metadata.kind,
              "unavailable",
              metadata.side,
              metadata.targetId,
            ),
          ),
          requestEpoch,
        );
        return;
      }
      const output = await executeSemanticDiffExplorerReportAction(
        session.context,
        {
          showQuickPick: (items, options) => deps.showQuickPick(items, options),
          openReport: deps.openReport,
          presentOutput: deps.presentOutput,
          language: deps.language,
          isCurrent: () => !disposed && requestEpoch === disposeEpoch,
        },
      );
      if (disposed || requestEpoch !== disposeEpoch) return;
      if (output.ok) {
        await post(
          createSemanticDiffExplorerActionResultMessage(
            session.sessionId,
            request.requestId,
            request.actionId,
            actionOutcome("output", "completed", null, null),
          ),
          requestEpoch,
        );
      } else {
        await post(
          createSemanticDiffExplorerActionResultMessage(
            session.sessionId,
            request.requestId,
            request.actionId,
            null,
            createSemanticDiffExplorerError("output-failed"),
          ),
          requestEpoch,
        );
      }
    };

    try {
      contextRegistry.register(entry as SemanticDiffExplorerContextEntry);
      actionRegistry.register(session, outputActionId);
      panel.webview.options = {
        enableScripts: true,
        localResourceRoots: [deps.extensionContext.extensionUri],
      };
      receiveMessageDisposable = panel.webview.onDidReceiveMessage((value) => {
        void handleExplorerRequest(value).catch(() => undefined);
      });
      panelDisposeDisposable = panel.onDidDispose(() => disposeEntry(false));
      panel.webview.html = explorerHtml(
        deps.extensionContext,
        panel,
        session.sessionId,
        outputActionId,
      );
    } catch (error) {
      disposeEntry(true);
      throw error;
    }

    return {
      sessionId: session.sessionId,
      panel,
      dispose: () => disposeEntry(true),
    };
  };
};

export const openSemanticDiffExplorer = createOpenSemanticDiffExplorer;
