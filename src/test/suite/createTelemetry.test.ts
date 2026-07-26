import * as assert from "assert";
import {
  createTelemetryEvent,
  telemetryEvents,
} from "../../application/telemetry/telemetryEvent";
import { createTelemetry } from "../../bootstrap/extension/createTelemetry";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { NoopTelemetryAdapter } from "../../infrastructure/telemetry/NoopTelemetryAdapter";

suite("Create Telemetry", () => {
  test("returns a noop adapter when the connection string is missing", () => {
    const telemetry = createTelemetry("");

    assert.ok(telemetry instanceof NoopTelemetryAdapter);
    assert.doesNotThrow(() => {
      telemetry.report(
        createTelemetryEvent(telemetryEvents.legacyExtensionActivated, {
          development: false,
        }),
      );
      telemetry.dispose();
    });
  });

  test("returns a noop adapter when adapter initialization throws", () => {
    const telemetry = createTelemetry("sample-connection-string", () => {
      throw new Error("boom");
    });

    assert.ok(telemetry instanceof NoopTelemetryAdapter);
    assert.doesNotThrow(() => {
      telemetry.report(
        createTelemetryEvent(telemetryEvents.legacyExtensionActivated, {
          development: false,
        }),
      );
      telemetry.dispose();
    });
  });

  test("uses the vscode telemetry adapter when initialization succeeds", () => {
    const expected: TelemetryPort = {
      report() {},
      dispose() {},
    };

    const telemetry = createTelemetry(
      "sample-connection-string",
      (value): TelemetryPort => {
        assert.strictEqual(value, "sample-connection-string");
        return expected;
      },
    );

    assert.strictEqual(telemetry, expected);
  });

  test("passes browser-hosted callers through the same telemetry port contract", () => {
    const events: Array<{ name: string; properties?: Record<string, string> }> =
      [];
    const telemetry = createTelemetry(
      "sample-connection-string",
      (): TelemetryPort => ({
        report(event) {
          events.push(event);
        },
        dispose() {},
      }),
    );

    telemetry.report(
      createTelemetryEvent(telemetryEvents.viewerFlowOpenStarted, {
        host: "web",
        source: "restore",
        result: "success",
      }),
    );

    assert.deepStrictEqual(events, [
      {
        name: "viewer.flow.open_started",
        properties: {
          host: "web",
          source: "restore",
          result: "success",
        },
      },
    ]);
  });
});
