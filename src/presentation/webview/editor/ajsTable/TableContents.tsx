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
import {
  AjsDocument,
  AjsUnit,
  flattenAjsUnits,
} from "../../../../domain/models/ajs/AjsDocument";
import { UnitDefinitionDialogDto } from "../../../../application/unit-definition/buildUnitDefinition";
import {
  buildUnitListView,
  UnitListRowView,
} from "../../../../application/unit-list/buildUnitListView";
import {
  toAjsDocument,
  UnitListDocumentDto,
} from "../../../../application/unit-list/unitListDocument";
import { useMyAppContext } from "../MyContexts";
import { tableColumnDef, tableDefaultColumnDef } from "./tableColumnDef";
import { ParameterSearchValuesByPath } from "./globalFilter";
import Header from "./Header";
import VirtualizedTable from "./VirtualizedTable";
import UnitEntityDialog from "../UnitEntityDialog";
import { REVEAL_UNIT } from "../../../../shared/webviewEvents";
import UnitTreeSelector from "../shared/UnitTreeSelector";
import {
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  selectUnitTreeUnitInTable,
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
  rowViews: UnitListRowView[] | undefined;
  ajsDocument: AjsDocument | undefined;
  changeDocument: (type: string, data: unknown) => void;
};

type TableModelSetupContext = {
  ajsDocument: AjsDocument | undefined;
  rowViews: UnitListRowView[] | undefined;
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
  dialogData: UnitDefinitionDialogDto | undefined;
  setDialogData: React.Dispatch<
    React.SetStateAction<UnitDefinitionDialogDto | undefined>
  >;
  selectedAbsolutePath: string | undefined;
  selectedDetail: ReturnType<typeof resolveUnitListDetail>;
  selectedUnitId: string | undefined;
  selectRow: (absolutePath: string) => void;
  rootUnits: AjsUnit[];
  unitById: ReadonlyMap<string, AjsUnit>;
  selectTreeUnit: (unitId: string) => void;
  openTreeUnitScope: (unitId: string) => void;
};

type ParsedTableDocumentState = {
  rowViews: UnitListRowView[];
  ajsDocument: AjsDocument | undefined;
};

const isSelectableTableFlowScopeUnit = (unit: AjsUnit): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

const parseTableDocumentState = (data: unknown): ParsedTableDocumentState => {
  const ajsDocument = data
    ? toAjsDocument(data as UnitListDocumentDto)
    : undefined;
  return {
    ajsDocument,
    rowViews: ajsDocument ? buildUnitListView(ajsDocument) : [],
  };
};

const useChangeDocument = (): TableDocumentState => {
  const [rowViews, setRowViews] = useState<UnitListRowView[]>();
  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const changeDocument = useCallback((type: string, data: unknown) => {
    try {
      const nextState = parseTableDocumentState(data);
      setAjsDocument(() => nextState.ajsDocument);
      setRowViews(() => nextState.rowViews);
    } catch (error) {
      console.error("Failed to parse data:", error);
      setAjsDocument(() => undefined);
      setRowViews(() => []);
    }
  }, []);
  return { rowViews, ajsDocument, changeDocument };
};

const useTableModelSetup = ({
  ajsDocument,
  rowViews,
  lang,
  handleJump,
  rowViewByPath,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
}: TableModelSetupContext) => {
  const parameterSearchValuesByPath = useMemo(
    () =>
      new Map(
        ajsDocument
          ? flattenAjsUnits(ajsDocument.rootUnits).map((unit) => [
              unit.absolutePath,
              unit.parameters,
            ])
          : [],
      ),
    [ajsDocument],
  );
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
  dialogData,
  setDialogData,
  selectedAbsolutePath,
  selectedDetail,
  selectRow,
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
              />
            </Box>
            {selectedDetail && !detailPaneClosed && (
              <UnitListDetailPanel
                detail={selectedDetail}
                onClose={closeDetailPane}
                onOpenDefinition={() =>
                  setDialogData(selectedDetail.definition)
                }
                onOpenFlow={() =>
                  navigateToFlow(selectedDetail.row.absolutePath)
                }
              />
            )}
          </Stack>
        </Box>
      </Stack>
      {dialogData && (
        <UnitEntityDialog
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

  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [detailPaneClosed, setDetailPaneClosed] = useState(false);
  const [selectedAbsolutePath, dispatchRowSelection] = useReducer(
    reduceTableRowSelection,
    undefined,
  );
  const selectRow = useCallback((absolutePath: string) => {
    setDetailPaneClosed(false);
    dispatchRowSelection({ type: "select", absolutePath });
  }, []);
  const { rowViews, ajsDocument, changeDocument } = useChangeDocument();
  const rowsRef = useRef<ReadonlyArray<Row<UnitListRowView>>>([]);
  const { handleJump, revealPath, revealUnit } = useTableRowRevealState(
    selectRow,
    rowsRef,
  );

  const viewerData = useMemo(
    () => createTableViewerData(ajsDocument, rowViews),
    [ajsDocument, rowViews],
  );

  const selectTreeUnit = useCallback(
    (unitId: string) => {
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
    ajsDocument,
    rowViews,
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
  }, [ajsDocument, resetSearch]);

  useEffect(() => {
    window.EventBridge.addCallback("changeDocument", changeDocument);
    const revealUnitFn = (_type: string, data: unknown) => {
      resetSearch();
      revealUnit(data);
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocument);
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
      closeDetailPane={() => setDetailPaneClosed(true)}
      dialogData={dialogData}
      setDialogData={setDialogData}
      selectedAbsolutePath={selectedAbsolutePath}
      selectedDetail={selectedDetail}
      selectedUnitId={selectedUnitId}
      selectRow={selectRow}
      rootUnits={viewerData.rootUnits}
      unitById={viewerData.unitById}
      selectTreeUnit={selectTreeUnit}
      openTreeUnitScope={openTreeUnitScope}
    />
  );
};
export default memo(TableContents);
