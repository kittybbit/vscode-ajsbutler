import React, {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material";
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
import { buildFlowGraph } from "../../../application/flow-graph/buildFlowGraph";
import {
  AjsDocument,
  flattenAjsUnits,
} from "../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinition,
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
import { createReactFlowData } from "./flowGraphView";

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

const FlowContents: FC = () => {
  console.log("render FlowContents.");

  const { isDarkMode } = useMyAppContext();

  const [menuStatus, setMenuStatus] = useState<FlowMenuStatusType>({
    menuItem1: true,
  });
  const [drawerWidth, setDrawerWidth] = useState<number>(0);

  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
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
      new Map(
        ajsDocument
          ? flattenAjsUnits(ajsDocument.rootUnits).map((unit) => [
              unit.absolutePath,
              buildUnitDefinition(unit),
            ])
          : [],
      ),
    [ajsDocument],
  );
  const currentUnit = useMemo(
    () => (currentUnitId ? unitById.get(currentUnitId) : undefined),
    [currentUnitId, unitById],
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

  const updateNodesAndEdges = (selectedUnitId?: string) => {
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
    const graph = buildFlowGraph(ajsDocument, selectedUnitId);
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
    );
    setNodes(() => nodes);
    setEdges(() => edges);
  };

  useEffect(() => {
    updateNodesAndEdges(currentUnitId);
    prevUnitEntityId.current = currentUnitId;
  }, [ajsDocument, currentUnitId, unitDefinitionByPath, theme, dialogData]);

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
          : x.find((unit) => unit.unitType === "n" && unit.isRootJobnet)?.id;
      });
    };
    window.EventBridge.addCallback("changeDocument", changeDocumentFn);
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocumentFn);
    };
  }, []); // fire this when mount.

  const flowMenuState = {
    menuStatus: menuStatus,
    setMenuStatus: setMenuStatus,
  };
  const drawerWidthState = {
    drawerWidth: drawerWidth,
    setDrawerWidth: setDrawerWidth,
  };
  const currentUnitIdState = {
    currentUnitId: currentUnitId,
    setCurrentUnitId: setCurrentUnitId,
  };
  const dialogDataState = {
    dialogData: dialogData,
    setDialogData: setDialogData,
  };

  return (
    <ThemeProvider theme={theme}>
      <ReactFlowProvider>
        <Stack direction="row" spacing={0}>
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
            sx={{ marginLeft: `${drawerWidth}px` }}
            flex={1}
          >
            <Header
              currentUnit={currentUnit}
              unitById={unitById}
              currentUnitIdState={currentUnitIdState}
              flowMenuState={flowMenuState}
              drawerWidthState={drawerWidthState}
            />
            <Box
              sx={{
                width: "100vw",
                height: (theme) =>
                  `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
              }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                defaultViewport={defaultViewport}
                colorMode={theme.palette.mode}
                nodeTypes={nodeTypes}
              >
                <Background variant={BackgroundVariant.Dots} />
                <Controls position="bottom-left" showInteractive={false} />
                <MiniMap pannable zoomable style={{ position: "fixed" }} />
              </ReactFlow>
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
