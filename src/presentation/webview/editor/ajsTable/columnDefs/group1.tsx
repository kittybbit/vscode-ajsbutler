import { CellContext, GroupColumnDef } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { unitTypeLabel } from "../../../../../domain/services/i18n/nls";
import Link from "@mui/material/Link";
import React from "react";
import { ColumnGroupContext, rowViewColumn, RowViewByPath } from "./common";
import { handleJumpLinkClick } from "../navigation";

type Group1Options = {
  language: string;
  handleJump: (id: string) => void;
};

const parentPathCell = (
  rowViewByPath: RowViewByPath,
  handleJump: (id: string) => void,
) => {
  const ParentPathCell = (
    props: CellContext<UnitListRowView, string | undefined>,
  ) => {
    const group1 = rowViewByPath.get(props.row.original.absolutePath)?.group1;
    return group1?.parentId ? (
      <Link
        key={0}
        sx={{
          display: "block",
          cursor: "pointer",
        }}
        onClick={handleJumpLinkClick(group1.parentAbsolutePath, handleJump)}
      >
        {group1.parentAbsolutePath}
      </Link>
    ) : (
      "/"
    );
  };
  return ParentPathCell;
};

const resolveUnitTypeLabel =
  (language: string) => (rowView: UnitListRowView | undefined) => {
    const group1 = rowView?.group1;
    if (!group1) {
      return undefined;
    }
    return unitTypeLabel(group1.unitType, language, group1.groupType ?? "n");
  };

const group1 = (
  context: ColumnGroupContext,
  options: Group1Options,
): GroupColumnDef<UnitListRowView, unknown> => {
  const { columnHelper, labels, rowViewByPath } = context;
  const { handleJump, language } = options;

  return columnHelper.group({
    id: "group1", //Unit definition information
    header: labels.label,
    columns: [
      rowViewColumn({
        id: "group1.col1",
        header: labels.column(1),
        rowViewByPath,
        selectValue: (view) => view?.group1.name,
      }),
      rowViewColumn({
        id: "group1.col2",
        header: labels.column(2),
        rowViewByPath,
        selectValue: (view) => view?.group1.parentAbsolutePath ?? "/",
        cell: parentPathCell(rowViewByPath, handleJump),
      }),
      rowViewColumn({
        id: "group1.col3",
        header: labels.column(3),
        rowViewByPath,
        selectValue: resolveUnitTypeLabel(language),
      }),
      rowViewColumn({
        id: "group1.col4",
        header: labels.column(4),
        rowViewByPath,
        selectValue: (view) => view?.group1.cty,
      }),
      rowViewColumn({
        id: "group1.col5",
        header: labels.column(5),
        rowViewByPath,
        selectValue: (view) => view?.group1.layoutHv,
      }),
      rowViewColumn({
        id: "group1.col6",
        header: labels.column(6),
        rowViewByPath,
        selectValue: (view) => view?.group1.size,
      }),
    ],
  });
};

export default group1;
