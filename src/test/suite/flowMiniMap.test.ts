import * as assert from "assert";
import type { Node } from "@xyflow/react";
import {
  resolveFlowMiniMapNodeFill,
  resolveFlowMiniMapNodeStroke,
} from "../../presentation/webview/editor/ajsFlow/flowMiniMap";
import type { FlowMiniMapColors } from "../../presentation/webview/editor/ajsFlow/flowMiniMap";
import type { AjsNode } from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";
import {
  initialFlowMiniMapVisibility,
  reduceFlowMiniMapVisibility,
} from "../../presentation/webview/editor/ajsFlow/useFlowMiniMapState";

const colors: FlowMiniMapColors = {
  both: "both",
  changed: "changed",
  confirmationRequired: "confirmation-required",
  currentSearchResult: "current-search",
  downstream: "downstream",
  hidden: "transparent",
  normal: "normal",
  searchMatch: "search-match",
  selected: "selected",
  selectedFocus: "selected-focus",
  unrelated: "unrelated",
  upstream: "upstream",
};

const node = (data: Partial<AjsNode> = {}): Node<AjsNode> => ({
  id: "node",
  position: { x: 0, y: 0 },
  data: { label: "node", ...data } as AjsNode,
});

suite("Flow MiniMap", () => {
  test("starts visible and toggles visibility", () => {
    assert.strictEqual(initialFlowMiniMapVisibility, true);
    assert.strictEqual(
      reduceFlowMiniMapVisibility(initialFlowMiniMapVisibility),
      false,
    );
    assert.strictEqual(reduceFlowMiniMapVisibility(false), true);
  });

  test("uses search match fill outside relationship focus", () => {
    assert.strictEqual(resolveFlowMiniMapNodeFill(node(), colors), "normal");
    assert.strictEqual(
      resolveFlowMiniMapNodeFill(node({ isSearchMatch: true }), colors),
      "search-match",
    );
  });

  test("uses semantic diff highlight colors before search matches", () => {
    assert.strictEqual(
      resolveFlowMiniMapNodeFill(
        node({
          isSearchMatch: true,
          semanticDiffHighlight: {
            kind: "changed",
            changeIds: ["change"],
            confirmationIds: [],
          },
        }),
        colors,
      ),
      "changed",
    );
    assert.strictEqual(
      resolveFlowMiniMapNodeFill(
        node({
          semanticDiffHighlight: {
            kind: "confirmation-required",
            changeIds: ["change"],
            confirmationIds: ["confirm"],
          },
        }),
        colors,
      ),
      "confirmation-required",
    );
  });

  test("relationship focus fill takes precedence over search match", () => {
    for (const [role, expected] of [
      ["selected", "selected-focus"],
      ["upstream", "upstream"],
      ["downstream", "downstream"],
      ["both", "both"],
      ["unrelated", "unrelated"],
    ] as const) {
      assert.strictEqual(
        resolveFlowMiniMapNodeFill(
          node({ isSearchMatch: true, relationshipFocusRole: role }),
          colors,
        ),
        expected,
      );
    }
  });

  test("selected and current search nodes remain visible when scaled down", () => {
    assert.strictEqual(
      resolveFlowMiniMapNodeFill(
        node({ isSelected: true, relationshipFocusRole: "selected" }),
        colors,
      ),
      "selected",
    );
    assert.strictEqual(
      resolveFlowMiniMapNodeFill(
        node({
          isCurrentSearchResult: true,
          isSelected: true,
          relationshipFocusRole: "selected",
        }),
        colors,
      ),
      "current-search",
    );
  });

  test("uses React Flow selection state as a fallback", () => {
    assert.strictEqual(
      resolveFlowMiniMapNodeFill({ ...node(), selected: true }, colors),
      "selected",
    );
    assert.strictEqual(
      resolveFlowMiniMapNodeStroke({ ...node(), selected: true }, colors),
      "selected",
    );
  });

  test("current search result outline takes precedence over selection", () => {
    assert.strictEqual(
      resolveFlowMiniMapNodeStroke(node({ isSelected: true }), colors),
      "selected",
    );
    assert.strictEqual(
      resolveFlowMiniMapNodeStroke(
        node({ isCurrentSearchResult: true, isSelected: true }),
        colors,
      ),
      "current-search",
    );
  });

  test("outlines search and relationship focus states at MiniMap scale", () => {
    assert.strictEqual(
      resolveFlowMiniMapNodeStroke(node({ isSearchMatch: true }), colors),
      "search-match",
    );
    for (const [role, expected] of [
      ["selected", "selected-focus"],
      ["upstream", "upstream"],
      ["downstream", "downstream"],
      ["both", "both"],
      ["unrelated", "unrelated"],
    ] as const) {
      assert.strictEqual(
        resolveFlowMiniMapNodeStroke(
          node({ relationshipFocusRole: role }),
          colors,
        ),
        expected,
      );
    }
  });

  test("keeps invisible nested layout bounds transparent", () => {
    const hiddenNode: Node<AjsNode> = {
      ...node({
        isCurrentSearchResult: true,
        isSearchMatch: true,
        isSelected: true,
        relationshipFocusRole: "selected",
      }),
      type: "group",
      domAttributes: { "aria-hidden": true },
    };

    assert.strictEqual(
      resolveFlowMiniMapNodeFill(hiddenNode, colors),
      "transparent",
    );
    assert.strictEqual(
      resolveFlowMiniMapNodeStroke(hiddenNode, colors),
      "transparent",
    );
  });
});
