import type { Column, Table } from "@tanstack/table-core";
import {
  type ExportUnitListCsvInput,
  exportUnitListCsv,
} from "../../../../application/unit-list/exportUnitListCsv";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import type { AccessorType } from "./columnDefs/common";

type ExportableColumnDef = {
  accessorFn?: (
    originalRow: UnitListRowView,
    rowIndex: number,
  ) => AccessorType | undefined;
};

const toCellItemString = (value: Exclude<AccessorType, unknown[]>): string =>
  String(value);

const toCellArrayString = (values: unknown[]): string =>
  values.map(String).join("\n");

const toCellString = (value: AccessorType | undefined): string =>
  value === undefined ? "" : toDefinedCellString(value);

const toDefinedCellString = (value: AccessorType): string =>
  Array.isArray(value) ? toCellArrayString(value) : toCellItemString(value);

const toHeaderRows = (table: Table<UnitListRowView>): string[][] =>
  table.getHeaderGroups().map((headerGroup) =>
    headerGroup.headers.flatMap((header) => {
      const placeholders = new Array(Math.max(header.colSpan - 1, 0)).fill("");

      if (header.isPlaceholder) {
        return ["", ...placeholders];
      }

      return [
        header.column.columnDef.header?.toString() ?? "",
        ...placeholders,
      ];
    }),
  );

const getColumnAccessor = (column: Column<UnitListRowView, unknown>) =>
  (column.columnDef as ExportableColumnDef).accessorFn;

export const toExportUnitListCsvInput = (
  table: Table<UnitListRowView>,
): ExportUnitListCsvInput => {
  const visibleColumns = table.getVisibleLeafColumns().slice(1);
  return {
    headerRows: toHeaderRows(table),
    rows: table.getRowModel().rows.map((row, rowIndex) => ({
      values: visibleColumns.map((column) =>
        toCellString(getColumnAccessor(column)?.(row.original, rowIndex)),
      ),
    })),
  };
};

export const exportCsvView = (table: Table<UnitListRowView>): string =>
  exportUnitListCsv(toExportUnitListCsvInput(table));
