import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChangeSet,
  SemanticDiffTarget,
} from "../../domain/models/semantic-diff/SemanticDiff";
import { renderSemanticDiffMarkdown } from "../../application/semantic-diff/renderSemanticDiffMarkdown";

const params = (values: Record<string, string>): AjsParameter[] =>
  Object.entries(values).map(([key, value]) => ({ key, value }));

const unit = (overrides: Partial<AjsUnit>): AjsUnit => ({
  id: overrides.absolutePath ?? "/root/jobnet/job",
  name: "job",
  unitAttribute: "job,,jp1admin,",
  unitType: "j",
  absolutePath: "/root/jobnet/job",
  depth: 2,
  parentId: "/root/jobnet",
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: params({ ty: "j", sc: "echo ok" }),
  relations: [],
  children: [],
  ...overrides,
});

const document = (): AjsDocument => ({
  rootUnits: [],
  warnings: [],
});

const changeSet = (
  overrides: Partial<SemanticDiffChangeSet> = {},
): SemanticDiffChangeSet => ({
  inputs: {
    before: { side: "before", document: document(), jobGroupPath: "/root" },
    after: { side: "after", document: document(), jobGroupPath: "/root" },
  },
  changes: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
  reportSections: [],
  ...overrides,
});

suite("Render Semantic Diff Markdown", () => {
  test("renders deterministic no-change report", () => {
    const result = renderSemanticDiffMarkdown(changeSet());

    assert.strictEqual(
      result,
      `# Semantic Diff Report

## Summary

- Before scope: /root
- After scope: /root
- 0 semantic changes
- 0 confirmation-required items
- 0 unsupported items
- 0 limitations
- Result: no semantic changes detected.

## Structural Changes

- None

## Attribute Changes

- None

## Confirmation Required

- None

## Unsupported Items

- None

## Limitations

- None`,
    );
  });

  test("renders Japanese headings for ja and regional Japanese language tags", () => {
    const japanese = renderSemanticDiffMarkdown(changeSet(), "ja");
    const regionalJapanese = renderSemanticDiffMarkdown(changeSet(), "ja-JP");
    const fallback = renderSemanticDiffMarkdown(changeSet(), "fr");

    assert.ok(japanese.includes("# 意味差分レポート"));
    assert.ok(regionalJapanese.includes("## 構造変更"));
    assert.ok(fallback.includes("# Semantic Diff Report"));
  });

  test("localizes generated wording while preserving raw JP1/AJS values and parser messages", () => {
    const job = unit({
      name: "LOAD",
      absolutePath: "/root/jobnet/LOAD",
    });
    const rawMessage = "relation target was not found";
    const result = renderSemanticDiffMarkdown(
      changeSet({
        changes: [
          {
            id: "attribute:eu:/root/jobnet/LOAD",
            kind: "changed",
            elementKind: "attribute",
            confirmationLevel: "confirmed",
            after: {
              kind: "attribute",
              unit: job,
              parameterKey: "eu",
              category: "execution-environment",
            },
            attributeCategory: "execution-environment",
            summary: "LOAD eu changed",
            rationale: "exact identity match",
          },
        ],
        limitations: [
          {
            code: "missing_relation_target",
            kind: "normalization",
            message: rawMessage,
          },
        ],
      }),
      "ja-JP",
    );

    assert.ok(result.includes("### 実行環境"));
    assert.ok(result.includes("LOAD の eu を変更"));
    assert.ok(result.includes("完全一致の識別子により対応付けました"));
    assert.ok(result.includes("/root/jobnet/LOAD"));
    assert.ok(result.includes(rawMessage));
  });

  test("renders structural changes, rationale, constraints, and limitations", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job-a",
      name: "job-a",
      absolutePath: "/root/jobnet/job-a",
    });
    const afterJob = unit({
      id: "/root/jobnet/job-b",
      name: "job-b",
      absolutePath: "/root/jobnet/job-b",
    });
    const afterTail = unit({
      id: "/root/jobnet/tail",
      name: "tail",
      absolutePath: "/root/jobnet/tail",
    });
    const beforeCandidate = unit({
      id: "/root/jobnet/job-x",
      name: "job-x",
      absolutePath: "/root/jobnet/job-x",
    });
    const afterCandidate = unit({
      id: "/root/jobnet/job-y",
      name: "job-y",
      absolutePath: "/root/jobnet/job-y",
    });
    const afterAttribute: SemanticDiffTarget = {
      kind: "attribute",
      unit: afterJob,
      parameterKey: "eu",
      category: "execution-environment",
    };

    const result = renderSemanticDiffMarkdown(
      changeSet({
        changes: [
          {
            id: "unit:renamed:/root/jobnet/job-a:/root/jobnet/job-b",
            kind: "renamed",
            elementKind: "unit",
            confirmationLevel: "confirmed",
            before: { kind: "unit", unit: beforeJob },
            after: { kind: "unit", unit: afterJob },
            summary: "job-a renamed to job-b",
            rationale: "one-to-one identity fingerprint match",
          },
          {
            id: "unit:changed:/root/jobnet/job-x:/root/jobnet/job-y",
            kind: "changed",
            elementKind: "unit",
            confirmationLevel: "candidate",
            before: { kind: "unit", unit: beforeCandidate },
            after: { kind: "unit", unit: afterCandidate },
            summary: "job-x has ambiguous rename or move candidates",
            rationale:
              "identity fingerprint matched 2 before and 2 after units",
          },
          {
            id: "attribute:eu:/root/jobnet/job-a:/root/jobnet/job-b",
            kind: "changed",
            elementKind: "attribute",
            confirmationLevel: "confirmed",
            before: {
              kind: "attribute",
              unit: beforeJob,
              parameterKey: "eu",
              category: "execution-environment",
            },
            after: afterAttribute,
            attributeCategory: "execution-environment",
            summary: "job-a eu changed",
            rationale: "exact identity match",
          },
        ],
        confirmationRequired: [
          {
            id: "confirm:start:/root/jobnet/job-b",
            target: { kind: "unit", unit: afterJob },
            changeContent: "start condition changed",
            rationale: "previous branch path may no longer be available",
            relatedTargets: [{ kind: "unit", unit: afterTail }],
            constraints: ["runtime history is not verified"],
          },
        ],
        unsupportedItems: [
          {
            id: "unsupported:condition:/root/jobnet/job-b",
            kind: "uninterpretable",
            side: "after",
            target: afterAttribute,
            message: "condition expression is not supported",
          },
        ],
        limitations: [
          {
            code: "missing_relation_target",
            kind: "normalization",
            side: "before",
            message: "relation target was not found",
            unitPath: "/root/jobnet/job-a",
          },
        ],
      }),
    );

    assert.strictEqual(
      result,
      `# Semantic Diff Report

## Summary

- Before scope: /root
- After scope: /root
- 3 semantic changes
- 1 confirmation-required item
- 1 unsupported item
- 1 limitation
- Result: semantic differences or review notes are present.

## Structural Changes

- [candidate] changed unit: job-x has ambiguous rename or move candidates
  - Before: unit /root/jobnet/job-x
  - After: unit /root/jobnet/job-y
  - Rationale: identity fingerprint matched 2 before and 2 after units
- [confirmed] renamed unit: job-a renamed to job-b
  - Before: unit /root/jobnet/job-a
  - After: unit /root/jobnet/job-b
  - Rationale: one-to-one identity fingerprint match

## Attribute Changes

### Execution Environment

- [confirmed] changed attribute: job-a eu changed
  - Before: attribute eu on /root/jobnet/job-a
  - After: attribute eu on /root/jobnet/job-b
  - Rationale: exact identity match

## Confirmation Required

- start condition changed
  - Target: unit /root/jobnet/job-b
  - Rationale: previous branch path may no longer be available
  - Related: unit /root/jobnet/tail
  - Constraint: runtime history is not verified

## Unsupported Items

- [uninterpretable] after: condition expression is not supported
  - Target: attribute eu on /root/jobnet/job-b

## Limitations

- [normalization:missing_relation_target] before /root/jobnet/job-a relation target was not found`,
    );
  });

  test("renders schedule comparison period and run changes when present", () => {
    const result = renderSemanticDiffMarkdown(
      changeSet({
        scheduleComparison: {
          period: {
            from: "2026-04-01",
            to: "2026-05-01",
          },
          runChanges: [
            {
              id: "schedule:changed-time:/root/jobnet:2026-04-10",
              kind: "changed-time",
              unitPath: "/root/jobnet",
              date: "2026-04-10",
              before: {
                unitPath: "/root/jobnet",
                unitName: "jobnet",
                rule: 1,
                date: "2026-04-10",
                time: "09:00",
              },
              after: {
                unitPath: "/root/jobnet",
                unitName: "jobnet",
                rule: 1,
                date: "2026-04-10",
                time: "10:00",
              },
              summary:
                "/root/jobnet run on 2026-04-10 changed from 09:00 to 10:00",
            },
          ],
        },
      }),
    );

    assert.ok(
      result.includes(
        "- Schedule comparison period: 2026-04-01 to 2026-05-01 (exclusive)",
      ),
    );
    assert.ok(result.includes("- 1 schedule run change"));
    assert.ok(result.includes("## Schedule Changes"));
    assert.ok(
      result.includes(
        "- [changed-time] /root/jobnet run on 2026-04-10 changed from 09:00 to 10:00",
      ),
    );
  });
});
