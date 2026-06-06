import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import type { FlowGraphEdgeDto } from "../../../application/flow-graph/buildFlowGraphCore";
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

const getParentUnit = (
  unit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): AjsUnit | undefined =>
  unit.parentId ? unitById.get(unit.parentId) : undefined;

const isAncestorMatch = (unit: AjsUnit, ancestorId: string): boolean =>
  unit.id === ancestorId;

const collectParentUnits = (
  unit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): AjsUnit[] => {
  const parents: AjsUnit[] = [];
  for (
    let current = getParentUnit(unit, unitById);
    current;
    current = getParentUnit(current, unitById)
  ) {
    parents.push(current);
  }
  return parents;
};

export const isDescendantOf = (
  unit: AjsUnit,
  ancestorId: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): boolean =>
  collectParentUnits(unit, unitById).some((parent) =>
    isAncestorMatch(parent, ancestorId),
  );

const includeNodeBounds = (
  bounds: FlowGraphBounds,
  nodeBounds: {
    position: FlowGraphPosition;
    width: number;
    height: number;
  },
) => {
  const { position, width, height } = nodeBounds;
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

const isAnchoredToUnit = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  parentUnitId: string,
) => context.parentAnchors.get(unitId) === parentUnitId;

const getAnchoredChildUnitIds = (
  context: ExpandedFlowGraphBuildContext,
  parentUnitId: string,
): string[] =>
  [...context.visibleUnitIds].filter((unitId) =>
    isAnchoredToUnit(context, unitId, parentUnitId),
  );

const syncAnchoredChildOverride = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
) => {
  syncDisplayPosition(context, unitId);
  syncAnchoredDescendantOverrides(context, unitId);
};

const syncAnchoredDescendantOverrides = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
) => {
  for (const anchoredChildUnitId of getAnchoredChildUnitIds(context, unitId)) {
    syncAnchoredChildOverride(context, anchoredChildUnitId);
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
  visibleNode: {
    unit: AjsUnit;
    initialPosition: FlowGraphPosition;
    parentAnchorId?: string;
  },
) => {
  const { unit, initialPosition, parentAnchorId } = visibleNode;
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

type VisibleNestedNode = {
  unit: AjsUnit;
  parentUnitId: string;
  calculatePosition: () => FlowGraphPosition;
};

const ensureVisibleNestedNode = (
  context: ExpandedFlowGraphBuildContext,
  visibleNode: VisibleNestedNode,
) => {
  const { unit, parentUnitId, calculatePosition } = visibleNode;
  const existingPosition = context.initialPositions.get(unit.id);
  if (existingPosition) {
    return existingPosition;
  }
  if (context.nodeIds.has(unit.id)) {
    return undefined;
  }

  const initialPosition = calculatePosition();
  addVisibleNode(context, {
    unit,
    initialPosition,
    parentAnchorId: parentUnitId,
  });
  return initialPosition;
};

const ensureChildNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  child: AjsUnit,
  parentUnitId: string,
): FlowGraphPosition | undefined =>
  ensureVisibleNestedNode(context, {
    unit: child,
    parentUnitId,
    calculatePosition: () =>
      calculateNestedChildPosition(
        { x: 0, y: 0 },
        child.layout.h,
        child.layout.v,
        context.basePx,
      ),
  });

const ensureConditionNodeVisible = (
  context: ExpandedFlowGraphBuildContext,
  conditionUnit: AjsUnit,
  parentUnitId: string,
): FlowGraphPosition | undefined =>
  ensureVisibleNestedNode(context, {
    unit: conditionUnit,
    parentUnitId,
    calculatePosition: () =>
      calculateNestedConditionPosition({ x: 0, y: 0 }, context.basePx),
  });

const toEdgeId = (edge: FlowGraphEdgeDto): string =>
  `${edge.source}-${edge.target}`;

const hasExpandedEdge = (
  context: ExpandedFlowGraphBuildContext,
  edge: FlowGraphEdgeDto,
): boolean => context.edgeIds.has(toEdgeId(edge));

const appendExpandedEdge = (
  context: ExpandedFlowGraphBuildContext,
  edge: FlowGraphEdgeDto,
) => {
  context.edges.push(edge);
  context.edgeIds.add(toEdgeId(edge));
};

const getNewExpandedEdges = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): FlowGraphEdgeDto[] =>
  toEdgeDtos(expandedUnit).filter((edge) => !hasExpandedEdge(context, edge));

const appendExpandedUnitEdges = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  for (const edge of getNewExpandedEdges(context, expandedUnit)) {
    appendExpandedEdge(context, edge);
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

type PanelPadding = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const toFlowGraphBounds = (
  min: FlowGraphPosition,
  max: FlowGraphPosition,
): FlowGraphBounds => ({
  minX: min.x,
  maxX: max.x,
  minY: min.y,
  maxY: max.y,
});

const buildPaddedBounds = (
  origin: FlowGraphPosition,
  extent: FlowGraphPosition,
  padding: PanelPadding,
): FlowGraphBounds =>
  toFlowGraphBounds(
    {
      x: origin.x - padding.left,
      y: origin.y - padding.top,
    },
    {
      x: extent.x + padding.right,
      y: extent.y + padding.bottom,
    },
  );

const getExpandedPanelPadding = (metrics: FlowGraphMetrics): PanelPadding => ({
  left: metrics.width * 0.3,
  right: metrics.width * 0.3,
  top: metrics.height * 0.2,
  bottom: metrics.height * 0.35,
});

const buildPanelBoundsFromSubtreeBounds = (
  position: FlowGraphPosition,
  bounds: FlowGraphBounds,
  metrics: FlowGraphMetrics,
): FlowGraphBounds =>
  buildPaddedBounds(
    position,
    { x: bounds.maxX, y: bounds.maxY },
    getExpandedPanelPadding(metrics),
  );

const buildUnitBaseBounds = (
  position: FlowGraphPosition,
  metrics: FlowGraphMetrics,
): FlowGraphBounds =>
  buildPaddedBounds(
    position,
    {
      x: position.x + metrics.width,
      y: position.y + metrics.height,
    },
    getExpandedPanelPadding(metrics),
  );

const buildUnitDecorationBounds = (
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration,
): FlowGraphBounds =>
  toFlowGraphBounds(
    {
      x: position.x + decoration.panelOffsetXPx,
      y: position.y + decoration.panelOffsetYPx,
    },
    {
      x: position.x + decoration.panelOffsetXPx + decoration.panelWidthPx,
      y: position.y + decoration.panelOffsetYPx + decoration.panelHeightPx,
    },
  );

const buildUnitPanelBounds = (
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration | undefined,
  metrics: FlowGraphMetrics,
): FlowGraphBounds =>
  decoration
    ? buildUnitDecorationBounds(position, decoration)
    : buildUnitBaseBounds(position, metrics);

const canRevealNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): boolean => !!getDisplayPosition(context, expandedUnit.id);

const getVisibleNestedChildren = (expandedUnit: AjsUnit): AjsUnit[] =>
  expandedUnit.children.filter((unit) => unit.unitType !== "rc");

const getConditionChild = (expandedUnit: AjsUnit): AjsUnit | undefined =>
  expandedUnit.children.find((child) => child.unitType === "rc");

const revealNestedChildren = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  for (const child of getVisibleNestedChildren(expandedUnit)) {
    ensureChildNodeVisible(context, child, expandedUnit.id);
  }
};

const revealConditionChild = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  const conditionUnit = getConditionChild(expandedUnit);
  if (conditionUnit) {
    ensureConditionNodeVisible(context, conditionUnit, expandedUnit.id);
  }
};

const revealVisibleNestedUnit = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
) => {
  if (!canRevealNestedUnit(context, expandedUnit)) {
    return;
  }

  revealNestedChildren(context, expandedUnit);
  revealConditionChild(context, expandedUnit);
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

const getVisibleDisplayPosition = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): [string, FlowGraphPosition][] => {
  const displayPosition = getDisplayPosition(context, unitId);
  return displayPosition ? [[unitId, displayPosition]] : [];
};

const getDisplayPositions = (context: ExpandedFlowGraphBuildContext) =>
  new Map(
    [...context.visibleUnitIds].flatMap((unitId) =>
      getVisibleDisplayPosition(context, unitId),
    ),
  );

type GrowthOffsetTarget = {
  context: ExpandedFlowGraphBuildContext;
  unitId: string;
  displayPosition: FlowGraphPosition;
  expandedUnitPosition: FlowGraphPosition;
  horizontalGrowth: number;
  verticalGrowth: number;
};

type UnitGrowthOffset = {
  unitId: string;
  offset: FlowGraphPosition;
};

type GrowthOffsetBatch = {
  context: ExpandedFlowGraphBuildContext;
  positionsBeforeOffset: ReadonlyMap<string, FlowGraphPosition>;
  expandedUnitPosition: FlowGraphPosition;
  horizontalGrowth: number;
  verticalGrowth: number;
  targetUnitIds: ReadonlySet<string>;
};

const isRightOfExpandedUnit = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.x > expandedUnitPosition.x;

const isBelowExpandedUnit = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.y > expandedUnitPosition.y;

const isSameExpandedUnitColumn = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.x === expandedUnitPosition.x;

const isSameExpandedUnitRow = ({
  displayPosition,
  expandedUnitPosition,
}: GrowthOffsetTarget): boolean => displayPosition.y === expandedUnitPosition.y;

const getHorizontalGrowthOffset = (target: GrowthOffsetTarget): number => {
  if (
    !isRightOfExpandedUnit(target) ||
    (!isBelowExpandedUnit(target) && !isSameExpandedUnitRow(target))
  ) {
    return 0;
  }
  return target.horizontalGrowth;
};

const getVerticalGrowthOffset = (target: GrowthOffsetTarget): number => {
  if (
    !isBelowExpandedUnit(target) ||
    (!isRightOfExpandedUnit(target) && !isSameExpandedUnitColumn(target))
  ) {
    return 0;
  }
  return Math.max(
    0,
    target.verticalGrowth - getOffset(target.context, target.unitId).y,
  );
};

const getGrowthOffset = (target: GrowthOffsetTarget): FlowGraphPosition => ({
  x: getHorizontalGrowthOffset(target),
  y: getVerticalGrowthOffset(target),
});

const hasOffset = (offset: FlowGraphPosition): boolean =>
  offset.x !== 0 || offset.y !== 0;

const getTargetGrowthOffset = (
  target: GrowthOffsetTarget,
): UnitGrowthOffset | undefined => {
  const offset = getGrowthOffset(target);
  return hasOffset(offset) ? { unitId: target.unitId, offset } : undefined;
};

const getTargetGrowthOffsets = ({
  context,
  positionsBeforeOffset,
  expandedUnitPosition,
  horizontalGrowth,
  verticalGrowth,
  targetUnitIds,
}: GrowthOffsetBatch): UnitGrowthOffset[] =>
  [...positionsBeforeOffset]
    .filter(([unitId]) => targetUnitIds.has(unitId))
    .map(([unitId, displayPosition]) =>
      getTargetGrowthOffset({
        context,
        unitId,
        displayPosition,
        expandedUnitPosition,
        horizontalGrowth,
        verticalGrowth,
      }),
    )
    .filter((growthOffset): growthOffset is UnitGrowthOffset => !!growthOffset);

const applyUnitGrowthOffsets = (
  context: ExpandedFlowGraphBuildContext,
  growthOffsets: ReadonlyArray<UnitGrowthOffset>,
): boolean =>
  growthOffsets.reduce(
    (changed, { unitId, offset }) =>
      addOffset(context, unitId, offset) || changed,
    false,
  );

type GrowthOffsetApplication = {
  expandedUnitPosition: FlowGraphPosition;
  horizontalGrowth: number;
  verticalGrowth: number;
  targetUnitIds: ReadonlySet<string>;
};

const applyGrowthOffsets = (
  context: ExpandedFlowGraphBuildContext,
  growthOffsetApplication: GrowthOffsetApplication,
) => {
  const {
    expandedUnitPosition,
    horizontalGrowth,
    verticalGrowth,
    targetUnitIds,
  } = growthOffsetApplication;
  if (horizontalGrowth === 0 && verticalGrowth === 0) {
    return false;
  }

  const positionsBeforeOffset = getDisplayPositions(context);
  return applyUnitGrowthOffsets(
    context,
    getTargetGrowthOffsets({
      context,
      positionsBeforeOffset,
      expandedUnitPosition,
      horizontalGrowth,
      verticalGrowth,
      targetUnitIds,
    }),
  );
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
  const panelBounds = buildExpandedPanelBounds(context, expandedUnit);
  if (!expandedUnitPosition || !panelBounds) {
    return;
  }
  context.nodeDecorations.set(
    expandedUnit.id,
    toDecorationFromBounds(expandedUnitPosition, panelBounds),
  );
};

type UpperExpandedPanelMaxRightTarget = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<AjsUnit>;
  expandedChild: AjsUnit;
  expandedChildPosition: FlowGraphPosition;
};

type UpperExpandedPanelCandidateBounds = {
  position: FlowGraphPosition;
  bounds: FlowGraphBounds;
};

const getUpperExpandedPanelCandidateBounds = (
  context: ExpandedFlowGraphBuildContext,
  upperCandidate: AjsUnit,
): UpperExpandedPanelCandidateBounds | undefined => {
  const position = getDisplayPosition(context, upperCandidate.id);
  const bounds = buildExpandedUnitPanelBounds(context, upperCandidate);
  if (!position || !bounds) {
    return undefined;
  }
  return { position, bounds };
};

const isUpperExpandedPanelCandidate = (
  candidate: UpperExpandedPanelCandidateBounds,
  expandedChildPosition: FlowGraphPosition,
) => candidate.position.y < expandedChildPosition.y;

const includeUpperPanelMaxRight = (
  maxRight: number | undefined,
  candidate: UpperExpandedPanelCandidateBounds,
) =>
  maxRight === undefined
    ? candidate.bounds.maxX
    : Math.max(maxRight, candidate.bounds.maxX);

const hasUpperExpandedPanelCandidateBounds = (
  candidate: UpperExpandedPanelCandidateBounds | undefined,
): candidate is UpperExpandedPanelCandidateBounds => !!candidate;

const getUpperExpandedPanelMaxRight = ({
  context,
  expandedChildren,
  expandedChild,
  expandedChildPosition,
}: UpperExpandedPanelMaxRightTarget): number | undefined =>
  expandedChildren
    .filter((upperCandidate) => upperCandidate.id !== expandedChild.id)
    .map((upperCandidate) =>
      getUpperExpandedPanelCandidateBounds(context, upperCandidate),
    )
    .filter(hasUpperExpandedPanelCandidateBounds)
    .filter((candidateBounds) =>
      isUpperExpandedPanelCandidate(candidateBounds, expandedChildPosition),
    )
    .reduce(includeUpperPanelMaxRight, undefined as number | undefined);

const doHorizontalRangesOverlap = (
  left: Pick<FlowGraphBounds, "minX" | "maxX">,
  right: Pick<FlowGraphBounds, "minX" | "maxX">,
): boolean => left.minX < right.maxX && right.minX < left.maxX;

const doVerticalRangesOverlap = (
  left: Pick<FlowGraphBounds, "minY" | "maxY">,
  right: Pick<FlowGraphBounds, "minY" | "maxY">,
): boolean => left.minY < right.maxY && right.minY < left.maxY;

const doBoundsOverlapHorizontally = (
  upperBounds: FlowGraphBounds,
  lowerBounds: FlowGraphBounds,
): boolean => doHorizontalRangesOverlap(upperBounds, lowerBounds);

const doBoundsOverlap = (left: LayoutBox, right: LayoutBox): boolean =>
  doHorizontalRangesOverlap(left, right) &&
  doVerticalRangesOverlap(left, right);

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

const getRightwardCollisionOffset = (
  fixed: LayoutItem,
  target: LayoutItem,
): number =>
  fixed.position.x < target.position.x
    ? fixed.occupiedBox.maxX - target.occupiedBox.minX
    : 0;

const getDownwardCollisionOffset = (
  fixed: LayoutItem,
  target: LayoutItem,
): number =>
  fixed.position.y < target.position.y
    ? fixed.occupiedBox.maxY - target.occupiedBox.minY
    : 0;

const getSiblingCollisionOffset = (
  fixed: LayoutItem,
  target: LayoutItem,
): FlowGraphPosition | undefined => {
  if (!doBoundsOverlap(fixed.occupiedBox, target.occupiedBox)) {
    return undefined;
  }

  const offset = {
    x: Math.max(0, getRightwardCollisionOffset(fixed, target)),
    y: Math.max(0, getDownwardCollisionOffset(fixed, target)),
  };
  return hasOffset(offset) ? offset : undefined;
};

const moveSiblingSubtree = (
  context: ExpandedFlowGraphBuildContext,
  target: LayoutItem,
  offset: FlowGraphPosition,
): LayoutItem => {
  addOffset(context, target.unit.id, offset);
  return buildOccupiedLayoutItem(context, target.unit) ?? target;
};

const moveTargetPastFixedSibling = (
  context: ExpandedFlowGraphBuildContext,
  target: LayoutItem,
  fixed: LayoutItem,
): LayoutItem => {
  const offset = getSiblingCollisionOffset(fixed, target);
  return offset ? moveSiblingSubtree(context, target, offset) : target;
};

const resolveTargetSiblingCollisions = (
  context: ExpandedFlowGraphBuildContext,
  fixedItems: ReadonlyArray<LayoutItem>,
  target: LayoutItem,
): LayoutItem =>
  fixedItems.reduce(
    (movedTarget, fixed) =>
      moveTargetPastFixedSibling(context, movedTarget, fixed),
    target,
  );

const resolveSiblingLayoutItems = (
  context: ExpandedFlowGraphBuildContext,
  layoutItems: ReadonlyArray<LayoutItem>,
) => {
  const resolvedItems: LayoutItem[] = [];

  layoutItems.forEach((target) => {
    resolvedItems.push(
      resolveTargetSiblingCollisions(context, resolvedItems, target),
    );
  });
};

const resolveSiblingSubtreeCollisions = (
  context: ExpandedFlowGraphBuildContext,
  containerUnitId: string,
) => {
  resolveSiblingLayoutItems(
    context,
    buildVisibleImmediateChildLayoutItems(context, containerUnitId),
  );
};

type ExpandedPanelLayoutItem = {
  unit: AjsUnit;
  position: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
};

const buildExpandedPanelLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
): ExpandedPanelLayoutItem | undefined => {
  const position = getDisplayPosition(context, unit.id);
  const panelBounds = buildExpandedUnitPanelBounds(context, unit);
  return position && panelBounds ? { unit, position, panelBounds } : undefined;
};

const isPanelPositionedAbove = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean => upper.position.y < lower.position.y;

const doesUpperPanelIntrudeVertically = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean => upper.panelBounds.maxY > lower.panelBounds.minY;

const doExpandedPanelsOverlapHorizontally = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean => doBoundsOverlapHorizontally(upper.panelBounds, lower.panelBounds);

const doesUpperPanelIntrudeIntoLowerPanel = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): boolean =>
  isPanelPositionedAbove(upper, lower) &&
  doesUpperPanelIntrudeVertically(upper, lower) &&
  doExpandedPanelsOverlapHorizontally(upper, lower);

const getLowerPanelVerticalIntrusion = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): number => upper.panelBounds.maxY - lower.panelBounds.minY;

const getLowerPanelIntrusionOffset = (
  upper: ExpandedPanelLayoutItem,
  lower: ExpandedPanelLayoutItem,
): FlowGraphPosition | undefined => {
  if (!doesUpperPanelIntrudeIntoLowerPanel(upper, lower)) {
    return undefined;
  }

  return {
    x: 0,
    y: getLowerPanelVerticalIntrusion(upper, lower),
  };
};

const moveLowerExpandedPanelPastUpper = (
  context: ExpandedFlowGraphBuildContext,
  upper: ExpandedPanelLayoutItem,
  lowerUnit: AjsUnit,
): void => {
  const lower = buildExpandedPanelLayoutItem(context, lowerUnit);
  if (!lower) {
    return;
  }

  const offset = getLowerPanelIntrusionOffset(upper, lower);
  if (offset) {
    addOffset(context, lower.unit.id, offset);
  }
};

const getLowerExpandedPanelCandidates = (
  upper: ExpandedPanelLayoutItem,
  expandedChildren: ReadonlyArray<AjsUnit>,
): AjsUnit[] => expandedChildren.filter((unit) => unit.id !== upper.unit.id);

const resolveUpperExpandedPanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  upperChild: AjsUnit,
  expandedChildren: ReadonlyArray<AjsUnit>,
): void => {
  const upper = buildExpandedPanelLayoutItem(context, upperChild);
  if (!upper) {
    return;
  }

  getLowerExpandedPanelCandidates(upper, expandedChildren).forEach(
    (lowerChild) => moveLowerExpandedPanelPastUpper(context, upper, lowerChild),
  );
};

const resolveLowerExpandedPanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<AjsUnit>,
) => {
  for (const upperChild of expandedChildren) {
    resolveUpperExpandedPanelIntrusions(context, upperChild, expandedChildren);
  }
};

type ExpandedChildGrowthContext = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<AjsUnit>;
  expandedChild: AjsUnit;
  immediateVisibleChildren: ReadonlyArray<AjsUnit>;
};

type ExpandedChildGrowthBounds = {
  position: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
};

const getExpandedNestedChildren = (
  containerUnit: AjsUnit,
  expandedUnitIdSet: ReadonlySet<string>,
): AjsUnit[] =>
  containerUnit.children
    .filter(
      (unit): unit is AjsUnit =>
        expandedUnitIdSet.has(unit.id) && isNestedJobnetUnit(unit),
    )
    .sort(compareExpandedUnits);

const relayoutExpandedChildren = (
  context: ExpandedFlowGraphBuildContext,
  expandedChildren: ReadonlyArray<AjsUnit>,
  expandedUnitIdSet: ReadonlySet<string>,
) => {
  for (const expandedChild of expandedChildren) {
    revealVisibleNestedUnit(context, expandedChild);
    relayoutExpandedScope(context, expandedChild, expandedUnitIdSet);
    updateExpandedNodeDecoration(context, expandedChild);
  }
};

const getExpandedChildGrowthBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedChild: AjsUnit,
): ExpandedChildGrowthBounds | undefined => {
  const position = getDisplayPosition(context, expandedChild.id);
  const panelBounds = buildExpandedUnitPanelBounds(context, expandedChild);
  if (!position || !panelBounds) {
    return undefined;
  }
  return { position, panelBounds };
};

const getGrowthTargetUnitIds = (
  immediateVisibleChildren: ReadonlyArray<AjsUnit>,
  expandedChild: AjsUnit,
) =>
  new Set(
    immediateVisibleChildren
      .filter((unit) => unit.id !== expandedChild.id)
      .map((unit) => unit.id),
  );

const calculateHorizontalGrowth = (
  panelBounds: FlowGraphBounds,
  baseBounds: FlowGraphBounds,
  upperPanelMaxRight: number | undefined,
): number =>
  Math.max(0, panelBounds.maxX - (upperPanelMaxRight ?? baseBounds.maxX));

const calculateVerticalGrowth = (
  panelBounds: FlowGraphBounds,
  baseBounds: FlowGraphBounds,
): number => Math.max(0, panelBounds.maxY - baseBounds.maxY);

const getExpandedChildGrowthOffsetApplication = ({
  context,
  expandedChildren,
  expandedChild,
  immediateVisibleChildren,
}: ExpandedChildGrowthContext): GrowthOffsetApplication | undefined => {
  const growthBounds = getExpandedChildGrowthBounds(context, expandedChild);
  if (!growthBounds) {
    return undefined;
  }

  const baseBounds = buildUnitBaseBounds(
    growthBounds.position,
    context.metrics,
  );
  const upperPanelMaxRight = getUpperExpandedPanelMaxRight({
    context,
    expandedChildren,
    expandedChild,
    expandedChildPosition: growthBounds.position,
  });

  return {
    expandedUnitPosition: growthBounds.position,
    horizontalGrowth: calculateHorizontalGrowth(
      growthBounds.panelBounds,
      baseBounds,
      upperPanelMaxRight,
    ),
    verticalGrowth: calculateVerticalGrowth(
      growthBounds.panelBounds,
      baseBounds,
    ),
    targetUnitIds: getGrowthTargetUnitIds(
      immediateVisibleChildren,
      expandedChild,
    ),
  };
};

const applyExpandedChildGrowthOffsets = (
  growthContext: ExpandedChildGrowthContext,
) => {
  const growthOffsetApplication =
    getExpandedChildGrowthOffsetApplication(growthContext);
  if (growthOffsetApplication) {
    applyGrowthOffsets(growthContext.context, growthOffsetApplication);
  }
};

const applyExpandedChildrenGrowthOffsets = (
  context: ExpandedFlowGraphBuildContext,
  containerUnit: AjsUnit,
  expandedChildren: ReadonlyArray<AjsUnit>,
) => {
  const immediateVisibleChildren = getVisibleImmediateChildren(
    context,
    containerUnit.id,
  );

  for (const expandedChild of expandedChildren) {
    applyExpandedChildGrowthOffsets({
      context,
      expandedChildren,
      expandedChild,
      immediateVisibleChildren,
    });
  }
};

export const relayoutExpandedScope = (
  context: ExpandedFlowGraphBuildContext,
  containerUnit: AjsUnit,
  expandedUnitIdSet: ReadonlySet<string>,
) => {
  const expandedChildren = getExpandedNestedChildren(
    containerUnit,
    expandedUnitIdSet,
  );
  relayoutExpandedChildren(context, expandedChildren, expandedUnitIdSet);
  resolveLowerExpandedPanelIntrusions(context, expandedChildren);
  applyExpandedChildrenGrowthOffsets(context, containerUnit, expandedChildren);
  resolveSiblingSubtreeCollisions(context, containerUnit.id);
};

type PanelBoundsLayoutItem = {
  unit: AjsUnit;
  position: FlowGraphPosition;
};

type ExpandedPanelBoundsTarget = {
  context: ExpandedFlowGraphBuildContext;
  expandedUnit: AjsUnit;
  subtreeBounds: FlowGraphBounds;
  unitId: string;
};

const buildInitialPanelSubtreeBounds = (
  parentPosition: FlowGraphPosition,
  metrics: FlowGraphMetrics,
): FlowGraphBounds => ({
  minX: parentPosition.x,
  maxX: parentPosition.x + metrics.width,
  minY: parentPosition.y,
  maxY: parentPosition.y + metrics.height,
});

const getPanelBoundsLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): PanelBoundsLayoutItem | undefined => {
  const unit = context.unitById.get(unitId);
  const position = context.positionOverrides.get(unitId);
  return unit && position ? { unit, position } : undefined;
};

const isExpandedPanelBoundsUnit = (
  context: ExpandedFlowGraphBuildContext,
  unit: AjsUnit,
  expandedUnit: AjsUnit,
): boolean =>
  unit.id === expandedUnit.id ||
  isDescendantOf(unit, expandedUnit.id, context.unitById);

const includePanelBoundsLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  subtreeBounds: FlowGraphBounds,
  item: PanelBoundsLayoutItem,
): void => {
  includeNodeBounds(subtreeBounds, {
    position: item.position,
    width: context.metrics.width,
    height: context.metrics.height,
  });

  const decoration = context.nodeDecorations.get(item.unit.id);
  if (decoration) {
    includeDecorationBounds(subtreeBounds, item.position, decoration);
  }
};

const includeExpandedPanelUnitBounds = ({
  context,
  expandedUnit,
  subtreeBounds,
  unitId,
}: ExpandedPanelBoundsTarget): void => {
  const item = getPanelBoundsLayoutItem(context, unitId);
  if (item && isExpandedPanelBoundsUnit(context, item.unit, expandedUnit)) {
    includePanelBoundsLayoutItem(context, subtreeBounds, item);
  }
};

const buildExpandedPanelSubtreeBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
  parentPosition: FlowGraphPosition,
): FlowGraphBounds => {
  const subtreeBounds = buildInitialPanelSubtreeBounds(
    parentPosition,
    context.metrics,
  );
  context.visibleUnitIds.forEach((unitId) =>
    includeExpandedPanelUnitBounds({
      context,
      expandedUnit,
      subtreeBounds,
      unitId,
    }),
  );
  return subtreeBounds;
};

const buildExpandedPanelBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: AjsUnit,
): FlowGraphBounds | undefined => {
  const parentPosition = context.positionOverrides.get(expandedUnit.id);
  if (!parentPosition) {
    return undefined;
  }

  return buildPanelBoundsFromSubtreeBounds(
    parentPosition,
    buildExpandedPanelSubtreeBounds(context, expandedUnit, parentPosition),
    context.metrics,
  );
};
