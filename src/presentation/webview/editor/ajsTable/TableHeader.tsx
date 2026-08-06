import React, { FC, KeyboardEvent, memo } from "react";
import { Header, HeaderGroup } from "@tanstack/table-core";
import { flexRender } from "@tanstack/react-table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import type { TableRowView } from "./tableViewerData";
import type { TableGridFocus } from "./navigation";
import { viewerFocusIndicatorSx } from "../shared/viewerThemeStyles";

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
  headerGroup: HeaderGroup<TableRowView>;
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

const sortLabelSx = viewerFocusIndicatorSx;

const headerCellFocusSx = viewerFocusIndicatorSx;

const canRenderSortableHeader = (header: Header<TableRowView, unknown>) =>
  header.subHeaders.length === 0 && header.column.getCanSort();

export const canFocusTableHeader = (
  header: Pick<Header<TableRowView, unknown>, "subHeaders">,
): boolean => header.subHeaders.length === 0;

export const getTableHeaderAriaSort = (
  header: Pick<Header<TableRowView, unknown>, "column">,
): "ascending" | "descending" | "none" | undefined => {
  if (!header.column.getCanSort()) return undefined;
  const sort = header.column.getIsSorted();
  return sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";
};

const renderSortableHeaderContent = (
  header: Header<TableRowView, unknown>,
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
  header: Header<TableRowView, unknown>,
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
  header: Header<TableRowView, unknown>,
  props: TableHeaderProps,
): React.ReactNode => {
  const firstLeafColumnId = header.getLeafHeaders()[0]?.column.id;
  const columnIndex = props.visibleColumnIds.indexOf(firstLeafColumnId);
  const focus: TableGridFocus = {
    kind: "header",
    columnId: header.column.id,
  };
  const focusTableCell =
    canFocusTableHeader(header) && !canRenderSortableHeader(header);
  const isCurrent =
    props.currentFocus?.kind === "header" &&
    props.currentFocus.columnId === header.column.id;
  return (
    <TableCell
      ref={
        focusTableCell
          ? (element) =>
              props.registerFocusElement(focus, element as HTMLElement | null)
          : undefined
      }
      key={header.id}
      role="columnheader"
      aria-colindex={columnIndex >= 0 ? columnIndex + 1 : undefined}
      aria-sort={getTableHeaderAriaSort(header)}
      colSpan={header.colSpan}
      tabIndex={focusTableCell ? (isCurrent ? 0 : -1) : undefined}
      onFocus={focusTableCell ? () => props.onFocus(focus) : undefined}
      onKeyDown={
        focusTableCell ? (event) => props.onKeyDown(event, focus) : undefined
      }
      sx={[styleTableCell, focusTableCell ? headerCellFocusSx : undefined]}
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
