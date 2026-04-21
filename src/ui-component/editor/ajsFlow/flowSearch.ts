import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";

export type FlowSearchResult = {
  matchedUnitId: string;
  matchedUnitIds: string[];
  expandedAncestorUnitIds: string[];
};

const normalizeQuery = (query: string): string => query.trim().toLowerCase();

const unitSearchText = (unit: AjsUnit): string =>
  [unit.name, unit.comment, unit.absolutePath]
    .filter((value): value is string => typeof value === "string")
    .join("\n")
    .toLowerCase();

const collectScopeUnits = (root: AjsUnit): AjsUnit[] => {
  const units: AjsUnit[] = [root];
  for (const child of root.children) {
    units.push(...collectScopeUnits(child));
  }
  return units;
};

const collectExpandedAncestorUnitIds = (
  scopeRoot: AjsUnit,
  matchedUnit: AjsUnit,
  unitById: ReadonlyMap<string, AjsUnit>,
): string[] => {
  const expandedAncestorUnitIds: string[] = [];
  let current = matchedUnit.parentId
    ? unitById.get(matchedUnit.parentId)
    : undefined;

  while (current && current.id !== scopeRoot.id) {
    if (current.unitType === "n" && current.children.length > 0) {
      expandedAncestorUnitIds.unshift(current.id);
    }
    current = current.parentId ? unitById.get(current.parentId) : undefined;
  }

  return expandedAncestorUnitIds;
};

const collectExpandedAncestorUnitIdsForMatches = (
  scopeRoot: AjsUnit,
  matchedUnits: ReadonlyArray<AjsUnit>,
  unitById: ReadonlyMap<string, AjsUnit>,
): string[] => {
  const expandedAncestorUnitIds = new Set<string>();

  for (const matchedUnit of matchedUnits) {
    for (const ancestorUnitId of collectExpandedAncestorUnitIds(
      scopeRoot,
      matchedUnit,
      unitById,
    )) {
      expandedAncestorUnitIds.add(ancestorUnitId);
    }
  }

  return [...expandedAncestorUnitIds];
};

export const findFlowSearchResult = (
  scopeRoot: AjsUnit | undefined,
  query: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): FlowSearchResult | undefined => {
  if (!scopeRoot) {
    return undefined;
  }

  const normalizedQuery = normalizeQuery(query);
  if (normalizedQuery.length === 0) {
    return undefined;
  }

  const matchedUnits = collectScopeUnits(scopeRoot).filter((unit) =>
    unitSearchText(unit).includes(normalizedQuery),
  );
  const matchedUnit =
    matchedUnits.find((unit) => unit.id !== scopeRoot.id) ?? matchedUnits[0];
  if (!matchedUnit) {
    return undefined;
  }

  return {
    matchedUnitId: matchedUnit.id,
    matchedUnitIds: matchedUnits.map((unit) => unit.id),
    expandedAncestorUnitIds: collectExpandedAncestorUnitIdsForMatches(
      scopeRoot,
      matchedUnits,
      unitById,
    ),
  };
};
