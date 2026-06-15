import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group15 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const termination1Labels = labels.subgroup(1);
  const termination2Labels = labels.subgroup(2);
  const termination3Labels = labels.subgroup(3);
  const termination4Labels = labels.subgroup(4);

  return columnHelper.group({
    id: "group15", //Job common attribute information
    header: labels.label,
    columns: [
      {
        id: "group15.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.executionUser,
      },
      {
        id: "group15.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.executionTimeMonitor,
      },
      {
        id: "group15.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.fileDescriptor,
      },
      {
        id: "group15.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group15.jobType,
      },
      columnHelper.group({
        id: "group15.group1",
        header: termination1Labels.label,
        columns: [
          {
            id: "group15.group1.col1",
            header: termination1Labels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus1,
          },
          {
            id: "group15.group1.col2",
            header: termination1Labels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay1,
          },
          {
            id: "group15.group1.col3",
            header: termination1Labels.column(3),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation1,
          },
        ],
      }),
      columnHelper.group({
        id: "group15.group2",
        header: termination2Labels.label,
        columns: [
          {
            id: "group15.group2.col1",
            header: termination2Labels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus2,
          },
          {
            id: "group15.group2.col2",
            header: termination2Labels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay2,
          },
          {
            id: "group15.group2.col3",
            header: termination2Labels.column(3),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation2,
          },
        ],
      }),
      columnHelper.group({
        id: "group15.group3",
        header: termination3Labels.label,
        columns: [
          {
            id: "group15.group3.col1",
            header: termination3Labels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus3,
          },
          {
            id: "group15.group3.col2",
            header: termination3Labels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay3,
          },
          {
            id: "group15.group3.col3",
            header: termination3Labels.column(3),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15
                .terminationOperation3,
          },
        ],
      }),
      columnHelper.group({
        id: "group15.group4",
        header: termination4Labels.label,
        columns: [
          {
            id: "group15.group4.col1",
            header: termination4Labels.column(1),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationStatus4,
          },
          {
            id: "group15.group4.col2",
            header: termination4Labels.column(2),
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group15.terminationDelay4,
          },
          {
            id: "group15.group4.col3",
            header: termination4Labels.column(3),
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
