import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group8 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group8", //Jobnet connector definition information
    header: ajsTableColumnLabels.label("group8"),
    columns: [
      {
        id: "group8.col1",
        header: ajsTableColumnLabels.label("group8.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group8.nestedConnectorRelease,
      },
    ],
  });
};

export default group8;
