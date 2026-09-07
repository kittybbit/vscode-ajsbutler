import * as assert from "assert";
import {
  buildSemanticDiffExplorerViewModel,
  createSemanticDiffExplorerSession,
  filterSemanticDiffExplorerViewModel,
  semanticDiffChangeTargetSide,
  semanticDiffConfirmationTargetSide,
  setSemanticDiffExplorerFilter,
  getSemanticDiffExplorerActionIds,
} from "../../application/semantic-diff/semanticDiffExplorerProjection";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
  isSemanticDiffExplorerActionId,
  type SemanticDiffExplorerLeaf,
  type SemanticDiffExplorerTreeNode,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import { isSemanticDiffExplorerViewModel } from "../../application/semantic-diff/semanticDiffExplorerMessages";
import { isSemanticDiffExplorerLeaf } from "../../application/semantic-diff/semanticDiffExplorerLeafGuards";
import { placementForTarget, placementForLeaf } from "../../application/semantic-diff/semanticDiffExplorerProjectionPaths";
import {
  cloneTarget,
  createActionSet,
} from "../../application/semantic-diff/semanticDiffExplorerProjectionSupport";
import { createSemanticDiffDetail } from "../../application/semantic-diff/semanticDiffStructuredFacts";
import type {
  SemanticDiffChange,
  SemanticDiffConfirmationReason,
  SemanticDiffRelationPair,
  SemanticDiffResult,
  SemanticDiffOutputContext,
  SemanticDiffTarget,
} from "../../application/semantic-diff/semanticDiffDto";

const summary = {
  changeCountsByKind: {
    added: 1,
    removed: 1,
    changed: 1,
    renamed: 1,
    moved: 1,
  },
  changeCountsByElementKind: {
    "job-group": 1,
    jobnet: 1,
    unit: 1,
    relation: 1,
    attribute: 1,
  },
  changeCountsByAttributeCategory: {
    "execution-environment": 0,
    "execution-definition": 1,
    "start-condition": 0,
    "end-control": 0,
    "abnormal-end-control": 0,
    "wait-condition": 0,
    "external-integration": 0,
    schedule: 0,
  },
  unsupportedCountsByKind: {
    unsupported: 1,
    uninterpretable: 0,
    uncalculated: 0,
  },
  confirmationRequiredCount: 2,
  limitationCount: 1,
  scheduleRunChangeCount: 1,
  hasUncalculated: false,
  hasFindings: true,
};

const target = (id: string, path = `/root/${id}`) => ({
  kind: "unit" as const,
  unit: { id, name: id, absolutePath: path, unitType: "j" },
});

const change = (
  id: string,
  kind: SemanticDiffChange["kind"],
  before?: ReturnType<typeof target>,
  after?: ReturnType<typeof target>,
): SemanticDiffChange => ({
  id,
  kind,
  elementKind: "unit",
  confirmationLevel: kind === "changed" ? "confirmation-required" : "confirmed",
  before,
  after,
  relationPair: null,
  identityDecisionId: `identity:${id}`,
});

const relationPair: SemanticDiffRelationPair = {
  canonicalPair: {
    sourceUnitId: "source",
    targetUnitId: "target",
    type: "seq",
  },
  before: {
    sourceUnitPath: "/authoritative/before/source",
    sourceUnitId: "source",
    targetUnitPath: "/authoritative/before/target",
    targetUnitId: "target",
    type: "seq",
  },
  after: {
    sourceUnitPath: "/authoritative/after/source",
    sourceUnitId: "source",
    targetUnitPath: "/authoritative/after/target",
    targetUnitId: "target",
    type: "seq",
  },
};

const relationTarget: SemanticDiffTarget = {
  kind: "relation",
  relation: {
    sourceUnitId: "source",
    targetUnitId: "target",
    type: "seq",
    sourceUnitPath: "/display/must-not-be-used/source",
    targetUnitPath: "/display/must-not-be-used/target",
  },
};

const confirmationReasons: readonly SemanticDiffConfirmationReason[] = [
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

const confirmationTargets: readonly SemanticDiffTarget[] = [
  { kind: "job-group", path: "/groups/batch" },
  {
    kind: "jobnet",
    unit: {
      id: "jobnet",
      name: "jobnet",
      absolutePath: "/groups/jobnet",
      unitType: "j",
    },
  },
  target("unit", "/groups/unit"),
  relationTarget,
  {
    kind: "attribute",
    unit: {
      id: "attribute",
      name: "attribute",
      absolutePath: "/groups/attribute",
      unitType: "j",
    },
    parameterKey: "sc",
    category: "schedule",
    values: ["daily"],
  },
];

const confirmationsResult = (
  reasons: readonly SemanticDiffConfirmationReason[] = confirmationReasons,
): SemanticDiffResult => ({
  inputs: {
    before: { side: "before", unitIds: [], relations: [] },
    after: { side: "after", unitIds: [], relations: [] },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: reasons.map((reason, index) => ({
    id: `confirmation-${index}`,
    reasonCode: reason,
    target: confirmationTargets[index % confirmationTargets.length],
    relatedTargets: [],
    detail: createSemanticDiffDetail({
      relationPair:
        confirmationTargets[index % confirmationTargets.length].kind ===
        "relation"
          ? relationPair
          : null,
    }),
    constraints: [],
    warning: null,
  })),
  unsupportedItems: [],
  limitations: [],
});

const duplicateIdResult = (reversed = false): SemanticDiffResult => {
  const records = [
    {
      id: "duplicate",
      reasonCode: "wait-target-changed" as const,
      target: target("first-duplicate", "/groups/first"),
    },
    {
      id: "duplicate",
      reasonCode: "wait-target-changed" as const,
      target: target("second-duplicate", "/groups/second"),
    },
  ];
  const ordered = reversed ? records.reverse() : records;
  return {
    ...confirmationsResult([]),
    confirmationRequired: ordered.map((record) => ({
      ...record,
      relatedTargets: [],
      detail: createSemanticDiffDetail(),
      constraints: [],
      warning: null,
    })),
  };
};

const confirmationSummary = (count: number) => ({
  changeCountsByKind: {
    added: 0,
    removed: 0,
    changed: 0,
    renamed: 0,
    moved: 0,
  },
  changeCountsByElementKind: {
    "job-group": 0,
    jobnet: 0,
    unit: 0,
    relation: 0,
    attribute: 0,
  },
  changeCountsByAttributeCategory: {
    "execution-environment": 0,
    "execution-definition": 0,
    "start-condition": 0,
    "end-control": 0,
    "abnormal-end-control": 0,
    "wait-condition": 0,
    "external-integration": 0,
    schedule: 0,
  },
  unsupportedCountsByKind: {
    unsupported: 0,
    uninterpretable: 0,
    uncalculated: 0,
  },
  confirmationRequiredCount: count,
  limitationCount: 0,
  scheduleRunChangeCount: 0,
  hasUncalculated: false,
  hasFindings: count > 0,
});

const leavesInTree = (
  node: SemanticDiffExplorerTreeNode,
): SemanticDiffExplorerLeaf[] => [
  ...node.leaves,
  ...node.children.flatMap((child) => leavesInTree(child)),
];

const result = (): SemanticDiffResult => ({
  inputs: {
    before: { side: "before", unitIds: [], relations: [] },
    after: { side: "after", unitIds: [], relations: [] },
  },
  changes: [
    change("added", "added", undefined, target("added", "/root/z/added")),
    change("removed", "removed", target("removed", "/root/a/removed")),
    change(
      "changed",
      "changed",
      target("changed-before"),
      target("changed", "/root/b/changed"),
    ),
    change(
      "renamed",
      "renamed",
      target("old"),
      target("renamed", "/root/c/renamed"),
    ),
    change(
      "moved",
      "moved",
      target("old-location", "/root/d/old-location"),
      target("moved", "/root/d/moved"),
    ),
  ],
  identityDecisions: [],
  confirmationRequired: [
    {
      id: "confirmation",
      reasonCode: "conditional-relation-removed",
      target: target("conditional", "/root/e/conditional"),
      relatedTargets: [],
      detail: createSemanticDiffDetail(),
      constraints: [],
      warning: null,
    },
  ],
  unsupportedItems: [
    {
      id: "unsupported",
      kind: "unsupported",
      side: "after",
      reasonCode: "cycle-schedule",
      target: target("unsupported", "/root/f/unsupported"),
      detail: createSemanticDiffDetail(),
      warning: null,
    },
  ],
  limitations: [
    {
      code: "limit",
      kind: "normalization",
      side: "after",
      unitPath: null,
      detail: createSemanticDiffDetail(),
      warning: null,
    },
  ],
  scheduleComparison: {
    period: { from: "2026-01-01", to: "2026-01-02" },
    runChanges: [
      {
        id: "run",
        kind: "changed-time",
        unitPath: "/root/g/scheduled",
        date: "2026-01-01",
        before: {
          unitPath: "/root/g/scheduled",
          unitName: "scheduled",
          rule: 1,
          date: "2026-01-01",
          time: "01:00",
        },
        after: {
          unitPath: "/root/g/scheduled",
          unitName: "scheduled",
          rule: 1,
          date: "2026-01-01",
          time: "02:00",
        },
      },
    ],
  },
});

suite("Semantic Diff Explorer projection", () => {
  test("uses the supplied summary and retains every record in deterministic groups", () => {
    const context = Object.freeze({ result: result(), summary });
    const view = buildSemanticDiffExplorerViewModel(context, {
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    assert.strictEqual(view.cards.length, 7);
    assert.strictEqual(view.cards[0].count, 5);
    assert.strictEqual(view.leafCount, 9);
    assert.strictEqual(view.status, "findings");
    assert.ok(isSemanticDiffExplorerViewModel(view));
    assert.strictEqual(
      view.tree.children[view.tree.children.length - 1].label,
      "Comparison-level findings",
    );
    assert.strictEqual(view.tree.children[0].label, "root");
    const leaves: SemanticDiffExplorerLeaf[] = [];
    const visit = (node: typeof view.tree): void => {
      leaves.push(...node.leaves);
      node.children.forEach(visit);
    };
    visit(view.tree);
    assert.deepStrictEqual(leaves.map((leaf) => leaf.recordId).sort(), [
      "added",
      "changed",
      "confirmation",
      "limit",
      "moved",
      "removed",
      "renamed",
      "run",
      "unsupported",
    ]);
    assert.strictEqual(
      leaves.find((leaf) => leaf.recordId === "removed")?.targetSide,
      "before",
    );
    assert.strictEqual(
      leaves.find((leaf) => leaf.recordId === "changed")?.targetSide,
      "after",
    );
    const actionId = leaves.find((leaf) => leaf.recordId === "changed")?.actions
      .source.actionId;
    assert.ok(
      actionId !== null &&
        actionId !== undefined &&
        isSemanticDiffExplorerActionId(actionId),
    );
  });

  test("applies the exhaustive change and confirmation side mappings", () => {
    assert.deepStrictEqual(
      ["added", "removed", "changed", "renamed", "moved"].map((kind) =>
        semanticDiffChangeTargetSide(kind as SemanticDiffChange["kind"]),
      ),
      ["after", "before", "after", "after", "after"],
    );
    const reasons = [
      "conditional-relation-removed",
      "wait-release-source-changed",
      "timeout-removed",
      "condition-judgment-changed",
      "wait-target-changed",
      "no-calculated-schedule-run",
      "calculated-schedule-run-removed",
      "execution-user-type-changed",
      "jp1-resource-group-changed",
    ] as const;
    assert.deepStrictEqual(reasons.map(semanticDiffConfirmationTargetSide), [
      "before",
      "after",
      "after",
      "after",
      "after",
      "after",
      "after",
      "after",
      "after",
    ]);
  });

  test("fails closed for prototype-looking projection and leaf keys", () => {
    const reservedKeys = ["toString", "constructor", "__proto__"] as const;
    for (const key of reservedKeys) {
      const malformedTarget = { kind: key } as unknown as SemanticDiffTarget;
      assert.doesNotThrow(() => cloneTarget(malformedTarget));
      assert.strictEqual(cloneTarget(malformedTarget), null);
      assert.doesNotThrow(() => placementForTarget(malformedTarget));
      assert.strictEqual(placementForTarget(malformedTarget), null);
      const actionSet = createActionSet({
        side: key as "before",
        target: relationTarget,
        actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
        relationPair,
      });
      assert.strictEqual(actionSet.flow.available, false);
      assert.strictEqual(
        semanticDiffChangeTargetSide(key as SemanticDiffChange["kind"]),
        undefined,
      );
      assert.strictEqual(
        semanticDiffConfirmationTargetSide(key as SemanticDiffConfirmationReason),
        undefined,
      );
      const malformedLeaf = { kind: key } as unknown as SemanticDiffExplorerLeaf;
      assert.doesNotThrow(() => isSemanticDiffExplorerLeaf(malformedLeaf));
      assert.strictEqual(isSemanticDiffExplorerLeaf(malformedLeaf), false);
      assert.doesNotThrow(() => placementForLeaf(malformedLeaf));
      assert.strictEqual(placementForLeaf(malformedLeaf), null);
    }
  });

  test("filters confirmation records without changing cards or context identity", () => {
    const context = Object.freeze({ result: result(), summary });
    const session = createSemanticDiffExplorerSession(context, {
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    const filtered = setSemanticDiffExplorerFilter(
      session,
      "confirmation-required",
    );
    assert.strictEqual(filtered.context, context);
    assert.strictEqual(filtered.sessionId, session.sessionId);
    assert.strictEqual(filtered.viewModel.cards, session.viewModel.cards);
    assert.strictEqual(filtered.viewModel.leafCount, 2);
    assert.strictEqual(filtered.viewModel.status, "findings");
    assert.strictEqual(
      filterSemanticDiffExplorerViewModel(filtered.viewModel, "all").leafCount,
      session.viewModel.leafCount,
    );
    assert.strictEqual(
      filterSemanticDiffExplorerViewModel(session.viewModel, "all"),
      session.viewModel,
    );
  });

  test("keeps zero-inclusive cards and distinguishes empty filter results", () => {
    const emptyContext = Object.freeze({
      result: {
        inputs: {
          before: { side: "before" as const, unitIds: [], relations: [] },
          after: { side: "after" as const, unitIds: [], relations: [] },
        },
        changes: [],
        identityDecisions: [],
        confirmationRequired: [],
        unsupportedItems: [],
        limitations: [],
      },
      summary: {
        changeCountsByKind: {
          added: 0,
          removed: 0,
          changed: 0,
          renamed: 0,
          moved: 0,
        },
        changeCountsByElementKind: {
          "job-group": 0,
          jobnet: 0,
          unit: 0,
          relation: 0,
          attribute: 0,
        },
        changeCountsByAttributeCategory: {
          "execution-environment": 0,
          "execution-definition": 0,
          "start-condition": 0,
          "end-control": 0,
          "abnormal-end-control": 0,
          "wait-condition": 0,
          "external-integration": 0,
          schedule: 0,
        },
        unsupportedCountsByKind: {
          unsupported: 0,
          uninterpretable: 0,
          uncalculated: 0,
        },
        confirmationRequiredCount: 0,
        limitationCount: 0,
        scheduleRunChangeCount: 0,
        hasUncalculated: false,
        hasFindings: false,
      },
    });
    const view = buildSemanticDiffExplorerViewModel(emptyContext);
    assert.strictEqual(view.leafCount, 0);
    assert.strictEqual(view.status, "empty");
    assert.strictEqual(view.cards.length, 7);
    assert.strictEqual(
      filterSemanticDiffExplorerViewModel(view, "confirmation-required").status,
      "filter-empty",
    );
  });

  test("projects every confirmation reason and target kind", () => {
    const result = confirmationsResult();
    const context = Object.freeze({
      result,
      summary: confirmationSummary(result.confirmationRequired.length),
    });
    const view = buildSemanticDiffExplorerViewModel(context, {
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    const leaves = leavesInTree(view.tree);
    assert.strictEqual(leaves.length, confirmationReasons.length);
    assert.deepStrictEqual(
      leaves.map((leaf) => leaf.recordId).sort(),
      confirmationReasons.map((_, index) => `confirmation-${index}`).sort(),
    );
    const sideById = new Map(
      leaves.map((leaf) => [leaf.recordId, leaf.targetSide]),
    );
    assert.strictEqual(sideById.get("confirmation-0"), "before");
    confirmationReasons.slice(1).forEach((_, index) => {
      assert.strictEqual(sideById.get(`confirmation-${index + 1}`), "after");
    });
    assert.deepStrictEqual(
      new Set(
        leaves
          .filter((leaf) => "target" in leaf)
          .map((leaf) =>
            "target" in leaf ? leaf.target.value?.kind : undefined,
          ),
      ),
      new Set(["job-group", "jobnet", "unit", "relation", "attribute"]),
    );
    const relationLeaf = leaves.find(
      (leaf) => "target" in leaf && leaf.target.value?.kind === "relation",
    );
    assert.strictEqual(
      (
        relationLeaf as unknown as {
          target: { value: { kind?: string } | null };
        }
      )?.target.value?.kind,
      "relation",
    );
    const authoritativeGroup = view.tree.children.find(
      (child) => child.path === "/authoritative",
    );
    const relationGroup = authoritativeGroup?.children.find(
      (child) => child.path === "/authoritative/after",
    );
    assert.ok(relationGroup);
    assert.strictEqual(
      relationGroup?.leaves.some((leaf) => {
        if (!("target" in leaf)) return false;
        return leaf.target.value?.kind === "relation";
      }),
      true,
    );
    assert.strictEqual(
      relationGroup?.children.some((child) =>
        child.path?.startsWith("/display"),
      ),
      false,
    );
  });

  test("keeps duplicate records and hierarchy order deterministic", () => {
    const duplicate = duplicateIdResult();
    const duplicateView = buildSemanticDiffExplorerViewModel(
      Object.freeze({
        result: duplicate,
        summary: confirmationSummary(2),
      }),
      { actionIdAllocator: createSemanticDiffExplorerActionIdAllocator() },
    );
    const duplicateLeaves = leavesInTree(duplicateView.tree);
    assert.strictEqual(duplicateLeaves.length, 2);
    assert.deepStrictEqual(
      duplicateLeaves.map((leaf) => leaf.recordId),
      ["duplicate", "duplicate"],
    );
    assert.notStrictEqual(duplicateLeaves[0].id, duplicateLeaves[1].id);

    const original = duplicateIdResult();
    const shuffled = duplicateIdResult(true);
    const shuffledView = buildSemanticDiffExplorerViewModel(
      Object.freeze({ result: shuffled, summary: confirmationSummary(2) }),
      { actionIdAllocator: createSemanticDiffExplorerActionIdAllocator() },
    );
    const stableKeys = (view: typeof duplicateView): readonly string[] =>
      leavesInTree(view.tree).map((leaf) => leaf.id);
    const originalView = buildSemanticDiffExplorerViewModel(
      Object.freeze({ result: original, summary: confirmationSummary(2) }),
      { actionIdAllocator: createSemanticDiffExplorerActionIdAllocator() },
    );
    assert.deepStrictEqual(
      leavesInTree(originalView.tree).map((leaf) =>
        leaf.kind === "confirmation" && leaf.target.value?.kind === "unit"
          ? leaf.target.value.unit.id
          : undefined,
      ),
      ["first-duplicate", "second-duplicate"],
    );
    assert.deepStrictEqual(
      leavesInTree(shuffledView.tree).map((leaf) =>
        leaf.kind === "confirmation" && leaf.target.value?.kind === "unit"
          ? leaf.target.value.unit.id
          : undefined,
      ),
      ["first-duplicate", "second-duplicate"],
    );
    assert.deepStrictEqual(stableKeys(originalView), [
      "confirmation:duplicate:0",
      "confirmation:duplicate:1",
    ]);
    assert.deepStrictEqual(stableKeys(shuffledView), [
      "confirmation:duplicate:1",
      "confirmation:duplicate:0",
    ]);
  });

  test("retains candidate changes and uncalculated unsupported findings", () => {
    const candidateChange: SemanticDiffChange = {
      id: "candidate",
      kind: "changed",
      elementKind: "unit",
      confirmationLevel: "candidate",
      before: target("candidate-before", "/groups/candidate"),
      after: target("candidate-after", "/groups/candidate"),
      relationPair: null,
      identityDecisionId: "identity:candidate",
    };
    let summaryReads = 0;
    const candidateSummary = {
      ...confirmationSummary(0),
      changeCountsByKind: {
        added: 0,
        removed: 0,
        changed: 1,
        renamed: 0,
        moved: 0,
      },
      changeCountsByElementKind: {
        "job-group": 0,
        jobnet: 0,
        unit: 1,
        relation: 0,
        attribute: 0,
      },
      hasFindings: true,
    };
    const candidateContext = {
      result: { ...confirmationsResult([]), changes: [candidateChange] },
      get summary() {
        summaryReads += 1;
        return candidateSummary;
      },
    } as SemanticDiffOutputContext;
    const candidateView = buildSemanticDiffExplorerViewModel(candidateContext, {
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    assert.strictEqual(summaryReads, 1);
    const candidateLeaf = leavesInTree(candidateView.tree).find(
      (leaf) => leaf.recordId === "candidate",
    );
    assert.strictEqual(candidateLeaf?.kind, "change");
    assert.strictEqual(
      candidateLeaf?.kind === "change"
        ? candidateLeaf.confirmationLevel
        : undefined,
      "candidate",
    );
    assert.strictEqual(
      filterSemanticDiffExplorerViewModel(
        candidateView,
        "confirmation-required",
      ).status,
      "filter-empty",
    );

    const uncalculatedResult = {
      ...confirmationsResult([]),
      unsupportedItems: [
        {
          id: "uncalculated",
          kind: "uncalculated" as const,
          side: null,
          reasonCode: "invalid-start-time" as const,
          target: null,
          detail: createSemanticDiffDetail(),
          warning: null,
        },
      ],
    };
    const uncalculatedView = buildSemanticDiffExplorerViewModel(
      Object.freeze({
        result: uncalculatedResult,
        summary: {
          ...confirmationSummary(0),
          unsupportedCountsByKind: {
            unsupported: 0,
            uninterpretable: 0,
            uncalculated: 1,
          },
          hasUncalculated: true,
          hasFindings: true,
        },
      }),
      { actionIdAllocator: createSemanticDiffExplorerActionIdAllocator() },
    );
    const uncalculatedLeaf = leavesInTree(uncalculatedView.tree).find(
      (leaf) => leaf.recordId === "uncalculated",
    );
    assert.strictEqual(uncalculatedLeaf?.kind, "unsupported");
    assert.strictEqual(
      uncalculatedLeaf?.kind === "unsupported"
        ? uncalculatedLeaf.unsupportedKind
        : undefined,
      "uncalculated",
    );
    assert.strictEqual(
      uncalculatedLeaf?.actions.flow.unavailableReason,
      "missing-target-side",
    );
    assert.ok(isSemanticDiffExplorerViewModel(uncalculatedView));
  });

  test("orders hierarchy labels by UTF-16 code units", () => {
    const jobGroupChange = (id: string, path: string): SemanticDiffChange => ({
      id,
      kind: "added",
      elementKind: "job-group",
      confirmationLevel: "confirmed",
      after: { kind: "job-group", path },
      relationPair: null,
    });
    const changes = [
      jobGroupChange("private-use", "/root/\uE000"),
      jobGroupChange("astral", "/root/\u{1F600}"),
    ];
    const context = Object.freeze({
      result: {
        ...confirmationsResult([]),
        changes,
      },
      summary: confirmationSummary(0),
    });
    const view = buildSemanticDiffExplorerViewModel(context, {
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    const rootGroup = view.tree.children.find(
      (child) => child.path === "/root",
    );
    assert.deepStrictEqual(
      rootGroup?.children.map((child) => child.label),
      ["\u{1F600}", "\uE000"],
    );
  });

  test("encapsulates action membership in the session", () => {
    const context = Object.freeze({ result: result(), summary });
    const session = createSemanticDiffExplorerSession(context, {
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    const lookup = session.actionIds;
    const ids = getSemanticDiffExplorerActionIds(session);
    assert.strictEqual(lookup.size, ids.length);
    assert.ok(Object.isFrozen(lookup));
    assert.ok(Object.isFrozen(ids));
    assert.throws(() => {
      (lookup as unknown as { size: number }).size = 0;
    });
    assert.throws(() => {
      (ids as unknown as string[]).push(ids[0]);
    });
    assert.strictEqual(lookup.has(ids[0]), true);
    assert.strictEqual(lookup.has("sde-action-999"), false);
  });
});
