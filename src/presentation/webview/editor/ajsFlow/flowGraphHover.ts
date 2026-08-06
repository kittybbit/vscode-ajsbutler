import type { Node } from "@xyflow/react";
import type { FlowNodeData } from "./flowNodePresentationModel";

export const applyHoveredUnitToFlowNodes = (
  nodes: readonly Node<FlowNodeData>[],
  hoveredUnitId: string | undefined,
): Node<FlowNodeData>[] =>
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
