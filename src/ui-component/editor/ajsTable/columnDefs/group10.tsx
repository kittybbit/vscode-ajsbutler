import React from "react";
import { ColumnHelper, GroupColumnDef } from "@tanstack/table-core";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import * as parameter from "@resource/i18n/parameter";
import { UnitEntity } from "../../../../domain/models/units/UnitEntities";
import { box, defaultAccessorFn } from "./common";
import {
  Ln,
  Sd,
  St,
  Cy,
  Sh,
  Shd,
  Cftd,
  Sy,
  Ey,
  Wc,
  Wt,
} from "../../../../domain/models/parameters";

const group10 = (
  columnHelper: ColumnHelper<UnitEntity>,
  ajsTableColumnHeader: typeof ajscolumn.en,
  paramDefinition: typeof parameter.en,
): GroupColumnDef<UnitEntity, unknown> => {
  return columnHelper.group({
    id: "group10", //Schedule definition information
    header: ajsTableColumnHeader["group10"],
    columns: [
      {
        id: "group10.col1",
        header: ajsTableColumnHeader["group10.col1"],
        accessorFn: defaultAccessorFn("de"),
      },
      {
        id: "group10.col2",
        header: ajsTableColumnHeader["group10.col2"],
        accessorFn: defaultAccessorFn("ed"),
      },
      {
        id: "group10.col3",
        header: ajsTableColumnHeader["group10.col3"],
        accessorFn: defaultAccessorFn("jc"),
      },
      {
        id: "group10.col4",
        header: ajsTableColumnHeader["group10.col4"],
        accessorFn: defaultAccessorFn("ejn"),
      },
      {
        id: "group10.col5",
        header: ajsTableColumnHeader["group10.col5"],
        accessorFn: defaultAccessorFn("ln"),
        cell: (props) => {
          const ln = props.getValue<Ln[]>();
          return Array.isArray(ln) ? (
            <>{ln.map((v, i) => box((v as Ln).parentRule, i))}</>
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
            accessorFn: defaultAccessorFn("sd"),
            cell: (props) => {
              const sd = props.getValue<Sd[]>();
              return Array.isArray(sd) ? (
                <>
                  {sd.map((v, i) =>
                    box(paramDefinition["sd"][(v as Sd).type], i),
                  )}
                </>
              ) : undefined;
            },
          },
          {
            id: "group10.group1.col2",
            header: ajsTableColumnHeader["group10.group1.col2"],
            accessorFn: defaultAccessorFn("sd"),
            cell: (props) => {
              const sd = props.getValue<Sd[]>();
              return Array.isArray(sd) ? (
                <>{sd.map((v, i) => box((v as Sd).yearMonth ?? "\u00A0", i))}</>
              ) : undefined;
            },
          },
          {
            id: "group10.group1.col3",
            header: ajsTableColumnHeader["group10.group1.col3"],
            accessorFn: defaultAccessorFn("sd"),
            cell: (props) => {
              const sd = props.getValue<Sd[]>();
              return Array.isArray(sd) ? (
                <>{sd.map((v, i) => box((v as Sd).day ?? "\u00A0", i))}</>
              ) : undefined;
            },
          },
        ],
      }),
      {
        id: "group10.col6",
        header: ajsTableColumnHeader["group10.col6"],
        accessorFn: defaultAccessorFn("st"),
        cell: (props) => {
          const st = props.getValue<St[]>();
          return Array.isArray(st) ? (
            <>{st.map((v, i) => box((v as St).time ?? "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "grsoup10.col7",
        header: ajsTableColumnHeader["group10.col7"],
        accessorFn: defaultAccessorFn("cy"),
        cell: (props) => {
          const cy = props.getValue<Cy[]>();
          return Array.isArray(cy) ? (
            <>{cy.map((v, i) => box((v as Cy).cycle ?? "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col8",
        header: ajsTableColumnHeader["group10.col8"],
        accessorFn: defaultAccessorFn("sh"),
        cell: (props) => {
          const sh = props.getValue<Sh[]>();
          return Array.isArray(sh) ? (
            <>{sh.map((v, i) => box((v as Sh).substitute ?? "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col9",
        header: ajsTableColumnHeader["group10.col9"],
        accessorFn: defaultAccessorFn("shd"),
        cell: (props) => {
          const shd = props.getValue<Shd[]>();
          return Array.isArray(shd) ? (
            <>{shd.map((v, i) => box((v as Shd).shiftDays ?? "\u00A0", i))}</>
          ) : undefined;
        },
      },
      {
        id: "group10.col10",
        header: ajsTableColumnHeader["group10.col10"],
        accessorFn: defaultAccessorFn("cftd"),
        cell: (props) => {
          const cftd = props.getValue<Cftd[]>();
          return Array.isArray(cftd) ? (
            <>
              {cftd.map((v, i) =>
                box((v as Cftd).scheduleByDaysFromStart ?? "\u00A0", i),
              )}
            </>
          ) : undefined;
        },
      },
      {
        id: "group10.col11",
        header: ajsTableColumnHeader["group10.col11"],
        accessorFn: defaultAccessorFn("cftd"),
        cell: (props) => {
          const cftd = props.getValue<Cftd[]>();
          return Array.isArray(cftd) ? (
            <>
              {cftd.map((v, i) =>
                box((v as Cftd).maxShiftableDays ?? "\u00A0", i),
              )}
            </>
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
            accessorFn: defaultAccessorFn("sy"),
            cell: (props) => {
              const sy = props.getValue<Sy[]>();
              return Array.isArray(sy) ? (
                <>{sy.map((v, i) => box((v as Sy).time ?? "\u00A0", i))}</>
              ) : undefined;
            },
          },
          {
            id: "group10.group2.col2",
            header: ajsTableColumnHeader["group10.group2.col2"],
            accessorFn: defaultAccessorFn("ey"),
            cell: (props) => {
              const ey = props.getValue<Ey[]>();
              return Array.isArray(ey) ? (
                <>{ey.map((v, i) => box((v as Ey).time ?? "\u00A0", i))}</>
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
            accessorFn: defaultAccessorFn("wc"),
            cell: (props) => {
              const wc = props.getValue<Wc[]>();
              return Array.isArray(wc) ? (
                <>
                  {wc.map((v, i) =>
                    box((v as Wc).numberOfTimes ?? "\u00A0", i),
                  )}
                </>
              ) : undefined;
            },
          },
          {
            id: "group10.group3.col2",
            header: ajsTableColumnHeader["group10.group3.col2"],
            accessorFn: defaultAccessorFn("wt"),
            cell: (props) => {
              const wt = props.getValue<Wt[]>();
              return Array.isArray(wt) ? (
                <>{wt.map((v, i) => box((v as Wt).time ?? "\u00A0", i))}</>
              ) : undefined;
            },
          },
        ],
      }),
    ],
  });
};

export default group10;
