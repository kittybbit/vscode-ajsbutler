import * as assert from "assert";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createWebApiImportCapability,
  createWebApiImportSubscriptions,
} from "../../bootstrap/extension/webapiImportWiring";

suite("WebAPI import wiring", () => {
  test("registers the command with injected dependencies", () => {
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };

    const subscriptions = createWebApiImportSubscriptions({
      telemetry,
      importDefinition: async () => ({
        ok: false,
        error: {
          code: "network-failed",
          message: "not called",
          recoverable: true,
        },
      }),
    });

    assert.strictEqual(subscriptions.length, 1);
    subscriptions[0].dispose();
  });

  test("selects the desktop import capability without an unavailable result", () => {
    const importDefinition = async () => ({
      ok: false as const,
      error: {
        code: "network-failed" as const,
        message: "not called",
        recoverable: true as const,
      },
    });

    const capability = createWebApiImportCapability(
      "desktop",
      importDefinition,
    );

    assert.strictEqual(capability.importDefinition, importDefinition);
    assert.strictEqual(capability.unavailable, undefined);
  });

  test("selects a stable unsupported-host capability for web", async () => {
    let desktopCalls = 0;
    const capability = createWebApiImportCapability("web", async () => {
      desktopCalls += 1;
      throw new Error("desktop import must not run");
    });

    assert.strictEqual(capability.unavailable?.error.code, "unsupported-host");
    assert.deepStrictEqual(
      await capability.importDefinition({
        connection: { baseUrl: "https://web-console.example.com:22252" },
        scope: {
          manager: "manager.example.com",
          serviceName: "AJSROOT1",
          location: "/JobGroup",
        },
        credential: { username: "jp1admin", password: "secret" },
      }),
      capability.unavailable,
    );
    assert.strictEqual(desktopCalls, 0);
  });
});
