import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import Chip from "@mui/material/Chip";

const group5 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group5", //Job group definition information
    header: labels.label,
    columns: [
      {
        id: "group5.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.startDeadlineDate,
      },
      {
        id: "group5.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.maximumDuration,
      },
      {
        id: "group5.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.startTimeType,
      },
      {
        id: "group5.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.jobGroupType,
        cell: (param) => {
          const gty = param.getValue<"n" | "p" | undefined>();
          if (gty === undefined) {
            return undefined;
          }
          return gty === "n" ? (
            <Chip color="primary" label="Normal" />
          ) : (
            <Chip color="secondary" label="Planning" />
          );
        },
      },
    ],
  });
};

export default group5;
