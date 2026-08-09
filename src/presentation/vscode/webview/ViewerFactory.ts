import * as vscode from "vscode";
import type {
  ViewerPanelHandlers,
  ViewerPanelRegistration,
} from "./viewerMessageRouting";

type ViewerFactoryStore = {
  add(uri: vscode.Uri, panel: vscode.WebviewPanel): void;
  panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined;
  removeByUri(uri: vscode.Uri): void;
};

type ViewerFactoryDeps = {
  createWebviewPanel: typeof vscode.window.createWebviewPanel;
  registerPanel: ViewerPanelRegistration;
};

type ViewerFactoryOptions = {
  viewType: string;
  store: ViewerFactoryStore;
  handlers: ViewerPanelHandlers;
  deps: ViewerFactoryDeps;
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
  #handlers: ViewerPanelHandlers;
  #deps: ViewerFactoryDeps;

  public constructor({
    viewType,
    store,
    handlers,
    deps,
  }: ViewerFactoryOptions) {
    this.#viewType = viewType;
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
      this.#deps.registerPanel({
        document,
        panel,
        viewType: this.#viewType,
        handlers: this.#handlers,
        isActivePanel: () => {
          try {
            return this.#store.panelByUri(document.uri) === panel;
          } catch {
            return false;
          }
        },
      });
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
