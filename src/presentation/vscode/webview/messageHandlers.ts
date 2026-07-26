import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { createSearchTelemetryEvent } from "../../../application/telemetry/searchTelemetry";
import {
  createTelemetryEvent,
  telemetryEvents,
} from "../../../application/telemetry/telemetryEvent";
import { createViewerActionEvent } from "../../../application/telemetry/viewerActionTelemetry";
import {
  createViewerResourceStateMessage,
  type ViewerResourceStateDto,
} from "../../webview/viewerHostMessages";
import {
  type ViewerPerformanceRequest,
  type ViewerResourceRequestData,
  type ViewerSearchRequest,
} from "../../webview/viewerRequestMessages";
import { getTelemetryHost } from "../telemetryHost";
import type { ViewerOperationHostRequest } from "./viewerMessageRouting";

export const postResourceMessage = (
  requestedResource: ViewerResourceRequestData,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of resource. (${panel.title})`);
  const data: ViewerResourceStateDto = {
    ...requestedResource,
    isDarkMode:
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
    lang: vscode.env.language,
  };
  panel.webview.postMessage(createViewerResourceStateMessage(data));
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
}: ViewerOperationHostRequest): void => {
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
  telemetry: ViewerOperationHostRequest["telemetry"],
  event: ViewerSearchRequest,
): void => {
  const telemetryEvent = createSearchTelemetryEvent({
    ...event.data,
    host: getTelemetryHost(),
  });
  telemetry.report(telemetryEvent);
};

export const reportWebviewPerformance = (
  telemetry: ViewerOperationHostRequest["telemetry"],
  event: ViewerPerformanceRequest,
): void => {
  const telemetryEvent = createPerformanceTelemetryEvent({
    ...event.data,
    host: getTelemetryHost(),
  });
  telemetry.report(telemetryEvent);
};
