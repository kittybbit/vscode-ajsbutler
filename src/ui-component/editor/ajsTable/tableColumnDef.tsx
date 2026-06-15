// import * as vscode from 'vscode';
import React from "react";
import { CellContext, createColumnHelper } from "@tanstack/table-core";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  ajsTableColumnLabels,
  paramDefinitionLang,
} from "../../../domain/services/i18n/nls";
import { UnitListRowView } from "../../../application/unit-list/buildUnitListView";
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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { createNavigationEvent } from "../../../shared/webviewEvents";

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

export const handleOpenUnitDefinition =
  (absolutePath: string, openUnitDefinition: (absolutePath: string) => void) =>
  () => {
    openUnitDefinition(absolutePath);
  };

export const handleNavigateToFlow = (absolutePath: string) => () => {
  window.vscode.postMessage(createNavigationEvent("flow", absolutePath));
};

export const tableColumnDef = (
  language: string | undefined = "en",
  openUnitDefinition: (absolutePath: string) => void,
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
            <Tooltip title="View the unit definition">
              <IconButton
                size="small"
                aria-label="View the unit definition"
                onClick={handleOpenUnitDefinition(
                  props.row.original.absolutePath,
                  openUnitDefinition,
                )}
              >
                <DescriptionIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Open the matching unit in the flow graph">
              <IconButton
                size="small"
                aria-label="Open the matching unit in the flow graph"
                onClick={handleNavigateToFlow(props.row.original.absolutePath)}
              >
                <AccountTreeIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
      enableHiding: false,
      enableSorting: false,
      enableGlobalFilter: false,
    }),
    group1(
      columnHelper,
      tableColumnLabels,
      language,
      handleJump,
      rowViewByPath,
    ),
    group2(columnHelper, tableColumnLabels, handleJump, rowViewByPath),
    group3(columnHelper, tableColumnLabels, rowViewByPath),
    group4(columnHelper, tableColumnLabels, rowViewByPath),
    group5(columnHelper, tableColumnLabels, rowViewByPath),
    group6(columnHelper, tableColumnLabels, rowViewByPath),
    group7(columnHelper, tableColumnLabels, rowViewByPath),
    group8(columnHelper, tableColumnLabels, rowViewByPath),
    group9(columnHelper, tableColumnLabels, rowViewByPath),
    group10(columnHelper, tableColumnLabels, paramDefinition, rowViewByPath),
    group11(columnHelper, tableColumnLabels, rowViewByPath),
    group12(columnHelper, tableColumnLabels, rowViewByPath),
    group13(columnHelper, tableColumnLabels, rowViewByPath),
    group14(columnHelper, tableColumnLabels, rowViewByPath),
    group15(columnHelper, tableColumnLabels, rowViewByPath),
    group16(columnHelper, tableColumnLabels, rowViewByPath),
    group17(columnHelper, tableColumnLabels, rowViewByPath),
    group18(columnHelper, tableColumnLabels, rowViewByPath),
    group19(columnHelper, tableColumnLabels, rowViewByPath),
    group20(columnHelper, tableColumnLabels),
  ];
};
