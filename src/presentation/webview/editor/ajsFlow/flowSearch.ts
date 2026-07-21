import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import { collectExpandedAncestorUnitIdsForUnits } from "./flowExpandedAncestors";

export type FlowSearchResult = {
  matchedUnitId: string;
  matchedUnitIds: string[];
  expandedAncestorUnitIds: string[];
};

type FlowSearchInput = {
  scopeRoot: FlowGraphUnitDto;
  normalizedQuery: string;
};

type FlowSearchMatch = {
  scopeRoot: FlowGraphUnitDto;
  matchedUnit: FlowGraphUnitDto;
  matchedUnits: ReadonlyArray<FlowGraphUnitDto>;
};

const normalizeQuery = (query: string): string => query.trim().toLowerCase();

const unitSearchText = (unit: FlowGraphUnitDto): string =>
  [unit.name, unit.comment, unit.absolutePath]
    .filter((value): value is string => typeof value === "string")
    .join("\n")
    .toLowerCase();

const collectScopeUnits = (root: FlowGraphUnitDto): FlowGraphUnitDto[] => {
  const units: FlowGraphUnitDto[] = [root];
  for (const child of root.children) {
    units.push(...collectScopeUnits(child));
  }
  return units;
};

const collectMatchedScopeUnits = (
  scopeRoot: FlowGraphUnitDto,
  normalizedQuery: string,
): FlowGraphUnitDto[] =>
  collectScopeUnits(scopeRoot).filter((unit) =>
    unitSearchText(unit).includes(normalizedQuery),
  );

const selectFocusedMatchedUnit = (
  scopeRoot: FlowGraphUnitDto,
  matchedUnits: ReadonlyArray<FlowGraphUnitDto>,
): FlowGraphUnitDto | undefined =>
  matchedUnits.find((unit) => unit.id !== scopeRoot.id) ?? matchedUnits[0];

const resolveFlowSearchInput = (
  scopeRoot: FlowGraphUnitDto | undefined,
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
  scopeRoot: FlowGraphUnitDto;
  matchedUnit: FlowGraphUnitDto;
  matchedUnits: ReadonlyArray<FlowGraphUnitDto>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
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
  scopeRoot: FlowGraphUnitDto | undefined,
  query: string,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
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
