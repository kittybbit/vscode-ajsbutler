import * as assert from "assert";
import * as vscode from "vscode";
import { reportWebviewOperation } from "../../extension/webview/messageHandlers";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { OPERATION } from "../../shared/webviewEvents";

suite("Report Webview Operation", () => {
  test("keeps the existing telemetry event name and payload shape", () => {
    const events: Array<{
      eventName: string;
      properties: Record<string, string> | undefined;
    }> = [];

    const telemetry: TelemetryPort = {
      trackEvent(eventName, properties) {
        events.push({ eventName, properties });
      },
      dispose() {},
    };

    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    } as unknown as vscode.TextDocument;
    const panel = {
      viewType: "ajsbutler.tableViewer",
    } as unknown as vscode.WebviewPanel;

    reportWebviewOperation(document, panel, telemetry, "copy.csv");

    assert.deepStrictEqual(events, [
      {
        eventName: OPERATION,
        properties: {
          development: String(DEVELOPMENT),
          viewType: "ajsbutler.tableViewer",
          operation: "copy.csv",
        },
      },
    ]);
  });
});
