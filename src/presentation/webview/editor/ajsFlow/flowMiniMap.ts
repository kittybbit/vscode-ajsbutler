import type { Node } from "@xyflow/react";
import type { AjsNode } from "./nodes/AjsNode";

export type FlowMiniMapColors = {
  both: string;
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

export const resolveFlowMiniMapNodeFill = (
  node: Node<AjsNode>,
  colors: FlowMiniMapColors,
): string => {
  if (isHiddenLayoutNode(node)) {
    return colors.hidden;
  }
  if (node.data.isCurrentSearchResult) {
    return colors.currentSearchResult;
  }
  if (node.selected || node.data.isSelected) {
    return colors.selected;
  }

  switch (node.data.relationshipFocusRole) {
    case "selected":
      return colors.selectedFocus;
    case "upstream":
      return colors.upstream;
    case "downstream":
      return colors.downstream;
    case "both":
      return colors.both;
    case "unrelated":
      return colors.unrelated;
    default:
      return node.data.isSearchMatch ? colors.searchMatch : colors.normal;
  }
};

export const resolveFlowMiniMapNodeStroke = (
  node: Node<AjsNode>,
  colors: FlowMiniMapColors,
): string => {
  if (isHiddenLayoutNode(node)) {
    return colors.hidden;
  }
  if (node.data.isCurrentSearchResult) {
    return colors.currentSearchResult;
  }
  if (node.selected || node.data.isSelected) {
    return colors.selected;
  }

  switch (node.data.relationshipFocusRole) {
    case "selected":
      return colors.selectedFocus;
    case "upstream":
      return colors.upstream;
    case "downstream":
      return colors.downstream;
    case "both":
      return colors.both;
    case "unrelated":
      return colors.unrelated;
    default:
      return node.data.isSearchMatch ? colors.searchMatch : colors.hidden;
  }
};
