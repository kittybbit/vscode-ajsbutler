import * as assert from "assert";
import { createTelemetry } from "../../extension/telemetry/createTelemetry";
import { TelemetryPort } from "../../application/telemetry/TelemetryPort";

suite("Create Telemetry", () => {
  test("returns a noop adapter when the connection string is missing", () => {
    const telemetry = createTelemetry("");

    assert.doesNotThrow(() => {
      telemetry.trackEvent("sample.event", { development: "false" });
      telemetry.dispose();
    });
  });

  test("returns a noop adapter when adapter initialization throws", () => {
    const telemetry = createTelemetry("sample-connection-string", () => {
      throw new Error("boom");
    });

    assert.doesNotThrow(() => {
      telemetry.trackEvent("sample.event");
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
});
