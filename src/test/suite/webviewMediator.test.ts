import * as assert from "assert";
import * as vscode from "vscode";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { MyExtension } from "../../extension/MyExtension";
import { WebviewMediator } from "../../extension/webview/WebviewMediator";

type Listener<T> = (event: T) => void;

class TestWebviewMediator extends WebviewMediator {
  public constructor(args: {
    extension: MyExtension;
    store: {
      panelByDocument(
        document: vscode.TextDocument,
      ): vscode.WebviewPanel | undefined;
      panelByUri(uri: vscode.Uri): vscode.WebviewPanel | undefined;
      removeByPanel(panel: vscode.WebviewPanel): void;
      allPanels: Set<vscode.WebviewPanel>;
      dispose(): void;
    };
    change: (document: vscode.TextDocument, panel: vscode.WebviewPanel) => void;
    deps: ConstructorParameters<typeof WebviewMediator>[4];
  }) {
    super(
      args.extension,
      "ajsbutler.testViewer",
      args.store as never,
      args.change,
      args.deps,
    );
  }
}

suite("WebviewMediator", () => {
  test("routes close, rename, and theme events through focused handlers", () => {
    const removedByPanel: string[] = [];
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

    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };
    const extension = MyExtension.init(
      { subscriptions: [] } as unknown as vscode.ExtensionContext,
      telemetry,
    );
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

    const mediator = new TestWebviewMediator({
      extension,
      store: {
        panelByDocument(receivedDocument) {
          return receivedDocument === document ? panel : undefined;
        },
        panelByUri(receivedUri) {
          return receivedUri.toString() === document.uri.toString()
            ? panel
            : undefined;
        },
        removeByPanel(receivedPanel) {
          removedByPanel.push(receivedPanel.title);
        },
        allPanels: new Set([panel]),
        dispose() {
          storeDisposed = true;
        },
      },
      change(receivedDocument) {
        changed.push(receivedDocument.uri.toString());
      },
      deps: {
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
    });

    onChangeTextDocument?.({ document } as vscode.TextDocumentChangeEvent);
    onCloseTextDocument?.(document);
    onRenameFiles?.({
      files: [{ oldUri: document.uri, newUri: renamedUri }],
    } as vscode.FileRenameEvent);
    onChangeTheme?.({} as vscode.ColorTheme);
    mediator.dispose();

    assert.deepStrictEqual(changed, ["file:///sample.ajs"]);
    assert.deepStrictEqual(removedByPanel, ["sample", "sample"]);
    assert.deepStrictEqual(mounted, ["ajsbutler.testViewer"]);
    assert.strictEqual(panelDisposed, true);
    assert.strictEqual(storeDisposed, true);
  });
});
