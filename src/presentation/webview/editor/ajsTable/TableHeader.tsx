import React, { FC, KeyboardEvent, memo } from "react";
import { Header, HeaderGroup } from "@tanstack/table-core";
import { flexRender } from "@tanstack/react-table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import type { TableGridFocus } from "./navigation";

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
  headerRowIndex: number;
  currentFocus: TableGridFocus | undefined;
  visibleColumnIds: readonly string[];
  onFocus: (focus: TableGridFocus) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>, focus: TableGridFocus) => void;
  registerFocusElement: (
    focus: TableGridFocus,
    element: HTMLElement | null,
  ) => void;
};

const sortLabelSx: SxProps<Theme> = {
  "&:focus-visible": { outline: "-webkit-focus-ring-color auto 1px" },
};

const canRenderSortableHeader = (header: Header<UnitListRowView, unknown>) =>
  header.subHeaders.length === 0 && header.column.getCanSort();

export const getTableHeaderAriaSort = (
  header: Pick<Header<UnitListRowView, unknown>, "column">,
): "ascending" | "descending" | "none" | undefined => {
  if (!header.column.getCanSort()) return undefined;
  const sort = header.column.getIsSorted();
  return sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";
};

const renderSortableHeaderContent = (
  header: Header<UnitListRowView, unknown>,
  content: React.ReactNode,
  props: TableHeaderProps,
): React.ReactNode => {
  const isSorted = header.column.getIsSorted();
  const focus: TableGridFocus = {
    kind: "header",
    columnId: header.column.id,
  };
  const isCurrent =
    props.currentFocus?.kind === "header" &&
    props.currentFocus.columnId === header.column.id;
  return (
    <TableSortLabel
      ref={(element) => props.registerFocusElement(focus, element)}
      active={Boolean(isSorted)}
      direction={isSorted !== false ? isSorted : undefined}
      onClick={header.column.getToggleSortingHandler()}
      onFocus={() => props.onFocus(focus)}
      onKeyDown={(event) => props.onKeyDown(event, focus)}
      tabIndex={isCurrent ? 0 : -1}
      sx={sortLabelSx}
    >
      {content}
    </TableSortLabel>
  );
};

const renderHeaderContent = (
  header: Header<UnitListRowView, unknown>,
  props: TableHeaderProps,
): React.ReactNode => {
  const content = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );
  return canRenderSortableHeader(header)
    ? renderSortableHeaderContent(header, content, props)
    : content;
};

const renderHeaderCell = (
  header: Header<UnitListRowView, unknown>,
  props: TableHeaderProps,
): React.ReactNode => {
  const firstLeafColumnId = header.getLeafHeaders()[0]?.column.id;
  const columnIndex = props.visibleColumnIds.indexOf(firstLeafColumnId);
  return (
    <TableCell
      key={header.id}
      role="columnheader"
      aria-colindex={columnIndex >= 0 ? columnIndex + 1 : undefined}
      aria-sort={getTableHeaderAriaSort(header)}
      colSpan={header.colSpan}
      sx={styleTableCell}
    >
      {header.isPlaceholder ? undefined : renderHeaderContent(header, props)}
    </TableCell>
  );
};

const TableHeader: FC<TableHeaderProps> = (props) => {
  console.log("render TableHeader.");

  return (
    <TableRow
      key={props.headerGroup.id}
      role="row"
      aria-rowindex={props.headerRowIndex + 1}
    >
      {props.headerGroup.headers.map((header) =>
        renderHeaderCell(header, props),
      )}
    </TableRow>
  );
};

export default memo(TableHeader);
