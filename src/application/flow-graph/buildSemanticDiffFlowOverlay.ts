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

const expandRelationHighlightsToDocument = (
  result: SemanticDiffResult,
  side: SemanticDiffSide,
  document: UnitListDocumentDto,
  highlights: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>,
): ReadonlyMap<string, FlowGraphSemanticDiffHighlight> => {
  const resultHighlightsByTuple = new Map<
    string,
    FlowGraphSemanticDiffHighlight
  >();
  const ordinals = new Map<string, number>();
  for (const relation of result.inputs[side].relations) {
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
  }
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

const collectRelationOccurrences = (
  document: UnitListDocumentDto,
): SemanticDiffFlowRelationOccurrence[] => {
  const occurrences: SemanticDiffFlowRelationOccurrence[] = [];
  for (const unit of collectUnits(document)) {
    const ordinals = new Map<string, number>();
    for (const relation of unit.relations) {
      const key = `${relation.sourceUnitId}\u0000${relation.targetUnitId}\u0000${relation.type}`;
      const ordinal = ordinals.get(key) ?? 0;
      ordinals.set(key, ordinal + 1);
      const edge = {
        source: relation.sourceUnitId,
        target: relation.targetUnitId,
        type: relation.type,
      } as const;
      occurrences.push({
        id: flowGraphEdgeId(edge, ordinal),
        sourceUnitId: relation.sourceUnitId,
        targetUnitId: relation.targetUnitId,
        type: relation.type,
        occurrenceOrdinal: ordinal,
      });
    }
  }
  return occurrences;
};

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

const toEntries = (
  entries: ReadonlyMap<string, FlowGraphSemanticDiffHighlight>,
  ids: ReadonlySet<string>,
): FlowGraphSemanticDiffOverlayEntry[] =>
  [...entries.entries()]
    .filter(([id]) => ids.has(id))
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([id, highlight]) => ({
      id,
      kind: highlight.kind,
      changeIds: [...highlight.changeIds],
      confirmationIds: [...highlight.confirmationIds],
    }));

/** Build the state-only overlay for one concrete before/after Flow document. */
export const buildSemanticDiffFlowOverlay = (
  result: SemanticDiffResult,
  side: SemanticDiffSide,
  document: UnitListDocumentDto,
): FlowGraphSemanticDiffOverlay => {
  const highlights = buildSemanticDiffFlowHighlights(result)[side];
  const unitIds = new Set(collectUnits(document).map((unit) => unit.id));
  const relationHighlights = expandRelationHighlightsToDocument(
    result,
    side,
    document,
    highlights.edges,
  );
  return {
    nodes: toEntries(highlights.nodes, unitIds),
    relations: toEntries(relationHighlights, collectRelationIds(document)),
  };
};
