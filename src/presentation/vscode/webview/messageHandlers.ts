import * as vscode from "vscode";
import { createPerformanceTelemetryEvent } from "../../../application/telemetry/performanceTelemetry";
import { createSearchTelemetryEvent } from "../../../application/telemetry/searchTelemetry";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
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

const RESOURCE_ERROR_MESSAGE = "Viewer resources could not be loaded.";
const SAVE_ERROR_MESSAGE = "The file could not be saved.";

const showErrorMessageSafely = (message: string): void => {
  try {
    void Promise.resolve(vscode.window.showErrorMessage(message)).catch(
      () => undefined,
    );
  } catch {
    // A notification failure must not replace the host-safe outcome.
  }
};

const showInformationMessageSafely = (
  message: string,
  options: vscode.MessageOptions,
): void => {
  try {
    void Promise.resolve(
      vscode.window.showInformationMessage(message, options),
    ).catch(() => undefined);
  } catch {
    // A notification failure must not replace the completed host operation.
  }
};

const reportTelemetrySafely = (
  telemetry: TelemetryPort,
  event: Parameters<TelemetryPort["report"]>[0],
): void => {
  try {
    telemetry.report(event);
  } catch {
    // Telemetry failure must not block webview message handling.
  }
};

export const postResourceMessage = (
  requestedResource: ViewerResourceRequestData,
  panel: vscode.WebviewPanel,
): void => {
  console.log(`post a message of resource. (${panel.title})`);
  try {
    const data: ViewerResourceStateDto = {
      ...requestedResource,
      isDarkMode:
        vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark,
      lang: vscode.env.language,
    };
    void Promise.resolve(
      panel.webview.postMessage(createViewerResourceStateMessage(data)),
    ).catch(() => showErrorMessageSafely(RESOURCE_ERROR_MESSAGE));
  } catch {
    showErrorMessageSafely(RESOURCE_ERROR_MESSAGE);
  }
};

export const saveText = async (content: string): Promise<void> => {
  let uri: vscode.Uri | undefined;
  try {
    uri = await vscode.window.showSaveDialog();
  } catch {
    showErrorMessageSafely(SAVE_ERROR_MESSAGE);
    return;
  }

  if (!uri) {
    showErrorMessageSafely("The file has not been saved.");
    return;
  }

  try {
    await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
  } catch {
    showErrorMessageSafely(SAVE_ERROR_MESSAGE);
    return;
  }

  let detail: string;
  try {
    detail = uri.toString();
  } catch {
    detail = "";
  }
  showInformationMessageSafely("The file has been saved.", {
    detail,
    modal: true,
  });
};

export const reportWebviewOperation = ({
  document,
  panel,
  telemetry,
  operation,
}: ViewerOperationHostRequest): void => {
  let documentUri = "unknown";
  try {
    documentUri = document.uri.toString();
  } catch {
    // Logging must not prevent the catalogued operation from being reported.
  }
  console.log(`post a message of operation. (${documentUri}, ${operation})`);
  reportTelemetrySafely(
    telemetry,
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
    reportTelemetrySafely(telemetry, event);
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
  reportTelemetrySafely(telemetry, telemetryEvent);
};

export const reportWebviewPerformance = (
  telemetry: ViewerOperationHostRequest["telemetry"],
  event: ViewerPerformanceRequest,
): void => {
  const telemetryEvent = createPerformanceTelemetryEvent({
    ...event.data,
    host: getTelemetryHost(),
  });
  reportTelemetrySafely(telemetry, telemetryEvent);
};
