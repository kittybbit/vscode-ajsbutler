import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group12 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group12", //Judgment job definition information
    header: ajsTableColumnHeader["group12"],
    columns: [
      {
        id: "group12.col1",
        header: ajsTableColumnHeader["group12.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group12.endJudgment,
      },
      columnHelper.group({
        id: "group12.group1",
        header: ajsTableColumnHeader["group12.group1"],
        columns: [
          {
            id: "group12.group1.col1",
            header: ajsTableColumnHeader["group12.group1.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.judgmentReturnCode,
          },
          {
            id: "group12.group1.col2",
            header: ajsTableColumnHeader["group12.group1.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.lowerReturnCode,
          },
          {
            id: "group12.group1.col3",
            header: ajsTableColumnHeader["group12.group1.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.lowerJudgmentValue,
          },
          {
            id: "group12.group1.col4",
            header: ajsTableColumnHeader["group12.group1.col4"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.upperComparison,
          },
          {
            id: "group12.group1.col5",
            header: ajsTableColumnHeader["group12.group1.col5"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.upperReturnCode,
          },
          {
            id: "group12.group1.col6",
            header: ajsTableColumnHeader["group12.group1.col6"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.upperJudgmentValue,
          },
          {
            id: "group12.group1.col7",
            header: ajsTableColumnHeader["group12.group1.col7"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.lowerComparison,
          },
          {
            id: "group12.group1.col8",
            header: ajsTableColumnHeader["group12.group1.col8"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.judgmentValueString,
          },
          {
            id: "group12.group1.col9",
            header: ajsTableColumnHeader["group12.group1.col9"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group12.judgmentValueNumeric,
          },
        ],
      }),
      {
        id: "group12.col2",
        header: ajsTableColumnHeader["group12.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group12.variableName,
      },
      {
        id: "group12.col3",
        header: ajsTableColumnHeader["group12.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group12.judgmentFileName,
      },
    ],
  });
};

export default group12;
