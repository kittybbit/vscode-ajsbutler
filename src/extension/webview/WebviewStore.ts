import * as vscode from "vscode";

export class WebviewStore implements vscode.Disposable {
  readonly #viewType: string;
  readonly #mapDocument = new Map<string, vscode.TextDocument>();
  readonly #mapPanel = new Map<string, vscode.WebviewPanel>();

  constructor(viewType: string) {
    this.#viewType = viewType;
  }

  add(document: vscode.TextDocument, panel: vscode.WebviewPanel): void {
    console.log(
      `invoke WebviewStore.add. (${this.#viewType}, ${document.uri.toString()})`,
    );
    this.#mapDocument.set(document.uri.toString(), document);
    this.#mapPanel.set(document.uri.toString(), panel);
    this.prettyPrint();
  }

  removeByUri(uri: vscode.Uri): void {
    console.log(
      `invoke WebviewStore.removeByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    const panel = this.#mapPanel.get(uri.toString());
    if (!panel) {
      console.log("Webview panel not found for this uri.");
      this.prettyPrint();
      return;
    }
    this.#mapPanel.delete(uri.toString());
    this.#mapDocument.delete(uri.toString());
    this.prettyPrint();
  }

  removeByPanel(panel: vscode.WebviewPanel): void {
    console.log(
      `invoke WebviewStore.removeByPanel. (${this.#viewType}, ${panel.title})`,
    );
    for (const [key, value] of this.#mapPanel.entries()) {
      if (value === panel) {
        this.#mapPanel.delete(key);
        this.#mapDocument.delete(key);
        break;
      }
    }
    this.prettyPrint();
  }

  removeByDocument(document: vscode.TextDocument): void {
    console.log(
      `invoke WebviewStore.removeByDocument. (${this.#viewType}, ${document.uri.toString()})`,
    );
    for (const [key, value] of this.#mapDocument.entries()) {
      if (value === document) {
        const panel = this.#mapPanel.get(key);
        if (panel) {
          this.#mapPanel.delete(key);
        }
        this.#mapDocument.delete(key);
        break;
      }
    }
    this.prettyPrint();
  }

  panelByDocument(
    document: vscode.TextDocument,
  ): vscode.WebviewPanel | undefined {
    console.log(
      `invoke WebviewStore.panelByDocument. (${this.#viewType}, ${document.uri.toString()})`,
    );
    this.prettyPrint();
    return this.#mapPanel.get(document.uri.toString());
  }

  panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined {
    console.log(
      `invoke WebviewStore.panelByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    this.prettyPrint();
    return this.#mapPanel.get(uri.toString());
  }

  documentByUri(uri: vscode.Uri): vscode.TextDocument | undefined {
    console.log(
      `invoke WebviewStore.documentByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    this.prettyPrint();
    return this.#mapDocument.get(uri.toString());
  }

  get allPanels() {
    return new Set(this.#mapPanel.values());
  }

  dispose() {
    console.log("invoke WebviewStore.dispose.");
    this.allPanels.forEach((panel) => {
      panel.dispose();
    });
    this.#mapPanel.clear();
    this.#mapDocument.clear();
  }

  private prettyPrint() {
    console.log("WebviewStore:");
    console.log("  #mapPanel:", this.#mapPanel);
    console.log("  #mapDocument:", this.#mapDocument);
  }
}
