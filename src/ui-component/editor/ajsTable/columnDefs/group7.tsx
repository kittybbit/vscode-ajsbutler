import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Rating from "@mui/material/Rating";

const group7 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group7", //Jobnet definition information
    header: ajsTableColumnHeader["group7"],
    columns: [
      {
        id: "group7.col1",
        header: ajsTableColumnHeader["group7.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.concurrentExecution,
      },
      {
        id: "group7.col2",
        header: ajsTableColumnHeader["group7.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.retainedGenerationCount,
      },
      {
        id: "group7.col3",
        header: ajsTableColumnHeader["group7.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.targetManager,
      },
      {
        id: "group7.col4",
        header: ajsTableColumnHeader["group7.col4"],
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
        header: ajsTableColumnHeader["group7.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.timeoutPeriod,
      },
      {
        id: "group7.col6",
        header: ajsTableColumnHeader["group7.col6"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.scheduleOption,
      },
      {
        id: "group7.col7",
        header: ajsTableColumnHeader["group7.col7"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group7.requiredExecutionTime,
      },
    ],
  });
};

export default group7;
