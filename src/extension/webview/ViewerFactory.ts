import * as vscode from "vscode";
import * as path from "path";
import { WebviewMediator } from "./WebviewMediator";
import { WebviewStore } from "./WebviewStore";

/**
 * PanelFactory is responsible for creating and managing webview panels.
 * It ensures that only one panel exists for a given URI, reusing existing panels when possible.
 */
export abstract class ViewerFactory {
  readonly viewType: string;
  protected store: WebviewStore;
  protected webViewMediator: WebviewMediator;

  protected constructor(viewType: string, store: WebviewStore) {
    this.viewType = viewType;
    this.store = store;
  }

  /**
   * Get or create a webview panel for the given URI.
   */
  public getPanel(document: vscode.TextDocument) {
    console.log(
      `invoke PanelFactory.getPanel. (${this.viewType}, ${document.uri.toString()})`,
    );

    let panel = this.store.panelByDocument(document);
    if (panel === undefined) {
      panel = vscode.window.createWebviewPanel(
        this.viewType,
        path.basename(document.fileName),
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      );
      this.customize(document, panel);
      // Add to store
      this.store.add(document, panel);
    }
    return panel;
  }

  abstract customize(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void;
}
