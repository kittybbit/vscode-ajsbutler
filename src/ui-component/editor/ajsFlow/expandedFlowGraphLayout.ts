import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import {
  calculateNestedChildPosition,
  calculateNestedConditionPosition,
  FlowGraphPosition,
} from "./flowGraphPosition";
import { isNestedJobnetUnit } from "./nestedExpansion";
import {
  compareExpandedUnits,
  toConditionNode,
  toEdgeDtos,
  toGridNode,
} from "./expandedFlowGraphNodes";
import {
  ExpandedFlowGraphBuildContext,
  ExpandedNodeDecoration,
  FlowGraphBounds,
  FlowGraphMetrics,
  LayoutBox,
  LayoutItem,
} from "./expandedFlowGraphTypes";

export const isDescendantOf = (
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

const syncDisplayPosition = (
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
    syncDisplayPosition(context, visibleUnitId);
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
  syncDisplayPosition(context, unitId);
  syncAnchoredDescendantOverrides(context, unitId);
  return true;
};

const addVisibleNode = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
  initialPosition: FlowGraphPosition,
  parentAnchorId?: string,
) => {
  context.nodes.push(
    unit.unitType === "rc" ? toConditionNode(unit) : toGridNode(unit),
  );
  context.nodeIds.add(unit.id);
  context.visibleUnitIds.add(unit.id);
  context.initialPositions.set(unit.id, initialPosition);
  if (parentAnchorId) {
    context.parentAnchors.set(unit.id, parentAnchorId);
  }
  syncDisplayPosition(context, unit.id);
};

const ensureVisibleNestedNode = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
  parentUnitId: string,
  calculatePosition: () => FlowGraphPosition,
) => {
  const existingPosition = context.initialPositions.get(unit.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(unit.id)) {
    return undefined;
  }

  const initialPosition = calculatePosition();
  addVisibleNode(context, unit, initialPosition, parentUnitId);
  return initialPosition;
};

const ensureChildNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  child: AjsUnit,
  parentUnitId: string,
): FlowGraphPosition | undefined =>
  ensureVisibleNestedNode(context, child, parentUnitId, () =>
    calculateNestedChildPosition(
      { x: 0, y: 0 },
      child.layout.h,
      child.layout.v,
      context.basePx,
    ),
  );

const ensureConditionNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  conditionUnit: AjsUnit,
  parentUnitId: string,
): FlowGraphPosition | undefined =>
  ensureVisibleNestedNode(context, conditionUnit, parentUnitId, () =>
    calculateNestedConditionPosition({ x: 0, y: 0 }, context.basePx),
  );

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

const buildUnitPanelBounds = (
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration | undefined,
  metrics: FlowGraphMetrics,
): FlowGraphBounds =>
  decoration
    ? {
        minX: position.x + decoration.panelOffsetXPx,
        maxX: position.x + decoration.panelOffsetXPx + decoration.panelWidthPx,
        minY: position.y + decoration.panelOffsetYPx,
        maxY: position.y + decoration.panelOffsetYPx + decoration.panelHeightPx,
      }
    : buildUnitBaseBounds(position, metrics);

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
  if (!expandedUnitPosition) {
    return undefined;
  }
  return buildUnitPanelBounds(
    expandedUnitPosition,
    context.nodeDecorations.get(expandedUnit.id),
    context.metrics,
  );
};

const getDisplayPositions = (context: ExpandedFlowGraphBuildContext) => {
  const positions = new Map<string, FlowGraphPosition>();
  for (const unitId of context.visibleUnitIds) {
    const displayPosition = getDisplayPosition(context, unitId);
    if (displayPosition) {
      positions.set(unitId, displayPosition);
    }
  }
  return positions;
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

  const positionsBeforeOffset = getDisplayPositions(context);

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

const doBoundsOverlap = (left: LayoutBox, right: LayoutBox) =>
  left.minX < right.maxX &&
  right.minX < left.maxX &&
  left.minY < right.maxY &&
  right.minY < left.maxY;

const buildOccupiedLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
): LayoutItem | undefined => {
  const position = getDisplayPosition(context, unit.id);
  if (!position) {
    return undefined;
  }
  return {
    unit,
    position,
    occupiedBox:
      buildExpandedUnitPanelBounds(context, unit) ??
      buildUnitBaseBounds(position, context.metrics),
  };
};

const buildVisibleImmediateChildLayoutItems = (
  context: ExpandedFlowGraphBuildContext,
  containerUnitId: string,
): LayoutItem[] =>
  getVisibleImmediateChildren(context, containerUnitId)
    .map((unit) => buildOccupiedLayoutItem(context, unit))
    .filter((item): item is LayoutItem => !!item);

const resolveSiblingSubtreeCollisions = (
  context: ExpandedFlowGraphBuildContext,
  containerUnitId: string,
) => {
  const layoutItems = buildVisibleImmediateChildLayoutItems(
    context,
    containerUnitId,
  );

  for (let targetIndex = 0; targetIndex < layoutItems.length; targetIndex++) {
    let target = layoutItems[targetIndex];
    for (let fixedIndex = 0; fixedIndex < targetIndex; fixedIndex++) {
      const fixed = layoutItems[fixedIndex];
      if (!doBoundsOverlap(fixed.occupiedBox, target.occupiedBox)) {
        continue;
      }

      const dx =
        fixed.position.x < target.position.x
          ? fixed.occupiedBox.maxX - target.occupiedBox.minX
          : 0;
      const dy =
        fixed.position.y < target.position.y
          ? fixed.occupiedBox.maxY - target.occupiedBox.minY
          : 0;
      if (dx <= 0 && dy <= 0) {
        continue;
      }

      addOffset(context, target.unit.id, {
        x: Math.max(0, dx),
        y: Math.max(0, dy),
      });
      target = buildOccupiedLayoutItem(context, target.unit) ?? target;
      layoutItems[targetIndex] = target;
    }
  }
};

const resolveLowerExpandedPanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<AjsUnit>,
) => {
  for (const upperChild of expandedChildren) {
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

export const relayoutExpandedScope = (
  context: ExpandedFlowGraphBuildContext,
  containerUnit: AjsUnit,
  expandedUnitIdSet: ReadonlySet<string>,
) => {
  const expandedChildren = containerUnit.children
    .filter(
      (unit): unit is AjsUnit =>
        expandedUnitIdSet.has(unit.id) && isNestedJobnetUnit(unit),
    )
    .sort(compareExpandedUnits);

  for (const expandedChild of expandedChildren) {
    revealVisibleNestedUnit(context, expandedChild);
    relayoutExpandedScope(context, expandedChild, expandedUnitIdSet);
    updateExpandedNodeDecoration(context, expandedChild);
  }

  resolveLowerExpandedPanelIntrusions(context, expandedChildren);

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

  resolveSiblingSubtreeCollisions(context, containerUnit.id);
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
