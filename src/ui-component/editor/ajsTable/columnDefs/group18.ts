import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group18 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group18", //Flexible job definition information
    header: labels.label,
    columns: [
      {
        id: "group18.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.destinationAgent,
      },
      {
        id: "group18.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.flexibleJobGroup,
      },
      {
        id: "group18.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group18.executionAgent,
      },
    ],
  });
};

export default group18;
