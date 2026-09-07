import {
  buildFlowGraphFromValidatedDocument,
  type FlowGraphBuildIssue,
} from "./buildFlowGraph";
import { flowGraphEdgeId } from "./buildFlowGraphCore";
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
): boolean => collectAncestorIds(unit, index).includes(ancestorUnitId);

const collectAncestorIds = (
  unit: FlowGraphUnitDto,
  index: FlowGraphDocumentIndex,
): string[] => {
  const visited = new Set<string>();
  const ancestorIds: string[] = [];
  for (
    let parentId = unit.parentId;
    parentId && !visited.has(parentId);
    parentId = index.unitById.get(parentId)?.parentId
  ) {
    visited.add(parentId);
    ancestorIds.push(parentId);
  }
  return ancestorIds;
};

type NormalizedExpandedUnitIds = {
  ids: Set<string>;
  orderedIds: string[];
  issues: ExpandedFlowGraphIssue[];
};

type RequestedExpandedUnitValidation =
  | { unit: FlowGraphUnitDto }
  | { issue: ExpandedFlowGraphIssue };

type RequestedExpandedUnitIssue = {
  code:
    | "missing_visible_unit"
    | "out_of_scope_visible_unit"
    | "invalid_visible_unit";
  message: string;
  unitId: string;
};

const requestedExpandedUnitIssue = ({
  unitId,
  activeScopeUnitId,
  index,
}: {
  unitId: string;
  activeScopeUnitId: string;
  index: FlowGraphDocumentIndex;
}): RequestedExpandedUnitValidation => {
  const unit = index.unitById.get(unitId);
  const issue = unit
    ? requestedExpandedUnitScopeIssue({
        unit,
        unitId,
        activeScopeUnitId,
        index,
      })
    : {
        code: "missing_visible_unit" as const,
        message: `Visible nested unit was not found: ${unitId}`,
        unitId,
      };
  return issue ? { issue } : { unit: unit as FlowGraphUnitDto };
};

const requestedExpandedUnitScopeIssue = ({
  unit,
  unitId,
  activeScopeUnitId,
  index,
}: {
  unit: FlowGraphUnitDto;
  unitId: string;
  activeScopeUnitId: string;
  index: FlowGraphDocumentIndex;
}): RequestedExpandedUnitIssue | undefined => {
  if (isOutsideExpandedScope(unit, activeScopeUnitId, index)) {
    return {
      code: "out_of_scope_visible_unit",
      message: `Visible nested unit is outside the active scope: ${unitId}`,
      unitId,
    };
  }
  if (!isExpandableNestedUnit(unit)) {
    return {
      code: "invalid_visible_unit",
      message: `Unit is not an expandable nested jobnet: ${unitId}`,
      unitId,
    };
  }
  return undefined;
};

const isOutsideExpandedScope = (
  unit: FlowGraphUnitDto,
  activeScopeUnitId: string,
  index: FlowGraphDocumentIndex,
): boolean =>
  unit.id === activeScopeUnitId ||
  !isDescendantOf(unit, activeScopeUnitId, index);

const normalizeRequestedExpandedUnit = ({
  unitId,
  activeScopeUnitId,
  index,
  seen,
}: {
  unitId: string;
  activeScopeUnitId: string;
  index: FlowGraphDocumentIndex;
  seen: ReadonlySet<string>;
}): RequestedExpandedUnitValidation => {
  if (seen.has(unitId)) {
    return {
      issue: {
        code: "duplicate_visible_unit",
        message: `Duplicate visible nested unit was omitted: ${unitId}`,
        unitId,
      },
    };
  }
  return requestedExpandedUnitIssue({ unitId, activeScopeUnitId, index });
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
    const validation = normalizeRequestedExpandedUnit({
      unitId,
      activeScopeUnitId,
      index,
      seen,
    });
    seen.add(unitId);
    recordNormalizedExpandedUnit(validation, units, issues);
  }

  units.sort(compareUnits);
  const orderedIds = units.map((unit) => unit.id);
  return { ids: new Set(orderedIds), orderedIds, issues };
};

const recordNormalizedExpandedUnit = (
  validation: RequestedExpandedUnitValidation,
  units: FlowGraphUnitDto[],
  issues: ExpandedFlowGraphIssue[],
): void => {
  if ("issue" in validation) issues.push(validation.issue);
  else units.push(validation.unit);
};

const nodeTypeByUnitType: Partial<Record<string, FlowGraphNodeType>> = {
  g: "jobgroup",
  n: "jobnet",
  rn: "jobnet",
  rm: "jobnet",
  rr: "jobnet",
  rc: "condition",
};

const toExpandedNode = (
  unit: FlowGraphUnitDto,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphNodeDto => ({
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
    semanticDiffHighlight: semanticDiffHighlights?.nodes.get(unit.id),
    layout:
      unit.unitType === "rc"
        ? { kind: "ancestor", depth: unit.depth }
        : { kind: "grid", h: unit.layout.h, v: unit.layout.v },
  },
});

const toExpandedEdges = (
  unit: FlowGraphUnitDto,
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): FlowGraphEdgeDto[] => {
  const ordinals = new Map<string, number>();
  return unit.relations.map((relation) => {
    const edge = {
      source: relation.sourceUnitId,
      target: relation.targetUnitId,
      type: relation.type,
    } as const;
    const key = `${edge.source}\u0000${edge.target}\u0000${edge.type}`;
    const occurrenceOrdinal = ordinals.get(key) ?? 0;
    ordinals.set(key, occurrenceOrdinal + 1);
    return {
      ...edge,
      id: flowGraphEdgeId(edge, occurrenceOrdinal),
      semanticDiffHighlight: semanticDiffHighlights?.edges.get(
        flowGraphEdgeId(edge, occurrenceOrdinal),
      ),
    };
  });
};

const edgeIdentity = (
  edge: Pick<FlowGraphEdgeDto, "id" | "source" | "target" | "type">,
): string => edge.id ?? flowGraphEdgeId(edge);

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
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights,
): void => {
  const visibleChildren = expandedVisibleChildren(expandedUnit);
  appendExpandedNodes({
    state,
    expandedUnit,
    visibleChildren,
    semanticDiffHighlights,
  });
  appendExpandedEdges({ state, expandedUnit, semanticDiffHighlights });
};

const expandedVisibleChildren = (
  unit: FlowGraphUnitDto,
): FlowGraphUnitDto[] => {
  const visibleChildren = unit.children.filter(
    (child) => child.unitType !== "rc",
  );
  const conditionUnit = unit.children.find((child) => child.unitType === "rc");
  if (conditionUnit) visibleChildren.push(conditionUnit);
  return visibleChildren;
};

type ExpandedNodeAppendContext = {
  state: ExpandedGraphBuildState;
  expandedUnit: FlowGraphUnitDto;
  visibleChildren: readonly FlowGraphUnitDto[];
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
};

const appendExpandedNodes = ({
  state,
  expandedUnit,
  visibleChildren,
  semanticDiffHighlights,
}: ExpandedNodeAppendContext): void => {
  for (const child of visibleChildren) {
    appendExpandedNode({
      state,
      expandedUnit,
      child,
      semanticDiffHighlights,
    });
  }
};

const appendExpandedNode = ({
  state,
  expandedUnit,
  child,
  semanticDiffHighlights,
}: {
  state: ExpandedGraphBuildState;
  expandedUnit: FlowGraphUnitDto;
  child: FlowGraphUnitDto;
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
}): void => {
  if (state.nodeIds.has(child.id)) return;
  state.graph.nodes.push(toExpandedNode(child, semanticDiffHighlights));
  state.nodeIds.add(child.id);
  state.nodePlacements.push({
    unitId: child.id,
    parentAnchorUnitId: expandedUnit.id,
    kind: expandedNodePlacementKind(child),
  });
};

const expandedNodePlacementKind = (
  unit: FlowGraphUnitDto,
): ExpandedFlowGraphNodePlacementDto["kind"] =>
  unit.unitType === "rc" ? "nested_condition" : "nested_grid";

type ExpandedEdgeAppendContext = {
  state: ExpandedGraphBuildState;
  expandedUnit: FlowGraphUnitDto;
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
};

const appendExpandedEdges = ({
  state,
  expandedUnit,
  semanticDiffHighlights,
}: ExpandedEdgeAppendContext): void => {
  for (const edge of toExpandedEdges(expandedUnit, semanticDiffHighlights)) {
    appendExpandedEdge(state, edge);
  }
};

const appendExpandedEdge = (
  state: ExpandedGraphBuildState,
  edge: FlowGraphEdgeDto,
): void => {
  const identity = edgeIdentity(edge);
  if (state.edgeIds.has(identity)) return;
  state.graph.edges.push(edge);
  state.edgeIds.add(identity);
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

type ExpandedTraversalContext = {
  state: ExpandedGraphBuildState;
  activeScope: FlowGraphUnitDto;
  requestedIds: ReadonlySet<string>;
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
};

const expandedScopeFrames = (
  container: FlowGraphUnitDto,
  requestedIds: ReadonlySet<string>,
): TraversalFrame[] => {
  const expanded = expandedChildren(container, requestedIds);
  return expanded
    .slice()
    .reverse()
    .map((unit) => ({ kind: "expand", unit }) as const);
};

const visitExpandedScope = (
  context: ExpandedTraversalContext,
  container: FlowGraphUnitDto,
): TraversalFrame[] => {
  const expanded = expandedChildren(container, context.requestedIds);
  context.state.scopes.push({
    containerUnitId: container.id,
    expandedChildUnitIds: expanded.map((unit) => unit.id),
    visibleChildUnitIds: sortedVisibleChildren(container).map(
      (unit) => unit.id,
    ),
  });
  return expandedScopeFrames(container, context.requestedIds);
};

const visitExpandedUnit = (
  context: ExpandedTraversalContext,
  unit: FlowGraphUnitDto,
): TraversalFrame[] => {
  context.state.realizedExpandedUnitIds.push(unit.id);
  appendExpandedUnitContent(
    context.state,
    unit,
    context.semanticDiffHighlights,
  );
  return [{ kind: "scope", container: unit }];
};

const visitExpandedFrame = (
  context: ExpandedTraversalContext,
  frame: TraversalFrame,
): TraversalFrame[] =>
  frame.kind === "expand"
    ? visitExpandedUnit(context, frame.unit)
    : visitExpandedScope(context, frame.container);

const buildExpandedStructure = (context: ExpandedTraversalContext): void => {
  const pending: TraversalFrame[] = [
    { kind: "scope", container: context.activeScope },
  ];
  while (pending.length > 0) {
    const frame = pending.pop() as TraversalFrame;
    pending.push(...visitExpandedFrame(context, frame));
  }
};

type ContainmentFrame =
  | { kind: "enter"; unitId: string }
  | { kind: "exit"; unitId: string };

type ContainmentBuildContext = {
  childrenByContainer: ReadonlyMap<string, readonly string[]>;
  order: string[];
  rangeByUnitId: Map<string, { start: number; end: number }>;
  startByUnitId: Map<string, number>;
};

const visitContainmentFrame = (
  context: ContainmentBuildContext,
  frame: ContainmentFrame,
): ContainmentFrame[] => {
  if (frame.kind === "exit") {
    context.rangeByUnitId.set(frame.unitId, {
      start: context.startByUnitId.get(frame.unitId) ?? 0,
      end: context.order.length,
    });
    return [];
  }
  context.startByUnitId.set(frame.unitId, context.order.length);
  context.order.push(frame.unitId);
  const children = context.childrenByContainer.get(frame.unitId) ?? [];
  return [
    { kind: "exit", unitId: frame.unitId },
    ...children
      .slice()
      .reverse()
      .map((unitId) => ({ kind: "enter", unitId }) as const),
  ];
};

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
  const context: ContainmentBuildContext = {
    childrenByContainer,
    order,
    rangeByUnitId,
    startByUnitId,
  };
  const pending: ContainmentFrame[] = [
    { kind: "enter", unitId: activeScopeUnitId },
  ];
  while (pending.length > 0) {
    const frame = pending.pop() as ContainmentFrame;
    pending.push(...visitContainmentFrame(context, frame));
  }
  return { order, rangeByUnitId };
};

const buildExpandedUnitConstraints = (
  state: ExpandedGraphBuildState,
  containment: ReturnType<typeof buildContainment>,
  index: FlowGraphDocumentIndex,
): ExpandedUnitPlacementConstraintDto[] => {
  const scopeByExpandedChild = indexExpandedScopes(state.scopes);
  return state.realizedExpandedUnitIds.map((unitId) =>
    buildExpandedUnitConstraint({
      unitId,
      scope: scopeByExpandedChild.get(
        unitId,
      ) as ExpandedFlowGraphScopeConstraintDto,
      containment,
      index,
    }),
  );
};

const indexExpandedScopes = (
  scopes: readonly ExpandedFlowGraphScopeConstraintDto[],
): ReadonlyMap<string, ExpandedFlowGraphScopeConstraintDto> => {
  const scopeByExpandedChild = new Map<
    string,
    ExpandedFlowGraphScopeConstraintDto
  >();
  for (const scope of scopes) {
    indexExpandedScope(scopeByExpandedChild, scope);
  }
  return scopeByExpandedChild;
};

const indexExpandedScope = (
  scopeByExpandedChild: Map<string, ExpandedFlowGraphScopeConstraintDto>,
  scope: ExpandedFlowGraphScopeConstraintDto,
): void => {
  for (const expandedChildUnitId of scope.expandedChildUnitIds) {
    scopeByExpandedChild.set(expandedChildUnitId, scope);
  }
};

type ExpandedUnitConstraintContext = {
  unitId: string;
  scope: ExpandedFlowGraphScopeConstraintDto;
  containment: ReturnType<typeof buildContainment>;
  index: FlowGraphDocumentIndex;
};

const siblingUnitsFor = (
  scope: ExpandedFlowGraphScopeConstraintDto,
  unitId: string,
  index: FlowGraphDocumentIndex,
): FlowGraphUnitDto[] =>
  scope.visibleChildUnitIds
    .filter((siblingUnitId) => siblingUnitId !== unitId)
    .map((siblingUnitId) => index.unitById.get(siblingUnitId))
    .filter((unit): unit is FlowGraphUnitDto => !!unit);

type SiblingImpact = {
  affectedSiblingUnitIds: string[];
  horizontalAffectedSiblingUnitIds: string[];
  verticalAffectedSiblingUnitIds: string[];
};

const siblingImpactFor = (
  expandedUnit: FlowGraphUnitDto,
  siblingUnits: readonly FlowGraphUnitDto[],
  visibleChildUnitIds: readonly string[],
): SiblingImpact => {
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
    affectedSiblingUnitIds: visibleChildUnitIds.filter((id) =>
      affectedUnitIds.has(id),
    ),
    horizontalAffectedSiblingUnitIds,
    verticalAffectedSiblingUnitIds,
  };
};

const buildExpandedUnitConstraint = ({
  unitId,
  scope,
  containment,
  index,
}: ExpandedUnitConstraintContext): ExpandedUnitPlacementConstraintDto => {
  const expandedUnit = index.unitById.get(unitId) as FlowGraphUnitDto;
  const siblingUnits = siblingUnitsFor(scope, unitId, index);
  const siblingImpact = siblingImpactFor(
    expandedUnit,
    siblingUnits,
    scope.visibleChildUnitIds,
  );
  return {
    unitId,
    containerUnitId: scope.containerUnitId,
    ...siblingImpact,
    subtreeRange: containment.rangeByUnitId.get(unitId) ?? {
      start: 0,
      end: 0,
    },
  };
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
  buildExpandedStructure({
    state,
    activeScope,
    requestedIds: normalized.ids,
    semanticDiffHighlights,
  });
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
