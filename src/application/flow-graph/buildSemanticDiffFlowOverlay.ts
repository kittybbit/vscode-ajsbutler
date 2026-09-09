import type { UnitListDocumentDto } from "../unit-list/unitListDocument";
import type {
  SemanticDiffResult,
  SemanticDiffRelationReference,
  SemanticDiffSide,
} from "../semantic-diff/semanticDiffDto";
import { buildSemanticDiffFlowHighlights } from "./buildSemanticDiffFlowHighlights";
import {
  flowGraphEdgeId,
  type FlowGraphSemanticDiffHighlight,
  type FlowGraphSemanticDiffOverlay,
  type FlowGraphSemanticDiffOverlayEntry,
} from "./buildFlowGraphCore";

const collectUnits = (
  document: UnitListDocumentDto,
): UnitListDocumentDto["rootUnits"] => {
  const units: UnitListDocumentDto["rootUnits"] = [];
  const pending = [...document.rootUnits];
  while (pending.length > 0) {
    const unit = pending.pop() as UnitListDocumentDto["rootUnits"][number];
    units.push(unit);
    pending.push(...unit.children);
  }
  return units;
};

const collectRelationIds = (document: UnitListDocumentDto): Set<string> => {
  return new Set(collectRelationOccurrences(document).map(({ id }) => id));
};

const relationTupleKey = (
  relation: Pick<
    SemanticDiffRelationReference,
    "sourceUnitId" | "targetUnitId" | "type"
  >,
): string =>
  `${relation.sourceUnitId}\u0000${relation.targetUnitId}\u0000${relation.type}`;

const highlightRank: Record<FlowGraphSemanticDiffHighlight["kind"], number> = {
  changed: 1,
  added: 2,
  removed: 3,
  "confirmation-required": 4,
};

const mergeRelationHighlights = (
  current: FlowGraphSemanticDiffHighlight | undefined,
  next: FlowGraphSemanticDiffHighlight,
): FlowGraphSemanticDiffHighlight => {
  if (!current) return next;
  return {
    kind:
      highlightRank[next.kind] > highlightRank[current.kind]
        ? next.kind
        : current.kind,
    changeIds: [...new Set([...current.changeIds, ...next.changeIds])].sort(),
    confirmationIds: [
      ...new Set([...current.confirmationIds, ...next.confirmationIds]),
    ].sort(),
  };
};

type RelationHighlightExpansion = {
  result: SemanticDiffResult;
  side: SemanticDiffSide;
  document: UnitListDocumentDto;
  highlights: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>;
};

const buildResultRelationHighlightsByTuple = ({
  result,
  side,
  highlights,
}: Pick<
  RelationHighlightExpansion,
  "result" | "side" | "highlights"
>): ReadonlyMap<string, FlowGraphSemanticDiffHighlight> => {
  const resultHighlightsByTuple = new Map<
    string,
    FlowGraphSemanticDiffHighlight
  >();
  const ordinals = new Map<string, number>();
  const appendHighlight = (relation: SemanticDiffRelationReference): void => {
    const tuple = relationTupleKey(relation);
    const ordinal = ordinals.get(tuple) ?? 0;
    ordinals.set(tuple, ordinal + 1);
    const highlight = highlights.get(
      flowGraphEdgeId(
        {
          source: relation.sourceUnitId,
          target: relation.targetUnitId,
          type: relation.type,
        },
        ordinal,
      ),
    );
    if (highlight) {
      resultHighlightsByTuple.set(
        tuple,
        mergeRelationHighlights(resultHighlightsByTuple.get(tuple), highlight),
      );
    }
  };
  result.inputs[side].relations.forEach(appendHighlight);
  return resultHighlightsByTuple;
};

const expandRelationHighlightsToDocument = ({
  result,
  side,
  document,
  highlights,
}: RelationHighlightExpansion): ReadonlyMap<
  string,
  FlowGraphSemanticDiffHighlight
> => {
  const resultHighlightsByTuple = buildResultRelationHighlightsByTuple({
    result,
    side,
    highlights,
  });
  return new Map(
    collectRelationOccurrences(document).flatMap((occurrence) => {
      const highlight = resultHighlightsByTuple.get(
        relationTupleKey(occurrence),
      );
      return highlight ? [[occurrence.id, highlight] as const] : [];
    }),
  );
};

export type SemanticDiffFlowRelationOccurrence = Readonly<{
  id: string;
  sourceUnitId: string;
  targetUnitId: string;
  type: "seq" | "con";
  occurrenceOrdinal: number;
}>;

const collectUnitRelationOccurrences = (
  unit: UnitListDocumentDto["rootUnits"][number],
): SemanticDiffFlowRelationOccurrence[] => {
  const ordinals = new Map<string, number>();
  return unit.relations.map((relation) => {
    const ordinal = ordinals.get(relationTupleKey(relation)) ?? 0;
    ordinals.set(relationTupleKey(relation), ordinal + 1);
    const edge = {
      source: relation.sourceUnitId,
      target: relation.targetUnitId,
      type: relation.type,
    } as const;
    return {
      id: flowGraphEdgeId(edge, ordinal),
      sourceUnitId: relation.sourceUnitId,
      targetUnitId: relation.targetUnitId,
      type: relation.type,
      occurrenceOrdinal: ordinal,
    };
  });
};

const collectRelationOccurrences = (
  document: UnitListDocumentDto,
): SemanticDiffFlowRelationOccurrence[] =>
  collectUnits(document).flatMap(collectUnitRelationOccurrences);

export const findSemanticDiffFlowRelationOccurrences = (
  document: UnitListDocumentDto,
  relation: Pick<
    SemanticDiffRelationReference,
    "sourceUnitId" | "targetUnitId" | "type"
  >,
): readonly SemanticDiffFlowRelationOccurrence[] =>
  collectRelationOccurrences(document).filter(
    (candidate) =>
      candidate.sourceUnitId === relation.sourceUnitId &&
      candidate.targetUnitId === relation.targetUnitId &&
      candidate.type === relation.type,
  );

const toOverlayEntry = (
  id: string,
  highlight: FlowGraphSemanticDiffHighlight,
): FlowGraphSemanticDiffOverlayEntry => ({
  id,
  kind: highlight.kind,
  changeIds: [...highlight.changeIds],
  confirmationIds: [...highlight.confirmationIds],
});

const sortOverlayEntries = (
  entries: [string, FlowGraphSemanticDiffHighlight][],
): [string, FlowGraphSemanticDiffHighlight][] =>
  entries.sort(compareOverlayEntryIds);

const compareOverlayEntryIds = (
  [left]: [string, FlowGraphSemanticDiffHighlight],
  [right]: [string, FlowGraphSemanticDiffHighlight],
): number => Number(left > right) - Number(left < right);

const toEntries = (
  entries: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>,
  ids: ReadonlySet<string>,
): FlowGraphSemanticDiffOverlayEntry[] =>
  sortOverlayEntries([...entries.entries()].filter(([id]) => ids.has(id))).map(
    ([id, highlight]) => toOverlayEntry(id, highlight),
  );

/** Build the state-only overlay for one concrete before/after Flow document. */
export const buildSemanticDiffFlowOverlay = (
  result: SemanticDiffResult,
  side: SemanticDiffSide,
  document: UnitListDocumentDto,
): FlowGraphSemanticDiffOverlay => {
  const highlights = buildSemanticDiffFlowHighlights(result)[side];
  const unitIds = new Set(collectUnits(document).map((unit) => unit.id));
  const relationHighlights = expandRelationHighlightsToDocument({
    result,
    side,
    document,
    highlights: highlights.edges,
  });
  return {
    nodes: toEntries(highlights.nodes, unitIds),
    relations: toEntries(relationHighlights, collectRelationIds(document)),
  };
};
