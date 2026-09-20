import React, { FC, KeyboardEvent, memo } from "react";
import { Header, HeaderGroup } from "@tanstack/table-core";
import { flexRender } from "@tanstack/react-table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import type { SxProps, Theme } from "@mui/material/styles";
import type { TableRowView } from "./tableViewerData";
import type { TableGridFocus } from "./tableNavigationModel";
import { viewerFocusIndicatorSx } from "../../shared/viewerTheme";

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
  return tableHeaderAriaSortValue(header.column.getIsSorted());
};

const tableHeaderAriaSortValue = (
  sort: false | "asc" | "desc",
): "ascending" | "descending" | "none" => {
  if (sort === "asc") return "ascending";
  if (sort === "desc") return "descending";
  return "none";
};

const headerFocus = (
  header: Header<TableRowView, unknown>,
): TableGridFocus => ({
  kind: "header",
  columnId: header.column.id,
});

const isCurrentHeaderFocus = (
  focus: TableGridFocus | undefined,
  header: Header<TableRowView, unknown>,
): boolean => focus?.kind === "header" && focus.columnId === header.column.id;

const renderSortableHeaderContent = (
  header: Header<TableRowView, unknown>,
  content: React.ReactNode,
  props: TableHeaderProps,
): React.ReactNode => {
  const isSorted = header.column.getIsSorted();
  const focus = headerFocus(header);
  const isCurrent = isCurrentHeaderFocus(props.currentFocus, header);
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
): React.ReactNode => <TableHeaderCell header={header} props={props} />;

const TableHeaderCell = ({
  header,
  props,
}: Readonly<{
  header: Header<TableRowView, unknown>;
  props: TableHeaderProps;
}>): React.ReactElement => {
  const columnIndex = visibleHeaderColumnIndex(header, props.visibleColumnIds);
  const focus = headerFocus(header);
  const focusTableCell =
    canFocusTableHeader(header) && !canRenderSortableHeader(header);
  const isCurrent = isCurrentHeaderFocus(props.currentFocus, header);
  const cellProps = createHeaderCellProps({
    header,
    props,
    focus,
    focusTableCell,
    isCurrent,
    columnIndex,
  });
  return (
    <TableCell {...cellProps}>
      {header.isPlaceholder ? undefined : renderHeaderContent(header, props)}
    </TableCell>
  );
};

const visibleHeaderColumnIndex = (
  header: Header<TableRowView, unknown>,
  visibleColumnIds: readonly string[],
): number => {
  const firstLeafColumnId = header.getLeafHeaders()[0]?.column.id;
  return firstLeafColumnId === undefined
    ? -1
    : visibleColumnIds.indexOf(firstLeafColumnId);
};

const createHeaderCellProps = ({
  header,
  props,
  focus,
  focusTableCell,
  isCurrent,
  columnIndex,
}: Readonly<{
  header: Header<TableRowView, unknown>;
  props: TableHeaderProps;
  focus: TableGridFocus;
  focusTableCell: boolean;
  isCurrent: boolean;
  columnIndex: number;
}>) => ({
  ref: headerCellRef(focusTableCell, props, focus),
  key: header.id,
  role: "columnheader" as const,
  "aria-colindex": headerColumnIndex(columnIndex),
  "aria-sort": getTableHeaderAriaSort(header),
  colSpan: header.colSpan,
  tabIndex: headerCellTabIndex(focusTableCell, isCurrent),
  onFocus: headerCellFocusHandler(focusTableCell, props, focus),
  onKeyDown: headerCellKeyDownHandler(focusTableCell, props, focus),
  sx: headerCellSx(focusTableCell),
});

const headerCellRef = (
  focusTableCell: boolean,
  props: TableHeaderProps,
  focus: TableGridFocus,
) =>
  focusTableCell
    ? (element: HTMLElement | null) =>
        props.registerFocusElement(focus, element)
    : undefined;

const headerColumnIndex = (columnIndex: number): number | undefined =>
  columnIndex >= 0 ? columnIndex + 1 : undefined;

const headerCellTabIndex = (
  focusTableCell: boolean,
  isCurrent: boolean,
): number | undefined => {
  if (!focusTableCell) return undefined;
  return isCurrent ? 0 : -1;
};

const headerCellFocusHandler = (
  focusTableCell: boolean,
  props: TableHeaderProps,
  focus: TableGridFocus,
) => (focusTableCell ? () => props.onFocus(focus) : undefined);

const headerCellKeyDownHandler = (
  focusTableCell: boolean,
  props: TableHeaderProps,
  focus: TableGridFocus,
) =>
  focusTableCell
    ? (event: KeyboardEvent<HTMLElement>) => props.onKeyDown(event, focus)
    : undefined;

const headerCellSx = (focusTableCell: boolean) => [
  styleTableCell,
  focusTableCell ? headerCellFocusSx : undefined,
];

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
