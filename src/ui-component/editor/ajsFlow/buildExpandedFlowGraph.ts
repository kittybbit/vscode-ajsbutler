import {
  AjsDocument,
  findAjsUnitById,
  flattenAjsUnits,
} from "../../../domain/models/ajs/AjsDocument";
import { buildFlowGraph } from "../../../application/flow-graph/buildFlowGraph";
import {
  calculateFlowGraphNodePosition,
  createFlowGraphMetrics,
  FlowGraphPosition,
} from "./flowGraphPosition";
import { isNestedJobnetUnit } from "./nestedExpansion";
import {
  isDescendantOf,
  relayoutExpandedScope,
} from "./expandedFlowGraphLayout";
import {
  ExpandedFlowGraphBuildContext,
  ExpandedFlowGraphResult,
  ExpandedNodeDecoration,
} from "./expandedFlowGraphTypes";

export type { ExpandedNodeDecoration } from "./expandedFlowGraphTypes";

export const buildExpandedFlowGraph = (
  document: AjsDocument,
  currentUnitId: string,
  expandedUnitIds: ReadonlySet<string> | readonly string[],
  basePx: number,
): ExpandedFlowGraphResult => {
  const baseGraph = buildFlowGraph(document, currentUnitId);
  if (!baseGraph) {
    return {
      graph: undefined,
      positionOverrides: new Map<string, FlowGraphPosition>(),
      nodeDecorations: new Map<string, ExpandedNodeDecoration>(),
    };
  }

  const metrics = createFlowGraphMetrics(basePx);
  const nodes = [...baseGraph.nodes];
  const edges = [...baseGraph.edges];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeIds = new Set(edges.map((edge) => `${edge.source}-${edge.target}`));
  const initialPositions = new Map<string, FlowGraphPosition>();
  const offsets = new Map<string, FlowGraphPosition>();
  const parentAnchors = new Map<string, string>();
  const positionOverrides = new Map<string, FlowGraphPosition>();
  const nodeDecorations = new Map<string, ExpandedNodeDecoration>();

  for (const node of baseGraph.nodes) {
    const initialPosition = calculateFlowGraphNodePosition(node, basePx);
    initialPositions.set(node.id, initialPosition);
    offsets.set(node.id, { x: 0, y: 0 });
    positionOverrides.set(node.id, initialPosition);
  }

  const allUnits = flattenAjsUnits(document.rootUnits);
  const unitById = new Map(allUnits.map((unit) => [unit.id, unit]));
  const currentUnit = findAjsUnitById(document, currentUnitId);
  if (!currentUnit) {
    return { graph: baseGraph, positionOverrides, nodeDecorations };
  }

  const visibleUnitIds = new Set(nodes.map((node) => node.id));
  const context: ExpandedFlowGraphBuildContext = {
    basePx,
    nodes,
    edges,
    nodeIds,
    edgeIds,
    visibleUnitIds,
    initialPositions,
    parentAnchors,
    offsets,
    positionOverrides,
    nodeDecorations,
    unitById,
    metrics,
  };

  const expandedUnitIdSet = new Set(
    [...expandedUnitIds].filter((unitId) => {
      const unit = unitById.get(unitId);
      return (
        !!unit &&
        unit.id !== currentUnitId &&
        isNestedJobnetUnit(unit) &&
        isDescendantOf(unit, currentUnitId, unitById)
      );
    }),
  );

  relayoutExpandedScope(context, currentUnit, expandedUnitIdSet);

  return {
    graph: {
      nodes,
      edges,
    },
    positionOverrides,
    nodeDecorations,
  };
};
