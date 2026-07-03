import * as assert from "assert";
import * as vscode from "vscode";
import { syntaxDiagnosticCategories } from "../../application/editor-feedback/syntaxDiagnosticTypes";
import type { TelemetryEvent } from "../../application/telemetry/telemetryEvent";
import type { TelemetryProperties } from "../../application/telemetry/TelemetryPort";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { updateDiagnostics } from "../../presentation/vscode/diagnostics/registerDiagnostics";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";

suite("Register diagnostics", () => {
  test("reports anonymous diagnostic evaluation and category counts", () => {
    const trackedEvents: TelemetryEvent[] = [];
    const telemetry: TelemetryPort = {
      trackEvent: (name: string, properties: TelemetryProperties = {}) => {
        trackedEvents.push({ name, properties });
      },
      dispose() {},
    };
    const captured: { diagnostics?: vscode.Diagnostic[] } = {};
    const collection = {
      set: (_uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) => {
        captured.diagnostics = diagnostics;
      },
    } as unknown as vscode.DiagnosticCollection;
    const document = {
      uri: vscode.Uri.parse("untitled:diagnostic-test"),
      getText: () => "raw definition text",
    } as vscode.TextDocument;

    updateDiagnostics(
      () => [
        {
          line: 1,
          column: 2,
          length: 3,
          message: "diagnostic message with raw-looking value",
          severity: "error",
          category: syntaxDiagnosticCategories.eventSending,
        },
        {
          line: 2,
          column: 4,
          length: 5,
          message: "another diagnostic message",
          severity: "error",
          category: syntaxDiagnosticCategories.eventSending,
        },
      ],
      collection,
      document,
      telemetry,
    );

    assert.strictEqual(captured.diagnostics?.length, 2);
    assert.deepStrictEqual(
      trackedEvents.map((event) => event.name),
      ["editor.diagnostics.evaluated", "editor.diagnostics.reported"],
    );
    assert.deepStrictEqual(
      {
        ...trackedEvents[0].properties,
        durationBucket: "<bucket>",
      },
      {
        development: String(DEVELOPMENT),
        host: getTelemetryHost(),
        result: "success",
        durationBucket: "<bucket>",
        diagnosticCountBucket: "2_9",
      },
    );
    assert.ok(trackedEvents[0].properties.durationBucket);
    assert.deepStrictEqual(trackedEvents[1].properties, {
      development: String(DEVELOPMENT),
      host: getTelemetryHost(),
      result: "reported",
      diagnosticCategory: "event_sending",
      diagnosticCountBucket: "2_9",
    });
  });

  test("keeps diagnostics available when telemetry fails", () => {
    const collection = {
      set: (_uri: vscode.Uri, diagnostics: vscode.Diagnostic[]) => {
        assert.strictEqual(diagnostics.length, 1);
      },
    } as unknown as vscode.DiagnosticCollection;
    const document = {
      uri: vscode.Uri.parse("untitled:diagnostic-test"),
      getText: () => "raw definition text",
    } as vscode.TextDocument;
    const telemetry: TelemetryPort = {
      trackEvent: () => {
        throw new Error("telemetry failed");
      },
      dispose() {},
    };

    assert.doesNotThrow(() => {
      updateDiagnostics(
        () => [
          {
            line: 1,
            column: 0,
            length: 1,
            message: "diagnostic message",
            severity: "error",
            category: syntaxDiagnosticCategories.parserSyntax,
          },
        ],
        collection,
        document,
        telemetry,
      );
    });
  });
});
