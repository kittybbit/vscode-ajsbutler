import type { Node } from "@xyflow/react";
import type { FlowRelationshipFocusRole } from "./flowRelationshipFocus";
import type { AjsNode } from "./nodes/AjsNode";

export type FlowMiniMapColors = {
  both: string;
  changed: string;
  confirmationRequired: string;
  currentSearchResult: string;
  downstream: string;
  hidden: string;
  normal: string;
  searchMatch: string;
  selected: string;
  selectedFocus: string;
  unrelated: string;
  upstream: string;
};

const isHiddenLayoutNode = (node: Node<AjsNode>): boolean =>
  node.type === "group" && node.domAttributes?.["aria-hidden"] === true;

const relationshipFocusColorKeys: Record<
  FlowRelationshipFocusRole,
  keyof FlowMiniMapColors
> = {
  both: "both",
  downstream: "downstream",
  selected: "selectedFocus",
  unrelated: "unrelated",
  upstream: "upstream",
};

const colorWhen = (
  condition: boolean | undefined,
  color: string,
): string | undefined => (condition ? color : undefined);

const resolveRelationshipFocusColor = (
  role: FlowRelationshipFocusRole | undefined,
  colors: FlowMiniMapColors,
): string | undefined =>
  role ? colors[relationshipFocusColorKeys[role]] : undefined;

const resolveVisibleFlowMiniMapNodeColor = (
  node: Node<AjsNode>,
  colors: FlowMiniMapColors,
  defaultColor: string,
): string => {
  const color = [
    colorWhen(node.data.isCurrentSearchResult, colors.currentSearchResult),
    colorWhen(node.selected || node.data.isSelected, colors.selected),
    resolveRelationshipFocusColor(node.data.relationshipFocusRole, colors),
    colorWhen(
      node.data.semanticDiffHighlight?.kind === "confirmation-required",
      colors.confirmationRequired,
    ),
    colorWhen(
      node.data.semanticDiffHighlight?.kind === "changed",
      colors.changed,
    ),
    colorWhen(node.data.isSearchMatch, colors.searchMatch),
  ].find((candidate): candidate is string => candidate !== undefined);

  return color ?? defaultColor;
};

const resolveFlowMiniMapNodeColor = (
  node: Node<AjsNode>,
  colors: FlowMiniMapColors,
  defaultColor: string,
): string =>
  isHiddenLayoutNode(node)
    ? colors.hidden
    : resolveVisibleFlowMiniMapNodeColor(node, colors, defaultColor);

export const resolveFlowMiniMapNodeFill = (
  node: Node<AjsNode>,
  colors: FlowMiniMapColors,
): string => resolveFlowMiniMapNodeColor(node, colors, colors.normal);

export const resolveFlowMiniMapNodeStroke = (
  node: Node<AjsNode>,
  colors: FlowMiniMapColors,
): string => resolveFlowMiniMapNodeColor(node, colors, colors.hidden);
