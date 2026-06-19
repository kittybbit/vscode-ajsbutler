import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
} from "../../../../application/flow-graph/buildFlowGraphCore";
import { createFlowGraphMetrics, FlowGraphPosition } from "./flowGraphPosition";

export type ExpandedNodeDecoration = {
  panelOffsetXPx: number;
  panelOffsetYPx: number;
  panelWidthPx: number;
  panelHeightPx: number;
};

export type ExpandedFlowGraphResult = {
  graph?: FlowGraphDto;
  positionOverrides: ReadonlyMap<string, FlowGraphPosition>;
  nodeDecorations: ReadonlyMap<string, ExpandedNodeDecoration>;
};

export type LayoutBox = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type LayoutItem = {
  unit: AjsUnit;
  position: FlowGraphPosition;
  occupiedBox: LayoutBox;
};

export type FlowGraphBounds = LayoutBox;

export type FlowGraphMetrics = ReturnType<typeof createFlowGraphMetrics>;

export type ExpandedFlowGraphBuildContext = {
  basePx: number;
  nodes: FlowGraphNodeDto[];
  edges: FlowGraphEdgeDto[];
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  visibleUnitIds: Set<string>;
  initialPositions: Map<string, FlowGraphPosition>;
  parentAnchors: Map<string, string>;
  offsets: Map<string, FlowGraphPosition>;
  positionOverrides: Map<string, FlowGraphPosition>;
  nodeDecorations: Map<string, ExpandedNodeDecoration>;
  unitById: ReadonlyMap<string, AjsUnit>;
  metrics: FlowGraphMetrics;
};
