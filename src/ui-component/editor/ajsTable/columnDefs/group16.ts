import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group16 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group16", //Waiting condition definition information
    header: labels.label,
    columns: [
      {
        id: "group16.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.endWaitUnitName,
      },
      {
        id: "group16.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.waitMode,
      },
      {
        id: "group16.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.nestedMessageGeneration,
      },
      {
        id: "group16.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.unitEndMonitoring,
      },
      {
        id: "group16.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16
            .executionGenerationAction,
      },
    ],
  });
};

export default group16;
