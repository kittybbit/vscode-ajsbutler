import * as assert from "assert";
import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChangeSet,
  SemanticDiffTarget,
  SemanticDiffIdentityDecision,
  SemanticDiffUnitReference,
} from "../../application/semantic-diff/semanticDiffDto";
import { renderSemanticDiffMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffMarkdown";

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

const unitReference = (item: AjsUnit): SemanticDiffUnitReference => ({
  id: item.id,
  name: item.name,
  absolutePath: item.absolutePath,
  unitType: item.unitType,
});

const exactIdentityDecision = (
  id: string,
  before: AjsUnit,
  after: AjsUnit,
): SemanticDiffIdentityDecision => ({
  id,
  status: "exact",
  rule: "exact-key",
  before: [unitReference(before)],
  after: [unitReference(after)],
  evidence: {
    kind: "exact-key",
    key: {
      kind: "unit",
      parentJobnetPath: "/root/jobnet",
      unitName: before.name,
      unitType: before.unitType,
    },
  },
});

const changeSet = (
  overrides: Partial<SemanticDiffChangeSet> = {},
): SemanticDiffChangeSet => ({
  inputs: {
    before: {
      side: "before",
      jobGroupPath: "/root",
      unitIds: [],
      relations: [],
    },
    after: {
      side: "after",
      jobGroupPath: "/root",
      unitIds: [],
      relations: [],
    },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
  reportSections: [],
  ...overrides,
});

suite("Render Semantic Diff Markdown", () => {
  test("renders deterministic no-change report", () => {
    const input = changeSet();
    const result = renderSemanticDiffMarkdown(input);

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

    const japanese = renderSemanticDiffMarkdown(input, "ja");
    assert.strictEqual(
      japanese,
      `# 意味差分レポート

## 概要

- 変更前スコープ: /root
- 変更後スコープ: /root
- 意味上の変更: 0件
- 確認が必要な項目: 0件
- 未対応項目: 0件
- 制限事項: 0件
- 結果: 意味上の変更は検出されませんでした。

## 構造変更

- なし

## 属性変更

- なし

## 確認が必要

- なし

## 未対応項目

- なし

## 制限事項

- なし`,
    );
    assert.strictEqual(renderSemanticDiffMarkdown(input, "ja-JP"), japanese);
    assert.strictEqual(renderSemanticDiffMarkdown(input, "fr"), result);
  });

  test("renders Japanese headings for ja and regional Japanese language tags", () => {
    const japanese = renderSemanticDiffMarkdown(changeSet(), "ja");
    const regionalJapanese = renderSemanticDiffMarkdown(changeSet(), "ja-JP");
    const fallback = renderSemanticDiffMarkdown(changeSet(), "fr");

    assert.ok(japanese.includes("# 意味差分レポート"));
    assert.ok(regionalJapanese.includes("## 構造変更"));
    assert.ok(fallback.includes("# Semantic Diff Report"));
  });

  test("keeps no-change output when only an exact identity decision exists", () => {
    const unchanged = unit({
      name: "unchanged",
      absolutePath: "/root/jobnet/unchanged",
    });
    const report = renderSemanticDiffMarkdown(
      changeSet({
        identityDecisions: [
          exactIdentityDecision(
            "identity:test:unchanged",
            unchanged,
            unchanged,
          ),
        ],
      }),
    );

    assert.ok(report.includes("- Result: no semantic changes detected."));
    assert.strictEqual(report.includes("Identity evidence"), false);
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
            identityDecisionId: "identity:test:attribute",
            after: {
              kind: "attribute",
              unit: unitReference(job),
              parameterKey: "eu",
              category: "execution-environment",
              values: ["jp1admin"],
            },
            attributeCategory: "execution-environment",
            summary: "LOAD eu changed",
            rationale: "exact identity match",
          },
        ],
        identityDecisions: [
          exactIdentityDecision("identity:test:attribute", job, job),
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
    assert.ok(result.includes("根拠: 完全一致キー"));
    assert.ok(result.includes("ルール: 完全一致キー (exact-key)"));
    assert.ok(result.includes("キー: unit; parentJobnetPath=/root/jobnet"));
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
    const afterCandidateOne = unit({
      id: "/root/jobnet/job-y",
      name: "job-y",
      absolutePath: "/root/jobnet/job-y",
    });
    const afterCandidateTwo = unit({
      id: "/root/jobnet/job-z",
      name: "job-z",
      absolutePath: "/root/jobnet/job-z",
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
    const afterAttribute: SemanticDiffTarget = {
      kind: "attribute",
      unit: unitReference(afterJob),
      parameterKey: "eu",
      category: "execution-environment",
      values: ["user-after"],
    };

    const input = changeSet({
      changes: [
        {
          id: "unit:renamed:/root/jobnet/job-a:/root/jobnet/job-b",
          kind: "renamed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:renamed",
          before: { kind: "unit", unit: unitReference(beforeJob) },
          after: { kind: "unit", unit: unitReference(afterJob) },
          summary: "job-a renamed to job-b",
          rationale: "one-to-one identity fingerprint match",
        },
        {
          id: "unit:changed:/root/jobnet/job-x:",
          kind: "changed",
          elementKind: "unit",
          confirmationLevel: "candidate",
          identityDecisionId: "identity:test:candidate",
          before: { kind: "unit", unit: unitReference(beforeCandidate) },
          summary: "job-x has ambiguous rename or move candidates",
          rationale: "identity fingerprint matched 2 before and 2 after units",
        },
        {
          id: "attribute:eu:/root/jobnet/job-a:/root/jobnet/job-b",
          kind: "changed",
          elementKind: "attribute",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:attribute-2",
          before: {
            kind: "attribute",
            unit: unitReference(beforeJob),
            parameterKey: "eu",
            category: "execution-environment",
            values: ["user-before"],
          },
          after: afterAttribute,
          attributeCategory: "execution-environment",
          summary: "job-a eu changed",
          rationale: "exact identity match",
        },
      ],
      identityDecisions: [
        {
          id: "identity:test:renamed",
          status: "fingerprint-confirmed",
          rule: "one-to-one-fingerprint",
          before: [unitReference(beforeJob)],
          after: [unitReference(afterJob)],
          evidence: {
            kind: "fingerprint",
            strategyId: "command-text-v1",
            unitType: "j",
            fields: [{ key: "te", presence: "present", values: ["echo ok"] }],
          },
        },
        {
          id: "identity:test:candidate",
          status: "candidate",
          rule: "ambiguous-fingerprint",
          before: [unitReference(beforeCandidate)],
          after: [
            unitReference(afterCandidateOne),
            unitReference(afterCandidateTwo),
          ],
          evidence: {
            kind: "fingerprint",
            strategyId: "legacy-all-parameters-v1",
            unitType: "j",
            fields: [
              {
                key: "parameters",
                presence: "present",
                values: ["te=echo * | [x]"],
              },
            ],
          },
        },
        exactIdentityDecision("identity:test:attribute-2", beforeJob, afterJob),
      ],
      confirmationRequired: [
        {
          id: "confirm:start:/root/jobnet/job-b",
          target: { kind: "unit", unit: unitReference(afterJob) },
          changeContent: "start condition changed",
          rationale: "previous branch path may no longer be available",
          relatedTargets: [{ kind: "unit", unit: unitReference(afterTail) }],
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
    });
    const result = renderSemanticDiffMarkdown(input);

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
  - Rationale: ambiguous fingerprint candidates
  - Rule: ambiguous fingerprint candidates (ambiguous-fingerprint)
  - Strategy: legacy all parameters (legacy-all-parameters-v1)
  - Unit type: j
  - Fields:
    - parameters (present): te=echo \\* \\| \\[x\\]
  - Candidates:
    - Before: job-x (j) /root/jobnet/job-x [/root/jobnet/job-x]
    - After: job-y (j) /root/jobnet/job-y [/root/jobnet/job-y]
    - After: job-z (j) /root/jobnet/job-z [/root/jobnet/job-z]
- [confirmed] renamed unit: job-a renamed to job-b
  - Before: unit /root/jobnet/job-a
  - After: unit /root/jobnet/job-b
  - Rationale: one-to-one fingerprint match
  - Rule: one-to-one fingerprint match (one-to-one-fingerprint)
  - Strategy: command text (command-text-v1)
  - Unit type: j
  - Fields:
    - te (present): echo ok

## Attribute Changes

### Execution Environment

- [confirmed] changed attribute: job-a eu changed
  - Before: attribute eu on /root/jobnet/job-a
  - After: attribute eu on /root/jobnet/job-b
  - Rationale: exact identity key
  - Rule: exact identity key (exact-key)
  - Key: unit; parentJobnetPath=/root/jobnet; unitName=job-a; unitType=j

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
    assert.strictEqual(renderSemanticDiffMarkdown(input, "fr"), result);
    assert.strictEqual(
      renderSemanticDiffMarkdown(input, "ja-JP"),
      renderSemanticDiffMarkdown(input, "ja"),
    );
    const japanese = renderSemanticDiffMarkdown(input, "ja");
    assert.ok(japanese.includes("## 構造変更"));
    assert.ok(japanese.includes("## 確認が必要"));
    assert.ok(japanese.includes("### 実行環境"));
    assert.ok(japanese.includes("relation target was not found"));
  });

  test("renders added and removed typed evidence, candidates, and missing references safely", () => {
    const removedUnit = unit({
      id: "/root/jobnet/removed",
      name: "removed",
      absolutePath: "/root/jobnet/removed",
      unitType: "evwj",
    });
    const addedUnit = unit({
      id: "/root/jobnet/added",
      name: "added",
      absolutePath: "/root/jobnet/added",
      unitType: "flwj",
    });
    const missingUnit = unit({
      id: "/root/jobnet/missing",
      name: "missing",
      absolutePath: "/root/jobnet/missing",
    });
    const input = changeSet({
      changes: [
        {
          id: "unit:removed:/root/jobnet/removed:",
          kind: "removed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:removed",
          before: { kind: "unit", unit: unitReference(removedUnit) },
          summary: "removed removed",
          rationale: "this stale rationale must not be rendered",
        },
        {
          id: "unit:added::/root/jobnet/added",
          kind: "added",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:added",
          after: { kind: "unit", unit: unitReference(addedUnit) },
          summary: "added added",
        },
        {
          id: "unit:changed:/root/jobnet/missing:",
          kind: "changed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:missing",
          before: { kind: "unit", unit: unitReference(missingUnit) },
          summary: "missing changed",
          rationale: "missing typed evidence",
        },
      ],
      identityDecisions: [
        {
          id: "identity:test:removed",
          status: "removed",
          rule: "unmatched-before",
          before: [unitReference(removedUnit)],
          after: [],
          evidence: {
            kind: "fingerprint",
            strategyId: "event-reception-v1",
            unitType: "evwj",
            fields: [
              {
                key: "evwid",
                presence: "present",
                values: ["event|*`[1]"],
              },
            ],
          },
        },
        {
          id: "identity:test:added",
          status: "added",
          rule: "unmatched-after",
          before: [],
          after: [unitReference(addedUnit)],
          evidence: {
            kind: "fingerprint",
            strategyId: "file-monitor-v1",
            unitType: "flwj",
            fields: [
              {
                key: "flwf",
                presence: "present",
                values: ['"/tmp/[file].dat"'],
              },
              { key: "flwc", presence: "absent", values: [] },
            ],
          },
        },
      ],
    });

    const report = renderSemanticDiffMarkdown(input);
    assert.ok(
      report.includes("Rule: unmatched before unit (unmatched-before)"),
    );
    assert.ok(
      report.includes("Strategy: event reception (event-reception-v1)"),
    );
    assert.ok(report.includes("event\\|\\*\\`\\[1\\]"));
    assert.ok(report.includes("Rule: unmatched after unit (unmatched-after)"));
    assert.ok(report.includes("Strategy: file monitoring (file-monitor-v1)"));
    assert.ok(report.includes('flwf (present): "/tmp/\\[file\\].dat"'));
    assert.ok(report.includes("flwc (absent): (none)"));
    assert.ok(report.includes("missing changed"));
    assert.strictEqual(report.includes("missing typed evidence"), false);

    const japanese = renderSemanticDiffMarkdown(input, "ja-JP");
    assert.ok(
      japanese.includes("ルール: 変更前の未対応ユニット (unmatched-before)"),
    );
    assert.ok(japanese.includes("イベント受信 (event-reception-v1)"));
    assert.ok(japanese.includes("/root/jobnet/removed"));
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
