import * as vscode from "vscode";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import type { ViewerOperationId } from "../../../application/telemetry/viewerOperation";
import { createViewerClosedEvent } from "../../../application/telemetry/viewerTelemetry";
import { getTelemetryHost } from "../telemetryHost";
import {
  reportWebviewPerformance,
  reportWebviewSearch,
} from "./messageHandlers";
import {
  isInvalidViewerSaveRequest,
  NAVIGATE,
  OPERATION,
  PERFORMANCE,
  parseViewerRequest,
  READY,
  RESOURCE,
  SAVE,
  SEARCH,
  type ViewerNavigationRequest,
  type ViewerOperationRequest,
  type ViewerPerformanceRequest,
  type ViewerReadyRequest,
  type ViewerRequest,
  type ViewerResourceRequest,
  type ViewerSaveRequest,
  type ViewerSearchRequest,
} from "../../webview/viewerRequestMessages";

type ViewerMessageRoutingDeps = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry: TelemetryPort;
  onReady: (document: vscode.TextDocument, panel: vscode.WebviewPanel) => void;
  onResource: (
    event: ViewerResourceRequest,
    panel: vscode.WebviewPanel,
  ) => void;
  onOperation: (request: ViewerOperationHostRequest) => void;
  onNavigate: (
    document: vscode.TextDocument,
    event: ViewerNavigationRequest,
  ) => void;
  onSave?: (content: string) => Promise<void>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
};

export type ViewerOperationHostRequest = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry: TelemetryPort;
  operation: ViewerOperationId;
};

const SAVE_DATA_ERROR_MESSAGE = "Data is not a string and cannot be saved.";

type ViewerMessageRouteMap = {
  [RESOURCE]: (event: ViewerResourceRequest) => void;
  [READY]: (event: ViewerReadyRequest) => void;
  [SAVE]: (event: ViewerSaveRequest) => void;
  [OPERATION]: (event: ViewerOperationRequest) => void;
  [SEARCH]: (event: ViewerSearchRequest) => void;
  [PERFORMANCE]: (event: ViewerPerformanceRequest) => void;
  [NAVIGATE]: (event: ViewerNavigationRequest) => void;
};

const handleSaveMessage = (
  event: ViewerSaveRequest,
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

const dispatchViewerRequest = (
  routes: ViewerMessageRouteMap,
  event: ViewerRequest,
): void => {
  switch (event.type) {
    case RESOURCE:
      routes[RESOURCE](event);
      return;
    case READY:
      routes[READY](event);
      return;
    case SAVE:
      routes[SAVE](event);
      return;
    case OPERATION:
      routes[OPERATION](event);
      return;
    case SEARCH:
      routes[SEARCH](event);
      return;
    case PERFORMANCE:
      routes[PERFORMANCE](event);
      return;
    case NAVIGATE:
      routes[NAVIGATE](event);
  }
};

export const createViewerMessageHandler = (
  deps: ViewerMessageRoutingDeps,
): ((value: unknown) => void) => {
  const routes = createViewerMessageRoutes(deps);

  return (value: unknown): void => {
    const event = parseViewerRequest(value);
    if (!event) {
      if (isInvalidViewerSaveRequest(value)) {
        void deps.showErrorMessage(SAVE_DATA_ERROR_MESSAGE);
      }
      return;
    }
    dispatchViewerRequest(routes, event);
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
      telemetry.report(event);
    }
    store.removeByUri(uri);
    receiveMessageDispose.dispose();
  });
};
