import React, { FC, useEffect, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  NodeTypes,
  ReactFlow,
  type ReactFlowInstance,
} from "@xyflow/react";
import JobNode from "./nodes/JobNode";
import JobNetNode from "./nodes/JobNetNode";
import JobGroupNode from "./nodes/JobGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import type { FlowNodeData } from "./flowNodePresentationModel";
import {
  type FlowMiniMapColors,
  resolveFlowMiniMapNodeFill,
  resolveFlowMiniMapNodeStroke,
} from "./flowMiniMap";
import { readOnlyFlowInteractionProps } from "./flowKeyboardNavigation";
import { flowAriaLabelConfig } from "./flowAccessibility";
import { unitInformationMessage } from "../unitInformationLocalization";
import type { Theme } from "@mui/material/styles";

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };
const minimumViewportZoom = 0.02;

const nodeTypes: NodeTypes = {
  job: JobNode,
  jobnet: JobNetNode,
  jobgroup: JobGroupNode,
  condition: ConditionNode,
};

type FlowGraphCanvasProps = {
  edges: Edge[];
  language: string;
  miniMapColors: FlowMiniMapColors;
  nodes: Node<FlowNodeData>[];
  onNodeClick: (event: React.MouseEvent, node: Node<FlowNodeData>) => void;
  onNodeMouseEnter: (event: React.MouseEvent, node: Node<FlowNodeData>) => void;
  onNodeMouseLeave: (event: React.MouseEvent, node: Node<FlowNodeData>) => void;
  onRendererReady: (
    instance: ReactFlowInstance<Node<FlowNodeData>, Edge>,
  ) => void;
  reactFlowInstanceRef: React.MutableRefObject<ReactFlowInstance<
    Node<FlowNodeData>,
    Edge
  > | null>;
  selectedUnitId?: string;
  showMiniMap: boolean;
  theme: Theme;
};

type FlowGraphSelectionSyncProps = Pick<
  FlowGraphCanvasProps,
  "nodes" | "reactFlowInstanceRef" | "selectedUnitId"
>;

const useSyncSelectedFlowNode = ({
  nodes,
  reactFlowInstanceRef,
  selectedUnitId,
}: FlowGraphSelectionSyncProps): void => {
  const previousSelectedUnitIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const instance = reactFlowInstanceRef.current;
    if (!instance) return;

    const syncSelectedNode = (
      unitId: string | undefined,
      isSelected: boolean,
    ) => {
      if (!unitId) return;
      const node = instance.getNode(unitId);
      if (!node) return;
      if (Boolean(node.selected) !== isSelected) {
        instance.updateNode(unitId, { selected: isSelected });
      }
      if (Boolean(node.data.isSelected) !== isSelected) {
        instance.updateNodeData(unitId, { isSelected });
      }
    };

    syncSelectedNode(previousSelectedUnitIdRef.current, false);
    syncSelectedNode(selectedUnitId, true);
    previousSelectedUnitIdRef.current = selectedUnitId;
  }, [nodes, reactFlowInstanceRef, selectedUnitId]);
};

const FlowGraphCanvas: FC<FlowGraphCanvasProps> = ({
  edges,
  language,
  miniMapColors,
  nodes,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onRendererReady,
  reactFlowInstanceRef,
  selectedUnitId,
  showMiniMap,
  theme,
}) => {
  useSyncSelectedFlowNode({
    nodes,
    reactFlowInstanceRef,
    selectedUnitId,
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      defaultViewport={defaultViewport}
      colorMode={theme.palette.mode}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      onInit={onRendererReady}
      ariaLabelConfig={flowAriaLabelConfig(language)}
      {...readOnlyFlowInteractionProps}
      fitView
      minZoom={minimumViewportZoom}
      fitViewOptions={{
        padding: 0.22,
        minZoom: minimumViewportZoom,
      }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color={theme.palette.divider}
      />
      <Controls
        position="bottom-left"
        showInteractive={false}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: theme.shadows[3],
        }}
      />
      {showMiniMap && (
        <MiniMap<Node<FlowNodeData>>
          className="ajs-flow-minimap"
          ariaLabel={unitInformationMessage(
            "a11y.flow.reactFlow.minimap",
            language,
          )}
          pannable
          zoomable
          position="bottom-right"
          nodeColor={(node) => resolveFlowMiniMapNodeFill(node, miniMapColors)}
          nodeStrokeColor={(node) =>
            resolveFlowMiniMapNodeStroke(node, miniMapColors)
          }
          nodeStrokeWidth={3}
          bgColor={theme.palette.background.paper}
          maskColor={`${theme.palette.background.default}66`}
          maskStrokeColor="transparent"
          maskStrokeWidth={0}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            opacity: 1,
            boxShadow: theme.shadows[3],
          }}
        />
      )}
    </ReactFlow>
  );
};

FlowGraphCanvas.displayName = "FlowGraphCanvas";

export default FlowGraphCanvas;
