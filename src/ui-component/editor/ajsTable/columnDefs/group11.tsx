import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import Rating from "@mui/material/Rating";

const group11 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const standardOutputLabels = labels.subgroup(1);
  const standardErrorLabels = labels.subgroup(2);
  const endJudgmentLabels = labels.subgroup(3);
  const retryRangeLabels = labels.subgroup(4);

  return columnHelper.group({
    id: "group11", //Basic job definition information
    header: labels.label,
    columns: [
      {
        id: "group11.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.commandText,
      },
      {
        id: "group11.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.scriptFileName,
      },
      {
        id: "group11.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.parameters,
      },
      {
        id: "group11.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.environmentVariable,
      },
      {
        id: "group11.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.environmentVariableFile,
      },
      {
        id: "group11.col6",
        header: labels.column(6),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.workPathName,
      },
      {
        id: "group11.col7",
        header: labels.column(7),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.standardInputFile,
      },
      columnHelper.group({
        id: "group11.group1",
        header: standardOutputLabels.label,
        columns: [
          {
            id: "group11.group1.col1",
            header: standardOutputLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardOutputFile,
          },
          {
            id: "group11.group1.col2",
            header: standardOutputLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardOutputAction,
          },
        ],
      }),
      columnHelper.group({
        id: "group11.group2",
        header: standardErrorLabels.label,
        columns: [
          {
            id: "group11.group2.col1",
            header: standardErrorLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardErrorFile,
          },
          {
            id: "group11.group2.col2",
            header: standardErrorLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.standardErrorAction,
          },
        ],
      }),
      {
        id: "group11.col8",
        header: labels.column(8),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.queueManager,
      },
      {
        id: "group11.col9",
        header: labels.column(9),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.queueName,
      },
      {
        id: "group11.col10",
        header: labels.column(10),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.requestJobName,
      },
      {
        id: "group11.col11",
        header: labels.column(11),
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
        header: endJudgmentLabels.label,
        columns: [
          {
            id: "group11.group3.col1",
            header: endJudgmentLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.endJudgment,
          },
          {
            id: "group11.group3.col2",
            header: endJudgmentLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.waitThreshold,
          },
          {
            id: "group11.group3.col3",
            header: endJudgmentLabels.column(3),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.timeoutHold,
          },
          {
            id: "group11.group3.col4",
            header: endJudgmentLabels.column(4),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.judgmentFile,
          },
        ],
      }),
      {
        id: "group11.col12",
        header: labels.column(12),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.automaticRetryEnabled,
      },
      columnHelper.group({
        id: "group11.group4",
        header: retryRangeLabels.label,
        columns: [
          {
            id: "group11.group4.col1",
            header: retryRangeLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.retryStart,
          },
          {
            id: "group11.group4.col2",
            header: retryRangeLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group11.retryEnd,
          },
        ],
      }),
      {
        id: "group11.col13",
        header: labels.column(13),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.retryCount,
      },
      {
        id: "group11.col14",
        header: labels.column(14),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.retryInterval,
      },
      {
        id: "group11.col15",
        header: labels.column(15),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group11.targetUserName,
      },
    ],
  });
};

export default group11;
