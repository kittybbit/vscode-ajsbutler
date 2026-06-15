import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group16 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group16", //Waiting condition definition information
    header: ajsTableColumnLabels.label("group16"),
    columns: [
      {
        id: "group16.col1",
        header: ajsTableColumnLabels.label("group16.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.endWaitUnitName,
      },
      {
        id: "group16.col2",
        header: ajsTableColumnLabels.label("group16.col2"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.waitMode,
      },
      {
        id: "group16.col3",
        header: ajsTableColumnLabels.label("group16.col3"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.nestedMessageGeneration,
      },
      {
        id: "group16.col4",
        header: ajsTableColumnLabels.label("group16.col4"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16.unitEndMonitoring,
      },
      {
        id: "group16.col5",
        header: ajsTableColumnLabels.label("group16.col5"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group16
            .executionGenerationAction,
      },
    ],
  });
};

export default group16;
