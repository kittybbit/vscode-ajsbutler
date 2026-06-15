import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Rating from "@mui/material/Rating";

const group7 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group7", //Jobnet definition information
    header: labels.label,
    columns: [
      {
        id: "group7.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.concurrentExecution,
      },
      {
        id: "group7.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.retainedGenerationCount,
      },
      {
        id: "group7.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.targetManager,
      },
      {
        id: "group7.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.priority,
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
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.timeoutPeriod,
      },
      {
        id: "group7.col6",
        header: labels.column(6),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.scheduleOption,
      },
      {
        id: "group7.col7",
        header: labels.column(7),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.requiredExecutionTime,
      },
    ],
  });
};

export default group7;
