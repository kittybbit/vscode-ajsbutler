import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";
import { Ex } from "../../../../domain/models/parameters";

const group18 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group18", //Flexible job definition information
    header: ajsTableColumnHeader["group18"],
    columns: [
      {
        id: "group18.col1",
        header: ajsTableColumnHeader["group18.col1"],
        accessorFn: defaultAccessorFn("da"),
      },
      {
        id: "group18.col2",
        header: ajsTableColumnHeader["group18.col2"],
        accessorFn: defaultAccessorFn("fxg"),
      },
      {
        id: "group18.col3",
        header: ajsTableColumnHeader["group18.col3"],
        accessorFn: (row) =>
          ["fxj", "rfxj"].includes(row.ty.value())
            ? row.params<Ex>("ex")
            : undefined,
      },
    ],
  });
};

export default group18;
