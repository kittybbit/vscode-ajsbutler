import type { Column, Table, VisibilityState } from "@tanstack/table-core";
import type { TableRowView } from "./tableViewerData";

export type UnitListColumn = Column<TableRowView, unknown>;

export const getColumnLeafIds = (column: UnitListColumn): string[] =>
  column.getLeafColumns().map((leafColumn) => leafColumn.id);

export const createColumnVisibilityUpdate = (
  columnIds: readonly string[],
  visible: boolean,
): VisibilityState =>
  Object.fromEntries(columnIds.map((columnId) => [columnId, visible]));

export const setColumnVisibility = (
  table: Table<TableRowView>,
  column: UnitListColumn,
  visible: boolean,
): void => {
  const update = createColumnVisibilityUpdate(
    getColumnLeafIds(column),
    visible,
  );
  table.setColumnVisibility((current) => ({ ...current, ...update }));
};
