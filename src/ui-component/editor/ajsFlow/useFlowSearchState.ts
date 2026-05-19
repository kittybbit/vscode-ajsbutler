import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import { resolveFlowRevealTarget } from "../revealUnit";
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

  const resetSearch = useCallback(() => {
    setSearchedUnitId(undefined);
    setSearchMatchedUnitIds([]);
  }, []);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      const result = findFlowSearchResult(currentUnit, query, unitById);
      if (!result) {
        resetSearch();
        return;
      }

      setExpandedUnitIds((prev) => mergeExpandedAncestorUnitIds(prev, result));
      setSearchMatchedUnitIds(result.matchedUnitIds);
      setSearchedUnitId(result.matchedUnitId);
    },
    [currentUnit, resetSearch, setExpandedUnitIds, unitById],
  );

  const handleRevealUnit = useCallback(
    (absolutePath: string) => {
      const revealTarget = resolveFlowRevealTarget(unitById, absolutePath);
      if (!revealTarget) {
        return;
      }
      preserveSearchOnNextScopeChange.current = true;
      setExpandedUnitIds(revealTarget.expandedAncestorUnitIds);
      setCurrentUnitId(revealTarget.scopeUnitId);
      setSearchMatchedUnitIds([revealTarget.revealedUnitId]);
      setSearchedUnitId(revealTarget.revealedUnitId);
    },
    [
      preserveSearchOnNextScopeChange,
      setCurrentUnitId,
      setExpandedUnitIds,
      unitById,
    ],
  );

  return {
    handleRevealUnit,
    handleSearchClear: resetSearch,
    handleSearchSubmit,
    resetSearch,
    searchedUnitId,
    searchMatchedUnitIds,
  };
};
