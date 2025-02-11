import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";

const group20 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group20", //Other definition information
    header: ajsTableColumnHeader["group20"],
    columns: [
      {
        id: "group20.col1",
        header: ajsTableColumnHeader["group20.col1"],
      },
    ],
  });
};

export default group20;
