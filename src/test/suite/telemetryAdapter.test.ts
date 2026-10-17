import * as assert from "assert";
import { createExtensionActivatedEvent } from "../../application/telemetry/telemetryEvent";
import { VscodeTelemetryAdapter } from "../../infrastructure/telemetry/VscodeTelemetryAdapter";

suite("Telemetry adapter", () => {
  test("translates a validated event without mutation", () => {
    const calls: Array<{
      name: string;
      properties?: Record<string, string>;
    }> = [];
    const adapter = new VscodeTelemetryAdapter("connection-string", (value) => {
      assert.strictEqual(value, "connection-string");
      return {
        sendTelemetryEvent(name, properties) {
          calls.push({ name, properties });
        },
        dispose() {},
      };
    });
    const event = createExtensionActivatedEvent("desktop");

    adapter.report(event);

    assert.deepStrictEqual(calls, [
      {
        name: "extension.activated",
        properties: { host: "desktop" },
      },
    ]);
  });

  test("contains SDK report and dispose failures", () => {
    const adapter = new VscodeTelemetryAdapter("connection-string", () => ({
      sendTelemetryEvent() {
        throw new Error("report failed");
      },
      dispose() {
        throw new Error("dispose failed");
      },
    }));
    const event = createExtensionActivatedEvent("web");

    assert.doesNotThrow(() => adapter.report(event));
    assert.doesNotThrow(() => adapter.dispose());
  });

  test("contains asynchronous SDK disposal failures", async () => {
    const adapter = new VscodeTelemetryAdapter("connection-string", () => ({
      sendTelemetryEvent() {},
      dispose: async () => {
        throw new Error("async dispose failed");
      },
    }));

    adapter.dispose();
    await new Promise((resolve) => setTimeout(resolve, 0));

    assert.ok(true);
  });
});
