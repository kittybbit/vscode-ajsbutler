import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { MyExtension } from "../../extension/MyExtension";
import { ViewerFactory } from "../../extension/webview/ViewerFactory";
import { OPERATION, READY, RESOURCE, SAVE } from "../../shared/webviewEvents";

class TestViewerFactory extends ViewerFactory {
  public constructor(
    telemetry: TelemetryPort,
    store: { removeByDocument(document: vscode.TextDocument): void },
  ) {
    super(
      "ajsbutler.testViewer",
      MyExtension.init(
        { subscriptions: [] } as unknown as vscode.ExtensionContext,
        telemetry,
      ),
      store as never,
    );
  }

  override customize(): void {}

  public customizeForTest(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    onReady: (
      document: vscode.TextDocument,
      panel: vscode.WebviewPanel,
    ) => void,
    onSave?: (event: { data: string }) => Promise<void>,
  ): void {
    this.registerStandardViewerCustomize(document, panel, onReady, onSave);
  }
}

suite("ViewerFactory", () => {
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

    const factory = new TestViewerFactory(telemetry, {
      removeByDocument(receivedDocument) {
        removed.push(receivedDocument.uri.toString());
      },
    });

    factory.customizeForTest(
      document,
      panel,
      (receivedDocument, receivedPanel) => {
        calls.push(
          `ready:${receivedDocument.uri.toString()}:${receivedPanel.viewType}`,
        );
      },
      async (event) => {
        calls.push(`save:${event.data}`);
      },
    );

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
    assert.deepStrictEqual(telemetryEvents, [OPERATION]);
    assert.deepStrictEqual(removed, ["file:///sample.ajs"]);
    assert.strictEqual(receiverDisposed, true);
  });
});
