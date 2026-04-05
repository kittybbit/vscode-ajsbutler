import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { box } from "./common";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { WeekSymbol } from "../../../../domain/values/AjsType";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";

const group6 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group6", //Calendar definition information
    header: ajsTableColumnHeader["group6"],
    columns: [
      columnHelper.group({
        id: "group6.group1",
        header: ajsTableColumnHeader["group6.group1"],
        columns: ["su", "mo", "tu", "we", "th", "fr", "sa"].map((v, i) => {
          const id = `group6.group1.col${i + 1}` as keyof typeof ajscolumn.en;
          return {
            id: id,
            header: ajsTableColumnHeader[id],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group6[v as WeekSymbol],
            cell: (props) => {
              const result = props.getValue<boolean>();
              if (result == undefined) {
                return undefined;
              }
              return result ? (
                <DoneAllIcon fontSize="small" color="primary" />
              ) : (
                <RemoveDoneIcon fontSize="small" color="primary" />
              );
            },
          };
        }),
      }),
      {
        id: "group6.col1",
        header: ajsTableColumnHeader["group6.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group6.openDates,
        cell: (props) => {
          const op = props.getValue<string[] | undefined>();
          return Array.isArray(op) ? (
            <>{op.map((v, i) => box(v, i))}</>
          ) : undefined;
        },
      },
      {
        id: "group6.col2",
        header: ajsTableColumnHeader["group6.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group6.closeDates,
        cell: (props) => {
          const cl = props.getValue<string[] | undefined>();
          return Array.isArray(cl) ? (
            <>{cl.map((v, i) => box(v, i))}</>
          ) : undefined;
        },
      },
    ],
  });
};

export default group6;
