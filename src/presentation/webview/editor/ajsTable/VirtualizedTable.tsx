import React, {
  FC,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HeaderGroup, Row } from "@tanstack/react-table";
import type { VisibilityState } from "@tanstack/table-core";
import { ListRange, TableVirtuoso, TableVirtuosoHandle } from "react-virtuoso";
import type { TableRowView } from "./tableViewerData";
import TableHeader from "./TableHeader";
import type { ParameterSearchValuesByPath } from "./globalFilter";
import { createViewerOperationRequest } from "../../viewerRequestMessages";
import {
  isTableGridNavigationEventOwnedByCell,
  getStickyColumnRevealScrollLeft,
} from "./navigation";
import {
  decideTableGridNavigation,
  decideTableGridRestoration,
  getTableGridFocusKey,
  isTableGridNavigationKey,
  resolveTableGridFocus,
  resolveUnitListGridShortcut,
  type TableGridFocus,
  type TableGridFocusRequest,
} from "./tableNavigationModel";
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
  focusUnitTree: VoidFunction;
  openDetailPane: (absolutePath: string) => void;
  restoreFocusRequest: TableGridFocusRequest;
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
  focusUnitTree,
  openDetailPane,
  restoreFocusRequest,
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
  const headerReturnFocus = useRef<TableGridFocus | undefined>(undefined);
  const pendingFocusKey = useRef<string | undefined>(undefined);
  const observedSelectedAbsolutePath = useRef(selectedAbsolutePath);
  const observedRestoreFocusRevision = useRef(restoreFocusRequest.revision);
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
        reportRowSelected();
        selectRow(focus.absolutePath);
      }
    },
    [applyRovingFocus, reportRowSelected, selectRow],
  );
  const focusGridTarget = useCallback(
    (nextFocus: TableGridFocus | undefined) => {
      if (!nextFocus) return;
      const nextKey = getTableGridFocusKey(nextFocus);
      applyRovingFocus(nextFocus);
      const mountedElement = nextKey
        ? focusElements.current.get(nextKey)
        : undefined;
      if (mountedElement) {
        pendingFocusKey.current = undefined;
        revealGridFocusElement(mountedElement);
        return;
      }
      if (nextFocus.kind !== "cell") return;

      pendingFocusKey.current = nextKey;
      const nextRowIndex = rowAbsolutePaths.indexOf(nextFocus.absolutePath);
      if (nextRowIndex >= 0) {
        virtuosoRef.current?.scrollToIndex({
          index: nextRowIndex,
          align: "center",
          behavior: "auto",
        });
      }
    },
    [applyRovingFocus, rowAbsolutePaths],
  );
  const handleGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, focus: TableGridFocus) => {
      if (
        !isTableGridNavigationEventOwnedByCell(
          event.target,
          event.currentTarget,
          event.key,
          event.ctrlKey,
        )
      ) {
        return;
      }
      const shortcut = resolveUnitListGridShortcut({
        focus,
        key: event.key,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      });
      if (shortcut === "focusColumnHeader" && focus.kind === "cell") {
        event.preventDefault();
        headerReturnFocus.current = focus;
        focusGridTarget({ kind: "header", columnId: focus.columnId });
        return;
      }
      if (shortcut === "focusTree") {
        event.preventDefault();
        focusUnitTree();
        return;
      }
      if (shortcut === "openDetails" && focus.kind === "cell") {
        event.preventDefault();
        openDetailPane(focus.absolutePath);
        return;
      }
      if (shortcut === "returnToSavedCell") {
        const returnFocus = headerReturnFocus.current;
        if (returnFocus) {
          event.preventDefault();
          headerReturnFocus.current = undefined;
          focusGridTarget(
            decideTableGridRestoration(
              returnFocus,
              returnFocus.kind === "cell"
                ? returnFocus.absolutePath
                : undefined,
              rowAbsolutePaths,
              visibleColumnIds,
              sortableColumnIds,
            ).focus,
          );
        }
        return;
      }
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
      const navigationDecision = decideTableGridNavigation({
        current: focus,
        key: event.key,
        ctrlKey: event.ctrlKey,
        pageSize,
        rowAbsolutePaths,
        visibleColumnIds,
        sortableColumnIds,
      });
      const nextFocus = navigationDecision.focus;
      const nextKey = getTableGridFocusKey(nextFocus);
      if (!nextFocus || nextKey === getTableGridFocusKey(focus)) return;
      focusGridTarget(nextFocus);
    },
    [
      focusGridTarget,
      focusUnitTree,
      openDetailPane,
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
    if (observedSelectedAbsolutePath.current !== selectedAbsolutePath) return;
    if (rowIndex !== undefined) {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({
          index: rowIndex,
          align: "center", // 'start' | 'center' | 'end'
          behavior: "smooth", // 'auto' | 'smooth'
        });
      }, 0);
    }
  }, [rowIndex, selectedAbsolutePath]);

  useEffect(() => {
    observedSelectedAbsolutePath.current = selectedAbsolutePath;
  }, [selectedAbsolutePath]);

  useEffect(() => {
    if (observedRestoreFocusRevision.current === restoreFocusRequest.revision) {
      return;
    }
    observedRestoreFocusRevision.current = restoreFocusRequest.revision;
    focusGridTarget(
      decideTableGridRestoration(
        gridFocus.current,
        restoreFocusRequest.absolutePath ?? selectedAbsolutePath,
        rowAbsolutePaths,
        visibleColumnIds,
        sortableColumnIds,
      ).focus,
    );
  }, [
    focusGridTarget,
    restoreFocusRequest,
    rowAbsolutePaths,
    selectedAbsolutePath,
    sortableColumnIds,
    visibleColumnIds,
  ]);

  return (
    <>
      <TableVirtuoso<Row<TableRowView>, VirtualizedTableContext>
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
