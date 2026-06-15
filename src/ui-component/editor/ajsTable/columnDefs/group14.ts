import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group14 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group14", //Action job definition information
    header: ajsTableColumnLabels.label("group14"),
    columns: [
      {
        id: "group14.col1",
        header: ajsTableColumnLabels.label("group14.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionEventId,
      },
      {
        id: "group14.col2",
        header: ajsTableColumnLabels.label("group14.col2"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionHostName,
      },
      {
        id: "group14.col3",
        header: ajsTableColumnLabels.label("group14.col3"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionMessage,
      },
      {
        id: "group14.col4",
        header: ajsTableColumnLabels.label("group14.col4"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionSeverity,
      },
      {
        id: "group14.col5",
        header: ajsTableColumnLabels.label("group14.col5"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionStartType,
      },
      {
        id: "group14.col6",
        header: ajsTableColumnLabels.label("group14.col6"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionInterval,
      },
      {
        id: "group14.col7",
        header: ajsTableColumnLabels.label("group14.col7"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionCount,
      },
      {
        id: "group14.col8",
        header: ajsTableColumnLabels.label("group14.col8"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.platformMethod,
      },
    ],
  });
};

export default group14;
