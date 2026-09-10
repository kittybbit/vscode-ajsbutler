import * as assert from "assert";
import {
  createBuildSemanticDiffPresentationArtifacts,
  type BuildSemanticDiffPresentationArtifactsFromComparisonInput,
} from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";

const document = (): AjsDocument => ({ rootUnits: [], warnings: [] });
const parser = () => ({
  parse: () => ({ ok: true as const, document: document() }),
});
const context = { result: {} as never, summary: {} as never };

suite("Semantic Diff presentation artifacts adapter", () => {
  test("parses each side once and omits options without a period", () => {
    const calls: string[] = [];
    const compareInputs: unknown[] = [];
    const adapter = createBuildSemanticDiffPresentationArtifacts(
      {
        parse: (content) => {
          calls.push(content);
          return { ok: true, document: document() };
        },
      },
      (input) => {
        compareInputs.push(input);
        return {
          result: {} as never,
          scheduleProjectionFacts: { kind: "not-requested" },
        };
      },
      (input: BuildSemanticDiffPresentationArtifactsFromComparisonInput) =>
        ({
          context,
          scheduleImpact: input.scheduleProjectionFacts,
        }) as never,
    );

    const result = adapter({ beforeContent: "before", afterContent: "after" });
    assert.deepStrictEqual(calls, ["before", "after"]);
    assert.deepStrictEqual(compareInputs, [
      { before: document(), after: document() },
    ]);
    assert.strictEqual("options" in (compareInputs[0] as object), false);
    assert.strictEqual("ok" in result, false);
  });

  test("forwards selected period by object identity", () => {
    const period = { from: "2026-04-01", to: "2026-05-01" };
    let comparison: {
      options?: { scheduleComparisonPeriod?: object };
    } = {};
    const adapter = createBuildSemanticDiffPresentationArtifacts(
      parser(),
      (input) => {
        comparison = input;
        return {
          result: {} as never,
          scheduleProjectionFacts: { kind: "not-requested" },
        };
      },
      () => ({
        context,
        scheduleImpact: { kind: "unavailable", reason: "not-requested" },
      }),
    );
    adapter({
      beforeContent: "before",
      afterContent: "after",
      options: { scheduleComparisonPeriod: period },
    });
    assert.ok(comparison.options);
    assert.strictEqual(comparison.options.scheduleComparisonPeriod, period);
    assert.deepStrictEqual(Object.keys(comparison.options), [
      "scheduleComparisonPeriod",
    ]);
  });

  test("preserves parser errors by source side", () => {
    const calls: string[] = [];
    const adapter = createBuildSemanticDiffPresentationArtifacts({
      parse: (content) => {
        calls.push(content);
        return content === "before"
          ? {
              ok: false as const,
              errors: [{ line: 1, column: 2, message: "before error" }],
            }
          : { ok: true as const, document: document() };
      },
    });
    const result = adapter({ beforeContent: "before", afterContent: "after" });
    assert.deepStrictEqual(calls, ["before", "after"]);
    assert.deepStrictEqual(result, {
      ok: false,
      errors: {
        before: [{ line: 1, column: 2, message: "before error" }],
        after: [],
      },
    });
  });
});
