import * as assert from "assert";
import { createViewerOpenCompletedEvent } from "../../application/telemetry/telemetryEvent";
import { resolveViewerTelemetryKind } from "../../application/telemetry/viewerTelemetry";

suite("Viewer telemetry", () => {
  test("maps view types to their catalogued viewer features", () => {
    assert.strictEqual(
      resolveViewerTelemetryKind("ajsbutler.tableViewer"),
      "table",
    );
    assert.strictEqual(
      resolveViewerTelemetryKind("ajsbutler.flowViewer"),
      "flow",
    );
    assert.strictEqual(
      resolveViewerTelemetryKind("ajsbutler.unknown"),
      "unknown",
    );
  });

  test("records only a terminal open result with the approved fields", () => {
    assert.deepStrictEqual(
      createViewerOpenCompletedEvent({
        feature: "flow",
        host: "web",
        result: "failed",
      }),
      {
        name: "viewer.open_completed",
        properties: { feature: "flow", host: "web", result: "failed" },
      },
    );
  });
});
