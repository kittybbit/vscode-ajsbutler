import type { Column, Table } from "@tanstack/table-core";
import Parameter from "../../../../domain/models/parameters/Parameter";
import {
  type ExportUnitListCsvColumnInput,
  exportUnitListCsvRows,
} from "../../../../application/unit-list/exportUnitListCsv";
import type { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import type { AccessorType } from "./columnDefs/common";

type ExportableColumnDef = {
  accessorFn?: (
    originalRow: UnitListRowView,
    rowIndex: number,
  ) => AccessorType | undefined;
};

const toParameterString = (parameter: Parameter): string =>
  parameter.value() || "";

const toCellItemString = (value: Exclude<AccessorType, unknown[]>): string =>
  value instanceof Parameter ? toParameterString(value) : String(value);

const toCellArrayString = (values: unknown[]): string =>
  values
    .map((item) =>
      item instanceof Parameter ? toParameterString(item) : String(item),
    )
    .join("\n");

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

const toExportColumn = (
  column: Column<UnitListRowView, unknown>,
): ExportUnitListCsvColumnInput<UnitListRowView> => ({
  value: (row, rowIndex) =>
    toCellString(getColumnAccessor(column)?.(row, rowIndex)),
});

export const exportCsvView = (table: Table<UnitListRowView>): string =>
  exportUnitListCsvRows({
    headerRows: toHeaderRows(table),
    rows: table.getRowModel().rows.map((row) => row.original),
    columns: table.getVisibleLeafColumns().slice(1).map(toExportColumn),
  });
