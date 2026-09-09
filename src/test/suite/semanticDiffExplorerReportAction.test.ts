import * as assert from "assert";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { executeSemanticDiffExplorerReportAction } from "../../presentation/vscode/semantic-diff/report/semanticDiffExplorerReportAction";

const emptyResult = (): SemanticDiffResult => ({
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

suite("Semantic diff Explorer report action", () => {
  test("presents all four modes with the same context", async () => {
    const context = buildSemanticDiffOutputContext(emptyResult());
    const presented: unknown[] = [];
    const opened: string[] = [];
    for (const mode of ["summary", "full", "audit", "json"] as const) {
      const result = await executeSemanticDiffExplorerReportAction(context, {
        showQuickPick: async (items) =>
          items.find((item) => item.mode === mode),
        presentOutput: (receivedContext, receivedMode) => {
          presented.push(receivedContext);
          return {
            mode: receivedMode,
            languageId: receivedMode === "json" ? "json" : "markdown",
            extension: receivedMode === "json" ? ".json" : ".md",
            mediaType:
              receivedMode === "json"
                ? "application/json; charset=utf-8"
                : "text/markdown; charset=utf-8",
            content: receivedMode,
          };
        },
        openReport: async (document) => {
          opened.push(document.content);
        },
      });
      assert.strictEqual(result.ok, true);
      if (result.ok) assert.strictEqual(result.mode, mode);
    }
    assert.deepStrictEqual(presented, [context, context, context, context]);
    assert.deepStrictEqual(opened, ["summary", "full", "audit", "json"]);
  });

  test("does not open or copy when the common picker is cancelled", async () => {
    const context = buildSemanticDiffOutputContext(emptyResult());
    let opened = false;
    const result = await executeSemanticDiffExplorerReportAction(context, {
      showQuickPick: async () => undefined,
      openReport: async () => {
        opened = true;
      },
    });
    assert.deepStrictEqual(result, { ok: false, code: "cancelled" });
    assert.strictEqual(opened, false);
  });
});
