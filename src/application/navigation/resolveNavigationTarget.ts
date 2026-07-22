import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../flow-graph/flowGraphDocument";

export type NavigationRequestDto = {
  absolutePath: string;
};

export type NavigationRequestIssue = {
  code: "invalid_navigation_request";
  message: string;
};

export type NavigationRequestResult =
  | { status: "available"; request: NavigationRequestDto }
  | { status: "unavailable"; issues: NavigationRequestIssue[] };

export type FlowNavigationTargetDto = {
  absolutePath: string;
  activeFlowScopeUnitId: string;
  revealedUnitId: string;
  requiredExpandedAncestorUnitIds: string[];
};

export type FlowNavigationTargetIssue = {
  code:
    | "navigation_target_not_found"
    | "flow_scope_unavailable"
    | "navigation_parent_cycle";
  message: string;
  absolutePath: string;
};

export type FlowNavigationTargetResult =
  | {
      status: "available";
      target: FlowNavigationTargetDto;
      issues: [];
    }
  | { status: "unavailable"; issues: FlowNavigationTargetIssue[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const parseNavigationRequest = (
  value: unknown,
): NavigationRequestResult => {
  if (
    !isRecord(value) ||
    typeof value.absolutePath !== "string" ||
    value.absolutePath.length === 0
  ) {
    return {
      status: "unavailable",
      issues: [
        {
          code: "invalid_navigation_request",
          message: "Navigation requires a non-empty absolute path.",
        },
      ],
    };
  }
  return {
    status: "available",
    request: { absolutePath: value.absolutePath },
  };
};

const isConditionUnit = (unit: FlowGraphUnitDto | undefined): boolean =>
  unit?.unitType === "rc";

const isJobnetUnit = (unit: FlowGraphUnitDto | undefined): boolean =>
  unit?.unitType === "n";

const isJobGroupUnit = (unit: FlowGraphUnitDto | undefined): boolean =>
  unit?.unitType === "g";

const isRootJobnetUnit = (unit: FlowGraphUnitDto | undefined): boolean =>
  isJobnetUnit(unit) && unit?.isRootJobnet === true;

const hasParentCycle = (
  document: ValidatedFlowGraphDocument,
  unit: FlowGraphUnitDto,
): boolean => {
  const visited = new Set<string>([unit.id]);
  let current = unit.parentId
    ? document.index.unitById.get(unit.parentId)
    : undefined;
  while (current) {
    if (visited.has(current.id)) return true;
    visited.add(current.id);
    current = current.parentId
      ? document.index.unitById.get(current.parentId)
      : undefined;
  }
  return false;
};

const firstRootJobnetByDocument = new WeakMap<
  ValidatedFlowGraphDocument,
  Map<string, FlowGraphUnitDto | undefined>
>();

const getFirstRootJobnetCache = (
  document: ValidatedFlowGraphDocument,
): Map<string, FlowGraphUnitDto | undefined> => {
  const cached = firstRootJobnetByDocument.get(document);
  if (cached) return cached;
  const created = new Map<string, FlowGraphUnitDto | undefined>();
  firstRootJobnetByDocument.set(document, created);
  return created;
};

const findFirstDescendantRootJobnet = (
  document: ValidatedFlowGraphDocument,
  unit: FlowGraphUnitDto,
): FlowGraphUnitDto | undefined => {
  const cache = getFirstRootJobnetCache(document);
  if (cache.has(unit.id)) return cache.get(unit.id);
  const visited = new Set<string>([unit.id]);
  const pending = [...unit.children].reverse();
  while (pending.length > 0) {
    const candidate = pending.pop() as FlowGraphUnitDto;
    if (visited.has(candidate.id)) continue;
    visited.add(candidate.id);
    if (isRootJobnetUnit(candidate)) {
      cache.set(unit.id, candidate);
      return candidate;
    }
    for (let index = candidate.children.length - 1; index >= 0; index--) {
      pending.push(candidate.children[index]);
    }
  }
  cache.set(unit.id, undefined);
  return undefined;
};

type ParentTraversalResult =
  | { status: "available"; unit?: FlowGraphUnitDto }
  | { status: "cycle" };

const findNearestJobnetAncestor = (
  document: ValidatedFlowGraphDocument,
  unit: FlowGraphUnitDto | undefined,
): ParentTraversalResult => {
  const visited = new Set<string>();
  let current = unit;
  while (current && !isJobnetUnit(current)) {
    if (visited.has(current.id)) return { status: "cycle" };
    visited.add(current.id);
    current = current.parentId
      ? document.index.unitById.get(current.parentId)
      : undefined;
  }
  return { status: "available", unit: current };
};

type ScopeResolutionResult =
  | { status: "available"; scopeUnit: FlowGraphUnitDto }
  | { status: "unavailable"; code: FlowNavigationTargetIssue["code"] };

const resolveFlowScopeUnit = (
  document: ValidatedFlowGraphDocument,
  revealedUnit: FlowGraphUnitDto,
): ScopeResolutionResult => {
  if (isJobGroupUnit(revealedUnit)) {
    const rootJobnet = findFirstDescendantRootJobnet(document, revealedUnit);
    return rootJobnet
      ? { status: "available", scopeUnit: rootJobnet }
      : { status: "unavailable", code: "flow_scope_unavailable" };
  }

  const directParent = revealedUnit.parentId
    ? document.index.unitById.get(revealedUnit.parentId)
    : undefined;
  if (isConditionUnit(directParent)) {
    return { status: "available", scopeUnit: directParent as FlowGraphUnitDto };
  }

  const ancestor = findNearestJobnetAncestor(document, directParent);
  if (ancestor.status === "cycle") {
    return { status: "unavailable", code: "navigation_parent_cycle" };
  }
  if (ancestor.unit) {
    return { status: "available", scopeUnit: ancestor.unit };
  }
  if (isJobnetUnit(revealedUnit) || isConditionUnit(revealedUnit)) {
    return { status: "available", scopeUnit: revealedUnit };
  }
  return { status: "unavailable", code: "flow_scope_unavailable" };
};

type ExpandedAncestorResult =
  | { status: "available"; unitIds: string[] }
  | { status: "cycle" };

const collectRequiredExpandedAncestorUnitIds = (
  document: ValidatedFlowGraphDocument,
  revealedUnit: FlowGraphUnitDto,
  scopeUnit: FlowGraphUnitDto,
): ExpandedAncestorResult => {
  const ancestorUnitIds: string[] = [];
  const visited = new Set<string>();
  let current = revealedUnit.parentId
    ? document.index.unitById.get(revealedUnit.parentId)
    : undefined;
  while (current && current.id !== scopeUnit.id) {
    if (visited.has(current.id)) return { status: "cycle" };
    visited.add(current.id);
    if (isJobnetUnit(current) && current.children.length > 0) {
      ancestorUnitIds.push(current.id);
    }
    current = current.parentId
      ? document.index.unitById.get(current.parentId)
      : undefined;
  }
  ancestorUnitIds.reverse();
  return { status: "available", unitIds: ancestorUnitIds };
};

const unavailableTarget = (
  code: FlowNavigationTargetIssue["code"],
  absolutePath: string,
): FlowNavigationTargetResult => ({
  status: "unavailable",
  issues: [
    {
      code,
      message:
        code === "navigation_target_not_found"
          ? `Navigation target was not found: ${absolutePath}`
          : code === "navigation_parent_cycle"
            ? `Navigation target has a cyclic parent chain: ${absolutePath}`
            : `Navigation target has no available flow scope: ${absolutePath}`,
      absolutePath,
    },
  ],
});

export const resolveFlowNavigationTarget = (
  document: ValidatedFlowGraphDocument,
  request: NavigationRequestDto,
): FlowNavigationTargetResult => {
  const revealedUnit = document.index.unitByAbsolutePath.get(
    request.absolutePath,
  );
  if (!revealedUnit) {
    return unavailableTarget(
      "navigation_target_not_found",
      request.absolutePath,
    );
  }
  if (hasParentCycle(document, revealedUnit)) {
    return unavailableTarget("navigation_parent_cycle", request.absolutePath);
  }

  const scope = resolveFlowScopeUnit(document, revealedUnit);
  if (scope.status === "unavailable") {
    return unavailableTarget(scope.code, request.absolutePath);
  }
  const expandedAncestors = collectRequiredExpandedAncestorUnitIds(
    document,
    revealedUnit,
    scope.scopeUnit,
  );
  if (expandedAncestors.status === "cycle") {
    return unavailableTarget("navigation_parent_cycle", request.absolutePath);
  }

  return {
    status: "available",
    target: {
      absolutePath: request.absolutePath,
      activeFlowScopeUnitId: scope.scopeUnit.id,
      revealedUnitId: revealedUnit.id,
      requiredExpandedAncestorUnitIds: expandedAncestors.unitIds,
    },
    issues: [],
  };
};
