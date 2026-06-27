// import * as vscode from 'vscode';
import React from "react";
import { CellContext, createColumnHelper } from "@tanstack/table-core";
import {
  ajsTableColumnLabels,
  paramDefinitionLang,
} from "../../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { AccessorType, box } from "./columnDefs/common";
import group1 from "./columnDefs/group1";
import group2 from "./columnDefs/group2";
import group3 from "./columnDefs/group3";
import group4 from "./columnDefs/group4";
import group5 from "./columnDefs/group5";
import group6 from "./columnDefs/group6";
import group7 from "./columnDefs/group7";
import group8 from "./columnDefs/group8";
import group9 from "./columnDefs/group9";
import group10 from "./columnDefs/group10";
import group11 from "./columnDefs/group11";
import group12 from "./columnDefs/group12";
import group13 from "./columnDefs/group13";
import group14 from "./columnDefs/group14";
import group15 from "./columnDefs/group15";
import group16 from "./columnDefs/group16";
import group17 from "./columnDefs/group17";
import group18 from "./columnDefs/group18";
import group19 from "./columnDefs/group19";
import group20 from "./columnDefs/group20";
import Box from "@mui/material/Box";

// default setting of
export const tableDefaultColumnDef = {
  enableHiding: true,
  enableSorting: true,
  cell: (props: CellContext<UnitListRowView, unknown>) => {
    const param = props.getValue<AccessorType>();
    // undefined
    if (param === undefined) {
      return undefined;
    }
    if (Array.isArray(param)) {
      return <>{param.map((v, i) => box(v, i))}</>;
    }
    return box(param);
  },
};

export const tableColumnDef = (
  language: string | undefined = "en",
  handleJump: (id: string) => void,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
) => {
  // column titles
  const tableColumnLabels = ajsTableColumnLabels(language);
  // paramter
  const paramDefinition = paramDefinitionLang(language);

  const columnHelper = createColumnHelper<UnitListRowView>();

  return [
    columnHelper.display({
      id: "#",
      header: "#",
      cell: (props) => {
        return (
          <Box sx={{ textAlign: "right" }}>
            <span id={props.row.original.id} tabIndex={0}>
              {props.row.index + 1}
            </span>
          </Box>
        );
      },
      enableHiding: false,
      enableSorting: false,
      enableGlobalFilter: false,
    }),
    group1(
      columnHelper,
      tableColumnLabels.group(1),
      language,
      handleJump,
      rowViewByPath,
    ),
    group2(columnHelper, tableColumnLabels.group(2), handleJump, rowViewByPath),
    group3(columnHelper, tableColumnLabels.group(3), rowViewByPath),
    group4(columnHelper, tableColumnLabels.group(4), rowViewByPath),
    group5(columnHelper, tableColumnLabels.group(5), rowViewByPath),
    group6(columnHelper, tableColumnLabels.group(6), rowViewByPath),
    group7(columnHelper, tableColumnLabels.group(7), rowViewByPath),
    group8(columnHelper, tableColumnLabels.group(8), rowViewByPath),
    group9(columnHelper, tableColumnLabels.group(9), rowViewByPath),
    group10(
      columnHelper,
      tableColumnLabels.group(10),
      paramDefinition,
      rowViewByPath,
    ),
    group11(columnHelper, tableColumnLabels.group(11), rowViewByPath),
    group12(columnHelper, tableColumnLabels.group(12), rowViewByPath),
    group13(columnHelper, tableColumnLabels.group(13), rowViewByPath),
    group14(columnHelper, tableColumnLabels.group(14), rowViewByPath),
    group15(columnHelper, tableColumnLabels.group(15), rowViewByPath),
    group16(columnHelper, tableColumnLabels.group(16), rowViewByPath),
    group17(columnHelper, tableColumnLabels.group(17), rowViewByPath),
    group18(columnHelper, tableColumnLabels.group(18), rowViewByPath),
    group19(columnHelper, tableColumnLabels.group(19), rowViewByPath),
    group20(columnHelper, tableColumnLabels.group(20)),
  ];
};
