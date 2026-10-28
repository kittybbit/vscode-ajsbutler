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
  type ViewerPanelHandlers,
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

  test("guards registered resource, ready, navigation, and display callbacks", async () => {
    const calls: string[] = [];
    const resourceMessages: unknown[] = [];
    let active = true;
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    const panel = {
      title: "routing test",
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose() {} };
        },
        async postMessage(message: unknown) {
          resourceMessages.push(message);
          return true;
        },
      },
      onDidDispose() {
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
        onNavigate: () => calls.push("navigate"),
        onDisplay: (result) => calls.push(`display:${result}`),
      },
      isActivePanel: () => active,
      telemetry: { report() {}, dispose() {} },
      store: { removeByUri() {} },
      showErrorMessage: async () => undefined,
    });

    receiveMessageHandler?.(createViewerResourceRequest("table"));
    receiveMessageHandler?.(createViewerReadyRequest());
    receiveMessageHandler?.(
      createViewerNavigationRequest("flow", "/root/unit"),
    );
    receiveMessageHandler?.(
      createViewerDisplayAcknowledgementRequest("success"),
    );
    active = false;
    receiveMessageHandler?.(createViewerResourceRequest("window"));
    receiveMessageHandler?.(createViewerReadyRequest());
    receiveMessageHandler?.(
      createViewerNavigationRequest("table", "/root/other"),
    );
    receiveMessageHandler?.(
      createViewerDisplayAcknowledgementRequest("failed"),
    );
    await flushMicrotasks();

    assert.deepStrictEqual(calls, ["ready", "navigate", "display:success"]);
    assert.strictEqual(resourceMessages.length, 1);
  });

  test("discards registered navigation and display callback return values", async () => {
    let navigationThenReads = 0;
    let displayThenReads = 0;
    const errors: string[] = [];
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    const navigationResult = Object.defineProperty({}, "then", {
      get() {
        navigationThenReads += 1;
        throw new Error("navigation result was inspected");
      },
    });
    const displayResult = Object.defineProperty({}, "then", {
      get() {
        displayThenReads += 1;
        throw new Error("display result was inspected");
      },
    });
    const panel = {
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose() {} };
        },
      },
      onDidDispose() {
        return { dispose() {} };
      },
    };

    registerViewerPanel({
      document: { uri: { toString: () => "file:///sample.ajs" } } as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      handlers: {
        onReady: () => undefined,
        onNavigate: () => navigationResult,
        onDisplay: () => displayResult,
      },
      isActivePanel: () => true,
      telemetry: { report() {}, dispose() {} },
      store: { removeByUri() {} },
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });

    receiveMessageHandler?.(
      createViewerNavigationRequest("flow", "/root/unit"),
    );
    receiveMessageHandler?.(
      createViewerDisplayAcknowledgementRequest("success"),
    );
    await flushMicrotasks();

    assert.strictEqual(navigationThenReads, 0);
    assert.strictEqual(displayThenReads, 0);
    assert.deepStrictEqual(errors, []);
  });

  test("checks registered save activity when the deferred callback runs", async () => {
    const saved: string[] = [];
    const errors: string[] = [];
    let active = true;
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    const panel = {
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose() {} };
        },
      },
      onDidDispose() {
        return { dispose() {} };
      },
    };

    registerViewerPanel({
      document: { uri: { toString: () => "file:///sample.ajs" } } as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      handlers: {
        onReady: () => undefined,
        onNavigate: () => undefined,
        onSave: async (content) => {
          saved.push(content);
          return true;
        },
      },
      isActivePanel: () => active,
      telemetry: { report() {}, dispose() {} },
      store: { removeByUri() {} },
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });

    receiveMessageHandler?.(createViewerSaveRequest("inactive-at-execution"));
    active = false;
    await flushMicrotasks();
    receiveMessageHandler?.(createViewerSaveRequest("active-at-execution"));
    active = true;
    await flushMicrotasks();
    active = false;
    receiveMessageHandler?.({ type: "save", data: 1 });

    assert.deepStrictEqual(saved, ["active-at-execution"]);
    assert.deepStrictEqual(errors, [
      "Data is not a string and cannot be saved.",
    ]);
  });

  test("looks up optional registered handlers at invocation time", async () => {
    const calls: string[] = [];
    const errors: string[] = [];
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    const handlers: ViewerPanelHandlers = {
      onReady: () => undefined,
      onNavigate: () => undefined,
      onSave: async () => {
        calls.push("initial-save");
        return true;
      },
    };
    const panel = {
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose() {} };
        },
      },
      onDidDispose() {
        return { dispose() {} };
      },
    };

    registerViewerPanel({
      document: { uri: { toString: () => "file:///sample.ajs" } } as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      handlers,
      isActivePanel: () => true,
      telemetry: { report() {}, dispose() {} },
      store: { removeByUri() {} },
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });

    handlers.onDisplay = function (
      this: ViewerPanelHandlers,
      result,
      receivedPanel,
    ) {
      assert.strictEqual(this, handlers);
      calls.push(`display:${result}:${receivedPanel === (panel as never)}`);
    };
    handlers.onSave = async function (this: ViewerPanelHandlers, content) {
      assert.strictEqual(this, handlers);
      calls.push(`replacement-save:${content}`);
      return true;
    };
    receiveMessageHandler?.(
      createViewerDisplayAcknowledgementRequest("success"),
    );
    receiveMessageHandler?.(createViewerSaveRequest("replacement"));
    await flushMicrotasks();
    handlers.onSave = undefined;
    receiveMessageHandler?.(createViewerSaveRequest("removed"));
    await flushMicrotasks();

    assert.deepStrictEqual(calls, [
      "display:success:true",
      "replacement-save:replacement",
    ]);
    assert.deepStrictEqual(errors, []);
  });

  test("keeps unsupported saves and direct handler behavior unchanged", async () => {
    const registeredSaves: string[] = [];
    const directSaves: string[] = [];
    const errors: string[] = [];
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    const handlers: ViewerPanelHandlers = {
      onReady: () => undefined,
      onNavigate: () => undefined,
    };
    const panel = {
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose() {} };
        },
      },
      onDidDispose() {
        return { dispose() {} };
      },
    };

    registerViewerPanel({
      document: { uri: { toString: () => "file:///sample.ajs" } } as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      handlers,
      isActivePanel: () => false,
      telemetry: { report() {}, dispose() {} },
      store: { removeByUri() {} },
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });
    handlers.onSave = async (content) => {
      registeredSaves.push(content);
      return true;
    };
    receiveMessageHandler?.({ type: "save", data: 1 });
    receiveMessageHandler?.(createViewerSaveRequest("registered-late"));

    const directHandler = createViewerMessageHandler({
      document: {} as never,
      panel: {} as never,
      telemetry: { report() {}, dispose() {} },
      isActivePanel: () => false,
      onReady: () => undefined,
      onResource: () => undefined,
      onNavigate: () => undefined,
      onDisplay: () => undefined,
      onSave: async (content) => {
        directSaves.push(content);
        return true;
      },
      showErrorMessage: async (message) => {
        errors.push(message);
        return undefined;
      },
    });
    directHandler(createViewerSaveRequest("direct"));
    await flushMicrotasks();

    assert.deepStrictEqual(registeredSaves, []);
    assert.deepStrictEqual(directSaves, ["direct"]);
    assert.deepStrictEqual(errors, [
      "Data is not a string and cannot be saved.",
      "Saving is not available for this viewer.",
    ]);
  });

  test("contains host and notification failures at the registered boundary", async () => {
    const errors: string[] = [];
    let receiveMessageHandler: ((value: unknown) => void) | undefined;
    const panel = {
      webview: {
        onDidReceiveMessage(handler: (value: unknown) => void) {
          receiveMessageHandler = handler;
          return { dispose() {} };
        },
      },
      onDidDispose() {
        return { dispose() {} };
      },
    };

    registerViewerPanel({
      document: { uri: { toString: () => "file:///sample.ajs" } } as never,
      panel: panel as never,
      viewType: "ajsbutler.flowViewer",
      handlers: {
        onReady: async () => {
          throw new Error("secret ready failure");
        },
        onNavigate: () => {
          throw new Error("secret navigation failure");
        },
        onSave: async () => {
          throw new Error("secret save failure");
        },
      },
      isActivePanel: () => true,
      telemetry: { report() {}, dispose() {} },
      store: { removeByUri() {} },
      showErrorMessage: (message) => {
        errors.push(message);
        return Promise.reject(new Error("secret notification failure"));
      },
    });

    receiveMessageHandler?.(createViewerReadyRequest());
    receiveMessageHandler?.(
      createViewerNavigationRequest("flow", "/root/unit"),
    );
    receiveMessageHandler?.(createViewerSaveRequest("body"));
    await flushMicrotasks();

    assert.deepStrictEqual(errors.sort(), [
      "The file could not be saved.",
      "The viewer document could not be refreshed.",
      "Viewer navigation could not be completed.",
    ]);
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
