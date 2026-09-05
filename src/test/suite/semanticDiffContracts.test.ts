import * as assert from "assert";
import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import {
  compareSemanticDiff,
  createSemanticDiffResult,
} from "../../application/semantic-diff/compareSemanticDiff";
import {
  buildSemanticDiffOutputContext,
  buildSemanticDiffSummary,
} from "../../application/semantic-diff/buildSemanticDiffSummary";
import * as summaryBuilders from "../../application/semantic-diff/buildSemanticDiffSummary";
import {
  createSemanticDiffDetail,
  createSemanticDiffWarning,
} from "../../application/semantic-diff/semanticDiffStructuredFacts";
import type {
  SemanticDiffChange,
  SemanticDiffConstraint,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffDetail,
  SemanticDiffLimitation,
  SemanticDiffResult,
  SemanticDiffScheduleRunChange,
  SemanticDiffUnsupportedItem,
} from "../../application/semantic-diff/semanticDiffDto";

const mutableSummaryBuilders = summaryBuilders as unknown as {
  buildSemanticDiffSummary: typeof buildSemanticDiffSummary;
};

const confirmationReasonCodes: SemanticDiffConfirmationRequiredItem["reasonCode"][] =
  [
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

const unit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
  id: "/root/jobnet/job",
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
  parameters: [{ key: "ty", value: "j" }],
  relations: [],
  children: [],
  ...overrides,
});

const emptyResult = (
  overrides: Partial<SemanticDiffResult> = {},
): SemanticDiffResult => ({
  inputs: {
    before: { side: "before", unitIds: [], relations: [] },
    after: { side: "after", unitIds: [], relations: [] },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
  ...overrides,
});

const attributeChange = (
  id: string,
  confirmationLevel: SemanticDiffChange["confirmationLevel"] = "confirmed",
): SemanticDiffChange => ({
  id,
  kind: "changed",
  elementKind: "attribute",
  confirmationLevel,
  identityDecisionId: `identity:${id}`,
  before: {
    kind: "attribute",
    unit: {
      id: "before",
      name: "job",
      absolutePath: "/before/job",
      unitType: "j",
    },
    parameterKey: "sc",
    category: "execution-definition",
    values: ["before"],
  },
  after: {
    kind: "attribute",
    unit: {
      id: "after",
      name: "job",
      absolutePath: "/after/job",
      unitType: "j",
    },
    parameterKey: "sc",
    category: "execution-definition",
    values: ["after"],
  },
  attributeCategory: "execution-definition",
  relationPair: null,
});

const confirmation = (
  id: string,
  reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"] = "condition-judgment-changed",
): SemanticDiffConfirmationRequiredItem => ({
  id,
  reasonCode,
  target: {
    kind: "unit",
    unit: {
      id: "after",
      name: "job",
      absolutePath: "/after/job",
      unitType: "j",
    },
  },
  relatedTargets: [],
  detail: createSemanticDiffDetail({ parameterKey: "cond" }),
  constraints: [],
  warning: null,
});

suite("Semantic Diff Structured Contracts", () => {
  test("creates a neutral result without sections or display prose", () => {
    const before = unit();
    const input = {
      before: { rootUnits: [before], warnings: [] } satisfies AjsDocument,
      after: { rootUnits: [before], warnings: [] } satisfies AjsDocument,
      options: { jobGroupPath: "/root" },
    };

    const result = createSemanticDiffResult(input);

    assert.strictEqual("reportSections" in result, false);
    assert.deepStrictEqual(result.identityDecisions, []);
    assert.deepStrictEqual(result.limitations, []);
  });

  test("transports structured warning and detail facts", () => {
    const detail = createSemanticDiffDetail({
      unitPath: "/root/job",
      parameterKey: "flwc",
      afterValues: ["s:m"],
    });
    const warning = createSemanticDiffWarning({
      code: "uninterpretable-file-monitoring-condition",
      detail,
      fallbackText: "legacy display fallback",
    });
    const unsupported: SemanticDiffUnsupportedItem = {
      id: "unsupported:test",
      kind: "uninterpretable",
      side: "after",
      reasonCode: "uninterpretable-file-monitoring-condition",
      target: null,
      detail,
      warning,
    };

    assert.deepStrictEqual(unsupported.detail.afterValues, ["s:m"]);
    assert.strictEqual(
      unsupported.warning?.fallbackText,
      "legacy display fallback",
    );
    assert.strictEqual("details" in unsupported, false);
  });

  test("maps former prose fields to typed records and explicit run sides", () => {
    const detail = createSemanticDiffDetail({
      unitPath: "/root/job",
      parameterKey: "sc",
      beforeValues: ["before"],
      afterValues: ["after"],
    });
    const relationPair = {
      canonicalPair: {
        sourceUnitId: "source",
        targetUnitId: "target",
        type: "seq" as const,
      },
      before: null,
      after: null,
    };
    const relationChange: SemanticDiffChange = {
      id: "relation:removed",
      kind: "removed",
      elementKind: "relation",
      confirmationLevel: "confirmed",
      before: undefined,
      after: undefined,
      relationPair,
    };
    const confirmationItem = {
      ...confirmation("confirmation:typed", "conditional-relation-removed"),
      detail: createSemanticDiffDetail({ relationPair }),
    } satisfies SemanticDiffConfirmationRequiredItem;
    const unsupported: SemanticDiffUnsupportedItem = {
      id: "unsupported:typed",
      kind: "uninterpretable",
      side: "after",
      reasonCode: "uninterpretable-file-monitoring-condition",
      target: null,
      detail,
      warning: null,
    };
    const limitation: SemanticDiffLimitation = {
      code: "normalization-warning",
      kind: "normalization",
      side: "before",
      unitPath: "/root/job",
      detail,
      warning: null,
    };
    const scheduleRunChange: SemanticDiffScheduleRunChange = {
      id: "schedule:changed-time:/root/job:2026-04-01",
      kind: "changed-time",
      unitPath: "/root/job",
      date: "2026-04-01",
      before: {
        unitPath: "/root/job",
        unitName: "job",
        rule: 1,
        date: "2026-04-01",
        time: "09:00",
      },
      after: {
        unitPath: "/root/job",
        unitName: "job",
        rule: 1,
        date: "2026-04-01",
        time: "10:00",
      },
    };

    assert.deepStrictEqual(
      {
        change: {
          kind: relationChange.kind,
          elementKind: relationChange.elementKind,
          confirmationLevel: relationChange.confirmationLevel,
          relationPair: relationChange.relationPair,
        },
        confirmation: {
          reasonCode: confirmationItem.reasonCode,
          detail: confirmationItem.detail,
        },
        unsupported: {
          kind: unsupported.kind,
          reasonCode: unsupported.reasonCode,
          detail: unsupported.detail,
          warning: unsupported.warning,
        },
        limitation: {
          kind: limitation.kind,
          code: limitation.code,
          detail: limitation.detail,
          warning: limitation.warning,
        },
        schedule: {
          kind: scheduleRunChange.kind,
          before: scheduleRunChange.before,
          after: scheduleRunChange.after,
        },
      },
      {
        change: {
          kind: "removed",
          elementKind: "relation",
          confirmationLevel: "confirmed",
          relationPair,
        },
        confirmation: {
          reasonCode: "conditional-relation-removed",
          detail: createSemanticDiffDetail({ relationPair }),
        },
        unsupported: {
          kind: "uninterpretable",
          reasonCode: "uninterpretable-file-monitoring-condition",
          detail,
          warning: null,
        },
        limitation: {
          kind: "normalization",
          code: "normalization-warning",
          detail,
          warning: null,
        },
        schedule: {
          kind: "changed-time",
          before: scheduleRunChange.before,
          after: scheduleRunChange.after,
        },
      },
    );
    [
      relationChange,
      confirmationItem,
      unsupported,
      limitation,
      scheduleRunChange,
    ].forEach((record) => {
      ["summary", "rationale", "changeContent", "message"].forEach((key) =>
        assert.strictEqual(key in record, false),
      );
    });
  });

  test("retains warning-present and warning-absent states across records", () => {
    const detail = createSemanticDiffDetail({ unitPath: "/root/job" });
    const warning = createSemanticDiffWarning({
      code: "normalization-warning",
      detail,
      fallbackText: "fallback",
    });
    const confirmationWithWarning = {
      ...confirmation("confirmation:warning"),
      warning,
    } satisfies SemanticDiffConfirmationRequiredItem;
    const unsupportedWithoutWarning: SemanticDiffUnsupportedItem = {
      id: "unsupported:no-warning",
      kind: "unsupported",
      side: null,
      reasonCode: "invalid-schedule-comparison-period",
      target: null,
      detail,
      warning: null,
    };
    const unsupportedWithWarning = {
      ...unsupportedWithoutWarning,
      id: "unsupported:warning",
      warning,
    } satisfies SemanticDiffUnsupportedItem;
    const limitationWithoutWarning: SemanticDiffLimitation = {
      code: "no-warning",
      kind: "normalization",
      side: null,
      unitPath: null,
      detail,
      warning: null,
    };
    const limitationWithWarning = {
      ...limitationWithoutWarning,
      code: "with-warning",
      warning,
    } satisfies SemanticDiffLimitation;
    assert.deepStrictEqual(
      [
        confirmation("confirmation:no-warning").warning,
        confirmationWithWarning.warning,
        unsupportedWithoutWarning.warning,
        unsupportedWithWarning.warning,
        limitationWithoutWarning.warning,
        limitationWithWarning.warning,
      ],
      [null, warning, null, warning, null, warning],
    );
    assert.deepStrictEqual(Object.keys(warning.detail), [
      "unitPath",
      "parameterKey",
      "relationPair",
      "scheduleRule",
      "period",
      "beforeValues",
      "afterValues",
      "rawValues",
      "removedSources",
    ]);
  });

  test("transports the exhaustive confirmation reasons and typed detail matrix", () => {
    const relationPair = {
      canonicalPair: {
        sourceUnitId: "source",
        targetUnitId: "target",
        type: "con" as const,
      },
      before: null,
      after: null,
    };
    const detailFor = (
      reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"],
    ): SemanticDiffDetail => {
      switch (reasonCode) {
        case "conditional-relation-removed":
          return createSemanticDiffDetail({ relationPair });
        case "wait-release-source-changed":
          return createSemanticDiffDetail({
            parameterKey: "eun",
            rawValues: ["release-before"],
            removedSources: ["release-before"],
          });
        case "timeout-removed":
          return createSemanticDiffDetail({
            parameterKey: "etm",
            beforeValues: ["30"],
          });
        case "condition-judgment-changed":
          return createSemanticDiffDetail({
            parameterKey: "cond",
            beforeValues: ["before-condition"],
            afterValues: ["after-condition"],
          });
        case "wait-target-changed":
          return createSemanticDiffDetail({
            parameterKey: "flwf",
            beforeValues: ["before-target"],
            afterValues: ["after-target"],
          });
        case "no-calculated-schedule-run":
          return createSemanticDiffDetail({
            scheduleRule: 1,
            period: { from: "2026-04-01", to: "2026-05-01" },
          });
        case "calculated-schedule-run-removed":
          return createSemanticDiffDetail({
            period: { from: "2026-04-01", to: "2026-05-01" },
            rawValues: ["2026-04-01", "09:00"],
          });
        case "execution-user-type-changed":
          return createSemanticDiffDetail({
            parameterKey: "eu",
            beforeValues: ["ent"],
            afterValues: ["def"],
          });
        case "jp1-resource-group-changed":
          return createSemanticDiffDetail({
            parameterKey: "rg",
            beforeValues: ["group-before"],
            afterValues: ["group-after"],
          });
      }
    };
    const items = confirmationReasonCodes.map((reasonCode, index) => {
      const detail = detailFor(reasonCode);
      const warning =
        index % 2 === 0
          ? createSemanticDiffWarning({
              code: `warning-${index}`,
              detail,
              fallbackText: `fallback-${index}`,
            })
          : null;
      return {
        id: `confirmation:${index}`,
        reasonCode,
        target: confirmation(`target:${index}`).target,
        relatedTargets: [],
        detail,
        constraints: [
          {
            code: [
              "jp1-ajs3-v13-rule-basis",
              "runtime-state-not-verified",
              "external-state-not-verified",
              "comparison-period",
            ][index % 4] as SemanticDiffConstraint["code"],
            detail,
            warning: null,
          },
        ],
        warning,
      } satisfies SemanticDiffConfirmationRequiredItem;
    });

    assert.deepStrictEqual(
      items.map((item) => item.reasonCode),
      confirmationReasonCodes,
    );
    assert.deepStrictEqual(Object.keys(items[0].detail), [
      "unitPath",
      "parameterKey",
      "relationPair",
      "scheduleRule",
      "period",
      "beforeValues",
      "afterValues",
      "rawValues",
      "removedSources",
    ]);
    assert.deepStrictEqual(items[0].detail.relationPair, relationPair);
    assert.deepStrictEqual(items[1].detail.removedSources, ["release-before"]);
    assert.deepStrictEqual(items[6].detail.rawValues, ["2026-04-01", "09:00"]);
    assert.deepStrictEqual(items[7].detail.beforeValues, ["ent"]);
    assert.deepStrictEqual(items[7].detail.afterValues, ["def"]);
    assert.deepStrictEqual(items[8].detail.beforeValues, ["group-before"]);
    assert.deepStrictEqual(items[8].detail.afterValues, ["group-after"]);
    assert.ok(
      items.every((item, index) =>
        index % 2 === 0
          ? item.warning?.fallbackText === `fallback-${index}`
          : item.warning === null,
      ),
    );
    assert.ok(items.every((item) => !("changeContent" in item)));
    assert.ok(items.every((item) => !("rationale" in item)));
  });

  test("summary uses exhaustive buckets and combined confirmation leaves", () => {
    const result = emptyResult({
      changes: [
        attributeChange("a"),
        attributeChange("a"),
        attributeChange("b", "confirmation-required"),
      ],
      confirmationRequired: [confirmation("c"), confirmation("c")],
      unsupportedItems: [
        {
          id: "u",
          kind: "uncalculated",
          side: null,
          reasonCode: "invalid-schedule-comparison-period",
          target: null,
          detail: createSemanticDiffDetail(),
          warning: null,
        },
      ],
    });

    const summary = buildSemanticDiffSummary(result);

    assert.deepStrictEqual(Object.keys(summary), [
      "changeCountsByKind",
      "changeCountsByElementKind",
      "changeCountsByAttributeCategory",
      "unsupportedCountsByKind",
      "confirmationRequiredCount",
      "limitationCount",
      "scheduleRunChangeCount",
      "hasUncalculated",
      "hasFindings",
    ]);
    assert.strictEqual(summary.changeCountsByKind.changed, 3);
    assert.strictEqual(summary.changeCountsByElementKind.attribute, 3);
    assert.strictEqual(summary.confirmationRequiredCount, 3);
    assert.strictEqual(summary.unsupportedCountsByKind.uncalculated, 1);
    assert.strictEqual(summary.hasUncalculated, true);
    assert.strictEqual(summary.hasFindings, true);
    assert.strictEqual(summary.changeCountsByKind.added, 0);
    assert.strictEqual(summary.unsupportedCountsByKind.unsupported, 0);
  });

  test("summary distinguishes absent, empty, and changed schedule runs", () => {
    const schedule = {
      period: { from: "2026-04-01", to: "2026-05-01" },
      runChanges: [
        {
          id: "schedule:added:/root/jobnet:2026-04-01",
          kind: "added" as const,
          unitPath: "/root/jobnet",
          date: "2026-04-01",
          before: null,
          after: {
            unitPath: "/root/jobnet",
            unitName: "jobnet",
            rule: 1,
            date: "2026-04-01",
            time: "09:00",
          },
        },
      ],
    };
    const changedSummary = buildSemanticDiffSummary(
      emptyResult({ scheduleComparison: schedule }),
    );
    assert.strictEqual(changedSummary.scheduleRunChangeCount, 1);
    assert.strictEqual(changedSummary.hasFindings, true);

    const emptyScheduleSummary = buildSemanticDiffSummary(
      emptyResult({
        scheduleComparison: { ...schedule, runChanges: [] },
      }),
    );
    assert.strictEqual(emptyScheduleSummary.scheduleRunChangeCount, 0);
    assert.strictEqual(emptyScheduleSummary.hasFindings, false);

    const absentScheduleSummary = buildSemanticDiffSummary(emptyResult());
    assert.strictEqual(absentScheduleSummary.scheduleRunChangeCount, 0);
    assert.strictEqual(absentScheduleSummary.hasFindings, false);
  });

  test("identity-only and empty results remain non-findings", () => {
    const result = emptyResult({
      identityDecisions: [
        {
          id: "identity:test",
          status: "exact",
          rule: "exact-key",
          before: [],
          after: [],
          evidence: {
            kind: "exact-key",
            key: {
              kind: "jobnet",
              jobGroupRelativePath: "jobnet",
              unitType: "n",
            },
          },
        },
      ],
    });
    const summary = buildSemanticDiffSummary(result);
    assert.strictEqual(summary.hasFindings, false);
    assert.strictEqual(summary.hasUncalculated, false);
  });

  test("output context retains the supplied result and freezes its pair", () => {
    const result = emptyResult();
    const before = JSON.stringify(result);
    const originalSummaryBuilder =
      mutableSummaryBuilders.buildSemanticDiffSummary;
    let summaryBuilderCalls = 0;
    mutableSummaryBuilders.buildSemanticDiffSummary = (input) => {
      summaryBuilderCalls += 1;
      return originalSummaryBuilder(input);
    };
    try {
      const context = buildSemanticDiffOutputContext(result);
      assert.strictEqual(summaryBuilderCalls, 1);
      assert.strictEqual(context.result, result);
      assert.strictEqual(Object.isFrozen(context), true);
      assert.strictEqual(context.summary.hasFindings, false);
      assert.throws(() =>
        Object.defineProperty(context, "result", { value: emptyResult() }),
      );
    } finally {
      mutableSummaryBuilders.buildSemanticDiffSummary = originalSummaryBuilder;
    }
    assert.strictEqual(JSON.stringify(result), before);
  });

  test("relation facts use correspondence-resolved identities", () => {
    const beforeSource = unit({
      id: "before-source",
      name: "source",
      absolutePath: "/root/source",
    });
    const beforeTarget = unit({
      id: "before-target",
      name: "target",
      absolutePath: "/root/target",
    });
    beforeSource.relations = [
      {
        sourceUnitId: beforeSource.id,
        targetUnitId: beforeTarget.id,
        type: "seq",
      },
    ];
    const afterSource = unit({
      id: "after-source",
      name: "source",
      absolutePath: "/root/source",
    });
    const afterTarget = unit({
      id: "after-target",
      name: "target",
      absolutePath: "/root/target",
    });
    const result = compareSemanticDiff({
      before: { rootUnits: [beforeSource, beforeTarget], warnings: [] },
      after: { rootUnits: [afterSource, afterTarget], warnings: [] },
    });
    const [relationChange] = result.changes.filter(
      (change) => change.elementKind === "relation",
    );
    assert.ok(relationChange);
    assert.deepStrictEqual(relationChange.relationPair.canonicalPair, {
      sourceUnitId: "after-source",
      targetUnitId: "after-target",
      type: "seq",
    });
    assert.deepStrictEqual(relationChange.relationPair.before, {
      sourceUnitPath: "/root/source",
      sourceUnitId: "before-source",
      targetUnitPath: "/root/target",
      targetUnitId: "before-target",
      type: "seq",
    });
    assert.strictEqual(relationChange.relationPair.after, null);
  });
});
