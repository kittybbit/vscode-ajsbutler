import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  NAVIGATE,
  OPERATION,
  READY,
  RESOURCE,
  SAVE,
  type NavigationEventType,
  type ResourceEventType,
  type WebviewEventType,
} from "../../shared/webviewEvents";

type ViewerMessageRoutingDeps = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  telemetry: TelemetryPort;
  onReady: (document: vscode.TextDocument, panel: vscode.WebviewPanel) => void;
  onResource: (event: ResourceEventType, panel: vscode.WebviewPanel) => void;
  onOperation: (
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    telemetry: TelemetryPort,
    operation: string,
  ) => void;
  onNavigate: (
    document: vscode.TextDocument,
    event: NavigationEventType,
  ) => void;
  onSave?: (content: string) => Promise<void>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
};

export const createViewerMessageHandler =
  ({
    document,
    panel,
    telemetry,
    onReady,
    onResource,
    onOperation,
    onNavigate,
    onSave,
    showErrorMessage,
  }: ViewerMessageRoutingDeps) =>
  (event: WebviewEventType): void => {
    switch (event.type) {
      case RESOURCE: {
        onResource(event, panel);
        break;
      }
      case READY: {
        onReady(document, panel);
        break;
      }
      case SAVE: {
        if (typeof event.data === "string" && onSave) {
          void onSave(event.data);
        } else {
          void showErrorMessage("Data is not a string and cannot be saved.");
        }
        break;
      }
      case OPERATION: {
        onOperation(document, panel, telemetry, event.data);
        break;
      }
      case NAVIGATE: {
        onNavigate(document, event);
        break;
      }
    }
  };

type ViewerPanelDisposeDeps = {
  uri: vscode.Uri;
  panel: vscode.WebviewPanel;
  viewType: string;
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
}: ViewerPanelDisposeDeps): void => {
  panel.onDidDispose(() => {
    console.log(`invoke panel.onDidDispose. (${viewType}, ${uri.toString()})`);
    store.removeByUri(uri);
    receiveMessageDispose.dispose();
  });
};
