import {
  flowGraphEdgeId,
  type FlowGraphSemanticDiffOverlay,
  type FlowGraphSemanticDiffOverlayEntry,
} from "./buildFlowGraphCore";
import type { FlowGraphUnitDto } from "./flowGraphDocument";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasExactKeys = (
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean => {
  const actual = Object.keys(value).sort();
  return actual.join("\u0000") === expected.join("\u0000");
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const semanticDiffHighlightKinds = new Set([
  "added",
  "removed",
  "changed",
  "confirmation-required",
]);

const allChecksPass = (checks: readonly (() => boolean)[]): boolean =>
  checks.every((check) => check());

const isValidOverlayEntryFields = (value: Record<string, unknown>): boolean =>
  allChecksPass([
    () => typeof value.id === "string" && value.id.length > 0,
    () =>
      typeof value.kind === "string" &&
      semanticDiffHighlightKinds.has(value.kind),
    () => isStringArray(value.changeIds),
    () => isStringArray(value.confirmationIds),
  ]);

const isSemanticDiffOverlayEntry = (
  value: unknown,
): value is FlowGraphSemanticDiffOverlayEntry => {
  if (!isRecord(value)) return false;
  if (!hasExactKeys(value, ["changeIds", "confirmationIds", "id", "kind"])) {
    return false;
  }
  return isValidOverlayEntryFields(value);
};

const cloneOverlayEntry = (
  entry: FlowGraphSemanticDiffOverlayEntry,
): FlowGraphSemanticDiffOverlayEntry => ({
  id: entry.id,
  kind: entry.kind,
  changeIds: [...entry.changeIds],
  confirmationIds: [...entry.confirmationIds],
});

const parseOverlayRecord = (
  value: Record<string, unknown>,
): FlowGraphSemanticDiffOverlay | undefined => {
  if (!hasExactKeys(value, ["nodes", "relations"])) return undefined;
  const entries = readOverlayEntries(value);
  if (!entries) return undefined;
  return {
    nodes: entries.nodes.map(cloneOverlayEntry),
    relations: entries.relations.map(cloneOverlayEntry),
  };
};

const readOverlayEntries = (
  value: Record<string, unknown>,
):
  | {
      nodes: FlowGraphSemanticDiffOverlayEntry[];
      relations: FlowGraphSemanticDiffOverlayEntry[];
    }
  | undefined => {
  let entries:
    | {
        nodes: FlowGraphSemanticDiffOverlayEntry[];
        relations: FlowGraphSemanticDiffOverlayEntry[];
      }
    | undefined;
  const hasArrays = allChecksPass([
    () => Array.isArray(value.nodes),
    () => Array.isArray(value.relations),
  ]);
  if (
    hasArrays &&
    (value.nodes as unknown[]).every(isSemanticDiffOverlayEntry) &&
    (value.relations as unknown[]).every(isSemanticDiffOverlayEntry)
  ) {
    entries = {
      nodes: value.nodes as FlowGraphSemanticDiffOverlayEntry[],
      relations: value.relations as FlowGraphSemanticDiffOverlayEntry[],
    };
  }
  return entries;
};

export const parseSemanticDiffOverlay = (
  value: unknown,
): FlowGraphSemanticDiffOverlay | null | undefined => {
  let result: FlowGraphSemanticDiffOverlay | null | undefined;
  if (value === null) {
    result = null;
  } else if (isRecord(value)) {
    result = parseOverlayRecord(value);
  }
  return result;
};

const relationKey = (relation: FlowGraphUnitDto["relations"][number]): string =>
  `${relation.sourceUnitId}\u0000${relation.targetUnitId}\u0000${relation.type}`;

const collectEdgeIds = (
  rootUnits: readonly FlowGraphUnitDto[],
): ReadonlySet<string> => {
  const edgeIds = new Set<string>();
  const pending = [...rootUnits];
  while (pending.length > 0) {
    const unit = pending.pop() as FlowGraphUnitDto;
    const ordinals = new Map<string, number>();
    unit.relations.forEach((relation) => {
      const key = relationKey(relation);
      const ordinal = ordinals.get(key) ?? 0;
      ordinals.set(key, ordinal + 1);
      edgeIds.add(
        flowGraphEdgeId(
          {
            source: relation.sourceUnitId,
            target: relation.targetUnitId,
            type: relation.type,
          },
          ordinal,
        ),
      );
    });
    pending.push(...unit.children);
  }
  return edgeIds;
};

const areEntriesInKind = (
  entries: readonly FlowGraphSemanticDiffOverlayEntry[],
  ids: ReadonlySet<string>,
  oppositeIds: ReadonlySet<string>,
): boolean =>
  entries.every((entry) => ids.has(entry.id) && !oppositeIds.has(entry.id));

export const validateSemanticDiffOverlayMembership = (
  overlay: FlowGraphSemanticDiffOverlay,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
  rootUnits: readonly FlowGraphUnitDto[],
): boolean => {
  const nodeIds = new Set(unitById.keys());
  const edgeIds = collectEdgeIds(rootUnits);
  return (
    areEntriesInKind(overlay.nodes, nodeIds, edgeIds) &&
    areEntriesInKind(overlay.relations, edgeIds, nodeIds)
  );
};
