import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group18 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group18", //Flexible job definition information
    header: ajsTableColumnLabels.label("group18"),
    columns: [
      {
        id: "group18.col1",
        header: ajsTableColumnLabels.label("group18.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.destinationAgent,
      },
      {
        id: "group18.col2",
        header: ajsTableColumnLabels.label("group18.col2"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.flexibleJobGroup,
      },
      {
        id: "group18.col3",
        header: ajsTableColumnLabels.label("group18.col3"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.executionAgent,
      },
    ],
  });
};

export default group18;
