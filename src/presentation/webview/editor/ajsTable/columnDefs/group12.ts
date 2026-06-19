import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";

const group12 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const judgmentValueLabels = labels.subgroup(1);

  return columnHelper.group({
    id: "group12", //Judgment job definition information
    header: labels.label,
    columns: [
      {
        id: "group12.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group12.endJudgment,
      },
      columnHelper.group({
        id: "group12.group1",
        header: judgmentValueLabels.label,
        columns: [
          {
            id: "group12.group1.col1",
            header: judgmentValueLabels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.judgmentReturnCode,
          },
          {
            id: "group12.group1.col2",
            header: judgmentValueLabels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.lowerReturnCode,
          },
          {
            id: "group12.group1.col3",
            header: judgmentValueLabels.column(3),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.lowerJudgmentValue,
          },
          {
            id: "group12.group1.col4",
            header: judgmentValueLabels.column(4),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.upperComparison,
          },
          {
            id: "group12.group1.col5",
            header: judgmentValueLabels.column(5),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.upperReturnCode,
          },
          {
            id: "group12.group1.col6",
            header: judgmentValueLabels.column(6),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.upperJudgmentValue,
          },
          {
            id: "group12.group1.col7",
            header: judgmentValueLabels.column(7),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.lowerComparison,
          },
          {
            id: "group12.group1.col8",
            header: judgmentValueLabels.column(8),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.judgmentValueString,
          },
          {
            id: "group12.group1.col9",
            header: judgmentValueLabels.column(9),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.judgmentValueNumeric,
          },
        ],
      }),
      {
        id: "group12.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group12.variableName,
      },
      {
        id: "group12.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group12.judgmentFileName,
      },
    ],
  });
};

export default group12;
