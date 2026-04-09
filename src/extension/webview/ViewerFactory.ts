import * as vscode from "vscode";
import * as path from "path";
import { postResourceMessage, reportWebviewOperation } from "./messageHandlers";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "./viewerMessageRouting";
import { WebviewStore } from "./WebviewStore";
import { MyExtension } from "../MyExtension";

type ViewerFactoryStore = Pick<
  WebviewStore,
  "add" | "panelByUri" | "removeByUri"
>;

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

/**
 * PanelFactory is responsible for creating and managing webview panels.
 * It ensures that only one panel exists for a given URI, reusing existing panels when possible.
 */
export class ViewerFactory {
  readonly viewType: string;
  #store: ViewerFactoryStore;
  #myExtension: MyExtension;
  #onReady: ViewerReadyHandler;
  #onSave?: (content: string) => Promise<void>;
  #deps: ViewerFactoryDeps;

  public constructor(
    viewType: string,
    myExtension: MyExtension,
    store: ViewerFactoryStore,
    onReady: ViewerReadyHandler,
    onSave?: (content: string) => Promise<void>,
    deps: ViewerFactoryDeps = defaultDeps,
  ) {
    this.viewType = viewType;
    this.#myExtension = myExtension;
    this.#store = store;
    this.#onReady = onReady;
    this.#onSave = onSave;
    this.#deps = deps;
  }

  /**
   * Get or create a webview panel for the given URI.
   */
  public getPanel(document: vscode.TextDocument) {
    console.log(
      `invoke PanelFactory.getPanel. (${this.viewType}, ${document.uri.toString()})`,
    );

    const existingPanel = this.#store.panelByUri(document.uri);
    if (existingPanel) {
      return existingPanel;
    }

    return this.createAndStorePanel(document);
  }

  private registerStandardViewerCustomize(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    onReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
    ) => void,
    onSave?: (content: string) => Promise<void>,
  ): void {
    const onDidReceiveMessage = createViewerMessageHandler({
      document,
      panel,
      telemetry: this.#myExtension.telemetry,
      onReady,
      onResource: (event, receivedPanel) => {
        console.log("invoke ViewerFactory.onDidReceiveMessage.", event);
        postResourceMessage(event.data, receivedPanel);
      },
      onOperation: reportWebviewOperation,
      onSave,
      showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    });
    const receiveMessageDispose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    registerViewerPanelDispose({
      uri: document.uri,
      panel,
      viewType: this.viewType,
      store: this.#store,
      receiveMessageDispose,
    });
  }

  private customize(document: vscode.TextDocument, panel: vscode.WebviewPanel) {
    this.registerStandardViewerCustomize(
      document,
      panel,
      this.#onReady,
      this.#onSave,
    );
  }

  private createAndStorePanel(
    document: vscode.TextDocument,
  ): vscode.WebviewPanel {
    const panel = this.#deps.createWebviewPanel(
      this.viewType,
      path.basename(document.fileName),
      vscode.ViewColumn.Beside,
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
