import {
  buildExpandedFlowGraphResult,
  type ExpandedFlowGraphConstraintsDto,
} from "../../../../application/flow-graph/buildExpandedFlowGraph";
import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../../../../application/flow-graph/flowGraphDocument";
import type {
  FlowGraphDto,
  FlowGraphNodeDto,
  FlowGraphSemanticDiffHighlights,
} from "../../../../application/flow-graph/buildFlowGraphCore";
import {
  calculateFlowGraphNodePosition,
  calculateNestedChildPosition,
  calculateNestedConditionPosition,
  createFlowGraphMetrics,
  type FlowGraphPosition,
} from "./flowGraphPosition";
import { relayoutExpandedScope } from "./expandedFlowGraphLayout";
import { syncDisplayPosition } from "./expandedFlowGraphPositionState";
import type {
  ExpandedFlowGraphBuildContext,
  ExpandedFlowGraphResult,
  ExpandedNodeDecoration,
} from "./expandedFlowGraphTypes";

export type { ExpandedNodeDecoration } from "./expandedFlowGraphTypes";

export type BuildExpandedFlowGraphInput = {
  document: ValidatedFlowGraphDocument;
  currentUnitId: string;
  expandedUnitIds: ReadonlySet<string> | readonly string[];
  basePx: number;
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
};

const createEmptyExpandedFlowGraphResult = (): ExpandedFlowGraphResult => ({
  graph: undefined,
  positionOverrides: new Map<string, FlowGraphPosition>(),
  nodeDecorations: new Map<string, ExpandedNodeDecoration>(),
});

const calculateNestedInitialPosition = (
  node: FlowGraphNodeDto,
  kind: "nested_grid" | "nested_condition",
  basePx: number,
): FlowGraphPosition => {
  if (kind === "nested_condition") {
    return calculateNestedConditionPosition({ x: 0, y: 0 }, basePx);
  }
  const layout = node.metadata.layout;
  return layout.kind === "grid"
    ? calculateNestedChildPosition({
        parentPosition: { x: 0, y: 0 },
        h: layout.h,
        v: layout.v,
        basePx,
      })
    : calculateFlowGraphNodePosition(node, basePx);
};

const initializePositions = (
  graph: FlowGraphDto,
  constraints: ExpandedFlowGraphConstraintsDto,
  basePx: number,
): Pick<
  ExpandedFlowGraphBuildContext,
  "initialPositions" | "parentAnchors" | "offsets" | "positionOverrides"
> => {
  const placementByUnitId = new Map(
    constraints.nodePlacements.map((placement) => [
      placement.unitId,
      placement,
    ]),
  );
  const initialPositions = new Map<string, FlowGraphPosition>();
  const parentAnchors = new Map<string, string>();
  const offsets = new Map<string, FlowGraphPosition>();
  const positionOverrides = new Map<string, FlowGraphPosition>();

  for (const node of graph.nodes) {
    const placement = placementByUnitId.get(node.id);
    initialPositions.set(
      node.id,
      placement
        ? calculateNestedInitialPosition(node, placement.kind, basePx)
        : calculateFlowGraphNodePosition(node, basePx),
    );
    if (placement) {
      parentAnchors.set(node.id, placement.parentAnchorUnitId);
    }
    offsets.set(node.id, { x: 0, y: 0 });
  }

  return { initialPositions, parentAnchors, offsets, positionOverrides };
};

const createExpandedFlowGraphContext = (
  graph: FlowGraphDto,
  constraints: ExpandedFlowGraphConstraintsDto,
  basePx: number,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
): ExpandedFlowGraphBuildContext => {
  const context: ExpandedFlowGraphBuildContext = {
    basePx,
    visibleUnitIds: new Set(graph.nodes.map((node) => node.id)),
    ...initializePositions(graph, constraints, basePx),
    nodeDecorations: new Map<string, ExpandedNodeDecoration>(),
    unitById,
    constraints,
    scopeByContainerId: new Map(
      constraints.scopes.map((scope) => [scope.containerUnitId, scope]),
    ),
    expandedUnitById: new Map(
      constraints.expandedUnits.map((expandedUnit) => [
        expandedUnit.unitId,
        expandedUnit,
      ]),
    ),
    metrics: createFlowGraphMetrics(basePx),
  };
  for (const node of graph.nodes) {
    syncDisplayPosition(context, node.id);
  }
  return context;
};

export const buildExpandedFlowGraph = (
  input: BuildExpandedFlowGraphInput,
): ExpandedFlowGraphResult => {
  const result = buildExpandedFlowGraphResult({
    document: input.document,
    activeScopeUnitId: input.currentUnitId,
    requestedExpandedUnitIds: input.expandedUnitIds,
    semanticDiffHighlights: input.semanticDiffHighlights,
  });
  if (result.status === "unavailable") {
    return createEmptyExpandedFlowGraphResult();
  }

  const context = createExpandedFlowGraphContext(
    result.graph,
    result.constraints,
    input.basePx,
    input.document.index.unitById,
  );
  relayoutExpandedScope(context, result.constraints.activeScopeUnitId);

  return {
    graph: result.graph,
    positionOverrides: context.positionOverrides,
    nodeDecorations: context.nodeDecorations,
  };
};
