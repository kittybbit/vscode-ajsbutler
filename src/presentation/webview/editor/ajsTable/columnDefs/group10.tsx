import { GroupColumnDef } from "@tanstack/table-core";
import * as parameter from "@resource/i18n/parameter";
import {
  arrayBoxCell,
  blankWhenEmpty,
  ColumnGroupContext,
  rowViewColumn,
  RowViewByPath,
  TableColumnHelper,
} from "./common";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";

const blankArrayCell = arrayBoxCell<string>(blankWhenEmpty);

type BlankArrayGroupOptions = {
  columnHelper: TableColumnHelper;
  id: string;
  labels: { label: string; column: (column: number) => string };
  rowViewByPath: RowViewByPath;
  selectors: ((rowView: UnitListRowView | undefined) => string[] | undefined)[];
};

const blankArrayGroup = ({
  columnHelper,
  id,
  labels,
  rowViewByPath,
  selectors,
}: BlankArrayGroupOptions) =>
  columnHelper.group({
    id,
    header: labels.label,
    columns: selectors.map((selector, index) =>
      rowViewColumn({
        id: `${id}.col${index + 1}`,
        header: labels.column(index + 1),
        rowViewByPath,
        selectValue: selector,
        cell: blankArrayCell,
      }),
    ),
  });

const group10 = (
  context: ColumnGroupContext,
  paramDefinition: typeof parameter.en,
): GroupColumnDef<UnitListRowView, unknown> => {
  const { columnHelper, labels, rowViewByPath } = context;
  const scheduleDateLabels = labels.subgroup(1);
  const startTimeRangeLabels = labels.subgroup(2);
  const startConditionLabels = labels.subgroup(3);

  return columnHelper.group({
    id: "group10", //Schedule definition information
    header: labels.label,
    columns: [
      rowViewColumn({
        id: "group10.col1",
        header: labels.column(1),
        rowViewByPath,
        selectValue: (view) => view?.group10.deleteAfterExecution,
      }),
      rowViewColumn({
        id: "group10.col2",
        header: labels.column(2),
        rowViewByPath,
        selectValue: (view) => view?.group10.executionDate,
      }),
      rowViewColumn({
        id: "group10.col3",
        header: labels.column(3),
        rowViewByPath,
        selectValue: (view) => view?.group10.jobGroupPath,
      }),
      rowViewColumn({
        id: "group10.col4",
        header: labels.column(4),
        rowViewByPath,
        selectValue: (view) => view?.group10.exclusiveJobnetName,
      }),
      rowViewColumn({
        id: "group10.col5",
        header: labels.column(5),
        rowViewByPath,
        selectValue: (view) => view?.group10.parentRules,
        cell: blankArrayCell,
      }),
      columnHelper.group({
        id: "group10.group1",
        header: scheduleDateLabels.label,
        columns: [
          rowViewColumn({
            id: "group10.group1.col1",
            header: scheduleDateLabels.column(1),
            rowViewByPath,
            selectValue: (view) => view?.group10.scheduleDateTypes,
            cell: arrayBoxCell(
              (value: string) =>
                paramDefinition["sd"][value as keyof typeof paramDefinition.sd],
            ),
          }),
          rowViewColumn({
            id: "group10.group1.col2",
            header: scheduleDateLabels.column(2),
            rowViewByPath,
            selectValue: (view) => view?.group10.scheduleDateYearMonths,
            cell: blankArrayCell,
          }),
          rowViewColumn({
            id: "group10.group1.col3",
            header: scheduleDateLabels.column(3),
            rowViewByPath,
            selectValue: (view) => view?.group10.scheduleDateDays,
            cell: blankArrayCell,
          }),
        ],
      }),
      rowViewColumn({
        id: "group10.col6",
        header: labels.column(6),
        rowViewByPath,
        selectValue: (view) => view?.group10.startTimes,
        cell: blankArrayCell,
      }),
      rowViewColumn({
        id: "grsoup10.col7",
        header: labels.column(7),
        rowViewByPath,
        selectValue: (view) => view?.group10.cycles,
        cell: blankArrayCell,
      }),
      rowViewColumn({
        id: "group10.col8",
        header: labels.column(8),
        rowViewByPath,
        selectValue: (view) => view?.group10.substitutes,
        cell: blankArrayCell,
      }),
      rowViewColumn({
        id: "group10.col9",
        header: labels.column(9),
        rowViewByPath,
        selectValue: (view) => view?.group10.shiftDays,
        cell: blankArrayCell,
      }),
      rowViewColumn({
        id: "group10.col10",
        header: labels.column(10),
        rowViewByPath,
        selectValue: (view) => view?.group10.scheduleByDaysFromStart,
        cell: blankArrayCell,
      }),
      rowViewColumn({
        id: "group10.col11",
        header: labels.column(11),
        rowViewByPath,
        selectValue: (view) => view?.group10.maxShiftableDays,
        cell: blankArrayCell,
      }),
      blankArrayGroup({
        columnHelper,
        id: "group10.group2",
        labels: startTimeRangeLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group10.startRangeTimes,
          (view) => view?.group10.endRangeTimes,
        ],
      }),
      blankArrayGroup({
        columnHelper,
        id: "group10.group3",
        labels: startConditionLabels,
        rowViewByPath,
        selectors: [
          (view) => view?.group10.waitCounts,
          (view) => view?.group10.waitTimes,
        ],
      }),
    ],
  });
};

export default group10;
