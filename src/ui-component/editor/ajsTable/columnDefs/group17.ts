import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group17 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group17", //Tool unit definition information
    header: ajsTableColumnLabels.label("group17"),
    columns: [
      columnHelper.group({
        id: "group17.group1",
        header: ajsTableColumnLabels.label("group17.group1"),
        columns: [
          {
            id: "group17.group1.col1",
            header: ajsTableColumnLabels.label("group17.group1.col1"),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group17.toolParameters,
          },
          {
            id: "group17.group1.col2",
            header: ajsTableColumnLabels.label("group17.group1.col2"),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group17.toolEnvironment,
          },
        ],
      }),
    ],
  });
};

export default group17;
