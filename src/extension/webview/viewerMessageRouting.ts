import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  OPERATION,
  READY,
  RESOURCE,
  SAVE,
  type ResourceEventType,
  type SaveEventType,
  type WebviewEventType,
} from "../../shared/webviewEvents";
import { WebviewStore } from "./WebviewStore";

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
  onSave?: (event: SaveEventType) => Promise<void>;
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
          void onSave(event);
        } else {
          void showErrorMessage("Data is not a string and cannot be saved.");
        }
        break;
      }
      case OPERATION: {
        onOperation(document, panel, telemetry, event.data);
        break;
      }
    }
  };

type ViewerPanelDisposeDeps = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
  viewType: string;
  store: Pick<WebviewStore, "removeByDocument">;
  receiveMessageDispose: Pick<vscode.Disposable, "dispose">;
};

export const registerViewerPanelDispose = ({
  document,
  panel,
  viewType,
  store,
  receiveMessageDispose,
}: ViewerPanelDisposeDeps): void => {
  panel.onDidDispose(() => {
    console.log(
      `invoke panel.onDidDispose. (${viewType}, ${document.uri.toString()})`,
    );
    store.removeByDocument(document);
    receiveMessageDispose.dispose();
  });
};
