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
import {
  buildSemanticDiffJsonV1,
  renderSemanticDiffJson,
  serializeSemanticDiffJson,
} from "../../presentation/semantic-diff/serializeSemanticDiffJson";

const reference = (
  id: string,
  name = id,
  absolutePath = `/root/${id}`,
): SemanticDiffIdentityDecision["before"][number] => ({
  id,
  name,
  absolutePath,
  unitType: "j",
});

const relationPair = (): SemanticDiffRelationPair => ({
  canonicalPair: {
    sourceUnitId: "source-unit",
    targetUnitId: "target-unit",
    type: "con",
  },
  before: {
    sourceUnitPath: "/root/before-source",
    sourceUnitId: "before-source",
    targetUnitPath: null,
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
});

const detail = (
  overrides: Parameters<typeof createSemanticDiffDetail>[0] = {},
) =>
  createSemanticDiffDetail({
    unitPath: "/root/jobnet/job",
    parameterKey: "cond",
    scheduleRule: 1,
    period: { from: "2026-04-01", to: "2026-05-01" },
    beforeValues: ["before-b", "before-a", "before-a"],
    afterValues: ["after-b", "after-a"],
    rawValues: ["raw_2", "raw_1"],
    removedSources: ["source-b", "source-a"],
    ...overrides,
  });

const warning = (code: string, fallbackText: string | null) =>
  createSemanticDiffWarning({
    code,
    detail: detail({ rawValues: [`warning-${code}`] }),
    fallbackText,
  });

const summary = (
  overrides: Partial<SemanticDiffSummary> = {},
): SemanticDiffSummary => ({
  changeCountsByKind: {
    added: 1,
    removed: 2,
    changed: 3,
    renamed: 4,
    moved: 5,
    ...overrides.changeCountsByKind,
  },
  changeCountsByElementKind: {
    "job-group": 6,
    jobnet: 7,
    unit: 8,
    relation: 9,
    attribute: 10,
    ...overrides.changeCountsByElementKind,
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
    ...overrides.changeCountsByAttributeCategory,
  },
  unsupportedCountsByKind: {
    unsupported: 19,
    uninterpretable: 20,
    uncalculated: 21,
    ...overrides.unsupportedCountsByKind,
  },
  confirmationRequiredCount: overrides.confirmationRequiredCount ?? 22,
  limitationCount: overrides.limitationCount ?? 23,
  scheduleRunChangeCount: overrides.scheduleRunChangeCount ?? 24,
  hasUncalculated: overrides.hasUncalculated ?? true,
  hasFindings: overrides.hasFindings ?? true,
});

const baseResult = (
  overrides: Partial<SemanticDiffResult> = {},
): SemanticDiffResult => ({
  inputs: {
    before: {
      side: "before",
      jobGroupPath: "/before",
      unitIds: ["z", "a", "a"],
      relations: [
        {
          sourceUnitId: "z-source",
          targetUnitId: "z-target",
          type: "seq",
        },
        {
          sourceUnitId: "a-source",
          targetUnitId: "a-target",
          type: "con",
          sourceUnitPath: "/root/a-source",
        },
      ],
    },
    after: {
      side: "after",
      jobGroupPath: undefined,
      unitIds: ["b"],
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

const populatedResult = (): SemanticDiffResult => {
  const unitChange: SemanticDiffChange = {
    id: "change:unit",
    kind: "changed",
    elementKind: "unit",
    confirmationLevel: "confirmed",
    identityDecisionId: "identity:exact",
    before: { kind: "unit", unit: reference("before-unit") },
    after: { kind: "unit", unit: reference("after-unit") },
    relationPair: null,
  };
  const relationChange: SemanticDiffChange = {
    id: "change:relation",
    kind: "removed",
    elementKind: "relation",
    confirmationLevel: "confirmation-required",
    before: {
      kind: "relation",
      relation: {
        sourceUnitId: "before-source",
        targetUnitId: "before-target",
        type: "con",
      },
    },
    relationPair: relationPair(),
  };
  const attributeChange: SemanticDiffChange = {
    id: "change:attribute",
    kind: "changed",
    elementKind: "attribute",
    confirmationLevel: "candidate",
    identityDecisionId: "identity:fingerprint",
    before: {
      kind: "attribute",
      unit: reference("before-unit"),
      parameterKey: "eu",
      category: "execution-environment",
      values: ["z", "a"],
    },
    after: {
      kind: "attribute",
      unit: reference("after-unit"),
      parameterKey: "eu",
      category: "execution-environment",
      values: ["b", "a"],
    },
    attributeCategory: "execution-environment",
    relationPair: null,
  };
  const confirmations = allReasonCodes.map(
    (reasonCode, index): SemanticDiffConfirmationRequiredItem => ({
      id: `confirmation:${String(allReasonCodes.length - index).padStart(2, "0")}`,
      reasonCode,
      target: { kind: "unit", unit: reference("after-unit") },
      relatedTargets: [
        {
          kind: "attribute",
          unit: reference("after-unit"),
          parameterKey: "eu",
          category: "execution-environment",
          values: ["z", "a"],
        },
        { kind: "job-group", path: undefined },
      ],
      detail: detail({
        relationPair:
          reasonCode === "conditional-relation-removed" ? relationPair() : null,
      }),
      constraints: [
        {
          code:
            index % 2 === 0
              ? "runtime-state-not-verified"
              : "comparison-period",
          detail: detail(),
          warning:
            index % 2 === 0 ? warning(`constraint-${index}`, null) : null,
        },
      ],
      warning:
        index % 2 === 0
          ? warning(`confirmation-${index}`, `fallback-${index}`)
          : null,
    }),
  );
  const identityDecisions: SemanticDiffIdentityDecision[] = [
    {
      id: "identity:fingerprint",
      status: "fingerprint-confirmed",
      rule: "one-to-one-fingerprint",
      before: [reference("before-unit", "before", "/root/z")],
      after: [reference("after-unit", "after", "/root/a")],
      evidence: {
        kind: "fingerprint",
        strategyId: "command-text-v1",
        unitType: "j",
        fields: [{ key: "te", presence: "present", values: ["echo *_[x]"] }],
      },
    },
    {
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
          unitName: "job",
          unitType: "j",
        },
      },
    },
  ];
  const unsupportedItems: SemanticDiffUnsupportedItem[] = [
    {
      id: "unsupported:null-target",
      kind: "uncalculated",
      side: null,
      reasonCode: "invalid-schedule-comparison-period",
      target: null,
      detail: detail({
        unitPath: null,
        parameterKey: null,
        scheduleRule: null,
        period: null,
      }),
      warning: null,
    },
    {
      id: "unsupported:target",
      kind: "uninterpretable",
      side: "after",
      reasonCode: "uninterpretable-file-monitoring-condition",
      target: { kind: "unit", unit: reference("after-unit") },
      detail: detail(),
      warning: warning("unsupported-warning", "unsupported fallback"),
    },
  ];
  const limitations: SemanticDiffLimitation[] = [
    {
      code: "invalid_schedule_comparison_period",
      kind: "uncalculated",
      side: "before",
      unitPath: null,
      detail: detail({ period: null }),
      warning: warning("limitation-warning", null),
    },
  ];
  return baseResult({
    changes: [attributeChange, relationChange, unitChange],
    identityDecisions,
    confirmationRequired: confirmations,
    unsupportedItems,
    limitations,
    scheduleComparison: {
      period: { from: "2026-04-01", to: "2026-05-01" },
      runChanges: [
        {
          id: "schedule:z",
          kind: "removed",
          unitPath: "/root/z",
          date: "2026-04-02",
          before: {
            unitPath: "/root/z",
            unitName: "z",
            rule: 1,
            date: "2026-04-02",
            time: "09:00",
          },
          after: null,
        },
        {
          id: "schedule:a",
          kind: "added",
          unitPath: "/root/a",
          date: "2026-04-01",
          before: null,
          after: {
            unitPath: "/root/a",
            unitName: "a",
            rule: 2,
            date: "2026-04-01",
            time: "10:00",
          },
        },
      ],
    },
  });
};

const emptyContext = (): SemanticDiffOutputContext =>
  buildSemanticDiffOutputContext(
    baseResult({
      inputs: {
        before: {
          side: "before",
          jobGroupPath: undefined,
          unitIds: [],
          relations: [],
        },
        after: {
          side: "after",
          jobGroupPath: undefined,
          unitIds: [],
          relations: [],
        },
      },
    }),
  );

suite("Semantic Diff JSON v1", () => {
  test("emits the empty v1 shape with explicit nulls and fixed key order", () => {
    const output = renderSemanticDiffJson(emptyContext());
    const document = JSON.parse(output.content) as Record<string, unknown>;

    assert.strictEqual(output.mediaType, "application/json; charset=utf-8");
    assert.ok(output.content.endsWith("\n"));
    assert.deepStrictEqual(Object.keys(document), [
      "schema",
      "schemaVersion",
      "summary",
      "result",
    ]);
    assert.strictEqual(document.schema, "ajsbutler.semantic-diff");
    assert.strictEqual(document.schemaVersion, 1);
    assert.deepStrictEqual(Object.keys(document.summary as object), [
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
    const result = document.result as Record<string, unknown>;
    assert.deepStrictEqual(Object.keys(result), [
      "inputs",
      "identityDecisions",
      "changes",
      "confirmationRequired",
      "unsupportedItems",
      "limitations",
      "schedule",
    ]);
    assert.strictEqual(result.schedule, null);
    assert.deepStrictEqual(
      Object.values(
        (document.summary as Record<string, unknown>)
          .changeCountsByKind as object,
      ),
      [0, 0, 0, 0, 0],
    );
    const inputs = result.inputs as Record<string, unknown>;
    const before = inputs.before as Record<string, unknown>;
    assert.deepStrictEqual(Object.keys(before), [
      "side",
      "jobGroupPath",
      "unitIds",
      "relations",
    ]);
    assert.strictEqual(before.jobGroupPath, null);
    assert.deepStrictEqual(before.unitIds, []);
    assert.deepStrictEqual(before.relations, []);
    assert.deepStrictEqual(result.identityDecisions, []);
    assert.deepStrictEqual(result.confirmationRequired, []);
    assert.deepStrictEqual(result.unsupportedItems, []);
    assert.deepStrictEqual(result.limitations, []);
    assert.strictEqual(output.content.includes("reportSections"), false);
    assert.strictEqual(output.content.includes('"details"'), false);
  });

  test("projects every populated v1 field, including all nine reason codes", () => {
    const result = populatedResult();
    const context = buildSemanticDiffOutputContext(result);
    const before = JSON.stringify(result);
    const document = buildSemanticDiffJsonV1(context);
    const serialized = serializeSemanticDiffJson(context);
    const parsed = JSON.parse(serialized) as typeof document;

    assert.deepStrictEqual(parsed, document);
    assert.strictEqual(JSON.stringify(result), before);
    assert.deepStrictEqual(Object.keys(document.result.inputs.before), [
      "side",
      "jobGroupPath",
      "unitIds",
      "relations",
    ]);
    assert.deepStrictEqual(document.result.inputs.before.unitIds, [
      "a",
      "a",
      "z",
    ]);
    assert.strictEqual(document.result.inputs.after.jobGroupPath, null);
    assert.deepStrictEqual(Object.keys(document.result.changes[0]), [
      "id",
      "kind",
      "elementKind",
      "confirmationLevel",
      "identityDecisionId",
      "before",
      "after",
      "relationPair",
      "attributeCategory",
    ]);
    const relation = document.result.changes.find(
      (change) => change.elementKind === "relation",
    );
    assert.ok(relation);
    assert.strictEqual(relation.identityDecisionId, null);
    assert.deepStrictEqual(Object.keys(relation.relationPair ?? {}), [
      "canonicalPair",
      "before",
      "after",
    ]);
    assert.deepStrictEqual(
      Object.keys(relation.relationPair?.canonicalPair ?? {}),
      ["sourceUnitId", "targetUnitId", "type"],
    );
    assert.deepStrictEqual(Object.keys(relation.relationPair?.before ?? {}), [
      "sourceUnitPath",
      "sourceUnitId",
      "targetUnitPath",
      "targetUnitId",
      "type",
    ]);
    assert.deepStrictEqual(
      document.result.confirmationRequired
        .map((item) => item.reasonCode)
        .sort(),
      [...allReasonCodes].sort(),
    );
    const confirmation = document.result.confirmationRequired.find(
      (item) => item.reasonCode === "conditional-relation-removed",
    );
    assert.ok(confirmation);
    assert.deepStrictEqual(Object.keys(confirmation.detail), [
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
    assert.deepStrictEqual(confirmation.detail.beforeValues, [
      "before-a",
      "before-a",
      "before-b",
    ]);
    assert.strictEqual(confirmation.warning?.fallbackText, "fallback-0");
    assert.ok(
      document.result.unsupportedItems.some((item) => item.target === null),
    );
    assert.strictEqual(
      document.result.schedule?.runChanges[0]?.id,
      "schedule:a",
    );
    assert.strictEqual(document.result.schedule?.runChanges[0]?.before, null);
    assert.ok(serialized.includes('"schemaVersion": 1'));
    assert.strictEqual(serialized.includes("execution-user-changed"), false);
  });

  test("keeps every nested wire shape explicit", () => {
    const document = buildSemanticDiffJsonV1(
      buildSemanticDiffOutputContext(populatedResult()),
    );
    const result = document.result;
    const identity = result.identityDecisions[0]!;
    const fingerprint = result.identityDecisions[1]!;
    const confirmation = result.confirmationRequired.find(
      (item) => item.reasonCode === "conditional-relation-removed",
    )!;
    const warningConfirmation = result.confirmationRequired.find(
      (item) => item.warning !== null,
    )!;
    const unsupported = result.unsupportedItems[0]!;
    const limitation = result.limitations[0]!;
    const runChange = result.schedule!.runChanges[0]!;

    assert.deepStrictEqual(Object.keys(result), [
      "inputs",
      "identityDecisions",
      "changes",
      "confirmationRequired",
      "unsupportedItems",
      "limitations",
      "schedule",
    ]);
    assert.deepStrictEqual(Object.keys(result.inputs), ["before", "after"]);
    assert.deepStrictEqual(Object.keys(result.inputs.before.relations[0]!), [
      "sourceUnitId",
      "targetUnitId",
      "type",
      "sourceUnitPath",
      "targetUnitPath",
    ]);
    assert.deepStrictEqual(Object.keys(identity), [
      "id",
      "status",
      "rule",
      "before",
      "after",
      "evidence",
    ]);
    if (identity.evidence.kind === "exact-key") {
      assert.deepStrictEqual(Object.keys(identity.evidence), ["kind", "key"]);
      assert.deepStrictEqual(Object.keys(identity.evidence.key), [
        "kind",
        "parentJobnetPath",
        "unitName",
        "unitType",
      ]);
    } else {
      assert.fail("expected the first identity decision to use an exact key");
    }
    if (fingerprint.evidence.kind === "fingerprint") {
      assert.deepStrictEqual(Object.keys(fingerprint.evidence), [
        "kind",
        "strategyId",
        "unitType",
        "fields",
      ]);
      assert.deepStrictEqual(Object.keys(fingerprint.evidence.fields[0]!), [
        "key",
        "presence",
        "values",
      ]);
    } else {
      assert.fail(
        "expected the second identity decision to use fingerprint evidence",
      );
    }
    assert.deepStrictEqual(Object.keys(confirmation), [
      "id",
      "reasonCode",
      "target",
      "relatedTargets",
      "detail",
      "constraints",
      "warning",
    ]);
    assert.deepStrictEqual(Object.keys(confirmation.detail), [
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
    assert.deepStrictEqual(Object.keys(confirmation.detail.relationPair!), [
      "canonicalPair",
      "before",
      "after",
    ]);
    assert.deepStrictEqual(
      Object.keys(confirmation.detail.relationPair!.canonicalPair),
      ["sourceUnitId", "targetUnitId", "type"],
    );
    assert.deepStrictEqual(Object.keys(confirmation.constraints[0]!), [
      "code",
      "detail",
      "warning",
    ]);
    assert.deepStrictEqual(Object.keys(warningConfirmation.warning!), [
      "code",
      "detail",
      "fallbackText",
    ]);
    assert.deepStrictEqual(Object.keys(unsupported), [
      "id",
      "kind",
      "side",
      "reasonCode",
      "target",
      "detail",
      "warning",
    ]);
    assert.deepStrictEqual(Object.keys(limitation), [
      "code",
      "kind",
      "side",
      "unitPath",
      "detail",
      "warning",
    ]);
    assert.deepStrictEqual(Object.keys(result.schedule!), [
      "period",
      "runChanges",
    ]);
    assert.deepStrictEqual(Object.keys(runChange), [
      "id",
      "kind",
      "unitPath",
      "date",
      "before",
      "after",
    ]);
    assert.deepStrictEqual(Object.keys(runChange.after!), [
      "unitPath",
      "unitName",
      "rule",
      "date",
      "time",
    ]);
  });

  test("uses the canonical strategy and key-kind tie-breakers", () => {
    const commandCandidate: SemanticDiffIdentityDecision = {
      id: "identity:candidate-command",
      status: "candidate",
      rule: "ambiguous-fingerprint",
      before: [reference("candidate-command", "command", "/z")],
      after: [reference("candidate-command-after", "command", "/z")],
      evidence: {
        kind: "fingerprint",
        strategyId: "command-text-v1",
        unitType: "j",
        fields: [],
      },
    };
    const executableCandidate: SemanticDiffIdentityDecision = {
      id: "identity:candidate-executable",
      status: "candidate",
      rule: "ambiguous-fingerprint",
      before: [reference("candidate-executable", "executable", "/a")],
      after: [reference("candidate-executable-after", "executable", "/a")],
      evidence: {
        kind: "fingerprint",
        strategyId: "executable-file-v1",
        unitType: "j",
        fields: [],
      },
    };
    const exactJobnet: SemanticDiffIdentityDecision = {
      id: "identity:exact-jobnet",
      status: "exact",
      rule: "exact-key",
      before: [reference("exact-jobnet", "jobnet", "/z")],
      after: [reference("exact-jobnet-after", "jobnet", "/z")],
      evidence: {
        kind: "exact-key",
        key: {
          kind: "jobnet",
          jobGroupRelativePath: "/jobs",
          unitType: "n",
        },
      },
    };
    const exactUnit: SemanticDiffIdentityDecision = {
      id: "identity:exact-unit",
      status: "exact",
      rule: "exact-key",
      before: [reference("exact-unit", "unit", "/a")],
      after: [reference("exact-unit-after", "unit", "/a")],
      evidence: {
        kind: "exact-key",
        key: {
          kind: "unit",
          parentJobnetPath: "/jobs",
          unitName: "unit",
          unitType: "j",
        },
      },
    };
    const document = buildSemanticDiffJsonV1(
      buildSemanticDiffOutputContext(
        baseResult({
          identityDecisions: [
            executableCandidate,
            exactUnit,
            commandCandidate,
            exactJobnet,
          ],
        }),
      ),
    );

    assert.deepStrictEqual(
      document.result.identityDecisions
        .filter((decision) => decision.status === "exact")
        .map(
          (decision) =>
            decision.evidence.kind === "exact-key" &&
            decision.evidence.key.kind,
        ),
      ["jobnet", "unit"],
    );
    assert.deepStrictEqual(
      document.result.identityDecisions
        .filter((decision) => decision.status === "candidate")
        .map(
          (decision) =>
            decision.evidence.kind === "fingerprint" &&
            decision.evidence.strategyId,
        ),
      ["command-text-v1", "executable-file-v1"],
    );
  });

  test("preserves fingerprint ID-remap relation evidence in JSON", () => {
    const identityDecisionId = "identity:remap";
    const result = baseResult({
      identityDecisions: [
        {
          id: identityDecisionId,
          status: "fingerprint-confirmed",
          rule: "one-to-one-fingerprint",
          before: [reference("before-source", "old", "/before/source")],
          after: [reference("after-source", "new", "/after/source")],
          evidence: {
            kind: "fingerprint",
            strategyId: "command-text-v1",
            unitType: "j",
            fields: [{ key: "te", presence: "present", values: ["echo"] }],
          },
        },
      ],
      changes: [
        {
          id: "change:remapped-unit",
          kind: "renamed",
          elementKind: "unit",
          confirmationLevel: "confirmed",
          identityDecisionId,
          before: {
            kind: "unit",
            unit: reference("before-source", "old", "/before/source"),
          },
          after: {
            kind: "unit",
            unit: reference("after-source", "new", "/after/source"),
          },
          relationPair: null,
        },
        {
          id: "change:remapped-relation",
          kind: "removed",
          elementKind: "relation",
          confirmationLevel: "confirmed",
          before: {
            kind: "relation",
            relation: {
              sourceUnitId: "before-source",
              targetUnitId: "target",
              type: "con",
            },
          },
          relationPair: {
            canonicalPair: {
              sourceUnitId: "after-source",
              targetUnitId: "target",
              type: "con",
            },
            before: {
              sourceUnitPath: "/before/source",
              sourceUnitId: "before-source",
              targetUnitPath: "/before/target",
              targetUnitId: "target",
              type: "con",
            },
            after: null,
          },
        },
      ],
    });
    const document = buildSemanticDiffJsonV1(
      buildSemanticDiffOutputContext(result),
    );
    const relation = document.result.changes.find(
      (change) => change.id === "change:remapped-relation",
    )!;
    const unit = document.result.changes.find(
      (change) => change.id === "change:remapped-unit",
    )!;

    assert.strictEqual(relation.identityDecisionId, null);
    assert.deepStrictEqual(relation.relationPair?.canonicalPair, {
      sourceUnitId: "after-source",
      targetUnitId: "target",
      type: "con",
    });
    assert.deepStrictEqual(relation.relationPair?.before, {
      sourceUnitPath: "/before/source",
      sourceUnitId: "before-source",
      targetUnitPath: "/before/target",
      targetUnitId: "target",
      type: "con",
    });
    assert.strictEqual(unit.identityDecisionId, identityDecisionId);
    assert.strictEqual(
      document.result.identityDecisions[0]!.evidence.kind,
      "fingerprint",
    );
  });

  test("preserves Japanese and JSON-special raw values", () => {
    const result = populatedResult();
    const raw = '日本語「確認」"quoted" \\ slash\nnext';
    result.inputs.before.jobGroupPath = raw;
    result.confirmationRequired[0]!.detail.rawValues = [raw];
    result.confirmationRequired[0]!.warning!.fallbackText = raw;
    const serialized = serializeSemanticDiffJson(
      buildSemanticDiffOutputContext(result),
    );
    const parsed = JSON.parse(serialized) as ReturnType<
      typeof buildSemanticDiffJsonV1
    >;
    const confirmation = parsed.result.confirmationRequired.find(
      (item) => item.warning?.fallbackText === raw,
    )!;

    assert.strictEqual(parsed.result.inputs.before.jobGroupPath, raw);
    assert.deepStrictEqual(confirmation.detail.rawValues, [raw]);
    assert.strictEqual(confirmation.warning!.fallbackText, raw);
    assert.ok(serialized.includes('\\"quoted\\"'));
    assert.ok(serialized.includes("\\\\ slash\\nnext"));
  });

  test("rejects undefined required fields before JSON serialization", () => {
    const invalidContexts: SemanticDiffOutputContext[] = [];
    const missingBoolean = summary();
    (
      missingBoolean as unknown as { hasFindings: boolean | undefined }
    ).hasFindings = undefined;
    invalidContexts.push(
      Object.freeze({ result: populatedResult(), summary: missingBoolean }),
    );

    const missingCount = summary();
    missingCount.changeCountsByKind.added = undefined as never;
    invalidContexts.push(
      Object.freeze({ result: populatedResult(), summary: missingCount }),
    );

    const missingPeriodFrom = populatedResult();
    missingPeriodFrom.scheduleComparison!.period.from = undefined as never;
    invalidContexts.push(buildSemanticDiffOutputContext(missingPeriodFrom));

    const missingPeriodTo = populatedResult();
    missingPeriodTo.scheduleComparison!.period.to = undefined as never;
    invalidContexts.push(buildSemanticDiffOutputContext(missingPeriodTo));

    const missingEndpointPath = populatedResult();
    const relation = missingEndpointPath.changes.find(
      (change) => change.elementKind === "relation",
    )!;
    relation.relationPair.before!.sourceUnitPath = undefined as never;
    invalidContexts.push(buildSemanticDiffOutputContext(missingEndpointPath));

    const missingDetailField = populatedResult();
    missingDetailField.confirmationRequired[0]!.detail.parameterKey =
      undefined as never;
    invalidContexts.push(buildSemanticDiffOutputContext(missingDetailField));

    const missingChangeId = populatedResult();
    missingChangeId.changes[0]!.id = undefined as never;
    invalidContexts.push(buildSemanticDiffOutputContext(missingChangeId));

    for (const context of invalidContexts) {
      assert.throws(
        () => serializeSemanticDiffJson(context),
        /requires|undefined value/,
      );
    }
  });

  test("retains equal-prefix nested records and duplicates", () => {
    const template = populatedResult().confirmationRequired[0]!;
    const short = {
      ...template,
      id: "same-confirmation",
      warning: null,
      detail: detail({ rawValues: ["prefix"] }),
    };
    const long = {
      ...template,
      id: "same-confirmation",
      warning: null,
      detail: detail({ rawValues: ["prefix", "suffix"] }),
    };
    const document = buildSemanticDiffJsonV1(
      buildSemanticDiffOutputContext(
        baseResult({ confirmationRequired: [long, short, short] }),
      ),
    );

    assert.strictEqual(document.result.confirmationRequired.length, 3);
    assert.deepStrictEqual(
      document.result.confirmationRequired.map((item) => item.detail.rawValues),
      [["prefix"], ["prefix"], ["prefix", "suffix"]],
    );
  });

  test("uses the supplied summary and retains deterministic nested ordering", () => {
    const result = populatedResult();
    const context: SemanticDiffOutputContext = Object.freeze({
      result,
      summary: summary({
        confirmationRequiredCount: 901,
        limitationCount: 902,
        scheduleRunChangeCount: 903,
        hasUncalculated: false,
        hasFindings: false,
      }),
    });
    const document = buildSemanticDiffJsonV1(context);

    assert.strictEqual(document.summary.confirmationRequiredCount, 901);
    assert.strictEqual(document.summary.hasUncalculated, false);
    assert.strictEqual(document.summary.hasFindings, false);
    assert.deepStrictEqual(
      document.result.identityDecisions.map((item) => item.status),
      ["exact", "fingerprint-confirmed"],
    );
    assert.deepStrictEqual(
      document.result.confirmationRequired.map((item) => item.id),
      [
        "confirmation:01",
        "confirmation:02",
        "confirmation:03",
        "confirmation:04",
        "confirmation:05",
        "confirmation:06",
        "confirmation:07",
        "confirmation:08",
        "confirmation:09",
      ],
    );
    assert.deepStrictEqual(
      document.result.confirmationRequired[0]?.relatedTargets.map(
        (target) => target.kind,
      ),
      ["attribute", "job-group"],
    );
    assert.deepStrictEqual(
      document.result.confirmationRequired[0]?.constraints[0]?.detail.rawValues,
      ["raw_1", "raw_2"],
    );
    assert.deepStrictEqual(
      document.result.schedule?.runChanges.map((item) => item.id),
      ["schedule:a", "schedule:z"],
    );
  });

  test("rejects unknown and superseded confirmation reason codes", () => {
    for (const reasonCode of [
      "execution-user-changed",
      "future-confirmation-reason",
    ]) {
      const invalid = populatedResult();
      invalid.confirmationRequired[0]!.reasonCode = reasonCode as never;

      assert.throws(
        () =>
          serializeSemanticDiffJson(buildSemanticDiffOutputContext(invalid)),
        /does not support confirmation reason/,
      );
    }
  });

  test("produces identical bytes across insertion order and rejects non-finite numbers", () => {
    const result = populatedResult();
    const shuffled = populatedResult();
    shuffled.inputs.before.unitIds.reverse();
    shuffled.inputs.before.relations.reverse();
    shuffled.changes.reverse();
    shuffled.identityDecisions.reverse();
    shuffled.confirmationRequired.reverse();
    shuffled.unsupportedItems.reverse();
    shuffled.limitations.reverse();
    shuffled.scheduleComparison?.runChanges.reverse();
    const first = serializeSemanticDiffJson(
      buildSemanticDiffOutputContext(result),
    );
    const second = serializeSemanticDiffJson(
      buildSemanticDiffOutputContext(shuffled),
    );

    assert.strictEqual(first, second);
    const invalid = populatedResult();
    invalid.scheduleComparison!.runChanges[0]!.before!.rule = Number.NaN;
    assert.throws(
      () => serializeSemanticDiffJson(buildSemanticDiffOutputContext(invalid)),
      /finite schedule rule/,
    );
  });

  test("uses locale-neutral UTF-16 ordering for raw values", () => {
    const result = baseResult({
      changes: [
        {
          id: "change:ä",
          kind: "added",
          elementKind: "job-group",
          confirmationLevel: "confirmed",
          after: { kind: "job-group", path: "ä" },
          relationPair: null,
        },
        {
          id: "change:z",
          kind: "added",
          elementKind: "job-group",
          confirmationLevel: "confirmed",
          after: { kind: "job-group", path: "z" },
          relationPair: null,
        },
        {
          id: "change:a",
          kind: "added",
          elementKind: "job-group",
          confirmationLevel: "confirmed",
          after: { kind: "job-group", path: "a" },
          relationPair: null,
        },
      ],
    });
    const previousLocale = process.env.LC_ALL;
    try {
      process.env.LC_ALL = "ja_JP.UTF-8";
      const japaneseLocaleBytes = serializeSemanticDiffJson(
        buildSemanticDiffOutputContext(result),
      );
      process.env.LC_ALL = "en_US.UTF-8";
      const englishLocaleBytes = serializeSemanticDiffJson(
        buildSemanticDiffOutputContext(result),
      );
      assert.strictEqual(japaneseLocaleBytes, englishLocaleBytes);
      assert.deepStrictEqual(
        JSON.parse(japaneseLocaleBytes).result.changes.map(
          (change: SemanticDiffChange) => change.id,
        ),
        ["change:a", "change:z", "change:ä"],
      );
    } finally {
      if (previousLocale === undefined) {
        delete process.env.LC_ALL;
      } else {
        process.env.LC_ALL = previousLocale;
      }
    }
  });

  test("serializes a large result without dropping records", () => {
    const result = baseResult({
      changes: Array.from(
        { length: 1000 },
        (_, index): SemanticDiffChange => ({
          id: `change:${String(index).padStart(4, "0")}`,
          kind: "added",
          elementKind: "job-group",
          confirmationLevel: "confirmed",
          after: { kind: "job-group", path: `/group/${index}` },
          relationPair: null,
        }),
      ),
    });
    const parsed = JSON.parse(
      serializeSemanticDiffJson(buildSemanticDiffOutputContext(result)),
    ) as { result: { changes: SemanticDiffChange[] } };

    assert.strictEqual(parsed.result.changes.length, 1000);
    assert.strictEqual(parsed.result.changes[0]!.id, "change:0000");
    assert.strictEqual(parsed.result.changes[999]!.id, "change:0999");
  });
});
