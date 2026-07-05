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
import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import type { FlowGraphSemanticDiffHighlights } from "../../../../application/flow-graph/buildFlowGraphCore";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import { createPerformanceEvent } from "../../../../shared/webviewEvents";
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
  semanticDiffHighlights?: FlowGraphSemanticDiffHighlights;
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
    semanticDiffHighlights: params.semanticDiffHighlights,
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
    ? createReactFlowData({
        graph: expandedGraph.graph,
        unitDefinitionByPath: params.unitDefinitionByPath,
        theme: params.theme,
        dialogDataState: params.dialogDataState,
        currentUnitIdState: params.currentUnitIdState,
        options: {
          ...createReactFlowDataOptions(params),
          nodeDecorations: expandedGraph.nodeDecorations,
          positionOverrides: expandedGraph.positionOverrides,
        },
      })
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
  semanticDiffHighlights,
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
          semanticDiffHighlights,
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
      semanticDiffHighlights,
      selectedUnitId,
      theme,
      unitById,
      unitDefinitionByPath,
    ],
  );

  useEffect(() => {
    const startedAt = performance.now();
    const nextFlowData = buildNodesAndEdges(currentUnitId);
    if (ajsDocument && currentUnitId) {
      window.vscode.postMessage(
        createPerformanceEvent({
          operation: "flow_graph_build",
          result: "success",
          durationBucket: toDurationBucket(performance.now() - startedAt),
          nodeCountBucket: toCountBucket(nextFlowData.nodes.length),
          edgeCountBucket: toCountBucket(nextFlowData.edges.length),
        }),
      );
    }
    updateFlowDataState(nextFlowData, setNodes, setEdges);
    prevUnitEntityId.current = currentUnitId;
  }, [ajsDocument, buildNodesAndEdges, currentUnitId, prevUnitEntityId]);

  return { edges, nodes };
};
