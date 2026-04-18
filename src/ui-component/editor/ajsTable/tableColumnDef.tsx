// import * as vscode from 'vscode';
import React from "react";
import { CellContext, createColumnHelper } from "@tanstack/table-core";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  ajsTableColumnHeaderLang,
  paramDefinitionLang,
  tyDefinitionLang,
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

export const tableColumnDef = (
  language: string | undefined = "en",
  openUnitDefinition: (absolutePath: string) => void,
  handleJump: (id: string) => void,
  rowViewByPath: ReadonlyMap<string, UnitListRowView>,
) => {
  // column titles
  const ajsTableColumnHeader = ajsTableColumnHeaderLang(language);
  // tyDefinition
  const tyDefinition = tyDefinitionLang(language);
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
          </Box>
        );
      },
      enableHiding: false,
      enableSorting: false,
      enableGlobalFilter: false,
    }),
    group1(
      columnHelper,
      ajsTableColumnHeader,
      tyDefinition,
      handleJump,
      rowViewByPath,
    ),
    group2(columnHelper, ajsTableColumnHeader, handleJump, rowViewByPath),
    group3(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group4(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group5(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group6(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group7(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group8(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group9(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group10(columnHelper, ajsTableColumnHeader, paramDefinition, rowViewByPath),
    group11(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group12(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group13(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group14(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group15(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group16(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group17(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group18(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group19(columnHelper, ajsTableColumnHeader, rowViewByPath),
    group20(columnHelper, ajsTableColumnHeader),
  ];
};
