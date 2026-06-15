import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnLabelAccessor } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Rating from "@mui/material/Rating";

const group7 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnLabels: AjsTableColumnLabelAccessor,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group7", //Jobnet definition information
    header: ajsTableColumnLabels.label("group7"),
    columns: [
      {
        id: "group7.col1",
        header: ajsTableColumnLabels.label("group7.col1"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.concurrentExecution,
      },
      {
        id: "group7.col2",
        header: ajsTableColumnLabels.label("group7.col2"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.retainedGenerationCount,
      },
      {
        id: "group7.col3",
        header: ajsTableColumnLabels.label("group7.col3"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.targetManager,
      },
      {
        id: "group7.col4",
        header: ajsTableColumnLabels.label("group7.col4"),
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
        header: ajsTableColumnLabels.label("group7.col5"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.timeoutPeriod,
      },
      {
        id: "group7.col6",
        header: ajsTableColumnLabels.label("group7.col6"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.scheduleOption,
      },
      {
        id: "group7.col7",
        header: ajsTableColumnLabels.label("group7.col7"),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.requiredExecutionTime,
      },
    ],
  });
};

export default group7;
