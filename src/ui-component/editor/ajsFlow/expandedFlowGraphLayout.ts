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
  includeDecorationBounds,
  includeNodeBounds,
  toDecorationFromBounds,
} from "./expandedFlowGraphGeometry";
import { revealVisibleNestedUnit } from "./expandedFlowGraphReveal";
import {
  getDisplayPosition,
  syncDisplayPosition,
} from "./expandedFlowGraphPositionState";
import { applyExpandedChildrenGrowthOffsets } from "./expandedFlowGraphGrowthOffsets";
import { resolveExpandedScopePanelIntrusions } from "./expandedFlowGraphPanelIntrusion";
import { resolveSiblingLayoutItems } from "./expandedFlowGraphSiblingCollision";

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
