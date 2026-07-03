import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { ViewerFactory } from "../../presentation/vscode/webview/ViewerFactory";
import {
  NAVIGATE,
  OPERATION,
  READY,
  RESOURCE,
  SAVE,
} from "../../shared/webviewEvents";

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
    } as vscode.TextDocument;
    let addCalled = false;
    let readyCalled = false;
    let createCalled = false;

    const factory = new ViewerFactory({
      viewType: "ajsbutler.testViewer",
      telemetry,
      store: {
        panelByUri() {
          return existingPanel;
        },
        add() {
          addCalled = true;
        },
        removeByUri() {},
      },
      handlers: {
        onReady: () => {
          readyCalled = true;
        },
        onNavigate: () => {},
      },
      deps: {
        createWebviewPanel() {
          createCalled = true;
          throw new Error("panel should not be created");
        },
      },
    });

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
    } as vscode.TextDocument;
    const added: Array<{
      uri: vscode.Uri;
      panel: vscode.WebviewPanel;
    }> = [];
    let readyArgs:
      | { document: vscode.TextDocument; panel: vscode.WebviewPanel }
      | undefined;
    let createdShowOptions:
      | Parameters<typeof vscode.window.createWebviewPanel>[2]
      | undefined;

    const factory = new ViewerFactory({
      viewType: "ajsbutler.testViewer",
      telemetry,
      store: {
        panelByUri() {
          return undefined;
        },
        add(receivedUri, receivedPanel) {
          added.push({ uri: receivedUri, panel: receivedPanel });
        },
        removeByUri() {},
      },
      handlers: {
        onReady: (receivedDocument, receivedPanel) => {
          readyArgs = { document: receivedDocument, panel: receivedPanel };
        },
        onNavigate: () => {},
      },
      deps: {
        createWebviewPanel(_viewType, _title, viewColumn) {
          createdShowOptions = viewColumn;
          return createdPanel;
        },
      },
    });

    const panel = factory.getPanel(document);

    assert.strictEqual(panel, createdPanel);
    assert.deepStrictEqual(readyArgs, {
      document,
      panel: createdPanel,
    });
    assert.strictEqual(createdShowOptions, vscode.ViewColumn.Active);
    assert.deepStrictEqual(added, [{ uri: document.uri, panel: createdPanel }]);
  });

  test("returns an existing panel without creating a new one", () => {
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };
    const existingPanel = { id: "existing" } as unknown as vscode.WebviewPanel;
    const document = {
      fileName: "/tmp/sample.ajs",
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;

    const factory = new ViewerFactory({
      viewType: "ajsbutler.testViewer",
      telemetry,
      store: {
        panelByUri() {
          return existingPanel;
        },
        add() {},
        removeByUri() {},
      },
      handlers: {
        onReady: () => {},
        onNavigate: () => {},
      },
    });

    assert.strictEqual(factory.getExistingPanel(document), existingPanel);
  });

  test("registers the shared viewer customize flow", async () => {
    const calls: string[] = [];
    const telemetryEvents: string[] = [];
    const removed: string[] = [];
    const navigated: string[] = [];
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
    } as vscode.TextDocument;
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
    } as vscode.WebviewPanel;
    const added: Array<{
      uri: vscode.Uri;
      panel: vscode.WebviewPanel;
    }> = [];

    const factory = new ViewerFactory({
      viewType: "ajsbutler.testViewer",
      telemetry,
      store: {
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
      handlers: {
        onReady: (receivedDocument, receivedPanel) => {
          calls.push(
            `ready:${receivedDocument.uri.toString()}:${receivedPanel.viewType}`,
          );
        },
        onNavigate: (_receivedDocument, event) => {
          navigated.push(`${event.data.targetView}:${event.data.absolutePath}`);
        },
        onSave: async (content) => {
          calls.push(`save:${content}`);
        },
      },
      deps: {
        createWebviewPanel() {
          return panel;
        },
      },
    });

    const createdPanel = factory.getPanel(document);

    receiveMessageHandler?.({ type: READY });
    receiveMessageHandler?.({
      type: RESOURCE,
      data: { scrollType: "table" },
    });
    receiveMessageHandler?.({ type: SAVE, data: "body" });
    receiveMessageHandler?.({ type: OPERATION, data: "copy.csv" });
    receiveMessageHandler?.({
      type: NAVIGATE,
      data: { targetView: "table", absolutePath: "/root/unit" },
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    onDidDispose?.();

    assert.deepStrictEqual(calls, [
      "ready:file:///sample.ajs:ajsbutler.testViewer",
      "post:resource:table",
      "save:body",
    ]);
    assert.strictEqual(createdPanel, panel);
    assert.deepStrictEqual(added, [{ uri: document.uri, panel }]);
    assert.deepStrictEqual(navigated, ["table:/root/unit"]);
    assert.deepStrictEqual(telemetryEvents, [
      "viewer.table.ready",
      OPERATION,
      "viewer.table.csv_copied",
      "viewer.table.closed",
    ]);
    assert.deepStrictEqual(removed, ["file:///sample.ajs"]);
    assert.strictEqual(receiverDisposed, true);
  });
});
