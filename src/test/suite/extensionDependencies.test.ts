import * as assert from "assert";
import * as vscode from "vscode";
import { createExtensionDependencies } from "../../bootstrap/extension/extensionDependencies";

suite("Extension dependencies", () => {
  test("constructs bootstrap-owned dependencies", () => {
    const context = {
      secrets: {
        get: async () => undefined,
        store: async () => {},
        delete: async () => {},
        onDidChange: () => ({ dispose() {} }),
      },
    } as unknown as vscode.ExtensionContext;

    const dependencies = createExtensionDependencies(context);

    assert.strictEqual(typeof dependencies.telemetry.trackEvent, "function");
    assert.strictEqual(typeof dependencies.buildSyntaxDiagnostics, "function");
    assert.strictEqual(typeof dependencies.buildUnitList, "function");
    assert.strictEqual(typeof dependencies.findParameterHover, "function");
    assert.strictEqual(
      typeof dependencies.webApiImport.storeCredential,
      "function",
    );
    assert.strictEqual(
      typeof dependencies.webApiImport.importPort.importDefinition,
      "function",
    );

    dependencies.telemetry.dispose();
  });
});
