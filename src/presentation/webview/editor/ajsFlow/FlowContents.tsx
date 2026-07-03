import React, { FC, memo, useCallback, useMemo } from "react";
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
import UnitEntityDialog from "../UnitEntityDialog";
import { createOperationEvent } from "../../../../shared/webviewEvents";
import JobNode from "./nodes/JobNode";
import JobNetNode from "./nodes/JobNetNode";
import JobGroupNode from "./nodes/JobGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import Header from "./Header";
import FlowSelector from "./FlowSelector";
import FlowNodeDetailPanel from "./FlowNodeDetailPanel";
import { useFlowViewerController } from "./useFlowViewerController";
import { navigateToTable } from "./nodes/Utils";
import {
  type FlowMiniMapColors,
  resolveFlowMiniMapNodeFill,
  resolveFlowMiniMapNodeStroke,
} from "./flowMiniMap";
import type { AjsNode } from "./nodes/AjsNode";

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
  | "edges"
  | "graphHoveredUnit"
  | "nodes"
  | "reactFlowInstanceRef"
  | "selectFlowNode"
  | "showMiniMap"
> & {
  miniMapColors: FlowMiniMapColors;
  theme: Theme;
};

const FlowGraphPanel: FC<FlowGraphPanelProps> = ({
  clearGraphHoveredUnit,
  edges,
  graphHoveredUnit,
  miniMapColors,
  nodes,
  reactFlowInstanceRef,
  selectFlowNode,
  showMiniMap,
  theme,
}) => (
  <Paper
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
      onNodeClick={(_event, node) => selectFlowNode(node.id)}
      onNodeMouseEnter={(_event, node) => graphHoveredUnit(node.id)}
      onNodeMouseLeave={(_event, node) => clearGraphHoveredUnit(node.id)}
      onInit={(instance: ReactFlowInstance<Node<AjsNode>, Edge>) => {
        reactFlowInstanceRef.current = instance;
      }}
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
          nodeColor={(node) => resolveFlowMiniMapNodeFill(node, miniMapColors)}
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

type FlowViewerBodyProps = FlowViewerController & {
  miniMapColors: FlowMiniMapColors;
  openSelectedNodeUnitList: () => void;
  theme: Theme;
};

const FlowViewerBody: FC<FlowViewerBodyProps> = ({
  ajsDocument,
  clearGraphHoveredUnit,
  clearSelectedUnit,
  clearTreeHoveredUnit,
  dialogData,
  edges,
  focusModeEnabled,
  graphHoveredUnit,
  hoveredUnitId,
  miniMapColors,
  nodes,
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
  toggleFocusMode,
  treeHoveredUnit,
  unitById,
  currentUnitIdState,
}) => (
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
        rootUnits={ajsDocument?.rootUnits ?? []}
        unitById={unitById}
        currentUnitIdState={currentUnitIdState}
        hoveredUnitId={hoveredUnitId}
        selectedUnitId={selectedUnitId}
        onHoverUnit={treeHoveredUnit}
        onLeaveUnit={clearTreeHoveredUnit}
        onSelectUnit={selectTreeUnit}
      />
      <FlowGraphPanel
        clearGraphHoveredUnit={clearGraphHoveredUnit}
        edges={edges}
        graphHoveredUnit={graphHoveredUnit}
        miniMapColors={miniMapColors}
        nodes={nodes}
        reactFlowInstanceRef={reactFlowInstanceRef}
        selectFlowNode={selectFlowNode}
        showMiniMap={showMiniMap}
        theme={theme}
      />
      {selectedNodeDetail && (
        <FlowNodeDetailPanel
          detail={selectedNodeDetail}
          onClose={clearSelectedUnit}
          onOpenDefinition={openSelectedNodeDefinition}
          onOpenScope={openSelectedNodeScope}
          onOpenUnitList={openSelectedNodeUnitList}
          focusModeEnabled={focusModeEnabled}
          onToggleFocusMode={toggleFocusMode}
        />
      )}
    </Stack>
    {dialogData && (
      <UnitEntityDialog
        dialogData={dialogData}
        onClose={() => setDialogData(undefined)}
      />
    )}
  </Box>
);

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

const reportFlowOperation = (operation: string): void => {
  window.vscode.postMessage(createOperationEvent(operation));
};

const FlowContents: FC = () => {
  console.log("render FlowContents.");

  const theme = useFlowTheme();

  const {
    ajsDocument,
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
    toggleFocusMode,
    toggleMiniMap,
    treeHoveredUnit,
    unitById,
  } = useFlowViewerController({ theme });
  const openSelectedNodeUnitList =
    useSelectedNodeUnitListAction(selectedNodeDetail);
  const miniMapColors = useFlowMiniMapColors(theme);
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
  const openSelectedNodeDefinitionWithTelemetry = useCallback(() => {
    reportFlowOperation("definition.open");
    openSelectedNodeDefinition();
  }, [openSelectedNodeDefinition]);
  const openSelectedNodeScopeWithTelemetry = useCallback(() => {
    reportFlowOperation("flow.scope.open");
    openSelectedNodeScope();
  }, [openSelectedNodeScope]);
  const toggleExpandAllNestedUnitsWithTelemetry = useCallback(() => {
    reportFlowOperation("flow.nested.toggle");
    toggleExpandAllNestedUnits();
  }, [toggleExpandAllNestedUnits]);
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
            ajsDocument={ajsDocument}
            canEnableFocusMode={canEnableFocusMode}
            clearGraphHoveredUnit={clearGraphHoveredUnit}
            clearSelectedUnit={clearSelectedUnit}
            clearTreeHoveredUnit={clearTreeHoveredUnit}
            currentUnit={currentUnit}
            currentUnitIdState={currentUnitIdState}
            dialogData={dialogData}
            edges={edges}
            expandableNestedUnitIds={expandableNestedUnitIds}
            focusModeEnabled={focusModeEnabled}
            graphHoveredUnit={graphHoveredUnit}
            handleSearchClear={handleSearchClear}
            handleSearchNavigate={handleSearchNavigate}
            handleSearchSubmit={handleSearchSubmit}
            hasExpandedAllNestedUnits={hasExpandedAllNestedUnits}
            hoveredUnitId={hoveredUnitId}
            miniMapColors={miniMapColors}
            nodes={nodes}
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
