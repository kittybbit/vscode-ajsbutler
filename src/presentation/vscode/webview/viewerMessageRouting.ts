import * as vscode from "vscode";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import { createViewerClosedEvent } from "../../../application/telemetry/viewerTelemetry";
import { getTelemetryHost } from "../telemetryHost";
import {
  reportWebviewPerformance,
  reportWebviewSearch,
} from "./messageHandlers";
import {
  NAVIGATE,
  OPERATION,
  PERFORMANCE,
  READY,
  RESOURCE,
  SAVE,
  SEARCH,
  type NavigationEventType,
  type OperationEventType,
  type PerformanceEventType,
  type ReadyEventType,
  type ResourceEventType,
  type SaveEventType,
  type SearchEventType,
  type WebviewEventType,
} from "../../../shared/webviewEvents";

type ViewerMessageRoutingDeps = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry: TelemetryPort;
  onReady: (document: vscode.TextDocument, panel: vscode.WebviewPanel) => void;
  onResource: (event: ResourceEventType, panel: vscode.WebviewPanel) => void;
  onOperation: (request: ViewerOperationRequest) => void;
  onNavigate: (
    document: vscode.TextDocument,
    event: NavigationEventType,
  ) => void;
  onSave?: (content: string) => Promise<void>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
};

export type ViewerOperationRequest = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry: TelemetryPort;
  operation: string;
};

const SAVE_DATA_ERROR_MESSAGE = "Data is not a string and cannot be saved.";

type ViewerMessageRouteMap = {
  [RESOURCE]: (event: ResourceEventType) => void;
  [READY]: (event: ReadyEventType) => void;
  [SAVE]: (event: SaveEventType) => void;
  [OPERATION]: (event: OperationEventType) => void;
  [SEARCH]: (event: SearchEventType) => void;
  [PERFORMANCE]: (event: PerformanceEventType) => void;
  [NAVIGATE]: (event: NavigationEventType) => void;
};

const handleSaveMessage = (
  event: SaveEventType,
  {
    onSave,
    showErrorMessage,
  }: Pick<ViewerMessageRoutingDeps, "onSave" | "showErrorMessage">,
): void => {
  if (typeof event.data === "string" && onSave) {
    void onSave(event.data);
    return;
  }

  void showErrorMessage(SAVE_DATA_ERROR_MESSAGE);
};

const createViewerMessageRoutes = ({
  document,
  panel,
  telemetry,
  onReady,
  onResource,
  onOperation,
  onNavigate,
  onSave,
  showErrorMessage,
}: ViewerMessageRoutingDeps): ViewerMessageRouteMap => ({
  [RESOURCE]: (event) => {
    onResource(event, panel);
  },
  [READY]: () => {
    onReady(document, panel);
  },
  [SAVE]: (event) => {
    handleSaveMessage(event, { onSave, showErrorMessage });
  },
  [OPERATION]: (event) => {
    onOperation({ document, panel, telemetry, operation: event.data });
  },
  [SEARCH]: (event) => {
    reportWebviewSearch(telemetry, event);
  },
  [PERFORMANCE]: (event) => {
    reportWebviewPerformance(telemetry, event);
  },
  [NAVIGATE]: (event) => {
    onNavigate(document, event);
  },
});

export const createViewerMessageHandler = (
  deps: ViewerMessageRoutingDeps,
): ((event: WebviewEventType) => void) => {
  const routes = createViewerMessageRoutes(deps);

  return (event: WebviewEventType): void => {
    const route = routes[event.type] as (event: WebviewEventType) => void;
    route(event);
  };
};

type ViewerPanelDisposeDeps = {
  uri: vscode.Uri;
  panel: vscode.WebviewPanel;
  viewType: string;
  telemetry: TelemetryPort;
  store: {
    removeByUri(uri: vscode.Uri): void;
  };
  receiveMessageDispose: Pick<vscode.Disposable, "dispose">;
};

export const registerViewerPanelDispose = ({
  uri,
  panel,
  viewType,
  store,
  receiveMessageDispose,
  telemetry,
}: ViewerPanelDisposeDeps): void => {
  panel.onDidDispose(() => {
    console.log(`invoke panel.onDidDispose. (${viewType}, ${uri.toString()})`);
    const event = createViewerClosedEvent({
      viewType,
      host: getTelemetryHost(),
    });
    if (event) {
      telemetry.trackEvent(event.name, event.properties);
    }
    store.removeByUri(uri);
    receiveMessageDispose.dispose();
  });
};
