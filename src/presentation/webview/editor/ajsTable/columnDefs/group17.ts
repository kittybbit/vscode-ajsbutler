import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";

const group17 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const passingInformationLabels = labels.subgroup(1);

  return columnHelper.group({
    id: "group17", //Tool unit definition information
    header: labels.label,
    columns: [
      columnHelper.group({
        id: "group17.group1",
        header: passingInformationLabels.label,
        columns: [
          {
            id: "group17.group1.col1",
            header: passingInformationLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group17.toolParameters,
          },
          {
            id: "group17.group1.col2",
            header: passingInformationLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group17.toolEnvironment,
          },
        ],
      }),
    ],
  });
};

export default group17;
