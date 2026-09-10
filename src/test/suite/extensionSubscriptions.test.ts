import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { createSemanticDiffSourceHandleIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorer";
import type { ExtensionDependencies } from "../../bootstrap/extension/extensionDependencies";
import { createExtensionSubscriptions } from "../../bootstrap/extension/extensionSubscriptions";
import { VscodeGitHeadContentProvider } from "../../infrastructure/git/VscodeGitHeadContentProvider";

suite("Extension subscriptions", () => {
  test("creates diagnostics, hover, import, semantic diff, and viewer subscriptions", () => {
    const context = { subscriptions: [] } as vscode.ExtensionContext;
    const telemetry: TelemetryPort = {
      report() {},
      dispose() {},
    };
    const dependencies: ExtensionDependencies = {
      host: "desktop",
      telemetry,
      diagnoseAjsDefinition: () => [],
      buildUnitList: () => ({ errors: [] }),
      findParameterHover: () => undefined,
      semanticDiff: {
        buildSemanticDiffReportData: () => ({
          ok: true,
          result: {
            inputs: {
              before: { side: "before", unitIds: [], relations: [] },
              after: { side: "after", unitIds: [], relations: [] },
            },
            changes: [],
            identityDecisions: [],
            confirmationRequired: [],
            unsupportedItems: [],
            limitations: [],
          },
        }),
        beginSemanticDiffSourceCapture: (() => {
          throw new Error("not called");
        }) as ExtensionDependencies["semanticDiff"]["beginSemanticDiffSourceCapture"],
        sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
        sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
        actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
      },
      webApiImport: {
        importDefinition: async () => ({
          ok: false,
          error: {
            code: "network-failed",
            message: "not called",
            recoverable: true,
          },
        }),
      },
    };

    const subscriptions = createExtensionSubscriptions(context, dependencies);

    assert.strictEqual(subscriptions.length, 14);
    assert.strictEqual(new Set(subscriptions).size, subscriptions.length);
    assert.ok(
      subscriptions.some(
        (subscription) => subscription instanceof VscodeGitHeadContentProvider,
      ),
      "Git HEAD content provider is registered and owned by activation",
    );
    assert.deepStrictEqual(
      context.subscriptions,
      [],
      "activation remains the owner that adds registrations to the context",
    );
    subscriptions.forEach((subscription) => {
      assert.strictEqual(typeof subscription.dispose, "function");
      subscription.dispose();
    });
  });
});
