import * as assert from "assert";
import { createPerformanceTelemetryEvent } from "../../application/telemetry/performanceTelemetry";
import { isViewerPerformanceTelemetryData } from "../../application/telemetry/viewerPerformanceTelemetryData";

suite("Performance telemetry", () => {
  test("creates privacy-safe performance events from bucketed metadata", () => {
    assert.deepStrictEqual(
      createPerformanceTelemetryEvent({
        operation: "flow_graph_build",
        result: "success",
        host: "web",
        durationBucket: "100_499ms",
        nodeCountBucket: "10_99",
        edgeCountBucket: "2_9",
      }),
      {
        name: "performance.flow_graph_build.completed",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          operation: "flow_graph_build",
          result: "success",
          durationBucket: "100_499ms",
          nodeCountBucket: "10_99",
          edgeCountBucket: "2_9",
        },
      },
    );
  });

  test("accepts only viewer operations and bucket values", () => {
    assert.strictEqual(
      isViewerPerformanceTelemetryData({
        operation: "flow_graph_build",
        result: "success",
        nodeCountBucket: "10_99",
      }),
      true,
    );
    assert.strictEqual(
      isViewerPerformanceTelemetryData({
        operation: "parse",
        result: "success",
      }),
      false,
    );
    assert.strictEqual(
      isViewerPerformanceTelemetryData({
        operation: "flow_graph_build",
        result: "success",
        nodeCountBucket: "raw count",
      }),
      false,
    );
  });
});
