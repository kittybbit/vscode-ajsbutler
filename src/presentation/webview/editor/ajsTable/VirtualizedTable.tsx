import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { HeaderGroup, Row } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/table-core";
import { ListRange, TableVirtuoso } from "react-virtuoso";
import type { TableRowView } from "./tableViewerData";
import TableHeader from "./TableHeader";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import type {
  TableGridFocus,
  TableGridFocusRequest,
} from "./tableNavigationModel";
import { useTableGridFocus } from "./useTableGridFocus";
import { useTableGridKeyboard } from "./useTableGridKeyboard";
import {
  createTableComponents,
  renderVisibleTableCell,
  type VirtualizedTableContext,
} from "./tableSemanticRenderer";

export {
  getSearchHitCellSx,
  tableGridFocusSx,
  tableRowStateSx,
} from "./tableSemanticRenderer";

type VirtualizedTableProps = {
  headerGroups: HeaderGroup<TableRowView>[];
  rows: Row<TableRowView>[];
  rowIndex?: number;
  columnVisibility: VisibilityState;
  searchQuery: string;
  parameterSearchValuesByPath: ParameterSearchValuesByPath;
  selectedAbsolutePath?: string;
  selectRow: (absolutePath: string) => void;
  commitFocusedRow?: (absolutePath?: string) => string | undefined;
  focusUnitTree: (absolutePath?: string) => void;
  openDetailPane: (absolutePath: string) => void;
  restoreFocusRequest: TableGridFocusRequest;
  documentRevision?: number;
  onGridFocusChange?: (focus: TableGridFocus) => void;
  gridAriaLabel?: string;
};

export const getFixedTableVirtuosoStyle = () => ({
  width: "100%",
  minWidth: 0,
  height: "100%",
  maxHeight: "100%",
  boxSizing: "border-box" as const,
});

export const omitVirtuosoContext = <T extends object>(
  props: T,
): Omit<T, "context"> => {
  const propsWithoutContext = { ...props } as T & {
    context?: VirtualizedTableContext;
  };
  Reflect.deleteProperty(propsWithoutContext, "context");
  return propsWithoutContext;
};

export const getColumnVisibilityRevision = (
  columnVisibility: VisibilityState,
): string =>
  Object.entries(columnVisibility)
    .sort(([previous], [next]) => previous.localeCompare(next))
    .map(([columnId, visible]) => `${columnId}:${visible}`)
    .join("|");

const tableComponents = createTableComponents(omitVirtuosoContext);

const VirtualizedTable: FC<VirtualizedTableProps> = ({
  headerGroups,
  rows,
  rowIndex,
  columnVisibility,
  searchQuery,
  parameterSearchValuesByPath,
  selectedAbsolutePath,
  selectRow,
  commitFocusedRow: commitFocusedRowProp,
  focusUnitTree,
  openDetailPane,
  restoreFocusRequest,
  documentRevision = 0,
  onGridFocusChange,
  gridAriaLabel,
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
  const [pageSize, setPageSize] = useState(10);

  const gridFocus = useTableGridFocus({
    documentRevision,
    rowIndex,
    rowAbsolutePaths,
    selectedAbsolutePath,
    visibleColumnIds,
    sortableColumnIds,
    restoreFocusRequest,
    selectRow,
    commitFocusedRow: commitFocusedRowProp,
    onGridFocusChange,
  });
  const handleGridKeyDown = useTableGridKeyboard({
    focusController: gridFocus,
    focusUnitTree,
    openDetailPane,
    pageSize,
    rowAbsolutePaths,
    selectedAbsolutePath,
    sortableColumnIds,
    visibleColumnIds,
  });
  const {
    currentFocus,
    getCurrentFocus,
    handleGridFocus,
    handleGridPointerDown,
    registerFocusElement,
  } = gridFocus;
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
      gridAriaLabel,
    }),
    [
      columnVisibilityRevision,
      headerGroups.length,
      rowIndex,
      rows.length,
      selectedAbsolutePath,
      gridAriaLabel,
      visibleColumnIds.length,
    ],
  );

  const itemContent = useCallback(
    (index: number, data: Row<TableRowView>) =>
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
          onPointerDown: handleGridPointerDown,
          onKeyDown: handleGridKeyDown,
          registerFocusElement,
        }),
      ),
    [
      columnVisibility,
      getCurrentFocus,
      handleGridFocus,
      handleGridKeyDown,
      handleGridPointerDown,
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

  return (
    <>
      <TableVirtuoso<Row<TableRowView>, VirtualizedTableContext>
        ref={gridFocus.virtuosoRef}
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
