import * as vscode from "vscode";
import * as path from "path";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import type { NavigationEventType } from "../../../shared/webviewEvents";
import { postResourceMessage, reportWebviewOperation } from "./messageHandlers";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "./viewerMessageRouting";

type ViewerFactoryStore = {
  add(uri: vscode.Uri, panel: vscode.WebviewPanel): void;
  panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined;
  removeByUri(uri: vscode.Uri): void;
};

type ViewerFactoryDeps = {
  createWebviewPanel: typeof vscode.window.createWebviewPanel;
};

const defaultDeps: ViewerFactoryDeps = {
  createWebviewPanel: vscode.window.createWebviewPanel,
};

type ViewerReadyHandler = (
  document: vscode.TextDocument,
  panel: vscode.WebviewPanel,
) => void;
type ViewerNavigateHandler = (
  document: vscode.TextDocument,
  event: NavigationEventType,
) => void;

type ViewerFactoryHandlers = {
  onReady: ViewerReadyHandler;
  onNavigate: ViewerNavigateHandler;
  onSave?: (content: string) => Promise<void>;
};

type ViewerFactoryOptions = {
  viewType: string;
  telemetry: TelemetryPort;
  store: ViewerFactoryStore;
  handlers: ViewerFactoryHandlers;
  deps?: ViewerFactoryDeps;
};

type ViewerCustomizeRequest = {
  document: vscode.TextDocument;
  panel: vscode.WebviewPanel;
};

/**
 * PanelFactory is responsible for creating and managing webview panels.
 * It ensures that only one panel exists for a given URI, reusing existing panels when possible.
 */
export class ViewerFactory {
  #store: ViewerFactoryStore;
  #viewType: string;
  #telemetry: TelemetryPort;
  #handlers: ViewerFactoryHandlers;
  #deps: ViewerFactoryDeps;

  public constructor({
    viewType,
    telemetry,
    store,
    handlers,
    deps = defaultDeps,
  }: ViewerFactoryOptions) {
    this.#viewType = viewType;
    this.#telemetry = telemetry;
    this.#store = store;
    this.#handlers = handlers;
    this.#deps = deps;
  }

  /**
   * Get or create a webview panel for the given URI.
   */
  public getPanel(document: vscode.TextDocument) {
    console.log(
      `invoke PanelFactory.getPanel. (${this.#viewType}, ${document.uri.toString()})`,
    );

    const existingPanel = this.getExistingPanel(document);
    if (existingPanel) {
      return existingPanel;
    }

    return this.createAndStorePanel(document);
  }

  public getExistingPanel(
    document: vscode.TextDocument,
  ): vscode.WebviewPanel | undefined {
    return this.#store.panelByUri(document.uri);
  }

  private registerStandardViewerCustomize({
    document,
    panel,
  }: ViewerCustomizeRequest): void {
    const onDidReceiveMessage = createViewerMessageHandler({
      document,
      panel,
      telemetry: this.#telemetry,
      onReady: this.#handlers.onReady,
      onResource: (event, receivedPanel) => {
        console.log("invoke ViewerFactory.onDidReceiveMessage.", event);
        postResourceMessage(event.data, receivedPanel);
      },
      onOperation: reportWebviewOperation,
      onNavigate: this.#handlers.onNavigate,
      onSave: this.#handlers.onSave,
      showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    });
    const receiveMessageDispose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    registerViewerPanelDispose({
      uri: document.uri,
      panel,
      viewType: this.#viewType,
      store: this.#store,
      receiveMessageDispose,
    });
  }

  private customize(document: vscode.TextDocument, panel: vscode.WebviewPanel) {
    this.registerStandardViewerCustomize({
      document,
      panel,
    });
  }

  private createAndStorePanel(
    document: vscode.TextDocument,
  ): vscode.WebviewPanel {
    const panel = this.#deps.createWebviewPanel(
      this.#viewType,
      path.basename(document.fileName),
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );
    this.customize(document, panel);
    this.#store.add(document.uri, panel);
    return panel;
  }
}
