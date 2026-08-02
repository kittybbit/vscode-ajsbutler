import * as assert from "assert";
import {
  createLegacyViewerOpenedEvent,
  createViewerClosedEvent,
  createViewerOpenStartedEvent,
  createViewerReadyEvent,
  resolveViewerTelemetryKind,
} from "../../application/telemetry/viewerTelemetry";

suite("Viewer telemetry", () => {
  test("maps viewer types to telemetry kinds", () => {
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

  test("preserves legacy open events for both supported viewer types", () => {
    assert.deepStrictEqual(
      createLegacyViewerOpenedEvent("ajsbutler.tableViewer"),
      {
        name: "ajsbutler.tableViewer",
        properties: {
          development: String(DEVELOPMENT),
        },
      },
    );
    assert.deepStrictEqual(
      createLegacyViewerOpenedEvent("ajsbutler.flowViewer"),
      {
        name: "ajsbutler.flowViewer",
        properties: {
          development: String(DEVELOPMENT),
        },
      },
    );
  });

  test("creates privacy-safe viewer lifecycle events", () => {
    assert.deepStrictEqual(
      createViewerOpenStartedEvent({
        viewType: "ajsbutler.tableViewer",
        source: "command",
        result: "success",
        host: "desktop",
      }),
      {
        name: "viewer.table.open_started",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          source: "command",
          result: "success",
        },
      },
    );

    assert.deepStrictEqual(
      createViewerReadyEvent({
        viewType: "ajsbutler.flowViewer",
        source: "navigation",
        result: "success",
        host: "web",
        nodeCountBucket: "10_99",
        edgeCountBucket: "10_99",
      }),
      {
        name: "viewer.flow.ready",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          source: "navigation",
          result: "success",
          nodeCountBucket: "10_99",
          edgeCountBucket: "10_99",
        },
      },
    );

    assert.deepStrictEqual(
      createViewerClosedEvent({
        viewType: "ajsbutler.flowViewer",
        host: "desktop",
      }),
      {
        name: "viewer.flow.closed",
        properties: {
          development: String(DEVELOPMENT),
          host: "desktop",
          result: "success",
        },
      },
    );

    assert.deepStrictEqual(
      createViewerOpenStartedEvent({
        viewType: "ajsbutler.flowViewer",
        source: "restore",
        result: "failed",
        host: "web",
        errorCode: "open_failed",
      }),
      {
        name: "viewer.flow.open_started",
        properties: {
          development: String(DEVELOPMENT),
          host: "web",
          source: "restore",
          result: "failed",
          errorCode: "open_failed",
        },
      },
    );

    assert.deepStrictEqual(
      createViewerReadyEvent({
        viewType: "ajsbutler.tableViewer",
        source: "command",
        result: "failed",
        unitCountBucket: "1000_plus",
        rowCountBucket: "100_999",
        errorCode: "ready_failed",
      }),
      {
        name: "viewer.table.ready",
        properties: {
          development: String(DEVELOPMENT),
          source: "command",
          result: "failed",
          unitCountBucket: "1000_plus",
          rowCountBucket: "100_999",
          errorCode: "ready_failed",
        },
      },
    );
  });

  test("does not create events for unknown viewer types", () => {
    assert.strictEqual(
      createViewerOpenStartedEvent({
        viewType: "ajsbutler.unknown",
        source: "command",
        result: "success",
      }),
      undefined,
    );
    assert.strictEqual(
      createLegacyViewerOpenedEvent("ajsbutler.unknown"),
      undefined,
    );
    assert.strictEqual(
      createViewerClosedEvent({
        viewType: "ajsbutler.unknown",
      }),
      undefined,
    );
  });
});
