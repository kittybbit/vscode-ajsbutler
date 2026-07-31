import React, {
  FC,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme, type Theme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  NodeTypes,
  ReactFlow,
  type ReactFlowInstance,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import UnitDefinitionDialog from "../UnitDefinitionDialog";
import { createViewerOperationRequest } from "../../viewerRequestMessages";
import JobNode from "./nodes/JobNode";
import JobNetNode from "./nodes/JobNetNode";
import JobGroupNode from "./nodes/JobGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import Header from "./Header";
import FlowSelector from "./FlowSelector";
import FlowNodeDetailPanel from "./FlowNodeDetailPanel";
import { useFlowViewerController } from "./useFlowViewerController";
import type { UnitTreeFocusRequest } from "../shared/UnitTreeSelector";
import { navigateToTable } from "./nodes/Utils";
import {
  type FlowMiniMapColors,
  resolveFlowMiniMapNodeFill,
  resolveFlowMiniMapNodeStroke,
} from "./flowMiniMap";
import type { AjsNode } from "./nodes/AjsNode";
import {
  focusRenderedFlowNode,
  getOwnedFlowNodeId,
  readOnlyFlowInteractionProps,
  resolveFlowKeyboardFocusTarget,
  resolveFlowKeyboardScopeFocusDecision,
  resolveFlowKeyboardNavigationKeyResult,
  resolveFlowKeyboardNavigationIndexCache,
  resolveFlowKeyboardNodeGeometry,
  type FlowKeyboardNavigationIndexCache,
} from "./flowKeyboardNavigation";
import {
  resolveFlowGraphFocusRequest,
  resolveFlowNodeCenter,
  type FlowGraphFocusRequest,
} from "./flowViewportFocus";
import { resolveFlowViewerShortcut } from "./flowViewerShortcuts";
import { resolveFlowSelectorFocusTarget } from "./FlowSelector";

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };
const minimumViewportZoom = 0.02;

const nodeTypes: NodeTypes = {
  job: JobNode,
  jobnet: JobNetNode,
  jobgroup: JobGroupNode,
  condition: ConditionNode,
};

type FlowViewerController = ReturnType<typeof useFlowViewerController>;

type FlowGraphPanelProps = Pick<
  FlowViewerController,
  | "clearGraphHoveredUnit"
  | "currentUnitIdState"
  | "edges"
  | "graphHoveredUnit"
  | "nodes"
  | "reactFlowInstanceRef"
  | "selectFlowNode"
  | "showMiniMap"
  | "toggleExpandedFlowNodeFromKeyboard"
  | "unitById"
> & {
  focusRequest: FlowGraphFocusRequest;
  miniMapColors: FlowMiniMapColors;
  onFocusDetail: (unitId: string) => void;
  onFocusSelector: (unitId?: string) => void;
  theme: Theme;
};

type FlowGraphSelectionSyncProps = Pick<
  FlowViewerController,
  "nodes" | "reactFlowInstanceRef" | "selectedUnitId"
>;

const useSyncSelectedFlowNode = ({
  nodes,
  reactFlowInstanceRef,
  selectedUnitId,
}: FlowGraphSelectionSyncProps): void => {
  const previousSelectedUnitIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const instance = reactFlowInstanceRef.current;
    if (!instance) return;

    const syncSelectedNode = (
      unitId: string | undefined,
      isSelected: boolean,
    ) => {
      if (!unitId) return;
      const node = instance.getNode(unitId);
      if (!node) return;
      if (Boolean(node.selected) !== isSelected) {
        instance.updateNode(unitId, { selected: isSelected });
      }
      if (Boolean(node.data.isSelected) !== isSelected) {
        instance.updateNodeData(unitId, { isSelected });
      }
    };

    syncSelectedNode(previousSelectedUnitIdRef.current, false);
    syncSelectedNode(selectedUnitId, true);
    previousSelectedUnitIdRef.current = selectedUnitId;
  }, [nodes, reactFlowInstanceRef, selectedUnitId]);
};

const FlowGraphPanelComponent: FC<FlowGraphPanelProps> = ({
  clearGraphHoveredUnit,
  currentUnitIdState,
  edges,
  focusRequest,
  graphHoveredUnit,
  miniMapColors,
  nodes,
  onFocusDetail,
  onFocusSelector,
  reactFlowInstanceRef,
  selectFlowNode,
  showMiniMap,
  theme,
  toggleExpandedFlowNodeFromKeyboard,
  unitById,
}) => {
  const graphEntryRef = useRef<HTMLDivElement>(null);
  const navigationIndexCacheRef =
    useRef<FlowKeyboardNavigationIndexCache>(undefined);
  const handledFocusRequestRevisionRef = useRef(0);
  const pendingFocusRequestRef = useRef<
    | {
        fallbackToGraphEntry: boolean;
        expectedCurrentUnitId?: string;
        expectedExpanded?: boolean;
        selectTarget?: boolean;
        sourceScopeUnitId?: string;
        sourceNodes: readonly Node<AjsNode>[];
        targetUnitId: string;
      }
    | undefined
  >(undefined);
  const navigationNodes = nodes.flatMap((node) => {
    const unit = unitById.get(node.id);
    const geometry = resolveFlowKeyboardNodeGeometry(node);
    return node.data.unitId === node.id && unit && geometry
      ? [
          {
            id: node.id,
            parentId: unit.parentId,
            ...geometry,
            canExpandNested: Boolean(node.data.canExpandNested),
            isExpandedNested: Boolean(node.data.isExpandedNested),
          },
        ]
      : [];
  });
  const scopeUnitById = useMemo(
    () =>
      new Map(
        [...unitById].map(([id, unit]) => [
          id,
          {
            id,
            parentId: unit.parentId,
            unitType: unit.unitType,
            childCount: unit.children.length,
          },
        ]),
      ),
    [unitById],
  );
  navigationIndexCacheRef.current = resolveFlowKeyboardNavigationIndexCache(
    navigationIndexCacheRef.current,
    navigationNodes,
  );
  const navigationIndex = navigationIndexCacheRef.current.index;

  useEffect(() => {
    const request = pendingFocusRequestRef.current;
    if (!request) return;
    const renderedUnitIds = new Set(
      nodes.flatMap((node) => (node.data.unitId === node.id ? [node.id] : [])),
    );
    const target = request.expectedCurrentUnitId
      ? resolveFlowKeyboardScopeFocusDecision({
          currentScopeUnitId: currentUnitIdState.currentUnitId,
          expectedScopeUnitId: request.expectedCurrentUnitId,
          renderedUnitIds,
          sourceNodesChanged: request.sourceNodes !== nodes,
          sourceScopeUnitId: request.sourceScopeUnitId,
          targetUnitId: request.targetUnitId,
        })
      : request.sourceNodes === nodes
        ? { kind: "wait" as const }
        : resolveFlowKeyboardFocusTarget(renderedUnitIds, request.targetUnitId);
    if (target.kind === "wait") return;
    if (target.kind === "cancel") {
      pendingFocusRequestRef.current = undefined;
      return;
    }
    const targetNode = nodes.find(
      (node) => node.data.unitId === request.targetUnitId,
    );
    if (
      request.expectedExpanded !== undefined &&
      targetNode &&
      Boolean(targetNode.data.isExpandedNested) !== request.expectedExpanded
    ) {
      return;
    }
    const focused =
      target.kind === "node" &&
      focusRenderedFlowNode(
        graphEntryRef.current,
        target.targetUnitId,
        CSS.escape,
      );
    if (focused && request.selectTarget) {
      selectFlowNode(request.targetUnitId);
    }
    if (!focused && request.fallbackToGraphEntry) {
      graphEntryRef.current?.focus({ preventScroll: true });
    }
    pendingFocusRequestRef.current = undefined;
  }, [currentUnitIdState, nodes, selectFlowNode]);

  useEffect(() => {
    if (focusRequest.revision <= handledFocusRequestRevisionRef.current) {
      return;
    }
    const renderedUnitIds = new Set(
      nodes.flatMap((node) => (node.data.unitId === node.id ? [node.id] : [])),
    );
    const decision = resolveFlowGraphFocusRequest(
      focusRequest,
      currentUnitIdState.currentUnitId,
      renderedUnitIds,
    );
    if (decision.kind === "wait") return;
    if (decision.kind === "node") {
      const focused = focusRenderedFlowNode(
        graphEntryRef.current,
        decision.targetUnitId,
        CSS.escape,
      );
      if (!focused) return;
      if (focusRequest.selectTarget) {
        selectFlowNode(decision.targetUnitId);
      }
    } else {
      graphEntryRef.current?.focus({ preventScroll: true });
    }
    handledFocusRequestRevisionRef.current = focusRequest.revision;
  }, [currentUnitIdState, focusRequest, nodes, selectFlowNode]);

  const revealFlowNode = useCallback(
    (unitId: string) => {
      const instance = reactFlowInstanceRef.current;
      if (!instance) return;
      const center = resolveFlowNodeCenter(instance.getNodesBounds([unitId]));
      void instance.setCenter(center.x, center.y, {
        duration: 250,
        zoom: instance.getZoom(),
      });
    },
    [reactFlowInstanceRef],
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<AjsNode>) => selectFlowNode(node.id),
    [selectFlowNode],
  );
  const handleNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node<AjsNode>) =>
      graphHoveredUnit(node.id),
    [graphHoveredUnit],
  );
  const handleNodeMouseLeave = useCallback(
    (_event: React.MouseEvent, node: Node<AjsNode>) =>
      clearGraphHoveredUnit(node.id),
    [clearGraphHoveredUnit],
  );
  const handleReactFlowInit = useCallback(
    (instance: ReactFlowInstance<Node<AjsNode>, Edge>) => {
      reactFlowInstanceRef.current = instance;
    },
    [reactFlowInstanceRef],
  );

  const handleFlowNodeKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const currentUnitId = getOwnedFlowNodeId(event.target);
      const shortcut = resolveFlowViewerShortcut({
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        key: event.key,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      });
      if (shortcut === "detail" && currentUnitId) {
        event.preventDefault();
        event.stopPropagation();
        onFocusDetail(currentUnitId);
        return;
      }
      if (
        shortcut === "selector" &&
        (currentUnitId || event.target === event.currentTarget)
      ) {
        event.preventDefault();
        event.stopPropagation();
        onFocusSelector(currentUnitId);
        return;
      }
      if (!currentUnitId) return;
      const result = resolveFlowKeyboardNavigationKeyResult(navigationIndex, {
        currentUnitId,
        currentScopeUnitId: currentUnitIdState.currentUnitId,
        key: event.key,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        scopeUnitById,
        shiftKey: event.shiftKey,
      });
      if (!result.suppressDefault) return;
      event.preventDefault();
      event.stopPropagation();
      const action = result.action;
      if (!action) return;
      if (action.kind === "navigate") {
        revealFlowNode(action.targetUnitId);
        selectFlowNode(action.targetUnitId);
        focusRenderedFlowNode(
          graphEntryRef.current,
          action.targetUnitId,
          CSS.escape,
        );
        return;
      }
      if (action.kind === "enter-scope" || action.kind === "return-scope") {
        pendingFocusRequestRef.current = {
          expectedCurrentUnitId: action.targetScopeId,
          fallbackToGraphEntry: true,
          selectTarget: true,
          sourceScopeUnitId: currentUnitIdState.currentUnitId,
          sourceNodes: nodes,
          targetUnitId: action.focusUnitId,
        };
        currentUnitIdState.setCurrentUnitId(action.targetScopeId);
        return;
      }
      pendingFocusRequestRef.current = {
        expectedExpanded: action.kind === "expand",
        fallbackToGraphEntry: true,
        sourceNodes: nodes,
        targetUnitId: action.targetUnitId,
      };
      toggleExpandedFlowNodeFromKeyboard(action.targetUnitId);
    },
    [
      navigationIndex,
      nodes,
      onFocusDetail,
      onFocusSelector,
      revealFlowNode,
      selectFlowNode,
      currentUnitIdState,
      scopeUnitById,
      toggleExpandedFlowNodeFromKeyboard,
    ],
  );

  return (
    <Paper
      ref={graphEntryRef}
      role="region"
      aria-label="Flow graph"
      tabIndex={0}
      onKeyDownCapture={handleFlowNodeKeyDown}
      variant="outlined"
      sx={{
        flex: 1,
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        defaultViewport={defaultViewport}
        colorMode={theme.palette.mode}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onInit={handleReactFlowInit}
        {...readOnlyFlowInteractionProps}
        fitView
        minZoom={minimumViewportZoom}
        fitViewOptions={{
          padding: 0.22,
          minZoom: minimumViewportZoom,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={theme.palette.divider}
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: theme.shadows[3],
          }}
        />
        {showMiniMap && (
          <MiniMap<Node<AjsNode>>
            className="ajs-flow-minimap"
            ariaLabel="Flow graph MiniMap"
            pannable
            zoomable
            position="bottom-right"
            nodeColor={(node) =>
              resolveFlowMiniMapNodeFill(node, miniMapColors)
            }
            nodeStrokeColor={(node) =>
              resolveFlowMiniMapNodeStroke(node, miniMapColors)
            }
            nodeStrokeWidth={3}
            bgColor={theme.palette.background.paper}
            maskColor={`${theme.palette.background.default}66`}
            maskStrokeColor="transparent"
            maskStrokeWidth={0}
            style={{
              borderRadius: 12,
              overflow: "hidden",
              opacity: 1,
              boxShadow: theme.shadows[3],
            }}
          />
        )}
      </ReactFlow>
    </Paper>
  );
};

FlowGraphPanelComponent.displayName = "FlowGraphPanel";
const FlowGraphPanel = memo(FlowGraphPanelComponent);

type FlowViewerBodyProps = FlowViewerController & {
  detailFocusRequestRevision: number;
  focusGraphRequest: FlowGraphFocusRequest;
  focusSelectorRequest: UnitTreeFocusRequest;
  miniMapColors: FlowMiniMapColors;
  onCloseDetail: (unitId: string) => void;
  onDetailFocusRequestHandled: (revision: number) => void;
  onFocusDetail: (unitId: string) => void;
  onFocusSelector: (unitId?: string) => void;
  onOpenFlowScope: (unitId: string) => void;
  onReturnFromDetail: (unitId: string) => void;
  onSelectorEscape: VoidFunction;
  openSelectedNodeUnitList: () => void;
  theme: Theme;
};

const FlowViewerBody: FC<FlowViewerBodyProps> = ({
  flowDocumentDto,
  clearGraphHoveredUnit,
  clearTreeHoveredUnit,
  dialogData,
  detailFocusRequestRevision,
  edges,
  focusGraphRequest,
  focusSelectorRequest,
  focusModeEnabled,
  graphHoveredUnit,
  hoveredUnitId,
  miniMapColors,
  nodes,
  onCloseDetail,
  onDetailFocusRequestHandled,
  onFocusDetail,
  onFocusSelector,
  onOpenFlowScope,
  onReturnFromDetail,
  onSelectorEscape,
  openSelectedNodeDefinition,
  openSelectedNodeScope,
  openSelectedNodeUnitList,
  reactFlowInstanceRef,
  selectedNodeDetail,
  selectedUnitId,
  selectFlowNode,
  selectTreeUnit,
  setDialogData,
  showMiniMap,
  theme,
  toggleExpandedFlowNodeFromKeyboard,
  toggleFocusMode,
  treeHoveredUnit,
  unitById,
  currentUnitIdState,
}) => {
  useSyncSelectedFlowNode({ nodes, reactFlowInstanceRef, selectedUnitId });

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        padding: 1.25,
        background: (theme) =>
          `radial-gradient(circle at top left, ${theme.palette.primary.light}12, transparent 28%), linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <FlowSelector
          rootUnits={flowDocumentDto?.rootUnits ?? []}
          unitById={unitById}
          currentUnitIdState={currentUnitIdState}
          focusRequest={focusSelectorRequest}
          hoveredUnitId={hoveredUnitId}
          selectedUnitId={selectedUnitId}
          onHoverUnit={treeHoveredUnit}
          onLeaveUnit={clearTreeHoveredUnit}
          onEscape={onSelectorEscape}
          onOpenScope={onOpenFlowScope}
          onSelectUnit={selectTreeUnit}
        />
        <FlowGraphPanel
          clearGraphHoveredUnit={clearGraphHoveredUnit}
          currentUnitIdState={currentUnitIdState}
          edges={edges}
          focusRequest={focusGraphRequest}
          graphHoveredUnit={graphHoveredUnit}
          miniMapColors={miniMapColors}
          nodes={nodes}
          onFocusDetail={onFocusDetail}
          onFocusSelector={onFocusSelector}
          reactFlowInstanceRef={reactFlowInstanceRef}
          selectFlowNode={selectFlowNode}
          showMiniMap={showMiniMap}
          theme={theme}
          toggleExpandedFlowNodeFromKeyboard={
            toggleExpandedFlowNodeFromKeyboard
          }
          unitById={unitById}
        />
        {selectedNodeDetail && (
          <FlowNodeDetailPanel
            detail={selectedNodeDetail}
            onClose={() => onCloseDetail(selectedNodeDetail.unitId)}
            onOpenDefinition={openSelectedNodeDefinition}
            onOpenScope={openSelectedNodeScope}
            onOpenUnitList={openSelectedNodeUnitList}
            onReturnFocus={() => onReturnFromDetail(selectedNodeDetail.unitId)}
            focusRequestRevision={detailFocusRequestRevision}
            onFocusRequestHandled={onDetailFocusRequestHandled}
            focusModeEnabled={focusModeEnabled}
            onToggleFocusMode={toggleFocusMode}
          />
        )}
      </Stack>
      {dialogData && (
        <UnitDefinitionDialog
          dialogData={dialogData}
          onClose={() => setDialogData(undefined)}
        />
      )}
    </Box>
  );
};

const useFlowTheme = (): Theme => {
  const { isDarkMode } = useMyAppContext();
  return useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );
};

const useSelectedNodeUnitListAction = (
  selectedNodeDetail: FlowViewerController["selectedNodeDetail"],
) =>
  useMemo(
    () =>
      selectedNodeDetail
        ? () => navigateToTable(selectedNodeDetail.absolutePath)
        : () => undefined,
    [selectedNodeDetail],
  );

const useFlowMiniMapColors = (theme: Theme): FlowMiniMapColors =>
  useMemo(
    () => ({
      both: theme.palette.warning.main,
      changed: theme.palette.info.main,
      confirmationRequired: theme.palette.warning.main,
      currentSearchResult: theme.palette.success.dark,
      downstream: theme.palette.success.main,
      hidden: "transparent",
      normal: theme.palette.action.disabled,
      searchMatch: theme.palette.success.light,
      selected: theme.palette.secondary.main,
      selectedFocus: theme.palette.primary.main,
      unrelated: theme.palette.action.disabledBackground,
      upstream: theme.palette.info.main,
    }),
    [theme],
  );

const reportFlowOperation = (
  operation: Parameters<typeof createViewerOperationRequest>[0],
): void => {
  window.vscode.postMessage(createViewerOperationRequest(operation));
};

const FlowContents: FC = () => {
  console.log("render FlowContents.");

  const theme = useFlowTheme();

  const {
    flowDocumentDto,
    canEnableFocusMode,
    currentUnit,
    currentUnitIdState,
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    clearSelectedUnit,
    dialogData,
    edges,
    expandableNestedUnitIds,
    focusModeEnabled,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    hoveredUnitId,
    graphHoveredUnit,
    nodes,
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    reactFlowInstanceRef,
    searchedUnitId,
    searchResultPosition,
    selectedUnitId,
    selectedNodeDetail,
    showMiniMap,
    selectFlowNode,
    selectTreeUnit,
    setDialogData,
    toggleExpandAllNestedUnits,
    toggleExpandedFlowNodeFromKeyboard,
    toggleFocusMode,
    toggleMiniMap,
    treeHoveredUnit,
    unitById,
  } = useFlowViewerController({ theme });
  const openSelectedNodeUnitList =
    useSelectedNodeUnitListAction(selectedNodeDetail);
  const miniMapColors = useFlowMiniMapColors(theme);
  const [detailFocusRequestRevision, setDetailFocusRequestRevision] =
    useState(0);
  const [focusGraphRequest, setFocusGraphRequest] =
    useState<FlowGraphFocusRequest>({ revision: 0 });
  const [focusSelectorRequest, setFocusSelectorRequest] =
    useState<UnitTreeFocusRequest>({ revision: 0 });
  const savedGraphFocusUnitIdRef = useRef<string | undefined>(undefined);
  const selectFlowNodeWithTelemetry = useCallback(
    (unitId: string) => {
      reportFlowOperation("unit.select");
      selectFlowNode(unitId);
    },
    [selectFlowNode],
  );
  const selectTreeUnitWithTelemetry = useCallback(
    (unitId: string) => {
      reportFlowOperation("unit.select");
      selectTreeUnit(unitId);
    },
    [selectTreeUnit],
  );
  const requestGraphFocus = useCallback(
    (
      targetUnitId: string | undefined,
      options: Pick<
        FlowGraphFocusRequest,
        "expectedScopeUnitId" | "selectTarget"
      > = {},
    ) => {
      setFocusGraphRequest((current) => ({
        ...options,
        revision: current.revision + 1,
        targetUnitId,
      }));
    },
    [],
  );
  const handleFocusDetail = useCallback(
    (unitId: string) => {
      savedGraphFocusUnitIdRef.current = unitId;
      if (selectedUnitId !== unitId) {
        selectFlowNodeWithTelemetry(unitId);
      }
      setDetailFocusRequestRevision((revision) => revision + 1);
    },
    [selectedUnitId, selectFlowNodeWithTelemetry],
  );
  const handleDetailFocusRequestHandled = useCallback((revision: number) => {
    setDetailFocusRequestRevision((currentRevision) =>
      currentRevision === revision ? 0 : currentRevision,
    );
  }, []);
  const handleFocusSelector = useCallback(
    (unitId?: string) => {
      savedGraphFocusUnitIdRef.current = unitId;
      const targetUnitId = resolveFlowSelectorFocusTarget(
        currentUnitIdState.currentUnitId,
        flowDocumentDto?.rootUnits ?? [],
        unitById,
      );
      setFocusSelectorRequest((current) => ({
        revision: current.revision + 1,
        targetUnitId,
      }));
    },
    [currentUnitIdState, flowDocumentDto?.rootUnits, unitById],
  );
  const handleSelectorEscape = useCallback(() => {
    requestGraphFocus(savedGraphFocusUnitIdRef.current);
  }, [requestGraphFocus]);
  const handleOpenFlowScope = useCallback(
    (unitId: string) => {
      reportFlowOperation("flow.scope.open");
      currentUnitIdState.setCurrentUnitId(unitId);
      requestGraphFocus(unitId, {
        expectedScopeUnitId: unitId,
        selectTarget: true,
      });
    },
    [currentUnitIdState, requestGraphFocus],
  );
  const handleReturnFromDetail = useCallback(
    (unitId: string) => {
      requestGraphFocus(unitId);
    },
    [requestGraphFocus],
  );
  const handleCloseDetail = useCallback(
    (unitId: string) => {
      clearSelectedUnit();
      requestGraphFocus(unitId);
    },
    [clearSelectedUnit, requestGraphFocus],
  );
  const openSelectedNodeDefinitionWithTelemetry = useCallback(() => {
    if (!selectedNodeDetail?.canOpenDefinition) {
      return;
    }
    reportFlowOperation("definition.open");
    openSelectedNodeDefinition();
  }, [openSelectedNodeDefinition, selectedNodeDetail?.canOpenDefinition]);
  const openSelectedNodeScopeWithTelemetry = useCallback(() => {
    reportFlowOperation("flow.scope.open");
    openSelectedNodeScope();
  }, [openSelectedNodeScope]);
  const toggleExpandAllNestedUnitsWithTelemetry = useCallback(() => {
    reportFlowOperation("flow.nested.toggle");
    toggleExpandAllNestedUnits();
  }, [toggleExpandAllNestedUnits]);
  const toggleExpandedFlowNodeFromKeyboardWithTelemetry = useCallback(
    (unitId: string) => {
      reportFlowOperation("flow.nested.toggle");
      toggleExpandedFlowNodeFromKeyboard(unitId);
    },
    [toggleExpandedFlowNodeFromKeyboard],
  );
  const toggleFocusModeWithTelemetry = useCallback(() => {
    reportFlowOperation("flow.relationship_focus.toggle");
    toggleFocusMode();
  }, [toggleFocusMode]);
  const toggleMiniMapWithTelemetry = useCallback(() => {
    reportFlowOperation("flow.minimap.toggle");
    toggleMiniMap();
  }, [toggleMiniMap]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          ".ajs-flow-minimap .react-flow__minimap-node": {
            vectorEffect: "non-scaling-stroke",
            strokeLinejoin: "round",
          },
        }}
      />
      <ReactFlowProvider>
        <Stack
          direction="column"
          spacing={0}
          sx={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Header
            currentUnit={currentUnit}
            canToggleExpandAllNestedUnits={expandableNestedUnitIds.length > 0}
            hasExpandedAllNestedUnits={hasExpandedAllNestedUnits}
            toggleExpandAllNestedUnits={toggleExpandAllNestedUnitsWithTelemetry}
            canEnableFocusMode={canEnableFocusMode}
            focusModeEnabled={focusModeEnabled}
            toggleFocusMode={toggleFocusModeWithTelemetry}
            showMiniMap={showMiniMap}
            toggleMiniMap={toggleMiniMapWithTelemetry}
            searchedUnitId={searchedUnitId}
            searchResultPosition={searchResultPosition}
            onSearchNavigate={handleSearchNavigate}
            onSearchSubmit={handleSearchSubmit}
            onSearchClear={handleSearchClear}
          />
          <FlowViewerBody
            flowDocumentDto={flowDocumentDto}
            canEnableFocusMode={canEnableFocusMode}
            clearGraphHoveredUnit={clearGraphHoveredUnit}
            clearTreeHoveredUnit={clearTreeHoveredUnit}
            currentUnit={currentUnit}
            currentUnitIdState={currentUnitIdState}
            detailFocusRequestRevision={detailFocusRequestRevision}
            dialogData={dialogData}
            edges={edges}
            expandableNestedUnitIds={expandableNestedUnitIds}
            focusGraphRequest={focusGraphRequest}
            focusSelectorRequest={focusSelectorRequest}
            focusModeEnabled={focusModeEnabled}
            graphHoveredUnit={graphHoveredUnit}
            handleSearchClear={handleSearchClear}
            handleSearchNavigate={handleSearchNavigate}
            handleSearchSubmit={handleSearchSubmit}
            hasExpandedAllNestedUnits={hasExpandedAllNestedUnits}
            hoveredUnitId={hoveredUnitId}
            miniMapColors={miniMapColors}
            nodes={nodes}
            onCloseDetail={handleCloseDetail}
            onDetailFocusRequestHandled={handleDetailFocusRequestHandled}
            onFocusDetail={handleFocusDetail}
            onFocusSelector={handleFocusSelector}
            onOpenFlowScope={handleOpenFlowScope}
            onReturnFromDetail={handleReturnFromDetail}
            onSelectorEscape={handleSelectorEscape}
            openSelectedNodeDefinition={openSelectedNodeDefinitionWithTelemetry}
            openSelectedNodeScope={openSelectedNodeScopeWithTelemetry}
            openSelectedNodeUnitList={openSelectedNodeUnitList}
            reactFlowInstanceRef={reactFlowInstanceRef}
            searchedUnitId={searchedUnitId}
            searchResultPosition={searchResultPosition}
            selectedNodeDetail={selectedNodeDetail}
            selectedUnitId={selectedUnitId}
            selectFlowNode={selectFlowNodeWithTelemetry}
            selectTreeUnit={selectTreeUnitWithTelemetry}
            setDialogData={setDialogData}
            showMiniMap={showMiniMap}
            theme={theme}
            toggleExpandAllNestedUnits={toggleExpandAllNestedUnitsWithTelemetry}
            toggleExpandedFlowNodeFromKeyboard={
              toggleExpandedFlowNodeFromKeyboardWithTelemetry
            }
            toggleFocusMode={toggleFocusModeWithTelemetry}
            toggleMiniMap={toggleMiniMapWithTelemetry}
            treeHoveredUnit={treeHoveredUnit}
            unitById={unitById}
          />
        </Stack>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};
export default memo(FlowContents);
