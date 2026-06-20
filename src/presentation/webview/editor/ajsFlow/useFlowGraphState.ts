import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { Theme } from "@mui/material/styles";
import { Edge, Node } from "@xyflow/react";
import {
  AjsDocument,
  AjsUnit,
} from "../../../../domain/models/ajs/AjsDocument";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import { buildExpandedFlowGraph } from "./buildExpandedFlowGraph";
import { ExpandedFlowGraphResult } from "./expandedFlowGraphTypes";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
  NestedExpansionStateType,
} from "./flowViewerStateTypes";
import { createReactFlowData } from "./flowGraphView";
import type { AjsNode } from "./nodes/AjsNode";

type UseFlowGraphStateParams = {
  ajsDocument?: AjsDocument;
  currentUnitId?: string;
  currentUnitIdState: CurrentUnitIdStateType;
  dialogDataState: DialogDataStateType;
  expandedUnitIds: string[];
  nestedExpansionState: NestedExpansionStateType;
  prevUnitEntityId: MutableRefObject<string | undefined>;
  searchedUnitId?: string;
  searchMatchedUnitIds: string[];
  selectedUnitId?: string;
  theme: Theme;
  unitById: ReadonlyMap<string, AjsUnit>;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
};

type FlowData = { nodes: Node<AjsNode>[]; edges: Edge[] };

type FlowGraphDataBuildParams = Omit<
  UseFlowGraphStateParams,
  "currentUnitId" | "prevUnitEntityId"
>;

type ReadyFlowGraphDataBuildParams = FlowGraphDataBuildParams & {
  ajsDocument: AjsDocument;
};

const emptyFlowData = (): FlowData => ({
  nodes: [],
  edges: [],
});

const hasFlowGraphBuildInput = (
  params: FlowGraphDataBuildParams,
  graphScopeUnitId: string | undefined,
): params is ReadyFlowGraphDataBuildParams =>
  !!graphScopeUnitId && !!params.ajsDocument;

const buildExpandedGraphResult = (
  params: ReadyFlowGraphDataBuildParams,
  graphScopeUnitId: string,
): ExpandedFlowGraphResult =>
  buildExpandedFlowGraph({
    document: params.ajsDocument,
    currentUnitId: graphScopeUnitId,
    expandedUnitIds: params.expandedUnitIds,
    basePx: params.theme.typography.htmlFontSize,
  });

const createReactFlowDataOptions = ({
  nestedExpansionState,
  searchedUnitId,
  searchMatchedUnitIds,
  selectedUnitId,
  unitById,
}: FlowGraphDataBuildParams) => ({
  searchMatchedUnitIds: new Set(searchMatchedUnitIds),
  searchedUnitId,
  selectedUnitId,
  unitById,
  nestedExpansionState,
});

const createFlowDataFromExpandedGraph = (
  params: FlowGraphDataBuildParams,
  expandedGraph: ExpandedFlowGraphResult,
): FlowData =>
  expandedGraph.graph
    ? createReactFlowData(
        expandedGraph.graph,
        params.unitDefinitionByPath,
        params.theme,
        params.dialogDataState,
        params.currentUnitIdState,
        {
          ...createReactFlowDataOptions(params),
          nodeDecorations: expandedGraph.nodeDecorations,
          positionOverrides: expandedGraph.positionOverrides,
        },
      )
    : emptyFlowData();

const buildFlowData = (
  params: FlowGraphDataBuildParams,
  graphScopeUnitId: string | undefined,
): FlowData =>
  hasFlowGraphBuildInput(params, graphScopeUnitId)
    ? createFlowDataFromExpandedGraph(
        params,
        buildExpandedGraphResult(params, graphScopeUnitId),
      )
    : emptyFlowData();

const updateFlowDataState = (
  flowData: FlowData,
  setNodes: Dispatch<SetStateAction<Node<AjsNode>[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>,
) => {
  setNodes(() => flowData.nodes);
  setEdges(() => flowData.edges);
};

export const useFlowGraphState = ({
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
}: UseFlowGraphStateParams) => {
  const [nodes, setNodes] = useState<Node<AjsNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const buildNodesAndEdges = useCallback(
    (graphScopeUnitId?: string): FlowData =>
      buildFlowData(
        {
          ajsDocument,
          currentUnitIdState,
          dialogDataState,
          expandedUnitIds,
          nestedExpansionState,
          searchedUnitId,
          searchMatchedUnitIds,
          selectedUnitId,
          theme,
          unitById,
          unitDefinitionByPath,
        },
        graphScopeUnitId,
      ),
    [
      ajsDocument,
      currentUnitIdState,
      dialogDataState,
      expandedUnitIds,
      nestedExpansionState,
      searchedUnitId,
      searchMatchedUnitIds,
      selectedUnitId,
      theme,
      unitById,
      unitDefinitionByPath,
    ],
  );

  useEffect(() => {
    const nextFlowData = buildNodesAndEdges(currentUnitId);
    updateFlowDataState(nextFlowData, setNodes, setEdges);
    prevUnitEntityId.current = currentUnitId;
  }, [buildNodesAndEdges, currentUnitId, prevUnitEntityId]);

  return { edges, nodes };
};
