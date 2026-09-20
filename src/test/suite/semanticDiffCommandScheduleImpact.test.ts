import * as assert from "assert";
import * as vscode from "vscode";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import { createBeginSemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffPresentationArtifacts } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
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

const makeArtifacts = (): SemanticDiffPresentationArtifacts => ({
  context: { result: result(), summary: {} as never },
  scheduleImpact: { kind: "unavailable", reason: "not-requested" },
});

suite("Semantic Diff command calendar adapter", () => {
  test("invokes the adapter and schedule-aware opener once with one context", async () => {
    const beforeUri = vscode.Uri.parse("untitled:before-calendar.ajs");
    const afterUri = vscode.Uri.parse("untitled:after-calendar.ajs");
    const period = { from: "2026-04-01", to: "2026-05-01" };
    const observed: {
      inputs: unknown[];
      contexts: unknown[];
      legacyBuilds: number;
      events: string[];
    } = {
      inputs: [],
      contexts: [],
      legacyBuilds: 0,
      events: [],
    };
    const artifacts = makeArtifacts();
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
      showOpenDialog: async () => [beforeUri],
      readFile: async () =>
        new TextEncoder().encode("unit=before,,jp1admin,;{ty=g;}"),
      openTextDocument: async () =>
        ({
          uri: beforeUri,
          version: 1,
          getText: () => "unit=before,,jp1admin,;{ty=g;}",
        }) as unknown as vscode.TextDocument,
      showQuickPick: async () => undefined,
      showErrorMessage: async () => undefined,
      openReport: async () => undefined,
      buildSemanticDiffReportData: () => {
        observed.legacyBuilds += 1;
        throw new Error("legacy builder must not run");
      },
      buildSemanticDiffPresentationArtifacts: (input, scopedParser) => {
        observed.events.push("callback");
        observed.inputs.push(input);
        assert.ok(scopedParser);
        scopedParser.parse(input.beforeContent);
        scopedParser.parse(input.afterContent);
        return artifacts;
      },
      beginSemanticDiffSourceCapture: (input) => {
        observed.events.push("capture");
        return beginCapture(input);
      },
      openScheduleAwareExplorerSession: async (receivedArtifacts) => {
        observed.events.push("open");
        observed.contexts.push(receivedArtifacts.context);
        return handle;
      },
      registerSemanticDiffSourceCapture: (context, entry) => {
        observed.events.push("register");
        contextRegistry.registerSourceCapture(context, entry);
      },
      unregisterSemanticDiffSourceCapture: (context) =>
        contextRegistry.unregisterSourceCapture(context),
      scheduleComparisonPeriod: period,
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
    };

    const commandResult = await executeCompareSemanticDiffCommand(deps);
    assert.deepStrictEqual(commandResult, {
      ok: true,
      action: "explorer-opened",
      sessionId: "sde-session-1",
      source: "file",
      period: "evaluated",
    });
    assert.strictEqual(observed.inputs.length, 1);
    assert.strictEqual(
      (observed.inputs[0] as { options: { scheduleComparisonPeriod: unknown } })
        .options.scheduleComparisonPeriod,
      period,
    );
    assert.strictEqual(observed.contexts.length, 1);
    assert.strictEqual(observed.contexts[0], artifacts.context);
    assert.strictEqual(observed.legacyBuilds, 0);
    assert.deepStrictEqual(observed.events, [
      "capture",
      "callback",
      "register",
      "open",
    ]);
  });
});
