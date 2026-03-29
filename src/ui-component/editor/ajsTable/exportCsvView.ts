import { Table } from "@tanstack/table-core";
import Parameter from "../../../domain/models/parameters/Parameter";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";
import {
  ExportUnitListCsvInput,
  exportUnitListCsv,
} from "../../../application/unit-list/exportUnitListCsv";
import { AccessorType } from "./columnDefs/common";

const toCellString = (value: AccessorType | undefined): string => {
  if (value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        item instanceof Parameter ? item.value() || "" : String(item),
      )
      .join("\n");
  }

  if (value instanceof Parameter) {
    return value.value() || "";
  }

  return String(value);
};

const toExportInput = (table: Table<UnitEntity>): ExportUnitListCsvInput => ({
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

export const exportCsvView = (table: Table<UnitEntity>): string =>
  exportUnitListCsv(toExportInput(table));
