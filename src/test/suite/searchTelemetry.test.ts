import * as assert from "assert";
import { createSearchTelemetryEvent } from "../../application/telemetry/searchTelemetry";
import { isSearchTelemetryData } from "../../application/telemetry/searchTelemetryData";

suite("Search telemetry", () => {
  test("creates privacy-safe search events from bucketed metadata", () => {
    assert.deepStrictEqual(
      createSearchTelemetryEvent({
        surface: "flow",
        action: "navigated",
        result: "matched",
        host: "web",
        mode: "partial",
        queryLengthBucket: "10_99",
        resultCountBucket: "2_9",
        durationBucket: "lt100ms",
        scope: "current_flow_scope",
      }),
      {
        name: "search.flow.navigated",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          surface: "flow",
          mode: "partial",
          result: "matched",
          queryLengthBucket: "10_99",
          resultCountBucket: "2_9",
          durationBucket: "lt100ms",
          scope: "current_flow_scope",
        },
      },
    );
  });

  test("accepts only allowlisted search meaning and bucket values", () => {
    assert.strictEqual(
      isSearchTelemetryData({
        surface: "flow",
        action: "navigated",
        result: "matched",
        mode: "partial",
        queryLengthBucket: "10_99",
        scope: "current_flow_scope",
      }),
      true,
    );
    assert.strictEqual(
      isSearchTelemetryData({
        surface: "flow",
        action: "navigated",
        result: "matched",
        mode: "partial",
        queryLengthBucket: "raw query",
        scope: "current_flow_scope",
      }),
      false,
    );
  });
});
