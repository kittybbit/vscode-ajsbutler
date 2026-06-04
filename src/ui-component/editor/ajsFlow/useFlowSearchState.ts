import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import { FlowRevealTarget, resolveFlowRevealTarget } from "../revealUnit";
import { findFlowSearchResult, FlowSearchResult } from "./flowSearch";

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

type SearchStateSetters = {
  setSearchMatchedUnitIds: Dispatch<SetStateAction<string[]>>;
  setSearchedUnitId: Dispatch<SetStateAction<string | undefined>>;
};

type SearchSubmitHandlerParams = {
  currentUnit?: AjsUnit;
  resetSearch: () => void;
  searchStateSetters: SearchStateSetters;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

type RevealTargetApplyParams = {
  searchStateSetters: SearchStateSetters;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
};

type RevealUnitHandlerParams = RevealTargetApplyParams & {
  preserveSearchOnNextScopeChange: MutableRefObject<boolean>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

const clearSearchState = ({
  setSearchMatchedUnitIds,
  setSearchedUnitId,
}: SearchStateSetters) => {
  setSearchedUnitId(undefined);
  setSearchMatchedUnitIds([]);
};

const applyFlowSearchResult = (
  result: FlowSearchResult,
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>,
  searchStateSetters: SearchStateSetters,
) => {
  setExpandedUnitIds((prev) => mergeExpandedAncestorUnitIds(prev, result));
  searchStateSetters.setSearchMatchedUnitIds(result.matchedUnitIds);
  searchStateSetters.setSearchedUnitId(result.matchedUnitId);
};

const applyFlowRevealTarget = (
  revealTarget: FlowRevealTarget,
  {
    searchStateSetters,
    setCurrentUnitId,
    setExpandedUnitIds,
  }: RevealTargetApplyParams,
) => {
  setExpandedUnitIds(revealTarget.expandedAncestorUnitIds);
  setCurrentUnitId(revealTarget.scopeUnitId);
  searchStateSetters.setSearchMatchedUnitIds([revealTarget.revealedUnitId]);
  searchStateSetters.setSearchedUnitId(revealTarget.revealedUnitId);
};

const useSearchSubmitHandler = ({
  currentUnit,
  resetSearch,
  searchStateSetters,
  setExpandedUnitIds,
  unitById,
}: SearchSubmitHandlerParams) =>
  useCallback(
    (query: string) => {
      const result = findFlowSearchResult(currentUnit, query, unitById);
      if (!result) {
        resetSearch();
        return;
      }

      applyFlowSearchResult(result, setExpandedUnitIds, searchStateSetters);
    },
    [
      currentUnit,
      resetSearch,
      searchStateSetters,
      setExpandedUnitIds,
      unitById,
    ],
  );

const useRevealUnitHandler = ({
  preserveSearchOnNextScopeChange,
  searchStateSetters,
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
        searchStateSetters,
        setCurrentUnitId,
        setExpandedUnitIds,
      });
    },
    [
      preserveSearchOnNextScopeChange,
      searchStateSetters,
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
  const [searchedUnitId, setSearchedUnitId] = useState<string>();
  const [searchMatchedUnitIds, setSearchMatchedUnitIds] = useState<string[]>(
    [],
  );
  const searchStateSetters = useMemo(
    () => ({
      setSearchMatchedUnitIds,
      setSearchedUnitId,
    }),
    [],
  );

  const resetSearch = useCallback(() => {
    clearSearchState(searchStateSetters);
  }, [searchStateSetters]);

  const handleSearchSubmit = useSearchSubmitHandler({
    currentUnit,
    resetSearch,
    searchStateSetters,
    setExpandedUnitIds,
    unitById,
  });
  const handleRevealUnit = useRevealUnitHandler({
    preserveSearchOnNextScopeChange,
    searchStateSetters,
    setCurrentUnitId,
    setExpandedUnitIds,
    unitById,
  });

  return {
    handleRevealUnit,
    handleSearchClear: resetSearch,
    handleSearchSubmit,
    resetSearch,
    searchedUnitId,
    searchMatchedUnitIds,
  };
};
