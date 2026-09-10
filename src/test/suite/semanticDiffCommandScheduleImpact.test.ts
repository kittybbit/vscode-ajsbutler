import * as assert from "assert";
import * as vscode from "vscode";
import { createSemanticDiffSourceHandleIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import type { SemanticDiffPresentationArtifacts } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
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
    } = {
      inputs: [],
      contexts: [],
      legacyBuilds: 0,
    };
    const artifacts = makeArtifacts();
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
            getText: () => "after",
          },
        }) as unknown as vscode.TextEditor,
      showOpenDialog: async () => [beforeUri],
      readFile: async () => new TextEncoder().encode("before"),
      showQuickPick: async () => undefined,
      showErrorMessage: async () => undefined,
      openReport: async () => undefined,
      buildSemanticDiffReportData: () => {
        observed.legacyBuilds += 1;
        throw new Error("legacy builder must not run");
      },
      buildSemanticDiffPresentationArtifacts: (input) => {
        observed.inputs.push(input);
        return artifacts;
      },
      openScheduleAwareExplorerSession: async (receivedArtifacts) => {
        observed.contexts.push(receivedArtifacts.context);
        return handle;
      },
      scheduleComparisonPeriod: period,
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
    };

    const commandResult = await executeCompareSemanticDiffCommand(deps);
    assert.deepStrictEqual(commandResult, {
      ok: true,
      action: "explorer-opened",
      sessionId: "sde-session-1",
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
  });
});
