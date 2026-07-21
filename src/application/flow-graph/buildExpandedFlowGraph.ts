import {
  buildFlowGraphFromValidatedDocument,
  type FlowGraphBuildIssue,
} from "./buildFlowGraph";
import type {
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphNodeDto,
  FlowGraphNodeType,
  FlowGraphSemanticDiffHighlights,
} from "./buildFlowGraphCore";
import type {
  FlowGraphDocumentIndex,
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "./flowGraphDocument";

export type ExpandedFlowGraphIssue =
  | FlowGraphBuildIssue
  | {
      code:
        | "duplicate_visible_unit"
        | "missing_visible_unit"
        | "out_of_scope_visible_unit"
        | "invalid_visible_unit";
      message: string;
      unitId: string;
    };

export type ExpandedFlowGraphNodePlacementDto = {
  unitId: string;
  parentAnchorUnitId: string;
  kind: "nested_grid" | "nested_condition";
};

export type ExpandedFlowGraphScopeConstraintDto = {
  containerUnitId: string;
  expandedChildUnitIds: string[];
  visibleChildUnitIds: string[];
};

export type ExpandedUnitPlacementConstraintDto = {
  unitId: string;
  containerUnitId: string;
  affectedSiblingUnitIds: string[];
  horizontalAffectedSiblingUnitIds: string[];
  verticalAffectedSiblingUnitIds: string[];
  subtreeRange: { start: number; end: number };
};

export type ExpandedFlowGraphConstraintsDto = {
  activeScopeUnitId: string;
  normalizedRequestedExpandedUnitIds: string[];
  realizedExpandedUnitIds: string[];
  containmentOrderUnitIds: string[];
  nodePlacements: ExpandedFlowGraphNodePlacementDto[];
  scopes: ExpandedFlowGraphScopeConstraintDto[];
  expandedUnits: ExpandedUnitPlacementConstraintDto[];
};

export type ExpandedFlowGraphBuildResult =
  | {
      status: "available";
      graph: FlowGraphDto;
      constraints: ExpandedFlowGraphConstraintsDto;
      issues: ExpandedFlowGraphIssue[];
    }
  | { status: "unavailable"; issues: ExpandedFlowGraphIssue[] };

export type BuildExpandedFlowGraphInput = {
  document: ValidatedFlowGraphDocument;
  activeScopeUnitId: string;
  requestedExpandedUnitIds: ReadonlySet<string> | readonly string[];
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
};

const expandedJobnetTypes = new Set(["n", "rn", "rm", "rr"]);

const isExpandableNestedUnit = (unit: FlowGraphUnitDto): boolean =>
  expandedJobnetTypes.has(unit.unitType);

const compareUnits = (
  left: FlowGraphUnitDto,
  right: FlowGraphUnitDto,
): number =>
  left.depth - right.depth ||
  left.layout.v - right.layout.v ||
  left.layout.h - right.layout.h ||
  left.absolutePath.localeCompare(right.absolutePath);

const isDescendantOf = (
  unit: FlowGraphUnitDto,
  ancestorUnitId: string,
  index: FlowGraphDocumentIndex,
): boolean => {
  const visited = new Set<string>();
  let parentId = unit.parentId;
  while (parentId && !visited.has(parentId)) {
    if (parentId === ancestorUnitId) return true;
    visited.add(parentId);
    parentId = index.unitById.get(parentId)?.parentId;
  }
  return false;
};

type NormalizedExpandedUnitIds = {
  ids: Set<string>;
  orderedIds: string[];
  issues: ExpandedFlowGraphIssue[];
};

const normalizeRequestedExpandedUnitIds = (
  requestedUnitIds: ReadonlySet<string> | readonly string[],
  activeScopeUnitId: string,
  index: FlowGraphDocumentIndex,
): NormalizedExpandedUnitIds => {
  const seen = new Set<string>();
  const units: FlowGraphUnitDto[] = [];
  const issues: ExpandedFlowGraphIssue[] = [];

  for (const unitId of requestedUnitIds) {
    if (seen.has(unitId)) {
      issues.push({
        code: "duplicate_visible_unit",
        message: `Duplicate visible nested unit was omitted: ${unitId}`,
        unitId,
      });
      continue;
    }
    seen.add(unitId);
    const unit = index.unitById.get(unitId);
    if (!unit) {
      issues.push({
        code: "missing_visible_unit",
        message: `Visible nested unit was not found: ${unitId}`,
        unitId,
      });
      continue;
    }
    if (
      unit.id === activeScopeUnitId ||
      !isDescendantOf(unit, activeScopeUnitId, index)
    ) {
      issues.push({
        code: "out_of_scope_visible_unit",
        message: `Visible nested unit is outside the active scope: ${unitId}`,
        unitId,
      });
      continue;
    }
    if (!isExpandableNestedUnit(unit)) {
      issues.push({
        code: "invalid_visible_unit",
        message: `Unit is not an expandable nested jobnet: ${unitId}`,
        unitId,
      });
      continue;
    }
    units.push(unit);
  }

  units.sort(compareUnits);
  const orderedIds = units.map((unit) => unit.id);
  return { ids: new Set(orderedIds), orderedIds, issues };
};

const nodeTypeByUnitType: Partial<Record<string, FlowGraphNodeType>> = {
  g: "jobgroup",
  n: "jobnet",
  rn: "jobnet",
  rm: "jobnet",
  rr: "jobnet",
  rc: "condition",
};

const toExpandedNode = (unit: FlowGraphUnitDto): FlowGraphNodeDto => ({
  id: unit.id,
  label: unit.name,
  type: nodeTypeByUnitType[unit.unitType] ?? "job",
  metadata: {
    absolutePath: unit.absolutePath,
    ty: unit.unitType,
    gty: unit.groupType,
    comment: unit.comment,
    isAncestor: false,
    isCurrent: false,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout:
      unit.unitType === "rc"
        ? { kind: "ancestor", depth: unit.depth }
        : { kind: "grid", h: unit.layout.h, v: unit.layout.v },
  },
});

const toExpandedEdges = (unit: FlowGraphUnitDto): FlowGraphEdgeDto[] =>
  unit.relations.map((relation) => ({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  }));

const edgeIdentity = (
  edge: Pick<FlowGraphEdgeDto, "source" | "target">,
): string => `${edge.source}-${edge.target}`;

type ExpandedGraphBuildState = {
  graph: FlowGraphDto;
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  nodePlacements: ExpandedFlowGraphNodePlacementDto[];
  scopes: ExpandedFlowGraphScopeConstraintDto[];
  realizedExpandedUnitIds: string[];
};

const createBuildState = (
  baseGraph: FlowGraphDto,
): ExpandedGraphBuildState => ({
  graph: {
    nodes: [...baseGraph.nodes],
    edges: [...baseGraph.edges],
  },
  nodeIds: new Set(baseGraph.nodes.map((node) => node.id)),
  edgeIds: new Set(baseGraph.edges.map(edgeIdentity)),
  nodePlacements: [],
  scopes: [],
  realizedExpandedUnitIds: [],
});

const appendExpandedUnitContent = (
  state: ExpandedGraphBuildState,
  expandedUnit: FlowGraphUnitDto,
): void => {
  const conditionUnit = expandedUnit.children.find(
    (child) => child.unitType === "rc",
  );
  const visibleChildren = expandedUnit.children.filter(
    (child) => child.unitType !== "rc",
  );
  if (conditionUnit) visibleChildren.push(conditionUnit);

  for (const child of visibleChildren) {
    if (state.nodeIds.has(child.id)) continue;
    state.graph.nodes.push(toExpandedNode(child));
    state.nodeIds.add(child.id);
    state.nodePlacements.push({
      unitId: child.id,
      parentAnchorUnitId: expandedUnit.id,
      kind: child.unitType === "rc" ? "nested_condition" : "nested_grid",
    });
  }
  for (const edge of toExpandedEdges(expandedUnit)) {
    const identity = edgeIdentity(edge);
    if (state.edgeIds.has(identity)) continue;
    state.graph.edges.push(edge);
    state.edgeIds.add(identity);
  }
};

const sortedVisibleChildren = (unit: FlowGraphUnitDto): FlowGraphUnitDto[] =>
  [...unit.children].sort(compareUnits);

const expandedChildren = (
  unit: FlowGraphUnitDto,
  requestedIds: ReadonlySet<string>,
): FlowGraphUnitDto[] =>
  unit.children
    .filter(
      (child) => requestedIds.has(child.id) && isExpandableNestedUnit(child),
    )
    .sort(compareUnits);

type TraversalFrame =
  | { kind: "scope"; container: FlowGraphUnitDto }
  | { kind: "expand"; unit: FlowGraphUnitDto };

const buildExpandedStructure = (
  state: ExpandedGraphBuildState,
  activeScope: FlowGraphUnitDto,
  requestedIds: ReadonlySet<string>,
): void => {
  const pending: TraversalFrame[] = [{ kind: "scope", container: activeScope }];
  while (pending.length > 0) {
    const frame = pending.pop() as TraversalFrame;
    if (frame.kind === "expand") {
      state.realizedExpandedUnitIds.push(frame.unit.id);
      appendExpandedUnitContent(state, frame.unit);
      pending.push({ kind: "scope", container: frame.unit });
      continue;
    }

    const expanded = expandedChildren(frame.container, requestedIds);
    state.scopes.push({
      containerUnitId: frame.container.id,
      expandedChildUnitIds: expanded.map((unit) => unit.id),
      visibleChildUnitIds: sortedVisibleChildren(frame.container).map(
        (unit) => unit.id,
      ),
    });
    for (let index = expanded.length - 1; index >= 0; index--) {
      pending.push({ kind: "expand", unit: expanded[index] });
    }
  }
};

type ContainmentFrame =
  | { kind: "enter"; unitId: string }
  | { kind: "exit"; unitId: string };

const buildContainment = (
  activeScopeUnitId: string,
  scopes: readonly ExpandedFlowGraphScopeConstraintDto[],
): {
  order: string[];
  rangeByUnitId: ReadonlyMap<string, { start: number; end: number }>;
} => {
  const childrenByContainer = new Map(
    scopes.map((scope) => [scope.containerUnitId, scope.visibleChildUnitIds]),
  );
  const order: string[] = [];
  const rangeByUnitId = new Map<string, { start: number; end: number }>();
  const startByUnitId = new Map<string, number>();
  const pending: ContainmentFrame[] = [
    { kind: "enter", unitId: activeScopeUnitId },
  ];
  while (pending.length > 0) {
    const frame = pending.pop() as ContainmentFrame;
    if (frame.kind === "exit") {
      rangeByUnitId.set(frame.unitId, {
        start: startByUnitId.get(frame.unitId) ?? 0,
        end: order.length,
      });
      continue;
    }
    startByUnitId.set(frame.unitId, order.length);
    order.push(frame.unitId);
    pending.push({ kind: "exit", unitId: frame.unitId });
    const children = childrenByContainer.get(frame.unitId) ?? [];
    for (let index = children.length - 1; index >= 0; index--) {
      pending.push({ kind: "enter", unitId: children[index] });
    }
  }
  return { order, rangeByUnitId };
};

const buildExpandedUnitConstraints = (
  state: ExpandedGraphBuildState,
  containment: ReturnType<typeof buildContainment>,
  index: FlowGraphDocumentIndex,
): ExpandedUnitPlacementConstraintDto[] => {
  const scopeByExpandedChild = new Map<
    string,
    ExpandedFlowGraphScopeConstraintDto
  >();
  for (const scope of state.scopes) {
    for (const expandedChildUnitId of scope.expandedChildUnitIds) {
      scopeByExpandedChild.set(expandedChildUnitId, scope);
    }
  }
  return state.realizedExpandedUnitIds.map((unitId) => {
    const scope = scopeByExpandedChild.get(
      unitId,
    ) as ExpandedFlowGraphScopeConstraintDto;
    const expandedUnit = index.unitById.get(unitId) as FlowGraphUnitDto;
    const siblingUnits = scope.visibleChildUnitIds
      .filter((siblingUnitId) => siblingUnitId !== unitId)
      .map((siblingUnitId) => index.unitById.get(siblingUnitId))
      .filter((unit): unit is FlowGraphUnitDto => !!unit);
    const horizontalAffectedSiblingUnitIds = siblingUnits
      .filter(
        (sibling) =>
          sibling.layout.h > expandedUnit.layout.h &&
          sibling.layout.v >= expandedUnit.layout.v,
      )
      .map((sibling) => sibling.id);
    const verticalAffectedSiblingUnitIds = siblingUnits
      .filter(
        (sibling) =>
          sibling.layout.v > expandedUnit.layout.v &&
          sibling.layout.h >= expandedUnit.layout.h,
      )
      .map((sibling) => sibling.id);
    const affectedUnitIds = new Set([
      ...horizontalAffectedSiblingUnitIds,
      ...verticalAffectedSiblingUnitIds,
    ]);
    return {
      unitId,
      containerUnitId: scope.containerUnitId,
      affectedSiblingUnitIds: scope.visibleChildUnitIds.filter(
        (siblingUnitId) => affectedUnitIds.has(siblingUnitId),
      ),
      horizontalAffectedSiblingUnitIds,
      verticalAffectedSiblingUnitIds,
      subtreeRange: containment.rangeByUnitId.get(unitId) ?? {
        start: 0,
        end: 0,
      },
    };
  });
};

export const buildExpandedFlowGraphResult = ({
  document,
  activeScopeUnitId,
  requestedExpandedUnitIds,
  semanticDiffHighlights,
}: BuildExpandedFlowGraphInput): ExpandedFlowGraphBuildResult => {
  const baseResult = buildFlowGraphFromValidatedDocument(
    document,
    activeScopeUnitId,
    semanticDiffHighlights,
  );
  if (baseResult.status === "unavailable") return baseResult;

  const activeScope = document.index.unitById.get(
    activeScopeUnitId,
  ) as FlowGraphUnitDto;
  const normalized = normalizeRequestedExpandedUnitIds(
    requestedExpandedUnitIds,
    activeScopeUnitId,
    document.index,
  );
  const state = createBuildState(baseResult.graph);
  buildExpandedStructure(state, activeScope, normalized.ids);
  const containment = buildContainment(activeScopeUnitId, state.scopes);

  return {
    status: "available",
    graph: state.graph,
    constraints: {
      activeScopeUnitId,
      normalizedRequestedExpandedUnitIds: normalized.orderedIds,
      realizedExpandedUnitIds: state.realizedExpandedUnitIds,
      containmentOrderUnitIds: containment.order,
      nodePlacements: state.nodePlacements,
      scopes: state.scopes,
      expandedUnits: buildExpandedUnitConstraints(
        state,
        containment,
        document.index,
      ),
    },
    issues: [...baseResult.issues, ...normalized.issues],
  };
};
