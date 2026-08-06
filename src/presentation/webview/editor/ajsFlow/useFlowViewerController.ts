import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { Theme } from "@mui/material/styles";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import type {
  FlowGraphUnitDto,
  ValidatedFlowGraphDocument,
} from "../../../../application/flow-graph/flowGraphDocument";
import { type UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import type { NavigationRequestDto } from "../../../../application/navigation/resolveNavigationTarget";
import type {
  CurrentUnitIdStateType,
  DialogDataStateType,
} from "./flowViewerStateTypes";
import type { FlowNodeData } from "./flowNodePresentationModel";
import { useFlowGraphState } from "./useFlowGraphState";
import {
  useFlowDocumentSubscription,
  useFlowScopeReset,
  useFlowViewerFitView,
  useFlowViewerOverflow,
  useRevealUnitSubscription,
} from "./useFlowViewerEffects";
import { useFlowSearchState } from "./useFlowSearchState";
import {
  createInitialFlowInteractionState,
  reduceFlowInteractionState,
} from "./flowInteractionController";
import { useNestedExpansionState } from "./useNestedExpansionState";
import { buildFlowNodeDetail } from "./flowNodeDetail";
import { useHoveredFlowNodeState } from "./useHoveredFlowNodeState";
import {
  useFlowTreeSelectionState,
  type FlowTreeSelectionTarget,
} from "./flowTreeSelection";
import type { FlowViewportFocusRequest } from "./flowViewportFocus";
import { applyHoveredUnitToFlowNodes } from "./flowGraphHover";
import { applyFlowRelationshipFocus } from "./flowRelationshipFocus";
import { useFlowFocusModeState } from "./useFlowFocusModeState";
import { useFlowMiniMapState } from "./useFlowMiniMapState";

type UseFlowViewerControllerParams = {
  theme: Theme;
};

const emptyFlowUnitById: ReadonlyMap<string, FlowGraphUnitDto> = new Map();

const useFlowViewerRefs = () => {
  const reactFlowInstanceRef = useRef<ReactFlowInstance<
    Node<FlowNodeData>,
    Edge
  > | null>(null);
  const previousUnitIdRef = useRef<string | undefined>(undefined);

  return {
    previousUnitIdRef,
    reactFlowInstanceRef,
  };
};

const useCurrentUnit = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, FlowGraphUnitDto>,
) =>
  useMemo(
    () => (currentUnitId ? unitById.get(currentUnitId) : undefined),
    [currentUnitId, unitById],
  );

const useFlowDocumentState = (
  flowDocument: ValidatedFlowGraphDocument | undefined,
  currentUnitId: string | undefined,
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>,
) => {
  const unitById = flowDocument?.index.unitById ?? emptyFlowUnitById;
  const currentUnit = useCurrentUnit(currentUnitId, unitById);

  return {
    currentUnit,
    unitById,
    unitDefinitionByPath,
  };
};

const useCurrentUnitIdState = (
  currentUnitId: string | undefined,
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>,
) =>
  useMemo<CurrentUnitIdStateType>(
    () => ({
      currentUnitId,
      setCurrentUnitId,
    }),
    [currentUnitId, setCurrentUnitId],
  );

const useFlowViewerUiState = () => {
  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const dialogDataState = useMemo<DialogDataStateType>(
    () => ({
      dialogData,
      setDialogData,
    }),
    [dialogData],
  );

  return {
    dialogData,
    dialogDataState,
    setDialogData,
  };
};

type FocusedFlowDataParams = {
  edges: Edge[];
  focusModeEnabled: boolean;
  nodes: Node<FlowNodeData>[];
  selectedUnitId?: string;
  theme: Theme;
  treeHoveredUnitId?: string;
};

const useFocusedFlowData = ({
  edges,
  focusModeEnabled,
  nodes,
  selectedUnitId,
  theme,
  treeHoveredUnitId,
}: FocusedFlowDataParams) => {
  const focusedFlowData = useMemo(
    () =>
      applyFlowRelationshipFocus(nodes, edges, {
        colors: {
          both: theme.palette.warning.main,
          downstream: theme.palette.success.main,
          upstream: theme.palette.info.main,
        },
        enabled: focusModeEnabled,
        selectedUnitId,
      }),
    [edges, focusModeEnabled, nodes, selectedUnitId, theme],
  );
  const renderedNodes = useMemo(
    () => applyHoveredUnitToFlowNodes(focusedFlowData.nodes, treeHoveredUnitId),
    [focusedFlowData.nodes, treeHoveredUnitId],
  );

  return { focusedFlowData, renderedNodes };
};

type SelectedFlowNodeDetailStateParams = {
  edges: Edge[];
  nodes: Node<FlowNodeData>[];
  selectedUnitId?: string;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
};

const useSelectedFlowNode = (
  nodes: Node<FlowNodeData>[],
  selectedUnitId: string | undefined,
) =>
  useMemo(
    () => nodes.find((node) => node.id === selectedUnitId),
    [nodes, selectedUnitId],
  );

const useOpenSelectedNodeDefinition = (
  selectedNode: Node<FlowNodeData> | undefined,
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>,
) =>
  useCallback(() => {
    if (selectedNode?.data.unitDefinition) {
      setDialogData(selectedNode.data.unitDefinition);
    }
  }, [selectedNode, setDialogData]);

const useOpenSelectedNodeScope = (
  selectedNodeDetail: ReturnType<typeof buildFlowNodeDetail>,
  selectedUnitId: string | undefined,
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>,
) =>
  useCallback(() => {
    if (selectedUnitId && selectedNodeDetail?.canOpenAsScope) {
      setCurrentUnitId(selectedUnitId);
    }
  }, [selectedNodeDetail?.canOpenAsScope, selectedUnitId, setCurrentUnitId]);

const useSelectedFlowNodeDetailState = ({
  edges,
  nodes,
  selectedUnitId,
  setCurrentUnitId,
  setDialogData,
  unitById,
}: SelectedFlowNodeDetailStateParams) => {
  const selectedNode = useSelectedFlowNode(nodes, selectedUnitId);
  const selectedNodeDetail = useMemo(
    () => buildFlowNodeDetail(selectedNode, edges, unitById),
    [edges, selectedNode, unitById],
  );
  const openSelectedNodeDefinition = useOpenSelectedNodeDefinition(
    selectedNode,
    setDialogData,
  );
  const openSelectedNodeScope = useOpenSelectedNodeScope(
    selectedNodeDetail,
    selectedUnitId,
    setCurrentUnitId,
  );

  return {
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    selectedNodeDetail,
  };
};

type FlowViewerLifecycleParams = {
  flowDocument?: ValidatedFlowGraphDocument;
  currentUnitId?: string;
  edges: Edge[];
  expandedUnitIds: readonly string[];
  focusRequestVersion: number;
  handleRevealUnit: (request: NavigationRequestDto) => void;
  nodes: Node<FlowNodeData>[];
  preserveViewportRequestVersion: number;
  previousUnitIdRef: ReturnType<typeof useFlowViewerRefs>["previousUnitIdRef"];
  reactFlowInstanceRef: ReturnType<
    typeof useFlowViewerRefs
  >["reactFlowInstanceRef"];
  resetScope: () => void;
  searchedUnitId?: string;
  selectedUnitId?: string;
  selectionFocusRequest: FlowViewportFocusRequest;
  setFlowDocument: Dispatch<
    SetStateAction<ValidatedFlowGraphDocument | undefined>
  >;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setUnitDefinitionByPath: Dispatch<
    SetStateAction<ReadonlyMap<string, UnitDefinitionDialogDto>>
  >;
  theme: Theme;
};

const useFlowViewerLifecycle = ({
  flowDocument,
  currentUnitId,
  edges,
  expandedUnitIds,
  focusRequestVersion,
  handleRevealUnit,
  nodes,
  preserveViewportRequestVersion,
  previousUnitIdRef,
  reactFlowInstanceRef,
  resetScope,
  searchedUnitId,
  selectedUnitId,
  selectionFocusRequest,
  setFlowDocument,
  setCurrentUnitId,
  setUnitDefinitionByPath,
  theme,
}: FlowViewerLifecycleParams) => {
  const layoutRequestIdentity = useMemo(
    () => ({}),
    [flowDocument, currentUnitId, expandedUnitIds, theme],
  );
  useFlowViewerFitView({
    edges,
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    preserveViewportRequestVersion,
    reactFlowInstanceRef,
    searchedUnitId,
    selectionFocusRequestVersion: selectionFocusRequest.version,
    selectionFocusTargetUnitId:
      selectionFocusRequest.targetUnitId === selectedUnitId
        ? selectionFocusRequest.targetUnitId
        : undefined,
  });
  useFlowScopeReset({
    documentIdentity: flowDocument,
    currentUnitId,
    resetScope,
  });
  useFlowDocumentSubscription({
    previousUnitIdRef,
    setFlowDocument,
    setCurrentUnitId,
    setUnitDefinitionByPath,
  });
  useRevealUnitSubscription({ handleRevealUnit });
  useFlowViewerOverflow();
};

export const useFlowViewerController = ({
  theme,
}: UseFlowViewerControllerParams) => {
  const [flowDocument, setFlowDocument] =
    useState<ValidatedFlowGraphDocument>();
  const flowDocumentDto = flowDocument?.document;
  const [interactionState, dispatch] = useReducer(
    reduceFlowInteractionState,
    undefined,
    createInitialFlowInteractionState,
  );
  const { currentUnitId, expandedUnitIds } = interactionState;
  const setCurrentUnitId = useCallback(
    (next: SetStateAction<string | undefined>) => {
      dispatch({
        type: "scopeChanged",
        currentUnitId:
          typeof next === "function"
            ? next(interactionState.currentUnitId)
            : next,
      });
    },
    [interactionState.currentUnitId],
  );
  const setExpandedUnitIds = useCallback(
    (next: SetStateAction<string[]>) => {
      dispatch({
        type: "expandedUnitIdsChanged",
        expandedUnitIds:
          typeof next === "function"
            ? next(interactionState.expandedUnitIds)
            : next,
      });
    },
    [interactionState.expandedUnitIds],
  );
  const [
    keyboardExpansionPreserveViewportVersion,
    setKeyboardExpansionPreserveViewportVersion,
  ] = useState(0);
  const [documentUnitDefinitionByPath, setUnitDefinitionByPath] = useState<
    ReadonlyMap<string, UnitDefinitionDialogDto>
  >(new Map());
  const { previousUnitIdRef, reactFlowInstanceRef } = useFlowViewerRefs();
  const { dialogData, dialogDataState, setDialogData } = useFlowViewerUiState();
  const { currentUnit, unitById, unitDefinitionByPath } = useFlowDocumentState(
    flowDocument,
    currentUnitId,
    documentUnitDefinitionByPath,
  );

  const {
    expandableNestedUnitIds,
    hasExpandedAllNestedUnits,
    nestedExpansionState,
    toggleExpandAllNestedUnits,
  } = useNestedExpansionState({
    currentUnit,
    expandedUnitIds,
    setExpandedUnitIds,
    unitById,
  });

  const currentUnitIdState = useCurrentUnitIdState(
    currentUnitId,
    setCurrentUnitId,
  );
  const selectedUnitId = interactionState.selectedUnitId;
  const selectionFocusRequest = interactionState.selectionFocusRequest;
  const selectUnit = useCallback(
    (unitId: string) => dispatch({ type: "selectionChanged", unitId }),
    [],
  );
  const clearSelection = useCallback(
    () => dispatch({ type: "selectionCleared" }),
    [],
  );
  useEffect(() => {
    dispatch({ type: "contextChanged" });
  }, [dispatch, flowDocument]);
  const toggleExpandedFlowNodeFromKeyboard = useCallback(
    (unitId: string) => {
      selectUnit(unitId);
      setKeyboardExpansionPreserveViewportVersion((version) => version + 1);
      nestedExpansionState.toggleExpandedUnitId(unitId);
    },
    [nestedExpansionState, selectUnit],
  );
  const { canEnableFocusMode, focusModeEnabled, toggleFocusMode } =
    useFlowFocusModeState(flowDocument, currentUnitId, selectedUnitId);
  const { showMiniMap, toggleMiniMap } = useFlowMiniMapState();
  const {
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    graphHoveredUnit,
    hoveredUnitId,
    treeHoveredUnit,
    treeHoveredUnitId,
  } = useHoveredFlowNodeState(flowDocument, currentUnitId);
  const selectTreeTarget = useCallback(
    (target: FlowTreeSelectionTarget) =>
      dispatch({
        type: "treeSelectionChanged",
        expandedNestedUnitIds: target.expandedNestedUnitIds,
        selectedUnitId: target.selectedUnitId,
      }),
    [],
  );
  const { selectTreeUnit } = useFlowTreeSelectionState({
    currentUnit,
    onSelectTarget: selectTreeTarget,
    unitById,
  });
  const {
    focusRequestVersion,
    handleRevealUnit,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    resetScope,
    searchedUnitId,
    searchMatchedUnitIds,
    searchResultPosition,
  } = useFlowSearchState({
    currentUnit,
    flowDocument,
    interactionState,
    dispatch,
    unitById,
  });
  const requestGraphFocus = useCallback(
    (
      targetUnitId: string | undefined,
      options: {
        expectedScopeUnitId?: string;
        selectTarget?: boolean;
      } = {},
    ) => {
      dispatch({ type: "graphFocusRequested", targetUnitId, ...options });
    },
    [],
  );
  const requestScopeTransition = useCallback(
    (targetScopeUnitId: string, focusUnitId: string) => {
      dispatch({
        type: "scopeTransitionRequested",
        focusUnitId,
        targetScopeUnitId,
      });
    },
    [],
  );
  const changeScope = useCallback(
    (targetScopeUnitId: string) =>
      dispatch({ type: "scopeChanged", currentUnitId: targetScopeUnitId }),
    [],
  );
  const requestDetailFocus = useCallback(
    (unitId: string) => dispatch({ type: "detailFocusRequested", unitId }),
    [],
  );
  const handleDetailFocusRequestHandled = useCallback(
    (revision: number) => dispatch({ type: "detailFocusHandled", revision }),
    [],
  );
  const requestSelectorFocus = useCallback(
    (targetUnitId: string | undefined, savedGraphFocusUnitId?: string) =>
      dispatch({
        type: "selectorFocusRequested",
        savedGraphFocusUnitId,
        targetUnitId,
      }),
    [],
  );
  const handleSelectorEscape = useCallback(
    () => dispatch({ type: "selectorEscape" }),
    [],
  );
  const returnFromDetail = useCallback(
    (unitId: string) => requestGraphFocus(unitId),
    [requestGraphFocus],
  );
  const closeDetail = useCallback(
    (unitId: string) => {
      clearSelection();
      requestGraphFocus(unitId);
    },
    [clearSelection, requestGraphFocus],
  );
  const { edges, nodes } = useFlowGraphState({
    flowDocument,
    currentUnitId,
    currentUnitIdState,
    dialogDataState,
    expandedUnitIds,
    nestedExpansionState,
    previousUnitIdRef,
    searchedUnitId,
    searchMatchedUnitIds,
    theme,
    unitById,
    unitDefinitionByPath,
  });
  const { focusedFlowData, renderedNodes } = useFocusedFlowData({
    edges,
    focusModeEnabled,
    nodes,
    selectedUnitId,
    theme,
    treeHoveredUnitId,
  });
  const {
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    selectedNodeDetail,
  } = useSelectedFlowNodeDetailState({
    edges,
    nodes,
    selectedUnitId,
    setCurrentUnitId,
    setDialogData,
    unitById,
  });
  useFlowViewerLifecycle({
    flowDocument,
    currentUnitId,
    edges,
    expandedUnitIds,
    focusRequestVersion,
    handleRevealUnit,
    nodes,
    preserveViewportRequestVersion: keyboardExpansionPreserveViewportVersion,
    previousUnitIdRef,
    reactFlowInstanceRef,
    resetScope,
    searchedUnitId,
    selectedUnitId,
    selectionFocusRequest,
    setFlowDocument,
    setCurrentUnitId,
    setUnitDefinitionByPath,
    theme,
  });

  return {
    flowDocumentDto,
    canEnableFocusMode,
    currentUnit,
    currentUnitIdState,
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    clearSelectedUnit: clearSelection,
    changeScope,
    closeDetail,
    dialogData,
    edges: focusedFlowData.edges,
    expandableNestedUnitIds,
    focusGraphRequest: interactionState.graphFocusRequest,
    focusSelectorRequest: interactionState.selectorFocusRequest,
    focusModeEnabled,
    detailFocusRequestRevision: interactionState.detailFocusRequestRevision,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    hoveredUnitId,
    graphHoveredUnit,
    nodes: renderedNodes,
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    handleDetailFocusRequestHandled,
    handleSelectorEscape,
    requestDetailFocus,
    requestGraphFocus,
    requestScopeTransition,
    requestSelectorFocus,
    reactFlowInstanceRef,
    searchedUnitId,
    searchResultPosition,
    selectedUnitId,
    selectedNodeDetail,
    showMiniMap,
    selectFlowNode: selectUnit,
    selectTreeUnit,
    setDialogData,
    toggleExpandAllNestedUnits,
    toggleExpandedFlowNodeFromKeyboard,
    toggleFocusMode,
    toggleMiniMap,
    treeHoveredUnit,
    unitById,
    returnFromDetail,
  };
};
