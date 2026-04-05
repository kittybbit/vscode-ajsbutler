import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import * as parameter from "@resource/i18n/parameter";
import { box } from "./common";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

const group10 = (
  columnHelper: ColumnHelper<UnitListRowView>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  paramDefinition: typeof parameter.en,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
): GroupColumnDef<UnitListRowView, unknown> => {
  return columnHelper.group({
    id: "group10", //Schedule definition information
    header: ajsTableColumnHeader["group10"],
    columns: [
      {
        id: "group10.col1",
        header: ajsTableColumnHeader["group10.col1"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.deleteAfterExecution,
      },
      {
        id: "group10.col2",
        header: ajsTableColumnHeader["group10.col2"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.executionDate,
      },
      {
        id: "group10.col3",
        header: ajsTableColumnHeader["group10.col3"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.jobGroupPath,
      },
      {
        id: "group10.col4",
        header: ajsTableColumnHeader["group10.col4"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.exclusiveJobnetName,
      },
      {
        id: "group10.col5",
        header: ajsTableColumnHeader["group10.col5"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.parentRules,
        cell: (props) => {
          const ln = props.getValue<string[]>();
          return Array.isArray(ln) ? (
            <>{ln.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      columnHelper.group({
        id: "group10.group1",
        header: ajsTableColumnHeader["group10.group1"],
        columns: [
          {
            id: "group10.group1.col1",
            header: ajsTableColumnHeader["group10.group1.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10.scheduleDateTypes,
            cell: (props) => {
              const sd = props.getValue<string[]>();
              return Array.isArray(sd) ? (
                <>
                  {sd.map((v, i) =>
                    box(
                      paramDefinition["sd"][
                        v as keyof typeof paramDefinition.sd
                      ],
                      i,
                    ),
                  )}
                </>
              ) : undefined;
            },
          },
          {
            id: "group10.group1.col2",
            header: ajsTableColumnHeader["group10.group1.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10
                .scheduleDateYearMonths,
            cell: (props) => {
              const sd = props.getValue<string[]>();
              return Array.isArray(sd) ? (
                <>{sd.map((v, i) => box(v || "\u00A0", i))}</>
              ) : undefined;
            },
          },
          {
            id: "group10.group1.col3",
            header: ajsTableColumnHeader["group10.group1.col3"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10.scheduleDateDays,
            cell: (props) => {
              const sd = props.getValue<string[]>();
              return Array.isArray(sd) ? (
                <>{sd.map((v, i) => box(v || "\u00A0", i))}</>
              ) : undefined;
            },
          },
        ],
      }),
      {
        id: "group10.col6",
        header: ajsTableColumnHeader["group10.col6"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.startTimes,
        cell: (props) => {
          const st = props.getValue<string[]>();
          return Array.isArray(st) ? (
            <>{st.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "grsoup10.col7",
        header: ajsTableColumnHeader["group10.col7"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.cycles,
        cell: (props) => {
          const cy = props.getValue<string[]>();
          return Array.isArray(cy) ? (
            <>{cy.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col8",
        header: ajsTableColumnHeader["group10.col8"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.substitutes,
        cell: (props) => {
          const sh = props.getValue<string[]>();
          return Array.isArray(sh) ? (
            <>{sh.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col9",
        header: ajsTableColumnHeader["group10.col9"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.shiftDays,
        cell: (props) => {
          const shd = props.getValue<string[]>();
          return Array.isArray(shd) ? (
            <>{shd.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col10",
        header: ajsTableColumnHeader["group10.col10"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.scheduleByDaysFromStart,
        cell: (props) => {
          const cftd = props.getValue<string[]>();
          return Array.isArray(cftd) ? (
            <>{cftd.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col11",
        header: ajsTableColumnHeader["group10.col11"],
        accessorFn: (row) =>
          rowViewByPath.get(row.absolutePath)?.group10.maxShiftableDays,
        cell: (props) => {
          const cftd = props.getValue<string[]>();
          return Array.isArray(cftd) ? (
            <>{cftd.map((v, i) => box(v || "\u00A0", i))}</>
          ) : undefined;
        },
      },
      columnHelper.group({
        id: "group10.group2",
        header: ajsTableColumnHeader["group10.group2"],
        columns: [
          {
            id: "group10.group2.col1",
            header: ajsTableColumnHeader["group10.group2.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10.startRangeTimes,
            cell: (props) => {
              const sy = props.getValue<string[]>();
              return Array.isArray(sy) ? (
                <>{sy.map((v, i) => box(v || "\u00A0", i))}</>
              ) : undefined;
            },
          },
          {
            id: "group10.group2.col2",
            header: ajsTableColumnHeader["group10.group2.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10.endRangeTimes,
            cell: (props) => {
              const ey = props.getValue<string[]>();
              return Array.isArray(ey) ? (
                <>{ey.map((v, i) => box(v || "\u00A0", i))}</>
              ) : undefined;
            },
          },
        ],
      }),
      columnHelper.group({
        id: "group10.group3",
        header: ajsTableColumnHeader["group10.group3"],
        columns: [
          {
            id: "group10.group3.col1",
            header: ajsTableColumnHeader["group10.group3.col1"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10.waitCounts,
            cell: (props) => {
              const wc = props.getValue<string[]>();
              return Array.isArray(wc) ? (
                <>{wc.map((v, i) => box(v || "\u00A0", i))}</>
              ) : undefined;
            },
          },
          {
            id: "group10.group3.col2",
            header: ajsTableColumnHeader["group10.group3.col2"],
            accessorFn: (row) =>
              rowViewByPath.get(row.absolutePath)?.group10.waitTimes,
            cell: (props) => {
              const wt = props.getValue<string[]>();
              return Array.isArray(wt) ? (
                <>{wt.map((v, i) => box(v || "\u00A0", i))}</>
              ) : undefined;
            },
          },
        ],
      }),
    ],
  });
};

export default group10;
