import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useReactTable } from "@tanstack/react-table";
import {
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import {
  AjsDocument,
  flattenAjsUnits,
} from "../../../domain/models/ajs/AjsDocument";
import {
  buildUnitDefinitionByPath,
  UnitDefinitionDialogDto,
} from "../../../application/unit-definition/buildUnitDefinition";
import {
  buildUnitListView,
  UnitListRowView,
} from "../../../application/unit-list/buildUnitListView";
import {
  toAjsDocument,
  UnitListDocumentDto,
} from "../../../application/unit-list/unitListDocument";
import { useMyAppContext } from "../MyContexts";
import { tableColumnDef, tableDefaultColumnDef } from "./tableColumnDef";
import {
  AjsTableSearchMode,
  createAjsGlobalFilterFn,
  ParameterSearchValuesByPath,
} from "./globalFilter";
import Header from "./Header";
import VirtualizedTable from "./VirtualizedTable";
import DisplayColumnSelector from "./DisplayColumnSelector";
import UnitEntityDialog from "../UnitEntityDialog";
import { REVEAL_UNIT } from "../../../shared/webviewEvents";
import {
  findRowIndexByAbsolutePath,
  getRevealUnitAbsolutePath,
} from "../revealUnit";

export type TableMenuStatusType = {
  menuItem1: boolean;
};
export type TableMenuStateType = {
  menuStatus: TableMenuStatusType;
  setMenuStatus: Dispatch<SetStateAction<TableMenuStatusType>>;
};
export type DrawerWidthStateType = {
  drawerWidth: number;
  setDrawerWidth: Dispatch<SetStateAction<number>>;
};
export type AjsTableSearchState = {
  globalFilter: string;
  searchMode: AjsTableSearchMode;
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
  revealUnit: (data: unknown) => void;
  syncRows: (rows: ReadonlyArray<Row<UnitListRowView>>) => void;
};

type TableRowIndexSyncContext = {
  rows: ReadonlyArray<Row<UnitListRowView>>;
  revealedAbsolutePath: string | undefined;
  rowIndexMapRef: React.MutableRefObject<Map<string, number>>;
  setRowIndex: Dispatch<SetStateAction<number | undefined>>;
  setRevealedAbsolutePath: Dispatch<SetStateAction<string | undefined>>;
};

type TableModelSetupContext = {
  ajsDocument: AjsDocument | undefined;
  rowViews: UnitListRowView[] | undefined;
  lang: string;
  openUnitDefinition: (absolutePath: string) => void;
  handleJump: (id: string) => void;
  rowViewByPath: ReadonlyMap<string, UnitListRowView>;
  globalFilter: string;
  sorting: SortingState;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  searchMode: AjsTableSearchMode;
};

type ParsedTableDocumentState = {
  rowViews: UnitListRowView[];
  ajsDocument: AjsDocument | undefined;
};

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
  rowIndexMap: ReadonlyMap<string, number>,
  id: string,
  setRowIndex: Dispatch<SetStateAction<number | undefined>>,
) => {
  const index = rowIndexMap.get(id);
  if (index !== undefined) {
    setRowIndex(index);
  }
};

const revealTableRow = (
  data: unknown,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
  setRevealedAbsolutePath: Dispatch<SetStateAction<string | undefined>>,
) => {
  const absolutePath = getRevealUnitAbsolutePath(data);
  if (absolutePath) {
    setGlobalFilter("");
    setRevealedAbsolutePath(absolutePath);
  }
};

const syncTableRowIndexMap = ({
  rows,
  revealedAbsolutePath,
  rowIndexMapRef,
  setRowIndex,
  setRevealedAbsolutePath,
}: TableRowIndexSyncContext) => {
  const rowIndexMap = buildRowIndexMap(rows);
  rowIndexMapRef.current = rowIndexMap;
  const index = revealedAbsolutePath
    ? findRowIndexByAbsolutePath(rowIndexMap, revealedAbsolutePath)
    : undefined;
  if (index !== undefined) {
    setRowIndex(index);
    setRevealedAbsolutePath(undefined);
  }
};

const useTableRowRevealState = (
  globalFilter: string,
  setGlobalFilter: Dispatch<SetStateAction<string>>,
): TableRowRevealState => {
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);
  const [revealedAbsolutePath, setRevealedAbsolutePath] = useState<
    string | undefined
  >(undefined);
  const rowIndexMapRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setRowIndex(() => undefined);
  }, [globalFilter]);

  const handleJump = useCallback((id: string) => {
    jumpToIndexedRow(rowIndexMapRef.current, id, setRowIndex);
  }, []);

  const revealUnit = useCallback(
    (data: unknown) => {
      revealTableRow(data, setGlobalFilter, setRevealedAbsolutePath);
    },
    [setGlobalFilter],
  );

  const syncRows = useCallback(
    (rows: ReadonlyArray<Row<UnitListRowView>>) => {
      syncTableRowIndexMap({
        rows,
        revealedAbsolutePath,
        rowIndexMapRef,
        setRowIndex,
        setRevealedAbsolutePath,
      });
    },
    [revealedAbsolutePath],
  );

  return { rowIndex, handleJump, revealUnit, syncRows };
};

const useTableModelSetup = ({
  ajsDocument,
  rowViews,
  lang,
  openUnitDefinition,
  handleJump,
  rowViewByPath,
  globalFilter,
  sorting,
  setGlobalFilter,
  setSorting,
  searchMode,
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
  const globalFilterFn = useMemo(
    () => createAjsGlobalFilterFn(parameterSearchValuesByPath, searchMode),
    [parameterSearchValuesByPath, searchMode],
  );
  const columns = useMemo(
    () => tableColumnDef(lang, openUnitDefinition, handleJump, rowViewByPath),
    [lang, openUnitDefinition, handleJump, rowViewByPath],
  );

  const table = useReactTable<UnitListRowView>({
    columns,
    data: rowViews ?? [],
    state: {
      globalFilter,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    getColumnCanGlobalFilter: () => true, // return true for all column
    defaultColumn: tableDefaultColumnDef,
    debugAll: DEVELOPMENT,
  });

  return { table, parameterSearchValuesByPath };
};

const TableContents = () => {
  console.log("render TableContents.");

  const { isDarkMode, lang, scrollType } = useMyAppContext();

  const [menuStatus, setMenuStatus] = useState<TableMenuStatusType>({
    menuItem1: false,
  });
  // control dialog
  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchMode, setSearchMode] = useState<AjsTableSearchMode>("value");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [drawerWidth, setDrawerWidth] = useState<number>(0);
  const { rowViews, ajsDocument, changeDocument } = useChangeDocument();
  const { rowIndex, handleJump, revealUnit, syncRows } = useTableRowRevealState(
    globalFilter,
    setGlobalFilter,
  );

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

  const openUnitDefinition = useCallback(
    (absolutePath: string) => {
      setDialogData(() => unitDefinitionByPath.get(absolutePath));
    },
    [unitDefinitionByPath],
  );

  useEffect(() => {
    window.EventBridge.addCallback("changeDocument", changeDocument);
    const revealUnitFn = (_type: string, data: unknown) => {
      revealUnit(data);
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocument);
      window.EventBridge.removeCallback(REVEAL_UNIT, revealUnitFn);
    };
  }, []); // fire this when mount.

  const { table, parameterSearchValuesByPath } = useTableModelSetup({
    ajsDocument,
    rowViews,
    lang,
    openUnitDefinition,
    handleJump,
    rowViewByPath,
    globalFilter,
    sorting,
    setGlobalFilter,
    setSorting,
    searchMode,
  });

  const rows = table.getRowModel().rows;

  useEffect(() => {
    syncRows(rows);
  }, [rows, syncRows]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode],
  );

  const tableStateDev = DEVELOPMENT && (
    <Accordion>
      <AccordionSummary>[DEV] TABLE STATE</AccordionSummary>
      <AccordionDetails>
        <Typography>{JSON.stringify(table.getState(), null, 2)}</Typography>
      </AccordionDetails>
    </Accordion>
  );

  const tableMenuState = useMemo(
    () => ({ menuStatus, setMenuStatus }),
    [menuStatus],
  );

  const drawerWidthState = useMemo(
    () => ({ drawerWidth, setDrawerWidth }),
    [drawerWidth],
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack direction="row" spacing={0}>
          {menuStatus.menuItem1 && (
            <DisplayColumnSelector
              table={table}
              columnVisibility={table.getState().columnVisibility}
              tableMenuState={tableMenuState}
              drawerWidthState={drawerWidthState}
            />
          )}
          <Stack
            direction="column"
            spacing={0}
            sx={{
              marginLeft: `${drawerWidth}px`,
              width: `calc(100% - ${drawerWidth}px)`,
              minWidth: 0,
            }}
          >
            <Header
              table={table}
              tableMenuState={tableMenuState}
              drawerWidthState={drawerWidthState}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
            />
            <VirtualizedTable
              headerGroups={table.getHeaderGroups()}
              rows={rows}
              scrollType={scrollType}
              rowIndex={rowIndex}
              searchState={{
                globalFilter,
                searchMode,
                parameterSearchValuesByPath,
              }}
            />
            <Typography align="right">
              {rows.length} of {rowViews?.length}
            </Typography>
          </Stack>
        </Stack>
        {dialogData && (
          <UnitEntityDialog
            dialogData={dialogData}
            onClose={() => setDialogData(undefined)}
          />
        )}
      </ThemeProvider>
      {tableStateDev}
    </>
  );
};
export default memo(TableContents);
