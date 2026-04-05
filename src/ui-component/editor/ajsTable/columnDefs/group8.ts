import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group8 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group8", //Jobnet connector definition information
    header: ajsTableColumnHeader["group8"],
    columns: [
      {
        id: "group8.col1",
        header: ajsTableColumnHeader["group8.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group8.nestedConnectorRelease,
      },
    ],
  });
};

export default group8;
