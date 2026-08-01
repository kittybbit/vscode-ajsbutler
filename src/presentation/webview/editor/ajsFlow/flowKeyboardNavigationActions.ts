import type {
  FlowKeyboardNavigationAction,
  FlowKeyboardNavigationContext,
  FlowKeyboardNavigationIndex,
  FlowKeyboardNavigationMovement,
  FlowKeyboardScopeUnit,
} from "./flowKeyboardNavigation";

type FlowKeyboardDirection = FlowKeyboardNavigationMovement;

const directionAxisAndSign: Readonly<
  Record<FlowKeyboardDirection, { axis: keyof Center; sign: -1 | 1 }>
> = {
  left: { axis: "x", sign: -1 },
  right: { axis: "x", sign: 1 },
  up: { axis: "y", sign: -1 },
  down: { axis: "y", sign: 1 },
};

type Center = {
  x: number;
  y: number;
};

const nodeCenter = ({
  x,
  y,
  width,
  height,
}: FlowKeyboardNavigationIndex["nodes"][number]): Center => ({
  x: x + width / 2,
  y: y + height / 2,
});

const isInDirection = (
  direction: FlowKeyboardDirection,
  current: Center,
  candidate: Center,
): boolean => {
  const { axis, sign } = directionAxisAndSign[direction];
  return (candidate[axis] - current[axis]) * sign > 0;
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

type SpatialCandidateContext = {
  currentUnitId: string;
  currentCenter: Center;
  candidateNode: FlowKeyboardNavigationIndex["nodes"][number];
  direction: FlowKeyboardDirection;
};

const toSpatialCandidate = ({
  currentUnitId,
  currentCenter,
  candidateNode,
  direction,
}: SpatialCandidateContext): SpatialCandidate | undefined => {
  if (candidateNode.id === currentUnitId) {
    return undefined;
  }
  const center = nodeCenter(candidateNode);
  if (!isInDirection(direction, currentCenter, center)) {
    return undefined;
  }
  const deltaX = center.x - currentCenter.x;
  const deltaY = center.y - currentCenter.y;
  return {
    unitId: candidateNode.id,
    center,
    distanceSquared: deltaX * deltaX + deltaY * deltaY,
  };
};

const selectSpatialCandidate = (
  current: SpatialCandidate | undefined,
  candidate: SpatialCandidate,
): SpatialCandidate =>
  current && compareSpatialCandidates(candidate, current) >= 0
    ? current
    : candidate;

const resolveSpatialTarget = (
  index: FlowKeyboardNavigationIndex,
  currentUnitId: string,
  direction: FlowKeyboardDirection,
): string | undefined => {
  const currentNode = index.nodeById.get(currentUnitId);
  if (!currentNode) {
    return undefined;
  }
  const currentCenter = nodeCenter(currentNode);
  const bestCandidate = index.nodes
    .map((candidateNode) =>
      toSpatialCandidate({
        currentUnitId,
        currentCenter,
        candidateNode,
        direction,
      }),
    )
    .filter(
      (candidate): candidate is SpatialCandidate => candidate !== undefined,
    )
    .reduce<SpatialCandidate | undefined>(
      (best, candidate) => selectSpatialCandidate(best, candidate),
      undefined,
    );
  return bestCandidate?.unitId;
};

const resolveExpandableActionForNode = (
  key: string,
  currentUnitId: string,
  isExpandedNested: boolean,
): FlowKeyboardNavigationAction | undefined => {
  const actionByKey: Readonly<
    Record<string, { kind: "expand" | "collapse"; isExpanded: boolean }>
  > = {
    ArrowDown: { kind: "expand", isExpanded: false },
    ArrowUp: { kind: "collapse", isExpanded: true },
  };
  const action = actionByKey[key];
  if (!action || action.isExpanded !== isExpandedNested) {
    return undefined;
  }
  return { kind: action.kind, targetUnitId: currentUnitId };
};

const resolveExpandableAction = (
  index: FlowKeyboardNavigationIndex,
  currentUnitId: string,
  key: string,
): FlowKeyboardNavigationAction | undefined => {
  const currentNode = index.nodeById.get(currentUnitId);
  return currentNode?.canExpandNested
    ? resolveExpandableActionForNode(
        key,
        currentUnitId,
        currentNode.isExpandedNested,
      )
    : undefined;
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
  return resolveExpandableAction(index, currentUnitId, key);
};

const isFlowScopeUnit = (unit: FlowKeyboardScopeUnit | undefined): boolean =>
  unit?.unitType === "n" || unit?.unitType === "rc";

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

type ScopeTraversalState = {
  currentId: string | undefined;
  ancestors: FlowKeyboardScopeUnit[];
};

const appendScopeAncestor = (
  state: ScopeTraversalState,
  scopeUnitById: ReadonlyMap<string, FlowKeyboardScopeUnit>,
): ScopeTraversalState => {
  const ancestor =
    state.currentId === undefined
      ? undefined
      : scopeUnitById.get(state.currentId);
  if (ancestor) {
    state.ancestors.push(ancestor);
    state.currentId = ancestor.parentId;
  }
  return state;
};

const resolveAncestorScopeId = (
  scopeUnitById: ReadonlyMap<string, FlowKeyboardScopeUnit>,
  ancestorId: string | undefined,
): string | undefined => {
  const state = Array.from({
    length: scopeUnitById.size,
  }).reduce<ScopeTraversalState>(
    (currentState) => appendScopeAncestor(currentState, scopeUnitById),
    { currentId: ancestorId, ancestors: [] },
  );
  return state.ancestors.find(isFlowScopeUnit)?.id;
};

const resolveScopeReturnAction = (
  scopeUnitById: ReadonlyMap<string, FlowKeyboardScopeUnit> | undefined,
  currentScopeUnitId: string | undefined,
): FlowKeyboardNavigationAction | undefined => {
  const target = resolveScopeReturnTarget(scopeUnitById, currentScopeUnitId);
  return target
    ? {
        kind: "return-scope",
        targetScopeId: target,
        focusUnitId: currentScopeUnitId as string,
      }
    : undefined;
};

const resolveScopeReturnTarget = (
  scopeUnitById: ReadonlyMap<string, FlowKeyboardScopeUnit> | undefined,
  currentScopeUnitId: string | undefined,
): string | undefined => {
  const currentScope = scopeUnitById?.get(currentScopeUnitId ?? "");
  return currentScope && currentScopeUnitId && isFlowScopeUnit(currentScope)
    ? resolveAncestorScopeId(
        scopeUnitById as ReadonlyMap<string, FlowKeyboardScopeUnit>,
        currentScope.parentId,
      )
    : undefined;
};

type FlowKeyboardActionResolver = (
  index: FlowKeyboardNavigationIndex,
  context: FlowKeyboardNavigationContext,
) => FlowKeyboardNavigationAction | undefined;

const directionalMovementByKey: Readonly<
  Record<string, FlowKeyboardNavigationMovement>
> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowDown: "down",
  ArrowUp: "up",
};

const resolveDirectionalAction = (
  index: FlowKeyboardNavigationIndex,
  context: FlowKeyboardNavigationContext,
  movement: FlowKeyboardNavigationMovement,
): FlowKeyboardNavigationAction | undefined =>
  toNavigateAction(
    movement,
    resolveSpatialTarget(index, context.currentUnitId, movement),
  );

const flowKeyboardActionResolvers: Readonly<
  Record<string, FlowKeyboardActionResolver>
> = {
  ArrowLeft: (index, context) =>
    resolveDirectionalAction(
      index,
      context,
      directionalMovementByKey.ArrowLeft,
    ),
  ArrowRight: (index, context) =>
    resolveDirectionalAction(
      index,
      context,
      directionalMovementByKey.ArrowRight,
    ),
  ArrowDown: (index, context) =>
    resolveDirectionalAction(
      index,
      context,
      directionalMovementByKey.ArrowDown,
    ),
  ArrowUp: (index, context) =>
    resolveDirectionalAction(index, context, directionalMovementByKey.ArrowUp),
  Enter: (_index, context) =>
    resolveScopeEntryAction(
      context.scopeUnitById,
      context.currentUnitId,
      context.currentScopeUnitId,
    ),
  Escape: (_index, context) =>
    resolveScopeReturnAction(context.scopeUnitById, context.currentScopeUnitId),
};

export const resolveFlowKeyboardNavigationAction = (
  index: FlowKeyboardNavigationIndex,
  context: FlowKeyboardNavigationContext,
): FlowKeyboardNavigationAction | undefined => {
  if ([context.altKey, context.ctrlKey, context.metaKey].some(Boolean)) {
    return undefined;
  }
  if (context.shiftKey) {
    return resolveExpansionAction(index, context.currentUnitId, context.key);
  }
  return flowKeyboardActionResolvers[context.key]?.(index, context);
};
