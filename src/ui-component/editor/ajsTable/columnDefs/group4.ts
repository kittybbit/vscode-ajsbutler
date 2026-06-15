import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group4 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group4", //Manager unit definition information
    header: ajsTableColumnLabels.label("group4"),
    columns: [
      {
        id: "group4.col1",
        header: ajsTableColumnLabels.label("group4.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group4.managerHost,
      },
      {
        id: "group4.col2",
        header: ajsTableColumnLabels.label("group4.col2"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group4.managerUnit,
      },
    ],
  });
};

export default group4;
