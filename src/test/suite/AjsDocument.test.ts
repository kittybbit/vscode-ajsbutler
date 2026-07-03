import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryProperties } from "../../application/telemetry/TelemetryPort";
import {
  createDebouncedAjsDocumentChange,
  createReadyAjsDocument,
} from "../../presentation/vscode/webview/ajsDocument";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";
import { CHANGE_DOCUMENT } from "../../shared/webviewEvents";

suite("ajsDocument", () => {
  const buildUnitList = () => ({ errors: [], document: undefined });

  test("posts the normalized document on ready", () => {
    const posted: Array<{ type: string; data: unknown }> = [];
    const telemetryEvents: Array<{
      eventName: string;
      properties?: TelemetryProperties;
    }> = [];
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

    createReadyAjsDocument(buildUnitList, {
      trackEvent: (eventName, properties) => {
        telemetryEvents.push({ eventName, properties });
      },
      dispose() {},
    })(document, panel);

    assert.strictEqual(posted.length, 1);
    assert.strictEqual(posted[0]?.type, CHANGE_DOCUMENT);
    assert.deepStrictEqual(
      {
        ...telemetryEvents[0]?.properties,
        durationBucket: "<bucket>",
      },
      {
        development: String(DEVELOPMENT),
        host: getTelemetryHost(),
        operation: "unit_list_build",
        result: "success",
        durationBucket: "<bucket>",
      },
    );
    assert.strictEqual(
      telemetryEvents[0]?.eventName,
      "performance.unit_list_build.completed",
    );
    assert.ok(telemetryEvents[0]?.properties?.durationBucket);
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
  });
});
