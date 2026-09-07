import type {
  SemanticDiffChange,
  SemanticDiffConfirmationLevel,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationReference,
  SemanticDiffResult,
  SemanticDiffSide,
  SemanticDiffTarget,
} from "../semantic-diff/semanticDiffDto";
import {
  flowGraphEdgeId,
  type FlowGraphSemanticDiffHighlight,
  type FlowGraphSemanticDiffHighlightKind,
  type FlowGraphSemanticDiffHighlightSet,
  type FlowGraphSemanticDiffHighlights,
} from "./buildFlowGraphCore";

type MutableFlowHighlight = {
  kind: FlowGraphSemanticDiffHighlightKind;
  changeIds: Set<string>;
  confirmationIds: Set<string>;
};

const createHighlightSet = (): {
  nodes: Map<string, MutableFlowHighlight>;
  edges: Map<string, MutableFlowHighlight>;
} => ({ nodes: new Map(), edges: new Map() });

const toImmutableHighlight = (
  highlight: MutableFlowHighlight,
): FlowGraphSemanticDiffHighlight => ({
  kind: highlight.kind,
  changeIds: [...highlight.changeIds].sort(),
  confirmationIds: [...highlight.confirmationIds].sort(),
});

const highlightRank: Record<FlowGraphSemanticDiffHighlightKind, number> = {
  changed: 1,
  added: 2,
  removed: 3,
  "confirmation-required": 4,
};

const mergeHighlightKind = (
  current: FlowGraphSemanticDiffHighlightKind,
  next: FlowGraphSemanticDiffHighlightKind,
): FlowGraphSemanticDiffHighlightKind =>
  highlightRank[next] > highlightRank[current] ? next : current;

type AddHighlightOptions = {
  highlights: Map<string, MutableFlowHighlight>;
  key: string | undefined;
  kind: FlowGraphSemanticDiffHighlightKind;
  id: string;
  idType: "change" | "confirmation";
};

const addHighlightId = (
  highlight: MutableFlowHighlight,
  id: string,
  idType: AddHighlightOptions["idType"],
): void => {
  const ids =
    idType === "change" ? highlight.changeIds : highlight.confirmationIds;
  ids.add(id);
};

const addHighlight = ({
  highlights,
  key,
  kind,
  id,
  idType,
}: AddHighlightOptions): void => {
  if (key === undefined) return;
  const current = highlights.get(key) ?? {
    kind,
    changeIds: new Set<string>(),
    confirmationIds: new Set<string>(),
  };
  current.kind = mergeHighlightKind(current.kind, kind);
  addHighlightId(current, id, idType);
  highlights.set(key, current);
};

const unitTargetId = (
  target: SemanticDiffTarget | undefined,
): string | undefined => {
  if (
    target?.kind === "unit" ||
    target?.kind === "jobnet" ||
    target?.kind === "attribute"
  ) {
    return target.unit.id;
  }
  return undefined;
};

const relationFromTarget = (
  target: SemanticDiffTarget | undefined,
): SemanticDiffRelationReference | undefined =>
  target?.kind === "relation" ? target.relation : undefined;

const relationTupleKey = (
  relation: Pick<
    SemanticDiffRelationReference,
    "sourceUnitId" | "targetUnitId" | "type"
  >,
): string =>
  `${relation.sourceUnitId}\u0000${relation.targetUnitId}\u0000${relation.type}`;

const toFlowRelation = (
  relation: Pick<
    SemanticDiffRelationReference,
    "sourceUnitId" | "targetUnitId" | "type"
  >,
) => ({
  source: relation.sourceUnitId,
  target: relation.targetUnitId,
  type: relation.type,
});

const relationEdgeIdsByCanonicalPair = (
  result: SemanticDiffResult,
  side: SemanticDiffSide,
): ReadonlyMap<string, readonly string[]> => {
  const idsByPair = new Map<string, string[]>();
  const ordinals = new Map<string, number>();
  for (const relation of result.inputs[side].relations) {
    const tuple = relationTupleKey(relation);
    const ordinal = ordinals.get(tuple) ?? 0;
    ordinals.set(tuple, ordinal + 1);
    const id = flowGraphEdgeId(toFlowRelation(relation), ordinal);
    const ids = idsByPair.get(tuple) ?? [];
    ids.push(id);
    idsByPair.set(tuple, ids);
  }
  return idsByPair;
};

const relationForTarget = (
  target: SemanticDiffTarget | undefined,
  endpoint: SemanticDiffRelationEndpoint | null | undefined,
): SemanticDiffRelationReference | undefined =>
  endpoint ?? relationFromTarget(target);

type RelationIdsForTargetOptions = {
  result: SemanticDiffResult;
  side: SemanticDiffSide;
  target: SemanticDiffTarget | undefined;
  endpoint: SemanticDiffRelationEndpoint | null | undefined;
  idsByPair: ReadonlyMap<string, readonly string[]>;
};

const relationIdsForTarget = ({
  result,
  side,
  target,
  endpoint,
  idsByPair,
}: RelationIdsForTargetOptions): readonly string[] => {
  const relation = relationForTarget(target, endpoint);
  if (!relation) return [];
  return relationIdsForPair(
    idsByPair.get(relationTupleKey(relation)),
    () => concreteRelationIds(result.inputs[side].relations, relation),
  );
};

const concreteRelationIds = (
  relations: readonly SemanticDiffRelationReference[],
  relation: SemanticDiffRelationReference,
): readonly string[] =>
  relations
    .filter(
      (candidate) =>
        candidate.sourceUnitId === relation.sourceUnitId &&
        candidate.targetUnitId === relation.targetUnitId &&
        candidate.type === relation.type,
    )
    .map((candidate, ordinal) =>
      flowGraphEdgeId(toFlowRelation(candidate), ordinal),
    );

const relationIdsForPair = (
  exact: readonly string[] | undefined,
  fallback: () => readonly string[],
): readonly string[] => (exact && exact.length > 0 ? exact : fallback());

const targetExistsOnSide = (
  result: SemanticDiffResult,
  side: SemanticDiffSide,
  target: SemanticDiffTarget | undefined,
): boolean => {
  const unitId = unitTargetId(target);
  if (unitId !== undefined) return result.inputs[side].unitIds.includes(unitId);
  return relationFromTarget(target) !== undefined;
};

const targetSideForChange = (
  kind: SemanticDiffChange["kind"],
): SemanticDiffSide => (kind === "removed" ? "before" : "after");

const targetSideForConfirmation = (
  reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"],
): SemanticDiffSide =>
  reasonCode === "conditional-relation-removed" ? "before" : "after";

const renderable = (level: SemanticDiffConfirmationLevel): boolean =>
  level === "confirmed" || level === "confirmation-required";

const addTargetHighlight = ({
  idsByPair,
  result,
  side,
  id,
  idType,
  kind,
  set,
  target,
  relationEndpoint,
}: {
  idsByPair: ReadonlyMap<string, readonly string[]>;
  result: SemanticDiffResult;
  side: SemanticDiffSide;
  id: string;
  idType: "change" | "confirmation";
  kind: FlowGraphSemanticDiffHighlightKind;
  set: ReturnType<typeof createHighlightSet>;
  target: SemanticDiffTarget | undefined;
  relationEndpoint?: SemanticDiffRelationEndpoint | null;
}): void => {
  if (!targetExistsOnSide(result, side, target)) return;
  addHighlight({
    highlights: set.nodes,
    key: unitTargetId(target),
    kind,
    id,
    idType,
  });
  for (const edgeId of relationIdsForTarget({
    result,
    side,
    target,
    endpoint: relationEndpoint,
    idsByPair,
  })) {
    addHighlight({
      highlights: set.edges,
      key: edgeId,
      kind,
      id,
      idType,
    });
  }
};

const freezeSet = (
  set: ReturnType<typeof createHighlightSet>,
): FlowGraphSemanticDiffHighlightSet => ({
  nodes: new Map(
    [...set.nodes.entries()].map(([key, value]) => [
      key,
      toImmutableHighlight(value),
    ]),
  ),
  edges: new Map(
    [...set.edges.entries()].map(([key, value]) => [
      key,
      toImmutableHighlight(value),
    ]),
  ),
});

const changeHighlightKind = (
  kind: SemanticDiffChange["kind"],
): FlowGraphSemanticDiffHighlightKind => {
  if (kind === "added") return "added";
  if (kind === "removed") return "removed";
  return "changed";
};

type HighlightSideContext = {
  result: SemanticDiffResult;
  sets: Record<SemanticDiffSide, ReturnType<typeof createHighlightSet>>;
  edgeIds: Record<SemanticDiffSide, ReadonlyMap<string, readonly string[]>>;
};

const addChangeHighlights = ({
  result,
  sets,
  edgeIds,
}: HighlightSideContext): void => {
  for (const change of result.changes) {
    addChangeHighlight({ result, sets, edgeIds, change });
  }
};

const addChangeHighlight = ({
  result,
  sets,
  edgeIds,
  change,
}: HighlightSideContext & { change: SemanticDiffChange }): void => {
  if (!renderable(change.confirmationLevel)) return;
  const side = targetSideForChange(change.kind);
  addTargetHighlight({
    idsByPair: edgeIds[side],
    result,
    side,
    id: change.id,
    idType: "change",
    kind: changeHighlightKind(change.kind),
    set: sets[side],
    target: side === "before" ? change.before : change.after,
    relationEndpoint: change.relationPair?.[side] ?? null,
  });
};

const addConfirmationHighlights = ({
  result,
  sets,
  edgeIds,
}: HighlightSideContext): void => {
  for (const item of result.confirmationRequired) {
    const side = targetSideForConfirmation(item.reasonCode);
    addTargetHighlight({
      idsByPair: edgeIds[side],
      result,
      side,
      id: item.id,
      idType: "confirmation",
      kind: "confirmation-required",
      set: sets[side],
      target: item.target,
      relationEndpoint: item.detail.relationPair?.[side] ?? null,
    });
  }
};

/** Project immutable semantic records into concrete before/after Flow IDs. */
export const buildSemanticDiffFlowHighlights = (
  result: SemanticDiffResult,
): FlowGraphSemanticDiffHighlights => {
  const sets = { before: createHighlightSet(), after: createHighlightSet() };
  const edgeIds = {
    before: relationEdgeIdsByCanonicalPair(result, "before"),
    after: relationEdgeIdsByCanonicalPair(result, "after"),
  };
  const context = { result, sets, edgeIds };
  addChangeHighlights(context);
  addConfirmationHighlights(context);

  const before = freezeSet(sets.before);
  const after = freezeSet(sets.after);
  return { ...after, before, after };
};
