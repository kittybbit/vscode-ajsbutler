import * as assert from "assert";
import {
  createSemanticDiffCompletedEvent,
  createSemanticDiffExportedEvent,
} from "../../application/telemetry/telemetryEvent";
import { parseTelemetryEvent } from "../../application/telemetry/telemetryEvent";

suite("Semantic diff telemetry", () => {
  test("reports only the terminal result enum", () => {
    const events = ["success", "failed", "cancelled"].map((result) =>
      createSemanticDiffCompletedEvent(
        result as "success" | "failed" | "cancelled",
      ),
    );

    assert.deepStrictEqual(events, [
      { name: "semantic_diff.completed", properties: { result: "success" } },
      { name: "semantic_diff.completed", properties: { result: "failed" } },
      { name: "semantic_diff.completed", properties: { result: "cancelled" } },
    ]);
    events.forEach((event) =>
      assert.deepStrictEqual(parseTelemetryEvent(event), event),
    );
  });

  test("reports only a successful export method", () => {
    const events = [
      createSemanticDiffExportedEvent("copy"),
      createSemanticDiffExportedEvent("save"),
    ];

    assert.deepStrictEqual(events, [
      { name: "semantic_diff.exported", properties: { method: "copy" } },
      { name: "semantic_diff.exported", properties: { method: "save" } },
    ]);
    events.forEach((event) =>
      assert.deepStrictEqual(parseTelemetryEvent(event), event),
    );
  });
});
