import * as assert from "assert";
import * as vscode from "vscode";
import { WebviewStore } from "../../presentation/vscode/webview/WebviewStore";

suite("WebviewStore", () => {
  test("keeps add, lookup, removal, and dispose behavior stable", () => {
    const store = new WebviewStore("ajsbutler.testViewer");
    const document1 = {
      uri: { toString: () => "file:///one.ajs" },
    } as vscode.TextDocument;
    const document2 = {
      uri: { toString: () => "file:///two.ajs" },
    } as vscode.TextDocument;

    let panel1Disposed = false;
    let panel2Disposed = false;
    const panel1 = {
      title: "one",
      dispose() {
        panel1Disposed = true;
      },
    } as vscode.WebviewPanel;
    const panel2 = {
      title: "two",
      dispose() {
        panel2Disposed = true;
      },
    } as vscode.WebviewPanel;

    store.add(document1.uri, panel1);
    store.add(document2.uri, panel2);

    assert.strictEqual(store.panelByUri(document1.uri), panel1);
    assert.strictEqual(store.panelByUri(document2.uri), panel2);

    store.removeByUri(document1.uri);
    assert.strictEqual(store.panelByUri(document1.uri), undefined);

    store.removeByUri(document2.uri);
    assert.strictEqual(store.panelByUri(document2.uri), undefined);

    store.add(document1.uri, panel1);
    store.add(document2.uri, panel2);
    store.removeByUri(document1.uri);
    assert.strictEqual(store.panelByUri(document1.uri), undefined);

    store.dispose();

    assert.strictEqual(panel1Disposed, true);
    assert.strictEqual(panel2Disposed, true);
    assert.strictEqual(store.panelByUri(document1.uri), undefined);
    assert.strictEqual(store.panelByUri(document2.uri), undefined);
  });

  test("removes by uri identity rather than document object identity", () => {
    const store = new WebviewStore("ajsbutler.testViewer");
    const uri = { toString: () => "file:///same.ajs" } as vscode.Uri;
    const storedDocument = { uri } as vscode.TextDocument;
    const panel = {
      title: "same",
      dispose() {},
    } as vscode.WebviewPanel;

    store.add(storedDocument.uri, panel);
    store.removeByUri(uri);

    assert.strictEqual(store.panelByUri(uri), undefined);
  });

  test("clears before disposal and rejects panels added after disposal", () => {
    const store = new WebviewStore("ajsbutler.testViewer");
    const firstUri = { toString: () => "file:///first.ajs" } as vscode.Uri;
    const lateUri = { toString: () => "file:///late.ajs" } as vscode.Uri;
    let firstDisposed = false;
    let lateDisposed = false;
    const latePanel = {
      dispose() {
        lateDisposed = true;
      },
    } as vscode.WebviewPanel;
    const firstPanel = {
      dispose() {
        firstDisposed = true;
        assert.strictEqual(store.panelByUri(firstUri), undefined);
        store.add(lateUri, latePanel);
      },
    } as vscode.WebviewPanel;

    store.add(firstUri, firstPanel);
    store.dispose();
    store.dispose();

    assert.strictEqual(firstDisposed, true);
    assert.strictEqual(lateDisposed, true);
    assert.strictEqual(store.panelByUri(firstUri), undefined);
    assert.strictEqual(store.panelByUri(lateUri), undefined);
  });

  test("continues disposing panels when one host disposal fails", () => {
    const store = new WebviewStore("ajsbutler.testViewer");
    const firstUri = { toString: () => "file:///first.ajs" } as vscode.Uri;
    const secondUri = { toString: () => "file:///second.ajs" } as vscode.Uri;
    let secondDisposed = false;

    store.add(firstUri, {
      dispose() {
        throw new Error("dispose failed");
      },
    } as unknown as vscode.WebviewPanel);
    store.add(secondUri, {
      dispose() {
        secondDisposed = true;
      },
    } as vscode.WebviewPanel);

    assert.doesNotThrow(() => store.dispose());
    assert.strictEqual(secondDisposed, true);
  });
});
