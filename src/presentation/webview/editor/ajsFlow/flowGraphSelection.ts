import type { Node } from "@xyflow/react";
import type { AjsNode } from "./nodes/AjsNode";

export const applySelectedUnitToFlowNodes = (
  nodes: readonly Node<AjsNode>[],
  selectedUnitId: string | undefined,
): Node<AjsNode>[] =>
  nodes.map((node) => {
    const isSelected = node.id === selectedUnitId;
    if (
      Boolean(node.selected) === isSelected &&
      Boolean(node.data.isSelected) === isSelected
    ) {
      return node;
    }
    return {
      ...node,
      selected: isSelected,
      data: {
        ...node.data,
        isSelected,
      },
    };
  });
