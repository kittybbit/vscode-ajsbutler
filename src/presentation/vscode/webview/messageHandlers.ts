import * as os from "os";
import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { createSearchTelemetryEvent } from "../../../application/telemetry/searchTelemetry";
import {
  createTelemetryEvent,
  telemetryEvents,
} from "../../../application/telemetry/telemetryEvent";
import { createViewerActionEvent } from "../../../application/telemetry/viewerActionTelemetry";
import type { MyAppResource } from "../../../shared/MyAppResource";
import {
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
  telemetry.report(
    createTelemetryEvent(telemetryEvents.legacyWebviewOperation, {
      development: DEVELOPMENT,
      viewType: panel.viewType,
      operation,
    }),
  );
  const event = createViewerActionEvent({
    viewType: panel.viewType,
    operation,
    host: getTelemetryHost(),
  });
  if (event) {
    telemetry.report(event);
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
  telemetry.report(telemetryEvent);
};

export const reportWebviewPerformance = (
  telemetry: ViewerOperationRequest["telemetry"],
  event: PerformanceEventType,
): void => {
  const telemetryEvent = createPerformanceTelemetryEvent({
    ...event.data,
    host: getTelemetryHost(),
  });
  telemetry.report(telemetryEvent);
};
