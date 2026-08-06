import { Dispatch, useCallback, useRef } from "react";
import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../../../../application/flow-graph/flowGraphDocument";
import {
  resolveFlowNavigationTarget,
  type FlowNavigationTargetDto,
  type NavigationRequestDto,
} from "../../../../application/navigation/resolveNavigationTarget";
import { postViewerSearchEvent } from "../shared/viewerSearchTelemetry";
import {
  resolveFlowSearchSubmission,
  type FlowSearchSubmission,
} from "./flowSearch";
import type {
  FlowInteractionAction,
  FlowInteractionState,
} from "./flowInteractionController";
import {
  getFlowSearchResultPosition,
  isActiveFlowSearchQuery,
} from "./flowSearchState";
import type { FlowSearchDirection, FlowSearchState } from "./flowSearchState";

type UseFlowSearchStateParams = {
  currentUnit?: FlowGraphUnitDto;
  flowDocument?: ValidatedFlowGraphDocument;
  interactionState: FlowInteractionState;
  dispatch: Dispatch<FlowInteractionAction>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

type SearchSubmitHandlerParams = {
  currentUnit?: FlowGraphUnitDto;
  dispatch: Dispatch<FlowInteractionAction>;
  searchState: FlowSearchState;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

const applyFlowSearchSubmission = (
  submission: FlowSearchSubmission,
  dispatch: Dispatch<FlowInteractionAction>,
) => {
  if (submission.kind === "matched") {
    dispatch({
      type: "searchSubmitted",
      query: submission.query,
      result: submission.result,
    });
    return;
  }
  if (submission.kind === "empty") {
    dispatch({ type: "searchSubmitted", query: submission.query });
  }
};

const useSearchSubmitHandler = ({
  currentUnit,
  dispatch,
  searchState,
  unitById,
}: SearchSubmitHandlerParams) =>
  useCallback(
    (query: string) => {
      if (query.trim().length === 0) {
        dispatch({ type: "searchSubmitted", query });
        return;
      }

      const startedAt = performance.now();
      const submission = resolveFlowSearchSubmission({
        currentUnit,
        query,
        searchState,
        unitById,
      });
      if (submission.kind === "current") {
        return;
      }
      postViewerSearchEvent({
        action: "submitted",
        query,
        resultCount:
          submission.kind === "matched"
            ? submission.result.matchedUnitIds.length
            : 0,
        durationMs: performance.now() - startedAt,
        scope: "current_flow_scope",
        surface: "flow",
      });
      applyFlowSearchSubmission(submission, dispatch);
    },
    [currentUnit, dispatch, searchState, unitById],
  );

const applyFlowRevealTarget = (
  revealTarget: FlowNavigationTargetDto,
  dispatch: Dispatch<FlowInteractionAction>,
) => {
  dispatch({ type: "externalReveal", target: revealTarget });
};

const useRevealUnitHandler = ({
  dispatch,
  flowDocument,
}: Pick<UseFlowSearchStateParams, "dispatch" | "flowDocument">) =>
  useCallback(
    (request: NavigationRequestDto) => {
      if (!flowDocument) return;
      const result = resolveFlowNavigationTarget(flowDocument, request);
      if (result.status === "unavailable") {
        return;
      }
      applyFlowRevealTarget(result.target, dispatch);
    },
    [dispatch, flowDocument],
  );

export const useFlowSearchState = ({
  currentUnit,
  flowDocument,
  interactionState,
  dispatch,
  unitById,
}: UseFlowSearchStateParams) => {
  const { searchState } = interactionState;
  const searchStateRef = useRef(searchState);
  searchStateRef.current = searchState;

  const resetSearch = useCallback(() => {
    const currentSearchState = searchStateRef.current;
    if (currentSearchState.query !== undefined) {
      postViewerSearchEvent({
        action: "cleared",
        query: currentSearchState.query,
        resultCount: currentSearchState.matchedUnitIds.length,
        scope: "current_flow_scope",
        surface: "flow",
      });
    }
    dispatch({ type: "searchCleared" });
  }, [dispatch]);

  const resetScope = useCallback(() => {
    const currentSearchState = searchStateRef.current;
    if (
      !interactionState.preserveSearchOnNextScopeChange &&
      currentSearchState.query !== undefined
    ) {
      postViewerSearchEvent({
        action: "cleared",
        query: currentSearchState.query,
        resultCount: currentSearchState.matchedUnitIds.length,
        scope: "current_flow_scope",
        surface: "flow",
      });
    }
    dispatch({ type: "scopeReset" });
  }, [dispatch, interactionState.preserveSearchOnNextScopeChange]);

  const handleSearchSubmit = useSearchSubmitHandler({
    currentUnit,
    dispatch,
    searchState,
    unitById,
  });
  const handleRevealUnit = useRevealUnitHandler({ dispatch, flowDocument });
  const handleSearchNavigate = useCallback(
    (query: string, direction: FlowSearchDirection) => {
      if (!isActiveFlowSearchQuery(searchState, query)) {
        handleSearchSubmit(query);
        return;
      }
      postViewerSearchEvent({
        action: "navigated",
        query,
        resultCount: searchState.matchedUnitIds.length,
        durationMs: 0,
        scope: "current_flow_scope",
        surface: "flow",
      });
      dispatch({ type: "searchNavigated", direction });
    },
    [dispatch, handleSearchSubmit, searchState],
  );

  return {
    focusRequestVersion: searchState.focusRequestVersion,
    handleRevealUnit,
    handleSearchClear: resetSearch,
    handleSearchNavigate,
    handleSearchSubmit,
    resetSearch,
    resetScope,
    searchedUnitId: searchState.searchedUnitId,
    searchMatchedUnitIds: searchState.matchedUnitIds,
    searchResultPosition: getFlowSearchResultPosition(searchState),
  };
};
