import React, {
  FC,
  KeyboardEvent,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flexRender, HeaderGroup, Row } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/table-core";
import {
  ItemProps,
  ListRange,
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
import { createViewerOperationRequest } from "../../viewerRequestMessages";
import TableHeader from "./TableHeader";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import { AccessorType } from "./columnDefs/common";
import { isAjsTableSearchHit } from "./globalFilter";
import {
  getStickyColumnRevealScrollLeft,
  getTableGridFocusKey,
  isTableGridNavigationKey,
  isTableRowSelected,
  moveTableGridFocus,
  resolveTableGridFocus,
  type TableGridFocus,
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
  columnCount: number;
  columnVisibilityRevision: string;
  headerRowCount: number;
  rowCount: number;
  rowIndex?: number;
  selectedAbsolutePath?: string;
};

type VirtualizedTableRowProps = ItemProps<Row<UnitListRowView>> & {
  context: VirtualizedTableContext;
};

type VisibleTableCellRenderContext = {
  cell: ReturnType<Row<UnitListRowView>["getVisibleCells"]>[number];
  row: Row<UnitListRowView>;
  searchQuery: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  getCurrentFocus: () => TableGridFocus | undefined;
  rowIndex: number;
  visibleColumnIds: readonly string[];
  onFocus: (focus: TableGridFocus) => void;
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

const revealGridFocusElement = (element: HTMLElement): void => {
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: "nearest", inline: "nearest" });

  const focusedCell = element.closest<HTMLElement>(
    '[role="gridcell"], [role="columnheader"]',
  );
  if (!focusedCell || focusedCell.getAttribute("aria-colindex") === "1") {
    return;
  }
  const row = focusedCell.closest<HTMLElement>('[role="row"]');
  const stickyColumn = row?.querySelector<HTMLElement>('[aria-colindex="1"]');
  const scroller = element.closest<HTMLElement>("[data-table-grid-scroller]");
  if (!stickyColumn || !scroller) return;

  const nextScrollLeft = getStickyColumnRevealScrollLeft(
    scroller.scrollLeft,
    focusedCell.getBoundingClientRect().left,
    Math.max(
      scroller.getBoundingClientRect().left,
      stickyColumn.getBoundingClientRect().right,
    ),
  );
  if (nextScrollLeft !== scroller.scrollLeft) {
    scroller.scrollLeft = nextScrollLeft;
  }
};

const renderVisibleTableCell = ({
  cell,
  row,
  searchQuery,
  parameterSearchValuesByPath,
  getCurrentFocus,
  rowIndex,
  visibleColumnIds,
  onFocus,
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
      onFocus={() => onFocus(focus)}
      onKeyDown={(event) => onKeyDown(event, focus)}
      sx={[styleTableCell, getSearchHitCellSx(isSearchHit)]}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

const VirtualizedTableRow = memo(
  ({ context, ...props }: VirtualizedTableRowProps) => {
    const absolutePath = props.item.original.absolutePath;
    const { headerRowCount, rowIndex, selectedAbsolutePath } = context;
    const isSelected = isTableRowSelected({
      absolutePath,
      selectedAbsolutePath,
      index: props["data-index"],
      revealedRowIndex: rowIndex,
    });
    return (
      <TableRow
        {...props}
        role="row"
        aria-rowindex={headerRowCount + props["data-index"] + 1}
        aria-selected={isSelected}
        hover={true}
        selected={isSelected}
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
        data-table-grid-scroller
        ref={ref}
        component={Paper}
        elevation={3}
      />
    );
  }),
  Table: (props: object) => {
    const { context } = props as { context?: VirtualizedTableContext };
    const tableProps = omitVirtuosoContext(props);
    return (
      <Table
        {...tableProps}
        role="grid"
        aria-rowcount={
          context ? context.headerRowCount + context.rowCount : undefined
        }
        aria-colcount={context?.columnCount}
        size="small"
        stickyHeader
      />
    );
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

  const leafHeaders = headerGroups[headerGroups.length - 1]?.headers ?? [];
  const visibleColumnIds = useMemo(
    () => leafHeaders.map((header) => header.column.id),
    [leafHeaders],
  );
  const sortableColumnIds = useMemo(
    () =>
      leafHeaders
        .filter((header) => header.column.getCanSort())
        .map((header) => header.column.id),
    [leafHeaders],
  );
  const rowAbsolutePaths = useMemo(
    () => rows.map((row) => row.original.absolutePath),
    [rows],
  );
  const gridFocus = useRef<TableGridFocus | undefined>(undefined);
  const selectedAbsolutePathRef = useRef(selectedAbsolutePath);
  selectedAbsolutePathRef.current = selectedAbsolutePath;
  const currentFocus = resolveTableGridFocus(
    gridFocus.current,
    selectedAbsolutePath,
    rowAbsolutePaths,
    visibleColumnIds,
    sortableColumnIds,
  );
  gridFocus.current = currentFocus;
  const [pageSize, setPageSize] = useState(10);
  const focusElements = useRef(new Map<string, HTMLElement>());
  const pendingFocusKey = useRef<string | undefined>(undefined);
  const skipSelectedRowScrollPath = useRef<string | undefined>(undefined);
  const virtuosoRef = useRef<TableVirtuosoHandle>(null);

  const reportRowSelected = useCallback(
    () =>
      window.vscode.postMessage(createViewerOperationRequest("unit.select")),
    [],
  );
  const registerFocusElement = useCallback(
    (focus: TableGridFocus, element: HTMLElement | null) => {
      const key = getTableGridFocusKey(focus);
      if (!key) return;
      if (element) {
        focusElements.current.set(key, element);
        if (pendingFocusKey.current === key) {
          element.tabIndex = 0;
          revealGridFocusElement(element);
          pendingFocusKey.current = undefined;
        }
      } else {
        focusElements.current.delete(key);
      }
    },
    [],
  );
  const getCurrentFocus = useCallback(() => gridFocus.current, []);
  const applyRovingFocus = useCallback((focus: TableGridFocus) => {
    const previousKey = getTableGridFocusKey(gridFocus.current);
    const nextKey = getTableGridFocusKey(focus);
    if (previousKey !== nextKey) {
      const previousElement = previousKey
        ? focusElements.current.get(previousKey)
        : undefined;
      if (previousElement) previousElement.tabIndex = -1;
    }
    gridFocus.current = focus;
    const nextElement = nextKey
      ? focusElements.current.get(nextKey)
      : undefined;
    if (nextElement) nextElement.tabIndex = 0;
  }, []);
  const handleGridFocus = useCallback(
    (focus: TableGridFocus) => {
      applyRovingFocus(focus);
      if (
        focus.kind === "cell" &&
        focus.absolutePath !== selectedAbsolutePathRef.current
      ) {
        selectedAbsolutePathRef.current = focus.absolutePath;
        skipSelectedRowScrollPath.current = focus.absolutePath;
        reportRowSelected();
        selectRow(focus.absolutePath);
      }
    },
    [applyRovingFocus, reportRowSelected, selectRow],
  );
  const handleGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, focus: TableGridFocus) => {
      if (event.target !== event.currentTarget) return;
      if (!isTableGridNavigationKey(event.key, event.ctrlKey)) {
        if (focus.kind === "cell" && event.key === "Enter") {
          const action = event.currentTarget.querySelector<HTMLElement>(
            "[data-grid-cell-action]",
          );
          if (action) {
            event.preventDefault();
            action.click();
          }
        }
        return;
      }

      event.preventDefault();
      const nextFocus = moveTableGridFocus({
        current: focus,
        key: event.key,
        ctrlKey: event.ctrlKey,
        pageSize,
        rowAbsolutePaths,
        visibleColumnIds,
        sortableColumnIds,
      });
      const nextKey = getTableGridFocusKey(nextFocus);
      if (!nextFocus || nextKey === getTableGridFocusKey(focus)) return;

      applyRovingFocus(nextFocus);
      const mountedElement = nextKey
        ? focusElements.current.get(nextKey)
        : undefined;
      if (mountedElement) {
        pendingFocusKey.current = undefined;
        revealGridFocusElement(mountedElement);
      } else if (nextFocus.kind === "cell") {
        pendingFocusKey.current = nextKey;
        const nextRowIndex = rowAbsolutePaths.indexOf(nextFocus.absolutePath);
        if (nextRowIndex >= 0) {
          virtuosoRef.current?.scrollToIndex({
            index: nextRowIndex,
            align: "center",
            behavior: "auto",
          });
        }
      }
    },
    [
      applyRovingFocus,
      pageSize,
      rowAbsolutePaths,
      sortableColumnIds,
      visibleColumnIds,
    ],
  );
  const handleRenderedRangeChanged = useCallback((range: ListRange) => {
    setPageSize(Math.max(range.endIndex - range.startIndex + 1, 1));
  }, []);

  const columnVisibilityRevision = useMemo(
    () => getColumnVisibilityRevision(columnVisibility),
    [columnVisibility],
  );
  const context = useMemo(
    () => ({
      columnVisibilityRevision,
      columnCount: visibleColumnIds.length,
      headerRowCount: headerGroups.length,
      rowCount: rows.length,
      rowIndex,
      selectedAbsolutePath,
    }),
    [
      columnVisibilityRevision,
      headerGroups.length,
      rowIndex,
      rows.length,
      selectedAbsolutePath,
      visibleColumnIds.length,
    ],
  );

  const itemContent = useCallback(
    (index: number, data: Row<UnitListRowView>) =>
      data.getVisibleCells().map((cell) =>
        renderVisibleTableCell({
          cell,
          row: data,
          searchQuery,
          parameterSearchValuesByPath,
          getCurrentFocus,
          rowIndex: headerGroups.length + index + 1,
          visibleColumnIds,
          onFocus: handleGridFocus,
          onKeyDown: handleGridKeyDown,
          registerFocusElement,
        }),
      ),
    [
      columnVisibility,
      getCurrentFocus,
      handleGridFocus,
      handleGridKeyDown,
      headerGroups.length,
      parameterSearchValuesByPath,
      registerFocusElement,
      searchQuery,
      visibleColumnIds,
    ],
  );

  const fixedHeaderContent = useCallback(
    () =>
      headerGroups.map((headerGroup, headerRowIndex) => (
        <TableHeader
          key={headerGroup.id}
          headerGroup={headerGroup}
          headerRowIndex={headerRowIndex}
          currentFocus={currentFocus}
          visibleColumnIds={visibleColumnIds}
          onFocus={handleGridFocus}
          onKeyDown={handleGridKeyDown}
          registerFocusElement={registerFocusElement}
        />
      )),
    [
      currentFocus,
      handleGridFocus,
      handleGridKeyDown,
      headerGroups,
      registerFocusElement,
      visibleColumnIds,
    ],
  );

  const virtuosoStyle = useMemo(() => getFixedTableVirtuosoStyle(), []);

  useEffect(() => {
    if (rowIndex !== undefined) {
      const selectedRowPath = rowAbsolutePaths[rowIndex];
      if (skipSelectedRowScrollPath.current === selectedRowPath) {
        skipSelectedRowScrollPath.current = undefined;
        return;
      }
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: rowIndex,
          align: "center", // 'start' | 'center' | 'end'
          behavior: "smooth", // 'auto' | 'smooth'
        });
      }, 0);
    }
  }, [rowAbsolutePaths, rowIndex]);

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
        rangeChanged={handleRenderedRangeChanged}
      />
    </>
  );
};
export default memo(VirtualizedTable);
