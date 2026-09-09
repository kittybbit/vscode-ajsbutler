import type * as vscode from "vscode";
import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerSession,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffExplorerContextEntry,
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
} from "./semanticDiffExplorerRegistry";
import { buildSemanticDiffExplorerHtml } from "./semanticDiffExplorerPanelHtml";
import { handleSemanticDiffExplorerRequest } from "./semanticDiffExplorerPanelRequests";
import type { SemanticDiffExplorerPanelDeps } from "./semanticDiffExplorerPanel";

type PanelInstallOptions = Readonly<{
  context: import("../../../../application/semantic-diff/semanticDiffDto").SemanticDiffOutputContext;
  entry: SemanticDiffExplorerContextEntry;
  session: SemanticDiffExplorerSession;
  outputActionId: SemanticDiffExplorerActionId;
  panel: vscode.WebviewPanel;
  deps: SemanticDiffExplorerPanelDeps;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  actionRegistry: SemanticDiffExplorerActionRegistry;
  requestOptions: Parameters<typeof handleSemanticDiffExplorerRequest>[1];
  setReceiveMessageDisposable: (disposable: vscode.Disposable) => void;
  setPanelDisposeDisposable: (disposable: vscode.Disposable) => void;
  disposeEntry: (disposePanel: boolean) => void;
}>;

export const installSemanticDiffExplorerPanel = (
  options: PanelInstallOptions,
): void => {
  try {
    options.contextRegistry.register(options.entry);
    options.actionRegistry.register(options.session, options.outputActionId);
    options.panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [options.deps.extensionContext.extensionUri],
    };
    options.setReceiveMessageDisposable(
      options.panel.webview.onDidReceiveMessage((value) => {
        void handleSemanticDiffExplorerRequest(
          value,
          options.requestOptions,
        ).catch(() => undefined);
      }),
    );
    options.setPanelDisposeDisposable(
      options.panel.onDidDispose(() => options.disposeEntry(false)),
    );
    options.panel.webview.html = buildSemanticDiffExplorerHtml({
      context: options.deps.extensionContext,
      panel: options.panel,
      sessionId: options.session.sessionId,
      outputActionId: options.outputActionId,
    });
  } catch (error) {
    options.disposeEntry(true);
    throw error;
  }
};
