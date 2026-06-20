import React, { FC, memo, useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
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

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

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
    currentUnit,
    currentUnitIdState,
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    clearSelectedUnit,
    dialogData,
    drawerWidth,
    drawerWidthState,
    edges,
    expandableNestedUnitIds,
    flowMenuState,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    hoveredUnitId,
    graphHoveredUnit,
    menuStatus,
    nodes,
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    reactFlowInstanceRef,
    searchedUnitId,
    searchResultPosition,
    selectedUnitId,
    selectedNodeDetail,
    selectFlowNode,
    selectTreeUnit,
    setDialogData,
    toggleExpandAllNestedUnits,
    treeHoveredUnit,
    unitById,
  } = useFlowViewerController({ theme });

  return (
    <ThemeProvider theme={theme}>
      <ReactFlowProvider>
        <Stack
          direction="row"
          spacing={0}
          sx={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {menuStatus.menuItem1 && (
            <FlowSelector
              rootUnits={ajsDocument?.rootUnits ?? []}
              unitById={unitById}
              currentUnitIdState={currentUnitIdState}
              flowMenuState={flowMenuState}
              drawerWidthState={drawerWidthState}
              hoveredUnitId={hoveredUnitId}
              selectedUnitId={selectedUnitId}
              onHoverUnit={treeHoveredUnit}
              onLeaveUnit={clearTreeHoveredUnit}
              onSelectUnit={selectTreeUnit}
            />
          )}
          <Stack
            direction="column"
            sx={{
              marginLeft: `${drawerWidth}px`,
              width: `calc(100% - ${drawerWidth}px)`,
              minWidth: 0,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Header
              currentUnit={currentUnit}
              unitById={unitById}
              currentUnitIdState={currentUnitIdState}
              flowMenuState={flowMenuState}
              drawerWidthState={drawerWidthState}
              canToggleExpandAllNestedUnits={expandableNestedUnitIds.length > 0}
              hasExpandedAllNestedUnits={hasExpandedAllNestedUnits}
              toggleExpandAllNestedUnits={toggleExpandAllNestedUnits}
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
                    onNodeMouseEnter={(_event, node) =>
                      graphHoveredUnit(node.id)
                    }
                    onNodeMouseLeave={(_event, node) =>
                      clearGraphHoveredUnit(node.id)
                    }
                    onInit={(instance) => {
                      reactFlowInstanceRef.current = instance;
                    }}
                    fitView
                    fitViewOptions={{ padding: 0.22 }}
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
                    <MiniMap
                      pannable
                      zoomable
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        opacity: 0.88,
                        boxShadow: theme.shadows[3],
                      }}
                    />
                  </ReactFlow>
                </Paper>
                {selectedNodeDetail && (
                  <FlowNodeDetailPanel
                    detail={selectedNodeDetail}
                    onClose={clearSelectedUnit}
                    onOpenDefinition={openSelectedNodeDefinition}
                    onOpenScope={openSelectedNodeScope}
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
        </Stack>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};
export default memo(FlowContents);
