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
  FlowGraphNodeType,
} from "../../../application/flow-graph/buildFlowGraphCore";
import {
  calculateFlowGraphNodePosition,
  calculateNestedChildPosition,
  calculateNestedConditionPosition,
  createFlowGraphMetrics,
  FlowGraphPosition,
} from "./flowGraphPosition";

export type ExpandedNodeDecoration = {
  panelOffsetXPx: number;
  panelOffsetYPx: number;
  panelWidthPx: number;
  panelHeightPx: number;
};

type ExpandedFlowGraphResult = {
  graph?: FlowGraphDto;
  positionOverrides: ReadonlyMap<string, FlowGraphPosition>;
  nodeDecorations: ReadonlyMap<string, ExpandedNodeDecoration>;
};

type FlowGraphBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type FlowGraphMetrics = ReturnType<typeof createFlowGraphMetrics>;

type ExpandedFlowGraphBuildContext = {
  basePx: number;
  nodes: FlowGraphNodeDto[];
  edges: FlowGraphEdgeDto[];
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  visibleUnitIds: Set<string>;
  positionOverrides: Map<string, FlowGraphPosition>;
  nodeDecorations: Map<string, ExpandedNodeDecoration>;
  unitById: ReadonlyMap<string, AjsUnit>;
  incomingSourcesByTarget: ReadonlyMap<string, string[]>;
  metrics: FlowGraphMetrics;
};

const toNodeType = (unit: AjsUnit): FlowGraphNodeType => {
  switch (unit.unitType) {
    case "g":
      return "jobgroup";
    case "n":
    case "rn":
    case "rm":
    case "rr":
      return "jobnet";
    case "rc":
      return "condition";
    default:
      return "job";
  }
};

const toGridNode = (unit: AjsUnit): FlowGraphNodeDto => ({
  id: unit.id,
  label: unit.name,
  type: toNodeType(unit),
  metadata: {
    absolutePath: unit.absolutePath,
    ty: unit.unitType,
    gty: unit.groupType,
    comment: unit.comment,
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout: {
      kind: "grid",
      h: unit.layout.h,
      v: unit.layout.v,
    },
  },
});

const toConditionNode = (unit: AjsUnit): FlowGraphNodeDto => ({
  id: unit.id,
  label: unit.name,
  type: "condition",
  metadata: {
    absolutePath: unit.absolutePath,
    ty: unit.unitType,
    gty: unit.groupType,
    comment: unit.comment,
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout: {
      kind: "ancestor",
      depth: unit.depth,
    },
  },
});

const toEdgeDtos = (unit: AjsUnit): FlowGraphEdgeDto[] =>
  unit.relations.map((relation) => ({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  }));

const isDescendantOf = (
  unit: AjsUnit,
  ancestorId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean => {
  let current = unit.parentId ? unitById.get(unit.parentId) : undefined;
  while (current) {
    if (current.id === ancestorId) {
      return true;
    }
    current = current.parentId ? unitById.get(current.parentId) : undefined;
  }
  return false;
};

const includeNodeBounds = (
  bounds: FlowGraphBounds,
  position: FlowGraphPosition,
  width: number,
  height: number,
) => {
  bounds.minX = Math.min(bounds.minX, position.x);
  bounds.maxX = Math.max(bounds.maxX, position.x + width);
  bounds.minY = Math.min(bounds.minY, position.y);
  bounds.maxY = Math.max(bounds.maxY, position.y + height);
};

const includeDecorationBounds = (
  bounds: FlowGraphBounds,
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration,
) => {
  bounds.minX = Math.min(bounds.minX, position.x + decoration.panelOffsetXPx);
  bounds.maxX = Math.max(
    bounds.maxX,
    position.x + decoration.panelOffsetXPx + decoration.panelWidthPx,
  );
  bounds.minY = Math.min(bounds.minY, position.y + decoration.panelOffsetYPx);
  bounds.maxY = Math.max(
    bounds.maxY,
    position.y + decoration.panelOffsetYPx + decoration.panelHeightPx,
  );
};

const intersectsBounds = (
  position: FlowGraphPosition,
  width: number,
  height: number,
  bounds: FlowGraphBounds,
): boolean =>
  position.x < bounds.maxX &&
  position.x + width > bounds.minX &&
  position.y < bounds.maxY &&
  position.y + height > bounds.minY;

const buildIncomingSourcesByTarget = (
  edges: ReadonlyArray<FlowGraphEdgeDto>,
): Map<string, string[]> => {
  const incomingSourcesByTarget = new Map<string, string[]>();
  for (const edge of edges) {
    const sources = incomingSourcesByTarget.get(edge.target) ?? [];
    sources.push(edge.source);
    incomingSourcesByTarget.set(edge.target, sources);
  }
  return incomingSourcesByTarget;
};

const addVisibleNode = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
  node: FlowGraphNodeDto,
  position: FlowGraphPosition,
) => {
  context.nodes.push(node);
  context.nodeIds.add(unit.id);
  context.visibleUnitIds.add(unit.id);
  context.positionOverrides.set(unit.id, position);
};

const ensureChildNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnitPosition: FlowGraphPosition,
  child: AjsUnit,
): FlowGraphPosition | undefined => {
  const existingPosition = context.positionOverrides.get(child.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(child.id)) {
    return undefined;
  }

  const childPosition = calculateNestedChildPosition(
    expandedUnitPosition,
    child.layout.h,
    child.layout.v,
    context.basePx,
  );
  addVisibleNode(context, child, toGridNode(child), childPosition);
  return childPosition;
};

const ensureConditionNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnitPosition: FlowGraphPosition,
  conditionUnit: AjsUnit,
): FlowGraphPosition | undefined => {
  const existingPosition = context.positionOverrides.get(conditionUnit.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(conditionUnit.id)) {
    return undefined;
  }

  const conditionPosition = calculateNestedConditionPosition(
    expandedUnitPosition,
    context.basePx,
  );
  addVisibleNode(
    context,
    conditionUnit,
    toConditionNode(conditionUnit),
    conditionPosition,
  );
  return conditionPosition;
};

const appendExpandedUnitEdges = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  for (const edge of toEdgeDtos(expandedUnit)) {
    const edgeId = `${edge.source}-${edge.target}`;
    if (context.edgeIds.has(edgeId)) {
      continue;
    }
    context.edges.push(edge);
    context.edgeIds.add(edgeId);
  }
};

const toDecorationFromBounds = (
  position: FlowGraphPosition,
  bounds: FlowGraphBounds,
): ExpandedNodeDecoration => ({
  panelOffsetXPx: bounds.minX - position.x,
  panelOffsetYPx: bounds.minY - position.y,
  panelWidthPx: bounds.maxX - bounds.minX,
  panelHeightPx: bounds.maxY - bounds.minY,
});

const buildPanelBoundsFromSubtreeBounds = (
  bounds: FlowGraphBounds,
  metrics: FlowGraphMetrics,
): FlowGraphBounds => {
  const panelPaddingX = metrics.width * 0.3;
  const panelPaddingTop = metrics.height * 0.2;
  const panelPaddingBottom = metrics.height * 0.35;

  return {
    minX: bounds.minX - panelPaddingX,
    maxX: bounds.maxX + panelPaddingX,
    minY: bounds.minY - panelPaddingTop,
    maxY: bounds.maxY + panelPaddingBottom,
  };
};

const buildExpandedUnitSubtreeBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): { bounds: FlowGraphBounds; subtreeUnitIds: Set<string> } | undefined => {
  const expandedUnitPosition = context.positionOverrides.get(expandedUnit.id);
  if (!expandedUnitPosition) {
    return undefined;
  }

  const subtreeUnitIds = new Set<string>([expandedUnit.id]);
  const bounds: FlowGraphBounds = {
    minX: expandedUnitPosition.x,
    maxX: expandedUnitPosition.x + context.metrics.width,
    minY: expandedUnitPosition.y,
    maxY: expandedUnitPosition.y + context.metrics.height,
  };

  for (const child of expandedUnit.children.filter(
    (unit) => unit.unitType !== "rc",
  )) {
    subtreeUnitIds.add(child.id);
    const childPosition = ensureChildNodeVisible(
      context,
      expandedUnitPosition,
      child,
    );
    if (!childPosition) {
      continue;
    }
    includeNodeBounds(
      bounds,
      childPosition,
      context.metrics.width,
      context.metrics.height,
    );
    const childDecoration = context.nodeDecorations.get(child.id);
    if (childDecoration) {
      includeDecorationBounds(bounds, childPosition, childDecoration);
    }
  }

  const conditionUnit = expandedUnit.children.find(
    (child) => child.unitType === "rc",
  );
  if (conditionUnit) {
    subtreeUnitIds.add(conditionUnit.id);
    const conditionPosition = ensureConditionNodeVisible(
      context,
      expandedUnitPosition,
      conditionUnit,
    );
    if (conditionPosition) {
      includeNodeBounds(
        bounds,
        conditionPosition,
        context.metrics.width,
        context.metrics.height,
      );
    }
  }

  return { bounds, subtreeUnitIds };
};

const shiftNodeByDelta = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  dy: number,
) => {
  const position = context.positionOverrides.get(unitId);
  if (!position || dy <= 0) {
    return;
  }
  context.positionOverrides.set(unitId, {
    x: position.x,
    y: position.y + dy,
  });
};

const cascadeShiftToIncomingSources = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  dy: number,
  subtreeUnitIds: ReadonlySet<string>,
  panelBounds: FlowGraphBounds,
  visited: Set<string>,
) => {
  if (visited.has(unitId)) {
    return;
  }
  visited.add(unitId);
  const incomingSources = context.incomingSourcesByTarget.get(unitId) ?? [];
  for (const sourceUnitId of incomingSources) {
    if (subtreeUnitIds.has(sourceUnitId)) {
      continue;
    }
    const sourcePosition = context.positionOverrides.get(sourceUnitId);
    const targetPosition = context.positionOverrides.get(unitId);
    if (!sourcePosition || !targetPosition) {
      continue;
    }
    if (sourcePosition.x >= targetPosition.x) {
      continue;
    }
    if (sourcePosition.y + context.metrics.height < panelBounds.minY) {
      continue;
    }
    shiftNodeByDelta(context, sourceUnitId, dy);
    cascadeShiftToIncomingSources(
      context,
      sourceUnitId,
      dy,
      subtreeUnitIds,
      panelBounds,
      visited,
    );
  }
};

const shiftSiblingNodesRight = (
  context: ExpandedFlowGraphBuildContext,
  targetUnit: AjsUnit,
  targetMinX: number,
  excludes: ReadonlySet<string>,
) => {
  const targetPosition = context.positionOverrides.get(targetUnit.id);
  if (!targetPosition) {
    return;
  }

  let minSiblingX = Number.POSITIVE_INFINITY;
  for (const unitId of context.visibleUnitIds) {
    if (excludes.has(unitId)) {
      continue;
    }
    const unit = context.unitById.get(unitId);
    const position = context.positionOverrides.get(unitId);
    if (!unit || !position) {
      continue;
    }
    if (unit.parentId !== targetUnit.parentId) {
      continue;
    }
    if (position.x <= targetPosition.x) {
      continue;
    }
    minSiblingX = Math.min(minSiblingX, position.x);
  }

  const dx = Number.isFinite(minSiblingX)
    ? Math.max(0, targetMinX - minSiblingX)
    : 0;
  if (dx <= 0) {
    return;
  }

  for (const unitId of context.visibleUnitIds) {
    if (excludes.has(unitId)) {
      continue;
    }
    const unit = context.unitById.get(unitId);
    const position = context.positionOverrides.get(unitId);
    if (!unit || !position) {
      continue;
    }
    if (unit.parentId !== targetUnit.parentId) {
      continue;
    }
    if (position.x <= targetPosition.x) {
      continue;
    }
    context.positionOverrides.set(unitId, {
      x: position.x + dx,
      y: position.y,
    });
  }
};

const collectCollidingSiblingIds = (
  context: ExpandedFlowGraphBuildContext,
  subtreeUnitIds: ReadonlySet<string>,
  panelBounds: FlowGraphBounds,
): string[] =>
  [...context.visibleUnitIds]
    .filter((unitId) => !subtreeUnitIds.has(unitId))
    .filter((unitId) => {
      const position = context.positionOverrides.get(unitId);
      return (
        !!position &&
        intersectsBounds(
          position,
          context.metrics.width,
          context.metrics.height,
          panelBounds,
        )
      );
    })
    .sort(
      (left, right) =>
        (context.positionOverrides.get(left)?.y ?? 0) -
        (context.positionOverrides.get(right)?.y ?? 0),
    );

const shiftCollidingSiblingsBelowPanel = (
  context: ExpandedFlowGraphBuildContext,
  subtreeUnitIds: ReadonlySet<string>,
  panelBounds: FlowGraphBounds,
) => {
  const collidingSiblingIds = collectCollidingSiblingIds(
    context,
    subtreeUnitIds,
    panelBounds,
  );

  let nextAvailableY = panelBounds.maxY + context.metrics.marginY;
  for (const siblingId of collidingSiblingIds) {
    const siblingPosition = context.positionOverrides.get(siblingId);
    if (!siblingPosition) {
      continue;
    }
    const dy = Math.max(0, nextAvailableY - siblingPosition.y);
    if (dy <= 0) {
      nextAvailableY =
        siblingPosition.y + context.metrics.height + context.metrics.marginY;
      continue;
    }
    shiftNodeByDelta(context, siblingId, dy);
    cascadeShiftToIncomingSources(
      context,
      siblingId,
      dy,
      subtreeUnitIds,
      panelBounds,
      new Set<string>(),
    );
    nextAvailableY =
      (context.positionOverrides.get(siblingId)?.y ?? siblingPosition.y) +
      context.metrics.height +
      context.metrics.marginY;
  }
};

const expandVisibleNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  const subtreeLayout = buildExpandedUnitSubtreeBounds(context, expandedUnit);
  const expandedUnitPosition = context.positionOverrides.get(expandedUnit.id);
  if (!subtreeLayout || !expandedUnitPosition) {
    return;
  }

  appendExpandedUnitEdges(context, expandedUnit);

  const panelBounds = buildPanelBoundsFromSubtreeBounds(
    subtreeLayout.bounds,
    context.metrics,
  );
  shiftSiblingNodesRight(
    context,
    expandedUnit,
    panelBounds.maxX + context.metrics.marginX,
    subtreeLayout.subtreeUnitIds,
  );
  shiftCollidingSiblingsBelowPanel(
    context,
    subtreeLayout.subtreeUnitIds,
    panelBounds,
  );
  context.nodeDecorations.set(
    expandedUnit.id,
    toDecorationFromBounds(expandedUnitPosition, panelBounds),
  );
};

const relayoutExpandedAncestorPanels = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnits: ReadonlyArray<AjsUnit>,
) => {
  for (const expandedUnit of [...expandedUnits].reverse()) {
    const expandedUnitPosition = context.positionOverrides.get(expandedUnit.id);
    const panelBounds = buildExpandedPanelBounds(
      expandedUnit,
      context.visibleUnitIds,
      context.unitById,
      context.positionOverrides,
      context.nodeDecorations,
      context.metrics,
    );
    if (!expandedUnitPosition || !panelBounds) {
      continue;
    }
    const subtreeUnitIds = collectVisibleSubtreeUnitIds(
      expandedUnit,
      context.visibleUnitIds,
      context.unitById,
    );

    shiftSiblingNodesRight(
      context,
      expandedUnit,
      panelBounds.maxX + context.metrics.marginX,
      subtreeUnitIds,
    );
    shiftCollidingSiblingsBelowPanel(context, subtreeUnitIds, panelBounds);

    const updatedPanelBounds = buildExpandedPanelBounds(
      expandedUnit,
      context.visibleUnitIds,
      context.unitById,
      context.positionOverrides,
      context.nodeDecorations,
      context.metrics,
    );
    if (!updatedPanelBounds) {
      continue;
    }
    context.nodeDecorations.set(
      expandedUnit.id,
      toDecorationFromBounds(expandedUnitPosition, updatedPanelBounds),
    );
  }
};

const buildExpandedPanelBounds = (
  expandedUnit: AjsUnit,
  visibleUnitIds: ReadonlySet<string>,
  unitById: ReadonlyMap<string, AjsUnit>,
  positionOverrides: ReadonlyMap<string, FlowGraphPosition>,
  nodeDecorations: ReadonlyMap<string, ExpandedNodeDecoration>,
  metrics: FlowGraphMetrics,
): FlowGraphBounds | undefined => {
  const parentPosition = positionOverrides.get(expandedUnit.id);
  if (!parentPosition) {
    return undefined;
  }

  const subtreeBounds: FlowGraphBounds = {
    minX: parentPosition.x,
    maxX: parentPosition.x + metrics.width,
    minY: parentPosition.y,
    maxY: parentPosition.y + metrics.height,
  };

  for (const unitId of visibleUnitIds) {
    const unit = unitById.get(unitId);
    const position = positionOverrides.get(unitId);
    if (!unit || !position) {
      continue;
    }
    if (
      unit.id !== expandedUnit.id &&
      !isDescendantOf(unit, expandedUnit.id, unitById)
    ) {
      continue;
    }
    includeNodeBounds(subtreeBounds, position, metrics.width, metrics.height);
    const decoration = nodeDecorations.get(unit.id);
    if (decoration) {
      includeDecorationBounds(subtreeBounds, position, decoration);
    }
  }

  const panelPaddingX = metrics.width * 0.3;
  const panelPaddingTop = metrics.height * 0.2;
  const panelPaddingBottom = metrics.height * 0.35;

  return {
    minX: subtreeBounds.minX - panelPaddingX,
    maxX: subtreeBounds.maxX + panelPaddingX,
    minY: subtreeBounds.minY - panelPaddingTop,
    maxY: subtreeBounds.maxY + panelPaddingBottom,
  };
};

const collectVisibleSubtreeUnitIds = (
  expandedUnit: AjsUnit,
  visibleUnitIds: ReadonlySet<string>,
  unitById: ReadonlyMap<string, AjsUnit>,
): Set<string> => {
  const subtreeUnitIds = new Set<string>();
  for (const unitId of visibleUnitIds) {
    const unit = unitById.get(unitId);
    if (!unit) {
      continue;
    }
    if (
      unit.id === expandedUnit.id ||
      isDescendantOf(unit, expandedUnit.id, unitById)
    ) {
      subtreeUnitIds.add(unitId);
    }
  }
  return subtreeUnitIds;
};

export const buildExpandedFlowGraph = (
  document: AjsDocument,
  currentUnitId: string,
  expandedUnitIds: ReadonlySet<string>,
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
  const positionOverrides = new Map<string, FlowGraphPosition>();
  const nodeDecorations = new Map<string, ExpandedNodeDecoration>();

  for (const node of baseGraph.nodes) {
    positionOverrides.set(
      node.id,
      calculateFlowGraphNodePosition(node, basePx),
    );
  }

  const allUnits = flattenAjsUnits(document.rootUnits);
  const unitById = new Map(allUnits.map((unit) => [unit.id, unit]));
  const currentUnit = findAjsUnitById(document, currentUnitId);
  if (!currentUnit) {
    return { graph: baseGraph, positionOverrides, nodeDecorations };
  }

  const visibleUnitIds = new Set(nodes.map((node) => node.id));
  const incomingSourcesByTarget = buildIncomingSourcesByTarget(edges);
  const context: ExpandedFlowGraphBuildContext = {
    basePx,
    nodes,
    edges,
    nodeIds,
    edgeIds,
    visibleUnitIds,
    positionOverrides,
    nodeDecorations,
    unitById,
    incomingSourcesByTarget,
    metrics,
  };

  const sortedExpandedUnits = [...expandedUnitIds]
    .map((unitId) => unitById.get(unitId))
    .filter(
      (unit): unit is AjsUnit =>
        !!unit &&
        unit.id !== currentUnitId &&
        unit.unitType === "n" &&
        isDescendantOf(unit, currentUnitId, unitById),
    )
    .sort((left, right) => left.depth - right.depth);

  for (const expandedUnit of sortedExpandedUnits) {
    expandVisibleNestedUnit(context, expandedUnit);
  }

  relayoutExpandedAncestorPanels(context, sortedExpandedUnits);

  return {
    graph: {
      nodes,
      edges,
    },
    positionOverrides,
    nodeDecorations,
  };
};
