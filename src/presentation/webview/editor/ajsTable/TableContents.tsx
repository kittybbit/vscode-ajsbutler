import React, {
  Dispatch,
  memo,
  SetStateAction,
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
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
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
import { getRevealUnitAbsolutePath } from "../revealUnit";
import UnitTreeSelector from "../shared/UnitTreeSelector";
import {
  navigateToFlow,
  openUnitTreeUnitInFlow,
  reduceTableRowSelection,
  selectUnitTreeUnitInTable,
} from "./navigation";
import {
  createEmptyTableSearchState,
  createSubmittedTableSearchState,
  findTableSearchMatchingAbsolutePaths,
  getTableSearchResultPosition,
  isActiveTableSearchQuery,
  moveTableSearchResult,
  TableSearchDirection,
  TableSearchState,
} from "./tableSearchState";
import UnitListDetailPanel from "./UnitListDetailPanel";
import {
  createUnitListDetailResolver,
  resolveUnitListDetail,
} from "./unitListDetail";

export type AjsTableSearchState = {
  query: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
};

type TableDocumentState = {
  rowViews: UnitListRowView[] | undefined;
  ajsDocument: AjsDocument | undefined;
  changeDocument: (type: string, data: unknown) => void;
};

type TableRowRevealState = {
  rowIndex: number | undefined;
  handleJump: (id: string) => void;
  revealPath: (absolutePath: string) => void;
  revealUnit: (data: unknown) => void;
};

type TableModelSetupContext = {
  ajsDocument: AjsDocument | undefined;
  rowViews: UnitListRowView[] | undefined;
  lang: string;
  handleJump: (id: string) => void;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
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
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  detailPaneClosed: boolean;
  closeDetailPane: VoidFunction;
  dialogData: UnitDefinitionDialogDto | undefined;
  setDialogData: Dispatch<SetStateAction<UnitDefinitionDialogDto | undefined>>;
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

const buildRowIndexMap = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
): Map<string, number> => {
  const map = new Map<string, number>();
  rows.forEach((row, index) => {
    map.set(row.original.id, index);
    map.set(row.original.absolutePath, index);
  });
  return map;
};

const jumpToIndexedRow = (
  rows: ReadonlyArray<Row<UnitListRowView>>,
  id: string,
  setRowIndex: Dispatch<SetStateAction<number | undefined>>,
) => {
  const rowIndexMap = buildRowIndexMap(rows);
  const index = rowIndexMap.get(id);
  if (index !== undefined) {
    setRowIndex(index);
  }
};

const revealTableRow = (
  data: unknown,
  rows: ReadonlyArray<Row<UnitListRowView>>,
  setRowIndex: Dispatch<SetStateAction<number | undefined>>,
  selectRow: (absolutePath: string) => void,
) => {
  const absolutePath = getRevealUnitAbsolutePath(data);
  if (absolutePath) {
    jumpToIndexedRow(rows, absolutePath, setRowIndex);
    selectRow(absolutePath);
  }
};

const useTableRowRevealState = (
  selectRow: (absolutePath: string) => void,
  rowsRef: React.MutableRefObject<ReadonlyArray<Row<UnitListRowView>>>,
): TableRowRevealState => {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);

  const handleJump = useCallback(
    (id: string) => {
      jumpToIndexedRow(rowsRef.current, id, setRowIndex);
    },
    [rowsRef],
  );
  const revealPath = useCallback(
    (absolutePath: string) => {
      jumpToIndexedRow(rowsRef.current, absolutePath, setRowIndex);
      selectRow(absolutePath);
    },
    [rowsRef, selectRow],
  );

  const revealUnit = useCallback(
    (data: unknown) => {
      revealTableRow(data, rowsRef.current, setRowIndex, selectRow);
    },
    [rowsRef, selectRow],
  );

  return { rowIndex, handleJump, revealPath, revealUnit };
};

const useTableModelSetup = ({
  ajsDocument,
  rowViews,
  lang,
  handleJump,
  rowViewByPath,
  sorting,
  setSorting,
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
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<TableSearchState>(
    createEmptyTableSearchState,
  );
  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const [sorting, setSorting] = useState<SortingState>([]);
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
  const { rowIndex, handleJump, revealPath, revealUnit } =
    useTableRowRevealState(selectRow, rowsRef);

  const unitDefinitionByPath = useMemo(
    () =>
      ajsDocument
        ? buildUnitDefinitionByPath(ajsDocument)
        : new Map<string, UnitDefinitionDialogDto>(),
    [ajsDocument],
  );
  const rowViewByPath = useMemo(
    () =>
      new Map(
        (rowViews ?? []).map((rowView) => [rowView.absolutePath, rowView]),
      ),
    [rowViews],
  );
  const allUnits = useMemo(
    () => (ajsDocument ? flattenAjsUnits(ajsDocument.rootUnits) : []),
    [ajsDocument],
  );
  const unitById = useMemo(
    () => new Map(allUnits.map((unit) => [unit.id, unit])),
    [allUnits],
  );
  const unitByAbsolutePath = useMemo(
    () => new Map(allUnits.map((unit) => [unit.absolutePath, unit])),
    [allUnits],
  );

  const selectTreeUnit = useCallback(
    (unitId: string) => {
      selectUnitTreeUnitInTable(unitId, unitById, revealPath);
    },
    [revealPath, unitById],
  );
  const openTreeUnitScope = useCallback(
    (unitId: string) => {
      openUnitTreeUnitInFlow(unitId, unitById);
    },
    [unitById],
  );

  const { table, parameterSearchValuesByPath } = useTableModelSetup({
    ajsDocument,
    rowViews,
    lang,
    handleJump,
    rowViewByPath,
    sorting,
    setSorting,
  });

  const rows = table.getRowModel().rows;
  rowsRef.current = rows;
  const selectedUnitId = selectedAbsolutePath
    ? unitByAbsolutePath.get(selectedAbsolutePath)?.id
    : undefined;
  const resolveSelectedDetail = useMemo(
    () => createUnitListDetailResolver(rowViewByPath, unitDefinitionByPath),
    [rowViewByPath, unitDefinitionByPath],
  );
  const selectedDetail = useMemo(
    () => resolveSelectedDetail(selectedAbsolutePath),
    [resolveSelectedDetail, selectedAbsolutePath],
  );

  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setSearchState(createEmptyTableSearchState());
  }, []);

  useEffect(() => {
    dispatchRowSelection({ type: "documentChanged" });
    resetSearch();
  }, [ajsDocument, resetSearch]);

  const submitSearch = useCallback(
    (query: string) => {
      const matchedAbsolutePaths = findTableSearchMatchingAbsolutePaths(
        rows,
        parameterSearchValuesByPath,
        query,
      );
      const nextState = createSubmittedTableSearchState(
        query,
        matchedAbsolutePaths,
      );
      setSearchQuery(query);
      setSearchState(nextState);
      if (nextState.searchedAbsolutePath) {
        revealPath(nextState.searchedAbsolutePath);
      }
    },
    [parameterSearchValuesByPath, revealPath, rows],
  );

  const navigateSearch = useCallback(
    (query: string, direction: TableSearchDirection) => {
      if (!isActiveTableSearchQuery(searchState, query)) {
        submitSearch(query);
        return;
      }
      const nextState = moveTableSearchResult(searchState, direction);
      setSearchState(nextState);
      if (nextState.searchedAbsolutePath) {
        revealPath(nextState.searchedAbsolutePath);
      }
    },
    [revealPath, searchState, submitSearch],
  );

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
      parameterSearchValuesByPath={parameterSearchValuesByPath}
      detailPaneClosed={detailPaneClosed}
      closeDetailPane={() => setDetailPaneClosed(true)}
      dialogData={dialogData}
      setDialogData={setDialogData}
      selectedAbsolutePath={selectedAbsolutePath}
      selectedDetail={selectedDetail}
      selectedUnitId={selectedUnitId}
      selectRow={selectRow}
      rootUnits={ajsDocument?.rootUnits ?? []}
      unitById={unitById}
      selectTreeUnit={selectTreeUnit}
      openTreeUnitScope={openTreeUnitScope}
    />
  );
};
export default memo(TableContents);
