import { useMemo } from "react";
import { type Table as ReactTable, useReactTable } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
} from "@tanstack/table-core";
import { tableColumnDef, tableDefaultColumnDef } from "./tableColumnDef";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import type { TableRowView } from "./tableViewerData";

export type TableModelSetupContext = {
  rowViews: TableRowView[] | undefined;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  lang: string;
  handleJump: (id: string) => void;
  rowViewByPath: ReadonlyMap<string, TableRowView>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

export const useTableModelSetup = ({
  rowViews,
  parameterSearchValuesByPath,
  lang,
  handleJump,
  rowViewByPath,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
}: TableModelSetupContext): {
  table: ReactTable<TableRowView>;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
} => {
  const columns = useMemo(
    () => tableColumnDef(lang, handleJump, rowViewByPath),
    [lang, handleJump, rowViewByPath],
  );
  const table = useReactTable<TableRowView>({
    columns,
    data: rowViews ?? [],
    state: { columnVisibility, sorting },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: tableDefaultColumnDef,
    debugAll: DEVELOPMENT,
  });
  return { table, parameterSearchValuesByPath };
};
