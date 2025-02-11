import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";

const group16 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group16", //Waiting condition definition information
    header: ajsTableColumnHeader["group16"],
    columns: [
      {
        id: "group16.col1",
        header: ajsTableColumnHeader["group16.col1"],
        accessorFn: defaultAccessorFn("eun"),
      },
      {
        id: "group16.col2",
        header: ajsTableColumnHeader["group16.col2"],
        accessorFn: defaultAccessorFn("mm"),
      },
      {
        id: "group16.col3",
        header: ajsTableColumnHeader["group16.col3"],
        accessorFn: defaultAccessorFn("nmg"),
      },
      {
        id: "group16.col4",
        header: ajsTableColumnHeader["group16.col4"],
        accessorFn: defaultAccessorFn("uem"),
      },
      {
        id: "group16.col5",
        header: ajsTableColumnHeader["group16.col5"],
        accessorFn: defaultAccessorFn("ega"),
      },
    ],
  });
};

export default group16;
