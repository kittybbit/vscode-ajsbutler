import type { FlowSearchResult } from "./flowSearch";

export type FlowSearchDirection = "next" | "previous";

export type FlowSearchState = {
  query?: string;
  matchedUnitIds: string[];
  searchedUnitId?: string;
  focusRequestVersion: number;
};

export type FlowSearchResultPosition = {
  current: number;
  total: number;
};

export const createEmptyFlowSearchState = (
  focusRequestVersion = 0,
): FlowSearchState => ({
  matchedUnitIds: [],
  focusRequestVersion,
});

export const normalizeFlowSearchQuery = (query: string): string =>
  query.trim().toLowerCase();

export const isActiveFlowSearchQuery = (
  state: FlowSearchState,
  query: string,
): boolean =>
  state.query !== undefined && state.query === normalizeFlowSearchQuery(query);

const copyFlowSearchMatchedUnitIds = (
  result: FlowSearchResult | undefined,
): string[] => [...(result?.matchedUnitIds ?? [])];

const createMatchedFlowSearchState = (
  normalizedQuery: string,
  result: FlowSearchResult | undefined,
  focusRequestVersion: number,
): FlowSearchState => ({
  query: normalizedQuery,
  matchedUnitIds: copyFlowSearchMatchedUnitIds(result),
  searchedUnitId: result?.matchedUnitId,
  focusRequestVersion,
});

export const createSubmittedFlowSearchState = (
  query: string,
  result: FlowSearchResult | undefined,
  focusRequestVersion: number,
): FlowSearchState => {
  const normalizedQuery = normalizeFlowSearchQuery(query);
  if (normalizedQuery.length === 0) {
    return createEmptyFlowSearchState(focusRequestVersion);
  }
  return createMatchedFlowSearchState(
    normalizedQuery,
    result,
    focusRequestVersion,
  );
};

export const createRevealedFlowSearchState = (
  revealedUnitId: string,
  focusRequestVersion: number,
): FlowSearchState => ({
  matchedUnitIds: [revealedUnitId],
  searchedUnitId: revealedUnitId,
  focusRequestVersion,
});

const getCurrentResultIndex = (state: FlowSearchState): number =>
  state.searchedUnitId
    ? state.matchedUnitIds.indexOf(state.searchedUnitId)
    : -1;

const wrapResultIndex = (
  currentIndex: number,
  resultCount: number,
  direction: FlowSearchDirection,
): number => {
  const offset = direction === "next" ? 1 : -1;
  return (currentIndex + offset + resultCount) % resultCount;
};

export const moveFlowSearchResult = (
  state: FlowSearchState,
  direction: FlowSearchDirection,
): FlowSearchState => {
  if (state.matchedUnitIds.length === 0) {
    return state;
  }

  const currentIndex = getCurrentResultIndex(state);
  const startIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = wrapResultIndex(
    startIndex,
    state.matchedUnitIds.length,
    direction,
  );
  return {
    ...state,
    searchedUnitId: state.matchedUnitIds[nextIndex],
    focusRequestVersion: state.focusRequestVersion + 1,
  };
};

export const getFlowSearchResultPosition = (
  state: FlowSearchState,
): FlowSearchResultPosition | undefined => {
  if (state.query === undefined) {
    return undefined;
  }
  const resultIndex = getCurrentResultIndex(state);
  return {
    current: resultIndex >= 0 ? resultIndex + 1 : 0,
    total: state.matchedUnitIds.length,
  };
};
