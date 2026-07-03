import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { toDurationBucket } from "../../../application/telemetry/telemetryBuckets";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import type { BuildUnitList } from "../../../application/unit-list/buildUnitList";
import { CHANGE_DOCUMENT } from "../../../shared/webviewEvents";
import { getTelemetryHost } from "../telemetryHost";

const reportUnitListBuildPerformance = (
  telemetry: TelemetryPort | undefined,
  durationMs: number,
  result: "success" | "failed",
): void => {
  if (!telemetry) {
    return;
  }

  try {
    const event = createPerformanceTelemetryEvent({
      operation: "unit_list_build",
      result,
      host: getTelemetryHost(),
      durationBucket: toDurationBucket(durationMs),
    });
    telemetry.trackEvent(event.name, event.properties);
  } catch {
    // Performance telemetry must not block document posting.
  }
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
  panel.webview.postMessage({
    type: CHANGE_DOCUMENT,
    data: result.document,
  });
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
  const id = new Map<string, ReturnType<typeof setTimeout>>();
  return (document: vscode.TextDocument, panel: vscode.WebviewPanel) => {
    if (panel === undefined) {
      return;
    }
    const key = document.uri.toString();
    clearTimeout(id.get(key));
    id.set(
      key,
      setTimeout(() => {
        console.log(`post a message of changeDocument. ${key}:${id.get(key)}`);
        postAjsDocument(buildUnitList, document, panel, telemetry);
      }, delay),
    );
  };
}
