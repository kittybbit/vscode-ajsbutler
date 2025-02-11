import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { defaultAccessorFn } from "./common";
import { Chip } from "@mui/material";

const group3 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group3", //Unit common attributes information
    header: ajsTableColumnHeader["group3"],
    columns: [
      {
        id: "group3.col1",
        header: ajsTableColumnHeader["group3.col1"],
        accessorFn: defaultAccessorFn("ha"),
      },
      {
        id: "group3.col2",
        header: ajsTableColumnHeader["group3.col2"],
        accessorFn: (row) => row.isRecovery,
        cell: (param) => {
          const isRecovery = param.getValue<boolean | undefined>();
          if (isRecovery === undefined) {
            return undefined;
          }
          return isRecovery ? (
            <Chip color="secondary" label="Recovery" />
          ) : (
            <Chip color="primary" label="Normal" />
          );
        },
      },
      {
        id: "group3.col3",
        header: ajsTableColumnHeader["group3.col3"],
        accessorFn: (row) => row.jp1Username,
      },
      {
        id: "group3.col4",
        header: ajsTableColumnHeader["group3.col4"],
        accessorFn: (row) => row.jp1ResourceGroup,
      },
    ],
  });
};

export default group3;
