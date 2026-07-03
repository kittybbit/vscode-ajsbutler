import * as assert from "assert";
import { syntaxDiagnosticCategories } from "../../application/editor-feedback/syntaxDiagnosticTypes";
import {
  createDiagnosticsEvaluatedTelemetryEvent,
  createDiagnosticsReportedTelemetryEvent,
  createHoverTelemetryEvent,
} from "../../application/telemetry/editorFeedbackTelemetry";

suite("Editor feedback telemetry", () => {
  test("creates privacy-safe diagnostic telemetry events", () => {
    assert.deepStrictEqual(
      createDiagnosticsEvaluatedTelemetryEvent({
        host: "desktop",
        result: "success",
        durationBucket: "lt100ms",
        diagnosticCountBucket: "2_9",
      }),
      {
        name: "editor.diagnostics.evaluated",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          result: "success",
          durationBucket: "lt100ms",
          diagnosticCountBucket: "2_9",
        },
      },
    );

    assert.deepStrictEqual(
      createDiagnosticsReportedTelemetryEvent({
        host: "web",
        result: "reported",
        diagnosticCategory: syntaxDiagnosticCategories.eventSending,
        diagnosticCountBucket: "1",
      }),
      {
        name: "editor.diagnostics.reported",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          result: "reported",
          diagnosticCategory: "event_sending",
          diagnosticCountBucket: "1",
        },
      },
    );
  });

  test("creates privacy-safe hover telemetry events", () => {
    assert.deepStrictEqual(
      createHoverTelemetryEvent({
        action: "resolved",
        host: "desktop",
        result: "matched",
        durationBucket: "lt100ms",
        hoverTargetCategory: "parameter",
      }),
      {
        name: "editor.hover.resolved",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          result: "matched",
          durationBucket: "lt100ms",
          hoverTargetCategory: "parameter",
        },
      },
    );
  });
});
