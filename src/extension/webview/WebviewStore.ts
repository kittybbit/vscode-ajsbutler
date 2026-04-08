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
    const key = document.uri.toString();
    this.#mapDocument.set(key, document);
    this.#mapPanel.set(key, panel);
    this.prettyPrint();
  }

  removeByUri(uri: vscode.Uri): void {
    console.log(
      `invoke WebviewStore.removeByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    const key = uri.toString();
    if (!this.#mapPanel.has(key)) {
      console.log("Webview panel not found for this uri.");
      this.prettyPrint();
      return;
    }
    this.deleteByKey(key);
    this.prettyPrint();
  }

  removeByPanel(panel: vscode.WebviewPanel): void {
    console.log(
      `invoke WebviewStore.removeByPanel. (${this.#viewType}, ${panel.title})`,
    );
    const key = this.keyByPanel(panel);
    if (key) {
      this.deleteByKey(key);
    }
    this.prettyPrint();
  }

  removeByDocument(document: vscode.TextDocument): void {
    console.log(
      `invoke WebviewStore.removeByDocument. (${this.#viewType}, ${document.uri.toString()})`,
    );
    const key = this.keyByDocument(document);
    if (key) {
      this.deleteByKey(key);
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

  private deleteByKey(key: string): void {
    this.#mapPanel.delete(key);
    this.#mapDocument.delete(key);
  }

  private keyByPanel(panel: vscode.WebviewPanel): string | undefined {
    for (const [key, value] of this.#mapPanel.entries()) {
      if (value === panel) {
        return key;
      }
    }
    return undefined;
  }

  private keyByDocument(document: vscode.TextDocument): string | undefined {
    for (const [key, value] of this.#mapDocument.entries()) {
      if (value === document) {
        return key;
      }
    }
    return undefined;
  }
}
