import { useMemo, useRef, useState } from "react";
import type { Theme } from "@mui/material/styles";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import {
  AjsDocument,
  flattenAjsUnits,
} from "../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinitionByPath,
  UnitDefinitionDialogDto,
} from "../../../application/unit-definition/buildUnitDefinition";
import {
  CurrentUnitIdStateType,
  DialogDataStateType,
  DrawerWidthStateType,
  FlowMenuStateType,
} from "./flowViewerStateTypes";
import { useFlowGraphState } from "./useFlowGraphState";
import {
  useFlowDocumentSubscription,
  useFlowScopeReset,
  useFlowViewerFitView,
  useFlowViewerOverflow,
  useRevealUnitSubscription,
} from "./useFlowViewerEffects";
import { useFlowSearchState } from "./useFlowSearchState";
import { useNestedExpansionState } from "./useNestedExpansionState";

type UseFlowViewerControllerParams = {
  theme: Theme;
};

export const useFlowViewerController = ({
  theme,
}: UseFlowViewerControllerParams) => {
  const [menuStatus, setMenuStatus] = useState({ menuItem1: true });
  const [drawerWidth, setDrawerWidth] = useState<number>(0);
  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node, Edge> | null>(
    null,
  );
  const preserveSearchOnNextScopeChange = useRef<boolean>(false);
  const prevUnitEntityId = useRef<string | undefined>(undefined);
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

  const {
    expandableNestedUnitIds,
    hasExpandedAllNestedUnits,
    nestedExpansionState,
    toggleExpandAllNestedUnits,
  } = useNestedExpansionState({
    currentUnit,
    expandedUnitIds,
    setExpandedUnitIds,
    unitById,
  });

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
  const {
    handleRevealUnit,
    handleSearchClear,
    handleSearchSubmit,
    resetSearch,
    searchedUnitId,
    searchMatchedUnitIds,
  } = useFlowSearchState({
    currentUnit,
    preserveSearchOnNextScopeChange,
    setCurrentUnitId,
    setExpandedUnitIds,
    unitById,
  });
  const { edges, nodes } = useFlowGraphState({
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
  });
  useFlowViewerFitView({ edges, nodes, reactFlowInstanceRef });
  useFlowScopeReset({
    ajsDocument,
    currentUnitId,
    preserveSearchOnNextScopeChange,
    resetSearch,
    setExpandedUnitIds,
  });
  useFlowDocumentSubscription({
    prevUnitEntityId,
    setAjsDocument,
    setCurrentUnitId,
  });
  useRevealUnitSubscription({ handleRevealUnit });
  useFlowViewerOverflow();

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
