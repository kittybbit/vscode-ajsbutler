import {
  ExpandedFlowGraphBuildContext,
  LayoutItem,
} from "./expandedFlowGraphTypes";
import { FlowGraphPosition } from "./flowGraphPosition";
import { doBoundsOverlap } from "./expandedFlowGraphGeometry";
import { addOffset, hasOffset } from "./expandedFlowGraphPositionState";

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

const applySiblingSubtreeOffset = (
  context: ExpandedFlowGraphBuildContext,
  target: LayoutItem,
  offset: FlowGraphPosition,
): LayoutItem => {
  addOffset(context, target.unit.id, offset);
  return target;
};

const applySiblingCollisionMovement = (
  context: ExpandedFlowGraphBuildContext,
  movement: SiblingCollisionMovement,
): LayoutItem =>
  applySiblingSubtreeOffset(context, movement.target, movement.offset);

const resolveTargetAgainstFixedSibling = (
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
      resolveTargetAgainstFixedSibling(context, movedTarget, fixed),
    target,
  );

const appendResolvedSiblingLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  resolvedItems: LayoutItem[],
  target: LayoutItem,
): void => {
  resolvedItems.push(
    resolveTargetSiblingCollisions(context, resolvedItems, target),
  );
};

export const resolveSiblingLayoutItems = (
  context: ExpandedFlowGraphBuildContext,
  layoutItems: ReadonlyArray<LayoutItem>,
) => {
  const resolvedItems: LayoutItem[] = [];

  layoutItems.forEach((target) =>
    appendResolvedSiblingLayoutItem(context, resolvedItems, target),
  );
};
