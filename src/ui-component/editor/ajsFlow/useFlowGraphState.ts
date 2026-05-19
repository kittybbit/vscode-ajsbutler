import { MutableRefObject, useCallback, useEffect, useState } from "react";
import type { Theme } from "@mui/material/styles";
import { Edge, Node } from "@xyflow/react";
import { AjsDocument, AjsUnit } from "../../../domain/models/ajs/AjsDocument";
import { UnitDefinitionDialogDto } from "../../../application/unit-definition/buildUnitDefinition";
import { buildExpandedFlowGraph } from "./buildExpandedFlowGraph";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
  NestedExpansionStateType,
} from "./flowViewerStateTypes";
import { createReactFlowData } from "./flowGraphView";

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
  theme: Theme;
  unitById: ReadonlyMap<string, AjsUnit>;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
};

const emptyFlowData = (): { nodes: Node[]; edges: Edge[] } => ({
  nodes: [],
  edges: [],
});

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
  theme,
  unitById,
  unitDefinitionByPath,
}: UseFlowGraphStateParams) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const buildNodesAndEdges = useCallback(
    (selectedUnitId?: string): { nodes: Node[]; edges: Edge[] } => {
      if (!selectedUnitId || !ajsDocument) {
        return emptyFlowData();
      }

      const { graph, positionOverrides, nodeDecorations } =
        buildExpandedFlowGraph(
          ajsDocument,
          selectedUnitId,
          expandedUnitIds,
          theme.typography.htmlFontSize,
        );
      if (!graph) {
        return emptyFlowData();
      }

      return createReactFlowData(
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
    },
    [
      ajsDocument,
      currentUnitIdState,
      dialogDataState,
      expandedUnitIds,
      nestedExpansionState,
      searchedUnitId,
      searchMatchedUnitIds,
      theme,
      unitById,
      unitDefinitionByPath,
    ],
  );

  useEffect(() => {
    const nextFlowData = buildNodesAndEdges(currentUnitId);
    setNodes(() => nextFlowData.nodes);
    setEdges(() => nextFlowData.edges);
    prevUnitEntityId.current = currentUnitId;
  }, [buildNodesAndEdges, currentUnitId, prevUnitEntityId]);

  return { edges, nodes };
};
