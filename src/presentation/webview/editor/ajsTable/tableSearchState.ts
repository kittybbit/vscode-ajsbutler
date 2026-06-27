import { Row } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { AccessorType } from "./columnDefs/common";
import {
  getAjsTableSearchValues,
  ParameterSearchValuesByPath,
  rankSearchValues,
} from "./globalFilter";

export type TableSearchDirection = "next" | "previous";

export type TableSearchState = {
  query?: string;
  matchedAbsolutePaths: string[];
  searchedAbsolutePath?: string;
};

export type TableSearchResultPosition = {
  current: number;
  total: number;
};

export const createEmptyTableSearchState = (): TableSearchState => ({
  matchedAbsolutePaths: [],
});

export const normalizeTableSearchQuery = (query: string): string =>
  query.trim().toLowerCase();

export const isActiveTableSearchQuery = (
  state: TableSearchState,
  query: string,
): boolean =>
  state.query !== undefined && state.query === normalizeTableSearchQuery(query);

export const createSubmittedTableSearchState = (
  query: string,
  matchedAbsolutePaths: readonly string[],
): TableSearchState => {
  const normalizedQuery = normalizeTableSearchQuery(query);
  return normalizedQuery.length === 0
    ? createEmptyTableSearchState()
    : {
        query: normalizedQuery,
        matchedAbsolutePaths: [...matchedAbsolutePaths],
        searchedAbsolutePath: matchedAbsolutePaths[0],
      };
};

const getCurrentResultIndex = (state: TableSearchState): number =>
  state.searchedAbsolutePath
    ? state.matchedAbsolutePaths.indexOf(state.searchedAbsolutePath)
    : -1;

const wrapResultIndex = (
  currentIndex: number,
  resultCount: number,
  direction: TableSearchDirection,
): number => {
  const offset = direction === "next" ? 1 : -1;
  return (currentIndex + offset + resultCount) % resultCount;
};

export const moveTableSearchResult = (
  state: TableSearchState,
  direction: TableSearchDirection,
): TableSearchState => {
  if (state.matchedAbsolutePaths.length === 0) {
    return state;
  }

  const currentIndex = getCurrentResultIndex(state);
  const startIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = wrapResultIndex(
    startIndex,
    state.matchedAbsolutePaths.length,
    direction,
  );
  return {
    ...state,
    searchedAbsolutePath: state.matchedAbsolutePaths[nextIndex],
  };
};

export const getTableSearchResultPosition = (
  state: TableSearchState,
): TableSearchResultPosition | undefined => {
  if (state.query === undefined) {
    return undefined;
  }
  const resultIndex = getCurrentResultIndex(state);
  return {
    current: resultIndex >= 0 ? resultIndex + 1 : 0,
    total: state.matchedAbsolutePaths.length,
  };
};

export const doesTableRowMatchSearch = (
  row: Row<UnitListRowView>,
  parameterSearchValuesByPath: ParameterSearchValuesByPath,
  query: string,
): boolean => {
  if (query.trim().length === 0) {
    return false;
  }
  if (rankSearchValues([row.original.absolutePath], query)) {
    return true;
  }
  const parameters =
    parameterSearchValuesByPath.get(row.original.absolutePath) ?? [];
  return row
    .getVisibleCells()
    .some((cell) =>
      rankSearchValues(
        getAjsTableSearchValues(
          cell.getValue<AccessorType | undefined>(),
          parameters,
        ),
        query,
      ),
    );
};

export const findTableSearchMatchingAbsolutePaths = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
  parameterSearchValuesByPath: ParameterSearchValuesByPath,
  query: string,
): string[] =>
  rows
    .filter((row) =>
      doesTableRowMatchSearch(row, parameterSearchValuesByPath, query),
    )
    .map((row) => row.original.absolutePath);
