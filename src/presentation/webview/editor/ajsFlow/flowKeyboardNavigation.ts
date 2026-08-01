import { resolveFlowKeyboardNavigationAction } from "./flowKeyboardNavigationActions";

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

const flowKeyboardNavigationKeys = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
  "ArrowUp",
  "Enter",
  "Escape",
]);
const flowKeyboardExpansionKeys = new Set(["ArrowDown", "ArrowUp"]);

const hasFlowKeyboardModifier = (
  altKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean,
): boolean => [altKey, ctrlKey, metaKey].some(Boolean);

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
  if (isPositiveDimension(measured)) {
    return measured;
  }
  return isPositiveDimension(initial) ? initial : undefined;
};

const isPositiveDimension = (value: number | undefined): value is number =>
  value !== undefined && Number.isFinite(value) && value > 0;

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
  if (hasFlowKeyboardModifier(altKey, ctrlKey, metaKey)) {
    return false;
  }
  return (
    shiftKey ? flowKeyboardExpansionKeys : flowKeyboardNavigationKeys
  ).has(key);
};

const hasSameNavigationNode = (
  cachedNode: FlowKeyboardNavigationNode,
  node: FlowKeyboardNavigationNode | undefined,
): boolean => {
  if (!node) {
    return false;
  }
  return [
    [cachedNode.id, node.id],
    [cachedNode.parentId, node.parentId],
    [cachedNode.x, node.x],
    [cachedNode.y, node.y],
    [cachedNode.width, node.width],
    [cachedNode.height, node.height],
    [cachedNode.canExpandNested, node.canExpandNested],
    [cachedNode.isExpandedNested, node.isExpandedNested],
  ].every(([cachedValue, currentValue]) => cachedValue === currentValue);
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
  cache.nodes.every((cachedNode, index) =>
    hasSameNavigationNode(cachedNode, nodes[index]),
  );

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

export type FlowKeyboardNavigationContext = {
  currentUnitId: string;
  currentScopeUnitId?: string;
  scopeUnitById?: ReadonlyMap<string, FlowKeyboardScopeUnit>;
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export { resolveFlowKeyboardNavigationAction } from "./flowKeyboardNavigationActions";

const resolveScopeMismatchDecision = (
  currentScopeUnitId: string | undefined,
  sourceScopeUnitId: string | undefined,
): FlowKeyboardScopeFocusDecision => {
  if (
    sourceScopeUnitId !== undefined &&
    currentScopeUnitId !== sourceScopeUnitId
  ) {
    return { kind: "cancel" };
  }
  return { kind: "wait" };
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

type FlowNodeTarget = {
  classList?: { contains: (className: string) => boolean };
  closest?: (selector: string) => unknown;
  dataset?: { id?: string };
};

export const getFlowNodeIdFromTarget = (
  target: EventTarget | null,
): string | undefined => {
  const candidate = target as FlowNodeTarget | null;
  const owner = candidate?.classList?.contains("react-flow__node")
    ? candidate
    : (candidate?.closest?.(".react-flow__node") as FlowNodeTarget | null);
  return owner?.classList?.contains("react-flow__node")
    ? owner.dataset?.id
    : undefined;
};

export const isFlowSpatialNavigationKey = (key: string): boolean =>
  key === "ArrowLeft" ||
  key === "ArrowRight" ||
  key === "ArrowDown" ||
  key === "ArrowUp";

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
  if (!sourceNodesChanged) {
    return { kind: "wait" };
  }
  if (currentScopeUnitId !== expectedScopeUnitId) {
    return resolveScopeMismatchDecision(currentScopeUnitId, sourceScopeUnitId);
  }
  return resolveFlowKeyboardFocusTarget(renderedUnitIds, targetUnitId);
};
