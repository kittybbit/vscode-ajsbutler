import type * as vscode from "vscode";
import type {
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerSession,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import type {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextEntry,
  SemanticDiffExplorerContextRegistry,
  SemanticDiffSourceCaptureEntry,
} from "./semanticDiffExplorerRegistry";
import type { SemanticDiffExplorerPanelDeps } from "./semanticDiffExplorerPanelTypes";

type PanelLifecycleOptions = Readonly<{
  context: SemanticDiffOutputContext;
  entry: SemanticDiffExplorerContextEntry;
  session: SemanticDiffExplorerSession;
  panel: vscode.WebviewPanel;
  contextRegistry: SemanticDiffExplorerContextRegistry;
  actionRegistry: SemanticDiffExplorerActionRegistry;
  deps: SemanticDiffExplorerPanelDeps;
  sourceEntry: SemanticDiffSourceCaptureEntry | undefined;
  releaseSourceLifetime: () => void;
  receiveMessageDisposable: vscode.Disposable | undefined;
  panelDisposeDisposable: vscode.Disposable | undefined;
  isDisposed: () => boolean;
  markDisposed: () => void;
  advanceEpoch: () => void;
}>;

const disposeDisposable = (disposable: vscode.Disposable | undefined): void => {
  disposable?.dispose();
};

const releaseSource = (
  sourceEntry: SemanticDiffSourceCaptureEntry | undefined,
  releaseSourceLifetime: () => void,
): void => {
  try {
    (sourceEntry?.release ?? releaseSourceLifetime)();
  } catch {
    // Resource release is best effort during panel disposal.
  }
};

const disposeFlowSession = (
  deps: SemanticDiffExplorerPanelDeps,
  sessionId: SemanticDiffExplorerSessionId,
): void => {
  try {
    deps.disposeFlowSession?.(sessionId);
  } catch {
    // A stale overlay cannot replace panel disposal.
  }
};

const disposePanel = (panel: vscode.WebviewPanel): void => {
  try {
    panel.dispose();
  } catch {
    // A host disposal failure must not escape the idempotent handle.
  }
};

export const disposeSemanticDiffExplorerPanel = (
  options: PanelLifecycleOptions,
  disposePanelResource: boolean,
): void => {
  if (options.isDisposed()) return;
  options.markDisposed();
  options.advanceEpoch();
  // The borrowed context entry must disappear before the source hook runs.
  options.contextRegistry.unregister(options.context, options.entry);
  options.contextRegistry.unregisterSourceCapture(options.context);
  options.actionRegistry.remove(options.session.sessionId);
  disposeFlowSession(options.deps, options.session.sessionId);
  releaseSource(options.sourceEntry, options.releaseSourceLifetime);
  disposeDisposable(options.receiveMessageDisposable);
  disposeDisposable(options.panelDisposeDisposable);
  if (disposePanelResource) disposePanel(options.panel);
};
