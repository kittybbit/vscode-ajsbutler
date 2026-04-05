import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group15 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group15", //Job common attribute information
    header: ajsTableColumnHeader["group15"],
    columns: [
      {
        id: "group15.col1",
        header: ajsTableColumnHeader["group15.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.executionUser,
      },
      {
        id: "group15.col2",
        header: ajsTableColumnHeader["group15.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.executionTimeMonitor,
      },
      {
        id: "group15.col3",
        header: ajsTableColumnHeader["group15.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.fileDescriptor,
      },
      {
        id: "group15.col4",
        header: ajsTableColumnHeader["group15.col4"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.jobType,
      },
      columnHelper.group({
        id: "group15.group1",
        header: ajsTableColumnHeader["group15.group1"],
        columns: [
          {
            id: "group15.group1.col1",
            header: ajsTableColumnHeader["group15.group1.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus1,
          },
          {
            id: "group15.group1.col2",
            header: ajsTableColumnHeader["group15.group1.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay1,
          },
          {
            id: "group15.group1.col3",
            header: ajsTableColumnHeader["group15.group1.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation1,
          },
        ],
      }),
      columnHelper.group({
        id: "group15.group2",
        header: ajsTableColumnHeader["group15.group2"],
        columns: [
          {
            id: "group15.group2.col1",
            header: ajsTableColumnHeader["group15.group2.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus2,
          },
          {
            id: "group15.group2.col2",
            header: ajsTableColumnHeader["group15.group2.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay2,
          },
          {
            id: "group15.group2.col3",
            header: ajsTableColumnHeader["group15.group2.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation2,
          },
        ],
      }),
      columnHelper.group({
        id: "group15.group3",
        header: ajsTableColumnHeader["group15.group3"],
        columns: [
          {
            id: "group15.group3.col1",
            header: ajsTableColumnHeader["group15.group3.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus3,
          },
          {
            id: "group15.group3.col2",
            header: ajsTableColumnHeader["group15.group3.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay3,
          },
          {
            id: "group15.group3.col3",
            header: ajsTableColumnHeader["group15.group3.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation3,
          },
        ],
      }),
      columnHelper.group({
        id: "group15.group4",
        header: ajsTableColumnHeader["group15.group4"],
        columns: [
          {
            id: "group15.group4.col1",
            header: ajsTableColumnHeader["group15.group4.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus4,
          },
          {
            id: "group15.group4.col2",
            header: ajsTableColumnHeader["group15.group4.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay4,
          },
          {
            id: "group15.group4.col3",
            header: ajsTableColumnHeader["group15.group4.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation4,
          },
        ],
      }),
    ],
  });
};

export default group15;
