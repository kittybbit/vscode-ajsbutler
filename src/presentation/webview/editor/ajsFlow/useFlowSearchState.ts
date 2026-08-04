import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
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
  mergeExpandedAncestorUnitIds,
  resolveFlowSearchSubmission,
  type FlowSearchResult,
  type FlowSearchSubmission,
} from "./flowSearch";
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

type FlowSearchStateSetters = Pick<
  SearchSubmitHandlerParams,
  "setExpandedUnitIds" | "setSearchState"
>;

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
  { setExpandedUnitIds, setSearchState }: FlowSearchStateSetters,
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
            setExpandedUnitIds,
            setSearchState,
          },
        );
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
      applyFlowSearchSubmission(submission, {
        setExpandedUnitIds,
        setSearchState,
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
    setSearchState((prev) =>
      createEmptyFlowSearchState(prev.focusRequestVersion),
    );
  }, []);

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
      postViewerSearchEvent({
        action: "navigated",
        query,
        resultCount: searchState.matchedUnitIds.length,
        durationMs: 0,
        scope: "current_flow_scope",
        surface: "flow",
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
