import {
  buildUnitBaseBounds,
  doBoundsOverlap,
} from "./expandedFlowGraphGeometry";
import { addOffset, hasOffset } from "./expandedFlowGraphPositionState";
import type {
  ExpandedFlowGraphBuildContext,
  LayoutItem,
} from "./expandedFlowGraphTypes";
import type { FlowGraphPosition } from "./flowGraphPosition";

const eligibleOffset = (
  fixed: LayoutItem,
  target: LayoutItem,
  clearance: FlowGraphPosition,
): FlowGraphPosition => ({
  x: fixed.position.x < target.position.x ? clearance.x : 0,
  y: fixed.position.y < target.position.y ? clearance.y : 0,
});

const clearanceFrom = (
  fixed: LayoutItem,
  target: LayoutItem,
): FlowGraphPosition => ({
  x: fixed.occupiedBox.maxX - target.occupiedBox.minX,
  y: fixed.occupiedBox.maxY - target.occupiedBox.minY,
});

const moveLayoutItem = (
  item: LayoutItem,
  position: FlowGraphPosition,
): LayoutItem => {
  const x = position.x - item.position.x;
  const y = position.y - item.position.y;
  const { minX, maxX, minY, maxY } = item.occupiedBox;
  return {
    ...item,
    position,
    occupiedBox: {
      minX: minX + x,
      maxX: maxX + x,
      minY: minY + y,
      maxY: maxY + y,
    },
  };
};

const refreshLayoutItem = (
  context: ExpandedFlowGraphBuildContext,
  item: LayoutItem,
): LayoutItem =>
  moveLayoutItem(
    item,
    context.positionOverrides.get(item.unitId) ?? item.position,
  );

const applyOrdinaryClearance = (
  context: ExpandedFlowGraphBuildContext,
  target: LayoutItem,
  fixed: LayoutItem,
): void => {
  if (doBoundsOverlap(fixed.occupiedBox, target.occupiedBox)) {
    addOffset(
      context,
      target.unitId,
      eligibleOffset(fixed, target, clearanceFrom(fixed, target)),
    );
  }
};

const resolveOrdinarySiblings = (
  context: ExpandedFlowGraphBuildContext,
  items: readonly LayoutItem[],
): LayoutItem[] => {
  // Preserve the ordinary grid's padding and initial-coordinate precedence.
  const paddedItems = items.map((item) => ({
    ...item,
    occupiedBox: buildUnitBaseBounds(item.position, context.metrics),
  }));
  paddedItems.forEach((target, index) => {
    for (const fixed of paddedItems.slice(0, index)) {
      applyOrdinaryClearance(context, target, fixed);
    }
  });
  return items.map((item) => refreshLayoutItem(context, item));
};

const shorterClearance = ({ x, y }: FlowGraphPosition): FlowGraphPosition =>
  x <= y ? { x, y: 0 } : { x: 0, y };

const defaultCollisionOffset = (
  fixed: LayoutItem,
  target: LayoutItem,
): FlowGraphPosition => {
  const clearance = clearanceFrom(fixed, target);
  const eligible = eligibleOffset(fixed, target, clearance);
  return hasOffset(eligible) ? eligible : shorterClearance(clearance);
};

const singlePrecedingAxis = (eligible: FlowGraphPosition): FlowGraphPosition =>
  eligible.x > 0 && eligible.y > 0 ? shorterClearance(eligible) : eligible;

const panelCollisionOffset = (
  originalPanel: LayoutItem,
  fixed: LayoutItem,
  target: LayoutItem,
): FlowGraphPosition =>
  fixed.hasPanel
    ? defaultCollisionOffset(fixed, target)
    : singlePrecedingAxis(
        eligibleOffset(fixed, originalPanel, clearanceFrom(fixed, target)),
      );

// Touching edges may differ by a fraction of a pixel after translation.
const collisionTolerancePx = 1e-6;

const isCollision = (target: LayoutItem, fixed: LayoutItem): boolean =>
  fixed.unitId !== target.unitId &&
  doBoundsOverlap(fixed.occupiedBox, target.occupiedBox, collisionTolerancePx);

const findCollision = (
  target: LayoutItem,
  obstacles: readonly LayoutItem[],
): LayoutItem | undefined =>
  obstacles.find((fixed) => isCollision(target, fixed));

type ObstacleLink = { item: LayoutItem; next: ObstacleLink | undefined };
type ObstacleCursor = Pick<ObstacleLink, "next">;

const linkObstacles = (items: readonly LayoutItem[]): ObstacleCursor => {
  let next: ObstacleLink | undefined;
  for (let index = items.length - 1; index >= 0; index--) {
    next = { item: items[index], next };
  }
  return { next };
};

// Rightward and downward movement cannot bring a passed rectangle back.
const hasPassedObstacle = (
  target: LayoutItem,
  obstacle: LayoutItem,
): boolean => {
  const { maxX, maxY } = obstacle.occupiedBox;
  const { minX, minY } = target.occupiedBox;
  return (
    maxX - minX <= collisionTolerancePx || maxY - minY <= collisionTolerancePx
  );
};

const advanceObstacle = (
  previous: ObstacleCursor,
  candidate: ObstacleLink,
  target: LayoutItem,
): ObstacleCursor => {
  const { item, next } = candidate;
  if (item.unitId === target.unitId || hasPassedObstacle(target, item)) {
    previous.next = next;
    return previous;
  }
  return candidate;
};

const findPendingCollision = (
  target: LayoutItem,
  head: ObstacleCursor,
): LayoutItem | undefined => {
  let previous = head;
  let candidate = previous.next;
  while (candidate && !isCollision(target, candidate.item)) {
    previous = advanceObstacle(previous, candidate, target);
    candidate = previous.next;
  }
  return candidate?.item;
};

type CollisionObstacles = {
  items: readonly LayoutItem[];
  offsetFor: (fixed: LayoutItem, target: LayoutItem) => FlowGraphPosition;
};

const planCollisionMovement = (
  item: LayoutItem,
  obstacles: CollisionObstacles,
  first: LayoutItem,
): LayoutItem => {
  const head = linkObstacles(obstacles.items);
  let target = item;
  let fixed: LayoutItem | undefined = first;
  let remaining = obstacles.items.length;
  while (fixed && remaining > 0) {
    const offset = obstacles.offsetFor(fixed, target);
    target = moveLayoutItem(target, {
      x: target.position.x + offset.x,
      y: target.position.y + offset.y,
    });
    fixed = findPendingCollision(target, head);
    remaining--;
  }
  return target;
};

const clearCollisions = (
  context: ExpandedFlowGraphBuildContext,
  item: LayoutItem,
  obstacles: CollisionObstacles,
): LayoutItem => {
  const first = findCollision(item, obstacles.items);
  if (!first) return item;
  const { position } = planCollisionMovement(item, obstacles, first);
  addOffset(context, item.unitId, {
    x: position.x - item.position.x,
    y: position.y - item.position.y,
  });
  return refreshLayoutItem(context, item);
};

const resolvePanels = (
  context: ExpandedFlowGraphBuildContext,
  expandedItems: readonly LayoutItem[],
  ordinary: readonly LayoutItem[],
): LayoutItem[] => {
  const panels: LayoutItem[] = [];
  for (const panel of expandedItems) {
    // Keep preceding obstacles tied to the panel's starting position.
    const preceding = ordinary.filter(
      (sibling) =>
        sibling.position.x < panel.position.x ||
        sibling.position.y < panel.position.y,
    );
    panels.push(
      clearCollisions(context, panel, {
        items: [...panels, ...preceding],
        offsetFor: (fixed, target) =>
          panelCollisionOffset(panel, fixed, target),
      }),
    );
  }
  return panels;
};

export const resolveSiblingLayoutItems = (
  context: ExpandedFlowGraphBuildContext,
  layoutItems: readonly LayoutItem[],
): void => {
  const ordinary = resolveOrdinarySiblings(
    context,
    layoutItems.filter((item) => !item.hasPanel),
  );
  const panels = resolvePanels(
    context,
    layoutItems.filter((item) => item.hasPanel),
    ordinary,
  );
  ordinary.forEach((target, index) => {
    if (!findCollision(target, panels)) return;
    ordinary[index] = clearCollisions(context, target, {
      items: [...panels, ...ordinary],
      offsetFor: defaultCollisionOffset,
    });
  });
};
