import type { ExpandedUnitPlacementConstraintDto } from "../../../../application/flow-graph/buildExpandedFlowGraph";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { FlowGraphPosition } from "./flowGraphPosition";
import type {
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
import { getDisplayPosition } from "./expandedFlowGraphPositionState";
import { applyExpandedChildrenGrowthOffsets } from "./expandedFlowGraphGrowthOffsets";
import { resolveExpandedScopePanelIntrusions } from "./expandedFlowGraphPanelIntrusion";
import { resolveSiblingLayoutItems } from "./expandedFlowGraphSiblingCollision";

const getUnits = (
  context: ExpandedFlowGraphBuildContext,
  unitIds: readonly string[],
): FlowGraphUnitDto[] =>
  unitIds
    .map((unitId) => context.unitById.get(unitId))
    .filter((unit): unit is FlowGraphUnitDto => !!unit);

const buildExpandedUnitPanelBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: FlowGraphUnitDto,
): FlowGraphBounds | undefined => {
  const expandedUnitPosition = getDisplayPosition(context, expandedUnit.id);
  if (!expandedUnitPosition) return undefined;
  return buildUnitPanelBounds(
    expandedUnitPosition,
    context.nodeDecorations.get(expandedUnit.id),
    context.metrics,
  );
};

const updateExpandedNodeDecoration = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: FlowGraphUnitDto,
): void => {
  const expandedUnitPosition = context.positionOverrides.get(expandedUnit.id);
  const panelBounds = buildExpandedPanelBounds(context, expandedUnit);
  if (!expandedUnitPosition || !panelBounds) return;
  context.nodeDecorations.set(
    expandedUnit.id,
    toDecorationFromBounds(expandedUnitPosition, panelBounds),
  );
};

const buildOccupiedLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  unit: FlowGraphUnitDto,
): LayoutItem | undefined => {
  const position = getDisplayPosition(context, unit.id);
  if (!position) return undefined;
  return {
    unit,
    position,
    occupiedBox:
      buildExpandedUnitPanelBounds(context, unit) ??
      buildUnitBaseBounds(position, context.metrics),
  };
};

const resolveSiblingSubtreeCollisions = (
  context: ExpandedFlowGraphBuildContext,
  visibleChildUnitIds: readonly string[],
): void => {
  const items = getUnits(context, visibleChildUnitIds)
    .map((unit) => buildOccupiedLayoutItem(context, unit))
    .filter((item): item is LayoutItem => !!item);
  resolveSiblingLayoutItems(context, items);
};

type ExpandedScopeRelayoutContext = {
  context: ExpandedFlowGraphBuildContext;
  containerUnitId: string;
  expandedChildren: FlowGraphUnitDto[];
  expandedUnitConstraints: ExpandedUnitPlacementConstraintDto[];
  visibleChildUnitIds: readonly string[];
};

const buildExpandedScopeRelayoutContext = (
  context: ExpandedFlowGraphBuildContext,
  containerUnitId: string,
): ExpandedScopeRelayoutContext => {
  const scope = context.scopeByContainerId.get(containerUnitId);
  const expandedChildUnitIds = scope?.expandedChildUnitIds ?? [];
  return {
    context,
    containerUnitId,
    expandedChildren: getUnits(context, expandedChildUnitIds),
    expandedUnitConstraints: expandedChildUnitIds
      .map((unitId) => context.expandedUnitById.get(unitId))
      .filter(
        (constraint): constraint is ExpandedUnitPlacementConstraintDto =>
          !!constraint,
      ),
    visibleChildUnitIds: scope?.visibleChildUnitIds ?? [],
  };
};

const relayoutExpandedScopeChildren = ({
  context,
  expandedChildren,
}: ExpandedScopeRelayoutContext): void => {
  for (const expandedChild of expandedChildren) {
    relayoutExpandedScope(context, expandedChild.id);
    updateExpandedNodeDecoration(context, expandedChild);
  }
};

const relayoutExpandedScopePhases = (
  relayoutContext: ExpandedScopeRelayoutContext,
): void => {
  relayoutExpandedScopeChildren(relayoutContext);
  resolveExpandedScopePanelIntrusions(
    relayoutContext.context,
    relayoutContext.expandedChildren,
    { buildExpandedUnitPanelBounds },
  );
  applyExpandedChildrenGrowthOffsets({
    context: relayoutContext.context,
    expandedChildren: relayoutContext.expandedChildren,
    expandedUnitConstraints: relayoutContext.expandedUnitConstraints,
    deps: { buildExpandedUnitPanelBounds },
  });
  resolveSiblingSubtreeCollisions(
    relayoutContext.context,
    relayoutContext.visibleChildUnitIds,
  );
};

export const relayoutExpandedScope = (
  context: ExpandedFlowGraphBuildContext,
  containerUnitId: string,
): void => {
  relayoutExpandedScopePhases(
    buildExpandedScopeRelayoutContext(context, containerUnitId),
  );
};

type PanelBoundsLayoutItem = {
  unit: FlowGraphUnitDto;
  position: FlowGraphPosition;
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

const getExpandedPanelUnitIds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnitId: string,
): readonly string[] => {
  const range = context.expandedUnitById.get(expandedUnitId)?.subtreeRange;
  return range
    ? context.constraints.containmentOrderUnitIds.slice(range.start, range.end)
    : [];
};

const buildExpandedPanelSubtreeBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: FlowGraphUnitDto,
  parentPosition: FlowGraphPosition,
): FlowGraphBounds => {
  const subtreeBounds = buildInitialPanelSubtreeBounds(
    parentPosition,
    context.metrics,
  );
  for (const unitId of getExpandedPanelUnitIds(context, expandedUnit.id)) {
    const item = getPanelBoundsLayoutItem(context, unitId);
    if (item) includePanelBoundsLayoutItem(context, subtreeBounds, item);
  }
  return subtreeBounds;
};

const buildExpandedPanelBounds = (
  context: ExpandedFlowGraphBuildContext,
  expandedUnit: FlowGraphUnitDto,
): FlowGraphBounds | undefined => {
  const parentPosition = context.positionOverrides.get(expandedUnit.id);
  if (!parentPosition) return undefined;
  return buildPanelBoundsFromSubtreeBounds(
    parentPosition,
    buildExpandedPanelSubtreeBounds(context, expandedUnit, parentPosition),
    context.metrics,
  );
};
