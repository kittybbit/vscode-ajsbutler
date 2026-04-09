import * as vscode from "vscode";

export class WebviewStore implements vscode.Disposable {
  readonly #viewType: string;
  readonly #mapPanel = new Map<string, vscode.WebviewPanel>();

  constructor(viewType: string) {
    this.#viewType = viewType;
  }

  add(uri: vscode.Uri, panel: vscode.WebviewPanel): void {
    console.log(
      `invoke WebviewStore.add. (${this.#viewType}, ${uri.toString()})`,
    );
    const key = this.keyByUri(uri);
    this.#mapPanel.set(key, panel);
    this.prettyPrint();
  }

  removeByUri(uri: vscode.Uri): void {
    console.log(
      `invoke WebviewStore.removeByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    const key = this.keyByUri(uri);
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

  panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined {
    console.log(
      `invoke WebviewStore.panelByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    this.prettyPrint();
    return this.#mapPanel.get(this.keyByUri(uri));
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
  }

  private prettyPrint() {
    console.log("WebviewStore:");
    console.log("  #mapPanel:", this.#mapPanel);
  }

  private deleteByKey(key: string): void {
    this.#mapPanel.delete(key);
  }

  private keyByUri(uri: vscode.Uri): string {
    return uri.toString();
  }

  private keyByPanel(panel: vscode.WebviewPanel): string | undefined {
    for (const [key, value] of this.#mapPanel.entries()) {
      if (value === panel) {
        return key;
      }
    }
    return undefined;
  }
}
