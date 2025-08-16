import React, { FC, memo } from "react";
import { HeaderGroup } from "@tanstack/table-core";
import { flexRender } from "@tanstack/react-table";
import {
  SxProps,
  TableCell,
  TableRow,
  TableSortLabel,
  Theme,
} from "@mui/material";
import { UnitEntity } from "../../../domain/models/units/UnitEntities";

const styleTableCell: SxProps<Theme> = {
  whiteSpace: "nowrap",
  verticalAlign: "top",
  "&:first-child": {
    position: "sticky",
    left: 0,
    zIndex: (theme) => theme.zIndex.appBar,
  },
};

type TableHeaderProps = {
  headerGroup: HeaderGroup<UnitEntity>;
};

const sortLabelSx: SxProps<Theme> = {
  "&:focus-visible": { outline: "-webkit-focus-ring-color auto 1px" },
};

const TableHeader: FC<TableHeaderProps> = ({ headerGroup }) => {
  console.log("render TableHeader.");

  return (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => {
        if (header.isPlaceholder) {
          return (
            <TableCell
              key={header.id}
              colSpan={header.colSpan}
              sx={styleTableCell}
            />
          );
        }

        const isLeaf = header.subHeaders.length === 0;
        const canSort = header.column.getCanSort();

        let content = flexRender(
          header.column.columnDef.header,
          header.getContext(),
        );

        if (isLeaf && canSort) {
          const isSorted = header.column.getIsSorted();
          content = (
            <TableSortLabel
              active={Boolean(isSorted)}
              direction={isSorted !== false ? isSorted : undefined}
              onClick={header.column.getToggleSortingHandler()}
              sx={sortLabelSx}
            >
              {content}
            </TableSortLabel>
          );
        }

        return (
          <TableCell
            key={header.id}
            colSpan={header.colSpan}
            sx={styleTableCell}
          >
            {content}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default memo(TableHeader);
