import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";

const group14 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group14", //Action job definition information
    header: ajsTableColumnHeader["group14"],
    columns: [
      {
        id: "group14.col1",
        header: ajsTableColumnHeader["group14.col1"],
        accessorFn: defaultAccessorFn("evsid"),
      },
      {
        id: "group14.col2",
        header: ajsTableColumnHeader["group14.col2"],
        accessorFn: defaultAccessorFn("evhst"),
      },
      {
        id: "group14.col3",
        header: ajsTableColumnHeader["group14.col3"],
        accessorFn: defaultAccessorFn("evsms"),
      },
      {
        id: "group14.col4",
        header: ajsTableColumnHeader["group14.col4"],
        accessorFn: defaultAccessorFn("evssv"),
      },
      {
        id: "group14.col5",
        header: ajsTableColumnHeader["group14.col5"],
        accessorFn: defaultAccessorFn("evsrt"),
      },
      {
        id: "group14.col6",
        header: ajsTableColumnHeader["group14.col6"],
        accessorFn: defaultAccessorFn("evspl"),
      },
      {
        id: "group14.col7",
        header: ajsTableColumnHeader["group14.col7"],
        accessorFn: defaultAccessorFn("evsrc"),
      },
      {
        id: "group14.col8",
        header: ajsTableColumnHeader["group14.col8"],
        accessorFn: defaultAccessorFn("pfm"),
      },
    ],
  });
};

export default group14;
