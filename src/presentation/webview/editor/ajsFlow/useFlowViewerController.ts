import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import type { Theme } from "@mui/material/styles";
import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import {
  AjsDocument,
  AjsUnit,
  flattenAjsUnits,
} from "../../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinitionByPath,
  UnitDefinitionDialogDto,
} from "../../../../application/unit-definition/buildUnitDefinition";
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

const useFlowViewerRefs = () => {
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node, Edge> | null>(
    null,
  );
  const preserveSearchOnNextScopeChange = useRef<boolean>(false);
  const prevUnitEntityId = useRef<string | undefined>(undefined);

  return {
    preserveSearchOnNextScopeChange,
    prevUnitEntityId,
    reactFlowInstanceRef,
  };
};

const flattenDocumentUnits = (
  ajsDocument: AjsDocument | undefined,
): AjsUnit[] => (ajsDocument ? flattenAjsUnits(ajsDocument.rootUnits) : []);

const useUnitById = (ajsDocument: AjsDocument | undefined) => {
  const allUnits = useMemo(
    () => flattenDocumentUnits(ajsDocument),
    [ajsDocument],
  );
  return useMemo(
    () => new Map(allUnits.map((unit) => [unit.id, unit])),
    [allUnits],
  );
};

const useUnitDefinitionByPath = (ajsDocument: AjsDocument | undefined) =>
  useMemo(
    () =>
      ajsDocument
        ? buildUnitDefinitionByPath(ajsDocument)
        : new Map<string, UnitDefinitionDialogDto>(),
    [ajsDocument],
  );

const useCurrentUnit = (
  currentUnitId: string | undefined,
  unitById: ReadonlyMap<string, AjsUnit>,
) =>
  useMemo(
    () => (currentUnitId ? unitById.get(currentUnitId) : undefined),
    [currentUnitId, unitById],
  );

const useFlowDocumentState = (
  ajsDocument: AjsDocument | undefined,
  currentUnitId: string | undefined,
) => {
  const unitById = useUnitById(ajsDocument);
  const unitDefinitionByPath = useUnitDefinitionByPath(ajsDocument);
  const currentUnit = useCurrentUnit(currentUnitId, unitById);

  return {
    currentUnit,
    unitById,
    unitDefinitionByPath,
  };
};

const useCurrentUnitIdState = (
  currentUnitId: string | undefined,
  setCurrentUnitId: Dispatch<SetStateAction<string | undefined>>,
) =>
  useMemo<CurrentUnitIdStateType>(
    () => ({
      currentUnitId,
      setCurrentUnitId,
    }),
    [currentUnitId, setCurrentUnitId],
  );

const useFlowViewerUiState = () => {
  const [menuStatus, setMenuStatus] = useState({ menuItem1: true });
  const [drawerWidth, setDrawerWidth] = useState<number>(0);
  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
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
  const dialogDataState = useMemo<DialogDataStateType>(
    () => ({
      dialogData,
      setDialogData,
    }),
    [dialogData],
  );

  return {
    dialogData,
    dialogDataState,
    drawerWidth,
    drawerWidthState,
    flowMenuState,
    menuStatus,
    setDialogData,
  };
};

export const useFlowViewerController = ({
  theme,
}: UseFlowViewerControllerParams) => {
  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const {
    preserveSearchOnNextScopeChange,
    prevUnitEntityId,
    reactFlowInstanceRef,
  } = useFlowViewerRefs();
  const {
    dialogData,
    dialogDataState,
    drawerWidth,
    drawerWidthState,
    flowMenuState,
    menuStatus,
    setDialogData,
  } = useFlowViewerUiState();
  const { currentUnit, unitById, unitDefinitionByPath } = useFlowDocumentState(
    ajsDocument,
    currentUnitId,
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

  const currentUnitIdState = useCurrentUnitIdState(
    currentUnitId,
    setCurrentUnitId,
  );
  const {
    focusRequestVersion,
    handleRevealUnit,
    handleSearchClear,
    handleSearchNavigate,
    handleSearchSubmit,
    resetSearch,
    searchedUnitId,
    searchMatchedUnitIds,
    searchResultPosition,
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
  useFlowViewerFitView({
    edges,
    focusRequestVersion,
    nodes,
    reactFlowInstanceRef,
    searchedUnitId,
  });
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
    handleSearchNavigate,
    handleSearchSubmit,
    hasExpandedAllNestedUnits,
    menuStatus,
    nodes,
    reactFlowInstanceRef,
    searchedUnitId,
    searchResultPosition,
    setDialogData,
    toggleExpandAllNestedUnits,
    unitById,
  };
};
