import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { toDurationBucket } from "../../../application/telemetry/telemetryBuckets";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../../application/unit-list/buildUnitList";
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

const postAjsDocument = (
  buildUnitList: BuildUnitList,
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
  telemetry?: TelemetryPort,
): void => {
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
};

export const createReadyAjsDocument =
  (buildUnitList: BuildUnitList, telemetry?: TelemetryPort) =>
  (document: vscode.TextDocument, panel: vscode.WebviewPanel): void => {
    console.log(`post a message of ready. (${document.uri.toString()})`);
    postAjsDocument(buildUnitList, document, panel, telemetry);
  };

export function createDebouncedAjsDocumentChange(
  buildUnitList: BuildUnitList,
  delay: number = 300,
  telemetry?: TelemetryPort,
) {
  type PendingChange = {
    document: vscode.TextDocument;
    panel: vscode.WebviewPanel;
    timer: ReturnType<typeof setTimeout>;
  };

  const pendingByDocument = new Map<string, PendingChange>();
  const disposedPanels = new WeakSet<vscode.WebviewPanel>();
  const panelDisposals = new WeakMap<vscode.WebviewPanel, vscode.Disposable>();
  const disposalSubscriptions = new Set<vscode.Disposable>();
  let disposed = false;

  const cancelPendingForPanel = (panel: vscode.WebviewPanel): void => {
    for (const [key, pending] of pendingByDocument) {
      if (pending.panel !== panel) {
        continue;
      }
      clearTimeout(pending.timer);
      pendingByDocument.delete(key);
    }
  };

  const registerPanelDisposal = (panel: vscode.WebviewPanel): boolean => {
    if (disposed || disposedPanels.has(panel)) {
      return false;
    }
    if (typeof panel.onDidDispose !== "function") {
      return true;
    }
    if (panelDisposals.has(panel)) {
      return true;
    }

    const disposal = panel.onDidDispose(() => {
      disposedPanels.add(panel);
      cancelPendingForPanel(panel);
      const registeredDisposal = panelDisposals.get(panel);
      if (registeredDisposal) {
        disposalSubscriptions.delete(registeredDisposal);
      }
      panelDisposals.delete(panel);
    });

    if (disposedPanels.has(panel)) {
      disposal.dispose();
      return false;
    }
    panelDisposals.set(panel, disposal);
    disposalSubscriptions.add(disposal);
    return true;
  };

  const onChange = (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void => {
    if (panel === undefined || !registerPanelDisposal(panel)) {
      return;
    }

    const key = document.uri.toString();
    const previous = pendingByDocument.get(key);
    if (previous) {
      clearTimeout(previous.timer);
    }

    const pending: PendingChange = {
      document,
      panel,
      timer: setTimeout(() => {
        if (pendingByDocument.get(key) !== pending) {
          return;
        }
        pendingByDocument.delete(key);
        if (disposedPanels.has(panel)) {
          return;
        }
        console.log(`post a message of changeDocument. ${key}`);
        postAjsDocument(buildUnitList, document, panel, telemetry);
      }, delay),
    };
    pendingByDocument.set(key, pending);
  };

  return Object.assign(onChange, {
    dispose: (): void => {
      disposed = true;
      for (const pending of pendingByDocument.values()) {
        clearTimeout(pending.timer);
      }
      pendingByDocument.clear();
      for (const disposal of disposalSubscriptions) {
        disposal.dispose();
      }
      disposalSubscriptions.clear();
    },
  });
}
