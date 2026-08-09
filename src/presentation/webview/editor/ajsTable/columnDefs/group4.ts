import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { UnitInformationColumnGroupLabels } from "../../unitInformationLocalization";
import type { TableRowView } from "../tableViewerData";

const group4 = (
  columnHelper: ColumnHelper<TableRowView>,
  labels: UnitInformationColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, TableRowView>,
): GroupColumnDef<TableRowView, unknown> => {
  return columnHelper.group({
    id: "group4", //Manager unit definition information
    header: labels.label,
    columns: [
      {
        id: "group4.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group4.managerHost,
      },
      {
        id: "group4.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group4.managerUnit,
      },
    ],
  });
};

export default group4;
