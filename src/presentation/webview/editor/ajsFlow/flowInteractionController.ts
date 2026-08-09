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
import type {
  FlowGraphFocusRequest,
  FlowViewportFocusRequest,
} from "./flowViewportFocus";
import type { UnitTreeFocusRequest } from "../shared/UnitTreeSelector";

export type FlowInteractionState = {
  currentUnitId?: string;
  expandedUnitIds: string[];
  searchState: FlowSearchState;
  preserveSearchOnNextScopeChange: boolean;
  selectedUnitId?: string;
  graphFocusRequest: FlowGraphFocusRequest;
  detailFocusRequestRevision: number;
  selectorFocusRequest: UnitTreeFocusRequest;
  savedGraphFocusUnitId?: string;
  selectionFocusRequest: FlowViewportFocusRequest;
};

export type FlowInteractionAction =
  | { type: "scopeChanged"; currentUnitId?: string }
  | { type: "scopeReset" }
  | {
      type: "scopeTransitionRequested";
      targetScopeUnitId: string;
      focusUnitId: string;
    }
  | { type: "expandedUnitIdsChanged"; expandedUnitIds: string[] }
  | { type: "selectionChanged"; unitId: string }
  | { type: "keyboardNavigationRequested"; unitId: string }
  | { type: "selectionCleared" }
  | { type: "contextChanged" }
  | {
      type: "treeSelectionChanged";
      selectedUnitId: string;
      expandedNestedUnitIds: string[];
    }
  | {
      type: "graphFocusRequested";
      targetUnitId?: string;
      expectedScopeUnitId?: string;
      selectTarget?: boolean;
    }
  | { type: "detailFocusRequested"; unitId: string }
  | { type: "detailFocusHandled"; revision: number }
  | {
      type: "selectorFocusRequested";
      targetUnitId?: string;
      savedGraphFocusUnitId?: string;
    }
  | { type: "selectorEscape" }
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
  graphFocusRequest: { revision: 0 },
  detailFocusRequestRevision: 0,
  selectorFocusRequest: { revision: 0 },
  selectionFocusRequest: { version: 0 },
});

const nextGraphFocusRequest = (
  state: FlowInteractionState,
  request: Omit<FlowGraphFocusRequest, "revision">,
): FlowInteractionState => ({
  ...state,
  graphFocusRequest: {
    ...request,
    revision: state.graphFocusRequest.revision + 1,
  },
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

const mergeExpandedUnitIds = (
  currentUnitIds: readonly string[],
  requiredUnitIds: readonly string[],
): string[] => [...new Set([...currentUnitIds, ...requiredUnitIds])];

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
        selectedUnitId:
          action.currentUnitId === state.currentUnitId
            ? state.selectedUnitId
            : undefined,
      };
    case "scopeTransitionRequested":
      return nextGraphFocusRequest(
        {
          ...state,
          currentUnitId: action.targetScopeUnitId,
          preserveSearchOnNextScopeChange: false,
          selectedUnitId: undefined,
        },
        {
          expectedScopeUnitId: action.targetScopeUnitId,
          selectTarget: true,
          targetUnitId: action.focusUnitId,
        },
      );
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
    case "selectionChanged":
      return { ...state, selectedUnitId: action.unitId };
    case "keyboardNavigationRequested":
      return {
        ...state,
        selectedUnitId: action.unitId,
        selectionFocusRequest: {
          targetUnitId: action.unitId,
          version: state.selectionFocusRequest.version + 1,
        },
      };
    case "selectionCleared":
      return { ...state, selectedUnitId: undefined };
    case "contextChanged":
      return { ...state, selectedUnitId: undefined };
    case "treeSelectionChanged":
      return {
        ...state,
        expandedUnitIds: mergeExpandedUnitIds(
          state.expandedUnitIds,
          action.expandedNestedUnitIds,
        ),
        selectedUnitId: action.selectedUnitId,
        selectionFocusRequest: {
          targetUnitId: action.selectedUnitId,
          version: state.selectionFocusRequest.version + 1,
        },
      };
    case "graphFocusRequested":
      return nextGraphFocusRequest(state, {
        expectedScopeUnitId: action.expectedScopeUnitId,
        selectTarget: action.selectTarget,
        targetUnitId: action.targetUnitId,
      });
    case "detailFocusRequested":
      return {
        ...state,
        detailFocusRequestRevision: state.detailFocusRequestRevision + 1,
        savedGraphFocusUnitId: action.unitId,
        selectedUnitId: action.unitId,
      };
    case "detailFocusHandled":
      return {
        ...state,
        detailFocusRequestRevision:
          state.detailFocusRequestRevision === action.revision
            ? 0
            : state.detailFocusRequestRevision,
      };
    case "selectorFocusRequested":
      return {
        ...state,
        savedGraphFocusUnitId: action.savedGraphFocusUnitId,
        selectorFocusRequest: {
          revision: state.selectorFocusRequest.revision + 1,
          targetUnitId: action.targetUnitId,
        },
      };
    case "selectorEscape":
      return nextGraphFocusRequest(state, {
        targetUnitId: state.savedGraphFocusUnitId,
      });
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
        selectedUnitId:
          action.target.activeFlowScopeUnitId === state.currentUnitId
            ? state.selectedUnitId
            : undefined,
        searchState: createRevealedFlowSearchState(
          action.target.revealedUnitId,
          state.searchState.focusRequestVersion + 1,
        ),
      };
    }
  }
};
