import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import Chip from "@mui/material/Chip";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group3 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const getGroup3View = (row: UnitListRowView) =>
    rowViewByPath.get(row.absolutePath)?.group3;

  return columnHelper.group({
    id: "group3", //Unit common attributes information
    header: labels.label,
    columns: [
      {
        id: "group3.col1",
        header: labels.column(1),
        accessorFn: (row) => getGroup3View(row)?.hardAttribute,
      },
      {
        id: "group3.col2",
        header: labels.column(2),
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
        header: labels.column(3),
        accessorFn: (row) => getGroup3View(row)?.jp1Username,
      },
      {
        id: "group3.col4",
        header: labels.column(4),
        accessorFn: (row) => getGroup3View(row)?.jp1ResourceGroup,
      },
    ],
  });
};

export default group3;
