import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { ViewerFactory } from "../../extension/webview/ViewerFactory";
import { OPERATION, READY, RESOURCE, SAVE } from "../../shared/webviewEvents";

type ViewerFactoryDeps = {
  createWebviewPanel: typeof vscode.window.createWebviewPanel;
};

suite("ViewerFactory", () => {
  test("reuses an existing panel before creating a new one", () => {
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };
    const existingPanel = { id: "existing" } as unknown as vscode.WebviewPanel;
    const document = {
      fileName: "/tmp/sample.ajs",
      uri: { toString: () => "file:///sample.ajs" },
    } as unknown as vscode.TextDocument;
    let addCalled = false;
    let readyCalled = false;
    let createCalled = false;

    const factory = new ViewerFactory(
      "ajsbutler.testViewer",
      telemetry,
      {
        panelByUri() {
          return existingPanel;
        },
        add() {
          addCalled = true;
        },
        removeByUri() {},
      },
      () => {
        readyCalled = true;
      },
      undefined,
      {
        createWebviewPanel() {
          createCalled = true;
          throw new Error("panel should not be created");
        },
      },
    );

    const panel = factory.getPanel(document);

    assert.strictEqual(panel, existingPanel);
    assert.strictEqual(createCalled, false);
    assert.strictEqual(addCalled, false);
    assert.strictEqual(readyCalled, false);
  });

  test("creates, customizes, and stores a new panel when missing", () => {
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };
    const createdPanel = { id: "new" } as unknown as vscode.WebviewPanel;
    const document = {
      fileName: "/tmp/sample.ajs",
      uri: { toString: () => "file:///sample.ajs" },
    } as unknown as vscode.TextDocument;
    const added: Array<{
      uri: vscode.Uri;
      panel: vscode.WebviewPanel;
    }> = [];
    let readyArgs:
      | { document: vscode.TextDocument; panel: vscode.WebviewPanel }
      | undefined;

    const factory = new ViewerFactory(
      "ajsbutler.testViewer",
      telemetry,
      {
        panelByUri() {
          return undefined;
        },
        add(receivedUri, receivedPanel) {
          added.push({ uri: receivedUri, panel: receivedPanel });
        },
        removeByUri() {},
      },
      (receivedDocument, receivedPanel) => {
        readyArgs = { document: receivedDocument, panel: receivedPanel };
      },
      undefined,
      {
        createWebviewPanel() {
          return createdPanel;
        },
      },
    );

    const panel = factory.getPanel(document);

    assert.strictEqual(panel, createdPanel);
    assert.deepStrictEqual(readyArgs, {
      document,
      panel: createdPanel,
    });
    assert.deepStrictEqual(added, [{ uri: document.uri, panel: createdPanel }]);
  });

  test("registers the shared viewer customize flow", async () => {
    const calls: string[] = [];
    const telemetryEvents: string[] = [];
    const removed: string[] = [];
    let receiverDisposed = false;
    let receiveMessageHandler:
      | ((event: { type: string; data?: unknown }) => void)
      | undefined;
    let onDidDispose: (() => void) | undefined;

    const telemetry: TelemetryPort = {
      trackEvent(eventName) {
        telemetryEvents.push(eventName);
      },
      dispose() {},
    };
    const document = {
      fileName: "/tmp/sample.ajs",
      uri: { toString: () => "file:///sample.ajs" },
    } as unknown as vscode.TextDocument;
    const panel = {
      title: "sample.ajs",
      viewType: "ajsbutler.testViewer",
      webview: {
        onDidReceiveMessage(handler: (event: { type: string }) => void) {
          receiveMessageHandler = handler;
          return {
            dispose() {
              receiverDisposed = true;
            },
          };
        },
        postMessage(message: { type: string; data: { scrollType: string } }) {
          calls.push(`post:${message.type}:${message.data.scrollType}`);
        },
      },
      onDidDispose(callback: () => void) {
        onDidDispose = callback;
        return { dispose() {} };
      },
    } as unknown as vscode.WebviewPanel;
    const added: Array<{
      uri: vscode.Uri;
      panel: vscode.WebviewPanel;
    }> = [];

    const factory = new ViewerFactory(
      "ajsbutler.testViewer",
      telemetry,
      {
        removeByUri(uri) {
          removed.push(uri.toString());
        },
        add(receivedUri, receivedPanel) {
          added.push({ uri: receivedUri, panel: receivedPanel });
        },
        panelByUri() {
          return undefined;
        },
      },
      (receivedDocument, receivedPanel) => {
        calls.push(
          `ready:${receivedDocument.uri.toString()}:${receivedPanel.viewType}`,
        );
      },
      async (content) => {
        calls.push(`save:${content}`);
      },
      {
        createWebviewPanel() {
          return panel;
        },
      },
    );

    const createdPanel = factory.getPanel(document);

    receiveMessageHandler?.({ type: READY });
    receiveMessageHandler?.({
      type: RESOURCE,
      data: { scrollType: "table" },
    });
    receiveMessageHandler?.({ type: SAVE, data: "body" });
    receiveMessageHandler?.({ type: OPERATION, data: "copy.csv" });

    await new Promise((resolve) => setTimeout(resolve, 0));
    onDidDispose?.();

    assert.deepStrictEqual(calls, [
      "ready:file:///sample.ajs:ajsbutler.testViewer",
      "post:resource:table",
      "save:body",
    ]);
    assert.strictEqual(createdPanel, panel);
    assert.deepStrictEqual(added, [{ uri: document.uri, panel }]);
    assert.deepStrictEqual(telemetryEvents, [OPERATION]);
    assert.deepStrictEqual(removed, ["file:///sample.ajs"]);
    assert.strictEqual(receiverDisposed, true);
  });
});
