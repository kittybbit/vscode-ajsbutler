import * as assert from "assert";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createWebApiImportSubscriptions } from "../../bootstrap/extension/webapiImportWiring";

suite("WebAPI import wiring", () => {
  test("registers the command with injected dependencies", () => {
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };

    const subscriptions = createWebApiImportSubscriptions({
      telemetry,
      storeCredential: async () => {},
      importPort: {
        importDefinition: async () => ({
          ok: false,
          error: {
            code: "network-failed",
            message: "not called",
            recoverable: true,
          },
        }),
      },
    });

    assert.strictEqual(subscriptions.length, 1);
    subscriptions[0].dispose();
  });
});
