import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group9 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group9", //Start-condition definition information
    header: ajsTableColumnHeader["group9"],
    columns: [
      {
        id: "group9.col1",
        header: ajsTableColumnHeader["group9.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group9.startCondition,
      },
    ],
  });
};

export default group9;
