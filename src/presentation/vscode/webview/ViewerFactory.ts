import * as vscode from "vscode";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import type { ViewerNavigationRequest } from "../../webview/viewerRequestMessages";
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
  event: ViewerNavigationRequest,
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

export const resolveViewerPanelTitle = (
  uri: Pick<vscode.Uri, "authority" | "path" | "scheme">,
): string => {
  const pathSegments = uri.path.split("/").filter(Boolean);
  return pathSegments[pathSegments.length - 1] ?? (uri.authority || uri.scheme);
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
  public getPanel(document: vscode.TextDocument): vscode.WebviewPanel {
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
    const isActivePanel = (): boolean => {
      try {
        return this.#store.panelByUri(document.uri) === panel;
      } catch {
        return false;
      }
    };

    const onDidReceiveMessage = createViewerMessageHandler({
      document,
      panel,
      telemetry: this.#telemetry,
      onReady: (receivedDocument, receivedPanel) => {
        if (isActivePanel()) {
          this.#handlers.onReady(receivedDocument, receivedPanel);
        }
      },
      onResource: (event, receivedPanel) => {
        if (!isActivePanel()) {
          return;
        }
        console.log("invoke ViewerFactory.onDidReceiveMessage.", event);
        postResourceMessage(event.data, receivedPanel);
      },
      onOperation: (request) => {
        if (isActivePanel()) {
          reportWebviewOperation(request);
        }
      },
      onNavigate: (receivedDocument, event) => {
        if (isActivePanel()) {
          this.#handlers.onNavigate(receivedDocument, event);
        }
      },
      onSave: this.#handlers.onSave
        ? async (content) => {
            if (isActivePanel()) {
              await this.#handlers.onSave?.(content);
            }
          }
        : undefined,
      showErrorMessage: (message) => vscode.window.showErrorMessage(message),
    });
    const receiveMessageDispose =
      panel.webview.onDidReceiveMessage(onDidReceiveMessage);

    registerViewerPanelDispose({
      uri: document.uri,
      panel,
      viewType: this.#viewType,
      telemetry: this.#telemetry,
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
      resolveViewerPanelTitle(document.uri),
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );

    try {
      // Register the panel before its callbacks so a synchronous disposal
      // during setup cannot leave a dead panel in the store.
      this.#store.add(document.uri, panel);
      if (this.#store.panelByUri(document.uri) !== panel) {
        throw new Error("Viewer panel could not be registered.");
      }
      this.customize(document, panel);
    } catch (error) {
      this.#store.removeByUri(document.uri);
      try {
        panel.dispose();
      } catch {
        // A cleanup failure must not replace the original setup failure.
      }
      throw error;
    }

    if (this.#store.panelByUri(document.uri) !== panel) {
      try {
        panel.dispose();
      } catch {
        // The panel may already have been disposed by a lifecycle callback.
      }
      throw new Error("Viewer panel was disposed during setup.");
    }

    return panel;
  }
}
