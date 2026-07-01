import React, { FC, memo } from "react";
import { Header, HeaderGroup } from "@tanstack/table-core";
import { flexRender } from "@tanstack/react-table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";

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
  headerGroup: HeaderGroup<UnitListRowView>;
};

const sortLabelSx: SxProps<Theme> = {
  "&:focus-visible": { outline: "-webkit-focus-ring-color auto 1px" },
};

const canRenderSortableHeader = (header: Header<UnitListRowView, unknown>) =>
  header.subHeaders.length === 0 && header.column.getCanSort();

const renderSortableHeaderContent = (
  header: Header<UnitListRowView, unknown>,
  content: React.ReactNode,
): React.ReactNode => {
  const isSorted = header.column.getIsSorted();
  return (
    <TableSortLabel
      active={Boolean(isSorted)}
      direction={isSorted !== false ? isSorted : undefined}
      onClick={header.column.getToggleSortingHandler()}
      sx={sortLabelSx}
    >
      {content}
    </TableSortLabel>
  );
};

const renderHeaderContent = (
  header: Header<UnitListRowView, unknown>,
): React.ReactNode => {
  const content = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );
  return canRenderSortableHeader(header)
    ? renderSortableHeaderContent(header, content)
    : content;
};

const renderHeaderCell = (
  header: Header<UnitListRowView, unknown>,
): React.ReactNode => (
  <TableCell key={header.id} colSpan={header.colSpan} sx={styleTableCell}>
    {header.isPlaceholder ? undefined : renderHeaderContent(header)}
  </TableCell>
);

const TableHeader: FC<TableHeaderProps> = ({ headerGroup }) => {
  console.log("render TableHeader.");

  return (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map(renderHeaderCell)}
    </TableRow>
  );
};

export default memo(TableHeader);
