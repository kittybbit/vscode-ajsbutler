import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme, type Theme } from "@mui/material/styles";
import { type Table as ReactTable, useReactTable } from "@tanstack/react-table";
import {
  Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import type {
  UnitListRowView,
  UnitListUnitMetadataDto,
} from "../../../../application/unit-list/buildUnitListView";
import {
  toCountBucket,
  toDurationBucket,
} from "../../../../application/telemetry/telemetryBuckets";
import {
  toUnitListTableData,
  type UnitListRootDto,
  type UnitListTableDataDto,
} from "../../../../application/unit-list/unitListDocument";
import { toUnitDefinitionByPath } from "../../../../application/unit-definition/unitDefinitionDocument";
import { useMyAppContext } from "../MyContexts";
import { tableColumnDef, tableDefaultColumnDef } from "./tableColumnDef";
import { ParameterSearchValuesByPath } from "./globalFilter";
import Header from "./Header";
import VirtualizedTable from "./VirtualizedTable";
import UnitDefinitionDialog from "../UnitDefinitionDialog";
import { CHANGE_DOCUMENT, REVEAL_UNIT } from "../../viewerHostMessages";
import {
  createViewerOperationRequest,
  createViewerPerformanceRequest,
  createViewerReadyRequest,
} from "../../viewerRequestMessages";
import UnitTreeSelector from "../shared/UnitTreeSelector";
import {
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  selectUnitTreeUnitInTable,
  type TableGridFocusRequest,
} from "./navigation";
import { getTableSearchResultPosition } from "./tableSearchState";
import type {
  TableSearchDirection,
  TableSearchState,
} from "./tableSearchState";
import UnitListDetailPanel from "./UnitListDetailPanel";
import {
  createUnitListDetailResolver,
  resolveUnitListDetail,
} from "./unitListDetail";
import {
  findRowIndexByIdentity,
  useTableRowRevealState,
} from "./tableRowReveal";
import { useTableSearchController } from "./tableSearchController";
import { createTableViewerData, findSelectedUnitId } from "./tableViewerData";

export type AjsTableSearchState = {
  query: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
};

type TableDocumentState = {
  tableData: UnitListTableDataDto | undefined;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
  changeDocument: (type: string, data: unknown) => void;
};

type TableModelSetupContext = {
  rowViews: UnitListRowView[] | undefined;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  lang: string;
  handleJump: (id: string) => void;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

type TableViewerShellProps = {
  theme: Theme;
  table: ReactTable<UnitListRowView>;
  rows: Row<UnitListRowView>[];
  totalRowCount: number;
  searchQuery: string;
  searchState: TableSearchState;
  onSearchNavigate: (query: string, direction: TableSearchDirection) => void;
  onSearchSubmit: (query: string) => void;
  onSearchClear: () => void;
  rowIndex: number | undefined;
  columnVisibility: VisibilityState;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  detailPaneClosed: boolean;
  closeDetailPane: VoidFunction;
  detailFocusRequestRevision: number;
  dialogData: UnitDefinitionDialogDto | undefined;
  setDialogData: React.Dispatch<
    React.SetStateAction<UnitDefinitionDialogDto | undefined>
  >;
  selectedAbsolutePath: string | undefined;
  selectedDetail: ReturnType<typeof resolveUnitListDetail>;
  selectedUnitId: string | undefined;
  selectRow: (absolutePath: string) => void;
  openDetailPane: (absolutePath: string) => void;
  handleDetailFocusRequest: (revision: number) => void;
  returnToGrid: VoidFunction;
  restoreGridFocusRequest: TableGridFocusRequest;
  rootUnits: UnitListRootDto[];
  unitById: ReadonlyMap<string, UnitListUnitMetadataDto>;
  selectTreeUnit: (unitId: string) => void;
  openTreeUnitScope: (unitId: string) => void;
};

type ParsedTableDocumentState = {
  tableData: UnitListTableDataDto | undefined;
  unitDefinitionByPath: ReadonlyMap<string, UnitDefinitionDialogDto>;
};

const isSelectableTableFlowScopeUnit = (unit: {
  unitType: string;
  isRootJobnet: boolean;
}): boolean => unit.unitType === "n" && unit.isRootJobnet;

export const parseTableDocumentState = (
  data: unknown,
): ParsedTableDocumentState => {
  return {
    tableData: toUnitListTableData(data),
    unitDefinitionByPath: toUnitDefinitionByPath(data),
  };
};

const useChangeDocument = (): TableDocumentState => {
  const [tableData, setTableData] = useState<UnitListTableDataDto>();
  const [unitDefinitionByPath, setUnitDefinitionByPath] = useState<
    ReadonlyMap<string, UnitDefinitionDialogDto>
  >(new Map());
  const changeDocument = useCallback((type: string, data: unknown) => {
    try {
      const nextState = parseTableDocumentState(data);
      setTableData(() => nextState.tableData);
      setUnitDefinitionByPath(() => nextState.unitDefinitionByPath);
    } catch (error) {
      console.error("Failed to parse data:", error);
      setTableData(() => undefined);
      setUnitDefinitionByPath(() => new Map());
    }
  }, []);
  return { tableData, unitDefinitionByPath, changeDocument };
};

const useTableModelSetup = ({
  rowViews,
  parameterSearchValuesByPath,
  lang,
  handleJump,
  rowViewByPath,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
}: TableModelSetupContext) => {
  const columns = useMemo(
    () => tableColumnDef(lang, handleJump, rowViewByPath),
    [lang, handleJump, rowViewByPath],
  );

  const table = useReactTable<UnitListRowView>({
    columns,
    data: rowViews ?? [],
    state: {
      columnVisibility,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: tableDefaultColumnDef,
    debugAll: DEVELOPMENT,
  });

  return { table, parameterSearchValuesByPath };
};

const useTableViewerTheme = (isDarkMode: boolean): Theme =>
  useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );

const reportTableOperation = (
  operation: Parameters<typeof createViewerOperationRequest>[0],
): void => {
  window.vscode.postMessage(createViewerOperationRequest(operation));
};

export const createTableRenderReadyEvent = (
  durationMs: number,
  rowCount: number,
) =>
  createViewerPerformanceRequest({
    operation: "table_render",
    result: "success",
    durationBucket: toDurationBucket(durationMs),
    rowCountBucket: toCountBucket(rowCount),
  });

const TableViewerShell = ({
  theme,
  table,
  rows,
  totalRowCount,
  searchQuery,
  searchState,
  onSearchNavigate,
  onSearchSubmit,
  onSearchClear,
  rowIndex,
  columnVisibility,
  parameterSearchValuesByPath,
  detailPaneClosed,
  closeDetailPane,
  detailFocusRequestRevision,
  dialogData,
  setDialogData,
  selectedAbsolutePath,
  selectedDetail,
  selectRow,
  openDetailPane,
  handleDetailFocusRequest,
  returnToGrid,
  restoreGridFocusRequest,
  selectedUnitId,
  rootUnits,
  unitById,
  selectTreeUnit,
  openTreeUnitScope,
}: TableViewerShellProps) => (
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack
        direction="column"
        spacing={0}
        sx={{
          width: "100%",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Header
          table={table}
          columnVisibility={columnVisibility}
          searchedAbsolutePath={searchState.searchedAbsolutePath}
          searchResultPosition={getTableSearchResultPosition(searchState)}
          onSearchNavigate={onSearchNavigate}
          onSearchSubmit={onSearchSubmit}
          onSearchClear={onSearchClear}
          visibleRowCount={rows.length}
          totalRowCount={totalRowCount}
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
            <UnitTreeSelector
              rootUnits={rootUnits}
              unitById={unitById}
              selectedUnitId={selectedUnitId}
              autoScrollSelectedUnit={false}
              canOpenScopeUnit={isSelectableTableFlowScopeUnit}
              onOpenScope={openTreeUnitScope}
              onSelectUnit={selectTreeUnit}
            />
            <Box
              sx={{
                flex: 1,
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <VirtualizedTable
                headerGroups={table.getHeaderGroups()}
                rows={rows}
                rowIndex={rowIndex}
                columnVisibility={columnVisibility}
                searchQuery={searchQuery}
                parameterSearchValuesByPath={parameterSearchValuesByPath}
                selectedAbsolutePath={selectedAbsolutePath}
                selectRow={selectRow}
                openDetailPane={openDetailPane}
                restoreFocusRequest={restoreGridFocusRequest}
              />
            </Box>
            {selectedDetail && !detailPaneClosed && (
              <UnitListDetailPanel
                detail={selectedDetail}
                focusRequestRevision={detailFocusRequestRevision}
                onClose={closeDetailPane}
                onFocusRequestHandled={handleDetailFocusRequest}
                onOpenDefinition={() => {
                  reportTableOperation("definition.open");
                  setDialogData(selectedDetail.definition);
                }}
                onOpenFlow={() =>
                  navigateToFlow(selectedDetail.row.absolutePath)
                }
                onReturnFocus={returnToGrid}
              />
            )}
          </Stack>
        </Box>
      </Stack>
      {dialogData && (
        <UnitDefinitionDialog
          dialogData={dialogData}
          onClose={() => setDialogData(undefined)}
        />
      )}
    </ThemeProvider>
    {DEVELOPMENT && (
      <Accordion>
        <AccordionSummary>[DEV] TABLE STATE</AccordionSummary>
        <AccordionDetails>
          <Typography>{JSON.stringify(table.getState(), null, 2)}</Typography>
        </AccordionDetails>
      </Accordion>
    )}
  </>
);

const TableContents = () => {
  console.log("render TableContents.");

  const { isDarkMode, lang } = useMyAppContext();
  const renderReadyStartedAt = useRef(performance.now());

  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [detailPaneClosed, setDetailPaneClosed] = useState(false);
  const [detailFocusRequestRevision, setDetailFocusRequestRevision] =
    useState(0);
  const [restoreGridFocusRequest, setRestoreGridFocusRequest] =
    useState<TableGridFocusRequest>({ revision: 0 });
  const [selectedAbsolutePath, dispatchRowSelection] = useReducer(
    reduceTableRowSelection,
    undefined,
  );
  const selectRow = useCallback((absolutePath: string) => {
    setDetailPaneClosed(false);
    dispatchRowSelection({ type: "select", absolutePath });
  }, []);
  const requestGridFocus = useCallback((absolutePath?: string) => {
    setRestoreGridFocusRequest((request) => ({
      revision: request.revision + 1,
      absolutePath,
    }));
  }, []);
  const closeDetailPane = useCallback(() => {
    setDetailPaneClosed(true);
    requestGridFocus(selectedAbsolutePath);
  }, [requestGridFocus, selectedAbsolutePath]);
  const openDetailPane = useCallback(
    (absolutePath: string) => {
      selectRow(absolutePath);
      setDetailFocusRequestRevision((revision) => revision + 1);
    },
    [selectRow],
  );
  const handleDetailFocusRequest = useCallback((revision: number) => {
    setDetailFocusRequestRevision((current) =>
      current === revision ? 0 : current,
    );
  }, []);
  const returnToGrid = useCallback(() => {
    requestGridFocus(selectedAbsolutePath);
  }, [requestGridFocus, selectedAbsolutePath]);
  const { tableData, unitDefinitionByPath, changeDocument } =
    useChangeDocument();
  const rowViews = tableData?.rows;
  const rowsRef = useRef<ReadonlyArray<Row<UnitListRowView>>>([]);
  const { handleJump, revealPath, revealUnit } = useTableRowRevealState(
    selectRow,
    rowsRef,
    requestGridFocus,
  );

  const viewerData = useMemo(
    () => createTableViewerData(tableData, unitDefinitionByPath),
    [tableData, unitDefinitionByPath],
  );

  const selectTreeUnit = useCallback(
    (unitId: string) => {
      reportTableOperation("unit.select");
      selectUnitTreeUnitInTable(unitId, viewerData.unitById, revealPath);
    },
    [revealPath, viewerData.unitById],
  );
  const openTreeUnitScope = useCallback(
    (unitId: string) => {
      openUnitTreeUnitInFlow(unitId, viewerData.unitById);
    },
    [viewerData.unitById],
  );

  const { table, parameterSearchValuesByPath } = useTableModelSetup({
    rowViews,
    parameterSearchValuesByPath: viewerData.parameterSearchValuesByPath,
    lang,
    handleJump,
    rowViewByPath: viewerData.rowViewByPath,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
  });

  const rows = table.getRowModel().rows;
  rowsRef.current = rows;
  const rowIndex = findRowIndexByIdentity(rows, selectedAbsolutePath);
  const selectedUnitId = findSelectedUnitId(
    selectedAbsolutePath,
    viewerData.unitByAbsolutePath,
  );
  const resolveSelectedDetail = useMemo(
    () =>
      createUnitListDetailResolver(
        viewerData.rowViewByPath,
        viewerData.unitDefinitionByPath,
      ),
    [viewerData.rowViewByPath, viewerData.unitDefinitionByPath],
  );
  const selectedDetail = useMemo(
    () => resolveSelectedDetail(selectedAbsolutePath),
    [resolveSelectedDetail, selectedAbsolutePath],
  );

  const {
    searchQuery,
    searchState,
    navigateSearch,
    submitSearch,
    resetSearch,
  } = useTableSearchController({
    rows,
    parameterSearchValuesByPath,
    revealPath,
  });

  useEffect(() => {
    dispatchRowSelection({ type: "documentChanged" });
    resetSearch();
  }, [tableData, resetSearch]);

  useEffect(() => {
    window.EventBridge.addCallback(CHANGE_DOCUMENT, changeDocument);
    const revealUnitFn = (_type: string, data: unknown) => {
      if (revealUnit(data)) resetSearch();
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    window.vscode.postMessage(
      createTableRenderReadyEvent(
        performance.now() - renderReadyStartedAt.current,
        rowViews?.length ?? 0,
      ),
    );
    window.vscode.postMessage(createViewerReadyRequest());
    return () => {
      window.EventBridge.removeCallback(CHANGE_DOCUMENT, changeDocument);
      window.EventBridge.removeCallback(REVEAL_UNIT, revealUnitFn);
    };
  }, [changeDocument, resetSearch, revealUnit]); // fire this when mount.

  const theme = useTableViewerTheme(isDarkMode);

  return (
    <TableViewerShell
      theme={theme}
      table={table}
      rows={rows}
      totalRowCount={rowViews?.length ?? 0}
      searchQuery={searchQuery}
      searchState={searchState}
      onSearchNavigate={navigateSearch}
      onSearchSubmit={submitSearch}
      onSearchClear={resetSearch}
      rowIndex={rowIndex}
      columnVisibility={columnVisibility}
      parameterSearchValuesByPath={parameterSearchValuesByPath}
      detailPaneClosed={detailPaneClosed}
      closeDetailPane={closeDetailPane}
      detailFocusRequestRevision={detailFocusRequestRevision}
      dialogData={dialogData}
      setDialogData={setDialogData}
      selectedAbsolutePath={selectedAbsolutePath}
      selectedDetail={selectedDetail}
      selectedUnitId={selectedUnitId}
      selectRow={selectRow}
      openDetailPane={openDetailPane}
      handleDetailFocusRequest={handleDetailFocusRequest}
      returnToGrid={returnToGrid}
      restoreGridFocusRequest={restoreGridFocusRequest}
      rootUnits={viewerData.rootUnits}
      unitById={viewerData.unitById}
      selectTreeUnit={selectTreeUnit}
      openTreeUnitScope={openTreeUnitScope}
    />
  );
};
export default memo(TableContents);
