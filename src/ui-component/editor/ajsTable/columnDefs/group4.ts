import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group4 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group4", //Manager unit definition information
    header: ajsTableColumnHeader["group4"],
    columns: [
      {
        id: "group4.col1",
        header: ajsTableColumnHeader["group4.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group4.managerHost,
      },
      {
        id: "group4.col2",
        header: ajsTableColumnHeader["group4.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group4.managerUnit,
      },
    ],
  });
};

export default group4;
