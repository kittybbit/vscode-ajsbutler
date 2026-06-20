import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";
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

const applyFlowSearchResult = (
  query: string,
  result: FlowSearchResult,
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>,
  setSearchState: Dispatch<SetStateAction<FlowSearchState>>,
) => {
  setExpandedUnitIds((prev) => mergeExpandedAncestorUnitIds(prev, result));
  setSearchState((prev) =>
    createSubmittedFlowSearchState(query, result, prev.focusRequestVersion + 1),
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
      if (isActiveFlowSearchQuery(searchState, query)) {
        return;
      }
      const result = findFlowSearchResult(currentUnit, query, unitById);
      if (!result) {
        setSearchState((prev) =>
          createSubmittedFlowSearchState(
            query,
            undefined,
            prev.focusRequestVersion,
          ),
        );
        return;
      }

      applyFlowSearchResult(query, result, setExpandedUnitIds, setSearchState);
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
