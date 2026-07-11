import * as assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";
import { renderSemanticDiffMarkdown } from "../../application/semantic-diff/renderSemanticDiffMarkdown";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";

const readSample = (name: string): string =>
  readFileSync(join(__dirname, "../../..", "sample", name), "utf8");

suite("Semantic diff sample coverage", () => {
  test("sample definitions cover implemented semantic diff evaluation categories", () => {
    const parser = new AntlrAjsParser();
    const beforeParse = parser.parse(readSample("semantic_diff_before_utf8"));
    const afterParse = parser.parse(readSample("semantic_diff_after_utf8"));

    assert.deepStrictEqual(beforeParse.errors, []);
    assert.deepStrictEqual(afterParse.errors, []);

    const result = compareSemanticDiff({
      before: normalizeAjsDocument(beforeParse.rootUnits),
      after: normalizeAjsDocument(afterParse.rootUnits),
      options: {
        jobGroupPath: "/semantic_diff_sample",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });
    const report = renderSemanticDiffMarkdown(result);
    const japaneseReport = renderSemanticDiffMarkdown(result, "ja-JP");

    assert.ok(report.includes("# Semantic Diff Report"));
    assert.ok(japaneseReport.includes("# 意味差分レポート"));
    assert.ok(japaneseReport.includes("## スケジュール変更"));
    assert.ok(result.changes.some((change) => change.kind === "added"));
    assert.ok(result.changes.some((change) => change.kind === "removed"));
    assert.ok(result.changes.some((change) => change.kind === "renamed"));
    assert.ok(
      result.changes.some(
        (change) =>
          change.confirmationLevel === "candidate" &&
          change.rationale?.includes("identity fingerprint matched"),
      ),
    );
    assert.ok(
      result.changes.some((change) => change.elementKind === "relation"),
    );

    assert.deepStrictEqual(
      [
        ...new Set(
          result.changes
            .map((change) => change.attributeCategory)
            .filter((category): category is NonNullable<typeof category> =>
              Boolean(category),
            ),
        ),
      ].sort(),
      [
        "abnormal-end-control",
        "end-control",
        "execution-definition",
        "execution-environment",
        "external-integration",
        "schedule",
        "start-condition",
        "wait-condition",
      ],
    );

    assert.ok(
      result.confirmationRequired.some((item) =>
        item.changeContent.includes("conditional relation removed"),
      ),
    );
    assert.ok(
      result.confirmationRequired.some((item) =>
        item.changeContent.includes("explicit timeout etm removed"),
      ),
    );
    assert.ok(
      result.confirmationRequired.some((item) =>
        item.changeContent.includes("wait release source changed"),
      ),
    );
    assert.ok(
      result.confirmationRequired.some((item) =>
        item.changeContent.includes("wait target evwid changed"),
      ),
    );
    assert.ok(
      result.confirmationRequired.some((item) =>
        item.changeContent.includes("wait target flwf changed"),
      ),
    );
    assert.ok(
      result.unsupportedItems.some((item) => item.kind === "uninterpretable"),
    );

    assert.ok(
      result.scheduleComparison?.runChanges.some(
        (change) => change.kind === "changed-time",
      ),
    );
    assert.ok(
      result.confirmationRequired.some((item) =>
        item.changeContent.includes(
          "has no calculated runs in the schedule comparison period",
        ),
      ),
    );
    assert.ok(
      result.unsupportedItems.some((item) => item.kind === "uncalculated"),
    );
    assert.ok(report.includes("## Schedule Changes"));
    assert.ok(report.includes("## Unsupported Items"));
  });
});
