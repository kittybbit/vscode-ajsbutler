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
import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../../../../application/flow-graph/flowGraphDocument";
import {
  resolveFlowNavigationTarget,
  type FlowNavigationTargetDto,
  type NavigationRequestDto,
} from "../../../../application/navigation/resolveNavigationTarget";
import { createViewerSearchRequest } from "../../viewerRequestMessages";
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
  currentUnit?: FlowGraphUnitDto;
  flowDocument?: ValidatedFlowGraphDocument;
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

const mergeExpandedAncestorUnitIds = (
  expandedUnitIds: readonly string[],
  result: FlowSearchResult,
): string[] => [
  ...new Set([...expandedUnitIds, ...result.expandedAncestorUnitIds]),
];

type SearchSubmitHandlerParams = {
  currentUnit?: FlowGraphUnitDto;
  searchState: FlowSearchState;
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

type RevealTargetApplyParams = {
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
};

type RevealUnitHandlerParams = RevealTargetApplyParams & {
  flowDocument?: ValidatedFlowGraphDocument;
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>;
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
    createViewerSearchRequest({
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
  revealTarget: FlowNavigationTargetDto,
  {
    setSearchState,
    setCurrentUnitId,
    setExpandedUnitIds,
  }: RevealTargetApplyParams,
) => {
  setExpandedUnitIds(revealTarget.requiredExpandedAncestorUnitIds);
  setCurrentUnitId(revealTarget.activeFlowScopeUnitId);
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
  flowDocument,
  preserveSearchOnNextScopeChange,
  setSearchState,
  setCurrentUnitId,
  setExpandedUnitIds,
}: RevealUnitHandlerParams) =>
  useCallback(
    (request: NavigationRequestDto) => {
      if (!flowDocument) return;
      const result = resolveFlowNavigationTarget(flowDocument, request);
      if (result.status === "unavailable") {
        return;
      }
      preserveSearchOnNextScopeChange.current = true;
      applyFlowRevealTarget(result.target, {
        setSearchState,
        setCurrentUnitId,
        setExpandedUnitIds,
      });
    },
    [
      preserveSearchOnNextScopeChange,
      flowDocument,
      setSearchState,
      setCurrentUnitId,
      setExpandedUnitIds,
    ],
  );

export const useFlowSearchState = ({
  currentUnit,
  flowDocument,
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
    flowDocument,
    preserveSearchOnNextScopeChange,
    setSearchState,
    setCurrentUnitId,
    setExpandedUnitIds,
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
