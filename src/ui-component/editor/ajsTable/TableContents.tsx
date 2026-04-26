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
import { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import { toAjsDocument } from "../../../application/unit-list/unitListDocumentView";
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

const useChangeDocument = (): [
  UnitListRowView[] | undefined,
  AjsDocument | undefined,
  (type: string, data: unknown) => void,
] => {
  const [rowViews, setRowViews] = useState<UnitListRowView[]>();
  const [ajsDocument, setAjsDocument] = useState<AjsDocument>();
  const changeDocumentFn = useCallback((type: string, data: unknown) => {
    try {
      const nextDocument = data
        ? toAjsDocument(data as UnitListDocumentDto)
        : undefined;
      const nextRowViews = nextDocument ? buildUnitListView(nextDocument) : [];
      setAjsDocument(() => nextDocument);
      setRowViews(() => nextRowViews);
    } catch (error) {
      console.error("Failed to parse data:", error);
      setAjsDocument(() => undefined);
      setRowViews(() => []);
    }
  }, []);
  return [rowViews, ajsDocument, changeDocumentFn];
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
  const [rowIndex, setRowIndex] = useState<number | undefined>(undefined);
  const [revealedAbsolutePath, setRevealedAbsolutePath] = useState<
    string | undefined
  >(undefined);
  const [rowViews, ajsDocument, changeDocumentFn] = useChangeDocument();

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
    window.EventBridge.addCallback("changeDocument", changeDocumentFn);
    const revealUnitFn = (_type: string, data: unknown) => {
      const absolutePath = getRevealUnitAbsolutePath(data);
      if (!absolutePath) {
        return;
      }
      setGlobalFilter("");
      setRevealedAbsolutePath(absolutePath);
    };
    window.EventBridge.addCallback(REVEAL_UNIT, revealUnitFn);
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocumentFn);
      window.EventBridge.removeCallback(REVEAL_UNIT, revealUnitFn);
    };
  }, []); // fire this when mount.

  useEffect(() => {
    setRowIndex(() => undefined);
  }, [globalFilter]);

  const handleJumpRef = useRef<(id: string) => void>(() => {});
  const handleJump = useCallback((id: string) => handleJumpRef.current(id), []);
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

  const table = useReactTable<UnitListRowView>({
    columns: useMemo(
      () => tableColumnDef(lang, openUnitDefinition, handleJump, rowViewByPath),
      [lang, openUnitDefinition, handleJump, rowViewByPath],
    ),
    data: rowViews ?? [],
    state: {
      globalFilter: globalFilter,
      sorting: sorting,
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

  const rows = table.getRowModel().rows;

  const rowIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row, index) => {
      map.set(row.original.id, index);
      map.set(row.original.absolutePath, index);
    });
    return map;
  }, [rows]);

  useEffect(() => {
    if (!revealedAbsolutePath) {
      return;
    }
    const index = findRowIndexByAbsolutePath(rowIndexMap, revealedAbsolutePath);
    if (index === undefined) {
      return;
    }
    setRowIndex(index);
    setRevealedAbsolutePath(undefined);
  }, [revealedAbsolutePath, rowIndexMap]);

  useEffect(() => {
    handleJumpRef.current = (id: string) => {
      const index = rowIndexMap.get(id);
      if (index !== undefined) setRowIndex(index);
    };
  }, [rowIndexMap]);

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
