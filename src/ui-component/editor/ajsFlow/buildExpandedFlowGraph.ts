import {
  AjsDocument,
  AjsUnit,
  findAjsUnitById,
  flattenAjsUnits,
} from "../../../domain/models/ajs/AjsDocument";
import { buildFlowGraph } from "../../../application/flow-graph/buildFlowGraph";
import {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
} from "../../../application/flow-graph/buildFlowGraphCore";
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

type FlowGraphPositionState = {
  initialPositions: Map<string, FlowGraphPosition>;
  offsets: Map<string, FlowGraphPosition>;
  positionOverrides: Map<string, FlowGraphPosition>;
};

type ExpandedFlowGraphContextArgs = {
  baseGraph: FlowGraphDto;
  basePx: number;
  unitById: ReadonlyMap<string, AjsUnit>;
};

const createEmptyExpandedFlowGraphResult = (): ExpandedFlowGraphResult => ({
  graph: undefined,
  positionOverrides: new Map<string, FlowGraphPosition>(),
  nodeDecorations: new Map<string, ExpandedNodeDecoration>(),
});

const createFlowGraphPositionState = (
  nodes: readonly FlowGraphNodeDto[],
  basePx: number,
): FlowGraphPositionState => {
  const initialPositions = new Map<string, FlowGraphPosition>();
  const offsets = new Map<string, FlowGraphPosition>();
  const positionOverrides = new Map<string, FlowGraphPosition>();

  for (const node of nodes) {
    const initialPosition = calculateFlowGraphNodePosition(node, basePx);
    initialPositions.set(node.id, initialPosition);
    offsets.set(node.id, { x: 0, y: 0 });
    positionOverrides.set(node.id, initialPosition);
  }

  return { initialPositions, offsets, positionOverrides };
};

const createExpandedFlowGraphContext = ({
  baseGraph,
  basePx,
  unitById,
}: ExpandedFlowGraphContextArgs): ExpandedFlowGraphBuildContext => {
  const nodes: FlowGraphNodeDto[] = [...baseGraph.nodes];
  const edges: FlowGraphEdgeDto[] = [...baseGraph.edges];
  const { initialPositions, offsets, positionOverrides } =
    createFlowGraphPositionState(baseGraph.nodes, basePx);

  return {
    basePx,
    nodes,
    edges,
    nodeIds: new Set(nodes.map((node) => node.id)),
    edgeIds: new Set(edges.map((edge) => `${edge.source}-${edge.target}`)),
    visibleUnitIds: new Set(nodes.map((node) => node.id)),
    initialPositions,
    parentAnchors: new Map<string, string>(),
    offsets,
    positionOverrides,
    nodeDecorations: new Map<string, ExpandedNodeDecoration>(),
    unitById,
    metrics: createFlowGraphMetrics(basePx),
  };
};

const createUnitById = (
  document: AjsDocument,
): ReadonlyMap<string, AjsUnit> => {
  const allUnits = flattenAjsUnits(document.rootUnits);
  return new Map(allUnits.map((unit) => [unit.id, unit]));
};

const isExpandedNestedUnitInScope = (
  unitId: string,
  currentUnitId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean => {
  const unit = unitById.get(unitId);
  return (
    !!unit &&
    unit.id !== currentUnitId &&
    isNestedJobnetUnit(unit) &&
    isDescendantOf(unit, currentUnitId, unitById)
  );
};

const createExpandedUnitIdSet = (
  expandedUnitIds: ReadonlySet<string> | readonly string[],
  currentUnitId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): Set<string> =>
  new Set(
    [...expandedUnitIds].filter((unitId) =>
      isExpandedNestedUnitInScope(unitId, currentUnitId, unitById),
    ),
  );

const createBaseExpandedFlowGraphResult = (
  graph: FlowGraphDto,
  context: ExpandedFlowGraphBuildContext,
): ExpandedFlowGraphResult => ({
  graph,
  positionOverrides: context.positionOverrides,
  nodeDecorations: context.nodeDecorations,
});

const createRelayoutExpandedFlowGraphResult = (
  context: ExpandedFlowGraphBuildContext,
): ExpandedFlowGraphResult => ({
  graph: {
    nodes: context.nodes,
    edges: context.edges,
  },
  positionOverrides: context.positionOverrides,
  nodeDecorations: context.nodeDecorations,
});

export const buildExpandedFlowGraph = (
  document: AjsDocument,
  currentUnitId: string,
  expandedUnitIds: ReadonlySet<string> | readonly string[],
  basePx: number,
): ExpandedFlowGraphResult => {
  const baseGraph = buildFlowGraph(document, currentUnitId);
  if (!baseGraph) {
    return createEmptyExpandedFlowGraphResult();
  }

  const unitById = createUnitById(document);
  const context = createExpandedFlowGraphContext({
    baseGraph,
    basePx,
    unitById,
  });
  const currentUnit = findAjsUnitById(document, currentUnitId);
  if (!currentUnit) {
    return createBaseExpandedFlowGraphResult(baseGraph, context);
  }

  const expandedUnitIdSet = createExpandedUnitIdSet(
    expandedUnitIds,
    currentUnitId,
    unitById,
  );

  relayoutExpandedScope(context, currentUnit, expandedUnitIdSet);

  return createRelayoutExpandedFlowGraphResult(context);
};
