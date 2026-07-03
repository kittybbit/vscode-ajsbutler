import React, {
  FC,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { flexRender, HeaderGroup, Row } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/table-core";
import {
  ItemProps,
  TableComponents,
  TableVirtuoso,
  TableVirtuosoHandle,
} from "react-virtuoso";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { SxProps, Theme } from "@mui/material/styles";
import { UnitListRowView } from "../../../../application/unit-list/buildUnitListView";
import { createOperationEvent } from "../../../../shared/webviewEvents";
import TableHeader from "./TableHeader";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import { AccessorType } from "./columnDefs/common";
import { isAjsTableSearchHit } from "./globalFilter";
import {
  handleSelectTableRow,
  handleSelectTableRowKeyDown,
  isTableRowSelected,
} from "./navigation";

type VirtualizedTableProps = {
  headerGroups: HeaderGroup<UnitListRowView>[];
  rows: Row<UnitListRowView>[];
  rowIndex?: number;
  columnVisibility: VisibilityState;
  searchQuery: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  selectedAbsolutePath?: string;
  selectRow: (absolutePath: string) => void;
};

type VirtualizedTableContext = {
  columnVisibilityRevision: string;
  reportRowSelected: () => void;
  rowIndex?: number;
  selectedAbsolutePath?: string;
  selectRow: (absolutePath: string) => void;
};

type VirtualizedTableRowProps = ItemProps<Row<UnitListRowView>> & {
  context: VirtualizedTableContext;
};

type VisibleTableCellRenderContext = {
  cell: ReturnType<Row<UnitListRowView>["getVisibleCells"]>[number];
  row: Row<UnitListRowView>;
  searchQuery: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
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

export const getFixedTableVirtuosoStyle = () => ({
  width: "100%",
  minWidth: 0,
  height: "100%",
  maxHeight: "100%",
  boxSizing: "border-box" as const,
});

const omitVirtuosoContext = <T extends object>(
  props: T,
): Omit<T, "context"> => {
  const propsWithoutContext = { ...props } as T & {
    context?: VirtualizedTableContext;
  };
  Reflect.deleteProperty(propsWithoutContext, "context");
  return propsWithoutContext;
};

const searchHitBackgroundColor = {
  dark: "rgba(255, 214, 102, 0.24)",
  light: "rgba(255, 214, 102, 0.36)",
};

const getSearchHitCellSx = (isSearchHit: boolean) => {
  if (!isSearchHit) {
    return undefined;
  }
  return {
    backgroundColor: (theme: Theme) =>
      searchHitBackgroundColor[theme.palette.mode],
  };
};

const renderVisibleTableCell = ({
  cell,
  row,
  searchQuery,
  parameterSearchValuesByPath,
}: VisibleTableCellRenderContext): ReactNode => {
  const parameters =
    parameterSearchValuesByPath.get(row.original.absolutePath) ?? [];
  const isSearchHit = isAjsTableSearchHit(
    cell.getValue<AccessorType | undefined>(),
    parameters,
    searchQuery,
  );
  return (
    <TableCell
      key={cell.id}
      sx={[styleTableCell, getSearchHitCellSx(isSearchHit)]}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

const VirtualizedTableRow = memo(
  ({ context, ...props }: VirtualizedTableRowProps) => {
    const absolutePath = props.item.original.absolutePath;
    const { reportRowSelected, rowIndex, selectedAbsolutePath, selectRow } =
      context;
    return (
      <TableRow
        {...props}
        hover={true}
        tabIndex={0}
        selected={isTableRowSelected({
          absolutePath,
          selectedAbsolutePath,
          index: props["data-index"],
          revealedRowIndex: rowIndex,
        })}
        onClick={handleSelectTableRow(
          absolutePath,
          selectRow,
          reportRowSelected,
        )}
        onKeyDown={handleSelectTableRowKeyDown(
          absolutePath,
          selectRow,
          reportRowSelected,
        )}
      />
    );
  },
);
VirtualizedTableRow.displayName = "VirtualizedTableRow";

const getColumnVisibilityRevision = (
  columnVisibility: VisibilityState,
): string =>
  Object.entries(columnVisibility)
    .sort(([previous], [next]) => previous.localeCompare(next))
    .map(([columnId, visible]) => `${columnId}:${visible}`)
    .join("|");

const tableComponents: TableComponents<
  Row<UnitListRowView>,
  VirtualizedTableContext
> = {
  Scroller: React.forwardRef<HTMLDivElement>(function scroller(props, ref) {
    return (
      <TableContainer
        {...omitVirtuosoContext(props)}
        ref={ref}
        component={Paper}
        elevation={3}
      />
    );
  }),
  Table: (props: object) => {
    const tableProps = omitVirtuosoContext(props);
    return <Table {...tableProps} size="small" stickyHeader />;
  },
  TableHead: React.forwardRef<HTMLTableSectionElement>(
    function tableHead(props, ref) {
      const tableHeadProps = omitVirtuosoContext(props);
      return <TableHead {...tableHeadProps} ref={ref} />;
    },
  ),
  TableBody: React.forwardRef<HTMLTableSectionElement>(
    function tableBody(props, ref) {
      const tableBodyProps = omitVirtuosoContext(props);
      return <TableBody {...tableBodyProps} ref={ref} />;
    },
  ),
  TableRow: VirtualizedTableRow,
};

const VirtualizedTable: FC<VirtualizedTableProps> = ({
  headerGroups,
  rows,
  rowIndex,
  columnVisibility,
  searchQuery,
  parameterSearchValuesByPath,
  selectedAbsolutePath,
  selectRow,
}) => {
  console.log("render VirtualizedTable.");

  const columnVisibilityRevision = useMemo(
    () => getColumnVisibilityRevision(columnVisibility),
    [columnVisibility],
  );
  const context = useMemo(
    () => ({
      columnVisibilityRevision,
      reportRowSelected: () =>
        window.vscode.postMessage(createOperationEvent("unit.select")),
      rowIndex,
      selectedAbsolutePath,
      selectRow,
    }),
    [columnVisibilityRevision, rowIndex, selectedAbsolutePath, selectRow],
  );

  const virtuosoRef = useRef<TableVirtuosoHandle>(null);

  const itemContent = useCallback(
    (index: number, data: Row<UnitListRowView>) =>
      data.getVisibleCells().map((cell) =>
        renderVisibleTableCell({
          cell,
          row: data,
          searchQuery,
          parameterSearchValuesByPath,
        }),
      ),
    [columnVisibility, parameterSearchValuesByPath, searchQuery],
  );

  const fixedHeaderContent = useCallback(
    () =>
      headerGroups.map((headerGroup) => (
        <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
      )),
    [headerGroups],
  );

  const virtuosoStyle = useMemo(() => getFixedTableVirtuosoStyle(), []);

  useEffect(() => {
    if (rowIndex !== undefined) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: rowIndex,
          align: "center", // 'start' | 'center' | 'end'
          behavior: "smooth", // 'auto' | 'smooth'
        });
      }, 0);
    }
  }, [rowIndex]);

  return (
    <>
      <TableVirtuoso<Row<UnitListRowView>, VirtualizedTableContext>
        ref={virtuosoRef}
        style={virtuosoStyle}
        data={rows}
        components={tableComponents}
        context={context}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={itemContent}
      />
    </>
  );
};
export default memo(VirtualizedTable);
