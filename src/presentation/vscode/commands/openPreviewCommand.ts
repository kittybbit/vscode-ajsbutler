import * as vscode from "vscode";
import { createViewerOpenStartedEvent } from "../../../application/telemetry/viewerTelemetry";
import { getTelemetryHost } from "../telemetryHost";

export type PreviewPanelFactory = {
  getPanel(document: vscode.TextDocument): vscode.WebviewPanel;
};

export type OpenPreviewCommandDependencies = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  mountPanel: (panel: vscode.WebviewPanel, viewType: string) => void;
  trackEvent: (viewType: string, properties: Record<string, string>) => void;
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
  deps.trackEvent(viewType, {
    development: String(DEVELOPMENT),
  });
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

  deps.trackEvent(event.name, event.properties);
};
