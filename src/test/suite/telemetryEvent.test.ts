import * as assert from "assert";
import {
  createCsvExportedEvent,
  createExtensionActivatedEvent,
  createSearchExecutedEvent,
  createSemanticDiffCompletedEvent,
  createSemanticDiffExportedEvent,
  createViewerOpenCompletedEvent,
  createWebApiImportCompletedEvent,
  parseTelemetryEvent,
} from "../../application/telemetry/telemetryEvent";
import type { ValidatedTelemetryEvent } from "../../application/telemetry/TelemetryPort";

suite("Telemetry event schema", () => {
  test("builds only the seven catalogued event shapes", () => {
    const events = [
      createExtensionActivatedEvent("desktop"),
      createViewerOpenCompletedEvent({
        feature: "flow",
        host: "web",
        result: "success",
      }),
      createSearchExecutedEvent("table"),
      createCsvExportedEvent("copy"),
      createWebApiImportCompletedEvent("cancelled"),
      createSemanticDiffCompletedEvent("failed"),
      createSemanticDiffExportedEvent("save"),
    ];

    assert.deepStrictEqual(events, [
      { name: "extension.activated", properties: { host: "desktop" } },
      {
        name: "viewer.open_completed",
        properties: { feature: "flow", host: "web", result: "success" },
      },
      { name: "search.executed", properties: { feature: "table" } },
      { name: "csv.exported", properties: { method: "copy" } },
      { name: "webapi_import.completed", properties: { result: "cancelled" } },
      { name: "semantic_diff.completed", properties: { result: "failed" } },
      { name: "semantic_diff.exported", properties: { method: "save" } },
    ]);
    assert.deepStrictEqual(
      events.map(({ name }) => name),
      [
        "extension.activated",
        "viewer.open_completed",
        "search.executed",
        "csv.exported",
        "webapi_import.completed",
        "semantic_diff.completed",
        "semantic_diff.exported",
      ],
    );
  });

  test("rejects invalid enums at compile time", () => {
    // @ts-expect-error Host is a closed enum.
    createExtensionActivatedEvent("browser");
    // @ts-expect-error Search accepts a viewer feature only.
    createSearchExecutedEvent("desktop");
    // @ts-expect-error Export method is a closed enum.
    createCsvExportedEvent("download");
    // @ts-expect-error A raw event object is not factory-validated.
    const rawEvent: ValidatedTelemetryEvent = {
      name: "csv.exported",
      properties: { method: "copy" },
    };
    assert.strictEqual(typeof rawEvent, "object");
  });

  test("rebuilds exact safe events from untrusted input", () => {
    assert.deepStrictEqual(
      parseTelemetryEvent({
        name: "viewer.open_completed",
        properties: { feature: "table", host: "desktop", result: "failed" },
      }),
      createViewerOpenCompletedEvent({
        feature: "table",
        host: "desktop",
        result: "failed",
      }),
    );

    for (const value of [
      null,
      "csv.exported",
      { name: "legacy.operation", properties: { operation: "csv.copy" } },
      {
        name: "csv.exported",
        properties: { method: "copy", filePath: "/secret" },
      },
      { name: "csv.exported", properties: { method: "download" } },
      { name: "csv.exported", properties: { method: "copy" }, extra: true },
      {
        name: "search.executed",
        properties: { feature: "flow", query: "secret" },
      },
      Object.assign(Object.create({ inherited: true }), {
        name: "csv.exported",
        properties: { method: "copy" },
      }),
    ]) {
      assert.strictEqual(parseTelemetryEvent(value), undefined);
    }
  });
});
