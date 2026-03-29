import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { Chip } from "@mui/material";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group3 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitEntity, unknown> => {
  const getGroup3View = (row: UnitEntity) =>
    rowViewByPath.get(row.absolutePath)?.group3;

  return columnHelper.group({
    id: "group3", //Unit common attributes information
    header: ajsTableColumnHeader["group3"],
    columns: [
      {
        id: "group3.col1",
        header: ajsTableColumnHeader["group3.col1"],
        accessorFn: (row) => getGroup3View(row)?.hardAttribute,
      },
      {
        id: "group3.col2",
        header: ajsTableColumnHeader["group3.col2"],
        accessorFn: (row) => getGroup3View(row)?.isRecovery,
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
        accessorFn: (row) => getGroup3View(row)?.jp1Username,
      },
      {
        id: "group3.col4",
        header: ajsTableColumnHeader["group3.col4"],
        accessorFn: (row) => getGroup3View(row)?.jp1ResourceGroup,
      },
    ],
  });
};

export default group3;
