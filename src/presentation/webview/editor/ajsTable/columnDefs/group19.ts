import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";

const group19 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group19", //Http connection job definition information
    header: labels.label,
    columns: [
      {
        id: "group19.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpConnectionConfig,
      },
      {
        id: "group19.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpKind,
      },
      {
        id: "group19.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpExecutionMode,
      },
      {
        id: "group19.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpRequestFile,
      },
      {
        id: "group19.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpRequestEncoding,
      },
      {
        id: "group19.col6",
        header: labels.column(6),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpRequestMethod,
      },
      {
        id: "group19.col7",
        header: labels.column(7),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpStatusFile,
      },
      {
        id: "group19.col8",
        header: labels.column(8),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpStatusPoint,
      },
      {
        id: "group19.col9",
        header: labels.column(9),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpResponseHeaderFile,
      },
      {
        id: "group19.col10",
        header: labels.column(10),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpResponseBodyFile,
      },
      {
        id: "group19.col11",
        header: labels.column(11),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group19.httpCodeMap,
      },
    ],
  });
};

export default group19;
