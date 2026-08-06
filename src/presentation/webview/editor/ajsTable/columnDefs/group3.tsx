import React from "react";
import {
  CellContext,
  ColumnHelper,
  GroupColumnDef,
} from "@tanstack/table-core";
import type { UnitInformationColumnGroupLabels } from "../../unitInformationLocalization";
import Chip from "@mui/material/Chip";
import type { TableRowView } from "../tableViewerData";
import { rowViewColumn } from "./common";

const recoveryCell = (
  param: CellContext<TableRowView, boolean | undefined>,
) => {
  const isRecovery = param.getValue<boolean | undefined>();
  if (isRecovery === undefined) {
    return undefined;
  }
  return isRecovery ? (
    <Chip color="secondary" label="Recovery" />
  ) : (
    <Chip color="primary" label="Normal" />
  );
};

const group3 = (
  columnHelper: ColumnHelper<TableRowView>,
  labels: UnitInformationColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, TableRowView>,
): GroupColumnDef<TableRowView, unknown> => {
  return columnHelper.group({
    id: "group3", //Unit common attributes information
    header: labels.label,
    columns: [
      rowViewColumn({
        id: "group3.col1",
        header: labels.column(1),
        rowViewByPath,
        selectValue: (view) => view?.group3.hardAttribute,
      }),
      rowViewColumn({
        id: "group3.col2",
        header: labels.column(2),
        rowViewByPath,
        selectValue: (view) => view?.group3.isRecovery,
        cell: recoveryCell,
      }),
      rowViewColumn({
        id: "group3.col3",
        header: labels.column(3),
        rowViewByPath,
        selectValue: (view) => view?.group3.jp1Username,
      }),
      rowViewColumn({
        id: "group3.col4",
        header: labels.column(4),
        rowViewByPath,
        selectValue: (view) => view?.group3.jp1ResourceGroup,
      }),
    ],
  });
};

export default group3;
