import { useCallback, useRef, useState } from "react";
import type { Row } from "@tanstack/table-core";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { postViewerSearchEvent } from "../shared/viewerSearchTelemetry";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import {
  createEmptyTableSearchState,
  createSubmittedTableSearchState,
  findTableSearchMatchingAbsolutePaths,
  isActiveTableSearchQuery,
  moveTableSearchResult,
  TableSearchDirection,
  TableSearchState,
} from "./tableSearchState";

export type TableSearchController = {
  searchQuery: string;
  searchState: TableSearchState;
  navigateSearch: (query: string, direction: TableSearchDirection) => void;
  submitSearch: (query: string) => void;
  resetSearch: VoidFunction;
};

type TableSearchControllerContext = {
  rows: ReadonlyArray<Row<UnitListRowView>>;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  revealPath: (absolutePath: string) => void;
};

const revealSearchedPath = (
  state: TableSearchState,
  revealPath: (absolutePath: string) => void,
): void => {
  if (state.searchedAbsolutePath) {
    revealPath(state.searchedAbsolutePath);
  }
};

export const useTableSearchController = ({
  rows,
  parameterSearchValuesByPath,
  revealPath,
}: TableSearchControllerContext): TableSearchController => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<TableSearchState>(
    createEmptyTableSearchState,
  );
  const searchQueryRef = useRef(searchQuery);
  const searchStateRef = useRef(searchState);
  searchQueryRef.current = searchQuery;
  searchStateRef.current = searchState;

  const resetSearch = useCallback(() => {
    const currentSearchState = searchStateRef.current;
    if (currentSearchState.query !== undefined) {
      postViewerSearchEvent({
        action: "cleared",
        query: searchQueryRef.current,
        resultCount: currentSearchState.matchedAbsolutePaths.length,
        scope: "visible_rows",
        surface: "table",
      });
    }
    setSearchQuery("");
    setSearchState(createEmptyTableSearchState());
  }, []);

  const submitSearch = useCallback(
    (query: string) => {
      if (query.trim().length === 0) {
        setSearchQuery(query);
        setSearchState(createEmptyTableSearchState());
        return;
      }

      const startedAt = performance.now();
      const matchedAbsolutePaths = findTableSearchMatchingAbsolutePaths(
        rows,
        parameterSearchValuesByPath,
        query,
      );
      postViewerSearchEvent({
        action: "submitted",
        query,
        resultCount: matchedAbsolutePaths.length,
        durationMs: performance.now() - startedAt,
        scope: "visible_rows",
        surface: "table",
      });
      const nextState = createSubmittedTableSearchState(
        query,
        matchedAbsolutePaths,
      );
      setSearchQuery(query);
      setSearchState(nextState);
      revealSearchedPath(nextState, revealPath);
    },
    [parameterSearchValuesByPath, revealPath, rows],
  );

  const navigateSearch = useCallback(
    (query: string, direction: TableSearchDirection) => {
      if (!isActiveTableSearchQuery(searchState, query)) {
        submitSearch(query);
        return;
      }
      const nextState = moveTableSearchResult(searchState, direction);
      postViewerSearchEvent({
        action: "navigated",
        query,
        resultCount: nextState.matchedAbsolutePaths.length,
        durationMs: 0,
        scope: "visible_rows",
        surface: "table",
      });
      setSearchState(nextState);
      revealSearchedPath(nextState, revealPath);
    },
    [revealPath, searchState, submitSearch],
  );

  return {
    searchQuery,
    searchState,
    navigateSearch,
    submitSearch,
    resetSearch,
  };
};
