import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group20 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group20", //Other definition information
    header: ajsTableColumnHeader["group20"],
    columns: [
      {
        id: "group20.col1",
        header: ajsTableColumnHeader["group20.col1"],
      },
    ],
  });
};

export default group20;
