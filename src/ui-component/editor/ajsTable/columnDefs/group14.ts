import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group14 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group14", //Action job definition information
    header: labels.label,
    columns: [
      {
        id: "group14.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionEventId,
      },
      {
        id: "group14.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionHostName,
      },
      {
        id: "group14.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionMessage,
      },
      {
        id: "group14.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionSeverity,
      },
      {
        id: "group14.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionStartType,
      },
      {
        id: "group14.col6",
        header: labels.column(6),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionInterval,
      },
      {
        id: "group14.col7",
        header: labels.column(7),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.actionCount,
      },
      {
        id: "group14.col8",
        header: labels.column(8),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group14.platformMethod,
      },
    ],
  });
};

export default group14;
