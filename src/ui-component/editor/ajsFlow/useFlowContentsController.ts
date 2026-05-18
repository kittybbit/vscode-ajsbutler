import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Theme } from "@mui/material/styles";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
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
import { REVEAL_UNIT } from "../../../shared/webviewEvents";
import {
  getRevealUnitAbsolutePath,
  resolveFlowRevealTarget,
} from "../revealUnit";
import { buildExpandedFlowGraph } from "./buildExpandedFlowGraph";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
  NestedExpansionStateType,
} from "./flowContentStateTypes";
import { createReactFlowData } from "./flowGraphView";
import { findFlowSearchResult } from "./flowSearch";
import {
  collapseExpandedNestedUnitIds,
  collectExpandableNestedUnitIds,
  hasExpandedAllNestedUnitIds,
} from "./nestedExpansion";

type UseFlowContentsControllerParams = {
  theme: Theme;
};

export const useFlowContentsController = ({
  theme,
}: UseFlowContentsControllerParams) => {
  const [menuStatus, setMenuStatus] = useState({ menuItem1: true });
  const [drawerWidth, setDrawerWidth] = useState<number>(0);
  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const [searchedUnitId, setSearchedUnitId] = useState<string>();
  const [searchMatchedUnitIds, setSearchMatchedUnitIds] = useState<string[]>(
    [],
  );
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node, Edge> | null>(
    null,
  );
  const fitViewFrameRef = useRef<number | undefined>(undefined);
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
          expandedUnitIds,
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
      expandedUnitIds,
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
    if (!reactFlowInstanceRef.current || nodes.length === 0) {
      return undefined;
    }

    if (fitViewFrameRef.current) {
      window.cancelAnimationFrame(fitViewFrameRef.current);
    }

    fitViewFrameRef.current = window.requestAnimationFrame(() => {
      void reactFlowInstanceRef.current?.fitView({ padding: 0.22 });
      fitViewFrameRef.current = undefined;
    });

    return () => {
      if (fitViewFrameRef.current) {
        window.cancelAnimationFrame(fitViewFrameRef.current);
        fitViewFrameRef.current = undefined;
      }
    };
  }, [nodes, edges]);

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
    const changeDocumentFn = (_type: string, data: unknown) => {
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
  }, []);

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

  const flowMenuState = useMemo<FlowMenuStateType>(
    () => ({
      menuStatus,
      setMenuStatus,
    }),
    [menuStatus],
  );
  const drawerWidthState = useMemo<DrawerWidthStateType>(
    () => ({
      drawerWidth,
      setDrawerWidth,
    }),
    [drawerWidth],
  );

  return {
    ajsDocument,
    currentUnit,
    currentUnitIdState,
    dialogData,
    drawerWidth,
    drawerWidthState,
    edges,
    expandableNestedUnitIds,
    flowMenuState,
    handleSearchClear,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    menuStatus,
    nodes,
    reactFlowInstanceRef,
    searchedUnitId,
    setDialogData,
    toggleExpandAllNestedUnits,
    unitById,
  };
};
