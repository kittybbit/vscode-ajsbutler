import * as assert from "assert";
import * as vscode from "vscode";
import { WebviewStore } from "../../extension/webview/WebviewStore";

suite("WebviewStore", () => {
  test("keeps add, lookup, removal, and dispose behavior stable", () => {
    const store = new WebviewStore("ajsbutler.testViewer");
    const document1 = {
      uri: { toString: () => "file:///one.ajs" },
    } as unknown as vscode.TextDocument;
    const document2 = {
      uri: { toString: () => "file:///two.ajs" },
    } as unknown as vscode.TextDocument;

    let panel1Disposed = false;
    let panel2Disposed = false;
    const panel1 = {
      title: "one",
      dispose() {
        panel1Disposed = true;
      },
    } as unknown as vscode.WebviewPanel;
    const panel2 = {
      title: "two",
      dispose() {
        panel2Disposed = true;
      },
    } as unknown as vscode.WebviewPanel;

    store.add(document1, panel1);
    store.add(document2, panel2);

    assert.strictEqual(store.panelByDocument(document1), panel1);
    assert.strictEqual(store.panelByUri(document2.uri), panel2);
    assert.strictEqual(store.documentByUri(document1.uri), document1);

    store.removeByDocument(document1);
    assert.strictEqual(store.panelByDocument(document1), undefined);
    assert.strictEqual(store.documentByUri(document1.uri), undefined);

    store.removeByPanel(panel2);
    assert.strictEqual(store.panelByUri(document2.uri), undefined);
    assert.strictEqual(store.documentByUri(document2.uri), undefined);

    store.add(document1, panel1);
    store.add(document2, panel2);
    store.removeByUri(document1.uri);
    assert.strictEqual(store.panelByUri(document1.uri), undefined);

    store.dispose();

    assert.strictEqual(panel1Disposed, true);
    assert.strictEqual(panel2Disposed, true);
    assert.strictEqual(store.panelByUri(document1.uri), undefined);
    assert.strictEqual(store.panelByUri(document2.uri), undefined);
  });
});
