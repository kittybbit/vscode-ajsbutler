import * as assert from "assert";
import {
  allowTelemetryProperties,
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryPropertyKey,
} from "../../application/telemetry/telemetryEvent";

suite("Telemetry event schema", () => {
  test("creates an event with only allowlisted string properties", () => {
    const event = createTelemetryEvent(
      telemetryEvents.extensionLifecycleActivated,
      {
        development: false,
        host: "desktop",
        result: "success",
        extra: "ignored",
      },
    );

    assert.deepStrictEqual(event, {
      name: "extension.lifecycle.activated",
      properties: {
        development: "false",
        host: "desktop",
        result: "success",
      },
    });
  });

  test("omits null and undefined properties", () => {
    const properties = allowTelemetryProperties(
      [telemetryPropertyKeys.host, telemetryPropertyKeys.errorCode],
      {
        host: undefined,
        errorCode: null,
      },
    );

    assert.deepStrictEqual(properties, {});
  });

  test("omits forbidden content keys even when mixed with approved metadata", () => {
    const properties = allowTelemetryProperties(
      [
        telemetryPropertyKeys.host,
        telemetryPropertyKeys.result,
        telemetryPropertyKeys.durationBucket,
      ],
      {
        command: "unit-command",
        filePath: "/secret/example.ajs",
        host: "web",
        result: "failed",
        searchText: "raw query",
        durationBucket: "100_499ms",
        unitName: "sensitive-unit",
      },
    );

    assert.deepStrictEqual(properties, {
      host: "web",
      result: "failed",
      durationBucket: "100_499ms",
    });
  });

  test("omits forbidden content keys even if a schema accidentally allows them", () => {
    const properties = allowTelemetryProperties(
      ["filePath", telemetryPropertyKeys.host] as TelemetryPropertyKey[],
      {
        filePath: "/secret/example.ajs",
        host: "desktop",
      },
    );

    assert.deepStrictEqual(properties, {
      host: "desktop",
    });
  });
});
