import React, { KeyboardEvent, ReactNode, memo } from "react";
import { flexRender, Row } from "@tanstack/react-table";
import { TableComponents } from "react-virtuoso";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { SxProps, Theme } from "@mui/material/styles";
import type { TableRowView } from "./tableViewerData";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import { AccessorType } from "./columnDefs/common";
import { isAjsTableSearchHit } from "./globalFilter";
import { isTableRowSelected } from "./navigation";
import type { TableGridFocus } from "./tableNavigationModel";
import {
  viewerFocusIndicatorSx,
  viewerSearchBorder,
  viewerSelectionBorder,
} from "../shared/viewerThemeStyles";

export type VirtualizedTableContext = {
  columnCount: number;
  columnVisibilityRevision: string;
  headerRowCount: number;
  rowCount: number;
  rowIndex?: number;
  selectedAbsolutePath?: string;
  gridAriaLabel?: string;
};

type VirtualizedTableRowProps = {
  context: VirtualizedTableContext;
  item: Row<TableRowView>;
  [key: string]: unknown;
};

export type VisibleTableCellRenderContext = {
  cell: ReturnType<Row<TableRowView>["getVisibleCells"]>[number];
  row: Row<TableRowView>;
  searchQuery: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  getCurrentFocus: () => TableGridFocus | undefined;
  rowIndex: number;
  visibleColumnIds: readonly string[];
  onFocus: (focus: TableGridFocus) => void;
  onPointerDown: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>, focus: TableGridFocus) => void;
  registerFocusElement: (
    focus: TableGridFocus,
    element: HTMLElement | null,
  ) => void;
};

const styleTableCell: SxProps<Theme> = {
  whiteSpace: "nowrap",
  verticalAlign: "top",
  "&:first-child": {
    position: "sticky",
    left: 0,
    backgroundColor: (theme) => theme.palette.background.default,
  },
};

export const tableGridFocusSx = viewerFocusIndicatorSx;
export const tableRowStateSx = {
  '&[aria-selected="true"] > td': {
    boxShadow: (theme: Theme) =>
      `inset 0 2px 0 ${viewerSelectionBorder(theme)}, inset 0 -2px 0 ${viewerSelectionBorder(theme)}`,
  },
  "@media (forced-colors: active)": {
    '&[aria-selected="true"] > td': {
      boxShadow: "inset 0 2px 0 CanvasText, inset 0 -2px 0 CanvasText",
    },
  },
};

const searchHitBackgroundColor = {
  dark: "rgba(255, 214, 102, 0.24)",
  light: "rgba(255, 214, 102, 0.36)",
};

export const getSearchHitCellSx = (isSearchHit: boolean) =>
  isSearchHit
    ? {
        backgroundColor: (theme: Theme) =>
          searchHitBackgroundColor[theme.palette.mode],
        borderBottom: (theme: Theme) =>
          `2px dotted ${viewerSearchBorder(theme)}`,
        "@media (forced-colors: active)": {
          backgroundColor: "Canvas",
          borderBottom: "2px dotted Highlight",
        },
      }
    : undefined;

export const renderVisibleTableCell = ({
  cell,
  row,
  searchQuery,
  parameterSearchValuesByPath,
  getCurrentFocus,
  rowIndex,
  visibleColumnIds,
  onFocus,
  onPointerDown,
  onKeyDown,
  registerFocusElement,
}: VisibleTableCellRenderContext): ReactNode => {
  const parameters =
    parameterSearchValuesByPath.get(row.original.absolutePath) ?? [];
  const isSearchHit = isAjsTableSearchHit(
    cell.getValue<AccessorType | undefined>(),
    parameters,
    searchQuery,
  );
  const focus: TableGridFocus = {
    kind: "cell",
    absolutePath: row.original.absolutePath,
    columnId: cell.column.id,
  };
  const currentFocus = getCurrentFocus();
  const isCurrent =
    currentFocus?.kind === "cell" &&
    currentFocus.absolutePath === focus.absolutePath &&
    currentFocus.columnId === focus.columnId;
  return (
    <TableCell
      ref={(element) =>
        registerFocusElement(focus, element as HTMLElement | null)
      }
      key={cell.id}
      role="gridcell"
      aria-colindex={visibleColumnIds.indexOf(cell.column.id) + 1}
      aria-rowindex={rowIndex}
      tabIndex={isCurrent ? 0 : -1}
      onClick={(event) => event.currentTarget.focus()}
      onPointerDown={onPointerDown}
      onFocus={() => onFocus(focus)}
      onKeyDown={(event) => onKeyDown(event, focus)}
      sx={[styleTableCell, tableGridFocusSx, getSearchHitCellSx(isSearchHit)]}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export const createTableComponents = (
  omitVirtuosoContext: <T extends object>(props: T) => Omit<T, "context">,
): TableComponents<Row<TableRowView>, VirtualizedTableContext> => {
  const VirtualizedTableRow = memo(
    ({ context, ...props }: VirtualizedTableRowProps) => {
      const absolutePath = props.item.original.absolutePath;
      // Virtuoso supplies this runtime prop while the generic adapter type does not expose it.
      // eslint-disable-next-line react/prop-types
      const dataIndex = props["data-index"] as number;
      const isSelected = isTableRowSelected({
        absolutePath,
        selectedAbsolutePath: context.selectedAbsolutePath,
        index: dataIndex,
        revealedRowIndex: context.rowIndex,
      });
      return (
        <TableRow
          {...props}
          role="row"
          aria-rowindex={context.headerRowCount + dataIndex + 1}
          aria-selected={isSelected}
          hover={true}
          selected={isSelected}
          sx={tableRowStateSx}
        />
      );
    },
  );
  VirtualizedTableRow.displayName = "VirtualizedTableRow";
  return {
    Scroller: React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
      return (
        <TableContainer
          {...omitVirtuosoContext(props)}
          data-table-grid-scroller
          ref={ref}
          component={Paper}
          elevation={3}
        />
      );
    }),
    Table: (props: object) => {
      const { context } = props as { context?: VirtualizedTableContext };
      return (
        <Table
          {...omitVirtuosoContext(props)}
          role="grid"
          aria-rowcount={
            context ? context.headerRowCount + context.rowCount : undefined
          }
          aria-colcount={context?.columnCount}
          aria-label={context?.gridAriaLabel}
          size="small"
          stickyHeader
        />
      );
    },
    TableHead: React.forwardRef<HTMLTableSectionElement>(
      function tableHead(props, ref) {
        return <TableHead {...omitVirtuosoContext(props)} ref={ref} />;
      },
    ),
    TableBody: React.forwardRef<HTMLTableSectionElement>(
      function tableBody(props, ref) {
        return <TableBody {...omitVirtuosoContext(props)} ref={ref} />;
      },
    ),
    TableRow: VirtualizedTableRow as unknown as TableComponents<
      Row<TableRowView>,
      VirtualizedTableContext
    >["TableRow"],
  };
};
