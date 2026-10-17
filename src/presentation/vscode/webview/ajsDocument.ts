import * as vscode from "vscode";
import type { BuildUnitList } from "../../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import { createViewerDocumentChangedMessage } from "../../webview/viewerHostMessages";

export type AjsDocumentPostResult = "success" | "failed";

type PostedAjsDocument = Readonly<{
  document: UnitListDocumentDto | null;
  posted: boolean;
}>;

const postAjsDocument = async ({
  buildUnitList,
  document,
  panel,
}: Readonly<{
  buildUnitList: BuildUnitList;
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
}>): Promise<PostedAjsDocument> => {
  const result = buildUnitList(document.getText());
  const nextDocument = result.document ?? null;
  const posted = await panel.webview.postMessage(
    createViewerDocumentChangedMessage(result.document),
  );
  return { document: nextDocument, posted };
};

export type AjsDocumentPostedListener = (
  document: UnitListDocumentDto | null,
  panel: vscode.WebviewPanel,
) => void;

export const createReadyAjsDocument =
  (buildUnitList: BuildUnitList) =>
  async (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): Promise<AjsDocumentPostResult> => {
    console.log(`post a message of ready. (${document.uri.toString()})`);
    const result = await postAjsDocument({ buildUnitList, document, panel });
    return result.document && result.posted ? "success" : "failed";
  };

type PendingChange = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  timer: ReturnType<typeof setTimeout>;
};

type DebouncedAjsDocumentChangeOptions = Readonly<{
  buildUnitList: BuildUnitList;
  delay: number;
  onDocumentPosted?: AjsDocumentPostedListener;
}>;

class DebouncedAjsDocumentChange {
  private readonly pendingByDocument = new Map<string, PendingChange>();
  private readonly disposedPanels = new WeakSet<vscode.WebviewPanel>();
  private readonly panelDisposals = new WeakMap<
    vscode.WebviewPanel,
    vscode.Disposable
  >();
  private readonly disposalSubscriptions = new Set<vscode.Disposable>();
  private disposed = false;

  public constructor(
    private readonly options: DebouncedAjsDocumentChangeOptions,
  ) {}

  public onChange = (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void => {
    if (panel === undefined || !this.registerPanelDisposal(panel)) return;
    this.scheduleChange(document, panel);
  };

  private cancelPendingForPanel(panel: vscode.WebviewPanel): void {
    for (const [key, pending] of this.pendingByDocument) {
      if (pending.panel === panel) {
        clearTimeout(pending.timer);
        this.pendingByDocument.delete(key);
      }
    }
  }

  private canRegisterPanel(panel: vscode.WebviewPanel): boolean {
    return !this.disposed && !this.disposedPanels.has(panel);
  }

  private registerPanelDisposal(panel: vscode.WebviewPanel): boolean {
    if (!this.canRegisterPanel(panel)) return false;
    if (this.panelReadyForDisposal(panel)) return true;
    const disposal = this.subscribePanelDisposal(panel);
    return this.storePanelDisposal(panel, disposal);
  }

  private panelReadyForDisposal(panel: vscode.WebviewPanel): boolean {
    return (
      typeof panel.onDidDispose !== "function" || this.panelDisposals.has(panel)
    );
  }

  private subscribePanelDisposal(
    panel: vscode.WebviewPanel,
  ): vscode.Disposable {
    return panel.onDidDispose!(() => this.handlePanelDisposed(panel));
  }

  private handlePanelDisposed(panel: vscode.WebviewPanel): void {
    this.disposedPanels.add(panel);
    this.cancelPendingForPanel(panel);
    const disposal = this.panelDisposals.get(panel);
    if (disposal) this.disposalSubscriptions.delete(disposal);
    this.panelDisposals.delete(panel);
  }

  private storePanelDisposal(
    panel: vscode.WebviewPanel,
    disposal: vscode.Disposable,
  ): boolean {
    if (this.disposedPanels.has(panel)) {
      disposal.dispose();
      return false;
    }
    this.panelDisposals.set(panel, disposal);
    this.disposalSubscriptions.add(disposal);
    return true;
  }

  private scheduleChange(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void {
    const key = document.uri.toString();
    const previous = this.pendingByDocument.get(key);
    if (previous) clearTimeout(previous.timer);
    const pending = {
      document,
      panel,
      timer: setTimeout(
        () => this.flushChange(key, pending),
        this.options.delay,
      ),
    };
    this.pendingByDocument.set(key, pending);
  }

  private flushChange(key: string, pending: PendingChange): void {
    if (this.pendingByDocument.get(key) !== pending) return;
    this.pendingByDocument.delete(key);
    if (this.disposedPanels.has(pending.panel)) return;
    console.log(`post a message of changeDocument. ${key}`);
    void postAjsDocument({
      buildUnitList: this.options.buildUnitList,
      document: pending.document,
      panel: pending.panel,
    })
      .then(({ document }) => {
        this.options.onDocumentPosted?.(document, pending.panel);
      })
      .catch(() => undefined);
  }

  public dispose(): void {
    this.disposed = true;
    for (const pending of this.pendingByDocument.values()) {
      clearTimeout(pending.timer);
    }
    this.pendingByDocument.clear();
    for (const disposal of this.disposalSubscriptions) {
      disposal.dispose();
    }
    this.disposalSubscriptions.clear();
  }
}

export function createDebouncedAjsDocumentChange(
  buildUnitList: BuildUnitList,
  delay = 300,
  onDocumentPosted?: AjsDocumentPostedListener,
) {
  const state = new DebouncedAjsDocumentChange({
    buildUnitList,
    delay,
    onDocumentPosted,
  });
  return Object.assign(state.onChange, {
    dispose: (): void => state.dispose(),
  });
}
