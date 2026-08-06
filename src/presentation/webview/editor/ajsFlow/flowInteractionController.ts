import type { FlowNavigationTargetDto } from "../../../../application/navigation/resolveNavigationTarget";
import {
  mergeExpandedAncestorUnitIds,
  type FlowSearchResult,
} from "./flowSearch";
import {
  createEmptyFlowSearchState,
  createRevealedFlowSearchState,
  createSubmittedFlowSearchState,
  moveFlowSearchResult,
  type FlowSearchDirection,
  type FlowSearchState,
} from "./flowSearchState";

export type FlowInteractionState = {
  currentUnitId?: string;
  expandedUnitIds: string[];
  searchState: FlowSearchState;
  preserveSearchOnNextScopeChange: boolean;
};

export type FlowInteractionAction =
  | { type: "scopeChanged"; currentUnitId?: string }
  | { type: "scopeReset" }
  | { type: "expandedUnitIdsChanged"; expandedUnitIds: string[] }
  | { type: "searchCleared" }
  | {
      type: "searchNavigated";
      direction: FlowSearchDirection;
    }
  | {
      type: "searchSubmitted";
      query: string;
      result?: FlowSearchResult;
    }
  | { type: "externalReveal"; target: FlowNavigationTargetDto };

export const createInitialFlowInteractionState = (): FlowInteractionState => ({
  currentUnitId: undefined,
  expandedUnitIds: [],
  searchState: createEmptyFlowSearchState(),
  preserveSearchOnNextScopeChange: false,
});

const reduceSearchSubmission = (
  state: FlowInteractionState,
  query: string,
  result: FlowSearchResult | undefined,
): FlowInteractionState => ({
  ...state,
  expandedUnitIds: result
    ? mergeExpandedAncestorUnitIds(state.expandedUnitIds, result)
    : state.expandedUnitIds,
  searchState: result
    ? createSubmittedFlowSearchState(
        query,
        result,
        state.searchState.focusRequestVersion + 1,
      )
    : createSubmittedFlowSearchState(
        query,
        undefined,
        state.searchState.focusRequestVersion,
      ),
});

export const reduceFlowInteractionState = (
  state: FlowInteractionState,
  action: FlowInteractionAction,
): FlowInteractionState => {
  switch (action.type) {
    case "scopeChanged":
      return {
        ...state,
        currentUnitId: action.currentUnitId,
        preserveSearchOnNextScopeChange: false,
      };
    case "scopeReset":
      if (state.preserveSearchOnNextScopeChange) {
        return {
          ...state,
          preserveSearchOnNextScopeChange: false,
        };
      }
      return {
        ...state,
        expandedUnitIds: [],
        preserveSearchOnNextScopeChange: false,
        searchState: createEmptyFlowSearchState(
          state.searchState.focusRequestVersion,
        ),
      };
    case "expandedUnitIdsChanged":
      return {
        ...state,
        expandedUnitIds: action.expandedUnitIds,
      };
    case "searchCleared":
      return {
        ...state,
        searchState: createEmptyFlowSearchState(
          state.searchState.focusRequestVersion,
        ),
      };
    case "searchNavigated":
      return {
        ...state,
        searchState: moveFlowSearchResult(state.searchState, action.direction),
      };
    case "searchSubmitted":
      return reduceSearchSubmission(state, action.query, action.result);
    case "externalReveal": {
      const preserveSearchOnNextScopeChange =
        action.target.activeFlowScopeUnitId !== state.currentUnitId;
      return {
        ...state,
        currentUnitId: action.target.activeFlowScopeUnitId,
        expandedUnitIds: [...action.target.requiredExpandedAncestorUnitIds],
        preserveSearchOnNextScopeChange,
        searchState: createRevealedFlowSearchState(
          action.target.revealedUnitId,
          state.searchState.focusRequestVersion + 1,
        ),
      };
    }
  }
};
