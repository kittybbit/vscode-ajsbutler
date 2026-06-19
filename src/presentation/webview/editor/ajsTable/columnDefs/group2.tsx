import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import type { AjsTableColumnGroupLabels } from "../../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { box } from "./common";
import Link from "@mui/material/Link";

const group2 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  labels: AjsTableColumnGroupLabels,
  handleJump: (id: string) => void,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group2", //Unit common definition information
    header: labels.label,
    columns: [
      {
        id: "group2.col1",
        header: labels.column(1),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.comment,
      },
      {
        id: "group2.col2",
        header: labels.column(2),
        accessorFn: (row) =>
          rowViewByPath
            .get(row.absolutePath)
            ?.group2.previousUnits.map((unit) => unit.name) ?? [],
        cell: (props) => {
          const previousUnits =
            rowViewByPath.get(props.row.original.absolutePath)?.group2
              .previousUnits ?? [];
          return previousUnits.map((unit, i) =>
            box(unit, i, (value, index) => {
              return (
                <Link
                  key={index}
                  sx={{
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={() => handleJump(value.id)}
                >
                  {value.name}
                </Link>
              );
            }),
          );
        },
      },
      {
        id: "group2.col3",
        header: labels.column(3),
        accessorFn: (row) =>
          rowViewByPath
            .get(row.absolutePath)
            ?.group2.previousUnits.map((unit) => unit.relationType) ?? [],
        cell: (props) =>
          props.getValue<string[]>().map((v: string, i: number) => box(v, i)),
      },
      {
        id: "group2.col4",
        header: labels.column(4),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.executionAgent,
      },
      {
        id: "group2.col5",
        header: labels.column(5),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.nestedConnectionLimit,
      },
      {
        id: "group2.col6",
        header: labels.column(6),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.nestedConnectionName,
      },
      {
        id: "group2.col7",
        header: labels.column(7),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.nestedConnectionEnabled,
      },
      {
        id: "group2.col8",
        header: labels.column(8),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.nestedConnectionExternal,
      },
      {
        id: "group2.col9",
        header: labels.column(9),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.nestedConnectionHost,
      },
      {
        id: "group2.col10",
        header: labels.column(10),
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group2.nestedConnectionService,
      },
    ],
  });
};

export default group2;
