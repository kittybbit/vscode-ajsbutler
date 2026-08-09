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
import {
  isTableGridNavigationEventOwnedByCell,
  getStickyColumnRevealScrollLeft,
} from "./navigation";
import {
  decideTableGridNavigation,
  decideTableGridRestoration,
  getTableGridFocusKey,
  isTableGridNavigationKey,
  resolveTableGridCommitPath,
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
  const gridFocus = useRef<TableGridFocus | undefined>(undefined);
  const selectedAbsolutePathRef = useRef(selectedAbsolutePath);
  selectedAbsolutePathRef.current = selectedAbsolutePath;
  const observedDocumentRevision = useRef(documentRevision);
  const observedSelectedAbsolutePath = useRef(selectedAbsolutePath);
  const focusElements = useRef(new Map<string, HTMLElement>());
  const headerReturnFocus = useRef<TableGridFocus | undefined>(undefined);
  const pendingFocusKey = useRef<string | undefined>(undefined);
  const keyboardFocusPendingSelection = useRef(false);
  const pointerActionPending = useRef(false);
  const observedRestoreFocusRevision = useRef(restoreFocusRequest.revision);
  const documentRevisionChanged =
    observedDocumentRevision.current !== documentRevision;
  const selectionChanged =
    observedSelectedAbsolutePath.current !== selectedAbsolutePath;
  if (documentRevisionChanged) {
    observedDocumentRevision.current = documentRevision;
    gridFocus.current = undefined;
    pendingFocusKey.current = undefined;
    headerReturnFocus.current = undefined;
    keyboardFocusPendingSelection.current = false;
    pointerActionPending.current = false;
    observedRestoreFocusRevision.current = restoreFocusRequest.revision;
  } else if (
    selectionChanged &&
    gridFocus.current?.kind === "cell" &&
    gridFocus.current.absolutePath !== selectedAbsolutePath
  ) {
    gridFocus.current = undefined;
    pendingFocusKey.current = undefined;
    keyboardFocusPendingSelection.current = false;
    pointerActionPending.current = false;
  }
  const previousFocus = gridFocus.current;
  const currentFocus = resolveTableGridFocus(
    gridFocus.current,
    documentRevisionChanged ? undefined : selectedAbsolutePath,
    rowAbsolutePaths,
    visibleColumnIds,
    sortableColumnIds,
  );
  if (
    getTableGridFocusKey(previousFocus) !== getTableGridFocusKey(currentFocus)
  ) {
    pendingFocusKey.current = undefined;
    keyboardFocusPendingSelection.current = false;
  }
  gridFocus.current = currentFocus;
  const [pageSize, setPageSize] = useState(10);
  const virtuosoRef = useRef<TableVirtuosoHandle>(null);

  const notifyGridFocusChange = useCallback(
    (focus: TableGridFocus): void => {
      onGridFocusChange?.(focus);
    },
    [onGridFocusChange],
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
      notifyGridFocusChange(focus);
      if (keyboardFocusPendingSelection.current) {
        keyboardFocusPendingSelection.current = false;
        return;
      }
      if (pointerActionPending.current) {
        pointerActionPending.current = false;
        return;
      }
      if (
        focus.kind === "cell" &&
        focus.absolutePath !== selectedAbsolutePathRef.current
      ) {
        selectRow(focus.absolutePath);
      }
    },
    [applyRovingFocus, notifyGridFocusChange, selectRow],
  );
  const handleGridPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      keyboardFocusPendingSelection.current = false;
      const target = event.target as HTMLElement | null;
      pointerActionPending.current = Boolean(
        target?.closest?.("[data-grid-cell-action]"),
      );
    },
    [],
  );
  const commitFocusedGridRow = useCallback(
    (absolutePath?: string): string | undefined => {
      const targetPath =
        absolutePath ??
        resolveTableGridCommitPath(
          gridFocus.current,
          selectedAbsolutePathRef.current,
        );
      if (!targetPath) return undefined;
      if (commitFocusedRowProp) return commitFocusedRowProp(targetPath);
      selectRow(targetPath);
      return targetPath;
    },
    [commitFocusedRowProp, selectRow],
  );
  const focusGridTarget = useCallback(
    (nextFocus: TableGridFocus | undefined, fromKeyboard = false) => {
      if (!nextFocus) return;
      if (fromKeyboard) keyboardFocusPendingSelection.current = true;
      const nextKey = getTableGridFocusKey(nextFocus);
      applyRovingFocus(nextFocus);
      notifyGridFocusChange(nextFocus);
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
    [applyRovingFocus, notifyGridFocusChange, rowAbsolutePaths],
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
        commitFocusedGridRow(focus.absolutePath);
        headerReturnFocus.current = focus;
        focusGridTarget({ kind: "header", columnId: focus.columnId });
        return;
      }
      if (shortcut === "focusTree") {
        event.preventDefault();
        const committedPath = commitFocusedGridRow(
          focus.kind === "cell" ? focus.absolutePath : undefined,
        );
        focusUnitTree(committedPath);
        return;
      }
      if (shortcut === "openDetails" && focus.kind === "cell") {
        event.preventDefault();
        commitFocusedGridRow(focus.absolutePath);
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
          commitFocusedGridRow(focus.absolutePath);
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
      focusGridTarget(nextFocus, true);
    },
    [
      commitFocusedGridRow,
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

  useEffect(
    () => () => {
      gridFocus.current = undefined;
      pendingFocusKey.current = undefined;
      headerReturnFocus.current = undefined;
      keyboardFocusPendingSelection.current = false;
      pointerActionPending.current = false;
      focusElements.current.clear();
    },
    [],
  );

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
