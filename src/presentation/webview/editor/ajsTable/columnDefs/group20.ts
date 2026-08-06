import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { UnitInformationColumnGroupLabels } from "../../unitInformationLocalization";
import type { TableRowView } from "../tableViewerData";

const group20 = (
  columnHelper: ColumnHelper<TableRowView>,
  labels: UnitInformationColumnGroupLabels,
): GroupColumnDef<TableRowView, unknown> => {
  return columnHelper.group({
    id: "group20", //Other definition information
    header: labels.label,
    columns: [
      {
        id: "group20.col1",
        header: labels.column(1),
      },
    ],
  });
};

export default group20;
