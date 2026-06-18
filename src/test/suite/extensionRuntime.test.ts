import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createExtensionRuntime } from "../../extension/bootstrap/extensionRuntime";

suite("Extension runtime", () => {
  test("creates MyExtension with telemetry and context", () => {
    const context = {
      subscriptions: [],
    } as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };

    const runtime = createExtensionRuntime(context, telemetry);

    assert.strictEqual(runtime.context, context);
    assert.strictEqual(runtime.telemetry, telemetry);
    runtime.dispose();
  });
});
