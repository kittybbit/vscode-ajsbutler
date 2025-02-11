import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn, tyAccessorFn } from "./common";

const group4 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group4", //Manager unit definition information
    header: ajsTableColumnHeader["group4"],
    columns: [
      {
        id: "group4.col1",
        header: ajsTableColumnHeader["group4.col1"],
        accessorFn: tyAccessorFn(["mg", "mn"], defaultAccessorFn("mh")),
      },
      {
        id: "group4.col2",
        header: ajsTableColumnHeader["group4.col2"],
        accessorFn: tyAccessorFn(["mg", "mn"], defaultAccessorFn("mu")),
      },
    ],
  });
};

export default group4;
