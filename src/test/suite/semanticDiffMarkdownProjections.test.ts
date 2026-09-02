import * as assert from "assert";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  createSemanticDiffDetail,
  createSemanticDiffWarning,
} from "../../application/semantic-diff/semanticDiffStructuredFacts";
import type {
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffIdentityDecision,
  SemanticDiffLimitation,
  SemanticDiffOutputContext,
  SemanticDiffRelationPair,
  SemanticDiffResult,
  SemanticDiffSummary,
  SemanticDiffUnsupportedItem,
} from "../../application/semantic-diff/semanticDiffDto";
import { renderSemanticDiffAuditMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffAuditMarkdown";
import {
  renderSemanticDiffFullMarkdown,
  renderSemanticDiffMarkdown,
} from "../../presentation/semantic-diff/renderSemanticDiffMarkdown";
import { renderSemanticDiffSummaryMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffSummaryMarkdown";

const reference = (name: string, path = `/root/${name}`) => ({
  id: path,
  name,
  absolutePath: path,
  unitType: "j",
});

const emptyResult = (
  overrides: Partial<SemanticDiffResult> = {},
): SemanticDiffResult => ({
  inputs: {
    before: {
      side: "before",
      jobGroupPath: "/before",
      unitIds: [],
      relations: [],
    },
    after: {
      side: "after",
      jobGroupPath: "/after",
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

const summaryWithEveryBucket = (): SemanticDiffSummary => ({
  changeCountsByKind: {
    added: 1,
    removed: 2,
    changed: 3,
    renamed: 4,
    moved: 5,
  },
  changeCountsByElementKind: {
    "job-group": 6,
    jobnet: 7,
    unit: 8,
    relation: 9,
    attribute: 10,
  },
  changeCountsByAttributeCategory: {
    "execution-environment": 11,
    "execution-definition": 12,
    "start-condition": 13,
    "end-control": 14,
    "abnormal-end-control": 15,
    "wait-condition": 16,
    "external-integration": 17,
    schedule: 18,
  },
  unsupportedCountsByKind: {
    unsupported: 19,
    uninterpretable: 20,
    uncalculated: 21,
  },
  confirmationRequiredCount: 22,
  limitationCount: 23,
  scheduleRunChangeCount: 24,
  hasUncalculated: true,
  hasFindings: true,
});

const unitChange: SemanticDiffChange = {
  id: "change:unit",
  kind: "changed",
  elementKind: "unit",
  confirmationLevel: "confirmed",
  identityDecisionId: "identity:unit",
  before: { kind: "unit", unit: reference("before-unit") },
  after: { kind: "unit", unit: reference("after-unit") },
  relationPair: null,
};

const identityDecision: SemanticDiffIdentityDecision = {
  id: "identity:fingerprint",
  status: "fingerprint-confirmed",
  rule: "one-to-one-fingerprint",
  before: [reference("before-unit")],
  after: [reference("after-unit")],
  evidence: {
    kind: "fingerprint",
    strategyId: "command-text-v1",
    unitType: "j",
    fields: [{ key: "te", presence: "present", values: ["echo *_[x]"] }],
  },
};

const exactIdentityDecision: SemanticDiffIdentityDecision = {
  id: "identity:exact",
  status: "exact",
  rule: "exact-key",
  before: [reference("before-unit")],
  after: [reference("after-unit")],
  evidence: {
    kind: "exact-key",
    key: {
      kind: "unit",
      parentJobnetPath: "/root/jobnet",
      unitName: "after-unit",
      unitType: "j",
    },
  },
};

const relationPair: SemanticDiffRelationPair = {
  canonicalPair: {
    sourceUnitId: "source-unit",
    targetUnitId: "target-unit",
    type: "con",
  },
  before: {
    sourceUnitPath: "/root/before-source",
    sourceUnitId: "before-source",
    targetUnitPath: "/root/before-target",
    targetUnitId: "before-target",
    type: "con",
  },
  after: {
    sourceUnitPath: "/root/after-source",
    sourceUnitId: "after-source",
    targetUnitPath: "/root/after-target",
    targetUnitId: "after-target",
    type: "con",
  },
};

const allReasonCodes: SemanticDiffConfirmationRequiredItem["reasonCode"][] = [
  "conditional-relation-removed",
  "wait-release-source-changed",
  "timeout-removed",
  "condition-judgment-changed",
  "wait-target-changed",
  "no-calculated-schedule-run",
  "calculated-schedule-run-removed",
  "execution-user-type-changed",
  "jp1-resource-group-changed",
];

const confirmation = (
  reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"],
  index: number,
): SemanticDiffConfirmationRequiredItem => {
  const detail = createSemanticDiffDetail({
    unitPath: "/root/after-unit",
    parameterKey: reasonCode === "jp1-resource-group-changed" ? "rg" : "cond",
    period: { from: "2026-04-01", to: "2026-05-01" },
    beforeValues: [`before-${index}*`],
    afterValues: [`after-${index}_[x]`],
    rawValues: [`raw-${index}`],
    removedSources: index === 1 ? ["release-a"] : [],
  });
  const warning = createSemanticDiffWarning({
    code: `warning-${index}`,
    detail,
    fallbackText: `fallback-${index}`,
  });
  return {
    id: `confirmation:${index}`,
    reasonCode,
    target: { kind: "unit", unit: reference("after-unit") },
    relatedTargets: [{ kind: "unit", unit: reference("related-unit") }],
    detail,
    constraints: [
      {
        code:
          index % 2 === 0 ? "runtime-state-not-verified" : "comparison-period",
        detail,
        warning: null,
      },
    ],
    warning: index % 2 === 0 ? warning : null,
  };
};

const auditResult = (): SemanticDiffResult => {
  const detail = createSemanticDiffDetail({
    unitPath: "/root/after-unit",
    parameterKey: "flwc",
    period: { from: "2026-04-01", to: "2026-05-01" },
    rawValues: ["raw*_[x]"],
    relationPair,
  });
  const warning = createSemanticDiffWarning({
    code: "unsupported-warning",
    detail,
    fallbackText: "fallback *_[x]",
  });
  const unsupported: SemanticDiffUnsupportedItem = {
    id: "unsupported:audit",
    kind: "uncalculated",
    side: "after",
    reasonCode: "invalid-schedule-comparison-period",
    target: { kind: "unit", unit: reference("after-unit") },
    detail,
    warning,
  };
  const limitation: SemanticDiffLimitation = {
    code: "invalid_schedule_comparison_period",
    kind: "uncalculated",
    side: null,
    unitPath: null,
    detail,
    warning: null,
  };
  return emptyResult({
    changes: [unitChange],
    identityDecisions: [identityDecision, exactIdentityDecision],
    confirmationRequired: allReasonCodes.map(confirmation),
    unsupportedItems: [unsupported],
    limitations: [limitation],
    scheduleComparison: {
      period: { from: "2026-04-01", to: "2026-05-01" },
      runChanges: [
        {
          id: "schedule:changed-time:/root/after-unit:2026-04-01",
          kind: "changed-time",
          unitPath: "/root/after-unit",
          date: "2026-04-01",
          before: {
            unitPath: "/root/after-unit",
            unitName: "after-unit",
            rule: 1,
            date: "2026-04-01",
            time: "09:00",
          },
          after: {
            unitPath: "/root/after-unit",
            unitName: "after-unit",
            rule: 1,
            date: "2026-04-01",
            time: "10:00",
          },
        },
      ],
    },
  });
};

suite("Semantic Diff Markdown Projections", () => {
  test("formats the supplied summary without aggregating result records", () => {
    const result = emptyResult({
      scheduleComparison: {
        period: { from: "2026-04-01", to: "2026-05-01" },
        runChanges: [],
      },
    });
    const context: SemanticDiffOutputContext = Object.freeze({
      result,
      summary: summaryWithEveryBucket(),
    });
    const report = renderSemanticDiffSummaryMarkdown(context);

    assert.ok(report.includes("# Semantic Diff Summary"));
    assert.ok(report.includes("- added: 1"));
    assert.ok(report.includes("- relation: 9"));
    assert.ok(report.includes("- Schedule: 18"));
    assert.ok(report.includes("- uncalculated: 21"));
    assert.ok(report.includes("- Confirmation-required count: 22"));
    assert.ok(report.includes("- Limitation count: 23"));
    assert.ok(report.includes("## Schedule run-change count\n\n- 24"));
    assert.ok(report.includes("- Uncalculated: present"));
    assert.ok(report.includes("- Findings: present"));
    assert.strictEqual(report.includes("change:unit"), false);
    assert.strictEqual(report.includes("raw*_[x]"), false);
  });

  test("localizes Summary while preserving raw scopes and periods", () => {
    const result = emptyResult({
      scheduleComparison: {
        period: { from: "2026-04-01", to: "2026-05-01" },
        runChanges: [],
      },
    });
    const context = Object.freeze({
      result,
      summary: summaryWithEveryBucket(),
    });
    const report = renderSemanticDiffSummaryMarkdown(context, "ja-JP");

    assert.ok(report.includes("# 意味差分サマリー"));
    assert.ok(report.includes("## 変更種別ごとの変更"));
    assert.ok(report.includes("/before"));
    assert.ok(report.includes("2026-04-01"));
    assert.ok(report.includes("未計算: あり"));
    assert.ok(report.includes("所見: あり"));
  });

  test("uses zero-inclusive summary buckets and distinguishes missing from zero-run schedules", () => {
    const absent = renderSemanticDiffSummaryMarkdown(
      buildSemanticDiffOutputContext(emptyResult()),
    );
    const zeroRun = renderSemanticDiffSummaryMarkdown(
      buildSemanticDiffOutputContext(
        emptyResult({
          scheduleComparison: {
            period: { from: "2026-04-01", to: "2026-05-01" },
            runChanges: [],
          },
        }),
      ),
    );

    assert.ok(absent.includes("- added: 0"));
    assert.ok(absent.includes("- attribute: 0"));
    assert.ok(absent.includes("- uncalculated: 0"));
    assert.strictEqual(absent.includes("Schedule run-change count"), false);
    assert.ok(zeroRun.includes("## Schedule run-change count\n\n- 0"));
    assert.ok(zeroRun.includes("Comparison period: 2026-04-01 to 2026-05-01"));
    assert.ok(zeroRun.includes("- Findings: absent"));
  });

  test("renders Full and Audit from the same context without rebuilding facts", () => {
    const result = auditResult();
    const context = buildSemanticDiffOutputContext(result);
    const before = JSON.stringify(result);
    const fullFromResult = renderSemanticDiffMarkdown(result);
    const fullFromContext = renderSemanticDiffFullMarkdown(context);
    const audit = renderSemanticDiffAuditMarkdown(context);

    assert.strictEqual(fullFromContext, fullFromResult);
    assert.ok(audit.startsWith(fullFromContext));
    assert.ok(
      renderSemanticDiffSummaryMarkdown(context).includes(
        "# Semantic Diff Summary",
      ),
    );
    assert.strictEqual(JSON.stringify(context.result), before);
    assert.strictEqual(context.result, result);
    assert.ok(
      audit.includes(
        "Definition-derived evidence; runtime and external state were not verified.",
      ),
    );
  });

  test("Audit includes identity, all nine reasons, details, warnings, limitations, and schedule facts", () => {
    const context = buildSemanticDiffOutputContext(auditResult());
    const report = renderSemanticDiffAuditMarkdown(context);

    allReasonCodes.forEach((reasonCode) =>
      assert.ok(report.includes(reasonCode)),
    );
    assert.ok(report.includes("identity:fingerprint"));
    assert.ok(report.includes("identity:exact"));
    assert.ok(report.includes("parentJobnetPath=/root/jobnet"));
    assert.ok(report.includes("fingerprint-confirmed"));
    assert.ok(report.includes("command-text-v1"));
    assert.ok(report.includes("echo \\*\\_\\[x\\]"));
    assert.ok(report.includes("runtime-state-not-verified"));
    assert.ok(report.includes("comparison-period"));
    assert.ok(report.includes("unsupported-warning"));
    assert.ok(report.includes("fallback \\*\\_\\[x\\]"));
    assert.ok(report.includes("invalid-schedule-comparison-period"));
    assert.ok(report.includes("invalid\\_schedule\\_comparison\\_period"));
    assert.ok(report.includes("2026-04-01 -> 2026-05-01"));
    assert.ok(report.includes("raw-0"));
    assert.ok(report.includes("release-a"));
    assert.ok(report.includes("source-unit->target-unit (con)"));
    assert.ok(report.includes("/root/before-source"));
    assert.ok(report.includes("/root/after-target"));
    assert.ok(report.includes("Warning: null"));
    assert.ok(report.includes("execution-user-type-changed"));
    assert.strictEqual(report.includes("execution-user-changed"), false);
  });

  test("Audit localization keeps Japanese generic confirmation wording and codes", () => {
    const report = renderSemanticDiffAuditMarkdown(
      buildSemanticDiffOutputContext(auditResult()),
      "ja-JP",
    );

    assert.ok(report.includes("## 監査証跡"));
    assert.ok(
      report.includes(
        "定義から導出した証跡。実行時および外部状態は検証されていません。",
      ),
    );
    assert.ok(report.includes("変更内容を確認してください"));
    assert.ok(report.includes("対象: ユニット /root/after-unit"));
    assert.ok(report.includes("ユニットパス: /root/after-unit"));
    assert.ok(report.includes("変更前の値:"));
    assert.ok(report.includes("conditional-relation-removed"));
    assert.ok(report.includes("raw-0"));
  });
});
