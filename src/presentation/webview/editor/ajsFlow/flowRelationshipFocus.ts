import type { Edge, Node } from "@xyflow/react";
import { collectRelatedUnitIds } from "./flowNodeDetail";
import type { AjsNode } from "./nodes/AjsNode";

export type FlowRelationshipFocusRole =
  | "selected"
  | "upstream"
  | "downstream"
  | "both"
  | "unrelated";

export type FlowRelationshipFocusColors = {
  both: string;
  downstream: string;
  upstream: string;
};

export type FlowRelationshipFocus = {
  downstreamUnitIds: ReadonlySet<string>;
  selectedUnitId: string;
  upstreamUnitIds: ReadonlySet<string>;
};

type ApplyFlowRelationshipFocusOptions = {
  colors: FlowRelationshipFocusColors;
  enabled: boolean;
  selectedUnitId?: string;
};

const resolveDirectionalRole = (
  upstream: boolean,
  downstream: boolean,
): Exclude<FlowRelationshipFocusRole, "selected"> => {
  if (upstream && downstream) {
    return "both";
  }
  if (upstream) {
    return "upstream";
  }
  return downstream ? "downstream" : "unrelated";
};

export const buildFlowRelationshipFocus = (
  selectedUnitId: string,
  edges: readonly Edge[],
): FlowRelationshipFocus => ({
  selectedUnitId,
  upstreamUnitIds: collectRelatedUnitIds(selectedUnitId, edges, "upstream"),
  downstreamUnitIds: collectRelatedUnitIds(selectedUnitId, edges, "downstream"),
});

export const resolveFlowNodeFocusRole = (
  unitId: string,
  focus: FlowRelationshipFocus,
): FlowRelationshipFocusRole =>
  unitId === focus.selectedUnitId
    ? "selected"
    : resolveDirectionalRole(
        focus.upstreamUnitIds.has(unitId),
        focus.downstreamUnitIds.has(unitId),
      );

export const resolveFlowEdgeFocusRole = (
  edge: Pick<Edge, "source" | "target">,
  focus: FlowRelationshipFocus,
): Exclude<FlowRelationshipFocusRole, "selected"> => {
  const isSelectedLoop =
    edge.source === focus.selectedUnitId &&
    edge.target === focus.selectedUnitId;
  const isUpstream =
    isSelectedLoop ||
    (focus.upstreamUnitIds.has(edge.source) &&
      (focus.upstreamUnitIds.has(edge.target) ||
        edge.target === focus.selectedUnitId));
  const isDownstream =
    isSelectedLoop ||
    (focus.downstreamUnitIds.has(edge.target) &&
      (focus.downstreamUnitIds.has(edge.source) ||
        edge.source === focus.selectedUnitId));
  return resolveDirectionalRole(isUpstream, isDownstream);
};

const weakenedOpacity = (opacity: unknown, factor: number): number =>
  typeof opacity === "number" ? opacity * factor : factor;

const decorateNode = (
  node: Node<AjsNode>,
  focus: FlowRelationshipFocus,
): Node<AjsNode> => {
  const relationshipFocusRole = resolveFlowNodeFocusRole(node.id, focus);
  return {
    ...node,
    data: { ...node.data, relationshipFocusRole },
    style: {
      ...node.style,
      opacity:
        relationshipFocusRole === "unrelated"
          ? weakenedOpacity(node.style?.opacity, 0.18)
          : node.style?.opacity,
    },
  };
};

const decorateEdge = (
  edge: Edge,
  focus: FlowRelationshipFocus,
  colors: FlowRelationshipFocusColors,
): Edge => {
  const role = resolveFlowEdgeFocusRole(edge, focus);
  if (role === "unrelated") {
    return {
      ...edge,
      data: { ...edge.data, relationshipFocusRole: role },
      style: {
        ...edge.style,
        opacity: weakenedOpacity(edge.style?.opacity, 0.15),
      },
    };
  }
  return {
    ...edge,
    data: { ...edge.data, relationshipFocusRole: role },
    style: {
      ...edge.style,
      color: colors[role],
      opacity: edge.style?.opacity,
      stroke: colors[role],
      strokeWidth: 2.5,
    },
  };
};

export const applyFlowRelationshipFocus = (
  nodes: Node<AjsNode>[],
  edges: Edge[],
  { colors, enabled, selectedUnitId }: ApplyFlowRelationshipFocusOptions,
): { edges: Edge[]; nodes: Node<AjsNode>[] } => {
  if (
    !enabled ||
    !selectedUnitId ||
    !nodes.some((node) => node.id === selectedUnitId)
  ) {
    return { edges, nodes };
  }
  const focus = buildFlowRelationshipFocus(selectedUnitId, edges);
  return {
    nodes: nodes.map((node) => decorateNode(node, focus)),
    edges: edges.map((edge) => decorateEdge(edge, focus, colors)),
  };
};
