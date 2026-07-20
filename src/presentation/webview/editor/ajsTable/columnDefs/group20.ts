import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { UnitInformationColumnGroupLabels } from "../../unitInformationLocalization";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";

const group20 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: UnitInformationColumnGroupLabels,
): GroupColumnDef<UnitListRowView, unknown> => {
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
