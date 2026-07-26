import * as assert from "assert";
import {
  createViewerNavigationRequest,
  createViewerOperationRequest,
  createViewerPerformanceRequest,
  createViewerReadyRequest,
  createViewerResourceRequest,
  createViewerSaveRequest,
  createViewerSearchRequest,
  NAVIGATE,
  OPERATION,
  PERFORMANCE,
  READY,
  RESOURCE,
  SAVE,
  SEARCH,
} from "../../presentation/webview/viewerRequestMessages";
import {
  createViewerMessageHandler,
  registerViewerPanelDispose,
} from "../../presentation/vscode/webview/viewerMessageRouting";

suite("Viewer message routing", () => {
  test("routes shared webview events through injected handlers", async () => {
    const calls: string[] = [];
    const telemetryEvents: Array<{
      eventName: string;
      properties?: Record<string, string>;
    }> = [];
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    };
    const panel = {
      viewType: "ajsbutler.tableViewer",
    };

    const handler = createViewerMessageHandler({
      document: document as never,
      panel: panel as never,
      telemetry: {
        report: (event) => {
          telemetryEvents.push({
            eventName: event.name,
            properties: event.properties,
          });
        },
        dispose() {},
      },
      onReady: () => {
        calls.push("ready");
      },
      onResource: () => {
        calls.push("resource");
      },
      onOperation: ({ operation }) => {
        calls.push(`operation:${operation}`);
      },
      onNavigate: (_document, event) => {
        calls.push(
          `navigate:${event.data.targetView}:${event.data.absolutePath}`,
        );
      },
      onSave: async (content) => {
        calls.push(`save:${content}`);
      },
      showErrorMessage: async () => undefined,
    });

    handler(createViewerResourceRequest("table"));
    handler(createViewerReadyRequest());
    handler(createViewerSaveRequest("body"));
    handler(createViewerOperationRequest("copy.csv"));
    handler(createViewerNavigationRequest("flow", "/root/unit"));
    handler(
      createViewerSearchRequest({
        surface: "table",
        action: "submitted",
        result: "no_match",
        mode: "partial",
        queryLengthBucket: "2_9",
        resultCountBucket: "0",
        durationBucket: "lt100ms",
        scope: "visible_rows",
      }),
    );
    handler(
      createViewerPerformanceRequest({
        operation: "csv_export",
        result: "success",
        durationBucket: "lt100ms",
        rowCountBucket: "2_9",
      }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.deepStrictEqual(calls, [
      "resource",
      "ready",
      "save:body",
      "operation:copy.csv",
      "navigate:flow:/root/unit",
    ]);
    assert.deepStrictEqual(telemetryEvents, [
      {
        eventName: "search.table.submitted",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          surface: "table",
          mode: "partial",
          result: "no_match",
          queryLengthBucket: "2_9",
          resultCountBucket: "0",
          durationBucket: "lt100ms",
          scope: "visible_rows",
        },
      },
      {
        eventName: "performance.csv_export.completed",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          operation: "csv_export",
          result: "success",
          durationBucket: "lt100ms",
          rowCountBucket: "2_9",
        },
      },
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
      onNavigate: () => {},
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

  test("ignores invalid navigation payloads without invoking the host adapter", () => {
    const calls: string[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: {} as never,
      onReady: () => {},
      onResource: () => {},
      onOperation: () => {},
      onNavigate: () => calls.push("navigate"),
      showErrorMessage: async () => undefined,
    });

    handler({ type: NAVIGATE, data: undefined } as never);
    handler({
      type: NAVIGATE,
      data: { targetView: "unknown", absolutePath: "/root/job" },
    } as never);
    handler({
      type: NAVIGATE,
      data: { targetView: "flow", absolutePath: "" },
    } as never);

    assert.deepStrictEqual(calls, []);
  });

  test("ignores unknown and malformed requests without invoking handlers", () => {
    const calls: string[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: { report: () => calls.push("telemetry") } as never,
      onReady: () => calls.push("ready"),
      onResource: () => calls.push("resource"),
      onOperation: () => calls.push("operation"),
      onNavigate: () => calls.push("navigate"),
      onSave: async () => {
        calls.push("save");
      },
      showErrorMessage: async () => {
        calls.push("error");
        return undefined;
      },
    });

    for (const value of [
      undefined,
      { type: "unknown", data: {} },
      { type: READY, data: {} },
      { type: RESOURCE, data: {} },
      { type: OPERATION, data: "unknown.operation" },
      { type: SEARCH, data: {} },
      { type: PERFORMANCE, data: {} },
      { type: NAVIGATE, data: { targetView: "flow", absolutePath: "" } },
    ]) {
      assert.doesNotThrow(() => handler(value));
    }

    assert.deepStrictEqual(calls, []);
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
      uri: document.uri as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      telemetry: {
        report: (event) => {
          removed.push(`event:${event.name}`);
        },
        dispose() {},
      },
      store: {
        removeByUri: (receivedUri) => {
          removed.push(receivedUri.toString());
        },
      },
      receiveMessageDispose: {
        dispose: () => {
          receiverDisposed = true;
        },
      },
    });

    onDidDispose?.();

    assert.deepStrictEqual(removed, [
      "event:viewer.flow.closed",
      "file:///sample.ajs",
    ]);
    assert.strictEqual(receiverDisposed, true);
  });
});
