import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import {
  labeledRowViewColumns,
  nestedColumnGroup,
  ratingCell,
  rowViewColumn,
} from "./common";

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
      ...labeledRowViewColumns({
        idPrefix: "group11",
        labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group11.commandText,
          (view) => view?.group11.scriptFileName,
          (view) => view?.group11.parameters,
          (view) => view?.group11.environmentVariable,
          (view) => view?.group11.environmentVariableFile,
          (view) => view?.group11.workPathName,
          (view) => view?.group11.standardInputFile,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group11.group1",
        labels: standardOutputLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group11.standardOutputFile,
          (view) => view?.group11.standardOutputAction,
        ],
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group11.group2",
        labels: standardErrorLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group11.standardErrorFile,
          (view) => view?.group11.standardErrorAction,
        ],
      }),
      rowViewColumn({
        id: "group11.col8",
        header: labels.column(8),
        rowViewByPath,
        selectValue: (view) => view?.group11.queueManager,
      }),
      rowViewColumn({
        id: "group11.col9",
        header: labels.column(9),
        rowViewByPath,
        selectValue: (view) => view?.group11.queueName,
      }),
      rowViewColumn({
        id: "group11.col10",
        header: labels.column(10),
        rowViewByPath,
        selectValue: (view) => view?.group11.requestJobName,
      }),
      rowViewColumn({
        id: "group11.col11",
        header: labels.column(11),
        rowViewByPath,
        selectValue: (view) => view?.group11.priority,
        cell: ratingCell,
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group11.group3",
        labels: endJudgmentLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group11.endJudgment,
          (view) => view?.group11.waitThreshold,
          (view) => view?.group11.timeoutHold,
          (view) => view?.group11.judgmentFile,
        ],
      }),
      rowViewColumn({
        id: "group11.col12",
        header: labels.column(12),
        rowViewByPath,
        selectValue: (view) => view?.group11.automaticRetryEnabled,
      }),
      nestedColumnGroup({
        columnHelper,
        id: "group11.group4",
        labels: retryRangeLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group11.retryStart,
          (view) => view?.group11.retryEnd,
        ],
      }),
      rowViewColumn({
        id: "group11.col13",
        header: labels.column(13),
        rowViewByPath,
        selectValue: (view) => view?.group11.retryCount,
      }),
      rowViewColumn({
        id: "group11.col14",
        header: labels.column(14),
        rowViewByPath,
        selectValue: (view) => view?.group11.retryInterval,
      }),
      rowViewColumn({
        id: "group11.col15",
        header: labels.column(15),
        rowViewByPath,
        selectValue: (view) => view?.group11.targetUserName,
      }),
    ],
  });
};

export default group11;
