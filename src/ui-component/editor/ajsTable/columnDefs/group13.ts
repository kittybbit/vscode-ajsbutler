import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group13 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const monitoredFileConditionLabels = labels.subgroup(1);

  return columnHelper.group({
    id: "group13", //Event job definition information
    header: labels.label,
    columns: [
      {
        id: "group13.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.timeoutInterval,
      },
      {
        id: "group13.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.eventTimeout,
      },
      {
        id: "group13.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.monitoredFileName,
      },
      columnHelper.group({
        id: "group13.group1",
        header: monitoredFileConditionLabels.label,
        columns: [
          {
            id: "group13.group1.col1",
            header: monitoredFileConditionLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group13
                .monitoredFileCondition,
          },
          {
            id: "group13.group1.col2",
            header: monitoredFileConditionLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group13
                .monitoredFileCloseMode,
          },
        ],
      }),
      {
        id: "group13.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.monitoringInterval,
      },
      {
        id: "group13.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.waitEventId,
      },
      {
        id: "group13.col6",
        header: labels.column(6),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.waitHostName,
      },
      {
        id: "group13.col7",
        header: labels.column(7),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.waitMessage,
      },
      {
        id: "group13.col8",
        header: labels.column(8),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.eventTimeoutAction,
      },
    ],
  });
};

export default group13;
