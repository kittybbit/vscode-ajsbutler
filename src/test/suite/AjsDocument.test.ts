import * as assert from "assert";
import * as vscode from "vscode";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  createDebouncedAjsDocumentChange,
  createReadyAjsDocument,
} from "../../presentation/vscode/webview/ajsDocument";
import { CHANGE_DOCUMENT } from "../../presentation/webview/viewerHostMessages";

suite("ajsDocument", () => {
  const buildUnitList = () => ({ errors: [], document: undefined });
  const normalizedDocument: AjsDocument = {
    rootUnits: [
      {
        id: "root-id",
        name: "root",
        unitAttribute: "root,,jp1admin,",
        unitType: "n",
        absolutePath: "/root",
        depth: 0,
        isRoot: true,
        isRootJobnet: true,
        hasSchedule: false,
        hasWaitedFor: false,
        layout: { h: 0, v: 0 },
        parameters: [{ key: "ty", value: "n" }],
        relations: [],
        children: [],
      },
    ],
    warnings: [
      {
        code: "missing_relation_target",
        message: "relation target was not found",
        unitPath: "/root",
      },
    ],
  };
  const documentDto = toUnitListDocumentDto(normalizedDocument);

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
          return Promise.resolve(true);
        },
      },
    } as unknown as vscode.WebviewPanel;
    const buildDocument = () => ({ errors: [], document: documentDto });

    const completion = createReadyAjsDocument(buildDocument)(document, panel);

    assert.strictEqual(posted.length, 1);
    assert.strictEqual(posted[0]?.type, CHANGE_DOCUMENT);
    assert.strictEqual(completion instanceof Promise, true);
    assert.deepStrictEqual(posted[0]?.data, documentDto);
    assert.deepStrictEqual(
      documentDto.unitList.rows.map((row) => row.id),
      ["root-id"],
    );
    assert.deepStrictEqual(
      documentDto.unitList.units[0]?.parameterSearchValues,
      ["n"],
    );
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(posted[0]?.data)),
      documentDto,
    );
    return completion.then((result) => assert.strictEqual(result, "success"));
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
    assert.strictEqual(posted[0]?.data, null);
  });

  test("cancels a pending update when the panel is disposed", async () => {
    const posted: Array<{ type: string; data: unknown }> = [];
    let disposePanel: (() => void) | undefined;
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
      onDidDispose(callback: () => void) {
        disposePanel = callback;
        return { dispose() {} };
      },
    } as unknown as vscode.WebviewPanel;

    createDebouncedAjsDocumentChange(buildUnitList, 20)(document, panel);
    disposePanel?.();

    await new Promise((resolve) => setTimeout(resolve, 35));

    assert.deepStrictEqual(posted, []);
  });

  test("dispose cancels pending updates and prevents later scheduling", async () => {
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
      onDidDispose() {
        return { dispose() {} };
      },
    } as unknown as vscode.WebviewPanel;
    const onChange = createDebouncedAjsDocumentChange(buildUnitList, 20);

    onChange(document, panel);
    onChange.dispose();
    onChange(document, panel);

    await new Promise((resolve) => setTimeout(resolve, 35));

    assert.deepStrictEqual(posted, []);
  });
});
