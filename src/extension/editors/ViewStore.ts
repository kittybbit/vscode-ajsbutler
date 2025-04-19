import * as vscode from "vscode";

export class WebviewStore implements vscode.Disposable {
  private views: Set<vscode.WebviewPanel> = new Set();
  private mapUriString = new Map<string, vscode.WebviewPanel>();
  private mapDocument = new Map<vscode.TextDocument, vscode.WebviewPanel>();

  add(webview: vscode.WebviewPanel, document: vscode.TextDocument): void {
    console.log(
      `invoke WebviewStore.add. (${webview.title}, ${document.uri.toString()}`,
    );
    this.views.add(webview);
    this.mapUriString.set(document.uri.toString(), webview);
    this.mapDocument.set(document, webview);
  }

  remove(webview: vscode.WebviewPanel): void {
    console.log(`invoke WebviewStore.remove. (${webview.title})`);
    this.views.delete(webview);
    for (const [key, value] of this.mapUriString.entries()) {
      if (value === webview) {
        this.mapUriString.delete(key);
        break;
      }
    }
    for (const [key, value] of this.mapDocument.entries()) {
      if (value === webview) {
        this.mapDocument.delete(key);
        break;
      }
    }
  }

  get allViews(): Set<vscode.WebviewPanel> {
    return this.views;
  }

  byDocument(document: vscode.TextDocument): vscode.WebviewPanel | undefined {
    return this.mapDocument.get(document);
  }

  byUri(uri: vscode.Uri): vscode.WebviewPanel | undefined {
    return this.mapUriString.get(uri.toString());
  }

  dispose() {
    console.log("invoke WebviewStore.dispose.");
    this.views.clear();
    this.mapUriString.clear();
  }
}
