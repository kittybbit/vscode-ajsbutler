import type { Theme } from "@mui/material/styles";
import { Edge, MarkerType, Node } from "@xyflow/react";
import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
} from "../../../../application/flow-graph/buildFlowGraphCore";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
  NestedExpansionStateType,
} from "./flowViewerStateTypes";
import { ExpandedNodeDecoration } from "./buildExpandedFlowGraph";
import { AjsNode } from "./nodes/AjsNode";
import { createFlowNodeGeometryPx } from "./nodes/flowNodeGeometry";
import { calculateFlowGraphNodePosition } from "./flowGraphPosition";
import { isExpandableNestedUnit } from "./nestedExpansion";

type CreateReactFlowDataOptions = {
  searchMatchedUnitIds?: ReadonlySet<string>;
  unitById?: ReadonlyMap<string, AjsUnit>;
  nestedExpansionState?: NestedExpansionStateType;
  nodeDecorations?: ReadonlyMap<string, ExpandedNodeDecoration>;
  positionOverrides?: ReadonlyMap<string, { x: number; y: number }>;
  searchedUnitId?: string;
  selectedUnitId?: string;
};

const nestedPanelBoundsNodeId = (unitId: string): string =>
  `${unitId}::nested-panel-bounds`;

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
    absolutePath: node.metadata.absolutePath,
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
    isSearchMatch: options?.searchMatchedUnitIds?.has(node.id) ?? false,
    isCurrentSearchResult: options?.searchedUnitId === node.id,
    isSelected: options?.selectedUnitId === node.id,
    canExpandNested:
      !node.metadata.isCurrent &&
      !node.metadata.isAncestor &&
      !!unit &&
      isExpandableNestedUnit(unit),
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

const toNestedPanelBoundsNode = (
  node: Node<AjsNode>,
): Node<AjsNode> | undefined => {
  const nestedPanel = node.data.nestedPanel;
  if (!nestedPanel) {
    return undefined;
  }

  return {
    id: nestedPanelBoundsNodeId(node.id),
    type: "group",
    data: { label: "" } as AjsNode,
    position: {
      x: node.position.x + nestedPanel.panelOffsetXPx,
      y: node.position.y + nestedPanel.panelOffsetYPx,
    },
    width: nestedPanel.panelWidthPx,
    height: nestedPanel.panelHeightPx,
    initialWidth: nestedPanel.panelWidthPx,
    initialHeight: nestedPanel.panelHeightPx,
    style: {
      width: nestedPanel.panelWidthPx,
      height: nestedPanel.panelHeightPx,
      opacity: 0,
      pointerEvents: "none",
      background: "transparent",
      border: "none",
    },
    selectable: false,
    draggable: false,
    connectable: false,
    focusable: false,
    ariaRole: "presentation",
    domAttributes: {
      "aria-hidden": true,
    },
  };
};

export const createReactFlowData = (
  graph: FlowGraphDto,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
  theme: Theme,
  dialogDataState: DialogDataStateType,
  currentUnitIdState: CurrentUnitIdStateType,
  options?: CreateReactFlowDataOptions,
): { nodes: Node<AjsNode>[]; edges: Edge[] } => {
  const initialNodeGeometry = createFlowNodeGeometryPx(
    theme.typography.htmlFontSize,
  );
  const nodes: Node<AjsNode>[] = graph.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    selected: options?.selectedUnitId === node.id,
    initialWidth: initialNodeGeometry.width,
    initialHeight: initialNodeGeometry.height,
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
  const nestedPanelBoundsNodes = nodes
    .map(toNestedPanelBoundsNode)
    .filter((node): node is Node<AjsNode> => !!node);

  const edges: Edge[] = graph.edges.map(toEdge);

  return { nodes: [...nodes, ...nestedPanelBoundsNodes], edges };
};
