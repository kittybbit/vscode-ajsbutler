import { Theme } from "@mui/material";
import { Edge, MarkerType, Node } from "@xyflow/react";
import {
  FlowGraphDto,
  FlowGraphNodeDto,
} from "../../../application/flow-graph/buildFlowGraphCore";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import {
  CurrentUnitEntityStateType,
  DialogDataStateType,
} from "./FlowContents";
import { AjsNode } from "./nodes/AjsNode";

const calcPosition = (node: FlowGraphNodeDto, theme: Theme) => {
  if (node.metadata.layout.kind === "ancestor") {
    const basePx = theme.typography.htmlFontSize;
    const width = basePx * 6;
    const height = basePx * 6;
    const marginX = width / 5;
    const offsetX = width / 3;
    const offsetY = height / 2;
    return {
      x: offsetX + (width + marginX) * node.metadata.layout.depth,
      y: offsetY,
    };
  }

  const { h, v } = node.metadata.layout;
  const basePx = theme.typography.htmlFontSize;
  const width = basePx * 6;
  const height = basePx * 6;
  const marginX = width / 4;
  const marginY = height / 4;
  const offsetX = width / 3;
  const offsetY = height * 2;

  return {
    x: offsetX + (width + marginX) * ((h - 80) / 160 - 1),
    y: offsetY + (height + marginY) * ((v - 48) / 96),
  };
};

const toNodeData = (
  node: FlowGraphNodeDto,
  unitEntityByPath: ReadonlyMap<string, UnitEntity>,
  dialogDataState: DialogDataStateType,
  currentUnitEntityState: CurrentUnitEntityStateType,
): AjsNode => {
  const unitEntity = unitEntityByPath.get(node.metadata.absolutePath);
  if (!unitEntity) {
    throw new Error(
      `Unit entity not found for flow graph node ${node.metadata.absolutePath}`,
    );
  }

  return {
    unitEntity,
    label: node.label,
    comment: node.metadata.comment,
    ty: node.metadata.ty,
    gty: node.metadata.gty,
    isAncestor: node.metadata.isAncestor,
    isCurrent: node.metadata.isCurrent,
    isRootJobnet: node.metadata.isRootJobnet,
    hasSchedule: node.metadata.hasSchedule,
    hasWaitedFor: node.metadata.hasWaitedFor,
    ...dialogDataState,
    ...currentUnitEntityState,
  };
};

export const createReactFlowData = (
  graph: FlowGraphDto,
  unitEntityByPath: ReadonlyMap<string, UnitEntity>,
  theme: Theme,
  dialogDataState: DialogDataStateType,
  currentUnitEntityState: CurrentUnitEntityStateType,
): { nodes: Node<AjsNode>[]; edges: Edge[] } => {
  const nodes: Node<AjsNode>[] = graph.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: toNodeData(
      node,
      unitEntityByPath,
      dialogDataState,
      currentUnitEntityState,
    ),
    position: calcPosition(node, theme),
  }));

  const edges: Edge[] = graph.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}`,
    type: "smoothstep",
    source: edge.source,
    target: edge.target,
    markerStart:
      edge.type === "con"
        ? {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          }
        : undefined,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    animated: edge.type === "con",
  }));

  return { nodes, edges };
};
