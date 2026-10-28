import * as vscode from "vscode";
import {
  createCsvExportedEvent,
  createSearchExecutedEvent,
} from "../../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import { postResourceMessage } from "./messageHandlers";
import {
  isInvalidViewerSaveRequest,
  NAVIGATE,
  parseViewerRequest,
  READY,
  RESOURCE,
  SAVE,
  SEARCH,
  CSV_EXPORT,
  DISPLAY,
  type ViewerDisplayResult,
  type ViewerNavigationRequest,
  type ViewerRequest,
  type ViewerResourceRequest,
  type ViewerSaveRequest,
} from "../../webview/viewerRequestMessages";

export type ViewerPanelHandlers = {
  onReady: (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ) => void | Promise<void>;
  onNavigate: (
    document: vscode.TextDocument,
    event: ViewerNavigationRequest,
  ) => void;
  onDisplay?: (result: ViewerDisplayResult, panel: vscode.WebviewPanel) => void;
  onDisposed?: (panel: vscode.WebviewPanel) => void;
  onSave?: (content: string) => Promise<boolean>;
};

export type ViewerPanelRegistrationRequest = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  viewType: string;
  handlers: ViewerPanelHandlers;
  isActivePanel: () => boolean;
};

export type ViewerPanelRegistration = (
  request: ViewerPanelRegistrationRequest,
) => void;

type ViewerMessageRoutingDeps = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry: TelemetryPort;
  isActivePanel: () => boolean;
  onReady: (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ) => void | Promise<void>;
  onResource: (
    event: ViewerResourceRequest,
    panel: vscode.WebviewPanel,
  ) => void;
  onNavigate: (
    document: vscode.TextDocument,
    event: ViewerNavigationRequest,
  ) => void;
  onDisplay: (result: ViewerDisplayResult) => void;
  onSave?: (content: string) => Promise<boolean>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
};

const SAVE_DATA_ERROR_MESSAGE = "Data is not a string and cannot be saved.";
const SAVE_HANDLER_UNAVAILABLE_ERROR_MESSAGE =
  "Saving is not available for this viewer.";
const SAVE_OPERATION_ERROR_MESSAGE = "The file could not be saved.";
const RESOURCE_OPERATION_ERROR_MESSAGE =
  "Viewer resources could not be loaded.";
const READY_OPERATION_ERROR_MESSAGE =
  "The viewer document could not be refreshed.";
const NAVIGATION_OPERATION_ERROR_MESSAGE =
  "Viewer navigation could not be completed.";

const showErrorMessageSafely = (
  showErrorMessage: ViewerMessageRoutingDeps["showErrorMessage"],
  message: string,
): void => {
  try {
    void Promise.resolve(showErrorMessage(message)).catch(() => undefined);
  } catch {
    // A notification failure must not replace the host-safe outcome.
  }
};

const runViewerHostOperationSafely = (
  operation: () => void | Promise<void>,
  onFailure?: () => void,
): void => {
  try {
    void Promise.resolve(operation()).catch(() => onFailure?.());
  } catch {
    onFailure?.();
  }
};

type ViewerMessageRouteMap = {
  [Request in ViewerRequest as Request["type"]]: (event: Request) => void;
};

const reportTelemetrySafely = (
  isActivePanel: () => boolean,
  telemetry: TelemetryPort,
  event: Parameters<TelemetryPort["report"]>[0],
): void => {
  if (!isActivePanel()) return;
  try {
    telemetry.report(event);
  } catch {
    // Telemetry must not block webview message handling.
  }
};

const handleSaveMessage = (
  event: ViewerSaveRequest,
  {
    onSave,
    showErrorMessage,
  }: Pick<ViewerMessageRoutingDeps, "onSave" | "showErrorMessage">,
): void => {
  if (typeof event.data !== "string") {
    showErrorMessageSafely(showErrorMessage, SAVE_DATA_ERROR_MESSAGE);
    return;
  }
  if (!onSave) {
    showErrorMessageSafely(
      showErrorMessage,
      SAVE_HANDLER_UNAVAILABLE_ERROR_MESSAGE,
    );
    return;
  }
  void Promise.resolve()
    .then(() => onSave(event.data))
    .catch(() => {
      showErrorMessageSafely(showErrorMessage, SAVE_OPERATION_ERROR_MESSAGE);
    });
};

const createViewerMessageRoutes = ({
  document,
  panel,
  telemetry,
  isActivePanel,
  onReady,
  onResource,
  onNavigate,
  onDisplay,
  onSave,
  showErrorMessage,
}: ViewerMessageRoutingDeps): ViewerMessageRouteMap => ({
  [RESOURCE]: (event) => {
    runViewerHostOperationSafely(
      () => onResource(event, panel),
      () =>
        showErrorMessageSafely(
          showErrorMessage,
          RESOURCE_OPERATION_ERROR_MESSAGE,
        ),
    );
  },
  [READY]: () => {
    runViewerHostOperationSafely(
      () => onReady(document, panel),
      () =>
        showErrorMessageSafely(showErrorMessage, READY_OPERATION_ERROR_MESSAGE),
    );
  },
  [SAVE]: (event) => handleSaveMessage(event, { onSave, showErrorMessage }),
  [SEARCH]: (event) =>
    reportTelemetrySafely(
      isActivePanel,
      telemetry,
      createSearchExecutedEvent(event.data.feature),
    ),
  [CSV_EXPORT]: () =>
    reportTelemetrySafely(
      isActivePanel,
      telemetry,
      createCsvExportedEvent("copy"),
    ),
  [DISPLAY]: (event) => onDisplay(event.data),
  [NAVIGATE]: (event) => {
    runViewerHostOperationSafely(
      () => onNavigate(document, event),
      () =>
        showErrorMessageSafely(
          showErrorMessage,
          NAVIGATION_OPERATION_ERROR_MESSAGE,
        ),
    );
  },
});

const dispatchViewerRequest = (
  routes: ViewerMessageRouteMap,
  event: ViewerRequest,
): void => {
  routes[event.type](event as never);
};

export const createViewerMessageHandler = (
  deps: ViewerMessageRoutingDeps,
): ((value: unknown) => void) => {
  const routes = createViewerMessageRoutes(deps);
  return (value: unknown): void => {
    const event = parseViewerRequest(value);
    if (!event) {
      if (isInvalidViewerSaveRequest(value)) {
        showErrorMessageSafely(deps.showErrorMessage, SAVE_DATA_ERROR_MESSAGE);
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
  store: { removeByUri(uri: vscode.Uri): void };
  receiveMessageDispose: Pick<vscode.Disposable, "dispose">;
  onDisposed: (panel: vscode.WebviewPanel) => void;
};

type ViewerPanelRegistrationDeps = ViewerPanelRegistrationRequest & {
  telemetry: TelemetryPort;
  store: Pick<ViewerPanelDisposeDeps["store"], "removeByUri">;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
};

export const registerViewerPanel = ({
  document,
  panel,
  viewType,
  handlers,
  isActivePanel,
  telemetry,
  store,
  showErrorMessage,
}: ViewerPanelRegistrationDeps): void => {
  const runActivePanelOperation = <TResult>(
    operation: () => TResult,
  ): TResult | undefined => {
    if (!isActivePanel()) return undefined;
    return operation();
  };
  const onDidReceiveMessage = createViewerMessageHandler({
    document,
    panel,
    telemetry,
    isActivePanel,
    onReady: (receivedDocument, receivedPanel) =>
      runActivePanelOperation(() =>
        handlers.onReady(receivedDocument, receivedPanel),
      ),
    onResource: (event, receivedPanel) =>
      runActivePanelOperation(() => {
        console.log("invoke ViewerFactory.onDidReceiveMessage.", event);
        postResourceMessage(event.data, receivedPanel);
      }),
    onNavigate: (receivedDocument, event) =>
      runActivePanelOperation(() => {
        handlers.onNavigate(receivedDocument, event);
      }),
    onDisplay: (result) =>
      runActivePanelOperation(() => {
        handlers.onDisplay?.(result, panel);
      }),
    onSave: handlers.onSave
      ? async (content) =>
          runActivePanelOperation(() => handlers.onSave?.(content)) ?? false
      : undefined,
    showErrorMessage,
  });
  const receiveMessageDispose =
    panel.webview.onDidReceiveMessage(onDidReceiveMessage);

  registerViewerPanelDispose({
    uri: document.uri,
    panel,
    viewType,
    store,
    receiveMessageDispose,
    onDisposed: (disposedPanel) => handlers.onDisposed?.(disposedPanel),
  });
};

export const registerViewerPanelDispose = ({
  uri,
  panel,
  viewType,
  store,
  receiveMessageDispose,
  onDisposed,
}: ViewerPanelDisposeDeps): void => {
  panel.onDidDispose(() => {
    console.log(`invoke panel.onDidDispose. (${viewType}, ${uri.toString()})`);
    try {
      onDisposed(panel);
    } catch {
      // Pending lifecycle reporting cannot interfere with panel disposal.
    }
    store.removeByUri(uri);
    receiveMessageDispose.dispose();
  });
};
