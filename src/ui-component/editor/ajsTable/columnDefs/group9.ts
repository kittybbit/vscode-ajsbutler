import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group9 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group9", //Start-condition definition information
    header: ajsTableColumnLabels.label("group9"),
    columns: [
      {
        id: "group9.col1",
        header: ajsTableColumnLabels.label("group9.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group9.startCondition,
      },
    ],
  });
};

export default group9;
