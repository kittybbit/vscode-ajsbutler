import * as assert from "assert";
import {
  buildFlowKeyboardNavigationIndex,
  focusRenderedFlowNode,
  getOwnedFlowNodeId,
  isFlowKeyboardNavigationKey,
  resolveFlowKeyboardFocusTarget,
  resolveFlowKeyboardNavigationAction,
  resolveFlowKeyboardNavigationIndexCache,
  resolveFlowKeyboardNavigationKeyResult,
  resolveFlowKeyboardNodeGeometry,
  resolveFlowKeyboardScopeFocusDecision,
  type FlowKeyboardScopeUnit,
  type FlowKeyboardNavigationNode,
} from "../../presentation/webview/editor/ajsFlow/flowKeyboardNavigation";

const node = (
  id: string,
  x: number,
  y: number,
  options: Partial<
    Pick<
      FlowKeyboardNavigationNode,
      "parentId" | "width" | "height" | "canExpandNested" | "isExpandedNested"
    >
  > = {},
): FlowKeyboardNavigationNode => ({
  id,
  x,
  y,
  parentId: options.parentId,
  width: options.width ?? 10,
  height: options.height ?? 10,
  canExpandNested: options.canExpandNested ?? false,
  isExpandedNested: options.isExpandedNested ?? false,
});

const navigate = (
  nodes: readonly FlowKeyboardNavigationNode[],
  currentUnitId: string,
  key: string,
) =>
  resolveFlowKeyboardNavigationAction(buildFlowKeyboardNavigationIndex(nodes), {
    currentUnitId,
    key,
  });

suite("Flow Keyboard Navigation", () => {
  test("moves to the center-nearest rendered node in all four directions", () => {
    const nodes = [
      node("current", 0, 0),
      node("left", -20, 0),
      node("right", 20, 0),
      node("up", 0, -20),
      node("down", 0, 20),
      node("far-right", 60, 0),
    ];

    assert.deepStrictEqual(navigate(nodes, "current", "ArrowLeft"), {
      kind: "navigate",
      movement: "left",
      targetUnitId: "left",
    });
    assert.deepStrictEqual(navigate(nodes, "current", "ArrowRight"), {
      kind: "navigate",
      movement: "right",
      targetUnitId: "right",
    });
    assert.deepStrictEqual(navigate(nodes, "current", "ArrowUp"), {
      kind: "navigate",
      movement: "up",
      targetUnitId: "up",
    });
    assert.deepStrictEqual(navigate(nodes, "current", "ArrowDown"), {
      kind: "navigate",
      movement: "down",
      targetUnitId: "down",
    });
  });

  test("uses Euclidean distance instead of requested-axis distance", () => {
    const nodes = [
      node("current", 0, 0),
      node("remote-diagonal", 1, 1_000),
      node("near-right", 20, 0),
    ];

    assert.deepStrictEqual(navigate(nodes, "current", "ArrowRight"), {
      kind: "navigate",
      movement: "right",
      targetUnitId: "near-right",
    });
  });

  test("breaks equal-distance ties by upper then left then rendered order", () => {
    const upperAndLower = [
      node("current", 0, 0),
      node("lower-right", 10, 5),
      node("upper-right", 10, -5),
    ];
    const leftAndRight = [
      node("current", 0, 0),
      node("upper-right", 5, -10),
      node("upper-left", -5, -10),
    ];
    const sameCenter = [
      node("current", 0, 0),
      node("first", 10, 0),
      node("second", 10, 0),
    ];

    assert.deepStrictEqual(navigate(upperAndLower, "current", "ArrowRight"), {
      kind: "navigate",
      movement: "right",
      targetUnitId: "upper-right",
    });
    assert.deepStrictEqual(navigate(leftAndRight, "current", "ArrowUp"), {
      kind: "navigate",
      movement: "up",
      targetUnitId: "upper-left",
    });
    assert.deepStrictEqual(navigate(sameCenter, "current", "ArrowRight"), {
      kind: "navigate",
      movement: "right",
      targetUnitId: "first",
    });
  });

  test("uses measured dimensions with an initial-dimension fallback", () => {
    assert.deepStrictEqual(
      resolveFlowKeyboardNodeGeometry({
        position: { x: 10, y: 20 },
        measured: { width: 30, height: 40 },
        initialWidth: 100,
        initialHeight: 200,
      }),
      { x: 10, y: 20, width: 30, height: 40 },
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardNodeGeometry({
        position: { x: 10, y: 20 },
        measured: { width: 0, height: Number.NaN },
        initialWidth: 100,
        initialHeight: 200,
      }),
      { x: 10, y: 20, width: 100, height: 200 },
    );
    assert.strictEqual(
      resolveFlowKeyboardNodeGeometry({
        position: { x: 10, y: 20 },
      }),
      undefined,
    );
  });

  test("enters N and RC scopes instead of selecting a child", () => {
    const index = buildFlowKeyboardNavigationIndex([
      node("root", 0, 0),
      node("nested", 0, 20),
      node("condition", 0, 40),
    ]);
    const scopeUnitById = new Map<string, FlowKeyboardScopeUnit>([
      ["root", { id: "root", unitType: "n", childCount: 2 }],
      [
        "nested",
        { id: "nested", parentId: "root", unitType: "n", childCount: 1 },
      ],
      [
        "condition",
        { id: "condition", parentId: "root", unitType: "rc", childCount: 1 },
      ],
    ]);

    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationAction(index, {
        currentUnitId: "nested",
        currentScopeUnitId: "root",
        key: "Enter",
        scopeUnitById,
      }),
      {
        kind: "enter-scope",
        targetScopeId: "nested",
        focusUnitId: "nested",
      },
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationAction(index, {
        currentUnitId: "condition",
        currentScopeUnitId: "root",
        key: "Enter",
        scopeUnitById,
      }),
      {
        kind: "enter-scope",
        targetScopeId: "condition",
        focusUnitId: "condition",
      },
    );
  });

  test("returns from the active nested scope to the nearest containing N or RC", () => {
    const index = buildFlowKeyboardNavigationIndex([node("focused", 0, 0)]);
    const scopeUnitById = new Map<string, FlowKeyboardScopeUnit>([
      ["root", { id: "root", unitType: "n", childCount: 2 }],
      [
        "wrapper",
        { id: "wrapper", parentId: "root", unitType: "rn", childCount: 1 },
      ],
      [
        "nested-condition",
        {
          id: "nested-condition",
          parentId: "wrapper",
          unitType: "rc",
          childCount: 1,
        },
      ],
      [
        "focused",
        {
          id: "focused",
          parentId: "nested-condition",
          unitType: "j",
          childCount: 0,
        },
      ],
    ]);

    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationAction(index, {
        currentUnitId: "focused",
        currentScopeUnitId: "nested-condition",
        key: "Escape",
        scopeUnitById,
      }),
      {
        kind: "return-scope",
        targetScopeId: "root",
        focusUnitId: "nested-condition",
      },
    );
  });

  test("suppresses empty, ineligible, and root scope transitions without actions", () => {
    const index = buildFlowKeyboardNavigationIndex([
      node("empty", 0, 0),
      node("job", 20, 0),
      node("root", 40, 0),
    ]);
    const scopeUnitById = new Map<string, FlowKeyboardScopeUnit>([
      ["empty", { id: "empty", unitType: "n", childCount: 0 }],
      ["job", { id: "job", unitType: "j", childCount: 1 }],
      ["root", { id: "root", unitType: "n", childCount: 1 }],
    ]);

    assert.strictEqual(
      resolveFlowKeyboardNavigationAction(index, {
        currentUnitId: "empty",
        currentScopeUnitId: "root",
        key: "Enter",
        scopeUnitById,
      }),
      undefined,
    );
    assert.strictEqual(
      resolveFlowKeyboardNavigationAction(index, {
        currentUnitId: "job",
        currentScopeUnitId: "root",
        key: "Enter",
        scopeUnitById,
      }),
      undefined,
    );
    assert.strictEqual(
      resolveFlowKeyboardNavigationAction(index, {
        currentUnitId: "root",
        currentScopeUnitId: "root",
        key: "Escape",
        scopeUnitById,
      }),
      undefined,
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationKeyResult(index, {
        currentUnitId: "empty",
        currentScopeUnitId: "root",
        key: "Enter",
        scopeUnitById,
      }),
      { action: undefined, suppressDefault: true },
    );

    const collapsed = buildFlowKeyboardNavigationIndex([
      node("nested", 0, 20, {
        canExpandNested: true,
      }),
    ]);
    const expanded = buildFlowKeyboardNavigationIndex([
      node("nested", 0, 20, {
        canExpandNested: true,
        isExpandedNested: true,
      }),
    ]);

    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationAction(collapsed, {
        currentUnitId: "nested",
        key: "ArrowDown",
        shiftKey: true,
      }),
      { kind: "expand", targetUnitId: "nested" },
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationAction(expanded, {
        currentUnitId: "nested",
        key: "ArrowUp",
        shiftKey: true,
      }),
      { kind: "collapse", targetUnitId: "nested" },
    );
  });

  test("suppresses owned navigation keys even when no target exists", () => {
    const index = buildFlowKeyboardNavigationIndex([node("current", 0, 0)]);

    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationKeyResult(index, {
        currentUnitId: "current",
        key: "ArrowRight",
      }),
      { action: undefined, suppressDefault: true },
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationKeyResult(index, {
        currentUnitId: "current",
        key: "Tab",
      }),
      { action: undefined, suppressDefault: false },
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardNavigationKeyResult(index, {
        currentUnitId: "current",
        key: "ArrowRight",
        ctrlKey: true,
      }),
      { action: undefined, suppressDefault: false },
    );
    assert.strictEqual(isFlowKeyboardNavigationKey({ key: "Tab" }), false);
  });

  test("reuses visual-only geometry and invalidates navigation changes", () => {
    const initial = resolveFlowKeyboardNavigationIndexCache(undefined, [
      node("a", 0, 0),
      node("b", 20, 0),
    ]);
    const visualUpdate = resolveFlowKeyboardNavigationIndexCache(initial, [
      node("a", 0, 0),
      node("b", 20, 0),
    ]);
    const moved = resolveFlowKeyboardNavigationIndexCache(visualUpdate, [
      node("a", 0, 0),
      node("b", 30, 0),
    ]);
    const resized = resolveFlowKeyboardNavigationIndexCache(moved, [
      node("a", 0, 0),
      node("b", 30, 0, { width: 20 }),
    ]);
    const reordered = resolveFlowKeyboardNavigationIndexCache(resized, [
      node("b", 30, 0, { width: 20 }),
      node("a", 0, 0),
    ]);
    const expanded = resolveFlowKeyboardNavigationIndexCache(reordered, [
      node("b", 30, 0, {
        width: 20,
        canExpandNested: true,
        isExpandedNested: true,
      }),
      node("a", 0, 0),
    ]);

    assert.strictEqual(visualUpdate, initial);
    assert.notStrictEqual(moved, visualUpdate);
    assert.notStrictEqual(resized, moved);
    assert.notStrictEqual(reordered, resized);
    assert.notStrictEqual(expanded, reordered);
  });

  test("scans a large rendered graph without changing target semantics", () => {
    const nodes = Array.from({ length: 10_000 }, (_, index) =>
      node(`node-${index}`, index * 20, 0),
    );

    assert.deepStrictEqual(navigate(nodes, "node-5000", "ArrowRight"), {
      kind: "navigate",
      movement: "right",
      targetUnitId: "node-5001",
    });
  });

  test("accepts keys only when the React Flow node wrapper owns focus", () => {
    assert.strictEqual(
      getOwnedFlowNodeId({
        classList: {
          contains: (className: string) => className === "react-flow__node",
        },
        dataset: { id: "owned-node" },
      } as never),
      "owned-node",
    );
    assert.strictEqual(
      getOwnedFlowNodeId({
        classList: { contains: () => false },
        dataset: { id: "nested-button" },
      } as never),
      undefined,
    );
  });

  test("focuses an already-selected navigation target without a rerender", () => {
    let focused = false;
    let receivedSelector: string | undefined;
    const root = {
      querySelector: (selector: string) => {
        receivedSelector = selector;
        return {
          focus: ({ preventScroll }: { preventScroll: boolean }) => {
            focused = preventScroll;
          },
        };
      },
    };

    assert.strictEqual(
      focusRenderedFlowNode(root, "already-selected", (value) => value),
      true,
    );
    assert.strictEqual(focused, true);
    assert.strictEqual(
      receivedSelector,
      '.react-flow__node[data-id="already-selected"]',
    );
  });

  test("falls back to the single graph entry when rerender removes a node", () => {
    assert.deepStrictEqual(
      resolveFlowKeyboardFocusTarget(new Set(["current"]), "current"),
      { kind: "node", targetUnitId: "current" },
    );
    assert.deepStrictEqual(
      resolveFlowKeyboardFocusTarget(new Set(["other"]), "current"),
      { kind: "graphEntry" },
    );
  });

  test("waits for the destination scope graph and cancels stale transitions", () => {
    const waiting = resolveFlowKeyboardScopeFocusDecision({
      currentScopeUnitId: "root",
      expectedScopeUnitId: "nested",
      renderedUnitIds: new Set(["root"]),
      sourceNodesChanged: false,
      sourceScopeUnitId: "root",
      targetUnitId: "nested",
    });
    assert.deepStrictEqual(waiting, { kind: "wait" });

    const canceled = resolveFlowKeyboardScopeFocusDecision({
      currentScopeUnitId: "other",
      expectedScopeUnitId: "nested",
      renderedUnitIds: new Set(["other"]),
      sourceNodesChanged: true,
      sourceScopeUnitId: "root",
      targetUnitId: "nested",
    });
    assert.deepStrictEqual(canceled, { kind: "cancel" });

    const focused = resolveFlowKeyboardScopeFocusDecision({
      currentScopeUnitId: "nested",
      expectedScopeUnitId: "nested",
      renderedUnitIds: new Set(["nested"]),
      sourceNodesChanged: true,
      sourceScopeUnitId: "root",
      targetUnitId: "nested",
    });
    assert.deepStrictEqual(focused, {
      kind: "node",
      targetUnitId: "nested",
    });

    const fallback = resolveFlowKeyboardScopeFocusDecision({
      currentScopeUnitId: "root",
      expectedScopeUnitId: "root",
      renderedUnitIds: new Set(["other"]),
      sourceNodesChanged: true,
      sourceScopeUnitId: "nested",
      targetUnitId: "nested",
    });
    assert.deepStrictEqual(fallback, { kind: "graphEntry" });
  });
});
