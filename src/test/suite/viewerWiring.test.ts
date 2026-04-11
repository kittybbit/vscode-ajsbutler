import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createViewerSubscriptions } from "../../extension/bootstrap/viewerWiring";

suite("Viewer wiring", () => {
  test("creates viewer subscriptions for both table and flow viewers", () => {
    const context = { subscriptions: [] } as unknown as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };

    const subscriptions = createViewerSubscriptions({ context, telemetry });

    assert.strictEqual(subscriptions.length, 4);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
