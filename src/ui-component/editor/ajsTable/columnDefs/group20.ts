import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group20 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group20", //Other definition information
    header: ajsTableColumnLabels.label("group20"),
    columns: [
      {
        id: "group20.col1",
        header: ajsTableColumnLabels.label("group20.col1"),
      },
    ],
  });
};

export default group20;
