import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group14 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group14", //Action job definition information
    header: ajsTableColumnHeader["group14"],
    columns: [
      {
        id: "group14.col1",
        header: ajsTableColumnHeader["group14.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionEventId,
      },
      {
        id: "group14.col2",
        header: ajsTableColumnHeader["group14.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionHostName,
      },
      {
        id: "group14.col3",
        header: ajsTableColumnHeader["group14.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionMessage,
      },
      {
        id: "group14.col4",
        header: ajsTableColumnHeader["group14.col4"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionSeverity,
      },
      {
        id: "group14.col5",
        header: ajsTableColumnHeader["group14.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionStartType,
      },
      {
        id: "group14.col6",
        header: ajsTableColumnHeader["group14.col6"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionInterval,
      },
      {
        id: "group14.col7",
        header: ajsTableColumnHeader["group14.col7"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionCount,
      },
      {
        id: "group14.col8",
        header: ajsTableColumnHeader["group14.col8"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.platformMethod,
      },
    ],
  });
};

export default group14;
