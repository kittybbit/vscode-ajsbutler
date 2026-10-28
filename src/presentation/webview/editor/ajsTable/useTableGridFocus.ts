import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { TableVirtuosoHandle } from "react-virtuoso";
import {
  decideTableGridRestoration,
  getTableGridFocusKey,
  resolveTableGridCommitPath,
  resolveTableGridFocus,
  type TableGridFocus,
  type TableGridFocusRequest,
} from "./tableNavigationModel";
import { getStickyColumnRevealScrollLeft } from "./navigation";

type TableGridFocusOptions = {
  documentRevision: number;
  rowIndex?: number;
  rowAbsolutePaths: readonly string[];
  selectedAbsolutePath?: string;
  visibleColumnIds: readonly string[];
  sortableColumnIds: readonly string[];
  restoreFocusRequest: TableGridFocusRequest;
  selectRow: (absolutePath: string) => void;
  commitFocusedRow?: (absolutePath?: string) => string | undefined;
  onGridFocusChange?: (focus: TableGridFocus) => void;
};

type TableGridFocusState = {
  virtuosoRef: RefObject<TableVirtuosoHandle | null>;
  currentFocus: TableGridFocus | undefined;
  selectedAbsolutePath: string | undefined;
  observedDocumentRevision: number;
  observedSelectedAbsolutePath: string | undefined;
  focusElements: Map<string, HTMLElement>;
  headerReturnFocus: TableGridFocus | undefined;
  pendingFocusKey: string | undefined;
  keyboardFocusPendingSelection: boolean;
  pointerActionPending: boolean;
  observedRestoreFocusRevision: number;
  rowAbsolutePaths: readonly string[];
  selectRow: (absolutePath: string) => void;
  commitFocusedRow?: (absolutePath?: string) => string | undefined;
  onGridFocusChange?: (focus: TableGridFocus) => void;
};

export type TableGridFocusController = {
  currentFocus: TableGridFocus | undefined;
  virtuosoRef: RefObject<TableVirtuosoHandle | null>;
  getCurrentFocus: () => TableGridFocus | undefined;
  registerFocusElement: (
    focus: TableGridFocus,
    element: HTMLElement | null,
  ) => void;
  handleGridFocus: (focus: TableGridFocus) => void;
  handleGridPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  focusGridTarget: (
    focus: TableGridFocus | undefined,
    fromKeyboard?: boolean,
  ) => void;
  commitFocusedGridRow: (absolutePath?: string) => string | undefined;
  rememberHeaderReturnFocus: (focus: TableGridFocus) => void;
  getHeaderReturnFocus: () => TableGridFocus | undefined;
  clearHeaderReturnFocus: () => void;
};

const resetFocusState = (
  state: TableGridFocusState,
  clearHeaderReturnFocus: boolean,
): void => {
  state.currentFocus = undefined;
  state.pendingFocusKey = undefined;
  state.keyboardFocusPendingSelection = false;
  state.pointerActionPending = false;
  if (clearHeaderReturnFocus) state.headerReturnFocus = undefined;
};

const resetForDocumentChange = (
  state: TableGridFocusState,
  documentRevision: number,
  restoreFocusRevision: number,
): void => {
  state.observedDocumentRevision = documentRevision;
  state.observedRestoreFocusRevision = restoreFocusRevision;
  resetFocusState(state, true);
};

const resetForSelectionChange = (
  state: TableGridFocusState,
  selectionChanged: boolean,
  selectedAbsolutePath: string | undefined,
): void => {
  const focus = state.currentFocus;
  if (
    selectionChanged &&
    focus?.kind === "cell" &&
    focus.absolutePath !== selectedAbsolutePath
  ) {
    resetFocusState(state, false);
  }
};

const resolveCurrentFocus = (
  state: TableGridFocusState,
  options: TableGridFocusOptions,
  documentRevisionChanged: boolean,
): TableGridFocus | undefined => {
  const previousFocus = state.currentFocus;
  const currentFocus = resolveTableGridFocus(
    previousFocus,
    documentRevisionChanged ? undefined : options.selectedAbsolutePath,
    state.rowAbsolutePaths,
    options.visibleColumnIds,
    options.sortableColumnIds,
  );
  if (
    getTableGridFocusKey(previousFocus) !== getTableGridFocusKey(currentFocus)
  ) {
    state.pendingFocusKey = undefined;
    state.keyboardFocusPendingSelection = false;
  }
  state.currentFocus = currentFocus;
  return currentFocus;
};

const reconcileFocusState = (
  state: TableGridFocusState,
  options: TableGridFocusOptions,
): TableGridFocus | undefined => {
  const documentRevisionChanged =
    state.observedDocumentRevision !== options.documentRevision;
  const selectionChanged =
    state.observedSelectedAbsolutePath !== options.selectedAbsolutePath;
  if (documentRevisionChanged) {
    resetForDocumentChange(
      state,
      options.documentRevision,
      options.restoreFocusRequest.revision,
    );
  } else {
    resetForSelectionChange(
      state,
      selectionChanged,
      options.selectedAbsolutePath,
    );
  }
  return resolveCurrentFocus(state, options, documentRevisionChanged);
};

const findStickyRevealElements = (
  element: HTMLElement,
):
  | {
      focusedCell: HTMLElement;
      stickyColumn: HTMLElement;
      scroller: HTMLElement;
    }
  | undefined => {
  const focusedCell = element.closest<HTMLElement>(
    '[role="gridcell"], [role="columnheader"]',
  );
  const row = focusedCell?.closest<HTMLElement>('[role="row"]');
  const stickyColumn = row?.querySelector<HTMLElement>('[aria-colindex="1"]');
  const scroller = element.closest<HTMLElement>("[data-table-grid-scroller]");
  return focusedCell &&
    focusedCell.getAttribute("aria-colindex") !== "1" &&
    stickyColumn &&
    scroller
    ? { focusedCell, stickyColumn, scroller }
    : undefined;
};

const revealGridFocusElement = (element: HTMLElement): void => {
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: "nearest", inline: "nearest" });
  const revealElements = findStickyRevealElements(element);
  if (!revealElements) return;
  const { focusedCell, stickyColumn, scroller } = revealElements;
  const nextScrollLeft = getStickyColumnRevealScrollLeft(
    scroller.scrollLeft,
    focusedCell.getBoundingClientRect().left,
    Math.max(
      scroller.getBoundingClientRect().left,
      stickyColumn.getBoundingClientRect().right,
    ),
  );
  if (scroller.scrollLeft !== nextScrollLeft) {
    scroller.scrollLeft = nextScrollLeft;
  }
};

const focusPendingElement = (
  state: TableGridFocusState,
  key: string,
  element: HTMLElement | null,
): void => {
  if (!element || state.pendingFocusKey !== key) return;
  element.tabIndex = 0;
  revealGridFocusElement(element);
  state.pendingFocusKey = undefined;
};

const registerFocusElement = (
  state: TableGridFocusState,
  focus: TableGridFocus,
  element: HTMLElement | null,
): void => {
  const key = getTableGridFocusKey(focus)!;
  if (element) state.focusElements.set(key, element);
  else state.focusElements.delete(key);
  focusPendingElement(state, key, element);
};

const applyRovingFocus = (
  state: TableGridFocusState,
  focus: TableGridFocus,
): void => {
  const previousKey = getTableGridFocusKey(state.currentFocus);
  const nextKey = getTableGridFocusKey(focus);
  if (previousKey !== nextKey)
    state.focusElements.get(previousKey ?? "")?.setAttribute("tabindex", "-1");
  state.currentFocus = focus;
  state.focusElements.get(nextKey ?? "")?.setAttribute("tabindex", "0");
};

const shouldSelectFocusedCell = (
  state: TableGridFocusState,
  focus: TableGridFocus,
): focus is Extract<TableGridFocus, { kind: "cell" }> => {
  const keyboardFocusPending = state.keyboardFocusPendingSelection;
  const pointerActionPending = state.pointerActionPending;
  state.keyboardFocusPendingSelection = false;
  state.pointerActionPending = keyboardFocusPending && pointerActionPending;
  return (
    !keyboardFocusPending &&
    !pointerActionPending &&
    focus.kind === "cell" &&
    focus.absolutePath !== state.selectedAbsolutePath
  );
};

const applyFocusSelectionPolicy = (
  state: TableGridFocusState,
  focus: TableGridFocus,
): void => {
  if (shouldSelectFocusedCell(state, focus))
    state.selectRow(focus.absolutePath);
};

const handleGridFocus = (
  state: TableGridFocusState,
  focus: TableGridFocus,
): void => {
  applyRovingFocus(state, focus);
  state.onGridFocusChange?.(focus);
  applyFocusSelectionPolicy(state, focus);
};

const handleGridPointerDown = (
  state: TableGridFocusState,
  event: ReactPointerEvent<HTMLElement>,
): void => {
  state.keyboardFocusPendingSelection = false;
  const target = event.target as HTMLElement | null;
  state.pointerActionPending = Boolean(
    target?.closest?.("[data-grid-cell-action]"),
  );
};

const applyFocusTarget = (
  state: TableGridFocusState,
  focus: TableGridFocus,
  key: string | undefined,
): void => {
  const mountedElement = state.focusElements.get(key ?? "");
  if (mountedElement) {
    state.pendingFocusKey = undefined;
    revealGridFocusElement(mountedElement);
    return;
  }
  state.pendingFocusKey = focus.kind === "cell" ? key : state.pendingFocusKey;
  scrollGridRowIntoView(state, focus);
};

const scrollGridRowIntoView = (
  state: TableGridFocusState,
  focus: TableGridFocus,
): void => {
  if (focus.kind !== "cell") return;
  const rowIndex = state.rowAbsolutePaths.indexOf(focus.absolutePath);
  if (rowIndex < 0) return;
  state.virtuosoRef.current?.scrollToIndex({
    index: rowIndex,
    align: "center",
    behavior: "auto",
  });
};

const focusGridTarget = (
  state: TableGridFocusState,
  focus: TableGridFocus | undefined,
  fromKeyboard = false,
): void => {
  if (!focus) return;
  if (fromKeyboard) state.keyboardFocusPendingSelection = true;
  const key = getTableGridFocusKey(focus);
  applyRovingFocus(state, focus);
  state.onGridFocusChange?.(focus);
  applyFocusTarget(state, focus, key);
};

const commitFocusedGridRow = (
  state: TableGridFocusState,
  absolutePath?: string,
): string | undefined => {
  const targetPath =
    absolutePath ??
    resolveTableGridCommitPath(state.currentFocus, state.selectedAbsolutePath);
  if (!targetPath) return undefined;
  if (state.commitFocusedRow) return state.commitFocusedRow(targetPath);
  state.selectRow(targetPath);
  return targetPath;
};

const restoreRequestedFocus = (
  state: TableGridFocusState,
  options: TableGridFocusOptions,
  focusGridTarget: (focus: TableGridFocus | undefined) => void,
): void => {
  if (
    state.observedRestoreFocusRevision === options.restoreFocusRequest.revision
  ) {
    return;
  }
  state.observedRestoreFocusRevision = options.restoreFocusRequest.revision;
  const decision = decideTableGridRestoration(
    state.currentFocus,
    options.restoreFocusRequest.absolutePath ?? options.selectedAbsolutePath,
    state.rowAbsolutePaths,
    options.visibleColumnIds,
    options.sortableColumnIds,
  );
  focusGridTarget(decision.focus);
};

const useSelectedRowFocusEffect = (
  state: TableGridFocusState,
  options: TableGridFocusOptions,
): void =>
  useEffect(() => {
    if (
      state.observedSelectedAbsolutePath === options.selectedAbsolutePath &&
      options.rowIndex !== undefined
    ) {
      setTimeout(() => {
        state.virtuosoRef.current?.scrollToIndex({
          index: options.rowIndex!,
          align: "center",
          behavior: "smooth",
        });
      }, 0);
    }
  }, [options.rowIndex, options.selectedAbsolutePath]);

const useObservedSelectionEffect = (
  state: TableGridFocusState,
  selectedAbsolutePath: string | undefined,
): void =>
  useEffect(() => {
    state.observedSelectedAbsolutePath = selectedAbsolutePath;
  }, [selectedAbsolutePath]);

const useFocusCleanupEffect = (state: TableGridFocusState): void =>
  useEffect(
    () => () => {
      resetFocusState(state, true);
      state.focusElements.clear();
    },
    [state],
  );

const useRequestedFocusEffect = (
  state: TableGridFocusState,
  options: TableGridFocusOptions,
  focusGridTarget: (focus: TableGridFocus | undefined) => void,
): void =>
  useEffect(
    () => restoreRequestedFocus(state, options, focusGridTarget),
    [focusGridTarget, options],
  );

export const useTableGridFocus = (
  options: TableGridFocusOptions,
): TableGridFocusController => {
  const virtuosoRef = useRef<TableVirtuosoHandle>(null);
  const stateRef = useRef<TableGridFocusState>({
    virtuosoRef,
    currentFocus: undefined,
    selectedAbsolutePath: options.selectedAbsolutePath,
    observedDocumentRevision: options.documentRevision,
    observedSelectedAbsolutePath: options.selectedAbsolutePath,
    focusElements: new Map(),
    headerReturnFocus: undefined,
    pendingFocusKey: undefined,
    keyboardFocusPendingSelection: false,
    pointerActionPending: false,
    observedRestoreFocusRevision: options.restoreFocusRequest.revision,
    rowAbsolutePaths: options.rowAbsolutePaths,
    selectRow: options.selectRow,
    commitFocusedRow: options.commitFocusedRow,
    onGridFocusChange: options.onGridFocusChange,
  });
  const state = stateRef.current;
  state.selectedAbsolutePath = options.selectedAbsolutePath;
  state.rowAbsolutePaths = options.rowAbsolutePaths;
  state.selectRow = options.selectRow;
  state.commitFocusedRow = options.commitFocusedRow;
  state.onGridFocusChange = options.onGridFocusChange;
  const currentFocus = reconcileFocusState(state, options);

  const getCurrentFocus = useCallback(() => state.currentFocus, [state]);
  const registerElement = useCallback(
    (focus: TableGridFocus, element: HTMLElement | null) =>
      registerFocusElement(state, focus, element),
    [state],
  );
  const handleFocus = useCallback(
    (focus: TableGridFocus) => handleGridFocus(state, focus),
    [state],
  );
  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) =>
      handleGridPointerDown(state, event),
    [state],
  );
  const focusTarget = useCallback(
    (focus: TableGridFocus | undefined, fromKeyboard = false) =>
      focusGridTarget(state, focus, fromKeyboard),
    [state],
  );
  const commitFocusedRow = useCallback(
    (absolutePath?: string) => commitFocusedGridRow(state, absolutePath),
    [state],
  );
  const rememberHeaderReturnFocus = useCallback(
    (focus: TableGridFocus) => {
      state.headerReturnFocus = focus;
    },
    [state],
  );
  const getHeaderReturnFocus = useCallback(
    () => state.headerReturnFocus,
    [state],
  );
  const clearHeaderReturnFocus = useCallback(() => {
    state.headerReturnFocus = undefined;
  }, [state]);

  useSelectedRowFocusEffect(state, options);
  useObservedSelectionEffect(state, options.selectedAbsolutePath);
  useFocusCleanupEffect(state);
  useRequestedFocusEffect(state, options, focusTarget);

  return {
    currentFocus,
    virtuosoRef,
    getCurrentFocus,
    registerFocusElement: registerElement,
    handleGridFocus: handleFocus,
    handleGridPointerDown: handlePointerDown,
    focusGridTarget: focusTarget,
    commitFocusedGridRow: commitFocusedRow,
    rememberHeaderReturnFocus,
    getHeaderReturnFocus,
    clearHeaderReturnFocus,
  };
};
