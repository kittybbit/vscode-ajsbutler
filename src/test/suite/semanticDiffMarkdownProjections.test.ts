import * as assert from "assert";
import { createHash } from "crypto";
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
import { renderSemanticDiffAuditMarkdown } from "../../presentation/semantic-diff/report/renderSemanticDiffAuditMarkdown";
import {
  renderSemanticDiffFullMarkdown,
  renderSemanticDiffMarkdown,
} from "../../presentation/semantic-diff/report/renderSemanticDiffMarkdown";
import { renderSemanticDiffSummaryMarkdown } from "../../presentation/semantic-diff/report/renderSemanticDiffSummaryMarkdown";

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
  },
  confirmationRequiredCount: 22,
  limitationCount: 23,
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
          index % 2 === 0
            ? "runtime-state-not-verified"
            : "runtime-state-not-verified",
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
    kind: "uninterpretable",
    side: "after",
    reasonCode: "uninterpretable-file-monitoring-condition",
    target: { kind: "unit", unit: reference("after-unit") },
    detail,
    warning,
  };
  const limitation: SemanticDiffLimitation = {
    code: "normalization-warning",
    kind: "uninterpretable",
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
  });
};

type MarkdownFixture = "empty" | "populated";
type MarkdownMode = "summary" | "full" | "audit";
type MarkdownLocale = "english" | "japanese";

const markdownBaselineSnapshots = {
  empty: {
    summary: {
      english: {
        bytes: 608,
        digest:
          "ecf124ab1b46057bf8030264255a9f76036998869e335aaecc9c6d9e288b827a",
      },
      japanese: {
        bytes: 659,
        digest:
          "4aeb88c8cf694ae7f196a9c53dfd8e5e1f3c93c5c041a4dba4824baeb441089c",
      },
    },
    full: {
      english: {
        bytes: 361,
        digest:
          "cff6d853e24f0634d382a35300913a3a253d51d31feaceeaf3297d8fe52582a3",
      },
      japanese: {
        bytes: 414,
        digest:
          "e529669ddafdb1fe6c52868482cd0067bf07bf6f8d2cbf1231e22b3a7746b843",
      },
    },
    audit: {
      english: {
        bytes: 589,
        digest:
          "b4ad8640103bfdca5d511ecd268771aebd39fc084058adc12a9330664105c492",
      },
      japanese: {
        bytes: 685,
        digest:
          "da8cb0d9d40ae526427d36ec61d1e377b5930f17f99db3a0bd0451eab79c0f9d",
      },
    },
  },
  populated: {
    summary: {
      english: {
        bytes: 609,
        digest:
          "b1e8c7255d955cb5c1d864572d85571a578a35c0e770aa86e7484a3b4d3add1a",
      },
      japanese: {
        bytes: 659,
        digest:
          "da3b46c1d1f5c7412f6d0e2ba1491c65d7e8e9ab7e151a41a02fabe7f750b70c",
      },
    },
    full: {
      english: {
        bytes: 2702,
        digest:
          "302a21b0f53860d6454187c964574f69b5988a48be90f30e17c4e42d5df7683a",
      },
      japanese: {
        bytes: 2645,
        digest:
          "3aa1828317e7fad94cce900c43f65db30aeb73070b7f240cbb6f2ab7ee5e4f5e",
      },
    },
    audit: {
      english: {
        bytes: 11765,
        digest:
          "89f9468129b879209e377d0fefd82a79ca139491df2815f32dc0c4d067cc3657",
      },
      japanese: {
        bytes: 12731,
        digest:
          "fbbc4cacd122d55b121f4ea62e69957d6bba9632f0a0a0ef8068fda1d43ff811",
      },
    },
  },
} as const;

const markdownLocale = (language?: string): MarkdownLocale =>
  language?.toLowerCase() === "ja" ||
  language?.toLowerCase().startsWith("ja-") === true
    ? "japanese"
    : "english";

const markdownDigest = (content: string): string =>
  createHash("sha256").update(Buffer.from(content, "utf8")).digest("hex");

const renderMarkdownByMode = (
  context: SemanticDiffOutputContext,
  mode: MarkdownMode,
  language?: string,
): string => {
  switch (mode) {
    case "summary":
      return renderSemanticDiffSummaryMarkdown(context, language);
    case "full":
      return renderSemanticDiffFullMarkdown(context, language);
    case "audit":
      return renderSemanticDiffAuditMarkdown(context, language);
  }
};

const populatedMarkdownContext = (): SemanticDiffOutputContext => {
  const result = auditResult();
  const firstConfirmation = result.confirmationRequired[0];
  if (!firstConfirmation) {
    throw new Error("The populated Markdown fixture needs a confirmation item");
  }
  result.confirmationRequired[0] = {
    ...firstConfirmation,
    detail: {
      ...firstConfirmation.detail,
      rawValues: ["raw*_[x]\nembedded-line"],
    },
  };
  return buildSemanticDiffOutputContext(result);
};

suite("Semantic Diff Markdown Projections", () => {
  test("formats the supplied summary without aggregating result records", () => {
    const result = emptyResult({});
    const context: SemanticDiffOutputContext = Object.freeze({
      result,
      summary: summaryWithEveryBucket(),
    });
    const report = renderSemanticDiffSummaryMarkdown(context);

    assert.ok(report.includes("# Semantic Diff Summary"));
    assert.ok(report.includes("- added: 1"));
    assert.ok(report.includes("- relation: 9"));
    assert.ok(report.includes("- Schedule: 18"));
    assert.ok(report.includes("- Confirmation-required count: 22"));
    assert.ok(report.includes("- Limitation count: 23"));
    assert.ok(report.includes("- Findings: present"));
    assert.strictEqual(report.includes("change:unit"), false);
    assert.strictEqual(report.includes("raw*_[x]"), false);
  });

  test("localizes Summary while preserving raw scopes", () => {
    const result = emptyResult({});
    const context = Object.freeze({
      result,
      summary: summaryWithEveryBucket(),
    });
    const report = renderSemanticDiffSummaryMarkdown(context, "ja-JP");

    assert.ok(report.includes("# 意味差分サマリー"));
    assert.ok(report.includes("## 変更種別ごとの変更"));
    assert.ok(report.includes("/before"));
    assert.ok(report.includes("所見: あり"));
  });

  test("uses zero-inclusive summary buckets for empty definition results", () => {
    const report = renderSemanticDiffSummaryMarkdown(
      buildSemanticDiffOutputContext(emptyResult()),
    );
    assert.ok(report.includes("- added: 0"));
    assert.ok(report.includes("- attribute: 0"));
    assert.ok(report.includes("- uninterpretable: 0"));
    assert.ok(report.includes("- Findings: absent"));
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

  test("preserves immutable baseline bytes and digests across Markdown locales", () => {
    const contexts: Record<MarkdownFixture, SemanticDiffOutputContext> = {
      empty: buildSemanticDiffOutputContext(emptyResult()),
      populated: populatedMarkdownContext(),
    };
    const originalContexts = JSON.stringify(contexts);
    const languages: Array<string | undefined> = [
      undefined,
      "en",
      "ja",
      "ja-JP",
      "fr",
    ];
    const modes: MarkdownMode[] = ["summary", "full", "audit"];

    (Object.keys(contexts) as MarkdownFixture[]).forEach((fixture) => {
      languages.forEach((language) => {
        modes.forEach((mode) => {
          const content = renderMarkdownByMode(
            contexts[fixture],
            mode,
            language,
          );
          const expected =
            markdownBaselineSnapshots[fixture][mode][markdownLocale(language)];
          assert.strictEqual(
            Buffer.byteLength(content, "utf8"),
            expected.bytes,
          );
          assert.strictEqual(markdownDigest(content), expected.digest);
          assert.strictEqual(JSON.stringify(contexts), originalContexts);
        });
      });
    });
  });

  test("Audit includes identity, all seven reasons, details, warnings, limitations, and definition facts", () => {
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
    assert.ok(report.includes("runtime-state-not-verified"));
    assert.ok(report.includes("unsupported-warning"));
    assert.ok(report.includes("fallback \\*\\_\\[x\\]"));
    assert.ok(report.includes("uninterpretable-file-monitoring-condition"));
    assert.ok(report.includes("raw-0"));
    assert.ok(report.includes("release-a"));
    assert.ok(report.includes("source-unit->target-unit (con)"));
    assert.ok(report.includes("/root/before-source"));
    assert.ok(report.includes("/root/after-target"));
    assert.ok(report.includes("Warning: null"));
    assert.ok(report.includes("execution-user-type-changed"));
    assert.strictEqual(report.includes("execution-user-changed"), false);
  });

  test("Audit projects job-group exact-key evidence", () => {
    const result = auditResult();
    result.identityDecisions.push({
      id: "identity:job-group",
      status: "exact",
      rule: "exact-key",
      before: [reference("before", "/root/nested-group")],
      after: [reference("after", "/root/nested-group")],
      evidence: {
        kind: "exact-key",
        key: {
          kind: "job-group",
          jobGroupPath: "nested-group",
          unitType: "g",
        },
      },
    });

    const report = renderSemanticDiffAuditMarkdown(
      buildSemanticDiffOutputContext(result),
    );
    const japanese = renderSemanticDiffAuditMarkdown(
      buildSemanticDiffOutputContext(result),
      "ja-JP",
    );

    assert.ok(
      report.includes("Key: job-group; jobGroupPath=nested-group; unitType=g"),
    );
    assert.ok(
      japanese.includes(
        "キー: job-group; jobGroupPath=nested-group; unitType=g",
      ),
    );
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
