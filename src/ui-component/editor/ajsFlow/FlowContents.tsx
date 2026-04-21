import React, {
  useCallback,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMyAppContext } from "../MyContexts";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  AjsDocument,
  flattenAjsUnits,
  findRootJobnet,
} from "../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinitionByPath,
  UnitDefinitionDialogDto,
} from "../../../application/unit-definition/buildUnitDefinition";
import { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import { toAjsDocument } from "../../../application/unit-list/unitListDocumentView";
import UnitEntityDialog from "../UnitEntityDialog";
import JobNode from "./nodes/JobNode";
import JobNetNode from "./nodes/JobNetNode";
import JobGroupNode from "./nodes/JobGroupNode";
import ConditionNode from "./nodes/ConditionNode";
import Header from "./Header";
import FlowSelector from "./FlowSelector";
import { buildExpandedFlowGraph } from "./buildExpandedFlowGraph";
import { createReactFlowData } from "./flowGraphView";
import {
  collapseExpandedNestedUnitIds,
  collectExpandableNestedUnitIds,
  hasExpandedAllNestedUnitIds,
} from "./nestedExpansion";
import { findFlowSearchResult } from "./flowSearch";
import { REVEAL_UNIT } from "../../../shared/webviewEvents";
import {
  getRevealUnitAbsolutePath,
  resolveFlowRevealTarget,
} from "../revealUnit";

const defaultViewport = { x: 0, y: 0, zoom: 1.0 };

const nodeTypes: NodeTypes = {
  job: JobNode,
  jobnet: JobNetNode,
  jobgroup: JobGroupNode,
  condition: ConditionNode,
};

export type DialogDataStateType = {
  dialogData?: UnitDefinitionDialogDto;
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>;
};

type FlowMenuStatusType = {
  menuItem1: boolean;
};
export type FlowMenuStateType = {
  menuStatus: FlowMenuStatusType;
  setMenuStatus: Dispatch<SetStateAction<FlowMenuStatusType>>;
};
export type DrawerWidthStateType = {
  drawerWidth: number;
  setDrawerWidth: Dispatch<SetStateAction<number>>;
};
export type CurrentUnitIdStateType = {
  currentUnitId?: string;
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>;
};
export type NestedExpansionStateType = {
  expandedUnitIds: ReadonlySet<string>;
  toggleExpandedUnitId: (unitId: string) => void;
};

const FlowContents: FC = () => {
  console.log("render FlowContents.");

  const { isDarkMode } = useMyAppContext();

  const [menuStatus, setMenuStatus] = useState<FlowMenuStatusType>({
    menuItem1: true,
  });
  const [drawerWidth, setDrawerWidth] = useState<number>(0);

  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const [searchedUnitId, setSearchedUnitId] = useState<string>();
  const [searchMatchedUnitIds, setSearchMatchedUnitIds] = useState<string[]>(
    [],
  );
  const preserveSearchOnNextScopeChange = useRef<boolean>(false);
  const prevUnitEntityId = useRef<string | undefined>(undefined);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const allUnits = useMemo(
    () => (ajsDocument ? flattenAjsUnits(ajsDocument.rootUnits) : []),
    [ajsDocument],
  );
  const unitById = useMemo(
    () => new Map(allUnits.map((unit) => [unit.id, unit])),
    [allUnits],
  );
  const unitDefinitionByPath = useMemo(
    () =>
      ajsDocument
        ? buildUnitDefinitionByPath(ajsDocument)
        : new Map<string, UnitDefinitionDialogDto>(),
    [ajsDocument],
  );
  const currentUnit = useMemo(
    () => (currentUnitId ? unitById.get(currentUnitId) : undefined),
    [currentUnitId, unitById],
  );
  const toggleExpandedUnitId = useCallback(
    (unitId: string) => {
      setExpandedUnitIds((prev) => {
        if (!prev.includes(unitId)) {
          return [...prev, unitId];
        }

        return collapseExpandedNestedUnitIds(
          prev,
          unitId,
          unitById.get(unitId),
        );
      });
    },
    [unitById],
  );
  const expandedUnitIdSet = useMemo(
    () => new Set(expandedUnitIds),
    [expandedUnitIds],
  );
  const expandableNestedUnitIds = useMemo(
    () => collectExpandableNestedUnitIds(currentUnit),
    [currentUnit],
  );
  const hasExpandedAllNestedUnits = useMemo(
    () =>
      hasExpandedAllNestedUnitIds(expandableNestedUnitIds, expandedUnitIdSet),
    [expandableNestedUnitIds, expandedUnitIdSet],
  );
  const toggleExpandAllNestedUnits = useCallback(() => {
    if (expandableNestedUnitIds.length === 0) {
      return;
    }
    setExpandedUnitIds((prev) => {
      const prevSet = new Set(prev);
      if (hasExpandedAllNestedUnitIds(expandableNestedUnitIds, prevSet)) {
        return prev.filter(
          (unitId) => !expandableNestedUnitIds.includes(unitId),
        );
      }
      const next = new Set(prev);
      for (const unitId of expandableNestedUnitIds) {
        next.add(unitId);
      }
      return [...next];
    });
  }, [expandableNestedUnitIds]);
  const nestedExpansionState = useMemo<NestedExpansionStateType>(
    () => ({
      expandedUnitIds: expandedUnitIdSet,
      toggleExpandedUnitId,
    }),
    [expandedUnitIdSet, toggleExpandedUnitId],
  );

  const currentUnitIdState = useMemo<CurrentUnitIdStateType>(
    () => ({
      currentUnitId,
      setCurrentUnitId,
    }),
    [currentUnitId],
  );
  const dialogDataState = useMemo<DialogDataStateType>(
    () => ({
      dialogData,
      setDialogData,
    }),
    [dialogData],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );

  const updateNodesAndEdges = useCallback(
    (selectedUnitId?: string) => {
      if (!selectedUnitId) {
        setNodes(() => []);
        setEdges(() => []);
        return;
      }
      if (!ajsDocument) {
        setNodes(() => []);
        setEdges(() => []);
        return;
      }
      const { graph, positionOverrides, nodeDecorations } =
        buildExpandedFlowGraph(
          ajsDocument,
          selectedUnitId,
          nestedExpansionState.expandedUnitIds,
          theme.typography.htmlFontSize,
        );
      if (!graph) {
        setNodes(() => []);
        setEdges(() => []);
        return;
      }
      const { nodes, edges } = createReactFlowData(
        graph,
        unitDefinitionByPath,
        theme,
        dialogDataState,
        currentUnitIdState,
        {
          nodeDecorations,
          searchMatchedUnitIds: new Set(searchMatchedUnitIds),
          searchedUnitId,
          unitById,
          nestedExpansionState,
          positionOverrides,
        },
      );
      setNodes(() => nodes);
      setEdges(() => edges);
    },
    [
      ajsDocument,
      currentUnitIdState,
      dialogDataState,
      nestedExpansionState,
      theme,
      unitDefinitionByPath,
      unitById,
      searchMatchedUnitIds,
      searchedUnitId,
    ],
  );

  const handleSearchSubmit = useCallback(
    (query: string) => {
      const result = findFlowSearchResult(currentUnit, query, unitById);
      if (!result) {
        setSearchedUnitId(undefined);
        setSearchMatchedUnitIds([]);
        return;
      }

      setExpandedUnitIds((prev) => {
        const next = new Set(prev);
        for (const unitId of result.expandedAncestorUnitIds) {
          next.add(unitId);
        }
        return [...next];
      });
      setSearchMatchedUnitIds(result.matchedUnitIds);
      setSearchedUnitId(result.matchedUnitId);
    },
    [currentUnit, unitById],
  );
  const handleSearchClear = useCallback(() => {
    setSearchedUnitId(undefined);
    setSearchMatchedUnitIds([]);
  }, []);

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
    [unitById],
  );

  useEffect(() => {
    updateNodesAndEdges(currentUnitId);
    prevUnitEntityId.current = currentUnitId;
  }, [currentUnitId, updateNodesAndEdges]);

  useEffect(() => {
    setExpandedUnitIds((prev) => (prev.length === 0 ? prev : []));
    if (preserveSearchOnNextScopeChange.current) {
      preserveSearchOnNextScopeChange.current = false;
      return;
    }
    setSearchedUnitId(undefined);
    setSearchMatchedUnitIds([]);
  }, [ajsDocument, currentUnitId]);

  useEffect(() => {
    const changeDocumentFn = (type: string, data: unknown) => {
      const nextDocument = data
        ? toAjsDocument(data as UnitListDocumentDto)
        : undefined;
      setAjsDocument(() => nextDocument);
      setCurrentUnitId(() => {
        const x = nextDocument ? flattenAjsUnits(nextDocument.rootUnits) : [];
        return prevUnitEntityId.current
          ? x.find((unit) => unit.id === prevUnitEntityId.current)?.id
          : nextDocument
            ? findRootJobnet(nextDocument)?.id
            : undefined;
      });
    };
    window.EventBridge.addCallback("changeDocument", changeDocumentFn);
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocumentFn);
    };
  }, []); // fire this when mount.

  useEffect(() => {
    const revealUnitFn = (_type: string, data: unknown) => {
      const absolutePath = getRevealUnitAbsolutePath(data);
      if (!absolutePath) {
        return;
      }
      handleRevealUnit(absolutePath);
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    return () => {
      window.EventBridge.removeCallback(REVEAL_UNIT, revealUnitFn);
    };
  }, [handleRevealUnit]);

  useEffect(() => {
    const root = document.getElementById("root");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (root) {
      root.style.overflow = "hidden";
      root.style.height = "100%";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (root) {
        root.style.overflow = "";
        root.style.height = "";
      }
    };
  }, []);

  const flowMenuState = {
    menuStatus: menuStatus,
    setMenuStatus: setMenuStatus,
  };
  const drawerWidthState = {
    drawerWidth: drawerWidth,
    setDrawerWidth: setDrawerWidth,
  };

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
              <Paper
                variant="outlined"
                sx={{
                  width: "100%",
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
                      position: "fixed",
                      right: 16,
                      bottom: 16,
                      borderRadius: 12,
                      overflow: "hidden",
                      opacity: 0.88,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                </ReactFlow>
              </Paper>
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
