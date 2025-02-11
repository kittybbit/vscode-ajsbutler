import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn, tyAccessorFn } from "./common";
import { N, Rn } from "../../../../domain/models/units/N";
import { Rating } from "@mui/material";

const group7 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group7", //Jobnet definition information
    header: ajsTableColumnHeader["group7"],
    columns: [
      {
        id: "group7.col1",
        header: ajsTableColumnHeader["group7.col1"],
        accessorFn: tyAccessorFn(
          ["n", "rn", "rm", "rr"],
          defaultAccessorFn("mp"),
        ),
      },
      {
        id: "group7.col2",
        header: ajsTableColumnHeader["group7.col2"],
        accessorFn: tyAccessorFn(
          ["n", "rn", "rm", "rr"],
          defaultAccessorFn("rg"),
        ),
      },
      {
        id: "group7.col3",
        header: ajsTableColumnHeader["group7.col3"],
        accessorFn: tyAccessorFn(
          ["n", "rn", "rm", "rr"],
          defaultAccessorFn("rh"),
        ),
      },
      {
        id: "group7.col4",
        header: ajsTableColumnHeader["group7.col4"],
        accessorFn: tyAccessorFn(
          ["n", "rn"],
          (row) => (row as N | Rn)?.priority,
        ),
        cell: (props) => {
          const priority = props.getValue<number | undefined>();
          return priority ? (
            <Rating
              value={priority}
              size="small"
              sx={{ position: "inherit" }}
              readOnly
            />
          ) : undefined;
        },
      },
      {
        id: "group7.col5",
        header: ajsTableColumnHeader["group7.col5"],
        accessorFn: tyAccessorFn(
          ["n", "rn", "rm", "rr"],
          defaultAccessorFn("cd"),
        ),
      },
      {
        id: "group7.col6",
        header: ajsTableColumnHeader["group7.col6"],
        accessorFn: tyAccessorFn(
          ["n", "rn", "rm", "rr"],
          defaultAccessorFn("ms"),
        ),
      },
      {
        id: "group7.col7",
        header: ajsTableColumnHeader["group7.col7"],
        accessorFn: tyAccessorFn(
          ["n", "rn", "rm", "rr"],
          defaultAccessorFn("fd"),
        ),
      },
    ],
  });
};

export default group7;
