import * as assert from "assert";
import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChange,
  SemanticDiffResult,
  SemanticDiffTarget,
  SemanticDiffIdentityDecision,
  SemanticDiffUnitReference,
} from "../../application/semantic-diff/semanticDiffDto";
import { renderSemanticDiffMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffMarkdown";
import { localizedChangeSummary } from "../../presentation/semantic-diff/semanticDiffMarkdownLocalization";

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

const buildResult = (
  overrides: Partial<SemanticDiffResult> = {},
): SemanticDiffResult => ({
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
  ...overrides,
});

suite("Render Semantic Diff Markdown", () => {
  test("renders deterministic no-change report", () => {
    const input = buildResult();
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
    const japanese = renderSemanticDiffMarkdown(buildResult(), "ja");
    const regionalJapanese = renderSemanticDiffMarkdown(buildResult(), "ja-JP");
    const fallback = renderSemanticDiffMarkdown(buildResult(), "fr");

    assert.ok(japanese.includes("# 意味差分レポート"));
    assert.ok(regionalJapanese.includes("## 構造変更"));
    assert.ok(fallback.includes("# Semantic Diff Report"));
  });

  test("keeps attribute summary precedence language-specific for renamed units", () => {
    const before = unit({
      name: "before-name",
      absolutePath: "/root/jobnet/before-name",
    });
    const after = unit({
      name: "after-name",
      absolutePath: "/root/jobnet/after-name",
    });
    const [change] = buildResult({
      changes: [
        {
          id: "attribute:eu:before:after",
          kind: "changed",
          elementKind: "attribute",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:renamed-attribute",
          before: {
            kind: "attribute",
            unit: unitReference(before),
            parameterKey: "eu",
            category: "execution-environment",
            values: ["before"],
          },
          after: {
            kind: "attribute",
            unit: unitReference(after),
            parameterKey: "eu",
            category: "execution-environment",
            values: ["after"],
          },
          attributeCategory: "execution-environment",
          relationPair: null,
        },
      ],
    }).changes as [SemanticDiffChange];

    assert.strictEqual(
      localizedChangeSummary(change),
      "before-name eu changed",
    );
    assert.strictEqual(
      localizedChangeSummary(change, "ja-JP"),
      "after-name の eu を変更",
    );
    assert.ok(
      renderSemanticDiffMarkdown(
        buildResult({ changes: [change] }),
        "ja-JP",
      ).includes("after-name の eu を変更"),
    );
  });

  test("derives English move wording from before and after references", () => {
    const before = unit({
      name: "moved-job",
      absolutePath: "/root/before-jobnet/moved-job",
    });
    const after = unit({
      name: "moved-job",
      absolutePath: "/root/after-jobnet/moved-job",
    });
    const change: SemanticDiffChange = {
      id: "unit:moved:before:after",
      kind: "moved",
      elementKind: "unit",
      confirmationLevel: "confirmed",
      identityDecisionId: "identity:moved",
      before: { kind: "unit", unit: unitReference(before) },
      after: { kind: "unit", unit: unitReference(after) },
      relationPair: null,
    };

    assert.strictEqual(
      localizedChangeSummary(change),
      "moved-job moved from /root/before-jobnet to /root/after-jobnet",
    );
    assert.strictEqual(
      localizedChangeSummary(change, "ja"),
      "moved-job を移動",
    );
    assert.ok(
      renderSemanticDiffMarkdown(buildResult({ changes: [change] })).includes(
        "moved-job moved from /root/before-jobnet to /root/after-jobnet",
      ),
    );
  });

  test("keeps jobnet names in renamed, moved, added, and removed summaries", () => {
    const beforeRenamed = unit({
      name: "before-jobnet",
      unitType: "n",
      absolutePath: "/root/before-jobnet",
    });
    const afterRenamed = unit({
      name: "after-jobnet",
      unitType: "n",
      absolutePath: "/root/after-jobnet",
    });
    const beforeMoved = unit({
      name: "moved-jobnet",
      unitType: "n",
      absolutePath: "/root/before-parent/moved-jobnet",
    });
    const afterMoved = unit({
      name: "moved-jobnet",
      unitType: "n",
      absolutePath: "/root/after-parent/moved-jobnet",
    });
    const added = unit({
      name: "added-jobnet",
      unitType: "n",
      absolutePath: "/root/added-jobnet",
    });
    const removed = unit({
      name: "removed-jobnet",
      unitType: "n",
      absolutePath: "/root/removed-jobnet",
    });
    const change = (
      id: string,
      kind: Extract<
        SemanticDiffChange["kind"],
        "renamed" | "moved" | "added" | "removed"
      >,
      before: AjsUnit | undefined,
      after: AjsUnit | undefined,
    ): SemanticDiffChange => ({
      id,
      kind,
      elementKind: "jobnet",
      confirmationLevel: "confirmed",
      identityDecisionId: `identity:${id}`,
      before: before
        ? { kind: "jobnet", unit: unitReference(before) }
        : undefined,
      after: after ? { kind: "jobnet", unit: unitReference(after) } : undefined,
      relationPair: null,
    });
    const cases = [
      [
        change("jobnet:renamed", "renamed", beforeRenamed, afterRenamed),
        "before-jobnet renamed to after-jobnet",
        "before-jobnet を after-jobnet に名前変更",
      ],
      [
        change("jobnet:moved", "moved", beforeMoved, afterMoved),
        "moved-jobnet moved from /root/before-parent to /root/after-parent",
        "moved-jobnet を移動",
      ],
      [
        change("jobnet:added", "added", undefined, added),
        "added-jobnet added",
        "added-jobnetを追加",
      ],
      [
        change("jobnet:removed", "removed", removed, undefined),
        "removed-jobnet removed",
        "removed-jobnetを削除",
      ],
    ] as const;

    cases.forEach(([jobnetChange, english, japanese]) => {
      assert.strictEqual(localizedChangeSummary(jobnetChange), english);
      assert.strictEqual(
        localizedChangeSummary(jobnetChange, "ja-JP"),
        japanese,
      );
      assert.ok(
        renderSemanticDiffMarkdown(
          buildResult({ changes: [jobnetChange] }),
        ).includes(english),
      );
      assert.ok(
        renderSemanticDiffMarkdown(
          buildResult({ changes: [jobnetChange] }),
          "ja-JP",
        ).includes(japanese),
      );
    });
  });

  test("renders relation sides from relationPair rather than generic targets", () => {
    const change: SemanticDiffChange = {
      id: "relation:removed:canonical-source->canonical-target:seq",
      kind: "removed",
      elementKind: "relation",
      confirmationLevel: "confirmed",
      before: {
        kind: "relation",
        relation: {
          sourceUnitId: "wrong-source",
          targetUnitId: "wrong-target",
          type: "con",
          sourceUnitPath: "/wrong/source",
          targetUnitPath: "/wrong/target",
        },
      },
      after: {
        kind: "relation",
        relation: {
          sourceUnitId: "wrong-after-source",
          targetUnitId: "wrong-after-target",
          type: "con",
          sourceUnitPath: "/wrong/after-source",
          targetUnitPath: "/wrong/after-target",
        },
      },
      relationPair: {
        canonicalPair: {
          sourceUnitId: "canonical-source",
          targetUnitId: "canonical-target",
          type: "seq",
        },
        before: {
          sourceUnitPath: "/pair/source",
          sourceUnitId: "real-source",
          targetUnitPath: "/pair/target",
          targetUnitId: "real-target",
          type: "seq",
        },
        after: null,
      },
    };

    const report = renderSemanticDiffMarkdown(
      buildResult({ changes: [change] }),
    );

    assert.ok(
      report.includes("canonical-source-\\>canonical-target relation removed"),
    );
    assert.ok(
      report.includes("relation /pair/source -\\> /pair/target \\(seq\\)"),
    );
    assert.strictEqual(report.includes("/wrong/source"), false);
    assert.strictEqual(report.includes("wrong-source"), false);
    assert.strictEqual(report.includes("/wrong/after-source"), false);
    assert.strictEqual(report.includes("wrong-after-source"), false);
  });

  test("keeps no-change output when only an exact identity decision exists", () => {
    const unchanged = unit({
      name: "unchanged",
      absolutePath: "/root/jobnet/unchanged",
    });
    const report = renderSemanticDiffMarkdown(
      buildResult({
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
      buildResult({
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
            relationPair: null,
          },
        ],
        identityDecisions: [
          exactIdentityDecision("identity:test:attribute", job, job),
        ],
        limitations: [
          {
            code: "missing_relation_target",
            kind: "normalization",
            side: "before",
            unitPath: null,
            detail: {
              unitPath: null,
              parameterKey: null,
              relationPair: null,
              scheduleRule: null,
              period: null,
              beforeValues: [],
              afterValues: [],
              rawValues: [],
              removedSources: [],
            },
            warning: {
              code: "missing_relation_target",
              detail: {
                unitPath: null,
                parameterKey: null,
                relationPair: null,
                scheduleRule: null,
                period: null,
                beforeValues: [],
                afterValues: [],
                rawValues: [],
                removedSources: [],
              },
              fallbackText: rawMessage,
            },
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

    const input = buildResult({
      changes: [
        {
          id: "unit:renamed:/root/jobnet/job-a:/root/jobnet/job-b",
          kind: "renamed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:renamed",
          before: { kind: "unit", unit: unitReference(beforeJob) },
          after: { kind: "unit", unit: unitReference(afterJob) },
          relationPair: null,
        },
        {
          id: "unit:changed:/root/jobnet/job-x:",
          kind: "changed",
          elementKind: "unit",
          confirmationLevel: "candidate",
          identityDecisionId: "identity:test:candidate",
          before: { kind: "unit", unit: unitReference(beforeCandidate) },
          relationPair: null,
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
          relationPair: null,
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
          reasonCode: "condition-judgment-changed",
          relatedTargets: [{ kind: "unit", unit: unitReference(afterTail) }],
          constraints: [
            {
              code: "runtime-state-not-verified",
              detail: {
                unitPath: afterJob.absolutePath,
                parameterKey: "cond",
                relationPair: null,
                scheduleRule: null,
                period: null,
                beforeValues: [],
                afterValues: [],
                rawValues: [],
                removedSources: [],
              },
              warning: null,
            },
          ],
          detail: {
            unitPath: afterJob.absolutePath,
            parameterKey: "cond",
            relationPair: null,
            scheduleRule: null,
            period: null,
            beforeValues: [],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          warning: null,
        },
      ],
      unsupportedItems: [
        {
          id: "unsupported:condition:/root/jobnet/job-b",
          kind: "uninterpretable",
          side: "after",
          target: afterAttribute,
          reasonCode: "uninterpretable-file-monitoring-condition",
          detail: {
            unitPath: afterJob.absolutePath,
            parameterKey: "flwc",
            relationPair: null,
            scheduleRule: null,
            period: null,
            beforeValues: [],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          warning: {
            code: "uninterpretable-file-monitoring-condition",
            detail: {
              unitPath: afterJob.absolutePath,
              parameterKey: "flwc",
              relationPair: null,
              scheduleRule: null,
              period: null,
              beforeValues: [],
              afterValues: [],
              rawValues: [],
              removedSources: [],
            },
            fallbackText: "condition expression is not supported",
          },
        },
      ],
      limitations: [
        {
          code: "missing_relation_target",
          kind: "normalization",
          side: "before",
          unitPath: "/root/jobnet/job-a",
          detail: {
            unitPath: "/root/jobnet/job-a",
            parameterKey: null,
            relationPair: null,
            scheduleRule: null,
            period: null,
            beforeValues: [],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          warning: {
            code: "missing_relation_target",
            detail: {
              unitPath: "/root/jobnet/job-a",
              parameterKey: null,
              relationPair: null,
              scheduleRule: null,
              period: null,
              beforeValues: [],
              afterValues: [],
              rawValues: [],
              removedSources: [],
            },
            fallbackText: "relation target was not found",
          },
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

- job-b cond condition or judgment changed
  - Target: unit /root/jobnet/job-b
  - Rationale: a previously established start, end, or branch path may no longer be available
  - Related: unit /root/jobnet/tail
  - Constraint: Runtime history and external conditions are not verified by this comparison.

## Unsupported Items

- [uninterpretable] after: condition expression is not supported
  - Target: attribute eu on /root/jobnet/job-b

## Limitations

- \\[normalization:missing\\_relation\\_target\\] before /root/jobnet/job-a relation target was not found`,
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
    const input = buildResult({
      changes: [
        {
          id: "unit:removed:/root/jobnet/removed:",
          kind: "removed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:removed",
          before: { kind: "unit", unit: unitReference(removedUnit) },
          relationPair: null,
        },
        {
          id: "unit:added::/root/jobnet/added",
          kind: "added",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:added",
          after: { kind: "unit", unit: unitReference(addedUnit) },
          relationPair: null,
        },
        {
          id: "unit:changed:/root/jobnet/missing:",
          kind: "changed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId: "identity:test:missing",
          before: { kind: "unit", unit: unitReference(missingUnit) },
          relationPair: null,
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
      buildResult({
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
            },
          ],
        },
      }),
    );

    assert.ok(
      result.includes(
        "- Comparison period: 2026-04-01 to 2026-05-01 (exclusive)",
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
