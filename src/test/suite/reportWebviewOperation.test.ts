import * as assert from "assert";
import * as vscode from "vscode";
import { reportWebviewOperation } from "../../presentation/vscode/webview/messageHandlers";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { OPERATION } from "../../presentation/webview/viewerRequestMessages";

suite("Report Webview Operation", () => {
  test("keeps the existing telemetry event name and payload shape", () => {
    const events: Array<{
      eventName: string;
      properties: Record<string, string> | undefined;
    }> = [];

    const telemetry: TelemetryPort = {
      report(event) {
        events.push({
          eventName: event.name,
          properties: event.properties,
        });
      },
      dispose() {},
    };

    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const panel = {
      viewType: "ajsbutler.tableViewer",
    } as vscode.WebviewPanel;

    reportWebviewOperation({
      document,
      panel,
      telemetry,
      operation: "copy.csv",
    });

    assert.deepStrictEqual(events, [
      {
        eventName: OPERATION,
        properties: {
          development: String(DEVELOPMENT),
          viewType: "ajsbutler.tableViewer",
          operation: "copy.csv",
        },
      },
      {
        eventName: "viewer.table.csv_copied",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          view: "table",
          result: "success",
        },
      },
    ]);
  });

  test("does not let telemetry failures escape the host operation bridge", () => {
    const document = {
      uri: { toString: () => "file:///sample.ajs" },
    } as vscode.TextDocument;
    const panel = {
      viewType: "ajsbutler.tableViewer",
    } as vscode.WebviewPanel;

    assert.doesNotThrow(() =>
      reportWebviewOperation({
        document,
        panel,
        telemetry: {
          report() {
            throw new Error("secret telemetry failure");
          },
          dispose() {},
        },
        operation: "copy.csv",
      }),
    );
  });
});
