import React, { FC, memo, useMemo } from "react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import UnitEntityDialog from "../UnitEntityDialog";
import JobNode from "./nodes/JobNode";
import JobNetNode from "./nodes/JobNetNode";
import JobGroupNode from "./nodes/JobGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import Header from "./Header";
import FlowSelector from "./FlowSelector";
import FlowNodeDetailPanel from "./FlowNodeDetailPanel";
import { useFlowViewerController } from "./useFlowViewerController";
import {
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

const FlowContents: FC = () => {
  console.log("render FlowContents.");

  const { isDarkMode } = useMyAppContext();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );

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
  const miniMapColors = useMemo(
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
            toggleExpandAllNestedUnits={toggleExpandAllNestedUnits}
            canEnableFocusMode={canEnableFocusMode}
            focusModeEnabled={focusModeEnabled}
            toggleFocusMode={toggleFocusMode}
            showMiniMap={showMiniMap}
            toggleMiniMap={toggleMiniMap}
            searchedUnitId={searchedUnitId}
            searchResultPosition={searchResultPosition}
            onSearchNavigate={handleSearchNavigate}
            onSearchSubmit={handleSearchSubmit}
            onSearchClear={handleSearchClear}
          />
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
                  onNodeMouseLeave={(_event, node) =>
                    clearGraphHoveredUnit(node.id)
                  }
                  onInit={(instance) => {
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
              {selectedNodeDetail && (
                <FlowNodeDetailPanel
                  detail={selectedNodeDetail}
                  onClose={clearSelectedUnit}
                  onOpenDefinition={openSelectedNodeDefinition}
                  onOpenScope={openSelectedNodeScope}
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
        </Stack>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};
export default memo(FlowContents);
