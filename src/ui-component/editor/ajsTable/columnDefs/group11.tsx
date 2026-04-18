import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Rating from "@mui/material/Rating";

const group11 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group11", //Basic job definition information
    header: ajsTableColumnHeader["group11"],
    columns: [
      {
        id: "group11.col1",
        header: ajsTableColumnHeader["group11.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.commandText,
      },
      {
        id: "group11.col2",
        header: ajsTableColumnHeader["group11.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.scriptFileName,
      },
      {
        id: "group11.col3",
        header: ajsTableColumnHeader["group11.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.parameters,
      },
      {
        id: "group11.col4",
        header: ajsTableColumnHeader["group11.col4"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.environmentVariable,
      },
      {
        id: "group11.col5",
        header: ajsTableColumnHeader["group11.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.environmentVariableFile,
      },
      {
        id: "group11.col6",
        header: ajsTableColumnHeader["group11.col6"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.workPathName,
      },
      {
        id: "group11.col7",
        header: ajsTableColumnHeader["group11.col7"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.standardInputFile,
      },
      columnHelper.group({
        id: "group11.group1",
        header: ajsTableColumnHeader["group11.group1"],
        columns: [
          {
            id: "group11.group1.col1",
            header: ajsTableColumnHeader["group11.group1.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardOutputFile,
          },
          {
            id: "group11.group1.col2",
            header: ajsTableColumnHeader["group11.group1.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardOutputAction,
          },
        ],
      }),
      columnHelper.group({
        id: "group11.group2",
        header: ajsTableColumnHeader["group11.group2"],
        columns: [
          {
            id: "group11.group2.col1",
            header: ajsTableColumnHeader["group11.group2.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardErrorFile,
          },
          {
            id: "group11.group2.col2",
            header: ajsTableColumnHeader["group11.group2.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardErrorAction,
          },
        ],
      }),
      {
        id: "group11.col8",
        header: ajsTableColumnHeader["group11.col8"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.queueManager,
      },
      {
        id: "group11.col9",
        header: ajsTableColumnHeader["group11.col9"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.queueName,
      },
      {
        id: "group11.col10",
        header: ajsTableColumnHeader["group11.col10"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.requestJobName,
      },
      {
        id: "group11.col11",
        header: ajsTableColumnHeader["group11.col11"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.priority,
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
      columnHelper.group({
        id: "group11.group3",
        header: ajsTableColumnHeader["group11.group3"],
        columns: [
          {
            id: "group11.group3.col1",
            header: ajsTableColumnHeader["group11.group3.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.endJudgment,
          },
          {
            id: "group11.group3.col2",
            header: ajsTableColumnHeader["group11.group3.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.waitThreshold,
          },
          {
            id: "group11.group3.col3",
            header: ajsTableColumnHeader["group11.group3.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.timeoutHold,
          },
          {
            id: "group11.group3.col4",
            header: ajsTableColumnHeader["group11.group3.col4"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.judgmentFile,
          },
        ],
      }),
      {
        id: "group11.col12",
        header: ajsTableColumnHeader["group11.col12"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.automaticRetryEnabled,
      },
      columnHelper.group({
        id: "group11.group4",
        header: ajsTableColumnHeader["group11.group4"],
        columns: [
          {
            id: "group11.group4.col1",
            header: ajsTableColumnHeader["group11.group4.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.retryStart,
          },
          {
            id: "group11.group4.col2",
            header: ajsTableColumnHeader["group11.group4.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.retryEnd,
          },
        ],
      }),
      {
        id: "group11.col13",
        header: ajsTableColumnHeader["group11.col13"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.retryCount,
      },
      {
        id: "group11.col14",
        header: ajsTableColumnHeader["group11.col14"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.retryInterval,
      },
      {
        id: "group11.col15",
        header: ajsTableColumnHeader["group11.col15"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.targetUserName,
      },
    ],
  });
};

export default group11;
