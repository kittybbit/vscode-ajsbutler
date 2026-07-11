import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import type { ExtensionDependencies } from "../../bootstrap/extension/extensionDependencies";
import { createExtensionSubscriptions } from "../../bootstrap/extension/extensionSubscriptions";

suite("Extension subscriptions", () => {
  test("creates diagnostics, hover, import, semantic diff, and viewer subscriptions", () => {
    const context = { subscriptions: [] } as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      trackEvent() {},
      dispose() {},
    };
    const dependencies: ExtensionDependencies = {
      telemetry,
      buildSyntaxDiagnostics: () => [],
      buildUnitList: () => ({ errors: [] }),
      findParameterHover: () => undefined,
      semanticDiff: {
        buildSemanticDiffReport: () => ({ ok: true, report: "" }),
      },
      webApiImport: {
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
      },
    };

    const subscriptions = createExtensionSubscriptions(context, dependencies);

    assert.strictEqual(subscriptions.length, 10);
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
