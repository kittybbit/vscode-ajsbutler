import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import Stack from "@mui/material/Stack";
import { ThemeProvider, type Theme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";
import { type Edge, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import UnitDefinitionDialog from "../UnitDefinitionDialog";
import { createViewerOperationRequest } from "../../viewerRequestMessages";
import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import Header from "./Header";
import FlowSelector from "./FlowSelector";
import FlowNodeDetailPanel from "./FlowNodeDetailPanel";
import {
  FlowGraphPanel,
  useFlowAnnouncementActions,
  useFlowAnnouncementEffects,
  type SemanticDiffRelationDuplicateGroup,
} from "./FlowGraphCanvas";
import { useFlowViewerController } from "./useFlowViewerController";
import {
  useFlowViewportAdapter,
  type FlowRendererReady,
  type FlowViewportInstanceRef,
} from "./useFlowViewportAdapter";
import type { UnitTreeFocusRequest } from "../shared/UnitTreeSelector";
import { viewerThemeGlobalStyles } from "../shared/viewerThemeStyles";
import {
  createSemanticDiffTheme,
  semanticDiffViewerSurfaceSx,
} from "../../shared/muiTheme";
import { navigateToTable } from "./nodes/Utils";
import { type FlowMiniMapColors } from "./flowMiniMap";
import type { CurrentUnitIdStateType } from "./flowViewerStateTypes";
import { type FlowGraphFocusRequest } from "./flowViewportFocus";
import { resolveFlowSelectorFocusTarget } from "./FlowSelector";
import type { FlowKeyboardNavigationMovement } from "./flowKeyboardNavigation";
import {
  ViewerAnnouncementHost,
  type ViewerAnnouncementHostHandle,
} from "../shared/viewerAnnouncements";
import { unitInformationMessage } from "../unitInformationLocalization";

export type { SemanticDiffRelationDuplicateGroup } from "./FlowGraphCanvas";

type HighlightedRelation = Readonly<{
  key: string;
  sourceUnitId: string;
  targetUnitId: string;
  relationType: "seq" | "con";
}>;

const highlightedRelation = (edge: Edge): HighlightedRelation | undefined => {
  const data = edge.data as
    | {
        flowRelationType?: "seq" | "con";
        semanticDiffHighlight?: unknown;
      }
    | undefined;
  if (!data?.semanticDiffHighlight || !data.flowRelationType) return undefined;
  return {
    key: `${edge.source}\u0000${edge.target}\u0000${data.flowRelationType}`,
    sourceUnitId: edge.source,
    targetUnitId: edge.target,
    relationType: data.flowRelationType,
  };
};

const compareFlowIds = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

const compareDuplicateGroups = (
  left: SemanticDiffRelationDuplicateGroup,
  right: SemanticDiffRelationDuplicateGroup,
): number =>
  compareFlowIds(left.sourceUnitId, right.sourceUnitId) ||
  compareFlowIds(left.targetUnitId, right.targetUnitId) ||
  compareFlowIds(left.relationType, right.relationType);

/** Count every highlighted formal relation in a concrete graph pair. */
export const collectSemanticDiffRelationDuplicateGroups = (
  edges: readonly Edge[],
): SemanticDiffRelationDuplicateGroup[] => {
  const counts = new Map<string, SemanticDiffRelationDuplicateGroup>();
  edges.forEach((edge) => {
    const relation = highlightedRelation(edge);
    if (!relation) return;
    const previous = counts.get(relation.key);
    counts.set(relation.key, {
      sourceUnitId: relation.sourceUnitId,
      targetUnitId: relation.targetUnitId,
      relationType: relation.relationType,
      count: (previous?.count ?? 0) + 1,
    });
  });
  return [...counts.values()]
    .filter((group) => group.count > 1)
    .sort(compareDuplicateGroups);
};

type FlowViewerController = ReturnType<typeof useFlowViewerController>;

type FlowViewerBodyProps = Pick<
  FlowViewerController,
  | "clearGraphHoveredUnit"
  | "clearTreeHoveredUnit"
  | "currentUnitIdState"
  | "dialogData"
  | "edges"
  | "flowDocumentDto"
  | "focusModeEnabled"
  | "graphHoveredUnit"
  | "hoveredUnitId"
  | "nodes"
  | "openSelectedNodeDefinition"
  | "openSelectedNodeScope"
  | "selectedNodeDetail"
  | "selectedUnitId"
  | "selectFlowNode"
  | "selectTreeUnit"
  | "setDialogData"
  | "showMiniMap"
  | "toggleExpandedFlowNodeFromKeyboard"
  | "toggleFocusMode"
  | "treeHoveredUnit"
  | "unitById"
> & {
  detailFocusRequestRevision: number;
  focusGraphRequest: FlowGraphFocusRequest;
  focusSelectorRequest: UnitTreeFocusRequest;
  miniMapColors: FlowMiniMapColors;
  onCloseDetail: (unitId: string) => void;
  onDetailFocusRequestHandled: (revision: number) => void;
  onFocusDetail: (unitId: string) => void;
  onFocusSelector: (unitId?: string) => void;
  onKeyboardNavigation: (unitId: string) => void;
  onEnterFlowTreeUnit: (unitId: string) => void;
  onNestedExpansion?: (unitId: string, expanded: boolean) => void;
  onNodeSelected?: (unitId: string) => void;
  onSpatialMove?: (
    unitId: string,
    direction: FlowKeyboardNavigationMovement,
  ) => void;
  onOpenFlowScope: (unitId: string) => void;
  onRendererReady: FlowRendererReady;
  reactFlowInstanceRef: FlowViewportInstanceRef;
  onScopeChange: (targetScopeUnitId: string) => void;
  onReturnFromDetail: (unitId: string) => void;
  onSelectorEscape: VoidFunction;
  openSelectedNodeUnitList: () => void;
  language: string;
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
  onKeyboardNavigation,
  onEnterFlowTreeUnit,
  onNestedExpansion,
  onNodeSelected,
  onSpatialMove,
  onOpenFlowScope,
  onRendererReady,
  onScopeChange,
  onReturnFromDetail,
  onSelectorEscape,
  openSelectedNodeDefinition,
  openSelectedNodeScope,
  openSelectedNodeUnitList,
  language,
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
  return (
    <Box sx={semanticDiffViewerSurfaceSx}>
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
          currentUnitId={currentUnitIdState.currentUnitId}
          focusRequest={focusSelectorRequest}
          hoveredUnitId={hoveredUnitId}
          selectedUnitId={selectedUnitId}
          onHoverUnit={treeHoveredUnit}
          onLeaveUnit={clearTreeHoveredUnit}
          onEscape={onSelectorEscape}
          onEnterUnit={onEnterFlowTreeUnit}
          onOpenScope={onOpenFlowScope}
          onSelectUnit={selectTreeUnit}
          ariaLabel={unitInformationMessage("a11y.flow.selector", language)}
          collapsedAriaLabel={unitInformationMessage(
            "a11y.flow.selector.collapsed",
            language,
          )}
          title={unitInformationMessage("a11y.tree.title", language)}
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
          onKeyboardNavigation={onKeyboardNavigation}
          onRendererReady={onRendererReady}
          onNestedExpansion={onNestedExpansion}
          onNodeSelected={onNodeSelected}
          onSpatialMove={onSpatialMove}
          language={language}
          graphAriaLabel={unitInformationMessage("a11y.flow.graph", language)}
          reactFlowInstanceRef={reactFlowInstanceRef}
          onScopeChange={onScopeChange}
          selectFlowNode={selectFlowNode}
          selectedUnitId={selectedUnitId}
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
    () => createSemanticDiffTheme({ mode: isDarkMode ? "dark" : "light" }),
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
      added: theme.palette.success.main,
      both: theme.palette.warning.main,
      changed: theme.palette.info.main,
      confirmationRequired: theme.palette.warning.main,
      currentSearchResult: theme.palette.success.dark,
      downstream: theme.palette.success.main,
      hidden: "transparent",
      normal: theme.palette.action.disabled,
      removed: theme.palette.error.main,
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

const openSelectedDefinitionWithTelemetry = (
  canOpenDefinition: boolean | undefined,
  openDefinition: () => void,
): void => {
  if (!canOpenDefinition) return;
  reportFlowOperation("definition.open");
  openDefinition();
};

type FlowTelemetryActionsInput = Readonly<{
  currentUnitIdState: CurrentUnitIdStateType;
  flowDocumentDto: FlowViewerController["flowDocumentDto"];
  openSelectedNodeDefinition: () => void;
  openSelectedNodeScope: () => void;
  requestDetailFocus: (unitId: string) => void;
  requestGraphFocus: (unitId: string) => void;
  requestScopeTransition: (unitId: string, focusUnitId: string) => void;
  requestSelectorFocus: (targetUnitId: string, sourceUnitId?: string) => void;
  selectFlowNode: (unitId: string) => void;
  selectTreeUnit: (unitId: string) => void;
  selectedNodeCanOpenDefinition: boolean | undefined;
  selectedUnitId: string | undefined;
  toggleExpandAllNestedUnits: () => void;
  toggleExpandedFlowNodeFromKeyboard: (unitId: string) => void;
  toggleFocusMode: () => void;
  toggleMiniMap: () => void;
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
}>;

const useFlowTelemetryActions = ({
  currentUnitIdState,
  flowDocumentDto,
  openSelectedNodeDefinition,
  openSelectedNodeScope,
  requestDetailFocus,
  requestGraphFocus,
  requestScopeTransition,
  requestSelectorFocus,
  selectFlowNode,
  selectTreeUnit,
  selectedNodeCanOpenDefinition,
  selectedUnitId,
  toggleExpandAllNestedUnits,
  toggleExpandedFlowNodeFromKeyboard,
  toggleFocusMode,
  toggleMiniMap,
  unitById,
}: FlowTelemetryActionsInput) => {
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
  const handleEnterFlowTreeUnit = useCallback(
    (unitId: string) => requestGraphFocus(unitId),
    [requestGraphFocus],
  );
  const handleFocusDetail = useCallback(
    (unitId: string) => {
      if (selectedUnitId !== unitId) reportFlowOperation("unit.select");
      requestDetailFocus(unitId);
    },
    [requestDetailFocus, selectedUnitId],
  );
  const handleFocusSelector = useCallback(
    (unitId?: string) =>
      requestSelectorFocus(
        resolveFlowSelectorFocusTarget(
          currentUnitIdState.currentUnitId,
          flowDocumentDto?.rootUnits ?? [],
          unitById,
        ),
        unitId,
      ),
    [
      currentUnitIdState,
      flowDocumentDto?.rootUnits,
      requestSelectorFocus,
      unitById,
    ],
  );
  const handleOpenFlowScope = useCallback(
    (unitId: string) => {
      reportFlowOperation("flow.scope.open");
      requestScopeTransition(unitId, unitId);
    },
    [requestScopeTransition],
  );
  const openSelectedNodeDefinitionWithTelemetry = useCallback(
    () =>
      openSelectedDefinitionWithTelemetry(
        selectedNodeCanOpenDefinition,
        openSelectedNodeDefinition,
      ),
    [openSelectedNodeDefinition, selectedNodeCanOpenDefinition],
  );
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
  return {
    handleEnterFlowTreeUnit,
    handleFocusDetail,
    handleFocusSelector,
    handleOpenFlowScope,
    openSelectedNodeDefinitionWithTelemetry,
    openSelectedNodeScopeWithTelemetry,
    selectFlowNodeWithTelemetry,
    selectTreeUnitWithTelemetry,
    toggleExpandAllNestedUnitsWithTelemetry,
    toggleExpandedFlowNodeFromKeyboardWithTelemetry,
    toggleFocusModeWithTelemetry,
    toggleMiniMapWithTelemetry,
  };
};

const FlowContents: FC = () => {
  console.log("render FlowContents.");

  const theme = useFlowTheme();
  const { lang = "en" } = useMyAppContext();
  const announcementHostRef = useRef<ViewerAnnouncementHostHandle>(null);

  const {
    flowDocumentDto,
    canEnableFocusMode,
    currentUnit,
    currentUnitIdState,
    changeScope,
    clearGraphHoveredUnit,
    clearTreeHoveredUnit,
    closeDetail,
    dialogData,
    detailFocusRequestRevision,
    edges,
    expandableNestedUnitIds,
    focusGraphRequest,
    focusSelectorRequest,
    focusModeEnabled,
    focusRequestVersion,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    hoveredUnitId,
    graphHoveredUnit,
    nodes,
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    handleDetailFocusRequestHandled,
    handleSelectorEscape,
    requestDetailFocus,
    requestGraphFocus,
    requestKeyboardNavigation,
    requestScopeTransition,
    requestSelectorFocus,
    layoutRequestIdentity,
    preserveViewportRequestVersion,
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
    returnFromDetail,
    selectionFocusRequest,
  } = useFlowViewerController({ theme });
  const { onRendererReady, reactFlowInstanceRef } = useFlowViewportAdapter({
    edges,
    focusRequestVersion,
    layoutRequestIdentity,
    nodes,
    preserveViewportRequestVersion,
    searchedUnitId,
    selectionFocusRequestVersion: selectionFocusRequest.version,
    selectionFocusTargetUnitId:
      selectionFocusRequest.targetUnitId === selectedUnitId
        ? selectionFocusRequest.targetUnitId
        : undefined,
  });
  const openSelectedNodeUnitList =
    useSelectedNodeUnitListAction(selectedNodeDetail);
  const miniMapColors = useFlowMiniMapColors(theme);
  const telemetryActions = useFlowTelemetryActions({
    currentUnitIdState,
    flowDocumentDto,
    openSelectedNodeDefinition,
    openSelectedNodeScope,
    requestDetailFocus,
    requestGraphFocus,
    requestScopeTransition,
    requestSelectorFocus,
    selectFlowNode,
    selectTreeUnit,
    selectedNodeCanOpenDefinition: selectedNodeDetail?.canOpenDefinition,
    selectedUnitId,
    toggleExpandAllNestedUnits,
    toggleExpandedFlowNodeFromKeyboard,
    toggleFocusMode,
    toggleMiniMap,
    unitById,
  });
  const {
    handleEnterFlowTreeUnit,
    handleFocusDetail,
    handleFocusSelector,
    handleOpenFlowScope,
    openSelectedNodeDefinitionWithTelemetry,
    openSelectedNodeScopeWithTelemetry,
    selectFlowNodeWithTelemetry,
    selectTreeUnitWithTelemetry,
    toggleExpandAllNestedUnitsWithTelemetry,
    toggleExpandedFlowNodeFromKeyboardWithTelemetry,
    toggleFocusModeWithTelemetry,
    toggleMiniMapWithTelemetry,
  } = telemetryActions;
  const {
    announceFlow,
    announceFlowNestedExpansion,
    announceFlowSelection,
    announceFlowSpatialMove,
    getFlowUnitName,
  } = useFlowAnnouncementActions({
    announcementHostRef,
    language: lang,
    unitById,
  });
  const semanticDiffRelationDuplicateGroups = useMemo(
    () => collectSemanticDiffRelationDuplicateGroups(edges),
    [edges],
  );
  const selectTreeUnitWithAnnouncement = useCallback(
    (unitId: string) => {
      selectTreeUnitWithTelemetry(unitId);
      announceFlowSelection(unitId);
    },
    [announceFlowSelection, selectTreeUnitWithTelemetry],
  );
  useFlowAnnouncementEffects({
    announceFlow,
    currentScopeUnitId: currentUnit?.id,
    duplicateGroups: semanticDiffRelationDuplicateGroups,
    focusModeEnabled,
    getFlowUnitName,
    language: lang,
    searchResultPosition,
    searchedUnitId,
  });

  return (
    <ThemeProvider theme={theme}>
      <ViewerAnnouncementHost ref={announcementHostRef} />
      <GlobalStyles
        styles={{
          ...viewerThemeGlobalStyles,
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
            language={lang}
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
            clearGraphHoveredUnit={clearGraphHoveredUnit}
            clearTreeHoveredUnit={clearTreeHoveredUnit}
            currentUnitIdState={currentUnitIdState}
            detailFocusRequestRevision={detailFocusRequestRevision}
            dialogData={dialogData}
            edges={edges}
            focusGraphRequest={focusGraphRequest}
            focusSelectorRequest={focusSelectorRequest}
            focusModeEnabled={focusModeEnabled}
            graphHoveredUnit={graphHoveredUnit}
            hoveredUnitId={hoveredUnitId}
            miniMapColors={miniMapColors}
            nodes={nodes}
            onCloseDetail={closeDetail}
            onDetailFocusRequestHandled={handleDetailFocusRequestHandled}
            onFocusDetail={handleFocusDetail}
            onFocusSelector={handleFocusSelector}
            onKeyboardNavigation={requestKeyboardNavigation}
            onEnterFlowTreeUnit={handleEnterFlowTreeUnit}
            onNestedExpansion={announceFlowNestedExpansion}
            onNodeSelected={announceFlowSelection}
            onSpatialMove={announceFlowSpatialMove}
            onOpenFlowScope={handleOpenFlowScope}
            onRendererReady={onRendererReady}
            onScopeChange={changeScope}
            onReturnFromDetail={returnFromDetail}
            onSelectorEscape={handleSelectorEscape}
            openSelectedNodeDefinition={openSelectedNodeDefinitionWithTelemetry}
            openSelectedNodeScope={openSelectedNodeScopeWithTelemetry}
            openSelectedNodeUnitList={openSelectedNodeUnitList}
            language={lang}
            reactFlowInstanceRef={reactFlowInstanceRef}
            selectedNodeDetail={selectedNodeDetail}
            selectedUnitId={selectedUnitId}
            selectFlowNode={selectFlowNodeWithTelemetry}
            selectTreeUnit={selectTreeUnitWithAnnouncement}
            setDialogData={setDialogData}
            showMiniMap={showMiniMap}
            theme={theme}
            toggleExpandedFlowNodeFromKeyboard={
              toggleExpandedFlowNodeFromKeyboardWithTelemetry
            }
            toggleFocusMode={toggleFocusModeWithTelemetry}
            treeHoveredUnit={treeHoveredUnit}
            unitById={unitById}
          />
        </Stack>
      </ReactFlowProvider>
    </ThemeProvider>
  );
};
export default memo(FlowContents);
