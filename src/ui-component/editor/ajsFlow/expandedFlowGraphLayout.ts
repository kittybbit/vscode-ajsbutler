import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import { FlowGraphPosition } from "./flowGraphPosition";
import { isNestedJobnetUnit } from "./nestedExpansion";
import { compareExpandedUnits } from "./expandedFlowGraphNodes";
import {
  ExpandedFlowGraphBuildContext,
  FlowGraphBounds,
  FlowGraphMetrics,
  LayoutItem,
} from "./expandedFlowGraphTypes";
import {
  buildPanelBoundsFromSubtreeBounds,
  buildUnitBaseBounds,
  buildUnitPanelBounds,
  doBoundsOverlap,
  doBoundsOverlapHorizontally,
  includeDecorationBounds,
  includeNodeBounds,
  toDecorationFromBounds,
} from "./expandedFlowGraphGeometry";
import { revealVisibleNestedUnit } from "./expandedFlowGraphReveal";
import {
  addOffset,
  getDisplayPosition,
  getDisplayPositions,
  getOffset,
  hasOffset,
  syncDisplayPosition,
} from "./expandedFlowGraphPositionState";

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

type SiblingCollisionMovement = {
  target: LayoutItem;
  offset: FlowGraphPosition;
};

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

const getSiblingCollisionMovement = (
  fixed: LayoutItem,
  target: LayoutItem,
): SiblingCollisionMovement | undefined => {
  const offset = getSiblingCollisionOffset(fixed, target);
  return offset ? { target, offset } : undefined;
};

const moveSiblingSubtree = (
  context: ExpandedFlowGraphBuildContext,
  target: LayoutItem,
  offset: FlowGraphPosition,
): LayoutItem => {
  addOffset(context, target.unit.id, offset);
  return buildOccupiedLayoutItem(context, target.unit) ?? target;
};

const applySiblingCollisionMovement = (
  context: ExpandedFlowGraphBuildContext,
  movement: SiblingCollisionMovement,
): LayoutItem => moveSiblingSubtree(context, movement.target, movement.offset);

const moveTargetPastFixedSibling = (
  context: ExpandedFlowGraphBuildContext,
  target: LayoutItem,
  fixed: LayoutItem,
): LayoutItem => {
  const movement = getSiblingCollisionMovement(fixed, target);
  return movement ? applySiblingCollisionMovement(context, movement) : target;
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

type ExpandedPanelIntrusionTarget = {
  upper: ExpandedPanelLayoutItem;
  lower: ExpandedPanelLayoutItem;
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
  target: ExpandedPanelIntrusionTarget,
): boolean =>
  isPanelPositionedAbove(target.upper, target.lower) &&
  doesUpperPanelIntrudeVertically(target.upper, target.lower) &&
  doExpandedPanelsOverlapHorizontally(target.upper, target.lower);

const getLowerPanelVerticalIntrusion = (
  target: ExpandedPanelIntrusionTarget,
): number => target.upper.panelBounds.maxY - target.lower.panelBounds.minY;

const getLowerPanelIntrusionOffset = (
  target: ExpandedPanelIntrusionTarget,
): FlowGraphPosition | undefined => {
  if (!doesUpperPanelIntrudeIntoLowerPanel(target)) {
    return undefined;
  }

  return {
    x: 0,
    y: getLowerPanelVerticalIntrusion(target),
  };
};

const moveLowerExpandedPanelPastUpper = (
  context: ExpandedFlowGraphBuildContext,
  target: ExpandedPanelIntrusionTarget,
): void => {
  const offset = getLowerPanelIntrusionOffset(target);
  if (offset) {
    addOffset(context, target.lower.unit.id, offset);
  }
};

const buildExpandedPanelIntrusionTarget = (
  upper: ExpandedPanelLayoutItem,
  lower: AjsUnit,
  context: ExpandedFlowGraphBuildContext,
): ExpandedPanelIntrusionTarget | undefined => {
  const lowerItem = buildExpandedPanelLayoutItem(context, lower);
  return lowerItem ? { upper, lower: lowerItem } : undefined;
};

const isDifferentExpandedPanelUnit = (
  upper: ExpandedPanelLayoutItem,
  lower: AjsUnit,
): boolean => lower.id !== upper.unit.id;

const collectExpandedPanelIntrusionTarget = (
  context: ExpandedFlowGraphBuildContext,
  upper: ExpandedPanelLayoutItem,
  lower: AjsUnit,
): ExpandedPanelIntrusionTarget[] => {
  const target = buildExpandedPanelIntrusionTarget(upper, lower, context);
  return target ? [target] : [];
};

const getLowerExpandedPanelCandidates = (
  context: ExpandedFlowGraphBuildContext,
  upper: ExpandedPanelLayoutItem,
  expandedChildren: ReadonlyArray<AjsUnit>,
): ExpandedPanelIntrusionTarget[] =>
  expandedChildren
    .filter((unit) => isDifferentExpandedPanelUnit(upper, unit))
    .flatMap((unit) =>
      collectExpandedPanelIntrusionTarget(context, upper, unit),
    );

const resolveUpperExpandedPanelIntrusions = (
  context: ExpandedFlowGraphBuildContext,
  upperChild: AjsUnit,
  expandedChildren: ReadonlyArray<AjsUnit>,
): void => {
  const upper = buildExpandedPanelLayoutItem(context, upperChild);
  if (!upper) {
    return;
  }

  getLowerExpandedPanelCandidates(context, upper, expandedChildren).forEach(
    (target) => moveLowerExpandedPanelPastUpper(context, target),
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

type ExpandedChildGrowthMeasurementContext = {
  context: ExpandedFlowGraphBuildContext;
  expandedChildren: ReadonlyArray<AjsUnit>;
  expandedChild: AjsUnit;
};

type ExpandedChildGrowthApplicationContext =
  ExpandedChildGrowthMeasurementContext & {
    immediateVisibleChildren: ReadonlyArray<AjsUnit>;
  };

type ExpandedChildGrowthBounds = {
  position: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
};

type ExpandedChildGrowthMeasurement = {
  expandedUnitPosition: FlowGraphPosition;
  panelBounds: FlowGraphBounds;
  baseBounds: FlowGraphBounds;
  upperPanelMaxRight?: number;
};

type ExpandedScopeRelayoutContext = {
  context: ExpandedFlowGraphBuildContext;
  containerUnit: AjsUnit;
  expandedChildren: ReadonlyArray<AjsUnit>;
  expandedUnitIdSet: ReadonlySet<string>;
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

const buildExpandedScopeRelayoutContext = (
  context: ExpandedFlowGraphBuildContext,
  containerUnit: AjsUnit,
  expandedUnitIdSet: ReadonlySet<string>,
): ExpandedScopeRelayoutContext => ({
  context,
  containerUnit,
  expandedChildren: getExpandedNestedChildren(containerUnit, expandedUnitIdSet),
  expandedUnitIdSet,
});

const relayoutExpandedScopeChildren = ({
  context,
  expandedChildren,
  expandedUnitIdSet,
}: ExpandedScopeRelayoutContext) => {
  for (const expandedChild of expandedChildren) {
    revealVisibleNestedUnit(
      context,
      {
        getDisplayPosition,
        syncDisplayPosition,
      },
      expandedChild,
    );
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

const getExpandedChildGrowthMeasurement = ({
  context,
  expandedChildren,
  expandedChild,
}: ExpandedChildGrowthMeasurementContext):
  | ExpandedChildGrowthMeasurement
  | undefined => {
  const growthBounds = getExpandedChildGrowthBounds(context, expandedChild);
  if (!growthBounds) {
    return undefined;
  }

  return {
    expandedUnitPosition: growthBounds.position,
    panelBounds: growthBounds.panelBounds,
    baseBounds: buildUnitBaseBounds(growthBounds.position, context.metrics),
    upperPanelMaxRight: getUpperExpandedPanelMaxRight({
      context,
      expandedChildren,
      expandedChild,
      expandedChildPosition: growthBounds.position,
    }),
  };
};

const buildGrowthOffsetApplication = (
  measurement: ExpandedChildGrowthMeasurement,
  targetUnitIds: ReadonlySet<string>,
): GrowthOffsetApplication => {
  const { expandedUnitPosition, panelBounds, baseBounds, upperPanelMaxRight } =
    measurement;
  return {
    expandedUnitPosition,
    horizontalGrowth: calculateHorizontalGrowth(
      panelBounds,
      baseBounds,
      upperPanelMaxRight,
    ),
    verticalGrowth: calculateVerticalGrowth(panelBounds, baseBounds),
    targetUnitIds,
  };
};

const getExpandedChildGrowthOffsetApplication = (
  growthContext: ExpandedChildGrowthApplicationContext,
): GrowthOffsetApplication | undefined => {
  const measurement = getExpandedChildGrowthMeasurement(growthContext);
  if (!measurement) {
    return undefined;
  }

  return buildGrowthOffsetApplication(
    measurement,
    getGrowthTargetUnitIds(
      growthContext.immediateVisibleChildren,
      growthContext.expandedChild,
    ),
  );
};

const applyExpandedChildGrowthOffsets = (
  growthContext: ExpandedChildGrowthApplicationContext,
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

const resolveExpandedScopePanelIntrusions = ({
  context,
  expandedChildren,
}: ExpandedScopeRelayoutContext): void => {
  resolveLowerExpandedPanelIntrusions(context, expandedChildren);
};

const applyExpandedScopeGrowthOffsets = ({
  context,
  containerUnit,
  expandedChildren,
}: ExpandedScopeRelayoutContext): void => {
  applyExpandedChildrenGrowthOffsets(context, containerUnit, expandedChildren);
};

const resolveExpandedScopeSiblingCollisions = ({
  context,
  containerUnit,
}: ExpandedScopeRelayoutContext): void => {
  resolveSiblingSubtreeCollisions(context, containerUnit.id);
};

const relayoutExpandedScopePhases = (
  relayoutContext: ExpandedScopeRelayoutContext,
): void => {
  relayoutExpandedScopeChildren(relayoutContext);
  resolveExpandedScopePanelIntrusions(relayoutContext);
  applyExpandedScopeGrowthOffsets(relayoutContext);
  resolveExpandedScopeSiblingCollisions(relayoutContext);
};

export const relayoutExpandedScope = (
  context: ExpandedFlowGraphBuildContext,
  containerUnit: AjsUnit,
  expandedUnitIdSet: ReadonlySet<string>,
) => {
  relayoutExpandedScopePhases(
    buildExpandedScopeRelayoutContext(
      context,
      containerUnit,
      expandedUnitIdSet,
    ),
  );
};

type PanelBoundsLayoutItem = {
  unit: AjsUnit;
  position: FlowGraphPosition;
};

type ExpandedPanelBoundsTarget = {
  context: ExpandedFlowGraphBuildContext;
  expandedUnit: AjsUnit;
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

const isExpandedPanelLayoutItem =
  ({ context, expandedUnit }: ExpandedPanelBoundsTarget) =>
  (item: PanelBoundsLayoutItem): boolean =>
    isExpandedPanelBoundsUnit(context, item.unit, expandedUnit);

const getExpandedPanelLayoutItems = ({
  context,
  expandedUnit,
}: ExpandedPanelBoundsTarget): PanelBoundsLayoutItem[] => {
  const isPanelLayoutItem = isExpandedPanelLayoutItem({
    context,
    expandedUnit,
  });
  return [...context.visibleUnitIds]
    .map((unitId) => getPanelBoundsLayoutItem(context, unitId))
    .filter(
      (item): item is PanelBoundsLayoutItem =>
        !!item && isPanelLayoutItem(item),
    );
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
  getExpandedPanelLayoutItems({ context, expandedUnit }).forEach((item) =>
    includePanelBoundsLayoutItem(context, subtreeBounds, item),
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
