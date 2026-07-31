import type { MouseEvent } from "react";
import type { UnitListUnitMetadataDto } from "../../../../application/unit-list/buildUnitListView";
import { createViewerNavigationRequest } from "../../viewerRequestMessages";

type PostViewerMessage = (
  message: ReturnType<typeof createViewerNavigationRequest>,
) => void | PromiseLike<boolean>;

export type TableRowSelectionAction =
  | { type: "select"; absolutePath: string }
  | { type: "documentChanged" };

export type TableRowSelectionState = {
  absolutePath: string;
  selectedAbsolutePath: string | undefined;
  index: number;
  revealedRowIndex: number | undefined;
};

export type TableGridFocus =
  | { kind: "header"; columnId: string }
  | { kind: "cell"; absolutePath: string; columnId: string };

export type TableGridFocusRequest = {
  revision: number;
  absolutePath?: string;
};

export type TableGridNavigationContext = {
  current: TableGridFocus | undefined;
  key: string;
  ctrlKey?: boolean;
  pageSize: number;
  rowAbsolutePaths: readonly string[];
  visibleColumnIds: readonly string[];
  sortableColumnIds: readonly string[];
};

export type UnitListGridShortcut =
  | "focusColumnHeader"
  | "openDetails"
  | "returnToSavedCell";

type UnitListGridShortcutContext = {
  focus: TableGridFocus;
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

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
  if (focus.kind === "cell" && normalizedKey === "h") {
    return "focusColumnHeader";
  }
  if (focus.kind === "cell" && normalizedKey === "d") {
    return "openDetails";
  }
  return focus.kind === "header" && key === "Escape"
    ? "returnToSavedCell"
    : undefined;
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

  const selectedRowExists =
    selectedAbsolutePath !== undefined &&
    rowAbsolutePaths.includes(selectedAbsolutePath);
  if (selectedRowExists && visibleColumnIds.length > 0) {
    return {
      kind: "cell",
      absolutePath: selectedAbsolutePath,
      columnId: visibleColumnIds[0],
    };
  }
  if (sortableColumnIds.length > 0) {
    return { kind: "header", columnId: sortableColumnIds[0] };
  }
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
    const nextIndex = key === "Home" ? 0 : visibleIndex - 1;
    const columnId =
      visibleColumnIds[clampIndex(nextIndex, visibleColumnIds.length)];
    return columnId ? { kind: "header", columnId } : current;
  }
  if (key === "ArrowRight" || key === "End") {
    const nextIndex =
      key === "End" ? visibleColumnIds.length - 1 : visibleIndex + 1;
    const columnId =
      visibleColumnIds[clampIndex(nextIndex, visibleColumnIds.length)];
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
    const offset = key === "ArrowLeft" ? -1 : 1;
    return cellFocus(
      rowAbsolutePaths,
      visibleColumnIds,
      rowIndex,
      clampIndex(columnIndex + offset, visibleColumnIds.length),
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
  if (key === "ArrowUp" && rowIndex === 0) {
    return { kind: "header", columnId: current.columnId };
  }
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
  key === "ArrowLeft" ||
  key === "ArrowRight" ||
  key === "ArrowUp" ||
  key === "ArrowDown" ||
  key === "PageUp" ||
  key === "PageDown" ||
  key === "Home" ||
  key === "End" ||
  (ctrlKey && (key === "Home" || key === "End"));

export const isTableGridNavigationEventOwnedByCell = (
  target: EventTarget | null,
  currentTarget: EventTarget | null,
  key: string,
  ctrlKey = false,
): boolean => {
  if (target === currentTarget) return true;
  if (!isTableGridNavigationKey(key, ctrlKey)) return false;
  const candidate = target as
    | { closest?: (selector: string) => unknown }
    | undefined;
  return candidate?.closest?.('[role="gridcell"]') === currentTarget;
};

export const getStickyColumnRevealScrollLeft = (
  currentScrollLeft: number,
  targetLeft: number,
  stickyColumnRight: number,
): number =>
  targetLeft < stickyColumnRight
    ? Math.max(0, currentScrollLeft - (stickyColumnRight - targetLeft))
    : currentScrollLeft;

export const reduceTableRowSelection = (
  currentAbsolutePath: string | undefined,
  action: TableRowSelectionAction,
): string | undefined => {
  if (action.type === "documentChanged") {
    return undefined;
  }
  if (action.absolutePath === currentAbsolutePath) {
    return currentAbsolutePath;
  }
  return action.absolutePath;
};

export const canNavigateToSelectedUnit = (
  absolutePath: string | undefined,
): absolutePath is string => !!absolutePath;

export const isTableRowSelected = ({
  absolutePath,
  selectedAbsolutePath,
}: TableRowSelectionState): boolean => absolutePath === selectedAbsolutePath;

export const navigateToFlow = (
  absolutePath: string,
  postMessage: PostViewerMessage = (message) =>
    window.vscode.postMessage(message),
): void => {
  postMessage(createViewerNavigationRequest("flow", absolutePath));
};

export const selectUnitTreeUnitInTable = (
  unitId: string,
  unitById: ReadonlyMap<string, UnitListUnitMetadataDto>,
  revealPath: (absolutePath: string) => void,
): void => {
  const unit = unitById.get(unitId);
  if (unit) {
    revealPath(unit.absolutePath);
  }
};

export const openUnitTreeUnitInFlow = (
  unitId: string,
  unitById: ReadonlyMap<string, UnitListUnitMetadataDto>,
  navigate: (absolutePath: string) => void = navigateToFlow,
): void => {
  const unit = unitById.get(unitId);
  if (unit) {
    navigate(unit.absolutePath);
  }
};

export const handleJumpLinkClick =
  (targetIdentity: string, handleJump: (identity: string) => void) =>
  (event: Pick<MouseEvent<HTMLElement>, "stopPropagation">): void => {
    event.stopPropagation();
    handleJump(targetIdentity);
  };
