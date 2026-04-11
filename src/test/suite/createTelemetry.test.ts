import * as assert from "assert";
import { createTelemetry } from "../../extension/telemetry/createTelemetry";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { NoopTelemetryAdapter } from "../../extension/telemetry/NoopTelemetryAdapter";

suite("Create Telemetry", () => {
  test("returns a noop adapter when the connection string is missing", () => {
    const telemetry = createTelemetry("");

    assert.ok(telemetry instanceof NoopTelemetryAdapter);
    assert.doesNotThrow(() => {
      telemetry.trackEvent("sample.event", { development: "false" });
      telemetry.dispose();
    });
  });

  test("returns a noop adapter when adapter initialization throws", () => {
    const telemetry = createTelemetry("sample-connection-string", () => {
      throw new Error("boom");
    });

    assert.ok(telemetry instanceof NoopTelemetryAdapter);
    assert.doesNotThrow(() => {
      telemetry.trackEvent("sample.event", {
        entryPoint: "browser",
        fallback: "true",
      });
      telemetry.dispose();
    });
  });

  test("uses the vscode telemetry adapter when initialization succeeds", () => {
    const expected: TelemetryPort = {
      trackEvent() {},
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
        trackEvent(eventName, properties) {
          events.push({ name: eventName, properties });
        },
        dispose() {},
      }),
    );

    telemetry.trackEvent("preview.open", {
      host: "web",
      surface: "flow",
    });

    assert.deepStrictEqual(events, [
      {
        name: "preview.open",
        properties: {
          host: "web",
          surface: "flow",
        },
      },
    ]);
  });
});
