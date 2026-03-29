import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group13 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group13", //Event job definition information
    header: ajsTableColumnHeader["group13"],
    columns: [
      {
        id: "group13.col1",
        header: ajsTableColumnHeader["group13.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.timeoutInterval,
      },
      {
        id: "group13.col2",
        header: ajsTableColumnHeader["group13.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.eventTimeout,
      },
      {
        id: "group13.col3",
        header: ajsTableColumnHeader["group13.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.monitoredFileName,
      },
      columnHelper.group({
        id: "group13.group1",
        header: ajsTableColumnHeader["group13.group1"],
        columns: [
          {
            id: "group13.group1.col1",
            header: ajsTableColumnHeader["group13.group1.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group13
                .monitoredFileCondition,
          },
          {
            id: "group13.group1.col2",
            header: ajsTableColumnHeader["group13.group1.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group13
                .monitoredFileCloseMode,
          },
        ],
      }),
      {
        id: "group13.col4",
        header: ajsTableColumnHeader["group13.col4"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.monitoringInterval,
      },
      {
        id: "group13.col5",
        header: ajsTableColumnHeader["group13.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.waitEventId,
      },
      {
        id: "group13.col6",
        header: ajsTableColumnHeader["group13.col6"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.waitHostName,
      },
      {
        id: "group13.col7",
        header: ajsTableColumnHeader["group13.col7"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.waitMessage,
      },
      {
        id: "group13.col8",
        header: ajsTableColumnHeader["group13.col8"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group13.eventTimeoutAction,
      },
    ],
  });
};

export default group13;
