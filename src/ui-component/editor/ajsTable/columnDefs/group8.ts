import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group8 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group8", //Jobnet connector definition information
    header: labels.label,
    columns: [
      {
        id: "group8.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group8.nestedConnectorRelease,
      },
    ],
  });
};

export default group8;
