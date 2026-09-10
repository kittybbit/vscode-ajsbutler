import * as assert from "assert";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import { buildSemanticDiffPresentationArtifactsFromComparison } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";

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

suite("Semantic Diff presentation artifacts", () => {
  test("maps not-requested facts to unavailable impact", () => {
    const artifacts = buildSemanticDiffPresentationArtifactsFromComparison({
      result: result(),
      scheduleProjectionFacts: { kind: "not-requested" },
    });

    assert.deepStrictEqual(artifacts.scheduleImpact, {
      kind: "unavailable",
      reason: "not-requested",
    });
    assert.deepStrictEqual(Object.keys(artifacts.context), [
      "result",
      "summary",
    ]);
  });

  test("maps an evaluated facts snapshot to one available sidecar", () => {
    const contextResult = result();
    const artifacts = buildSemanticDiffPresentationArtifactsFromComparison({
      result: contextResult,
      scheduleProjectionFacts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: { rootProjections: [], statuses: [], issues: [] },
        after: { rootProjections: [], statuses: [], issues: [] },
        correspondence: [],
        candidateGroups: [],
      },
    });

    assert.strictEqual(artifacts.scheduleImpact.kind, "available");
    if (artifacts.scheduleImpact.kind !== "available") return;
    assert.deepStrictEqual(artifacts.scheduleImpact.sidecar.period, {
      from: "2026-04-01",
      to: "2026-05-01",
    });
    assert.strictEqual(artifacts.context.result, contextResult);
    assert.deepStrictEqual(artifacts.scheduleImpact.sidecar.timelineItems, []);
  });
});
