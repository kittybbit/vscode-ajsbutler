import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createExtensionSubscriptions } from "../../extension/bootstrap/extensionSubscriptions";

suite("Extension subscriptions", () => {
  test("creates diagnostics, hover, and viewer subscriptions", () => {
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };

    const subscriptions = createExtensionSubscriptions(context, telemetry);

    assert.strictEqual(subscriptions.length, 6);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
