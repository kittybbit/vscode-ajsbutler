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

const addHighlight = (
  highlights: Map<string, MutableFlowHighlight>,
  key: string | undefined,
  kind: FlowGraphSemanticDiffHighlightKind,
  id: string,
  idType: "change" | "confirmation",
): void => {
  if (key === undefined) return;
  const current = highlights.get(key) ?? {
    kind,
    changeIds: new Set<string>(),
    confirmationIds: new Set<string>(),
  };
  current.kind = mergeHighlightKind(current.kind, kind);
  if (idType === "change") current.changeIds.add(id);
  else current.confirmationIds.add(id);
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

const relationIdsForTarget = (
  result: SemanticDiffResult,
  side: SemanticDiffSide,
  target: SemanticDiffTarget | undefined,
  endpoint: SemanticDiffRelationEndpoint | null | undefined,
  idsByPair: ReadonlyMap<string, readonly string[]>,
): readonly string[] => {
  const relation =
    endpoint === null || endpoint === undefined
      ? relationFromTarget(target)
      : endpoint;
  if (!relation) return [];
  const exact = idsByPair.get(relationTupleKey(relation));
  if (exact && exact.length > 0) return exact;
  // A remapped endpoint still resolves only against concrete side relations.
  return result.inputs[side].relations
    .filter(
      (candidate) =>
        candidate.sourceUnitId === relation.sourceUnitId &&
        candidate.targetUnitId === relation.targetUnitId &&
        candidate.type === relation.type,
    )
    .map((candidate, ordinal) =>
      flowGraphEdgeId(toFlowRelation(candidate), ordinal),
    );
};

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
  addHighlight(set.nodes, unitTargetId(target), kind, id, idType);
  for (const edgeId of relationIdsForTarget(
    result,
    side,
    target,
    relationEndpoint,
    idsByPair,
  )) {
    addHighlight(set.edges, edgeId, kind, id, idType);
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

/** Project immutable semantic records into concrete before/after Flow IDs. */
export const buildSemanticDiffFlowHighlights = (
  result: SemanticDiffResult,
): FlowGraphSemanticDiffHighlights => {
  const sets = { before: createHighlightSet(), after: createHighlightSet() };
  const edgeIds = {
    before: relationEdgeIdsByCanonicalPair(result, "before"),
    after: relationEdgeIdsByCanonicalPair(result, "after"),
  };

  for (const change of result.changes) {
    if (!renderable(change.confirmationLevel)) continue;
    const side = targetSideForChange(change.kind);
    const target = side === "before" ? change.before : change.after;
    addTargetHighlight({
      idsByPair: edgeIds[side],
      result,
      side,
      id: change.id,
      idType: "change",
      kind:
        change.kind === "added"
          ? "added"
          : change.kind === "removed"
            ? "removed"
            : "changed",
      set: sets[side],
      target,
      relationEndpoint: change.relationPair?.[side] ?? null,
    });
  }

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

  const before = freezeSet(sets.before);
  const after = freezeSet(sets.after);
  return { ...after, before, after };
};
