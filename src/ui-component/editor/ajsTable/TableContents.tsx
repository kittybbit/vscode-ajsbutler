import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useReactTable } from "@tanstack/react-table";
import {
  FilterMeta,
  Row,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import { rankItem } from "@tanstack/match-sorter-utils";
import { parse } from "flatted";
import { useMyAppContext } from "../MyContexts";
import { tableColumnDef, tableDefaultColumnDef } from "./tableColumnDef";
import Header from "./Header";
import VirtualizedTable from "./VirtualizedTable";
import { Unit } from "../../../domain/values/Unit";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import { flattenChildren, tyFactory } from "../../../domain/utils/TyUtils";
import DisplayColumnSelector from "./DisplayColumnSelector";
import { AccessorType } from "./columnDefs/common";
import UnitEntityDialog from "../UnitEntityDialog";
import Parameter from "../../../domain/models/parameters/Parameter";

const normalizeValue = (v: unknown) =>
  v instanceof Parameter ? v.value() : String(v);
const ajsGlobalFilterFn = (
  row: Row<UnitEntity>,
  columnId: string,
  value: string,
  addMeta: (meta: FilterMeta) => void,
): boolean => {
  const cellValue = row.getValue<AccessorType>(columnId);
  if (!cellValue) return false;

  const targetValues: AccessorType = Array.isArray(cellValue)
    ? cellValue
    : [cellValue];

  const itemRank = targetValues
    .map(normalizeValue)
    .map((v) => rankItem(v, value))
    .find((v) => v.passed);

  if (!itemRank) return false;

  addMeta(itemRank);
  return itemRank.passed;
};

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

const useChangeDocument = (): [
  UnitEntity[] | undefined,
  (type: string, data: unknown) => void,
] => {
  const [unitEntities, setUnitEntities] = useState<UnitEntity[]>();
  const changeDocumentFn = (type: string, data: unknown) => {
    try {
      const newUnitEntities: UnitEntity[] = (() => {
        try {
          return parse(data as string)
            .map((rootUnitOfJSON: Unit) => Unit.createFromJSON(rootUnitOfJSON)) // all unit in root unit.
            .map((unit: Unit) => tyFactory(unit))
            .map((unitEntity: UnitEntity) => flattenChildren([unitEntity]))
            .flat();
        } catch (error) {
          console.error("Failed to parse data:", error);
          return [];
        }
      })();
      setUnitEntities(() => newUnitEntities);
    } catch {
      setUnitEntities(() => []);
    }
  };
  return [unitEntities, changeDocumentFn];
};

const TableContents = () => {
  console.log("render TableContents.");

  const { isDarkMode, lang, scrollType } = useMyAppContext();

  const [menuStatus, setMenuStatus] = useState<TableMenuStatusType>({
    menuItem1: false,
  });
  // control dialog
  const [dialogData, setDialogData] = useState<UnitEntity | undefined>();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [drawerWidth, setDrawerWidth] = useState<number>(0);
  const [unitEntities, changeDocumentFn] = useChangeDocument();

  useEffect(() => {
    window.EventBridge.addCallback("changeDocument", changeDocumentFn);
    window.vscode.postMessage({ type: "ready" });
    return () => {
      window.EventBridge.removeCallback("changeDocument", changeDocumentFn);
    };
  }, []); // fire this when mount.

  const table = useReactTable<UnitEntity>({
    columns: useMemo(() => tableColumnDef(lang, setDialogData), [lang]),
    data: useMemo(() => unitEntities ?? [], [unitEntities]),
    state: {
      globalFilter: globalFilter,
      sorting: sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: ajsGlobalFilterFn,
    getColumnCanGlobalFilter: () => true, // return true for all column
    defaultColumn: tableDefaultColumnDef,
    debugAll: DEVELOPMENT,
  });

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

  const tableMenuState = { menuStatus, setMenuStatus };
  const drawerWidthState = { drawerWidth, setDrawerWidth };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack direction="row" spacing={0}>
          {menuStatus.menuItem1 && (
            <DisplayColumnSelector
              table={table}
              tableMenuState={tableMenuState}
              drawerWidthState={drawerWidthState}
            />
          )}
          <Stack
            direction="column"
            spacing={0}
            sx={{
              marginLeft: `${drawerWidth}px`,
            }}
          >
            <Header
              table={table}
              tableMenuState={tableMenuState}
              drawerWidthState={drawerWidthState}
            />
            <VirtualizedTable
              rows={table.getRowModel().rows}
              headerGroups={table.getHeaderGroups()}
              scrollType={scrollType}
            />
            <Typography align="right">
              {table.getRowModel().rows.length} of {unitEntities?.length}
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
