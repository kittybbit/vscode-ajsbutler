import { FlowGraphPosition } from "./flowGraphPosition";
import { ExpandedFlowGraphBuildContext } from "./expandedFlowGraphTypes";

const addPositions = (
  position: FlowGraphPosition,
  offset: FlowGraphPosition,
): FlowGraphPosition => ({
  x: position.x + offset.x,
  y: position.y + offset.y,
});

export const hasOffset = (offset: FlowGraphPosition): boolean =>
  offset.x !== 0 || offset.y !== 0;

export const getOffset = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): FlowGraphPosition => context.offsets.get(unitId) ?? { x: 0, y: 0 };

const getAnchoredOrigin = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): FlowGraphPosition => {
  const parentAnchorId = context.parentAnchors.get(unitId);
  return parentAnchorId
    ? (getDisplayPosition(context, parentAnchorId) ?? { x: 0, y: 0 })
    : { x: 0, y: 0 };
};

const buildAnchoredDisplayPosition = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  initialPosition: FlowGraphPosition,
): FlowGraphPosition =>
  addPositions(
    addPositions(getAnchoredOrigin(context, unitId), initialPosition),
    getOffset(context, unitId),
  );

export const getDisplayPosition = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): FlowGraphPosition | undefined => {
  const initialPosition = context.initialPositions.get(unitId);
  if (!initialPosition) {
    return undefined;
  }
  return buildAnchoredDisplayPosition(context, unitId, initialPosition);
};

export const syncDisplayPosition = (
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
  syncAnchoredSubtreeOverrides(context, unitId);
};

const syncAnchoredDescendantOverrides = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
) => {
  for (const anchoredChildUnitId of getAnchoredChildUnitIds(context, unitId)) {
    syncAnchoredChildOverride(context, anchoredChildUnitId);
  }
};

const syncAnchoredSubtreeOverrides = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
) => {
  syncDisplayPosition(context, unitId);
  syncAnchoredDescendantOverrides(context, unitId);
};

export const addOffset = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
  delta: FlowGraphPosition,
) => {
  if (!hasOffset(delta)) {
    return false;
  }

  context.offsets.set(unitId, addPositions(getOffset(context, unitId), delta));
  syncAnchoredSubtreeOverrides(context, unitId);
  return true;
};

const getVisibleDisplayPosition = (
  context: ExpandedFlowGraphBuildContext,
  unitId: string,
): [string, FlowGraphPosition][] => {
  const displayPosition = getDisplayPosition(context, unitId);
  return displayPosition ? [[unitId, displayPosition]] : [];
};

export const getDisplayPositions = (context: ExpandedFlowGraphBuildContext) =>
  new Map(
    [...context.visibleUnitIds].flatMap((unitId) =>
      getVisibleDisplayPosition(context, unitId),
    ),
  );
