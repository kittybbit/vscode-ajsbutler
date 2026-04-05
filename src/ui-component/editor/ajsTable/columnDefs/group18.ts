import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group18 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group18", //Flexible job definition information
    header: ajsTableColumnHeader["group18"],
    columns: [
      {
        id: "group18.col1",
        header: ajsTableColumnHeader["group18.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.destinationAgent,
      },
      {
        id: "group18.col2",
        header: ajsTableColumnHeader["group18.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.flexibleJobGroup,
      },
      {
        id: "group18.col3",
        header: ajsTableColumnHeader["group18.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.executionAgent,
      },
    ],
  });
};

export default group18;
