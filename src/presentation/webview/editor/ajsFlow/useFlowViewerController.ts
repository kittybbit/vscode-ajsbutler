import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Theme } from "@mui/material/styles";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import type {
  AjsDocument,
  AjsUnit,
} from "../../../../domain/models/ajs/AjsDocument";
import { flattenAjsUnits } from "../../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinitionByPath,
  type UnitDefinitionDialogDto,
} from "../../../../application/unit-definition/buildUnitDefinition";
import type {
  CurrentUnitIdStateType,
  DialogDataStateType,
} from "./flowViewerStateTypes";
import type { AjsNode } from "./nodes/AjsNode";
import { useFlowGraphState } from "./useFlowGraphState";
import {
  useFlowDocumentSubscription,
  useFlowScopeReset,
  useFlowViewerFitView,
  useFlowViewerOverflow,
  useRevealUnitSubscription,
} from "./useFlowViewerEffects";
import { useFlowSearchState } from "./useFlowSearchState";
import { useNestedExpansionState } from "./useNestedExpansionState";
import { buildFlowNodeDetail } from "./flowNodeDetail";
import { useSelectedFlowNodeState } from "./useSelectedFlowNodeState";
import { useHoveredFlowNodeState } from "./useHoveredFlowNodeState";
import { resolveFlowTreeSelectionTarget } from "./flowTreeSelection";
import type { FlowViewportFocusRequest } from "./flowViewportFocus";
import { applyHoveredUnitToFlowNodes } from "./flowGraphHover";
import { applyFlowRelationshipFocus } from "./flowRelationshipFocus";
import { useFlowFocusModeState } from "./useFlowFocusModeState";
import { useFlowMiniMapState } from "./useFlowMiniMapState";

type UseFlowViewerControllerParams = {
  theme: Theme;
};

const useFlowViewerRefs = () => {
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node, Edge> | null>(
    null,
  );
  const preserveSearchOnNextScopeChange = useRef<boolean>(false);
  const prevUnitEntityId = useRef<string | undefined>(undefined);

  return {
    preserveSearchOnNextScopeChange,
    prevUnitEntityId,
    reactFlowInstanceRef,
  };
};

const flattenDocumentUnits = (
  ajsDocument: AjsDocument | undefined,
): AjsUnit[] => (ajsDocument ? flattenAjsUnits(ajsDocument.rootUnits) : []);

const useUnitById = (ajsDocument: AjsDocument | undefined) => {
  const allUnits = useMemo(
    () => flattenDocumentUnits(ajsDocument),
    [ajsDocument],
  );
  return useMemo(
    () => new Map(allUnits.map((unit) => [unit.id, unit])),
    [allUnits],
  );
};

const useUnitDefinitionByPath = (ajsDocument: AjsDocument | undefined) =>
  useMemo(
    () =>
      ajsDocument
        ? buildUnitDefinitionByPath(ajsDocument)
        : new Map<string, UnitDefinitionDialogDto>(),
    [ajsDocument],
  );

const useCurrentUnit = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
) =>
  useMemo(
    () => (currentUnitId ? unitById.get(currentUnitId) : undefined),
    [currentUnitId, unitById],
  );

const useFlowDocumentState = (
  ajsDocument: AjsDocument | undefined,
  currentUnitId: string | undefined,
) => {
  const unitById = useUnitById(ajsDocument);
  const unitDefinitionByPath = useUnitDefinitionByPath(ajsDocument);
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

const mergeExpandedUnitIds = (
  currentUnitIds: string[],
  requiredUnitIds: readonly string[],
): string[] => {
  const mergedUnitIds = [...new Set([...currentUnitIds, ...requiredUnitIds])];
  return mergedUnitIds.length === currentUnitIds.length
    ? currentUnitIds
    : mergedUnitIds;
};

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

type FlowTreeSelectionStateParams = {
  currentUnit?: AjsUnit;
  selectUnit: (unitId: string) => void;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

const useFlowTreeSelectionState = ({
  currentUnit,
  selectUnit,
  setExpandedUnitIds,
  unitById,
}: FlowTreeSelectionStateParams) => {
  const [selectionFocusRequest, setSelectionFocusRequest] =
    useState<FlowViewportFocusRequest>({ version: 0 });
  const selectTreeUnit = useCallback(
    (unitId: string) => {
      const target = resolveFlowTreeSelectionTarget(
        unitId,
        currentUnit,
        unitById,
      );
      if (!target) {
        return;
      }
      setExpandedUnitIds((current) =>
        mergeExpandedUnitIds(current, target.expandedNestedUnitIds),
      );
      selectUnit(target.selectedUnitId);
      setSelectionFocusRequest((current) => ({
        targetUnitId: target.selectedUnitId,
        version: current.version + 1,
      }));
    },
    [currentUnit, selectUnit, setExpandedUnitIds, unitById],
  );

  return { selectTreeUnit, selectionFocusRequest };
};

type FocusedFlowDataParams = {
  edges: Edge[];
  focusModeEnabled: boolean;
  nodes: Node<AjsNode>[];
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
  nodes: Node<AjsNode>[];
  selectedUnitId?: string;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>;
  unitById: ReadonlyMap<string, AjsUnit>;
};

const useSelectedFlowNode = (
  nodes: Node<AjsNode>[],
  selectedUnitId: string | undefined,
) =>
  useMemo(
    () => nodes.find((node) => node.id === selectedUnitId),
    [nodes, selectedUnitId],
  );

const useOpenSelectedNodeDefinition = (
  selectedNode: Node<AjsNode> | undefined,
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>,
) =>
  useCallback(() => {
    if (selectedNode) {
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
  ajsDocument?: AjsDocument;
  currentUnitId?: string;
  edges: Edge[];
  expandedUnitIds: readonly string[];
  focusRequestVersion: number;
  handleRevealUnit: (absolutePath: string) => void;
  nodes: Node<AjsNode>[];
  preserveSearchOnNextScopeChange: ReturnType<
    typeof useFlowViewerRefs
  >["preserveSearchOnNextScopeChange"];
  prevUnitEntityId: ReturnType<typeof useFlowViewerRefs>["prevUnitEntityId"];
  reactFlowInstanceRef: ReturnType<
    typeof useFlowViewerRefs
  >["reactFlowInstanceRef"];
  resetSearch: () => void;
  searchedUnitId?: string;
  selectedUnitId?: string;
  selectionFocusRequest: FlowViewportFocusRequest;
  setAjsDocument: Dispatch<SetStateAction<AjsDocument | undefined>>;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
  setExpandedUnitIds: Dispatch<SetStateAction<string[]>>;
  theme: Theme;
};

const useFlowViewerLifecycle = ({
  ajsDocument,
  currentUnitId,
  edges,
  expandedUnitIds,
  focusRequestVersion,
  handleRevealUnit,
  nodes,
  preserveSearchOnNextScopeChange,
  prevUnitEntityId,
  reactFlowInstanceRef,
  resetSearch,
  searchedUnitId,
  selectedUnitId,
  selectionFocusRequest,
  setAjsDocument,
  setCurrentUnitId,
  setExpandedUnitIds,
  theme,
}: FlowViewerLifecycleParams) => {
  const layoutRequestIdentity = useMemo(
    () => ({}),
    [ajsDocument, currentUnitId, expandedUnitIds, theme],
  );
  useFlowViewerFitView({
    edges,
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    reactFlowInstanceRef,
    searchedUnitId,
    selectionFocusRequestVersion: selectionFocusRequest.version,
    selectionFocusTargetUnitId:
      selectionFocusRequest.targetUnitId === selectedUnitId
        ? selectionFocusRequest.targetUnitId
        : undefined,
  });
  useFlowScopeReset({
    ajsDocument,
    currentUnitId,
    preserveSearchOnNextScopeChange,
    resetSearch,
    setExpandedUnitIds,
  });
  useFlowDocumentSubscription({
    prevUnitEntityId,
    setAjsDocument,
    setCurrentUnitId,
  });
  useRevealUnitSubscription({ handleRevealUnit });
  useFlowViewerOverflow();
};

export const useFlowViewerController = ({
  theme,
}: UseFlowViewerControllerParams) => {
  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const {
    preserveSearchOnNextScopeChange,
    prevUnitEntityId,
    reactFlowInstanceRef,
  } = useFlowViewerRefs();
  const { dialogData, dialogDataState, setDialogData } = useFlowViewerUiState();
  const { currentUnit, unitById, unitDefinitionByPath } = useFlowDocumentState(
    ajsDocument,
    currentUnitId,
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
  const { clearSelection, selectedUnitId, selectUnit } =
    useSelectedFlowNodeState(ajsDocument, currentUnitId);
  const { canEnableFocusMode, focusModeEnabled, toggleFocusMode } =
    useFlowFocusModeState(ajsDocument, currentUnitId, selectedUnitId);
  const { showMiniMap, toggleMiniMap } = useFlowMiniMapState();
  const {
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    graphHoveredUnit,
    hoveredUnitId,
    treeHoveredUnit,
    treeHoveredUnitId,
  } = useHoveredFlowNodeState(ajsDocument, currentUnitId);
  const { selectTreeUnit, selectionFocusRequest } = useFlowTreeSelectionState({
    currentUnit,
    selectUnit,
    setExpandedUnitIds,
    unitById,
  });
  const {
    focusRequestVersion,
    handleRevealUnit,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    resetSearch,
    searchedUnitId,
    searchMatchedUnitIds,
    searchResultPosition,
  } = useFlowSearchState({
    currentUnit,
    preserveSearchOnNextScopeChange,
    setCurrentUnitId,
    setExpandedUnitIds,
    unitById,
  });
  const { edges, nodes } = useFlowGraphState({
    ajsDocument,
    currentUnitId,
    currentUnitIdState,
    dialogDataState,
    expandedUnitIds,
    nestedExpansionState,
    prevUnitEntityId,
    searchedUnitId,
    searchMatchedUnitIds,
    selectedUnitId,
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
    ajsDocument,
    currentUnitId,
    edges,
    expandedUnitIds,
    focusRequestVersion,
    handleRevealUnit,
    nodes,
    preserveSearchOnNextScopeChange,
    prevUnitEntityId,
    reactFlowInstanceRef,
    resetSearch,
    searchedUnitId,
    selectedUnitId,
    selectionFocusRequest,
    setAjsDocument,
    setCurrentUnitId,
    setExpandedUnitIds,
    theme,
  });

  return {
    ajsDocument,
    canEnableFocusMode,
    currentUnit,
    currentUnitIdState,
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    clearSelectedUnit: clearSelection,
    dialogData,
    edges: focusedFlowData.edges,
    expandableNestedUnitIds,
    focusModeEnabled,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    hoveredUnitId,
    graphHoveredUnit,
    nodes: renderedNodes,
    openSelectedNodeDefinition,
    openSelectedNodeScope,
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
    toggleFocusMode,
    toggleMiniMap,
    treeHoveredUnit,
    unitById,
  };
};
