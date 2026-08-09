import * as vscode from "vscode";

export class WebviewStore implements vscode.Disposable {
  readonly #viewType: string;
  readonly #mapPanel = new Map<string, vscode.WebviewPanel>();
  #disposed = false;

  constructor(viewType: string) {
    this.#viewType = viewType;
  }

  add(uri: vscode.Uri, panel: vscode.WebviewPanel): void {
    console.log(
      `invoke WebviewStore.add. (${this.#viewType}, ${uri.toString()})`,
    );
    if (this.#disposed) {
      this.disposePanelSafely(panel);
      return;
    }
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

  panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined {
    console.log(
      `invoke WebviewStore.panelByUri. (${this.#viewType}, ${uri.toString()})`,
    );
    this.prettyPrint();
    return this.#mapPanel.get(this.keyByUri(uri));
  }

  get allPanels(): ReadonlySet<vscode.WebviewPanel> {
    return new Set(this.#mapPanel.values());
  }

  dispose(): void {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    console.log("invoke WebviewStore.dispose.");
    const panels = this.allPanels;
    this.#mapPanel.clear();
    panels.forEach((panel) => {
      this.disposePanelSafely(panel);
    });
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

  private disposePanelSafely(panel: vscode.WebviewPanel): void {
    try {
      panel.dispose();
    } catch {
      // Continue releasing the remaining panels when one disposal fails.
    }
  }
}
