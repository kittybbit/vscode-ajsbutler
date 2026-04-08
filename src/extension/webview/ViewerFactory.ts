import * as vscode from "vscode";
import * as path from "path";
import type { SaveEventType } from "../../shared/webviewEvents";
import { postResourceMessage, reportWebviewOperation } from "./messageHandlers";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "./viewerMessageRouting";
import { WebviewStore } from "./WebviewStore";
import { MyExtension } from "../MyExtension";

type ViewerFactoryStore = Pick<
  WebviewStore,
  "add" | "panelByDocument" | "removeByDocument"
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
  protected store: ViewerFactoryStore;
  protected myExtension: MyExtension;
  #onReady: ViewerReadyHandler;
  #onSave?: (event: SaveEventType) => Promise<void>;
  #deps: ViewerFactoryDeps;

  public constructor(
    viewType: string,
    myExtension: MyExtension,
    store: ViewerFactoryStore,
    onReady: ViewerReadyHandler,
    onSave?: (event: SaveEventType) => Promise<void>,
    deps: ViewerFactoryDeps = defaultDeps,
  ) {
    this.viewType = viewType;
    this.myExtension = myExtension;
    this.store = store;
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

    const existingPanel = this.store.panelByDocument(document);
    if (existingPanel) {
      return existingPanel;
    }

    return this.createAndStorePanel(document);
  }

  protected registerStandardViewerCustomize(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    onReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
    ) => void,
    onSave?: (event: SaveEventType) => Promise<void>,
  ): void {
    const onDidReceiveMessage = createViewerMessageHandler({
      document,
      panel,
      telemetry: this.myExtension.telemetry,
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
      document,
      panel,
      viewType: this.viewType,
      store: this.store,
      receiveMessageDispose,
    });
  }

  public customize(document: vscode.TextDocument, panel: vscode.WebviewPanel) {
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
    this.store.add(document, panel);
    return panel;
  }
}
