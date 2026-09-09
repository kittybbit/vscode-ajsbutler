import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { toDurationBucket } from "../../../application/telemetry/telemetryBuckets";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import { createViewerDocumentChangedMessage } from "../../webview/viewerHostMessages";
import { getTelemetryHost } from "../telemetryHost";

const reportUnitListBuildPerformance = (
  telemetry: TelemetryPort | undefined,
  durationMs: number,
  result: "success" | "failed",
): void => {
  if (!telemetry) {
    return;
  }

  const event = createPerformanceTelemetryEvent({
    operation: "unit_list_build",
    result,
    host: getTelemetryHost(),
    durationBucket: toDurationBucket(durationMs),
  });
  telemetry.report(event);
};

const postAjsDocument = ({
  buildUnitList,
  document,
  panel,
  telemetry,
}: Readonly<{
  buildUnitList: BuildUnitList;
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry?: TelemetryPort;
}>): UnitListDocumentDto | null => {
  const startedAt = performance.now();
  const result = buildUnitList(document.getText());
  reportUnitListBuildPerformance(
    telemetry,
    performance.now() - startedAt,
    result.errors.length > 0 ? "failed" : "success",
  );
  panel.webview.postMessage(
    createViewerDocumentChangedMessage(result.document),
  );
  return result.document ?? null;
};

export type AjsDocumentPostedListener = (
  document: UnitListDocumentDto | null,
  panel: vscode.WebviewPanel,
) => void;

export const createReadyAjsDocument =
  (buildUnitList: BuildUnitList, telemetry?: TelemetryPort) =>
  (document: vscode.TextDocument, panel: vscode.WebviewPanel): void => {
    console.log(`post a message of ready. (${document.uri.toString()})`);
    postAjsDocument({ buildUnitList, document, panel, telemetry });
  };

type PendingChange = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  timer: ReturnType<typeof setTimeout>;
};

type DebouncedAjsDocumentChangeOptions = Readonly<{
  buildUnitList: BuildUnitList;
  delay: number;
  telemetry?: TelemetryPort;
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
    const nextDocument = postAjsDocument({
      buildUnitList: this.options.buildUnitList,
      document: pending.document,
      panel: pending.panel,
      telemetry: this.options.telemetry,
    });
    this.options.onDocumentPosted?.(nextDocument, pending.panel);
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

type DebouncedAjsDocumentChangeArgs = readonly [
  BuildUnitList,
  (number | undefined)?,
  (TelemetryPort | undefined)?,
  (AjsDocumentPostedListener | undefined)?,
];

export function createDebouncedAjsDocumentChange(
  ...args: DebouncedAjsDocumentChangeArgs
) {
  const [buildUnitList, delay = 300, telemetry, onDocumentPosted] = args;
  const state = new DebouncedAjsDocumentChange({
    buildUnitList,
    delay,
    telemetry,
    onDocumentPosted,
  });
  return Object.assign(state.onChange, {
    dispose: (): void => state.dispose(),
  });
}
