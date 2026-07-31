export type FlowKeyboardNavigationNode = {
  id: string;
  parentId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  canExpandNested: boolean;
  isExpandedNested: boolean;
};

export type FlowKeyboardNavigationIndex = {
  nodes: readonly FlowKeyboardNavigationNode[];
  nodeById: ReadonlyMap<string, FlowKeyboardNavigationNode>;
};

export type FlowKeyboardScopeUnit = {
  id: string;
  parentId?: string;
  unitType: string;
  childCount: number;
};

export type FlowKeyboardNavigationIndexCache = {
  nodes: readonly FlowKeyboardNavigationNode[];
  index: FlowKeyboardNavigationIndex;
};

export type FlowKeyboardNavigationMovement = "left" | "right" | "up" | "down";

export type FlowKeyboardNavigationAction =
  | {
      kind: "navigate";
      movement: FlowKeyboardNavigationMovement;
      targetUnitId: string;
    }
  | { kind: "expand"; targetUnitId: string }
  | { kind: "collapse"; targetUnitId: string }
  | {
      kind: "enter-scope" | "return-scope";
      targetScopeId: string;
      focusUnitId: string;
    };

export type FlowKeyboardNavigationKeyResult = {
  action?: FlowKeyboardNavigationAction;
  suppressDefault: boolean;
};

export type FlowKeyboardFocusTarget =
  | { kind: "node"; targetUnitId: string }
  | { kind: "graphEntry" };

export type FlowKeyboardScopeFocusDecision =
  | FlowKeyboardFocusTarget
  | { kind: "wait" }
  | { kind: "cancel" };

export const readOnlyFlowInteractionProps = {
  nodesDraggable: false,
  nodesConnectable: false,
  nodesFocusable: true,
  edgesFocusable: false,
  elementsSelectable: false,
  autoPanOnNodeFocus: false,
  deleteKeyCode: null,
} as const;

type FlowKeyboardNavigationContext = {
  currentUnitId: string;
  currentScopeUnitId?: string;
  scopeUnitById?: ReadonlyMap<string, FlowKeyboardScopeUnit>;
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

type RenderedFlowNodeGeometry = {
  position: { x: number; y: number };
  measured?: { width?: number; height?: number };
  initialWidth?: number;
  initialHeight?: number;
};

export type FlowKeyboardNodeGeometry = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const resolvePositiveDimension = (
  measured: number | undefined,
  initial: number | undefined,
): number | undefined => {
  if (measured !== undefined && Number.isFinite(measured) && measured > 0) {
    return measured;
  }
  return initial !== undefined && Number.isFinite(initial) && initial > 0
    ? initial
    : undefined;
};

export const resolveFlowKeyboardNodeGeometry = ({
  position,
  measured,
  initialWidth,
  initialHeight,
}: RenderedFlowNodeGeometry): FlowKeyboardNodeGeometry | undefined => {
  const width = resolvePositiveDimension(measured?.width, initialWidth);
  const height = resolvePositiveDimension(measured?.height, initialHeight);
  if (
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y) ||
    width === undefined ||
    height === undefined
  ) {
    return undefined;
  }
  return {
    x: position.x,
    y: position.y,
    width,
    height,
  };
};

export const isFlowKeyboardNavigationKey = ({
  key,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
}: Omit<FlowKeyboardNavigationContext, "currentUnitId">): boolean => {
  if (altKey || ctrlKey || metaKey) return false;
  if (shiftKey) return key === "ArrowDown" || key === "ArrowUp";
  return [
    "ArrowLeft",
    "ArrowRight",
    "ArrowDown",
    "ArrowUp",
    "Enter",
    "Escape",
  ].includes(key);
};

export const buildFlowKeyboardNavigationIndex = (
  nodes: readonly FlowKeyboardNavigationNode[],
): FlowKeyboardNavigationIndex => {
  return {
    nodes,
    nodeById: new Map(nodes.map((node) => [node.id, node])),
  };
};

const hasSameNavigationGeometry = (
  cache: FlowKeyboardNavigationIndexCache,
  nodes: readonly FlowKeyboardNavigationNode[],
): boolean =>
  cache.nodes.length === nodes.length &&
  cache.nodes.every((cachedNode, index) => {
    const node = nodes[index];
    return (
      cachedNode.id === node?.id &&
      cachedNode.parentId === node.parentId &&
      cachedNode.x === node.x &&
      cachedNode.y === node.y &&
      cachedNode.width === node.width &&
      cachedNode.height === node.height &&
      cachedNode.canExpandNested === node.canExpandNested &&
      cachedNode.isExpandedNested === node.isExpandedNested
    );
  });

export const resolveFlowKeyboardNavigationIndexCache = (
  cache: FlowKeyboardNavigationIndexCache | undefined,
  nodes: readonly FlowKeyboardNavigationNode[],
): FlowKeyboardNavigationIndexCache => {
  if (cache && hasSameNavigationGeometry(cache, nodes)) return cache;
  return {
    nodes,
    index: buildFlowKeyboardNavigationIndex(nodes),
  };
};

type FlowKeyboardDirection = "left" | "right" | "up" | "down";

type Center = {
  x: number;
  y: number;
};

const nodeCenter = ({
  x,
  y,
  width,
  height,
}: FlowKeyboardNavigationNode): Center => ({
  x: x + width / 2,
  y: y + height / 2,
});

const isInDirection = (
  direction: FlowKeyboardDirection,
  current: Center,
  candidate: Center,
): boolean => {
  if (direction === "left") return candidate.x < current.x;
  if (direction === "right") return candidate.x > current.x;
  if (direction === "up") return candidate.y < current.y;
  return candidate.y > current.y;
};

type SpatialCandidate = {
  unitId: string;
  center: Center;
  distanceSquared: number;
};

const compareSpatialCandidates = (
  left: SpatialCandidate,
  right: SpatialCandidate,
): number =>
  left.distanceSquared - right.distanceSquared ||
  left.center.y - right.center.y ||
  left.center.x - right.center.x;

const resolveSpatialTarget = (
  index: FlowKeyboardNavigationIndex,
  currentUnitId: string,
  direction: FlowKeyboardDirection,
): string | undefined => {
  const currentNode = index.nodeById.get(currentUnitId);
  if (!currentNode) return undefined;
  const currentCenter = nodeCenter(currentNode);
  let bestCandidate: SpatialCandidate | undefined;

  index.nodes.forEach((candidateNode) => {
    if (candidateNode.id === currentUnitId) return;
    const center = nodeCenter(candidateNode);
    if (!isInDirection(direction, currentCenter, center)) return;
    const deltaX = center.x - currentCenter.x;
    const deltaY = center.y - currentCenter.y;
    const candidate = {
      unitId: candidateNode.id,
      center,
      distanceSquared: deltaX * deltaX + deltaY * deltaY,
    };
    if (
      !bestCandidate ||
      compareSpatialCandidates(candidate, bestCandidate) < 0
    ) {
      bestCandidate = candidate;
    }
  });

  return bestCandidate?.unitId;
};

const toNavigateAction = (
  movement: FlowKeyboardNavigationMovement,
  targetUnitId: string | undefined,
): FlowKeyboardNavigationAction | undefined =>
  targetUnitId ? { kind: "navigate", movement, targetUnitId } : undefined;

const resolveExpansionAction = (
  index: FlowKeyboardNavigationIndex,
  currentUnitId: string,
  key: string,
): FlowKeyboardNavigationAction | undefined => {
  const currentNode = index.nodeById.get(currentUnitId);
  if (!currentNode?.canExpandNested) return undefined;
  if (key === "ArrowDown" && !currentNode.isExpandedNested) {
    return { kind: "expand", targetUnitId: currentUnitId };
  }
  if (key === "ArrowUp" && currentNode.isExpandedNested) {
    return { kind: "collapse", targetUnitId: currentUnitId };
  }
  return undefined;
};

const isFlowScopeUnit = (unit: FlowKeyboardScopeUnit): boolean =>
  unit.unitType === "n" || unit.unitType === "rc";

const resolveScopeEntryAction = (
  scopeUnitById: ReadonlyMap<string, FlowKeyboardScopeUnit> | undefined,
  currentUnitId: string,
  currentScopeUnitId: string | undefined,
): FlowKeyboardNavigationAction | undefined => {
  const unit = scopeUnitById?.get(currentUnitId);
  if (
    !unit ||
    unit.id === currentScopeUnitId ||
    !isFlowScopeUnit(unit) ||
    unit.childCount === 0
  ) {
    return undefined;
  }
  return {
    kind: "enter-scope",
    targetScopeId: unit.id,
    focusUnitId: unit.id,
  };
};

const resolveScopeReturnAction = (
  scopeUnitById: ReadonlyMap<string, FlowKeyboardScopeUnit> | undefined,
  currentScopeUnitId: string | undefined,
): FlowKeyboardNavigationAction | undefined => {
  if (!scopeUnitById || !currentScopeUnitId) return undefined;
  const currentScope = scopeUnitById.get(currentScopeUnitId);
  if (!currentScope || !isFlowScopeUnit(currentScope)) return undefined;

  const visited = new Set<string>([currentScopeUnitId]);
  let ancestorId = currentScope.parentId;
  while (ancestorId && !visited.has(ancestorId)) {
    visited.add(ancestorId);
    const ancestor = scopeUnitById.get(ancestorId);
    if (!ancestor) return undefined;
    if (isFlowScopeUnit(ancestor)) {
      return {
        kind: "return-scope",
        targetScopeId: ancestor.id,
        focusUnitId: currentScopeUnitId,
      };
    }
    ancestorId = ancestor.parentId;
  }
  return undefined;
};

export const resolveFlowKeyboardNavigationAction = (
  index: FlowKeyboardNavigationIndex,
  {
    currentUnitId,
    currentScopeUnitId,
    scopeUnitById,
    key,
    altKey = false,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
  }: FlowKeyboardNavigationContext,
): FlowKeyboardNavigationAction | undefined => {
  if (
    !isFlowKeyboardNavigationKey({
      key,
      altKey,
      ctrlKey,
      metaKey,
      shiftKey,
    })
  ) {
    return undefined;
  }
  if (shiftKey) {
    return resolveExpansionAction(index, currentUnitId, key);
  }

  if (key === "ArrowLeft") {
    return toNavigateAction(
      "left",
      resolveSpatialTarget(index, currentUnitId, "left"),
    );
  }
  if (key === "ArrowRight") {
    return toNavigateAction(
      "right",
      resolveSpatialTarget(index, currentUnitId, "right"),
    );
  }
  if (key === "ArrowDown") {
    return toNavigateAction(
      "down",
      resolveSpatialTarget(index, currentUnitId, "down"),
    );
  }
  if (key === "ArrowUp") {
    return toNavigateAction(
      "up",
      resolveSpatialTarget(index, currentUnitId, "up"),
    );
  }
  if (key === "Enter") {
    return resolveScopeEntryAction(
      scopeUnitById,
      currentUnitId,
      currentScopeUnitId,
    );
  }
  if (key === "Escape") {
    return resolveScopeReturnAction(scopeUnitById, currentScopeUnitId);
  }
  return undefined;
};

export const resolveFlowKeyboardNavigationKeyResult = (
  index: FlowKeyboardNavigationIndex,
  context: FlowKeyboardNavigationContext,
): FlowKeyboardNavigationKeyResult => {
  const suppressDefault = isFlowKeyboardNavigationKey(context);
  return {
    action: suppressDefault
      ? resolveFlowKeyboardNavigationAction(index, context)
      : undefined,
    suppressDefault,
  };
};

export const getOwnedFlowNodeId = (
  target: EventTarget | null,
): string | undefined => {
  const candidate = target as
    | {
        classList?: { contains: (className: string) => boolean };
        dataset?: { id?: string };
      }
    | undefined;
  return candidate?.classList?.contains("react-flow__node")
    ? candidate.dataset?.id
    : undefined;
};

type FlowNodeFocusRoot = {
  querySelector: (
    selector: string,
  ) => { focus: (options: { preventScroll: boolean }) => void } | null;
};

export const focusRenderedFlowNode = (
  root: FlowNodeFocusRoot | null,
  targetUnitId: string,
  escapeSelectorValue: (value: string) => string,
): boolean => {
  const nodeElement = root?.querySelector(
    `.react-flow__node[data-id="${escapeSelectorValue(targetUnitId)}"]`,
  );
  if (!nodeElement) return false;
  nodeElement.focus({ preventScroll: true });
  return true;
};

export const resolveFlowKeyboardFocusTarget = (
  renderedUnitIds: ReadonlySet<string>,
  targetUnitId: string,
): FlowKeyboardFocusTarget =>
  renderedUnitIds.has(targetUnitId)
    ? { kind: "node", targetUnitId }
    : { kind: "graphEntry" };

export const resolveFlowKeyboardScopeFocusDecision = ({
  currentScopeUnitId,
  expectedScopeUnitId,
  renderedUnitIds,
  sourceNodesChanged,
  sourceScopeUnitId,
  targetUnitId,
}: {
  currentScopeUnitId: string | undefined;
  expectedScopeUnitId: string;
  renderedUnitIds: ReadonlySet<string>;
  sourceNodesChanged: boolean;
  sourceScopeUnitId: string | undefined;
  targetUnitId: string;
}): FlowKeyboardScopeFocusDecision => {
  if (!sourceNodesChanged) return { kind: "wait" };
  if (currentScopeUnitId !== expectedScopeUnitId) {
    return sourceScopeUnitId !== undefined &&
      currentScopeUnitId !== sourceScopeUnitId
      ? { kind: "cancel" }
      : { kind: "wait" };
  }
  return resolveFlowKeyboardFocusTarget(renderedUnitIds, targetUnitId);
};
