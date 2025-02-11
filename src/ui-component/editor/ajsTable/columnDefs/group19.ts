import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";

const group19 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group19", //Http connection job definition information
    header: ajsTableColumnHeader["group19"],
    columns: [
      {
        id: "group19.col1",
        header: ajsTableColumnHeader["group19.col1"],
        accessorFn: defaultAccessorFn("htcfl"),
      },
      {
        id: "group19.col2",
        header: ajsTableColumnHeader["group19.col2"],
        accessorFn: defaultAccessorFn("htknd"),
      },
      {
        id: "group19.col3",
        header: ajsTableColumnHeader["group19.col3"],
        accessorFn: defaultAccessorFn("htexm"),
      },
      {
        id: "group19.col4",
        header: ajsTableColumnHeader["group19.col4"],
        accessorFn: defaultAccessorFn("htrqf"),
      },
      {
        id: "group19.col5",
        header: ajsTableColumnHeader["group19.col5"],
        accessorFn: defaultAccessorFn("htrqu"),
      },
      {
        id: "group19.col6",
        header: ajsTableColumnHeader["group19.col6"],
        accessorFn: defaultAccessorFn("htrqm"),
      },
      {
        id: "group19.col7",
        header: ajsTableColumnHeader["group19.col7"],
        accessorFn: defaultAccessorFn("htstf"),
      },
      {
        id: "group19.col8",
        header: ajsTableColumnHeader["group19.col8"],
        accessorFn: defaultAccessorFn("htspt"),
      },
      {
        id: "group19.col9",
        header: ajsTableColumnHeader["group19.col9"],
        accessorFn: defaultAccessorFn("htrhf"),
      },
      {
        id: "group19.col10",
        header: ajsTableColumnHeader["group19.col10"],
        accessorFn: defaultAccessorFn("htrbf"),
      },
      {
        id: "group19.col11",
        header: ajsTableColumnHeader["group19.col11"],
        accessorFn: defaultAccessorFn("htcdm"),
      },
    ],
  });
};

export default group19;
