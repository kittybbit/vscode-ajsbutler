import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group19 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group19", //Http connection job definition information
    header: ajsTableColumnHeader["group19"],
    columns: [
      {
        id: "group19.col1",
        header: ajsTableColumnHeader["group19.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpConnectionConfig,
      },
      {
        id: "group19.col2",
        header: ajsTableColumnHeader["group19.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpKind,
      },
      {
        id: "group19.col3",
        header: ajsTableColumnHeader["group19.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpExecutionMode,
      },
      {
        id: "group19.col4",
        header: ajsTableColumnHeader["group19.col4"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpRequestFile,
      },
      {
        id: "group19.col5",
        header: ajsTableColumnHeader["group19.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpRequestEncoding,
      },
      {
        id: "group19.col6",
        header: ajsTableColumnHeader["group19.col6"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpRequestMethod,
      },
      {
        id: "group19.col7",
        header: ajsTableColumnHeader["group19.col7"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpStatusFile,
      },
      {
        id: "group19.col8",
        header: ajsTableColumnHeader["group19.col8"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpStatusPoint,
      },
      {
        id: "group19.col9",
        header: ajsTableColumnHeader["group19.col9"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpResponseHeaderFile,
      },
      {
        id: "group19.col10",
        header: ajsTableColumnHeader["group19.col10"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpResponseBodyFile,
      },
      {
        id: "group19.col11",
        header: ajsTableColumnHeader["group19.col11"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpCodeMap,
      },
    ],
  });
};

export default group19;
