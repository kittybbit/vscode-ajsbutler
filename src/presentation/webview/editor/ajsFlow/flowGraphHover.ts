import type { Node } from "@xyflow/react";
import type { AjsNode } from "./nodes/AjsNode";

export const applyHoveredUnitToFlowNodes = (
  nodes: readonly Node<AjsNode>[],
  hoveredUnitId: string | undefined,
): Node<AjsNode>[] =>
  nodes.map((node) => {
    const isHovered = node.id === hoveredUnitId;
    if (Boolean(node.data.isHovered) === isHovered) {
      return node;
    }
    return {
      ...node,
      data: {
        ...node.data,
        isHovered,
      },
    };
  });
