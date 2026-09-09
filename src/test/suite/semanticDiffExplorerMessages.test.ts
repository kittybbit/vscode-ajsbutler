import * as assert from "assert";
import {
  createSemanticDiffExplorerActionId,
  createSemanticDiffExplorerSessionId,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import {
  createSemanticDiffExplorerActionRequest,
  createSemanticDiffExplorerError,
  createSemanticDiffExplorerFailureMessage,
  createSemanticDiffExplorerReadyRequest,
  isSemanticDiffExplorerMessage,
  parseSemanticDiffExplorerHostMessage,
  parseSemanticDiffExplorerRequest,
  parseSemanticDiffExplorerReply,
  serializeSemanticDiffExplorerMessage,
  SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES,
  validateSemanticDiffExplorerMessage,
} from "../../application/semantic-diff/semanticDiffExplorerMessages";
import type { SemanticDiffExplorerViewModel } from "../../application/semantic-diff/semanticDiffExplorerDto";
import { isSemanticDiffExplorerCard } from "../../application/semantic-diff/semanticDiffExplorerViewGuards";
import { isSemanticDiffTarget } from "../../application/semantic-diff/semanticDiffExplorerRecordGuards";

const sessionId = createSemanticDiffExplorerSessionId(1);
const actionId = createSemanticDiffExplorerActionId(1);

const view = (): SemanticDiffExplorerViewModel => ({
  filter: "all",
  cards: [
    {
      id: "changes",
      count: 0,
      counts: { added: 0, removed: 0, changed: 0, renamed: 0, moved: 0 },
    },
    {
      id: "elements",
      count: 0,
      counts: { "job-group": 0, jobnet: 0, unit: 0, relation: 0, attribute: 0 },
    },
    {
      id: "attributes",
      count: 0,
      counts: {
        "execution-environment": 0,
        "execution-definition": 0,
        "start-condition": 0,
        "end-control": 0,
        "abnormal-end-control": 0,
        "wait-condition": 0,
        "external-integration": 0,
        schedule: 0,
      },
    },
    { id: "confirmation-required", count: 0, counts: { required: 0 } },
    {
      id: "unsupported",
      count: 0,
      counts: { unsupported: 0, uninterpretable: 0, uncalculated: 0 },
    },
    { id: "limitations", count: 0, counts: { total: 0 } },
    { id: "schedule-run-changes", count: 0, counts: { total: 0 } },
  ],
  tree: {
    id: "root",
    kind: "root",
    label: "Semantic Diff",
    path: null,
    children: [],
    leaves: [],
  },
  leafCount: 0,
  status: "empty",
});

const unitTarget = {
  kind: "unit" as const,
  unit: {
    id: "unit",
    name: "Unit",
    absolutePath: "/group/unit",
    unitType: "j",
  },
};

const detail = () => ({
  unitPath: null,
  parameterKey: null,
  relationPair: {
    canonicalPair: {
      sourceUnitId: "source",
      targetUnitId: "target",
      type: "seq" as const,
    },
    before: {
      sourceUnitPath: "/group/source",
      sourceUnitId: "source",
      targetUnitPath: "/group/target",
      targetUnitId: "target",
      type: "seq" as const,
    },
    after: null,
  },
  scheduleRule: null,
  period: { from: "2026-01-01", to: "2026-01-02" },
  beforeValues: ["before"],
  afterValues: ["after"],
  rawValues: [],
  removedSources: [],
});

const validConfirmationView = (): SemanticDiffExplorerViewModel => {
  const confirmation = {
    kind: "confirmation" as const,
    id: "confirmation:one:0",
    recordId: "one",
    reasonCode: "conditional-relation-removed" as const,
    targetSide: "before" as const,
    target: { side: "before" as const, value: unitTarget },
    relatedTargets: [],
    detail: detail(),
    constraints: [
      { code: "comparison-period" as const, detail: detail(), warning: null },
    ],
    warning: { code: "warning", detail: detail(), fallbackText: null },
    actions: {
      source: {
        available: true,
        actionId: actionId,
        unavailableReason: null,
      },
      flow: {
        available: true,
        actionId: createSemanticDiffExplorerActionId(2),
        unavailableReason: null,
      },
    },
  };
  return {
    ...view(),
    cards: view().cards.map((card) =>
      card.id === "confirmation-required"
        ? { ...card, count: 1, counts: { required: 1 } }
        : card,
    ),
    tree: {
      ...view().tree,
      children: [
        {
          id: "unit:/group",
          kind: "unit",
          label: "group",
          path: "/group",
          children: [],
          leaves: [confirmation],
        },
      ],
    },
    leafCount: 1,
    status: "findings",
  };
};

const validSessionMessage = () => ({
  type: "session" as const,
  sessionId,
  requestId: null,
  actionId: null,
  ok: true as const,
  payload: validConfirmationView(),
  error: null,
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

type Mutable<T> = {
  -readonly [K in keyof T]: T[K] extends readonly (infer Item)[]
    ? Mutable<Item>[]
    : T[K] extends object
      ? Mutable<T[K]>
      : T[K];
};

const cloneMutable = <T>(value: T): Mutable<T> =>
  JSON.parse(JSON.stringify(value)) as Mutable<T>;

suite("Semantic Diff Explorer messages", () => {
  test("accepts exact request envelopes and rejects malformed correlation fields", () => {
    const ready = createSemanticDiffExplorerReadyRequest(sessionId, 1);
    assert.deepStrictEqual(parseSemanticDiffExplorerRequest(ready), ready);
    assert.strictEqual(
      parseSemanticDiffExplorerRequest({ ...ready, requestId: Infinity }),
      undefined,
    );
    assert.strictEqual(
      parseSemanticDiffExplorerRequest({ ...ready, extra: true }),
      undefined,
    );
    assert.strictEqual(
      parseSemanticDiffExplorerRequest({ ...ready, actionId: actionId }),
      undefined,
    );
    assert.strictEqual(
      parseSemanticDiffExplorerRequest(ready, {
        expectedSessionId: createSemanticDiffExplorerSessionId(2),
      }),
      undefined,
    );
    const stale = validateSemanticDiffExplorerMessage(ready, {
      minimumRequestId: 1,
    });
    assert.strictEqual("code" in stale ? stale.code : null, "stale-request");
    assert.deepStrictEqual(
      parseSemanticDiffExplorerRequest(
        createSemanticDiffExplorerActionRequest(sessionId, 2, actionId),
        { actionIds: new Set([actionId]) },
      )?.actionId,
      actionId,
    );
  });

  test("enforces reply success/failure nullability and host action-result shape", () => {
    const success = {
      type: "ready",
      sessionId,
      requestId: 1,
      actionId: null,
      ok: true,
      payload: view(),
      error: null,
    } as const;
    assert.ok(parseSemanticDiffExplorerReply(success));
    assert.strictEqual(
      parseSemanticDiffExplorerReply({ ...success, payload: null }),
      undefined,
    );
    const failure = {
      type: "action",
      sessionId,
      requestId: 2,
      actionId,
      ok: false,
      payload: null,
      error: createSemanticDiffExplorerError("unknown-action"),
    } as const;
    assert.ok(
      parseSemanticDiffExplorerReply(failure, {
        actionIds: new Set([actionId]),
      }),
    );
    assert.strictEqual(
      parseSemanticDiffExplorerReply(
        { ...failure, error: null },
        { actionIds: new Set([actionId]) },
      ),
      undefined,
    );
    const host = { ...failure, type: "action-result" } as const;
    assert.ok(
      parseSemanticDiffExplorerHostMessage(host, {
        actionIds: new Set([actionId]),
      }),
    );
    assert.strictEqual(
      parseSemanticDiffExplorerHostMessage(
        { ...host, extra: true },
        { actionIds: new Set([actionId]) },
      ),
      undefined,
    );
  });

  test("rejects cross-brand/unknown IDs and enforces the serialized payload limit", () => {
    const ready = createSemanticDiffExplorerReadyRequest(sessionId, 1);
    assert.strictEqual(
      parseSemanticDiffExplorerRequest({ ...ready, sessionId: actionId }),
      undefined,
    );
    const unknown = createSemanticDiffExplorerActionRequest(
      sessionId,
      1,
      createSemanticDiffExplorerActionId(2),
    );
    const validation = validateSemanticDiffExplorerMessage(unknown, {
      actionIds: new Set([actionId]),
    });
    assert.strictEqual(
      "code" in validation ? validation.code : null,
      "unknown-action",
    );
    assert.ok(isSemanticDiffExplorerMessage(ready));
    const serialized = serializeSemanticDiffExplorerMessage(ready);
    assert.strictEqual(serialized.ok, true);
    const oversized = serializeSemanticDiffExplorerMessage(
      { ...ready, padding: "x" },
      { maxBytes: 10 },
    );
    assert.deepStrictEqual(oversized, {
      ok: false,
      error: { code: "payload-too-large", detail: null },
    });
  });

  test("rejects malformed nested detail, relation, warning, constraint, and reason data", () => {
    const valid = validSessionMessage();
    assert.ok(parseSemanticDiffExplorerHostMessage(valid));
    const malformed = (
      mutate: (payload: SemanticDiffExplorerViewModel) => void,
    ) => {
      const message = clone(valid);
      mutate(message.payload);
      return parseSemanticDiffExplorerHostMessage(message);
    };
    assert.strictEqual(
      malformed((payload) => {
        (
          payload.tree.children[0].leaves[0] as { reasonCode: string }
        ).reasonCode = "unknown";
      }),
      undefined,
    );
    assert.strictEqual(
      malformed((payload) => {
        (
          payload.tree.children[0].leaves[0] as {
            detail: Record<string, unknown>;
          }
        ).detail.extra = true;
      }),
      undefined,
    );
    assert.strictEqual(
      malformed((payload) => {
        const leaf = payload.tree.children[0].leaves[0] as unknown as {
          detail: { relationPair: { before: Record<string, unknown> | null } };
        };
        if (leaf.detail.relationPair?.before !== null) {
          leaf.detail.relationPair.before.extra = true;
        }
      }),
      undefined,
    );
    assert.strictEqual(
      malformed((payload) => {
        (
          payload.tree.children[0].leaves[0] as {
            warning: Record<string, unknown>;
          }
        ).warning.extra = true;
      }),
      undefined,
    );
    assert.strictEqual(
      malformed((payload) => {
        const leaf = payload.tree.children[0].leaves[0] as unknown as {
          constraints: Array<{ code: string }>;
        };
        leaf.constraints[0].code = "unknown";
      }),
      undefined,
    );

    const unsupported = clone(valid);
    const unsupportedLeaf = {
      kind: "unsupported" as const,
      id: "unsupported:one:0",
      recordId: "one",
      unsupportedKind: "unsupported" as const,
      reasonCode: "cycle-schedule",
      targetSide: "after" as const,
      target: { side: "after" as const, value: unitTarget },
      detail: detail(),
      warning: null,
      actions: {
        source: { available: true, actionId, unavailableReason: null },
        flow: {
          available: true,
          actionId: createSemanticDiffExplorerActionId(2),
          unavailableReason: null,
        },
      },
    };
    (unsupported.payload.tree.children[0].leaves as unknown as unknown[])[0] =
      unsupportedLeaf;
    assert.ok(parseSemanticDiffExplorerHostMessage(unsupported));
    (unsupportedLeaf as { reasonCode: string }).reasonCode = "unknown";
    assert.strictEqual(
      parseSemanticDiffExplorerHostMessage(unsupported),
      undefined,
    );
  });

  test("enforces card, tree, filter, and schedule invariants", () => {
    const valid = validSessionMessage();
    const malformed = (payload: unknown) =>
      parseSemanticDiffExplorerHostMessage({ ...valid, payload });
    const inconsistentCard = cloneMutable(valid.payload);
    inconsistentCard.cards[3] = {
      ...inconsistentCard.cards[3],
      count: 2,
      counts: { required: 1 },
    };
    assert.strictEqual(malformed(inconsistentCard), undefined);

    const fractionalCard = cloneMutable(valid.payload);
    fractionalCard.cards[3] = {
      ...fractionalCard.cards[3],
      count: 1.5,
      counts: { required: 1.5 },
    };
    assert.strictEqual(malformed(fractionalCard), undefined);

    const wrongLeafCount = cloneMutable(valid.payload);
    wrongLeafCount.leafCount = 0;
    assert.strictEqual(malformed(wrongLeafCount), undefined);

    const wrongStatus = cloneMutable(valid.payload);
    wrongStatus.status = "empty";
    assert.strictEqual(malformed(wrongStatus), undefined);

    const wrongFilter = cloneMutable(valid.payload);
    wrongFilter.filter = "confirmation-required";
    wrongFilter.status = "findings";
    assert.ok(malformed(wrongFilter));
    wrongFilter.tree.children[0].leaves = [];
    wrongFilter.leafCount = 0;
    wrongFilter.status = "filter-empty";
    assert.ok(malformed(wrongFilter));

    const wrongRoot = cloneMutable(valid.payload);
    wrongRoot.tree.kind = "unit";
    assert.strictEqual(malformed(wrongRoot), undefined);

    const wrongTargetSide = cloneMutable(valid.payload);
    (
      wrongTargetSide.tree.children[0].leaves[0] as Mutable<{
        target: { side: string };
      }>
    ).target.side = "after";
    assert.strictEqual(malformed(wrongTargetSide), undefined);

    const sparseDetail = cloneMutable(valid.payload);
    (
      sparseDetail.tree.children[0].leaves[0] as Mutable<{
        detail: { beforeValues: string[] };
      }>
    ).detail.beforeValues = new Array(1);
    assert.strictEqual(malformed(sparseDetail), undefined);

    const sparseChildren = cloneMutable(valid.payload);
    sparseChildren.tree.children = new Array(1);
    assert.strictEqual(malformed(sparseChildren), undefined);

    const invalidSchedule = cloneMutable(valid.payload);
    const scheduleLeaf = {
      kind: "schedule" as const,
      id: "schedule:one:0",
      recordId: "one",
      change: {
        id: "one",
        kind: "added" as const,
        unitPath: "/group/unit",
        date: "2026-01-01",
        before: null,
        after: {
          unitPath: "/group/unit",
          unitName: "Unit",
          rule: 1,
          date: "2026-01-01",
          time: "01:00",
        },
      },
      targetSide: null,
      target: { side: null, value: null },
      actions: {
        source: {
          available: false,
          actionId: null,
          unavailableReason: "missing-target-side" as const,
        },
        flow: {
          available: false,
          actionId: null,
          unavailableReason: "missing-target-side" as const,
        },
      },
    };
    invalidSchedule.tree.children[0].leaves = [scheduleLeaf];
    invalidSchedule.cards = invalidSchedule.cards.map((card) =>
      card.id === "schedule-run-changes"
        ? { ...card, count: 1, counts: { total: 1 } }
        : card.id === "confirmation-required"
          ? { ...card, count: 0, counts: { required: 0 } }
          : card,
    );
    invalidSchedule.leafCount = 1;
    invalidSchedule.status = "findings";
    assert.ok(malformed(invalidSchedule));
    (
      invalidSchedule.tree.children[0].leaves[0] as {
        change: { before: unknown };
      }
    ).change.before = {};
    assert.strictEqual(malformed(invalidSchedule), undefined);
  });

  test("validates host session, failure, close, and the fixed 8 MiB boundary", () => {
    const valid = validSessionMessage();
    assert.ok(parseSemanticDiffExplorerHostMessage(valid));
    assert.strictEqual(
      parseSemanticDiffExplorerHostMessage({ ...valid, requestId: 1 }),
      undefined,
    );
    const close = {
      type: "close" as const,
      sessionId,
      requestId: null,
      actionId: null,
      ok: true as const,
      payload: null,
      error: null,
    };
    assert.ok(parseSemanticDiffExplorerHostMessage(close));
    assert.strictEqual(
      parseSemanticDiffExplorerHostMessage({ ...close, payload: {} }),
      undefined,
    );
    const failure = createSemanticDiffExplorerFailureMessage(
      sessionId,
      2,
      actionId,
      createSemanticDiffExplorerError("record-not-found", {
        side: "after",
        targetId: "target",
      }),
    );
    assert.ok(parseSemanticDiffExplorerHostMessage(failure));
    assert.strictEqual(
      parseSemanticDiffExplorerHostMessage({ ...failure, requestId: 0 }),
      undefined,
    );

    const nearLimit = createSemanticDiffExplorerFailureMessage(
      null,
      null,
      null,
      createSemanticDiffExplorerError("record-not-found", {
        side: "after",
        targetId: "x".repeat(SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES - 1024),
      }),
    );
    const serialized = serializeSemanticDiffExplorerMessage(nearLimit);
    assert.strictEqual(serialized.ok, true);
    if (serialized.ok) {
      assert.ok(serialized.bytes <= SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES);
      assert.ok(
        serialized.bytes >= SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES - 1024,
      );
    }
    const overLimit = serializeSemanticDiffExplorerMessage({
      ...nearLimit,
      error: {
        ...nearLimit.error,
        detail: {
          side: "after",
          targetId: "x".repeat(SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES),
        },
      },
    });
    assert.deepStrictEqual(overLimit, {
      ok: false,
      error: { code: "payload-too-large", detail: null },
    });
  });

  test("fails closed for prototype-looking target, card, and message keys", () => {
    const reservedKeys = ["toString", "constructor", "__proto__"] as const;
    for (const key of reservedKeys) {
      assert.doesNotThrow(() => isSemanticDiffTarget({ kind: key }));
      assert.strictEqual(isSemanticDiffTarget({ kind: key }), false);
      assert.doesNotThrow(() =>
        isSemanticDiffExplorerCard({ id: key, count: 0, counts: {} }),
      );
      assert.strictEqual(
        isSemanticDiffExplorerCard({ id: key, count: 0, counts: {} }),
        false,
      );
      const malformedMessage = {
        ...validSessionMessage(),
        type: key,
      };
      assert.doesNotThrow(() =>
        parseSemanticDiffExplorerHostMessage(malformedMessage),
      );
      assert.strictEqual(
        parseSemanticDiffExplorerHostMessage(malformedMessage),
        undefined,
      );
    }
  });
});
