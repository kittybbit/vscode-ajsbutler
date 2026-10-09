import * as assert from "assert";
import * as vscode from "vscode";
import { createDiagnoseAjsDefinition } from "../../application/editor-feedback/diagnoseAjsDefinition";
import { testAjsParser } from "../support/parseAjs";
import { syntaxDiagnosticCategories } from "../../application/editor-feedback/syntaxDiagnosticTypes";
import { diagnosticRuleIds } from "../../domain/services/diagnostics/DiagnosticRuleId";
import type {
  TelemetryPort,
  ValidatedTelemetryEvent,
} from "../../application/telemetry/TelemetryPort";
import { VscodeTelemetryAdapter } from "../../infrastructure/telemetry/VscodeTelemetryAdapter";
import { updateDiagnostics } from "../../presentation/vscode/diagnostics/registerDiagnostics";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";

suite("Register diagnostics", () => {
  test("highlights the actual parsed UTF-16 parameter key after supplementary text", () => {
    const content = "unit=event,,jp1admin,;{ty=evsj;cm=😀🧭;evsid=zz;}";
    let diagnostics: readonly vscode.Diagnostic[] = [];
    const collection = {
      set: (_uri: vscode.Uri, next: vscode.Diagnostic[]) => {
        diagnostics = next;
      },
    } as unknown as vscode.DiagnosticCollection;
    const document = {
      uri: vscode.Uri.parse("untitled:unicode-diagnostic-test"),
      getText: () => content,
    } as vscode.TextDocument;
    updateDiagnostics(
      createDiagnoseAjsDefinition(testAjsParser),
      collection,
      document,
    );
    assert.strictEqual(diagnostics.length, 1);
    const diagnostic = diagnostics[0]!;
    const start = content.indexOf("evsid");
    assert.deepStrictEqual(
      diagnostic.range,
      new vscode.Range(0, start, 0, start + "evsid".length),
    );
    assert.strictEqual(
      content.slice(
        diagnostic.range.start.character,
        diagnostic.range.end.character,
      ),
      "evsid",
    );
    assert.strictEqual(diagnostic.severity, vscode.DiagnosticSeverity.Error);
    assert.strictEqual(
      diagnostic.message,
      "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
    );
  });

  test("reports anonymous diagnostic evaluation and category counts", () => {
    const trackedEvents: ValidatedTelemetryEvent[] = [];
    const telemetry: TelemetryPort = {
      report: (event) => trackedEvents.push(event),
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
          ruleId: diagnosticRuleIds.eventArrivalHost,
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
    assert.strictEqual(captured.diagnostics?.[0].range.start.line, 0);
    assert.strictEqual(captured.diagnostics?.[0].range.start.character, 2);
    assert.strictEqual(captured.diagnostics?.[0].range.end.line, 0);
    assert.strictEqual(captured.diagnostics?.[0].range.end.character, 5);
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
    const telemetry = new VscodeTelemetryAdapter("test", () => ({
      sendTelemetryEvent: () => {
        throw new Error("telemetry failed");
      },
      dispose() {},
    }));

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
