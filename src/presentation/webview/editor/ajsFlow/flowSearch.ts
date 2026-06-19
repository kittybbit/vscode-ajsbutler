import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { collectExpandedAncestorUnitIdsForUnits } from "./flowExpandedAncestors";

export type FlowSearchResult = {
  matchedUnitId: string;
  matchedUnitIds: string[];
  expandedAncestorUnitIds: string[];
};

type FlowSearchInput = {
  scopeRoot: AjsUnit;
  normalizedQuery: string;
};

type FlowSearchMatch = {
  scopeRoot: AjsUnit;
  matchedUnit: AjsUnit;
  matchedUnits: ReadonlyArray<AjsUnit>;
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

const collectMatchedScopeUnits = (
  scopeRoot: AjsUnit,
  normalizedQuery: string,
): AjsUnit[] =>
  collectScopeUnits(scopeRoot).filter((unit) =>
    unitSearchText(unit).includes(normalizedQuery),
  );

const selectFocusedMatchedUnit = (
  scopeRoot: AjsUnit,
  matchedUnits: ReadonlyArray<AjsUnit>,
): AjsUnit | undefined =>
  matchedUnits.find((unit) => unit.id !== scopeRoot.id) ?? matchedUnits[0];

const resolveFlowSearchInput = (
  scopeRoot: AjsUnit | undefined,
  query: string,
): FlowSearchInput | undefined => {
  const normalizedQuery = normalizeQuery(query);
  return scopeRoot && normalizedQuery.length > 0
    ? { scopeRoot, normalizedQuery }
    : undefined;
};

const resolveFlowSearchMatch = (
  input: FlowSearchInput | undefined,
): FlowSearchMatch | undefined => {
  if (!input) {
    return undefined;
  }

  const matchedUnits = collectMatchedScopeUnits(
    input.scopeRoot,
    input.normalizedQuery,
  );
  const matchedUnit = selectFocusedMatchedUnit(input.scopeRoot, matchedUnits);
  return matchedUnit
    ? { scopeRoot: input.scopeRoot, matchedUnit, matchedUnits }
    : undefined;
};

type BuildFlowSearchResultArgs = {
  scopeRoot: AjsUnit;
  matchedUnit: AjsUnit;
  matchedUnits: ReadonlyArray<AjsUnit>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

const buildFlowSearchResult = ({
  scopeRoot,
  matchedUnit,
  matchedUnits,
  unitById,
}: BuildFlowSearchResultArgs): FlowSearchResult => ({
  matchedUnitId: matchedUnit.id,
  matchedUnitIds: matchedUnits.map((unit) => unit.id),
  expandedAncestorUnitIds: collectExpandedAncestorUnitIdsForUnits({
    unitById,
    units: matchedUnits,
    scopeUnit: scopeRoot,
  }),
});

export const findFlowSearchResult = (
  scopeRoot: AjsUnit | undefined,
  query: string,
  unitById: ReadonlyMap<string, AjsUnit>,
): FlowSearchResult | undefined => {
  const input = resolveFlowSearchInput(scopeRoot, query);
  const match = resolveFlowSearchMatch(input);

  return match
    ? buildFlowSearchResult({
        scopeRoot: match.scopeRoot,
        matchedUnit: match.matchedUnit,
        matchedUnits: match.matchedUnits,
        unitById,
      })
    : undefined;
};
