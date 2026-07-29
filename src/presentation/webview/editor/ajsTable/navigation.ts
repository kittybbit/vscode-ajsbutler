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

export type TableGridNavigationContext = {
  current: TableGridFocus | undefined;
  key: string;
  ctrlKey?: boolean;
  pageSize: number;
  rowAbsolutePaths: readonly string[];
  visibleColumnIds: readonly string[];
  sortableColumnIds: readonly string[];
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
    sortableColumnIds.includes(current.columnId)
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
  sortableColumnIds,
}: TableGridNavigationContext): TableGridFocus | undefined => {
  if (current?.kind !== "header") return current;
  const sortableIndex = sortableColumnIds.indexOf(current.columnId);
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
    const nextIndex = key === "Home" ? 0 : sortableIndex - 1;
    const columnId =
      sortableColumnIds[clampIndex(nextIndex, sortableColumnIds.length)];
    return columnId ? { kind: "header", columnId } : current;
  }
  if (key === "ArrowRight" || key === "End") {
    const nextIndex =
      key === "End" ? sortableColumnIds.length - 1 : sortableIndex + 1;
    const columnId =
      sortableColumnIds[clampIndex(nextIndex, sortableColumnIds.length)];
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
    return sortableColumnIds.includes(current.columnId)
      ? { kind: "header", columnId: current.columnId }
      : current;
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
