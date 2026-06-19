import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import {
  AjsTableColumnGroupLabels,
  unitTypeLabel,
} from "../../../../../domain/services/i18n/nls";
import Link from "@mui/material/Link";
import React from "react";

const group1 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  language: string,
  handleJump: (id: string) => void,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> =>
  columnHelper.group({
    id: "group1", //Unit definition information
    header: labels.label,
    columns: [
      {
        id: "group1.col1",
        header: labels.column(1),
        accessorFn: (row) => rowViewByPath.get(row.absolutePath)?.group1.name,
      },
      {
        id: "group1.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group1.parentAbsolutePath ?? "/",
        cell: (props) => {
          const group1 = rowViewByPath.get(
            props.row.original.absolutePath,
          )?.group1;
          return group1?.parentId ? (
            <Link
              key={0}
              sx={{
                display: "block",
                cursor: "pointer",
              }}
              onClick={() => handleJump(group1.parentId!)}
            >
              {group1.parentAbsolutePath}
            </Link>
          ) : (
            "/"
          );
        },
      },
      {
        id: "group1.col3",
        header: labels.column(3),
        accessorFn: (row) => {
          const group1 = rowViewByPath.get(row.absolutePath)?.group1;
          if (!group1) {
            return undefined;
          }
          return unitTypeLabel(
            group1.unitType,
            language,
            group1.groupType ?? "n",
          );
        },
      },
      {
        id: "group1.col4",
        header: labels.column(4),
        accessorFn: (row) => rowViewByPath.get(row.absolutePath)?.group1.cty,
      },
      {
        id: "group1.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group1.layoutHv,
      },
      {
        id: "group1.col6",
        header: labels.column(6),
        accessorFn: (row) => rowViewByPath.get(row.absolutePath)?.group1.size,
      },
    ],
  });

export default group1;
