import * as assert from "assert";
import * as vscode from "vscode";
import { WebviewMediator } from "../../extension/webview/WebviewMediator";

type Listener<T> = (event: T) => void;

suite("WebviewMediator", () => {
  test("routes close, rename, and theme events through focused handlers", () => {
    const removedByUri: string[] = [];
    const mounted: string[] = [];
    const changed: string[] = [];
    let storeDisposed = false;
    let panelDisposed = false;

    let onChangeTextDocument:
      | Listener<vscode.TextDocumentChangeEvent>
      | undefined;
    let onCloseTextDocument: Listener<vscode.TextDocument> | undefined;
    let onRenameFiles: Listener<vscode.FileRenameEvent> | undefined;
    let onChangeTheme: Listener<vscode.ColorTheme> | undefined;

    const context = {
      subscriptions: [],
    } as unknown as vscode.ExtensionContext;
    const document = {
      languageId: "jp1ajs",
      uri: { toString: () => "file:///sample.ajs" },
    } as unknown as vscode.TextDocument;
    const renamedUri = {
      toString: () => "file:///renamed.ajs",
    } as unknown as vscode.Uri;
    const panel = {
      title: "sample",
      dispose() {
        panelDisposed = true;
      },
    } as unknown as vscode.WebviewPanel;

    const mediator = new WebviewMediator(
      context,
      "ajsbutler.testViewer",
      {
        panelByUri(receivedUri) {
          return receivedUri.toString() === document.uri.toString()
            ? panel
            : undefined;
        },
        removeByUri(receivedUri) {
          removedByUri.push(receivedUri.toString());
        },
        allPanels: new Set([panel]),
        dispose() {
          storeDisposed = true;
        },
      },
      (receivedDocument) => {
        changed.push(receivedDocument.uri.toString());
      },
      {
        onDidChangeTextDocument(listener) {
          onChangeTextDocument = listener;
          return { dispose() {} };
        },
        onDidCloseTextDocument(listener) {
          onCloseTextDocument = listener;
          return { dispose() {} };
        },
        onDidRenameFiles(listener) {
          onRenameFiles = listener;
          return { dispose() {} };
        },
        onDidChangeActiveColorTheme(listener) {
          onChangeTheme = listener;
          return { dispose() {} };
        },
        mountPanel(_context, _panel, viewType) {
          mounted.push(viewType);
        },
      },
    );

    onChangeTextDocument?.({ document } as vscode.TextDocumentChangeEvent);
    onCloseTextDocument?.(document);
    onRenameFiles?.({
      files: [{ oldUri: document.uri, newUri: renamedUri }],
    } as vscode.FileRenameEvent);
    onChangeTheme?.({} as vscode.ColorTheme);
    mediator.dispose();

    assert.deepStrictEqual(changed, ["file:///sample.ajs"]);
    assert.deepStrictEqual(removedByUri, [
      "file:///sample.ajs",
      "file:///sample.ajs",
    ]);
    assert.deepStrictEqual(mounted, ["ajsbutler.testViewer"]);
    assert.strictEqual(panelDisposed, true);
    assert.strictEqual(storeDisposed, true);
  });
});
