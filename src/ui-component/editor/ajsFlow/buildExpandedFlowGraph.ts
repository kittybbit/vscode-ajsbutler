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
import { isNestedJobnetUnit } from "./nestedExpansion";

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
  initialPositions: Map<string, FlowGraphPosition>;
  offsets: Map<string, FlowGraphPosition>;
  positionOverrides: Map<string, FlowGraphPosition>;
  nodeDecorations: Map<string, ExpandedNodeDecoration>;
  unitById: ReadonlyMap<string, AjsUnit>;
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

const addPositions = (
  position: FlowGraphPosition,
  offset: FlowGraphPosition,
): FlowGraphPosition => ({
  x: position.x + offset.x,
  y: position.y + offset.y,
});

const getOffset = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): FlowGraphPosition => context.offsets.get(unitId) ?? { x: 0, y: 0 };

const getDisplayPosition = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): FlowGraphPosition | undefined => {
  const initialPosition = context.initialPositions.get(unitId);
  if (!initialPosition) {
    return undefined;
  }
  return addPositions(initialPosition, getOffset(context, unitId));
};

const syncPositionOverride = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
) => {
  const displayPosition = getDisplayPosition(context, unitId);
  if (displayPosition) {
    context.positionOverrides.set(unitId, displayPosition);
  }
};

const addOffset = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  delta: FlowGraphPosition,
) => {
  if (delta.x === 0 && delta.y === 0) {
    return;
  }

  const offset = getOffset(context, unitId);
  context.offsets.set(unitId, {
    x: offset.x + delta.x,
    y: offset.y + delta.y,
  });
  syncPositionOverride(context, unitId);
};

const addVisibleNode = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
  node: FlowGraphNodeDto,
  initialPosition: FlowGraphPosition,
) => {
  context.nodes.push(node);
  context.nodeIds.add(unit.id);
  context.visibleUnitIds.add(unit.id);
  context.initialPositions.set(unit.id, initialPosition);
  syncPositionOverride(context, unit.id);
};

const ensureChildNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnitPosition: FlowGraphPosition,
  child: AjsUnit,
): FlowGraphPosition | undefined => {
  const existingPosition = context.initialPositions.get(child.id);
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
  const existingPosition = context.initialPositions.get(conditionUnit.id);
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

const buildExpandedUnitRevealBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): FlowGraphBounds | undefined => {
  const expandedUnitPosition = getDisplayPosition(context, expandedUnit.id);
  if (!expandedUnitPosition) {
    return undefined;
  }

  const bounds: FlowGraphBounds = {
    minX: expandedUnitPosition.x,
    maxX: expandedUnitPosition.x + context.metrics.width,
    minY: expandedUnitPosition.y,
    maxY: expandedUnitPosition.y + context.metrics.height,
  };

  for (const child of expandedUnit.children.filter(
    (unit) => unit.unitType !== "rc",
  )) {
    const childPosition = ensureChildNodeVisible(
      context,
      expandedUnitPosition,
      child,
    );
    if (!childPosition) {
      continue;
    }
    const childDisplayPosition = getDisplayPosition(context, child.id);
    if (!childDisplayPosition) {
      continue;
    }
    includeNodeBounds(
      bounds,
      childDisplayPosition,
      context.metrics.width,
      context.metrics.height,
    );
  }

  const conditionUnit = expandedUnit.children.find(
    (child) => child.unitType === "rc",
  );
  if (conditionUnit) {
    const conditionPosition = ensureConditionNodeVisible(
      context,
      expandedUnitPosition,
      conditionUnit,
    );
    const conditionDisplayPosition = getDisplayPosition(
      context,
      conditionUnit.id,
    );
    if (conditionPosition && conditionDisplayPosition) {
      includeNodeBounds(
        bounds,
        conditionDisplayPosition,
        context.metrics.width,
        context.metrics.height,
      );
    }
  }

  return bounds;
};

const applyExpansionOffsets = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnitPosition: FlowGraphPosition,
  panelBounds: FlowGraphBounds,
  excludedUnitIds: ReadonlySet<string>,
) => {
  const clearanceX = context.metrics.width * 0.12;
  const clearanceY = context.metrics.height * 0.12;
  const horizontalOffset = Math.max(
    0,
    panelBounds.maxX -
      (expandedUnitPosition.x + context.metrics.width) +
      clearanceX,
  );
  const verticalOffset = Math.max(
    0,
    panelBounds.maxY -
      (expandedUnitPosition.y + context.metrics.height) +
      clearanceY,
  );

  const positionsBeforeExpansionOffset = new Map<string, FlowGraphPosition>();
  for (const unitId of context.visibleUnitIds) {
    const displayPosition = getDisplayPosition(context, unitId);
    if (displayPosition) {
      positionsBeforeExpansionOffset.set(unitId, displayPosition);
    }
  }

  for (const [unitId, displayPosition] of positionsBeforeExpansionOffset) {
    if (excludedUnitIds.has(unitId)) {
      continue;
    }
    const isRight = displayPosition.x > expandedUnitPosition.x;
    const isBelow = displayPosition.y > expandedUnitPosition.y;
    const isSameX = displayPosition.x === expandedUnitPosition.x;
    const isSameY = displayPosition.y === expandedUnitPosition.y;
    const dx = isRight && (isBelow || isSameY) ? horizontalOffset : 0;
    const dy = isBelow && (isRight || isSameX) ? verticalOffset : 0;
    if (dx === 0 && dy === 0) {
      continue;
    }
    addOffset(context, unitId, { x: dx, y: dy });
  }
};

const expandVisibleNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  const expandedUnitPosition = getDisplayPosition(context, expandedUnit.id);
  const revealBounds = buildExpandedUnitRevealBounds(context, expandedUnit);
  if (!revealBounds || !expandedUnitPosition) {
    return;
  }

  appendExpandedUnitEdges(context, expandedUnit);

  const panelBounds = buildPanelBoundsFromSubtreeBounds(
    revealBounds,
    context.metrics,
  );
  applyExpansionOffsets(
    context,
    expandedUnitPosition,
    panelBounds,
    collectVisibleSubtreeUnitIds(
      expandedUnit,
      context.visibleUnitIds,
      context.unitById,
    ),
  );
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

const updateExpandedNodeDecorations = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnits: ReadonlyArray<AjsUnit>,
) => {
  context.nodeDecorations.clear();
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
    context.nodeDecorations.set(
      expandedUnit.id,
      toDecorationFromBounds(expandedUnitPosition, panelBounds),
    );
  }
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
  const initialPositions = new Map<string, FlowGraphPosition>();
  const offsets = new Map<string, FlowGraphPosition>();
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
    offsets,
    positionOverrides,
    nodeDecorations,
    unitById,
    metrics,
  };

  const sortedExpandedUnits = [...expandedUnitIds]
    .map((unitId) => unitById.get(unitId))
    .filter(
      (unit): unit is AjsUnit =>
        !!unit &&
        unit.id !== currentUnitId &&
        isNestedJobnetUnit(unit) &&
        isDescendantOf(unit, currentUnitId, unitById),
    )
    .sort((left, right) => left.depth - right.depth);

  for (const expandedUnit of sortedExpandedUnits) {
    expandVisibleNestedUnit(context, expandedUnit);
  }

  updateExpandedNodeDecorations(context, sortedExpandedUnits);

  return {
    graph: {
      nodes,
      edges,
    },
    positionOverrides,
    nodeDecorations,
  };
};
