import * as assert from "assert";
import * as vscode from "vscode";
import { WebviewMediator } from "../../presentation/vscode/webview/WebviewMediator";

type Listener<T> = (event: T) => void;

suite("WebviewMediator", () => {
  test("routes close, rename, and theme events through focused handlers", () => {
    const removedByUri: string[] = [];
    const mounted: string[] = [];
    const changed: string[] = [];
    let storeDisposed = false;
    let panelDisposed = false;
    let subscriptionDisposed = 0;

    let onChangeTextDocument:
      | Listener<vscode.TextDocumentChangeEvent>
      | undefined;
    let onCloseTextDocument: Listener<vscode.TextDocument> | undefined;
    let onRenameFiles: Listener<vscode.FileRenameEvent> | undefined;
    let onChangeTheme: Listener<vscode.ColorTheme> | undefined;

    const context = {
      subscriptions: [],
    } as vscode.ExtensionContext;
    const document = {
      languageId: "jp1ajs",
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const renamedUri = {
      toString: () => "file:///renamed.ajs",
    } as vscode.Uri;
    const panel = {
      title: "sample",
      dispose() {
        panelDisposed = true;
      },
    } as vscode.WebviewPanel;

    const mediator = new WebviewMediator({
      context,
      viewType: "ajsbutler.testViewer",
      store: {
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
      change: (receivedDocument) => {
        changed.push(receivedDocument.uri.toString());
      },
      deps: {
        onDidChangeTextDocument(listener) {
          onChangeTextDocument = listener;
          return {
            dispose() {
              subscriptionDisposed += 1;
            },
          };
        },
        onDidCloseTextDocument(listener) {
          onCloseTextDocument = listener;
          return {
            dispose() {
              subscriptionDisposed += 1;
            },
          };
        },
        onDidRenameFiles(listener) {
          onRenameFiles = listener;
          return {
            dispose() {
              subscriptionDisposed += 1;
            },
          };
        },
        onDidChangeActiveColorTheme(listener) {
          onChangeTheme = listener;
          return {
            dispose() {
              subscriptionDisposed += 1;
            },
          };
        },
        mountPanel(_context, _panel, viewType) {
          mounted.push(viewType);
        },
      },
    });

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
    assert.strictEqual(subscriptionDisposed, 4);

    onChangeTextDocument?.({ document } as vscode.TextDocumentChangeEvent);
    onCloseTextDocument?.(document);
    onRenameFiles?.({
      files: [{ oldUri: document.uri, newUri: renamedUri }],
    } as vscode.FileRenameEvent);
    onChangeTheme?.({} as vscode.ColorTheme);
    mediator.dispose();

    assert.deepStrictEqual(changed, ["file:///sample.ajs"]);
    assert.deepStrictEqual(mounted, ["ajsbutler.testViewer"]);
    assert.strictEqual(panelDisposed, true);
    assert.strictEqual(storeDisposed, true);
  });

  test("continues theme remounts after one panel throws", () => {
    const firstPanel = {} as vscode.WebviewPanel;
    const secondPanel = {} as vscode.WebviewPanel;
    let onChangeTheme: Listener<vscode.ColorTheme> | undefined;
    const mounted: vscode.WebviewPanel[] = [];

    const mediator = new WebviewMediator({
      context: {} as vscode.ExtensionContext,
      viewType: "ajsbutler.testViewer",
      store: {
        allPanels: new Set([firstPanel, secondPanel]),
        panelByUri() {
          return undefined;
        },
        removeByUri() {},
        dispose() {},
      },
      change() {},
      deps: {
        onDidChangeTextDocument() {
          return { dispose() {} };
        },
        onDidCloseTextDocument() {
          return { dispose() {} };
        },
        onDidRenameFiles() {
          return { dispose() {} };
        },
        onDidChangeActiveColorTheme(listener) {
          onChangeTheme = listener;
          return { dispose() {} };
        },
        mountPanel(_context, panel) {
          if (panel === firstPanel) {
            throw new Error("stale panel");
          }
          mounted.push(panel);
        },
      },
    });

    assert.doesNotThrow(() => onChangeTheme?.({} as vscode.ColorTheme));
    assert.deepStrictEqual(mounted, [secondPanel]);
    mediator.dispose();
  });
});
