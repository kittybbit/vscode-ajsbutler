import type { Node } from "@xyflow/react";
import type { FlowNodeData } from "./flowNodePresentationModel";

export const applySelectedUnitToFlowNodes = (
  nodes: readonly Node<FlowNodeData>[],
  selectedUnitId: string | undefined,
): Node<FlowNodeData>[] =>
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
