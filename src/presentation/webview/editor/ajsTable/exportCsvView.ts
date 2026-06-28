import { Table } from "@tanstack/table-core";
import Parameter from "../../../../domain/models/parameters/Parameter";
import {
  ExportUnitListCsvInput,
  exportUnitListCsv,
} from "../../../../application/unit-list/exportUnitListCsv";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { AccessorType } from "./columnDefs/common";

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

const toExportInput = (
  table: Table<UnitListRowView>,
): ExportUnitListCsvInput => ({
  headerRows: table.getHeaderGroups().map((headerGroup) =>
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
  ),
  dataRows: table.getRowModel().rows.map((row, rowIndex) => [
    String(rowIndex + 1),
    ...row
      .getVisibleCells()
      .slice(1)
      .map((cell) => toCellString(cell.getValue<AccessorType | undefined>())),
  ]),
});

export const exportCsvView = (table: Table<UnitListRowView>): string =>
  exportUnitListCsv(toExportInput(table));
