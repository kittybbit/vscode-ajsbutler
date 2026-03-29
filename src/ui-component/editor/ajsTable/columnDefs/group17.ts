import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group17 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group17", //Tool unit definition information
    header: ajsTableColumnHeader["group17"],
    columns: [
      columnHelper.group({
        id: "group17.group1",
        header: ajsTableColumnHeader["group17.group1"],
        columns: [
          {
            id: "group17.group1.col1",
            header: ajsTableColumnHeader["group17.group1.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group17.toolParameters,
          },
          {
            id: "group17.group1.col2",
            header: ajsTableColumnHeader["group17.group1.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group17.toolEnvironment,
          },
        ],
      }),
    ],
  });
};

export default group17;
