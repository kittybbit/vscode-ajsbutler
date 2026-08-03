import * as vscode from "vscode";
import type { TelemetryEvent } from "../../../application/telemetry/telemetryEvent";
import {
  createLegacyViewerOpenedEvent,
  createViewerOpenStartedEvent,
} from "../../../application/telemetry/viewerTelemetry";
import { getTelemetryHost } from "../telemetryHost";

export type PreviewPanelFactory = {
  getPanel(document: vscode.TextDocument): vscode.WebviewPanel;
};

export type OpenPreviewCommandDependencies = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  reportTelemetry: (event: TelemetryEvent) => void;
};

type ViewerOpenFailureCode =
  | "active_editor_failed"
  | "no_active_editor"
  | "open_failed";

type ExecuteOpenPreviewCommandArgs = {
  viewType: string;
  panelFactory: PreviewPanelFactory;
  deps: OpenPreviewCommandDependencies;
};

export const executeOpenPreviewCommand = ({
  viewType,
  panelFactory,
  deps,
}: ExecuteOpenPreviewCommandArgs): void => {
  let activeEditor: vscode.TextEditor | undefined;
  try {
    activeEditor = deps.getActiveEditor();
  } catch {
    failToOpenViewer(
      deps,
      viewType,
      "active_editor_failed",
      "Active editor could not be accessed.",
    );
    return;
  }

  if (!activeEditor) {
    failToOpenViewer(
      deps,
      viewType,
      "no_active_editor",
      "No active editor found to open.",
    );
    return;
  }

  let document: vscode.TextDocument;
  try {
    document = activeEditor.document;
  } catch {
    failToOpenViewer(
      deps,
      viewType,
      "active_editor_failed",
      "Active editor could not be accessed.",
    );
    return;
  }

  console.log(
    `invoke open.${viewType}. (${formatDocumentUriForLog(document)})`,
  );

  let panel: vscode.WebviewPanel;
  try {
    panel = panelFactory.getPanel(document);
  } catch {
    failToOpenViewer(
      deps,
      viewType,
      "open_failed",
      "Viewer could not be opened.",
    );
    return;
  }

  try {
    deps.mountPanel(panel, viewType);
  } catch {
    disposePanelAfterFailedMount(panel);
    failToOpenViewer(
      deps,
      viewType,
      "open_failed",
      "Viewer could not be opened.",
    );
    return;
  }

  reportViewerOpenStarted(deps, viewType, "success");
  const legacyEvent = createLegacyViewerOpenedEvent(viewType);
  if (legacyEvent) {
    reportTelemetrySafely(deps, legacyEvent);
  }
};

const formatDocumentUriForLog = (document: vscode.TextDocument): string => {
  try {
    return document.uri.toString();
  } catch {
    return "unknown";
  }
};

const failToOpenViewer = (
  deps: OpenPreviewCommandDependencies,
  viewType: string,
  errorCode: ViewerOpenFailureCode,
  message: string,
): void => {
  reportViewerOpenStarted(deps, viewType, "failed", errorCode);
  showErrorMessageSafely(deps, message);
};

const showErrorMessageSafely = (
  deps: OpenPreviewCommandDependencies,
  message: string,
): void => {
  try {
    void Promise.resolve(deps.showErrorMessage(message)).catch(() => undefined);
  } catch {
    // A notification failure must not replace the command's host-safe outcome.
  }
};

const disposePanelAfterFailedMount = (panel: vscode.WebviewPanel): void => {
  try {
    panel.dispose();
  } catch {
    // A disposal failure must not expose the original host exception.
  }
};

const reportViewerOpenStarted = (
  deps: OpenPreviewCommandDependencies,
  viewType: string,
  result: "success" | "failed",
  errorCode?: string,
): void => {
  const event = createViewerOpenStartedEvent({
    viewType,
    source: "command",
    result,
    host: getTelemetryHost(),
    errorCode,
  });
  if (!event) {
    return;
  }

  reportTelemetrySafely(deps, event);
};

const reportTelemetrySafely = (
  deps: OpenPreviewCommandDependencies,
  event: TelemetryEvent,
): void => {
  try {
    deps.reportTelemetry(event);
  } catch {
    // Telemetry failure must not prevent the viewer from opening.
  }
};
