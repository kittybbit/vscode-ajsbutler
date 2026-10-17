import * as assert from "assert";
import {
  createCsvExportedEvent,
  createSearchExecutedEvent,
} from "../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createViewerDisplayAcknowledgementRequest,
  createViewerNavigationRequest,
  createViewerReadyRequest,
  createViewerResourceRequest,
  createViewerSaveRequest,
  createViewerSearchRequest,
  parseViewerRequest,
} from "../../presentation/webview/viewerRequestMessages";
import {
  createViewerMessageHandler,
  registerViewerPanel,
} from "../../presentation/vscode/webview/viewerMessageRouting";

const flushMicrotasks = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

suite("Viewer message routing", () => {
  test("routes functional requests and reports only search and copy success", async () => {
    const calls: string[] = [];
    const events: unknown[] = [];
    const telemetry: TelemetryPort = {
      report: (event) => events.push(event),
      dispose() {},
    };
    let displayed: string | undefined;
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry,
      isActivePanel: () => true,
      onReady: () => {
        calls.push("ready");
      },
      onResource: ({ data }) => calls.push(`resource:${data.scrollType}`),
      onNavigate: (_document, event) =>
        calls.push(
          `navigate:${event.data.targetView}:${event.data.absolutePath}`,
        ),
      onDisplay: (result) => {
        displayed = result;
      },
      onSave: async (content) => {
        calls.push(`save:${content}`);
        return true;
      },
      showErrorMessage: async () => undefined,
    });

    handler(createViewerResourceRequest("table"));
    handler(createViewerReadyRequest());
    handler(createViewerSaveRequest("body"));
    handler(createViewerNavigationRequest("flow", "/root/unit"));
    handler(createViewerSearchRequest("table"));
    handler({ type: "csv_export", data: { method: "copy" } });
    handler(createViewerDisplayAcknowledgementRequest("success"));
    await flushMicrotasks();

    assert.deepStrictEqual(calls, [
      "resource:table",
      "ready",
      "navigate:flow:/root/unit",
      "save:body",
    ]);
    assert.deepStrictEqual(events, [
      createSearchExecutedEvent("table"),
      createCsvExportedEvent("copy"),
    ]);
    assert.strictEqual(displayed, "success");
  });

  test("rejects retired, malformed, and over-specified analytics requests", () => {
    const calls: string[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: { report: () => calls.push("telemetry"), dispose() {} },
      isActivePanel: () => true,
      onReady: () => {
        calls.push("ready");
      },
      onResource: () => calls.push("resource"),
      onNavigate: () => calls.push("navigate"),
      onDisplay: () => calls.push("display"),
      showErrorMessage: async () => undefined,
    });

    const invalidRequests = [
      { type: "operation", data: { operation: "copy.csv" } },
      { type: "performance", data: { operation: "render" } },
      { type: "search", data: { feature: "table", query: "secret" } },
      { type: "csv_export", data: { method: "save" } },
      { type: "display", data: { result: "success" } },
      { type: "ready", data: {} },
      { type: "unknown", data: {} },
    ];

    for (const request of invalidRequests) {
      assert.strictEqual(parseViewerRequest(request), undefined);
      assert.doesNotThrow(() => handler(request));
    }
    assert.deepStrictEqual(calls, []);
  });

  test("keeps analytics silent for an inactive panel", () => {
    const events: unknown[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: { report: (event) => events.push(event), dispose() {} },
      isActivePanel: () => false,
      onReady: () => {},
      onResource: () => {},
      onNavigate: () => {},
      onDisplay: () => {},
      showErrorMessage: async () => undefined,
    });

    handler(createViewerSearchRequest("flow"));
    handler({ type: "csv_export", data: { method: "copy" } });
    handler(createViewerDisplayAcknowledgementRequest("failed"));
    assert.deepStrictEqual(events, []);
  });

  test("keeps viewer requests functional when telemetry reporting throws", () => {
    const calls: string[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: {
        report: () => {
          throw new Error("telemetry transport failed");
        },
        dispose() {},
      },
      isActivePanel: () => true,
      onReady: () => {
        calls.push("ready");
      },
      onResource: () => calls.push("resource"),
      onNavigate: () => calls.push("navigate"),
      onDisplay: () => calls.push("display"),
      showErrorMessage: async () => undefined,
    });

    assert.doesNotThrow(() => handler(createViewerSearchRequest("table")));
    assert.doesNotThrow(() =>
      handler({ type: "csv_export", data: { method: "copy" } }),
    );
    handler(createViewerReadyRequest());
    assert.deepStrictEqual(calls, ["ready"]);
  });

  test("preserves safe errors for invalid save data and host failures", async () => {
    const errors: string[] = [];
    const handler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: { report() {}, dispose() {} },
      isActivePanel: () => true,
      onReady: () => {
        throw new Error("secret refresh failure");
      },
      onResource: () => {
        throw new Error("secret resource failure");
      },
      onNavigate: () => {
        throw new Error("secret navigation failure");
      },
      onDisplay: () => {},
      onSave: async () => {
        throw new Error("secret save failure");
      },
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });

    handler({ type: "save", data: 1 });
    handler(createViewerResourceRequest("window"));
    handler(createViewerReadyRequest());
    handler(createViewerSaveRequest("body"));
    handler(createViewerNavigationRequest("table", "/root/unit"));
    await flushMicrotasks();

    assert.deepStrictEqual(errors, [
      "Data is not a string and cannot be saved.",
      "Viewer resources could not be loaded.",
      "The viewer document could not be refreshed.",
      "Viewer navigation could not be completed.",
      "The file could not be saved.",
    ]);
    assert.ok(errors.every((message) => !message.includes("secret")));
  });

  test("registers active-panel guards and cleans up on disposal", () => {
    const calls: string[] = [];
    const events: unknown[] = [];
    let active = true;
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    let onDidDispose: (() => void) | undefined;
    const panel = {
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose: () => calls.push("receiver-disposed") };
        },
      },
      onDidDispose(callback: () => void) {
        onDidDispose = callback;
        return { dispose() {} };
      },
    };

    registerViewerPanel({
      document: { uri: { toString: () => "file:///sample.ajs" } } as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      handlers: {
        onReady: () => {
          calls.push("ready");
        },
        onNavigate: () => {},
        onDisposed: () => calls.push("disposed"),
      },
      isActivePanel: () => active,
      telemetry: {
        report: (event) => events.push(event),
        dispose() {},
      },
      store: { removeByUri: () => calls.push("removed") },
      showErrorMessage: async () => undefined,
    });

    receiveMessageHandler?.(createViewerReadyRequest());
    receiveMessageHandler?.(createViewerSearchRequest("flow"));
    active = false;
    receiveMessageHandler?.(createViewerReadyRequest());
    receiveMessageHandler?.(createViewerSearchRequest("flow"));
    onDidDispose?.();

    assert.deepStrictEqual(calls, [
      "ready",
      "disposed",
      "removed",
      "receiver-disposed",
    ]);
    assert.deepStrictEqual(events, [createSearchExecutedEvent("flow")]);
  });
});
