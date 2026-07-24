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
  const activeEditor = deps.getActiveEditor();
  if (!activeEditor) {
    reportViewerOpenStarted(deps, viewType, "failed", "no_active_editor");
    void deps.showErrorMessage("No active editor found to open.");
    return;
  }

  console.log(
    `invoke open.${viewType}. (${activeEditor.document.uri.toString()})`,
  );
  const panel = panelFactory.getPanel(activeEditor.document);
  deps.mountPanel(panel, viewType);
  reportViewerOpenStarted(deps, viewType, "success");
  const legacyEvent = createLegacyViewerOpenedEvent(viewType);
  if (legacyEvent) {
    deps.reportTelemetry(legacyEvent);
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

  deps.reportTelemetry(event);
};
