import React from "react";
import { GroupColumnDef } from "@tanstack/table-core";
import { UnitListRowView } from "../../../../../application/unit-list/buildUnitListView";
import { box, ColumnGroupContext, rowViewColumn } from "./common";
import Link from "@mui/material/Link";

const group2 = (
  context: ColumnGroupContext,
  handleJump: (id: string) => void,
): GroupColumnDef<UnitListRowView, unknown> => {
  const { columnHelper, labels, rowViewByPath } = context;

  return columnHelper.group({
    id: "group2", //Unit common definition information
    header: labels.label,
    columns: [
      rowViewColumn({
        id: "group2.col1",
        header: labels.column(1),
        rowViewByPath,
        selectValue: (view) => view?.group2.comment,
      }),
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
      rowViewColumn({
        id: "group2.col4",
        header: labels.column(4),
        rowViewByPath,
        selectValue: (view) => view?.group2.executionAgent,
      }),
      rowViewColumn({
        id: "group2.col5",
        header: labels.column(5),
        rowViewByPath,
        selectValue: (view) => view?.group2.nestedConnectionLimit,
      }),
      rowViewColumn({
        id: "group2.col6",
        header: labels.column(6),
        rowViewByPath,
        selectValue: (view) => view?.group2.nestedConnectionName,
      }),
      rowViewColumn({
        id: "group2.col7",
        header: labels.column(7),
        rowViewByPath,
        selectValue: (view) => view?.group2.nestedConnectionEnabled,
      }),
      rowViewColumn({
        id: "group2.col8",
        header: labels.column(8),
        rowViewByPath,
        selectValue: (view) => view?.group2.nestedConnectionExternal,
      }),
      rowViewColumn({
        id: "group2.col9",
        header: labels.column(9),
        rowViewByPath,
        selectValue: (view) => view?.group2.nestedConnectionHost,
      }),
      rowViewColumn({
        id: "group2.col10",
        header: labels.column(10),
        rowViewByPath,
        selectValue: (view) => view?.group2.nestedConnectionService,
      }),
    ],
  });
};

export default group2;
