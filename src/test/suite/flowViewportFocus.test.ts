import * as assert from "assert";
import {
  resolveFlowGraphFocusRequest,
  resolveFlowNodeCenter,
  resolveFlowViewportFocusAction,
  resolveFlowViewportFocusDecision,
  shouldPreserveFlowViewport,
} from "../../presentation/webview/editor/ajsFlow/flowViewportFocus";

suite("Flow Viewport Focus", () => {
  test("resolves the rendered node center without changing viewport zoom", () => {
    assert.deepStrictEqual(
      resolveFlowNodeCenter({ x: 120, y: 80, width: 240, height: 100 }),
      { x: 240, y: 130 },
    );
  });

  test("waits for the expected scope and falls back to the graph entry", () => {
    assert.deepStrictEqual(
      resolveFlowGraphFocusRequest(
        {
          revision: 1,
          expectedScopeUnitId: "nested",
          targetUnitId: "nested",
        },
        "root",
        new Set(["nested"]),
      ),
      { kind: "wait" },
    );
    assert.deepStrictEqual(
      resolveFlowGraphFocusRequest(
        { revision: 2, targetUnitId: "missing" },
        "root",
        new Set(["root"]),
      ),
      { kind: "graphEntry" },
    );
    assert.deepStrictEqual(
      resolveFlowGraphFocusRequest(
        { revision: 3, targetUnitId: "nested" },
        "nested",
        new Set(["nested"]),
      ),
      { kind: "node", targetUnitId: "nested" },
    );
  });

  test("uses zoom-preserving center for search and selection only", () => {
    assert.deepStrictEqual(
      resolveFlowViewportFocusAction({
        kind: "selection",
        targetUnitId: "selected",
      }),
      { kind: "setCenter", targetUnitId: "selected" },
    );
    assert.deepStrictEqual(
      resolveFlowViewportFocusAction({
        kind: "search",
        targetUnitId: "matched",
      }),
      { kind: "setCenter", targetUnitId: "matched" },
    );
    assert.deepStrictEqual(resolveFlowViewportFocusAction({ kind: "layout" }), {
      kind: "fitView",
      targetUnitId: undefined,
    });
  });

  test("prioritizes a pending rendered search target", () => {
    assert.deepStrictEqual(
      resolveFlowViewportFocusDecision({
        renderedUnitIds: new Set(["search", "selected"]),
        searchRequest: { targetUnitId: "search", version: 2 },
        handledSearchVersion: 1,
        selectionRequest: { targetUnitId: "selected", version: 3 },
        handledSelectionVersion: 2,
        layoutChanged: true,
      }),
      { kind: "search", targetUnitId: "search" },
    );
  });

  test("uses tree selection focus without making graph clicks a request", () => {
    assert.deepStrictEqual(
      resolveFlowViewportFocusDecision({
        renderedUnitIds: new Set(["selected"]),
        searchRequest: { version: 1 },
        handledSearchVersion: 1,
        selectionRequest: { targetUnitId: "selected", version: 4 },
        handledSelectionVersion: 3,
        layoutChanged: false,
      }),
      { kind: "selection", targetUnitId: "selected" },
    );
    assert.strictEqual(
      resolveFlowViewportFocusDecision({
        renderedUnitIds: new Set(["selected"]),
        searchRequest: { version: 1 },
        handledSearchVersion: 1,
        selectionRequest: { version: 3 },
        handledSelectionVersion: 3,
        layoutChanged: false,
      }),
      undefined,
    );
  });

  test("waits for a pending target to render before layout fitting", () => {
    assert.strictEqual(
      resolveFlowViewportFocusDecision({
        renderedUnitIds: new Set(),
        searchRequest: { version: 1 },
        handledSearchVersion: 1,
        selectionRequest: { targetUnitId: "selected", version: 2 },
        handledSelectionVersion: 1,
        layoutChanged: true,
      }),
      null,
    );
  });

  test("does not reveal a stale search target or fall through to layout fitting", () => {
    assert.strictEqual(
      resolveFlowViewportFocusDecision({
        renderedUnitIds: new Set(["current"]),
        searchRequest: { targetUnitId: "removed", version: 2 },
        handledSearchVersion: 1,
        selectionRequest: { targetUnitId: "selected", version: 1 },
        handledSelectionVersion: 1,
        layoutChanged: true,
      }),
      null,
    );
  });

  test("allows layout fitting after a pending selection is cleared", () => {
    assert.deepStrictEqual(
      resolveFlowViewportFocusDecision({
        renderedUnitIds: new Set(["current"]),
        searchRequest: { version: 1 },
        handledSearchVersion: 1,
        selectionRequest: { version: 2 },
        handledSelectionVersion: 1,
        layoutChanged: true,
      }),
      { kind: "layout" },
    );
  });

  test("preserves the viewport only for a new keyboard expansion layout", () => {
    assert.strictEqual(
      shouldPreserveFlowViewport({
        requestVersion: 2,
        handledVersion: 1,
        layoutChanged: true,
      }),
      true,
    );
    assert.strictEqual(
      shouldPreserveFlowViewport({
        requestVersion: 2,
        handledVersion: 2,
        layoutChanged: true,
      }),
      false,
    );
    assert.strictEqual(
      shouldPreserveFlowViewport({
        requestVersion: 2,
        handledVersion: 1,
        layoutChanged: false,
      }),
      false,
    );
  });
});
