import * as assert from "assert";
import {
  allowTelemetryProperties,
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryProperties,
  type TelemetryPropertyKey,
  type ValidatedTelemetryEvent,
} from "../../application/telemetry/telemetryEvent";

type RawTelemetryEvent = Readonly<{
  name: string;
  properties: TelemetryProperties;
}>;

type RawEventIsValidated = RawTelemetryEvent extends ValidatedTelemetryEvent
  ? true
  : false;

suite("Telemetry event schema", () => {
  test("requires factory validation for telemetry event assignment", () => {
    const rawEventIsValidated: RawEventIsValidated = false;
    const mutateValidatedProperties = (
      event: ValidatedTelemetryEvent,
    ): void => {
      // @ts-expect-error Validated properties must remain immutable after filtering.
      event.properties.filePath = "/secret/example.ajs";
    };

    assert.strictEqual(rawEventIsValidated, false);
    assert.strictEqual(typeof mutateValidatedProperties, "function");
  });

  test("preserves the exact legacy event and property baseline", () => {
    const events = [
      createTelemetryEvent(telemetryEvents.legacyExtensionActivated, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyExtensionDeactivated, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyTableViewerOpened, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyFlowViewerOpened, {
        development: false,
      }),
      createTelemetryEvent(telemetryEvents.legacyWebviewOperation, {
        development: false,
        viewType: "ajsbutler.tableViewer",
        operation: "copy.csv",
        filePath: "/secret/example.ajs",
      }),
    ];

    assert.deepStrictEqual(events, [
      { name: "ext.activate", properties: { development: "false" } },
      { name: "ext.deactivate", properties: { development: "false" } },
      {
        name: "ajsbutler.tableViewer",
        properties: { development: "false" },
      },
      {
        name: "ajsbutler.flowViewer",
        properties: { development: "false" },
      },
      {
        name: "operation",
        properties: {
          development: "false",
          viewType: "ajsbutler.tableViewer",
          operation: "copy.csv",
        },
      },
    ]);
  });

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
