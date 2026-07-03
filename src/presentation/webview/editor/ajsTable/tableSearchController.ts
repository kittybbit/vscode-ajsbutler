import { useCallback, useState } from "react";
import type { Row } from "@tanstack/table-core";
import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { createSearchEvent } from "../../../../shared/webviewEvents";
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

const postTableSearchEvent = ({
  action,
  query,
  resultCount,
  durationMs,
}: {
  action: "submitted" | "navigated" | "cleared";
  query: string;
  resultCount: number;
  durationMs?: number;
}): void => {
  window.vscode.postMessage(
    createSearchEvent({
      surface: "table",
      action,
      result:
        action === "cleared"
          ? "cleared"
          : resultCount > 0
            ? "matched"
            : "no_match",
      mode: "partial",
      queryLengthBucket: toCountBucket(query.trim().length),
      resultCountBucket: toCountBucket(resultCount),
      durationBucket:
        durationMs === undefined ? undefined : toDurationBucket(durationMs),
      scope: "visible_rows",
    }),
  );
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

  const resetSearch = useCallback(() => {
    if (searchState.query !== undefined) {
      postTableSearchEvent({
        action: "cleared",
        query: searchQuery,
        resultCount: searchState.matchedAbsolutePaths.length,
      });
    }
    setSearchQuery("");
    setSearchState(createEmptyTableSearchState());
  }, [searchQuery, searchState.matchedAbsolutePaths.length, searchState.query]);

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
      postTableSearchEvent({
        action: "submitted",
        query,
        resultCount: matchedAbsolutePaths.length,
        durationMs: performance.now() - startedAt,
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
      postTableSearchEvent({
        action: "navigated",
        query,
        resultCount: nextState.matchedAbsolutePaths.length,
        durationMs: 0,
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
