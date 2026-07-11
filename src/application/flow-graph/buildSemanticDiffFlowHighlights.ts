import type { AjsRelation, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChangeSet,
  SemanticDiffConfirmationLevel,
  SemanticDiffTarget,
} from "../../domain/models/semantic-diff/SemanticDiff";
import {
  flowGraphEdgeSemanticDiffKey,
  type FlowGraphEdgeDto,
  type FlowGraphSemanticDiffHighlight,
  type FlowGraphSemanticDiffHighlightKind,
  type FlowGraphSemanticDiffHighlights,
} from "./buildFlowGraphCore";

type MutableFlowHighlight = {
  kind: FlowGraphSemanticDiffHighlightKind;
  changeIds: Set<string>;
  confirmationIds: Set<string>;
};

const toImmutableHighlight = (
  highlight: MutableFlowHighlight,
): FlowGraphSemanticDiffHighlight => ({
  kind: highlight.kind,
  changeIds: [...highlight.changeIds].sort(),
  confirmationIds: [...highlight.confirmationIds].sort(),
});

const highlightRank: Record<FlowGraphSemanticDiffHighlightKind, number> = {
  changed: 1,
  "confirmation-required": 2,
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
  if (!key) {
    return;
  }
  const current = highlights.get(key) ?? {
    kind,
    changeIds: new Set<string>(),
    confirmationIds: new Set<string>(),
  };
  current.kind = mergeHighlightKind(current.kind, kind);
  if (idType === "change") {
    current.changeIds.add(id);
  } else {
    current.confirmationIds.add(id);
  }
  highlights.set(key, current);
};

const isRenderableAfterSideChange = (
  confirmationLevel: SemanticDiffConfirmationLevel,
): boolean =>
  confirmationLevel === "confirmed" ||
  confirmationLevel === "confirmation-required";

const unitTargetId = (
  target: SemanticDiffTarget | undefined,
): string | undefined => {
  if (target?.kind === "unit" || target?.kind === "jobnet") {
    return target.unit.id;
  }
  if (target?.kind === "attribute") {
    return target.unit.id;
  }
  return undefined;
};

const relationEdgeKey = (relation: AjsRelation): string =>
  flowGraphEdgeSemanticDiffKey({
    source: relation.sourceUnitId,
    target: relation.targetUnitId,
    type: relation.type,
  } satisfies Pick<FlowGraphEdgeDto, "source" | "target" | "type">);

const relationTargetEdgeKey = (
  target: SemanticDiffTarget | undefined,
): string | undefined =>
  target?.kind === "relation" ? relationEdgeKey(target.relation) : undefined;

const addTargetHighlight = ({
  edgeHighlights,
  id,
  idType,
  kind,
  nodeHighlights,
  target,
}: {
  edgeHighlights: Map<string, MutableFlowHighlight>;
  id: string;
  idType: "change" | "confirmation";
  kind: FlowGraphSemanticDiffHighlightKind;
  nodeHighlights: Map<string, MutableFlowHighlight>;
  target: SemanticDiffTarget | undefined;
}): void => {
  addHighlight(nodeHighlights, unitTargetId(target), kind, id, idType);
  addHighlight(edgeHighlights, relationTargetEdgeKey(target), kind, id, idType);
};

const targetExistsInAfterDocument = (
  target: SemanticDiffTarget | undefined,
  afterUnitIds: ReadonlySet<string>,
  afterEdgeKeys: ReadonlySet<string>,
): boolean => {
  const unitId = unitTargetId(target);
  if (unitId) {
    return afterUnitIds.has(unitId);
  }
  const edgeKey = relationTargetEdgeKey(target);
  return edgeKey ? afterEdgeKeys.has(edgeKey) : false;
};

const collectUnitIds = (units: AjsUnit[]): string[] =>
  units.flatMap((unit) => [unit.id, ...collectUnitIds(unit.children)]);

const collectRelationKeys = (units: AjsUnit[]): string[] =>
  units.flatMap((unit) => [
    ...unit.relations.map(relationEdgeKey),
    ...collectRelationKeys(unit.children),
  ]);

export const buildSemanticDiffFlowHighlights = (
  changeSet: SemanticDiffChangeSet,
): FlowGraphSemanticDiffHighlights => {
  const afterUnitIds = new Set(
    collectUnitIds(changeSet.inputs.after.document.rootUnits),
  );
  const afterEdgeKeys = new Set(
    collectRelationKeys(changeSet.inputs.after.document.rootUnits),
  );
  const nodeHighlights = new Map<string, MutableFlowHighlight>();
  const edgeHighlights = new Map<string, MutableFlowHighlight>();

  changeSet.changes
    .filter((change) => isRenderableAfterSideChange(change.confirmationLevel))
    .forEach((change) => {
      const target = change.after;
      if (!targetExistsInAfterDocument(target, afterUnitIds, afterEdgeKeys)) {
        return;
      }
      addTargetHighlight({
        edgeHighlights,
        id: change.id,
        idType: "change",
        kind: "changed",
        nodeHighlights,
        target,
      });
    });

  changeSet.confirmationRequired.forEach((item) => {
    if (
      !targetExistsInAfterDocument(item.target, afterUnitIds, afterEdgeKeys)
    ) {
      return;
    }
    addTargetHighlight({
      edgeHighlights,
      id: item.id,
      idType: "confirmation",
      kind: "confirmation-required",
      nodeHighlights,
      target: item.target,
    });
  });

  return {
    nodes: new Map(
      [...nodeHighlights.entries()].map(([key, value]) => [
        key,
        toImmutableHighlight(value),
      ]),
    ),
    edges: new Map(
      [...edgeHighlights.entries()].map(([key, value]) => [
        key,
        toImmutableHighlight(value),
      ]),
    ),
  };
};
