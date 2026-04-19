import type { Theme } from "@mui/material/styles";
import { Edge, MarkerType, Node } from "@xyflow/react";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
} from "../../../application/flow-graph/buildFlowGraphCore";
import { UnitDefinitionDialogDto } from "../../../application/unit-definition/buildUnitDefinition";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
  NestedExpansionStateType,
} from "./FlowContents";
import { ExpandedNodeDecoration } from "./buildExpandedFlowGraph";
import { AjsNode } from "./nodes/AjsNode";
import { calculateFlowGraphNodePosition } from "./flowGraphPosition";

type CreateReactFlowDataOptions = {
  unitById?: ReadonlyMap<string, AjsUnit>;
  nestedExpansionState?: NestedExpansionStateType;
  nodeDecorations?: ReadonlyMap<string, ExpandedNodeDecoration>;
  positionOverrides?: ReadonlyMap<string, { x: number; y: number }>;
};

const hasExpandableChildren = (unit?: AjsUnit): boolean =>
  !!unit && unit.unitType === "n" && unit.children.length > 0;

const isDirectNestedExpansionTarget = (
  unit: AjsUnit | undefined,
  currentUnitId: string | undefined,
): boolean => !!unit && !!currentUnitId && unit.parentId === currentUnitId;

const toNodeData = (
  node: FlowGraphNodeDto,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
  dialogDataState: DialogDataStateType,
  currentUnitIdState: CurrentUnitIdStateType,
  options?: CreateReactFlowDataOptions,
): AjsNode => {
  const unitDefinition = unitDefinitionByPath.get(node.metadata.absolutePath);
  if (!unitDefinition) {
    throw new Error(
      `Unit definition not found for flow graph node ${node.metadata.absolutePath}`,
    );
  }

  const unit = options?.unitById?.get(node.id);
  return {
    nestedPanel: options?.nodeDecorations?.get(node.id),
    unitId: node.id,
    unitDefinition,
    label: node.label,
    comment: node.metadata.comment,
    ty: node.metadata.ty,
    gty: node.metadata.gty,
    isAncestor: node.metadata.isAncestor,
    isCurrent: node.metadata.isCurrent,
    isRootJobnet: node.metadata.isRootJobnet,
    hasSchedule: node.metadata.hasSchedule,
    hasWaitedFor: node.metadata.hasWaitedFor,
    canExpandNested:
      !node.metadata.isCurrent &&
      !node.metadata.isAncestor &&
      hasExpandableChildren(unit) &&
      isDirectNestedExpansionTarget(unit, currentUnitIdState.currentUnitId),
    isExpandedNested: options?.nestedExpansionState?.expandedUnitIds.has(
      node.id,
    ),
    toggleExpandedUnitId: options?.nestedExpansionState?.toggleExpandedUnitId,
    ...dialogDataState,
    ...currentUnitIdState,
  };
};

const toEdge = (edge: FlowGraphEdgeDto): Edge => ({
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
});

export const createReactFlowData = (
  graph: FlowGraphDto,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
  theme: Theme,
  dialogDataState: DialogDataStateType,
  currentUnitIdState: CurrentUnitIdStateType,
  options?: CreateReactFlowDataOptions,
): { nodes: Node<AjsNode>[]; edges: Edge[] } => {
  const nodes: Node<AjsNode>[] = graph.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: toNodeData(
      node,
      unitDefinitionByPath,
      dialogDataState,
      currentUnitIdState,
      options,
    ),
    position:
      options?.positionOverrides?.get(node.id) ??
      calculateFlowGraphNodePosition(node, theme.typography.htmlFontSize),
  }));

  const edges: Edge[] = graph.edges.map(toEdge);

  return { nodes, edges };
};
