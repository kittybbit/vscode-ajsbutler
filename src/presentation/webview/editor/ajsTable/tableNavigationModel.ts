/** Pure keyboard, focus, selection, and scroll decisions for the unit-list grid. */

export type TableGridFocus =
  | { kind: "header"; columnId: string }
  | { kind: "cell"; absolutePath: string; columnId: string };

export type TableGridNavigationContext = {
  current: TableGridFocus | undefined;
  key: string;
  ctrlKey?: boolean;
  pageSize: number;
  rowAbsolutePaths: readonly string[];
  visibleColumnIds: readonly string[];
  sortableColumnIds: readonly string[];
};

export type TableGridFocusRequest = {
  revision: number;
  absolutePath?: string;
};

export type UnitListGridShortcut =
  | "focusColumnHeader"
  | "focusTree"
  | "openDetails"
  | "returnToSavedCell";

export type UnitListGridShortcutContext = {
  focus: TableGridFocus;
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export type TableNavigationDecision = {
  focus: TableGridFocus | undefined;
  selectedAbsolutePath?: string;
  scrollTargetAbsolutePath?: string;
};

const areTableGridFocusesEqual = (
  previous: TableGridFocus | undefined,
  next: TableGridFocus | undefined,
): boolean =>
  previous?.kind === next?.kind &&
  previous?.columnId === next?.columnId &&
  (previous?.kind !== "cell" ||
    (next?.kind === "cell" && previous.absolutePath === next.absolutePath));

export const getTableGridFocusKey = (
  focus: TableGridFocus | undefined,
): string | undefined =>
  focus?.kind === "header"
    ? `header:${focus.columnId}`
    : focus
      ? `cell:${focus.absolutePath}:${focus.columnId}`
      : undefined;

export const resolveTableGridCommitPath = (
  focus: TableGridFocus | undefined,
  committedAbsolutePath: string | undefined,
): string | undefined =>
  focus?.kind === "cell" ? focus.absolutePath : committedAbsolutePath;

export const resolveUnitListGridShortcut = ({
  focus,
  key,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
}: UnitListGridShortcutContext): UnitListGridShortcut | undefined => {
  if (altKey || ctrlKey || metaKey || shiftKey) return undefined;
  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "l") return "focusTree";
  if (focus.kind === "cell" && normalizedKey === "h") {
    return "focusColumnHeader";
  }
  if (focus.kind === "cell" && normalizedKey === "d") return "openDetails";
  return focus.kind === "header" && key === "Escape"
    ? "returnToSavedCell"
    : undefined;
};

export const resolveTableGridFocus = (
  current: TableGridFocus | undefined,
  selectedAbsolutePath: string | undefined,
  rowAbsolutePaths: readonly string[],
  visibleColumnIds: readonly string[],
  sortableColumnIds: readonly string[],
): TableGridFocus | undefined => {
  if (
    current?.kind === "header" &&
    visibleColumnIds.includes(current.columnId)
  ) {
    return current;
  }
  if (
    current?.kind === "cell" &&
    rowAbsolutePaths.includes(current.absolutePath) &&
    visibleColumnIds.includes(current.columnId)
  ) {
    return current;
  }
  if (
    selectedAbsolutePath !== undefined &&
    rowAbsolutePaths.includes(selectedAbsolutePath) &&
    visibleColumnIds.length > 0
  ) {
    return {
      kind: "cell",
      absolutePath: selectedAbsolutePath,
      columnId: visibleColumnIds[0],
    };
  }
  if (sortableColumnIds.length > 0)
    return { kind: "header", columnId: sortableColumnIds[0] };
  if (rowAbsolutePaths.length > 0 && visibleColumnIds.length > 0) {
    return {
      kind: "cell",
      absolutePath: rowAbsolutePaths[0],
      columnId: visibleColumnIds[0],
    };
  }
  return undefined;
};

export const resolveTableGridRestorationFocus = (
  current: TableGridFocus | undefined,
  targetAbsolutePath: string | undefined,
  rowAbsolutePaths: readonly string[],
  visibleColumnIds: readonly string[],
  sortableColumnIds: readonly string[],
): TableGridFocus | undefined => {
  if (
    targetAbsolutePath &&
    rowAbsolutePaths.includes(targetAbsolutePath) &&
    visibleColumnIds.length > 0
  ) {
    const preferredColumnId = current?.columnId;
    return {
      kind: "cell",
      absolutePath: targetAbsolutePath,
      columnId:
        preferredColumnId && visibleColumnIds.includes(preferredColumnId)
          ? preferredColumnId
          : visibleColumnIds[0],
    };
  }
  return resolveTableGridFocus(
    undefined,
    undefined,
    rowAbsolutePaths,
    visibleColumnIds,
    sortableColumnIds,
  );
};

const clampIndex = (index: number, itemCount: number): number =>
  Math.max(0, Math.min(index, itemCount - 1));

const cellFocus = (
  rowAbsolutePaths: readonly string[],
  visibleColumnIds: readonly string[],
  rowIndex: number,
  columnIndex: number,
): TableGridFocus | undefined => {
  const absolutePath = rowAbsolutePaths[rowIndex];
  const columnId = visibleColumnIds[columnIndex];
  return absolutePath && columnId
    ? { kind: "cell", absolutePath, columnId }
    : undefined;
};

const moveHeaderFocus = ({
  current,
  key,
  ctrlKey,
  rowAbsolutePaths,
  visibleColumnIds,
}: TableGridNavigationContext): TableGridFocus | undefined => {
  if (current?.kind !== "header") return current;
  const visibleIndex = visibleColumnIds.indexOf(current.columnId);
  if (ctrlKey && key === "End") {
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      rowAbsolutePaths.length - 1,
      visibleColumnIds.length - 1,
    );
  }
  if (key === "ArrowLeft" || key === "Home") {
    const columnId =
      visibleColumnIds[
        clampIndex(
          key === "Home" ? 0 : visibleIndex - 1,
          visibleColumnIds.length,
        )
      ];
    return columnId ? { kind: "header", columnId } : current;
  }
  if (key === "ArrowRight" || key === "End") {
    const columnId =
      visibleColumnIds[
        clampIndex(
          key === "End" ? visibleColumnIds.length - 1 : visibleIndex + 1,
          visibleColumnIds.length,
        )
      ];
    return columnId ? { kind: "header", columnId } : current;
  }
  if (
    key === "ArrowDown" ||
    key === "PageDown" ||
    (ctrlKey && key === "Home")
  ) {
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      0,
      Math.max(visibleIndex, 0),
    );
  }
  return current;
};

const moveCellFocus = ({
  current,
  key,
  ctrlKey,
  pageSize,
  rowAbsolutePaths,
  visibleColumnIds,
  sortableColumnIds,
}: TableGridNavigationContext): TableGridFocus | undefined => {
  if (current?.kind !== "cell") return current;
  const rowIndex = rowAbsolutePaths.indexOf(current.absolutePath);
  const columnIndex = visibleColumnIds.indexOf(current.columnId);
  if (rowIndex < 0 || columnIndex < 0) return current;
  if (ctrlKey && key === "Home") {
    const columnId = sortableColumnIds[0];
    return columnId
      ? { kind: "header", columnId }
      : cellFocus(rowAbsolutePaths, visibleColumnIds, 0, 0);
  }
  if (ctrlKey && key === "End") {
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      rowAbsolutePaths.length - 1,
      visibleColumnIds.length - 1,
    );
  }
  if (key === "ArrowLeft" || key === "ArrowRight") {
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      rowIndex,
      clampIndex(
        columnIndex + (key === "ArrowLeft" ? -1 : 1),
        visibleColumnIds.length,
      ),
    );
  }
  if (key === "Home" || key === "End") {
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      rowIndex,
      key === "Home" ? 0 : visibleColumnIds.length - 1,
    );
  }
  if (key === "ArrowUp" && rowIndex === 0)
    return { kind: "header", columnId: current.columnId };
  if (
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "PageUp" ||
    key === "PageDown"
  ) {
    const offset =
      key === "ArrowUp"
        ? -1
        : key === "ArrowDown"
          ? 1
          : key === "PageUp"
            ? -Math.max(pageSize, 1)
            : Math.max(pageSize, 1);
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      clampIndex(rowIndex + offset, rowAbsolutePaths.length),
      columnIndex,
    );
  }
  return current;
};

export const moveTableGridFocus = (
  context: TableGridNavigationContext,
): TableGridFocus | undefined => {
  const next =
    context.current?.kind === "header"
      ? moveHeaderFocus(context)
      : moveCellFocus(context);
  return areTableGridFocusesEqual(context.current, next)
    ? context.current
    : next;
};

export const isTableGridNavigationKey = (
  key: string,
  ctrlKey = false,
): boolean =>
  [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
  ].includes(key) ||
  (ctrlKey && (key === "Home" || key === "End"));

export const decideTableGridNavigation = (
  context: TableGridNavigationContext,
): TableNavigationDecision => {
  const focus = moveTableGridFocus(context);
  return {
    focus,
    selectedAbsolutePath: undefined,
    scrollTargetAbsolutePath:
      focus?.kind === "cell" ? focus.absolutePath : undefined,
  };
};

export const decideTableGridRestoration = (
  current: TableGridFocus | undefined,
  targetAbsolutePath: string | undefined,
  rowAbsolutePaths: readonly string[],
  visibleColumnIds: readonly string[],
  sortableColumnIds: readonly string[],
): TableNavigationDecision => {
  const focus = resolveTableGridRestorationFocus(
    current,
    targetAbsolutePath,
    rowAbsolutePaths,
    visibleColumnIds,
    sortableColumnIds,
  );
  return {
    focus,
    selectedAbsolutePath: undefined,
    scrollTargetAbsolutePath:
      focus?.kind === "cell" ? focus.absolutePath : undefined,
  };
};
