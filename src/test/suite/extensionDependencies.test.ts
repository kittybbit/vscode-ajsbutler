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

    const dependencies = createExtensionDependencies(context, "desktop");

    assert.strictEqual(dependencies.host, "desktop");
    assert.strictEqual(typeof dependencies.telemetry.report, "function");
    assert.strictEqual(typeof dependencies.diagnoseAjsDefinition, "function");
    assert.strictEqual(typeof dependencies.buildUnitList, "function");
    assert.strictEqual(typeof dependencies.findParameterHover, "function");
    assert.deepStrictEqual(dependencies.findParameterHover("ty", "en"), {
      symbol: "ty",
      syntax:
        "{g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|rp|qj|rq|jdj|rjdj|orj|rorj|evwj|revwj|flwj|rflwj|mlwj|rmlwj|mqwj|rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|rntwj|tmwj|rtmwj|evsj|revsj|mlsj|rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|cpj|rcpj|fxj|rfxj|htpj|rhtpj|nc}",
    });
    assert.strictEqual(
      dependencies.findParameterHover("not-a-param", "en"),
      undefined,
    );
    assert.strictEqual(
      typeof dependencies.semanticDiff.buildSemanticDiffReportData,
      "function",
    );
    assert.strictEqual(
      typeof dependencies.semanticDiff.readGitHeadDefinition,
      "function",
    );
    assert.strictEqual(
      typeof dependencies.webApiImport.importDefinition,
      "function",
    );

    dependencies.telemetry.dispose();
  });

  test("does not construct desktop-only import dependencies for web", () => {
    let desktopFactoryCalls = 0;
    const dependencies = createExtensionDependencies(
      {} as vscode.ExtensionContext,
      "web",
      {
        createDesktopWebApiImportCapability: () => {
          desktopFactoryCalls += 1;
          throw new Error("desktop capability must not be constructed");
        },
      },
    );

    assert.strictEqual(dependencies.host, "web");
    assert.strictEqual(desktopFactoryCalls, 0);
    assert.strictEqual(
      dependencies.webApiImport.unavailable?.error.code,
      "unsupported-host",
    );
    dependencies.telemetry.dispose();
  });

  test("keeps semantic diff allocators extension-lifetime and collision-free", () => {
    const dependencies = createExtensionDependencies(
      {} as vscode.ExtensionContext,
      "web",
    );

    const sourceHandles = [
      dependencies.semanticDiff.sourceHandleIdAllocator(),
      dependencies.semanticDiff.sourceHandleIdAllocator(),
    ];
    const sessions = [
      dependencies.semanticDiff.sessionIdAllocator(),
      dependencies.semanticDiff.sessionIdAllocator(),
    ];
    const actions = [
      dependencies.semanticDiff.actionIdAllocator(),
      dependencies.semanticDiff.actionIdAllocator(),
    ];

    assert.strictEqual(new Set(sourceHandles).size, sourceHandles.length);
    assert.strictEqual(new Set(sessions).size, sessions.length);
    assert.strictEqual(new Set(actions).size, actions.length);
    dependencies.telemetry.dispose();
  });
});
