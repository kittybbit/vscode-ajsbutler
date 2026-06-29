import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import {
  labeledRowViewColumns,
  nestedColumnGroup,
  rowViewColumn,
} from "./common";

const group13 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const monitoredFileConditionLabels = labels.subgroup(1);

  return columnHelper.group({
    id: "group13", //Event job definition information
    header: labels.label,
    columns: [
      ...labeledRowViewColumns({
        idPrefix: "group13",
        labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group13.timeoutInterval,
          (view) => view?.group13.eventTimeout,
          (view) => view?.group13.monitoredFileName,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group13.group1",
        labels: monitoredFileConditionLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group13.monitoredFileCondition,
          (view) => view?.group13.monitoredFileCloseMode,
        ],
      }),
      rowViewColumn({
        id: "group13.col4",
        header: labels.column(4),
        rowViewByPath,
        selectValue: (view) => view?.group13.monitoringInterval,
      }),
      rowViewColumn({
        id: "group13.col5",
        header: labels.column(5),
        rowViewByPath,
        selectValue: (view) => view?.group13.waitEventId,
      }),
      rowViewColumn({
        id: "group13.col6",
        header: labels.column(6),
        rowViewByPath,
        selectValue: (view) => view?.group13.waitHostName,
      }),
      rowViewColumn({
        id: "group13.col7",
        header: labels.column(7),
        rowViewByPath,
        selectValue: (view) => view?.group13.waitMessage,
      }),
      rowViewColumn({
        id: "group13.col8",
        header: labels.column(8),
        rowViewByPath,
        selectValue: (view) => view?.group13.eventTimeoutAction,
      }),
    ],
  });
};

export default group13;
