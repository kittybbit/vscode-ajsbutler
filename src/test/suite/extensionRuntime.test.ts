import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import {
  createExtensionRuntime,
  resolveExtensionHost,
} from "../../bootstrap/extension/extensionRuntime";

suite("Extension runtime", () => {
  test("resolves the extension host before dependency construction", () => {
    assert.strictEqual(resolveExtensionHost(vscode.UIKind.Desktop), "desktop");
    assert.strictEqual(resolveExtensionHost(vscode.UIKind.Web), "web");
  });

  test("creates MyExtension with telemetry and context", () => {
    const context = {
      subscriptions: [],
    } as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      report() {},
      dispose() {},
    };

    const runtime = createExtensionRuntime(context, telemetry);

    assert.strictEqual(runtime.context, context);
    assert.strictEqual(runtime.telemetry, telemetry);
    runtime.dispose();
  });
});
