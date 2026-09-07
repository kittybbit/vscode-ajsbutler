import * as assert from "assert";
import {
  createSemanticDiffFlowAction,
  SemanticDiffFlowOverlayRegistry,
  type SemanticDiffFlowPanel,
} from "../../presentation/vscode/semantic-diff/semanticDiffExplorerFlow";
import {
  createSemanticDiffExplorerSessionId,
  type SemanticDiffExplorerLeaf,
  type SemanticDiffExplorerSessionId,
  type SemanticDiffExplorerTreeNode,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import {
  createSemanticDiffExplorerActionId,
  createSemanticDiffExplorerSession,
} from "../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffOutputContext,
  SemanticDiffResult,
} from "../../application/semantic-diff/semanticDiffDto";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { flowGraphEdgeId } from "../../application/flow-graph/buildFlowGraphCore";
import { unitInformationMessage } from "../../presentation/webview/editor/unitInformationLocalization";
import { SemanticDiffExplorerActionRegistry } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";

const unit = (id: string, name: string, parentId?: string) => ({
  id,
  name,
  unitAttribute: `${name},,jp1admin,`,
  unitType: id === "/root" ? ("n" as const) : ("j" as const),
  absolutePath: id,
  depth: parentId ? 1 : 0,
  parentId,
  isRoot: parentId === undefined,
  isRootJobnet: parentId === undefined,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 0, v: 0 },
  parameters: [],
  relations: [],
  children: [],
});

const createFlowDocument = (): UnitListDocumentDto => {
  const root = unit("/root", "root");
  const job = unit("/root/job", "job", root.id);
  root.children = [job];
  return {
    rootUnits: [root],
    warnings: [],
    unitDefinitions: [],
    unitList: { rows: [], units: [] },
  };
};

const createRelationFlowDocument = (
  relationCount: number,
): UnitListDocumentDto => {
  const relations = Array.from({ length: relationCount }, () => ({
    sourceUnitId: "/root/source",
    targetUnitId: "/root/target",
    type: "seq" as const,
  }));
  return createFlowDocumentForRelations(relations);
};

const createFlowDocumentForRelations = (
  relations: readonly {
    sourceUnitId: string;
    targetUnitId: string;
    type: "seq" | "con";
  }[],
): UnitListDocumentDto => {
  const root = unit("/root", "root");
  const children = new Map<string, ReturnType<typeof unit>>();
  relations.forEach((relation) => {
    [relation.sourceUnitId, relation.targetUnitId].forEach((id) => {
      if (!children.has(id)) {
        children.set(id, unit(id, id.slice(id.lastIndexOf("/") + 1), root.id));
      }
    });
  });
  root.children = [...children.values()];
  root.relations = [...relations];
  return {
    rootUnits: [root],
    warnings: [],
    unitDefinitions: [],
    unitList: { rows: [], units: [] },
  };
};

const createContext = (): SemanticDiffOutputContext => {
  const result: SemanticDiffResult = {
    inputs: {
      before: {
        side: "before",
        unitIds: ["/root"],
        relations: [],
      },
      after: {
        side: "after",
        unitIds: ["/root", "/root/job"],
        relations: [],
      },
    },
    changes: [
      {
        id: "change:job-added",
        kind: "added",
        elementKind: "unit",
        confirmationLevel: "confirmed",
        after: {
          kind: "unit",
          unit: {
            id: "/root/job",
            name: "job",
            absolutePath: "/root/job",
            unitType: "j",
          },
        },
        relationPair: null,
        identityDecisionId: "identity:job-added",
      },
    ],
    identityDecisions: [],
    confirmationRequired: [],
    unsupportedItems: [],
    limitations: [],
  };
  return { result, summary: {} as SemanticDiffOutputContext["summary"] };
};

const relationTarget = {
  kind: "relation" as const,
  relation: {
    sourceUnitId: "/root/source",
    targetUnitId: "/root/target",
    sourceUnitPath: "/root/source",
    targetUnitPath: "/root/target",
    type: "seq" as const,
  },
};

const relationTargetFor = (sourceUnitId: string, targetUnitId: string) => ({
  kind: "relation" as const,
  relation: {
    sourceUnitId,
    targetUnitId,
    sourceUnitPath: sourceUnitId,
    targetUnitPath: targetUnitId,
    type: "seq" as const,
  },
});

const createRelationContext = (): SemanticDiffOutputContext => ({
  result: {
    inputs: {
      before: { side: "before", unitIds: [], relations: [] },
      after: {
        side: "after",
        unitIds: ["/root", "/root/source", "/root/target"],
        relations: [relationTarget.relation],
      },
    },
    changes: [
      {
        id: "relation-added",
        kind: "added",
        elementKind: "relation",
        confirmationLevel: "confirmed",
        after: relationTarget,
        relationPair: {
          canonicalPair: {
            sourceUnitId: "/root/source",
            targetUnitId: "/root/target",
            type: "seq",
          },
          before: null,
          after: {
            sourceUnitId: "/root/source",
            targetUnitId: "/root/target",
            sourceUnitPath: "/root/source",
            targetUnitPath: "/root/target",
            type: "seq",
          },
        },
      },
    ],
    identityDecisions: [],
    confirmationRequired: [],
    unsupportedItems: [],
    limitations: [],
  },
  summary: {} as SemanticDiffOutputContext["summary"],
});

const createReversedDuplicateRelationContext =
  (): SemanticDiffOutputContext => {
    const before = relationTargetFor("/root/a-source", "/root/a-target");
    const after = relationTargetFor("/root/b-source", "/root/b-target");
    const pairFor = (target: typeof before) => ({
      canonicalPair: {
        sourceUnitId: target.relation.sourceUnitId,
        targetUnitId: target.relation.targetUnitId,
        type: target.relation.type,
      },
      before: null,
      after: target.relation,
    });
    const result: SemanticDiffResult = {
      inputs: {
        before: { side: "before", unitIds: [], relations: [] },
        after: {
          side: "after",
          unitIds: [
            "/root",
            "/root/a-source",
            "/root/a-target",
            "/root/b-source",
            "/root/b-target",
          ],
          relations: [before.relation, after.relation],
        },
      },
      changes: [
        {
          id: "relation-duplicate",
          kind: "added",
          elementKind: "relation",
          confirmationLevel: "confirmed",
          after,
          relationPair: pairFor(after),
        },
        {
          id: "relation-duplicate",
          kind: "added",
          elementKind: "relation",
          confirmationLevel: "confirmed",
          after: before,
          relationPair: pairFor(before),
        },
      ],
      identityDecisions: [],
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
    };
    return buildSemanticDiffOutputContext(result);
  };

const request = (sessionId: SemanticDiffExplorerSessionId) => ({
  sessionId,
  side: "after" as const,
  targetId: "/root/job",
  targetKind: "unit" as const,
  recordId: "change:job-added",
  recordKind: "change" as const,
  recordOccurrence: 0,
  recordTarget: {
    kind: "unit" as const,
    unit: {
      id: "/root/job",
      name: "job",
      absolutePath: "/root/job",
      unitType: "j" as const,
    },
  },
});

suite("Semantic diff Explorer Flow integration", () => {
  test("localizes Flow semantic-diff state badges and legend labels", () => {
    assert.strictEqual(
      unitInformationMessage("semanticDiff.flow.badge.added", "en"),
      "ADDED",
    );
    assert.strictEqual(
      unitInformationMessage("semanticDiff.flow.badge.added", "ja"),
      "追加",
    );
    assert.strictEqual(
      unitInformationMessage(
        "semanticDiff.flow.title.confirmationRequired",
        "ja",
      ),
      "意味差分: 確認が必要",
    );
    assert.strictEqual(
      unitInformationMessage("a11y.flow.semanticDiff.legend", "ja"),
      "意味差分の凡例",
    );
  });

  test("applies the state-only overlay and reveals the actual unit path", async () => {
    const messages: unknown[] = [];
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: createFlowDocument() }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    const action = createSemanticDiffFlowAction({
      host: { open: async () => panel },
    });
    const result = await action(
      request(createSemanticDiffExplorerSessionId(1)),
      createContext(),
      () => true,
    );

    assert.deepStrictEqual(result, { ok: true });
    assert.strictEqual(messages.length, 2);
    assert.deepStrictEqual(messages[0], {
      type: "changeDocument",
      data: {
        ...createFlowDocument(),
        semanticDiffOverlay: {
          nodes: [
            {
              id: "/root/job",
              kind: "added",
              changeIds: ["change:job-added"],
              confirmationIds: [],
            },
          ],
          relations: [],
        },
      },
    });
    assert.deepStrictEqual(messages[1], {
      type: "revealUnit",
      data: { absolutePath: "/root/job" },
    });
  });

  test("late clears from a superseded owner cannot clear the replacement", () => {
    const registry = new SemanticDiffFlowOverlayRegistry();
    const messagesA: unknown[] = [];
    const messagesB: unknown[] = [];
    const panel = (
      flowUri: string,
      messages: unknown[],
    ): SemanticDiffFlowPanel => ({
      flowUri,
      ready: Promise.resolve({ document: createFlowDocument() }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    });
    const ownerA = Object.freeze({ sessionId: "session-a", disposeEpoch: 0 });
    const ownerB = Object.freeze({ sessionId: "session-b", disposeEpoch: 0 });
    const document = createFlowDocument();
    registry.replace({
      flowUri: "file:///flow.ajs",
      panel: panel("file:///flow.ajs", messagesA),
      owner: ownerA,
      document,
    });
    registry.replace({
      flowUri: "file:///flow.ajs",
      panel: panel("file:///flow.ajs", messagesB),
      owner: ownerB,
      document,
    });
    registry.clear("file:///flow.ajs", ownerA);
    assert.strictEqual(messagesA.length, 0);
    assert.strictEqual(messagesB.length, 0);
    registry.clear("file:///flow.ajs", ownerB);
    assert.strictEqual(messagesB.length, 1);
    assert.deepStrictEqual(messagesB[0], {
      type: "changeDocument",
      data: { ...document, semanticDiffOverlay: null },
    });
  });

  test("guards late clears from the same owner operation", () => {
    const registry = new SemanticDiffFlowOverlayRegistry();
    const messages: unknown[] = [];
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///flow.ajs",
      ready: Promise.resolve({ document: createFlowDocument() }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    const owner = Object.freeze({ sessionId: "session", disposeEpoch: 0 });
    const document = createFlowDocument();
    const first = registry.replace({
      flowUri: "file:///flow.ajs",
      panel,
      owner,
      document,
    });
    const second = registry.replace({
      flowUri: "file:///flow.ajs",
      panel,
      owner,
      document,
    });
    registry.clear("file:///flow.ajs", owner, first);
    assert.deepStrictEqual(messages, []);
    registry.clear("file:///flow.ajs", owner, second);
    assert.strictEqual(messages.length, 1);
  });

  test("clears an overlay against the latest base Flow document", () => {
    const registry = new SemanticDiffFlowOverlayRegistry();
    const messages: unknown[] = [];
    const original = createFlowDocument();
    const latest = { ...original, rootUnits: [] };
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///flow.ajs",
      ready: Promise.resolve({ document: original }),
      getBaseDocument: () => latest,
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    const owner = Object.freeze({ sessionId: "session", disposeEpoch: 0 });
    registry.replace({
      flowUri: "file:///flow.ajs",
      panel,
      owner,
      document: original,
    });
    registry.clear("file:///flow.ajs", owner);
    assert.deepStrictEqual(messages, [
      {
        type: "changeDocument",
        data: { ...latest, semanticDiffOverlay: null },
      },
    ]);
  });

  test("preserves duplicate record occurrence and target identity", async () => {
    const messages: unknown[] = [];
    const duplicateDocument = createFlowDocument();
    duplicateDocument.rootUnits[0].children.push(
      unit("/root/other-job", "other-job", "/root"),
    );
    const first = createContext().result.changes[0];
    const second = {
      ...first,
      after: {
        kind: "unit" as const,
        unit: {
          id: "/root/other-job",
          name: "other-job",
          absolutePath: "/root/other-job",
          unitType: "j" as const,
        },
      },
    };
    const context: SemanticDiffOutputContext = {
      ...createContext(),
      result: { ...createContext().result, changes: [first, second] },
    };
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: duplicateDocument }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    let openedTarget: string | undefined;
    const action = createSemanticDiffFlowAction({
      host: {
        open: async (_side, targetId) => {
          openedTarget = targetId;
          return panel;
        },
      },
    });
    const result = await action(
      {
        ...request(createSemanticDiffExplorerSessionId(3)),
        targetId: "/root/other-job",
        recordOccurrence: 1,
        recordTarget: second.after ?? null,
      },
      context,
      () => true,
    );
    assert.deepStrictEqual(result, { ok: true });
    assert.strictEqual(openedTarget, "/root/other-job");
    assert.deepStrictEqual(messages[1], {
      type: "revealUnit",
      data: { absolutePath: "/root/other-job" },
    });
  });

  test("keeps source-order duplicate ordinals through sorted presentation and relation focus", async () => {
    const context = createReversedDuplicateRelationContext();
    const session = createSemanticDiffExplorerSession(context);
    const actionRegistry = new SemanticDiffExplorerActionRegistry();
    actionRegistry.register(session, createSemanticDiffExplorerActionId(99));
    const findLeaf = (
      node: SemanticDiffExplorerTreeNode,
    ): SemanticDiffExplorerLeaf | undefined => {
      const match = node.leaves.find(
        (leaf) =>
          leaf.kind === "change" &&
          leaf.target.value?.kind === "relation" &&
          leaf.target.value.relation.sourceUnitId === "/root/a-source",
      );
      if (match) return match;
      for (const child of node.children) {
        const nested = findLeaf(child);
        if (nested) return nested;
      }
      return undefined;
    };
    const leaf = findLeaf(session.viewModel.tree);
    assert.ok(leaf);
    if (
      !leaf ||
      leaf.kind !== "change" ||
      leaf.actions.flow.actionId === null
    ) {
      throw new Error(
        "Expected the sorted relation leaf to have a Flow action.",
      );
    }
    assert.strictEqual(leaf.id, "change:relation-duplicate:1");
    const metadata = actionRegistry.metadata(
      leaf.actions.flow.actionId,
      session.sessionId,
    );
    assert.ok(metadata);
    if (!metadata) throw new Error("Expected host action metadata.");
    assert.strictEqual(metadata.recordOccurrence, 1);
    assert.deepStrictEqual(
      metadata.recordTarget,
      relationTargetFor("/root/a-source", "/root/a-target"),
    );

    const messages: unknown[] = [];
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({
        document: createFlowDocumentForRelations([
          {
            sourceUnitId: "/root/a-source",
            targetUnitId: "/root/a-target",
            type: "seq",
          },
          {
            sourceUnitId: "/root/b-source",
            targetUnitId: "/root/b-target",
            type: "seq",
          },
        ]),
      }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    let openedTarget: string | undefined;
    const action = createSemanticDiffFlowAction({
      host: {
        open: async (_side, targetId) => {
          openedTarget = targetId;
          return panel;
        },
      },
    });
    const result = await action(
      {
        sessionId: session.sessionId,
        side: metadata.side,
        targetId: metadata.targetId,
        targetKind: metadata.targetKind,
        recordId: metadata.recordId,
        recordKind: metadata.recordKind,
        recordOccurrence: metadata.recordOccurrence,
        recordTarget: metadata.recordTarget,
      },
      context,
      () => true,
    );
    assert.deepStrictEqual(result, { ok: true });
    assert.strictEqual(openedTarget, "/root/a-target");
    assert.deepStrictEqual(messages[1], {
      type: "revealUnit",
      data: { absolutePath: "/root/a-target" },
    });
  });

  test("focuses the lowest ordinal duplicate relation through the Flow reveal path", async () => {
    const messages: unknown[] = [];
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: createRelationFlowDocument(2) }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    let openedTarget: string | undefined;
    const action = createSemanticDiffFlowAction({
      host: {
        open: async (_side, targetId) => {
          openedTarget = targetId;
          return panel;
        },
      },
    });
    const result = await action(
      {
        ...request(createSemanticDiffExplorerSessionId(4)),
        targetId: null,
        targetKind: null,
        recordId: "relation-added",
        recordKind: "change",
        recordTarget: relationTarget,
      },
      createRelationContext(),
      () => true,
    );
    assert.deepStrictEqual(result, { ok: true });
    assert.strictEqual(openedTarget, "/root/target");
    assert.strictEqual(messages.length, 2);
    const overlay = (messages[0] as { data: UnitListDocumentDto }).data
      .semanticDiffOverlay;
    assert.ok(overlay);
    assert.deepStrictEqual(
      overlay.relations.map((entry) => entry.id),
      [0, 1].map((occurrence) =>
        flowGraphEdgeId(
          {
            source: "/root/source",
            target: "/root/target",
            type: "seq",
          },
          occurrence,
        ),
      ),
    );
    assert.deepStrictEqual(messages[1], {
      type: "revealUnit",
      data: { absolutePath: "/root/target" },
    });
  });

  test("reports a missing formal relation with its known endpoint", async () => {
    const messages: unknown[] = [];
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: createRelationFlowDocument(0) }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    const action = createSemanticDiffFlowAction({
      host: { open: async () => panel },
    });
    const result = await action(
      {
        ...request(createSemanticDiffExplorerSessionId(5)),
        targetId: null,
        targetKind: null,
        recordId: "relation-added",
        recordKind: "change",
        recordTarget: relationTarget,
      },
      createRelationContext(),
      () => true,
    );
    assert.deepStrictEqual(result, {
      ok: false,
      code: "flow-target-missing",
      targetId: "/root/target",
    });
    assert.deepStrictEqual(messages, []);
  });

  test("returns not-ready before validating a target after ready becomes stale", async () => {
    let freshnessChecks = 0;
    const sourceSnapshot = {
      sourceHandleId: "source-after",
      version: 1,
      text: "after",
      uri: "file:///after.ajs",
    };
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: createRelationFlowDocument(0) }),
      postMessage: () => Promise.resolve(true),
    };
    const action = createSemanticDiffFlowAction({
      host: {
        getSourceSnapshot: () => sourceSnapshot,
        isSourceCurrent: () => {
          freshnessChecks += 1;
          return freshnessChecks < 2;
        },
        open: async () => panel,
      },
    });
    const result = await action(
      {
        ...request(createSemanticDiffExplorerSessionId(8)),
        targetId: null,
        targetKind: null,
        recordId: "relation-added",
        recordKind: "change",
        recordTarget: relationTarget,
      },
      createRelationContext(),
      () => true,
    );
    assert.deepStrictEqual(result, { ok: false, code: "flow-not-ready" });
    assert.strictEqual(freshnessChecks, 2);
  });

  test("fails closed when the retained source snapshot is stale", async () => {
    let opened = false;
    const sourceSnapshot = {
      sourceHandleId: "source-after",
      version: 1,
      text: "after",
      uri: "file:///after.ajs",
    };
    const action = createSemanticDiffFlowAction({
      host: {
        getSourceSnapshot: () => sourceSnapshot,
        isSourceCurrent: () => false,
        open: async () => {
          opened = true;
          throw new Error("should not open stale Flow");
        },
      },
    });
    const result = await action(
      request(createSemanticDiffExplorerSessionId(6)),
      createContext(),
      () => true,
    );
    assert.deepStrictEqual(result, { ok: false, code: "flow-not-ready" });
    assert.strictEqual(opened, false);
  });

  test("rechecks source freshness after Flow readiness before posting", async () => {
    const messages: unknown[] = [];
    let freshnessChecks = 0;
    let opened = false;
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: createFlowDocument() }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    const sourceSnapshot = {
      sourceHandleId: "source-after",
      version: 1,
      text: "after",
      uri: "file:///after.ajs",
    };
    const action = createSemanticDiffFlowAction({
      host: {
        getSourceSnapshot: () => sourceSnapshot,
        isSourceCurrent: () => {
          freshnessChecks += 1;
          return freshnessChecks < 2;
        },
        open: async () => {
          opened = true;
          return panel;
        },
      },
    });
    const result = await action(
      request(createSemanticDiffExplorerSessionId(7)),
      createContext(),
      () => true,
    );
    assert.deepStrictEqual(result, { ok: false, code: "flow-not-ready" });
    assert.strictEqual(opened, true);
    assert.strictEqual(freshnessChecks, 2);
    assert.deepStrictEqual(messages, []);
  });

  test("revalidates the session before applying an overlay", async () => {
    const messages: unknown[] = [];
    const panel: SemanticDiffFlowPanel = {
      flowUri: "file:///after.ajs",
      ready: Promise.resolve({ document: createFlowDocument() }),
      postMessage: (message) => {
        messages.push(message);
        return Promise.resolve(true);
      },
    };
    const action = createSemanticDiffFlowAction({
      host: { open: async () => panel },
    });
    const result = await action(
      request(createSemanticDiffExplorerSessionId(2)),
      createContext(),
      () => false,
    );
    assert.deepStrictEqual(result, { ok: false, code: "flow-target-missing" });
    assert.deepStrictEqual(messages, []);
  });
});
