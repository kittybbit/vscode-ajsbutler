import * as os from "os";
import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { createSearchTelemetryEvent } from "../../../application/telemetry/searchTelemetry";
import { createViewerActionEvent } from "../../../application/telemetry/viewerActionTelemetry";
import type { MyAppResource } from "../../../shared/MyAppResource";
import {
  OPERATION,
  type PerformanceEventType,
  type SearchEventType,
} from "../../../shared/webviewEvents";
import { getTelemetryHost } from "../telemetryHost";
import type { ViewerOperationRequest } from "./viewerMessageRouting";

export const postResourceMessage = (
  requestedResource: MyAppResource,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of resource. (${panel.title})`);
  const data: MyAppResource = {
    ...requestedResource,
    isDarkMode:
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
    lang: vscode.env.language,
    os: os.platform().toLowerCase(),
  };
  panel.webview.postMessage({
    type: "resource",
    data,
  });
};

export const saveText = async (content: string): Promise<void> => {
  const uri = await vscode.window.showSaveDialog();
  if (!uri) {
    void vscode.window.showErrorMessage("The file has not been saved.");
    return;
  }

  await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
  void vscode.window.showInformationMessage("The file has been saved.", {
    detail: uri.toString(),
    modal: true,
  });
};

export const reportWebviewOperation = ({
  document,
  panel,
  telemetry,
  operation,
}: ViewerOperationRequest): void => {
  console.log(
    `post a message of operation. (${document.uri.toString()}, ${operation})`,
  );
  telemetry.trackEvent(OPERATION, {
    development: String(DEVELOPMENT),
    viewType: panel.viewType,
    operation,
  });
  const event = createViewerActionEvent({
    viewType: panel.viewType,
    operation,
    host: getTelemetryHost(),
  });
  if (event) {
    try {
      telemetry.trackEvent(event.name, event.properties);
    } catch {
      // Viewer action telemetry must not block webview operation handling.
    }
  }
};

export const reportWebviewSearch = (
  telemetry: ViewerOperationRequest["telemetry"],
  event: SearchEventType,
): void => {
  const telemetryEvent = createSearchTelemetryEvent({
    ...event.data,
    host: getTelemetryHost(),
  });
  try {
    telemetry.trackEvent(telemetryEvent.name, telemetryEvent.properties);
  } catch {
    // Search telemetry must not block webview message handling.
  }
};

export const reportWebviewPerformance = (
  telemetry: ViewerOperationRequest["telemetry"],
  event: PerformanceEventType,
): void => {
  const telemetryEvent = createPerformanceTelemetryEvent({
    ...event.data,
    host: getTelemetryHost(),
  });
  try {
    telemetry.trackEvent(telemetryEvent.name, telemetryEvent.properties);
  } catch {
    // Performance telemetry must not block webview message handling.
  }
};
