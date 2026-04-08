import * as assert from "assert";
import { OPERATION, READY, RESOURCE, SAVE } from "../../shared/webviewEvents";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "../../extension/webview/viewerMessageRouting";

suite("Viewer message routing", () => {
  test("routes shared webview events through injected handlers", async () => {
    const calls: string[] = [];
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };
    const panel = {
      viewType: "ajsbutler.tableViewer",
    };

    const handler = createViewerMessageHandler({
      document: document as never,
      panel: panel as never,
      telemetry: {} as never,
      onReady: () => {
        calls.push("ready");
      },
      onResource: () => {
        calls.push("resource");
      },
      onOperation: (_document, _panel, _telemetry, operation) => {
        calls.push(`operation:${operation}`);
      },
      onSave: async (content) => {
        calls.push(`save:${content}`);
      },
      showErrorMessage: async () => undefined,
    });

    handler({ type: RESOURCE, data: {} as never });
    handler({ type: READY });
    handler({ type: SAVE, data: "body" });
    handler({ type: OPERATION, data: "copy.csv" });

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.deepStrictEqual(calls, [
      "resource",
      "ready",
      "save:body",
      "operation:copy.csv",
    ]);
  });

  test("shows an error when save data is invalid", async () => {
    const errors: string[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: {} as never,
      onReady: () => {},
      onResource: () => {},
      onOperation: () => {},
      onSave: async () => undefined,
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });

    handler({ type: SAVE, data: 1 as never });

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.deepStrictEqual(errors, [
      "Data is not a string and cannot be saved.",
    ]);
  });

  test("cleans up store and message subscription when the panel is disposed", () => {
    const removed: string[] = [];
    let receiverDisposed = false;
    let onDidDispose: (() => void) | undefined;
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };
    const panel = {
      onDidDispose: (callback: () => void) => {
        onDidDispose = callback;
      },
    };

    registerViewerPanelDispose({
      document: document as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      store: {
        removeByDocument: (receivedDocument) => {
          removed.push(receivedDocument.uri.toString());
        },
      },
      receiveMessageDispose: {
        dispose: () => {
          receiverDisposed = true;
        },
      },
    });

    onDidDispose?.();

    assert.deepStrictEqual(removed, ["file:///sample.ajs"]);
    assert.strictEqual(receiverDisposed, true);
  });
});
