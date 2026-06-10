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
  includeDecorationBounds,
  includeNodeBounds,
  toDecorationFromBounds,
} from "./expandedFlowGraphGeometry";
import { revealVisibleNestedUnit } from "./expandedFlowGraphReveal";
import {
  addOffset,
  getDisplayPosition,
  hasOffset,
  syncDisplayPosition,
} from "./expandedFlowGraphPositionState";
import { applyExpandedChildrenGrowthOffsets } from "./expandedFlowGraphGrowthOffsets";
import { resolveExpandedScopePanelIntrusions } from "./expandedFlowGraphPanelIntrusion";

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

const resolveExpandedScopePanelIntrusionsPhase = ({
  context,
  expandedChildren,
}: ExpandedScopeRelayoutContext): void => {
  resolveExpandedScopePanelIntrusions(context, expandedChildren, {
    buildExpandedUnitPanelBounds,
  });
};

const applyExpandedScopeGrowthOffsets = ({
  context,
  containerUnit,
  expandedChildren,
}: ExpandedScopeRelayoutContext): void => {
  applyExpandedChildrenGrowthOffsets({
    context,
    containerUnit,
    expandedChildren,
    deps: {
      buildExpandedUnitPanelBounds,
      getVisibleImmediateChildren,
    },
  });
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
  resolveExpandedScopePanelIntrusionsPhase(relayoutContext);
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
