import { useCallback, useRef, useState } from "react";
import type { Row } from "@tanstack/table-core";
import type { TableRowView } from "./tableViewerData";
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
  rows: ReadonlyArray<Row<TableRowView>>;
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
  const searchStateRef = useRef(searchState);
  searchStateRef.current = searchState;

  const resetSearch = useCallback(() => {
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

      const isNewSearch = !isActiveTableSearchQuery(
        searchStateRef.current,
        query,
      );
      const matchedAbsolutePaths = findTableSearchMatchingAbsolutePaths(
        rows,
        parameterSearchValuesByPath,
        query,
      );
      if (isNewSearch) postViewerSearchEvent("table");
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
