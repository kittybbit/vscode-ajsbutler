import * as assert from "assert";
import { resolveFlowViewportFocusDecision } from "../../presentation/webview/editor/ajsFlow/flowViewportFocus";

suite("Flow Viewport Focus", () => {
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
});
