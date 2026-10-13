import * as assert from "assert";
import * as vscode from "vscode";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import { createBeginSemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry";
import {
  executeCompareSemanticDiffCommand,
  type SemanticDiffCommandDeps,
} from "../../presentation/vscode/commands/semanticDiffCommand";

const result = (): SemanticDiffResult => ({
  inputs: {
    before: { side: "before", unitIds: [], relations: [] },
    after: { side: "after", unitIds: [], relations: [] },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
});

suite("Semantic Diff command report pipeline", () => {
  test("invokes the report builder and ordinary Explorer opener once with one context", async () => {
    const beforeUri = vscode.Uri.parse("untitled:before-definition.ajs");
    const afterUri = vscode.Uri.parse("untitled:after-definition.ajs");
    const observed: {
      inputs: unknown[];
      contexts: unknown[];
      sourceSelections: number;
      fileDialogs: number;
      events: string[];
    } = {
      inputs: [],
      contexts: [],
      sourceSelections: 0,
      fileDialogs: 0,
      events: [],
    };
    const context = buildSemanticDiffOutputContext(result());
    const parser = new AntlrAjsParser({
      sourceIndexIdAllocator: createSemanticDiffSourceIndexIdAllocator(),
    });
    const beginCapture = createBeginSemanticDiffSourceCapture(
      parser,
      createSemanticDiffCaptureScopeIdAllocator(),
    );
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    const handle = {
      sessionId: "sde-session-1" as never,
      panel: {} as vscode.WebviewPanel,
      dispose() {},
    };
    const deps: SemanticDiffCommandDeps = {
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 1,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
          },
        }) as unknown as vscode.TextEditor,
      showOpenDialog: async (options) => {
        observed.fileDialogs += 1;
        assert.strictEqual(options.canSelectFiles, true);
        assert.strictEqual(options.canSelectFolders, false);
        assert.strictEqual(options.canSelectMany, false);
        return [beforeUri];
      },
      readFile: async () =>
        new TextEncoder().encode("unit=before,,jp1admin,;{ty=g;}"),
      openTextDocument: async () =>
        ({
          uri: beforeUri,
          version: 1,
          getText: () => "unit=before,,jp1admin,;{ty=g;}",
        }) as unknown as vscode.TextDocument,
      showQuickPick: async (items) => {
        observed.sourceSelections += 1;
        const fileItem = items.find(
          (item) => (item as { workflowKind?: string }).workflowKind === "file",
        );
        assert.ok(fileItem);
        return fileItem;
      },
      showErrorMessage: async () => undefined,
      openReport: async () => undefined,
      buildSemanticDiffReportData: (input, scopedParser) => {
        observed.events.push("callback");
        observed.inputs.push(input);
        assert.ok(scopedParser);
        scopedParser.parse(input.beforeContent);
        scopedParser.parse(input.afterContent);
        return { ok: true, result: context.result };
      },
      buildSemanticDiffOutputContext: () => context,
      beginSemanticDiffSourceCapture: (input) => {
        observed.events.push("capture");
        return beginCapture(input);
      },
      openExplorer: async (receivedContext) => {
        observed.events.push("open");
        observed.contexts.push(receivedContext);
        return handle;
      },
      registerSemanticDiffSourceCapture: (context, entry) => {
        observed.events.push("register");
        contextRegistry.registerSourceCapture(context, entry);
      },
      unregisterSemanticDiffSourceCapture: (context) =>
        contextRegistry.unregisterSourceCapture(context),
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
    };

    const commandResult = await executeCompareSemanticDiffCommand(deps);
    assert.deepStrictEqual(commandResult, {
      ok: true,
      action: "explorer-opened",
      sessionId: "sde-session-1",
      source: "file",
    });
    assert.strictEqual(observed.inputs.length, 1);
    assert.strictEqual(observed.contexts.length, 1);
    assert.strictEqual(observed.contexts[0], context);
    assert.strictEqual(observed.sourceSelections, 1);
    assert.strictEqual(observed.fileDialogs, 1);
    assert.deepStrictEqual(observed.events, [
      "capture",
      "callback",
      "register",
      "open",
    ]);
  });
});
