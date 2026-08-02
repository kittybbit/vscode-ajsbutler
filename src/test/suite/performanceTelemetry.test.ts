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

  test("maps every performance operation to its stable event and buckets", () => {
    const cases = [
      {
        operation: "parse" as const,
        name: "performance.parse.completed",
        expectedBucket: { diagnosticCountBucket: "1000_plus" },
      },
      {
        operation: "unit_list_build" as const,
        name: "performance.unit_list_build.completed",
        expectedBucket: { unitCountBucket: "1" },
      },
      {
        operation: "flow_graph_build" as const,
        name: "performance.flow_graph_build.completed",
        expectedBucket: {
          nodeCountBucket: "10_99",
          edgeCountBucket: "100_999",
        },
      },
      {
        operation: "table_render" as const,
        name: "performance.table_render.ready",
        expectedBucket: { rowCountBucket: "2_9" },
      },
      {
        operation: "flow_render" as const,
        name: "performance.flow_render.ready",
        expectedBucket: {
          nodeCountBucket: "10_99",
          edgeCountBucket: "100_999",
        },
      },
      {
        operation: "csv_export" as const,
        name: "performance.csv_export.completed",
        expectedBucket: { rowCountBucket: "2_9" },
      },
    ];

    for (const { operation, name, expectedBucket } of cases) {
      assert.deepStrictEqual(
        createPerformanceTelemetryEvent({
          operation,
          result: "failed",
          host: "desktop",
          durationBucket: "15s_plus",
          unitCountBucket: "1",
          rowCountBucket: "2_9",
          nodeCountBucket: "10_99",
          edgeCountBucket: "100_999",
          diagnosticCountBucket: "1000_plus",
          errorCode: "operation_failed",
        }),
        {
          name,
          properties: {
            development: String(DEVELOPMENT),
            host: "desktop",
            operation,
            result: "failed",
            durationBucket: "15s_plus",
            ...expectedBucket,
            errorCode: "operation_failed",
          },
        },
      );
    }
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
