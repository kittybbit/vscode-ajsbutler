import * as assert from "assert";
import * as vscode from "vscode";
import { createExtensionRuntime } from "../../extension/bootstrap/extensionRuntime";

suite("Extension runtime", () => {
  test("creates MyExtension with telemetry and context", () => {
    const context = {
      subscriptions: [],
    } as unknown as vscode.ExtensionContext;

    const runtime = createExtensionRuntime(context);

    assert.strictEqual(runtime.context, context);
    assert.strictEqual(typeof runtime.telemetry.trackEvent, "function");
    assert.strictEqual(typeof runtime.telemetry.dispose, "function");
    runtime.dispose();
  });
});
