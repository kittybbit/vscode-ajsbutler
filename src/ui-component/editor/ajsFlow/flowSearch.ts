import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";

export type FlowSearchResult = {
  matchedUnitId: string;
  expandedAncestorUnitIds: string[];
};

const normalizeQueryTokens = (query: string): string[] =>
  query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0);

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

export const findFlowSearchResult = (
  scopeRoot: AjsUnit | undefined,
  query: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): FlowSearchResult | undefined => {
  if (!scopeRoot) {
    return undefined;
  }

  const normalizedQueryTokens = normalizeQueryTokens(query);
  if (normalizedQueryTokens.length === 0) {
    return undefined;
  }

  const matchedUnit = collectScopeUnits(scopeRoot).find((unit) =>
    normalizedQueryTokens.every((token) =>
      unitSearchText(unit).includes(token),
    ),
  );
  if (!matchedUnit) {
    return undefined;
  }

  return {
    matchedUnitId: matchedUnit.id,
    expandedAncestorUnitIds: collectExpandedAncestorUnitIds(
      scopeRoot,
      matchedUnit,
      unitById,
    ),
  };
};
