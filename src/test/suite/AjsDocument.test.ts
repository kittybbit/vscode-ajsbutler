import * as assert from "assert";
import * as vscode from "vscode";
import {
  createDebouncedAjsDocumentChange,
  createReadyAjsDocument,
} from "../../extension/webview/ajsDocument";
import { CHANGE_DOCUMENT } from "../../shared/webviewEvents";

suite("ajsDocument", () => {
  const buildUnitList = () => ({ errors: [], document: undefined });

  test("posts the normalized document on ready", () => {
    const posted: Array<{ type: string; data: unknown }> = [];
    const document = {
      getText() {
        return "";
      },
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const panel = {
      webview: {
        postMessage(message: { type: string; data: unknown }) {
          posted.push(message);
        },
      },
    } as vscode.WebviewPanel;

    createReadyAjsDocument(buildUnitList)(document, panel);

    assert.strictEqual(posted.length, 1);
    assert.strictEqual(posted[0]?.type, CHANGE_DOCUMENT);
  });

  test("debounces repeated change events for the same document", async () => {
    const posted: Array<{ type: string; data: unknown }> = [];
    const document = {
      getText() {
        return "";
      },
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const panel = {
      webview: {
        postMessage(message: { type: string; data: unknown }) {
          posted.push(message);
        },
      },
    } as vscode.WebviewPanel;

    const onChange = createDebouncedAjsDocumentChange(buildUnitList, 5);
    onChange(document, panel);
    onChange(document, panel);

    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(posted.length, 1);
    assert.strictEqual(posted[0]?.type, CHANGE_DOCUMENT);
  });
});
