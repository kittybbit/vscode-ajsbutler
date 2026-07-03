import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
import { createSearchEvent } from "../../../../shared/webviewEvents";
import { FlowRevealTarget, resolveFlowRevealTarget } from "../revealUnit";
import { findFlowSearchResult, FlowSearchResult } from "./flowSearch";
import {
  createEmptyFlowSearchState,
  createRevealedFlowSearchState,
  createSubmittedFlowSearchState,
  getFlowSearchResultPosition,
  isActiveFlowSearchQuery,
  moveFlowSearchResult,
} from "./flowSearchState";
import type { FlowSearchDirection, FlowSearchState } from "./flowSearchState";

type UseFlowSearchStateParams = {
  currentUnit?: AjsUnit;
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

const mergeExpandedAncestorUnitIds = (
  expandedUnitIds: readonly string[],
  result: FlowSearchResult,
): string[] => [
  ...new Set([...expandedUnitIds, ...result.expandedAncestorUnitIds]),
];

type SearchSubmitHandlerParams = {
  currentUnit?: AjsUnit;
  searchState: FlowSearchState;
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

type RevealTargetApplyParams = {
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
};

type RevealUnitHandlerParams = RevealTargetApplyParams & {
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

type FlowSearchResultApplyParams = {
  query: string;
  result: FlowSearchResult;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>;
};

type FlowSearchSubmitContext = Pick<
  SearchSubmitHandlerParams,
  | "currentUnit"
  | "searchState"
  | "setExpandedUnitIds"
  | "setSearchState"
  | "unitById"
>;

type FlowSearchSubmission =
  | { kind: "current" }
  | { kind: "empty"; query: string }
  | { kind: "matched"; query: string; result: FlowSearchResult };

const applyFlowSearchResult = ({
  query,
  result,
  setExpandedUnitIds,
  setSearchState,
}: FlowSearchResultApplyParams) => {
  setExpandedUnitIds((prev) => mergeExpandedAncestorUnitIds(prev, result));
  setSearchState((prev) =>
    createSubmittedFlowSearchState(query, result, prev.focusRequestVersion + 1),
  );
};

const resolveFlowSearchSubmission = (
  query: string,
  { currentUnit, searchState, unitById }: FlowSearchSubmitContext,
): FlowSearchSubmission => {
  if (isActiveFlowSearchQuery(searchState, query)) {
    return { kind: "current" };
  }

  const result = findFlowSearchResult(currentUnit, query, unitById);
  return result ? { kind: "matched", query, result } : { kind: "empty", query };
};

const applyEmptyFlowSearchResult = (
  query: string,
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>,
) => {
  setSearchState((prev) =>
    createSubmittedFlowSearchState(query, undefined, prev.focusRequestVersion),
  );
};

const applyFlowSearchSubmission = (
  submission: FlowSearchSubmission,
  { setExpandedUnitIds, setSearchState }: FlowSearchSubmitContext,
) => {
  if (submission.kind === "matched") {
    applyFlowSearchResult({
      query: submission.query,
      result: submission.result,
      setExpandedUnitIds,
      setSearchState,
    });
  }
  if (submission.kind === "empty") {
    applyEmptyFlowSearchResult(submission.query, setSearchState);
  }
};

const postFlowSearchEvent = ({
  action,
  query,
  resultCount,
  durationMs,
}: {
  action: "submitted" | "navigated" | "cleared";
  query: string;
  resultCount: number;
  durationMs?: number;
}) => {
  window.vscode.postMessage(
    createSearchEvent({
      surface: "flow",
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
      scope: "current_flow_scope",
    }),
  );
};

const applyFlowRevealTarget = (
  revealTarget: FlowRevealTarget,
  {
    setSearchState,
    setCurrentUnitId,
    setExpandedUnitIds,
  }: RevealTargetApplyParams,
) => {
  setExpandedUnitIds(revealTarget.expandedAncestorUnitIds);
  setCurrentUnitId(revealTarget.scopeUnitId);
  setSearchState((prev) =>
    createRevealedFlowSearchState(
      revealTarget.revealedUnitId,
      prev.focusRequestVersion + 1,
    ),
  );
};

const useSearchSubmitHandler = ({
  currentUnit,
  searchState,
  setSearchState,
  setExpandedUnitIds,
  unitById,
}: SearchSubmitHandlerParams) =>
  useCallback(
    (query: string) => {
      if (query.trim().length === 0) {
        applyFlowSearchSubmission(
          { kind: "empty", query },
          {
            currentUnit,
            searchState,
            setExpandedUnitIds,
            setSearchState,
            unitById,
          },
        );
        return;
      }

      const startedAt = performance.now();
      const submission = resolveFlowSearchSubmission(query, {
        currentUnit,
        searchState,
        setExpandedUnitIds,
        setSearchState,
        unitById,
      });
      if (submission.kind === "current") {
        return;
      }
      postFlowSearchEvent({
        action: "submitted",
        query,
        resultCount:
          submission.kind === "matched"
            ? submission.result.matchedUnitIds.length
            : 0,
        durationMs: performance.now() - startedAt,
      });
      applyFlowSearchSubmission(submission, {
        currentUnit,
        searchState,
        setExpandedUnitIds,
        setSearchState,
        unitById,
      });
    },
    [currentUnit, searchState, setSearchState, setExpandedUnitIds, unitById],
  );

const useRevealUnitHandler = ({
  preserveSearchOnNextScopeChange,
  setSearchState,
  setCurrentUnitId,
  setExpandedUnitIds,
  unitById,
}: RevealUnitHandlerParams) =>
  useCallback(
    (absolutePath: string) => {
      const revealTarget = resolveFlowRevealTarget(unitById, absolutePath);
      if (!revealTarget) {
        return;
      }
      preserveSearchOnNextScopeChange.current = true;
      applyFlowRevealTarget(revealTarget, {
        setSearchState,
        setCurrentUnitId,
        setExpandedUnitIds,
      });
    },
    [
      preserveSearchOnNextScopeChange,
      setSearchState,
      setCurrentUnitId,
      setExpandedUnitIds,
      unitById,
    ],
  );

export const useFlowSearchState = ({
  currentUnit,
  preserveSearchOnNextScopeChange,
  setCurrentUnitId,
  setExpandedUnitIds,
  unitById,
}: UseFlowSearchStateParams) => {
  const [searchState, setSearchState] = useState<FlowSearchState>(
    createEmptyFlowSearchState,
  );

  const resetSearch = useCallback(() => {
    if (searchState.query !== undefined) {
      postFlowSearchEvent({
        action: "cleared",
        query: searchState.query,
        resultCount: searchState.matchedUnitIds.length,
      });
    }
    setSearchState((prev) =>
      createEmptyFlowSearchState(prev.focusRequestVersion),
    );
  }, [searchState.matchedUnitIds.length, searchState.query]);

  const handleSearchSubmit = useSearchSubmitHandler({
    currentUnit,
    searchState,
    setSearchState,
    setExpandedUnitIds,
    unitById,
  });
  const handleRevealUnit = useRevealUnitHandler({
    preserveSearchOnNextScopeChange,
    setSearchState,
    setCurrentUnitId,
    setExpandedUnitIds,
    unitById,
  });
  const handleSearchNavigate = useCallback(
    (query: string, direction: FlowSearchDirection) => {
      if (!isActiveFlowSearchQuery(searchState, query)) {
        handleSearchSubmit(query);
        return;
      }
      postFlowSearchEvent({
        action: "navigated",
        query,
        resultCount: searchState.matchedUnitIds.length,
        durationMs: 0,
      });
      setSearchState((prev) => moveFlowSearchResult(prev, direction));
    },
    [handleSearchSubmit, searchState],
  );

  return {
    focusRequestVersion: searchState.focusRequestVersion,
    handleRevealUnit,
    handleSearchClear: resetSearch,
    handleSearchNavigate,
    handleSearchSubmit,
    resetSearch,
    searchedUnitId: searchState.searchedUnitId,
    searchMatchedUnitIds: searchState.matchedUnitIds,
    searchResultPosition: getFlowSearchResultPosition(searchState),
  };
};
