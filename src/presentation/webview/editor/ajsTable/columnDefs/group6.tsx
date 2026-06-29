import React from "react";
import {
  CellContext,
  ColumnHelper,
  GroupColumnDef,
} from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { arrayBoxCell, rowViewColumn } from "./common";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { WeekSymbol } from "../../../../../domain/values/AjsType";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";

const weekSymbols: WeekSymbol[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];
const dateArrayCell = arrayBoxCell<string>();

const weekCell = (props: CellContext<UnitListRowView, boolean | undefined>) => {
  const result = props.getValue<boolean | undefined>();
  if (result == undefined) {
    return undefined;
  }
  return result ? (
    <DoneAllIcon fontSize="small" color="primary" />
  ) : (
    <RemoveDoneIcon fontSize="small" color="primary" />
  );
};

const group6 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  const standardWeekLabels = labels.subgroup(1);

  return columnHelper.group({
    id: "group6", //Calendar definition information
    header: labels.label,
    columns: [
      columnHelper.group({
        id: "group6.group1",
        header: standardWeekLabels.label,
        columns: weekSymbols.map((weekSymbol, index) =>
          rowViewColumn({
            id: `group6.group1.col${index + 1}`,
            header: standardWeekLabels.column(index + 1),
            rowViewByPath,
            selectValue: (view) => view?.group6[weekSymbol],
            cell: weekCell,
          }),
        ),
      }),
      rowViewColumn({
        id: "group6.col1",
        header: labels.column(1),
        rowViewByPath,
        selectValue: (view) => view?.group6.openDates,
        cell: dateArrayCell,
      }),
      rowViewColumn({
        id: "group6.col2",
        header: labels.column(2),
        rowViewByPath,
        selectValue: (view) => view?.group6.closeDates,
        cell: dateArrayCell,
      }),
    ],
  });
};

export default group6;
