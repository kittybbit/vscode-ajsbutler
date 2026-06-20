import * as assert from "assert";
import type { Edge, Node } from "@xyflow/react";
import {
  applyFlowRelationshipFocus,
  buildFlowRelationshipFocus,
  resolveFlowEdgeFocusRole,
  resolveFlowNodeFocusRole,
} from "../../presentation/webview/editor/ajsFlow/flowRelationshipFocus";
import type { AjsNode } from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";

const edges: Edge[] = [
  { id: "u-s", source: "u", target: "s" },
  { id: "s-d", source: "s", target: "d", animated: true },
  { id: "s-a", source: "s", target: "a" },
  { id: "a-b", source: "a", target: "b" },
  { id: "b-s", source: "b", target: "s" },
  { id: "x-y", source: "x", target: "y" },
];

const node = (
  id: string,
  options: { opacity?: number; searchMatch?: boolean } = {},
): Node<AjsNode> => ({
  id,
  position: { x: 0, y: 0 },
  data: {
    unitId: id,
    label: id,
    isSearchMatch: options.searchMatch,
  } as AjsNode,
  style:
    options.opacity === undefined ? undefined : { opacity: options.opacity },
});

const colors = {
  both: "orange",
  downstream: "green",
  upstream: "blue",
};

suite("Flow Relationship Focus", () => {
  test("classifies cyclic upstream, downstream, both, and unrelated nodes", () => {
    const focus = buildFlowRelationshipFocus("s", edges);

    assert.strictEqual(resolveFlowNodeFocusRole("s", focus), "selected");
    assert.strictEqual(resolveFlowNodeFocusRole("u", focus), "upstream");
    assert.strictEqual(resolveFlowNodeFocusRole("d", focus), "downstream");
    assert.strictEqual(resolveFlowNodeFocusRole("a", focus), "both");
    assert.strictEqual(resolveFlowNodeFocusRole("b", focus), "both");
    assert.strictEqual(resolveFlowNodeFocusRole("x", focus), "unrelated");
  });

  test("classifies relationship paths without looping on cycles", () => {
    const focus = buildFlowRelationshipFocus("s", edges);

    assert.strictEqual(resolveFlowEdgeFocusRole(edges[0], focus), "upstream");
    assert.strictEqual(resolveFlowEdgeFocusRole(edges[1], focus), "downstream");
    assert.strictEqual(resolveFlowEdgeFocusRole(edges[3], focus), "both");
    assert.strictEqual(resolveFlowEdgeFocusRole(edges[5], focus), "unrelated");
  });

  test("decorates without deleting elements or replacing existing data", () => {
    const nodes = [
      node("s", { searchMatch: true }),
      node("u"),
      node("d"),
      node("a"),
      node("b"),
      node("x", { opacity: 0.5 }),
      node("s::nested-panel-bounds", { opacity: 0 }),
    ];
    const focused = applyFlowRelationshipFocus(nodes, edges, {
      colors,
      enabled: true,
      selectedUnitId: "s",
    });

    assert.strictEqual(focused.nodes.length, nodes.length);
    assert.strictEqual(focused.edges.length, edges.length);
    assert.strictEqual(focused.nodes[0].data.isSearchMatch, true);
    assert.strictEqual(focused.nodes[0].data.relationshipFocusRole, "selected");
    assert.strictEqual(focused.nodes[5].style?.opacity, 0.09);
    assert.strictEqual(focused.nodes[6].style?.opacity, 0);
    assert.strictEqual(focused.edges[0].style?.stroke, "blue");
    assert.strictEqual(focused.edges[1].style?.stroke, "green");
    assert.strictEqual(focused.edges[1].animated, true);
    assert.strictEqual(focused.edges[5].style?.opacity, 0.15);
  });

  test("returns the original graph references while disabled", () => {
    const nodes = [node("s")];
    const result = applyFlowRelationshipFocus(nodes, edges, {
      colors,
      enabled: false,
      selectedUnitId: "s",
    });

    assert.strictEqual(result.nodes, nodes);
    assert.strictEqual(result.edges, edges);
  });

  test("does not dim a graph while the selected node is not rendered", () => {
    const nodes = [node("new-scope")];
    const result = applyFlowRelationshipFocus(nodes, edges, {
      colors,
      enabled: true,
      selectedUnitId: "old-scope-selection",
    });

    assert.strictEqual(result.nodes, nodes);
    assert.strictEqual(result.edges, edges);
  });
});
