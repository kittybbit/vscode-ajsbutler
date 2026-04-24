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
  parentAnchors: Map<string, string>;
  offsets: Map<string, FlowGraphPosition>;
  positionOverrides: Map<string, FlowGraphPosition>;
  nodeDecorations: Map<string, ExpandedNodeDecoration>;
  unitById: ReadonlyMap<string, AjsUnit>;
  metrics: FlowGraphMetrics;
};

const compareExpandedUnits = (left: AjsUnit, right: AjsUnit): number =>
  left.depth - right.depth ||
  left.layout.v - right.layout.v ||
  left.layout.h - right.layout.h ||
  left.absolutePath.localeCompare(right.absolutePath);

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
  const parentAnchorId = context.parentAnchors.get(unitId);
  const anchoredOrigin = parentAnchorId
    ? getDisplayPosition(context, parentAnchorId)
    : undefined;
  return addPositions(
    addPositions(anchoredOrigin ?? { x: 0, y: 0 }, initialPosition),
    getOffset(context, unitId),
  );
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

const syncAnchoredDescendantOverrides = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
) => {
  for (const visibleUnitId of context.visibleUnitIds) {
    if (context.parentAnchors.get(visibleUnitId) !== unitId) {
      continue;
    }
    syncPositionOverride(context, visibleUnitId);
    syncAnchoredDescendantOverrides(context, visibleUnitId);
  }
};

const addOffset = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  delta: FlowGraphPosition,
) => {
  if (delta.x === 0 && delta.y === 0) {
    return false;
  }

  const offset = getOffset(context, unitId);
  context.offsets.set(unitId, {
    x: offset.x + delta.x,
    y: offset.y + delta.y,
  });
  syncPositionOverride(context, unitId);
  syncAnchoredDescendantOverrides(context, unitId);
  return true;
};

const addVisibleNode = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
  node: FlowGraphNodeDto,
  initialPosition: FlowGraphPosition,
  parentAnchorId?: string,
) => {
  context.nodes.push(node);
  context.nodeIds.add(unit.id);
  context.visibleUnitIds.add(unit.id);
  context.initialPositions.set(unit.id, initialPosition);
  if (parentAnchorId) {
    context.parentAnchors.set(unit.id, parentAnchorId);
  }
  syncPositionOverride(context, unit.id);
};

const ensureChildNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  child: AjsUnit,
  parentUnitId: string,
): FlowGraphPosition | undefined => {
  const existingPosition = context.initialPositions.get(child.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(child.id)) {
    return undefined;
  }

  const childPosition = calculateNestedChildPosition(
    { x: 0, y: 0 },
    child.layout.h,
    child.layout.v,
    context.basePx,
  );
  addVisibleNode(
    context,
    child,
    toGridNode(child),
    childPosition,
    parentUnitId,
  );
  return childPosition;
};

const ensureConditionNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  conditionUnit: AjsUnit,
  parentUnitId: string,
): FlowGraphPosition | undefined => {
  const existingPosition = context.initialPositions.get(conditionUnit.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(conditionUnit.id)) {
    return undefined;
  }

  const conditionPosition = calculateNestedConditionPosition(
    { x: 0, y: 0 },
    context.basePx,
  );
  addVisibleNode(
    context,
    conditionUnit,
    toConditionNode(conditionUnit),
    conditionPosition,
    parentUnitId,
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
  position: FlowGraphPosition,
  bounds: FlowGraphBounds,
  metrics: FlowGraphMetrics,
): FlowGraphBounds => {
  const panelPaddingX = metrics.width * 0.3;
  const panelPaddingTop = metrics.height * 0.2;
  const panelPaddingBottom = metrics.height * 0.35;

  return {
    minX: position.x - panelPaddingX,
    maxX: bounds.maxX + panelPaddingX,
    minY: position.y - panelPaddingTop,
    maxY: bounds.maxY + panelPaddingBottom,
  };
};

const buildUnitBaseBounds = (
  position: FlowGraphPosition,
  metrics: FlowGraphMetrics,
): FlowGraphBounds => ({
  minX: position.x - metrics.width * 0.3,
  maxX: position.x + metrics.width * 1.3,
  minY: position.y - metrics.height * 0.2,
  maxY: position.y + metrics.height * 1.35,
});

const revealVisibleNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  if (!getDisplayPosition(context, expandedUnit.id)) {
    return;
  }

  for (const child of expandedUnit.children.filter(
    (unit) => unit.unitType !== "rc",
  )) {
    ensureChildNodeVisible(context, child, expandedUnit.id);
  }

  const conditionUnit = expandedUnit.children.find(
    (child) => child.unitType === "rc",
  );
  if (conditionUnit) {
    ensureConditionNodeVisible(context, conditionUnit, expandedUnit.id);
  }

  appendExpandedUnitEdges(context, expandedUnit);
};

const buildExpandedUnitPanelBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): FlowGraphBounds | undefined => {
  const expandedUnitPosition = getDisplayPosition(context, expandedUnit.id);
  const decoration = context.nodeDecorations.get(expandedUnit.id);
  if (!expandedUnitPosition) {
    return undefined;
  }
  if (!decoration) {
    return buildUnitBaseBounds(expandedUnitPosition, context.metrics);
  }
  return {
    minX: expandedUnitPosition.x + decoration.panelOffsetXPx,
    maxX:
      expandedUnitPosition.x +
      decoration.panelOffsetXPx +
      decoration.panelWidthPx,
    minY: expandedUnitPosition.y + decoration.panelOffsetYPx,
    maxY:
      expandedUnitPosition.y +
      decoration.panelOffsetYPx +
      decoration.panelHeightPx,
  };
};

const applyGrowthOffsets = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnitPosition: FlowGraphPosition,
  horizontalGrowth: number,
  verticalGrowth: number,
  targetUnitIds: ReadonlySet<string>,
) => {
  if (horizontalGrowth === 0 && verticalGrowth === 0) {
    return false;
  }

  const positionsBeforeOffset = new Map<string, FlowGraphPosition>();
  for (const unitId of context.visibleUnitIds) {
    const displayPosition = getDisplayPosition(context, unitId);
    if (displayPosition) {
      positionsBeforeOffset.set(unitId, displayPosition);
    }
  }

  let changed = false;
  for (const [unitId, displayPosition] of positionsBeforeOffset) {
    if (!targetUnitIds.has(unitId)) {
      continue;
    }
    const isRight = displayPosition.x > expandedUnitPosition.x;
    const isBelow = displayPosition.y > expandedUnitPosition.y;
    const isSameX = displayPosition.x === expandedUnitPosition.x;
    const isSameY = displayPosition.y === expandedUnitPosition.y;
    const dx = isRight && (isBelow || isSameY) ? horizontalGrowth : 0;
    const dy =
      isBelow && (isRight || isSameX)
        ? Math.max(0, verticalGrowth - getOffset(context, unitId).y)
        : 0;
    if (dx === 0 && dy === 0) {
      continue;
    }
    changed = addOffset(context, unitId, { x: dx, y: dy }) || changed;
  }

  return changed;
};

const getVisibleImmediateChildren = (
  context: ExpandedFlowGraphBuildContext,
  containerUnitId: string,
): AjsUnit[] =>
  [...context.visibleUnitIds]
    .map((unitId) => context.unitById.get(unitId))
    .filter(
      (unit): unit is AjsUnit => !!unit && unit.parentId === containerUnitId,
    )
    .sort(compareExpandedUnits);

const updateExpandedNodeDecoration = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
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
    return;
  }
  context.nodeDecorations.set(
    expandedUnit.id,
    toDecorationFromBounds(expandedUnitPosition, panelBounds),
  );
};

const getUpperExpandedPanelMaxRight = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<AjsUnit>,
  expandedChild: AjsUnit,
  expandedChildPosition: FlowGraphPosition,
): number | undefined => {
  let maxRight: number | undefined;
  for (const upperCandidate of expandedChildren) {
    if (upperCandidate.id === expandedChild.id) {
      continue;
    }
    const upperPosition = getDisplayPosition(context, upperCandidate.id);
    const upperPanelBounds = buildExpandedUnitPanelBounds(
      context,
      upperCandidate,
    );
    if (
      !upperPosition ||
      !upperPanelBounds ||
      upperPosition.y >= expandedChildPosition.y
    ) {
      continue;
    }
    maxRight =
      maxRight === undefined
        ? upperPanelBounds.maxX
        : Math.max(maxRight, upperPanelBounds.maxX);
  }
  return maxRight;
};

const doBoundsOverlapHorizontally = (
  upperBounds: FlowGraphBounds,
  lowerBounds: FlowGraphBounds,
) => upperBounds.minX < lowerBounds.maxX && lowerBounds.minX < upperBounds.maxX;

const resolveLowerExpandedPanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<AjsUnit>,
  activeExpandedUnitId: string | undefined,
) => {
  if (!activeExpandedUnitId) {
    return;
  }

  for (const upperChild of expandedChildren) {
    if (upperChild.id !== activeExpandedUnitId) {
      continue;
    }

    const upperPosition = getDisplayPosition(context, upperChild.id);
    const upperPanelBounds = buildExpandedUnitPanelBounds(context, upperChild);
    if (!upperPosition || !upperPanelBounds) {
      continue;
    }

    for (const lowerChild of expandedChildren) {
      if (upperChild.id === lowerChild.id) {
        continue;
      }

      const lowerPosition = getDisplayPosition(context, lowerChild.id);
      const lowerPanelBounds = buildExpandedUnitPanelBounds(
        context,
        lowerChild,
      );
      if (
        !lowerPosition ||
        !lowerPanelBounds ||
        upperPosition.y >= lowerPosition.y ||
        upperPanelBounds.maxY <= lowerPanelBounds.minY ||
        !doBoundsOverlapHorizontally(upperPanelBounds, lowerPanelBounds)
      ) {
        continue;
      }

      addOffset(context, lowerChild.id, {
        x: 0,
        y: upperPanelBounds.maxY - lowerPanelBounds.minY,
      });
    }
  }
};

const relayoutExpandedScope = (
  context: ExpandedFlowGraphBuildContext,
  containerUnit: AjsUnit,
  expandedUnitIdSet: ReadonlySet<string>,
  activeExpandedUnitId: string | undefined,
) => {
  const expandedChildren = containerUnit.children
    .filter(
      (unit): unit is AjsUnit =>
        expandedUnitIdSet.has(unit.id) && isNestedJobnetUnit(unit),
    )
    .sort(compareExpandedUnits);

  for (const expandedChild of expandedChildren) {
    revealVisibleNestedUnit(context, expandedChild);
    relayoutExpandedScope(
      context,
      expandedChild,
      expandedUnitIdSet,
      activeExpandedUnitId,
    );
    updateExpandedNodeDecoration(context, expandedChild);
  }

  resolveLowerExpandedPanelIntrusions(
    context,
    expandedChildren,
    activeExpandedUnitId,
  );

  const immediateVisibleChildren = getVisibleImmediateChildren(
    context,
    containerUnit.id,
  );

  for (const expandedChild of expandedChildren) {
    const expandedChildPosition = getDisplayPosition(context, expandedChild.id);
    const panelBounds = buildExpandedUnitPanelBounds(context, expandedChild);
    if (!expandedChildPosition || !panelBounds) {
      continue;
    }

    const baseBounds = buildUnitBaseBounds(
      expandedChildPosition,
      context.metrics,
    );
    const upperPanelMaxRight = getUpperExpandedPanelMaxRight(
      context,
      expandedChildren,
      expandedChild,
      expandedChildPosition,
    );
    const horizontalGrowth =
      upperPanelMaxRight === undefined
        ? Math.max(0, panelBounds.maxX - baseBounds.maxX)
        : Math.max(0, panelBounds.maxX - upperPanelMaxRight);
    const verticalGrowth = Math.max(0, panelBounds.maxY - baseBounds.maxY);
    const targetUnitIds = new Set(
      immediateVisibleChildren
        .filter((unit) => unit.id !== expandedChild.id)
        .map((unit) => unit.id),
    );

    applyGrowthOffsets(
      context,
      expandedChildPosition,
      horizontalGrowth,
      verticalGrowth,
      targetUnitIds,
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

  return buildPanelBoundsFromSubtreeBounds(
    parentPosition,
    subtreeBounds,
    metrics,
  );
};

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

  const expandedUnitIdList = [...expandedUnitIds];
  const activeExpandedUnitId = Array.isArray(expandedUnitIds)
    ? expandedUnitIds.at(-1)
    : undefined;
  const expandedUnitIdSet = new Set(
    expandedUnitIdList.filter((unitId) => {
      const unit = unitById.get(unitId);
      return (
        !!unit &&
        unit.id !== currentUnitId &&
        isNestedJobnetUnit(unit) &&
        isDescendantOf(unit, currentUnitId, unitById)
      );
    }),
  );

  relayoutExpandedScope(
    context,
    currentUnit,
    expandedUnitIdSet,
    activeExpandedUnitId,
  );

  return {
    graph: {
      nodes,
      edges,
    },
    positionOverrides,
    nodeDecorations,
  };
};
