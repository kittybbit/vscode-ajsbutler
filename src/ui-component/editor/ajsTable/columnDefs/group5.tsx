import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Chip from "@mui/material/Chip";

const group5 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group5", //Job group definition information
    header: ajsTableColumnLabels.label("group5"),
    columns: [
      {
        id: "group5.col1",
        header: ajsTableColumnLabels.label("group5.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.startDeadlineDate,
      },
      {
        id: "group5.col2",
        header: ajsTableColumnLabels.label("group5.col2"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.maximumDuration,
      },
      {
        id: "group5.col3",
        header: ajsTableColumnLabels.label("group5.col3"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group5.startTimeType,
      },
      {
        id: "group5.col4",
        header: ajsTableColumnLabels.label("group5.col4"),
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
