import React from "react";
import {
  CellContext,
  ColumnHelper,
  GroupColumnDef,
} from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import Chip from "@mui/material/Chip";
import { labeledRowViewColumns, rowViewColumn } from "./common";

const jobGroupTypeCell = (
  param: CellContext<UnitListRowView, "n" | "p" | undefined>,
) => {
  const jobGroupType = param.getValue<"n" | "p" | undefined>();
  if (jobGroupType === undefined) {
    return undefined;
  }
  return jobGroupType === "n" ? (
    <Chip color="primary" label="Normal" />
  ) : (
    <Chip color="secondary" label="Planning" />
  );
};

const group5 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group5", //Job group definition information
    header: labels.label,
    columns: [
      ...labeledRowViewColumns({
        idPrefix: "group5",
        labels,
        rowViewByPath,
        selectors: [
          (view) => view?.group5.startDeadlineDate,
          (view) => view?.group5.maximumDuration,
          (view) => view?.group5.startTimeType,
        ],
      }),
      rowViewColumn({
        id: "group5.col4",
        header: labels.column(4),
        rowViewByPath,
        selectValue: (view) => view?.group5.jobGroupType,
        cell: jobGroupTypeCell,
      }),
    ],
  });
};

export default group5;
