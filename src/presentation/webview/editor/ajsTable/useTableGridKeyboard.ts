import { useCallback, type KeyboardEvent } from "react";
import {
  decideTableGridNavigation,
  decideTableGridRestoration,
  getTableGridFocusKey,
  isTableGridNavigationKey,
  resolveTableGridCommitPath,
  resolveUnitListGridShortcut,
  type TableGridFocus,
  type TableGridNavigationContext,
  type UnitListGridShortcut,
} from "./tableNavigationModel";
import { isTableGridNavigationEventOwnedByCell } from "./navigation";
import type { TableGridFocusController } from "./useTableGridFocus";

type TableGridKeyboardContext = Omit<TableGridNavigationContext, "current"> & {
  current: TableGridFocus;
  altKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  selectedAbsolutePath?: string;
  headerReturnFocus?: TableGridFocus;
};

type TableGridKeyboardAction =
  | {
      type: "focusHeader";
      target: TableGridFocus;
      returnFocus: TableGridFocus;
      commitPath: string;
    }
  | { type: "focusTree"; commitPath?: string }
  | { type: "openDetails"; absolutePath: string }
  | {
      type: "returnToCell";
      hasSavedReturnFocus: boolean;
      target?: TableGridFocus;
    }
  | { type: "navigate"; target?: TableGridFocus }
  | { type: "activateCell"; absolutePath: string }
  | { type: "ignore" };

type ShortcutActionResolver = (
  context: TableGridKeyboardContext,
) => TableGridKeyboardAction;

const ignoreKeyboardAction = (): TableGridKeyboardAction => ({
  type: "ignore",
});

const resolveHeaderShortcut: ShortcutActionResolver = ({ current }) =>
  current.kind === "cell"
    ? {
        type: "focusHeader",
        target: { kind: "header", columnId: current.columnId },
        returnFocus: current,
        commitPath: current.absolutePath,
      }
    : ignoreKeyboardAction();

const resolveTreeShortcut: ShortcutActionResolver = (context) => ({
  type: "focusTree",
  commitPath: resolveTableGridCommitPath(
    context.current,
    context.selectedAbsolutePath,
  ),
});

const resolveDetailsShortcut: ShortcutActionResolver = ({ current }) =>
  current.kind === "cell"
    ? { type: "openDetails", absolutePath: current.absolutePath }
    : ignoreKeyboardAction();

const resolveReturnShortcut: ShortcutActionResolver = (context) => {
  const savedFocus = context.headerReturnFocus;
  if (!savedFocus) {
    return { type: "returnToCell", hasSavedReturnFocus: false };
  }
  const target = decideTableGridRestoration(
    savedFocus,
    savedFocus.kind === "cell" ? savedFocus.absolutePath : undefined,
    context.rowAbsolutePaths,
    context.visibleColumnIds,
    context.sortableColumnIds,
  ).focus;
  return {
    type: "returnToCell",
    hasSavedReturnFocus: true,
    target,
  };
};

const SHORTCUT_ACTION_RESOLVERS: Readonly<
  Record<UnitListGridShortcut, ShortcutActionResolver>
> = {
  focusColumnHeader: resolveHeaderShortcut,
  focusTree: resolveTreeShortcut,
  openDetails: resolveDetailsShortcut,
  returnToSavedCell: resolveReturnShortcut,
};

const resolveNavigationAction = (
  context: TableGridKeyboardContext,
): TableGridKeyboardAction => {
  const decision = decideTableGridNavigation({
    ...context,
    current: context.current,
  });
  return {
    type: "navigate",
    target:
      getTableGridFocusKey(decision.focus) ===
      getTableGridFocusKey(context.current)
        ? undefined
        : decision.focus,
  };
};

const resolveCellActivationAction = (
  context: TableGridKeyboardContext,
): TableGridKeyboardAction => {
  if (context.current.kind !== "cell" || context.key !== "Enter")
    return ignoreKeyboardAction();
  return { type: "activateCell", absolutePath: context.current.absolutePath };
};

const resolveNavigationOrActivationAction = (
  context: TableGridKeyboardContext,
): TableGridKeyboardAction => {
  const resolver = isTableGridNavigationKey(context.key, context.ctrlKey)
    ? resolveNavigationAction
    : resolveCellActivationAction;
  return resolver(context);
};

const resolveTableGridKeyboardAction = (
  context: TableGridKeyboardContext,
): TableGridKeyboardAction => {
  const shortcut = resolveUnitListGridShortcut({
    focus: context.current,
    key: context.key,
    altKey: context.altKey,
    ctrlKey: context.ctrlKey,
    metaKey: context.metaKey,
    shiftKey: context.shiftKey,
  });
  return shortcut
    ? SHORTCUT_ACTION_RESOLVERS[shortcut](context)
    : resolveNavigationOrActivationAction(context);
};

type KeyboardActionContext = {
  action: TableGridKeyboardAction;
  event: KeyboardEvent<HTMLElement>;
  focusController: TableGridFocusController;
  focusUnitTree: (absolutePath?: string) => void;
  openDetailPane: (absolutePath: string) => void;
};

type KeyboardActionHandlerMap = {
  [Kind in TableGridKeyboardAction["type"]]: (
    context: KeyboardActionContext & {
      action: Extract<TableGridKeyboardAction, { type: Kind }>;
    },
  ) => void;
};

const runHeaderHandoff: KeyboardActionHandlerMap["focusHeader"] = ({
  action,
  event,
  focusController,
}) => {
  event.preventDefault();
  focusController.commitFocusedGridRow(action.commitPath);
  focusController.rememberHeaderReturnFocus(action.returnFocus);
  focusController.focusGridTarget(action.target);
};

const runTreeHandoff: KeyboardActionHandlerMap["focusTree"] = ({
  action,
  event,
  focusController,
  focusUnitTree,
}) => {
  event.preventDefault();
  focusUnitTree(focusController.commitFocusedGridRow(action.commitPath));
};

const runDetailsHandoff: KeyboardActionHandlerMap["openDetails"] = ({
  action,
  event,
  focusController,
  openDetailPane,
}) => {
  event.preventDefault();
  focusController.commitFocusedGridRow(action.absolutePath);
  openDetailPane(action.absolutePath);
};

const runHeaderReturn: KeyboardActionHandlerMap["returnToCell"] = ({
  action,
  event,
  focusController,
}) => {
  if (!action.hasSavedReturnFocus) return;
  event.preventDefault();
  focusController.clearHeaderReturnFocus();
  focusController.focusGridTarget(action.target);
};

const runGridNavigation: KeyboardActionHandlerMap["navigate"] = ({
  action,
  event,
  focusController,
}) => {
  event.preventDefault();
  focusController.focusGridTarget(action.target, true);
};

const runCellActivation: KeyboardActionHandlerMap["activateCell"] = ({
  action,
  event,
  focusController,
}) => {
  focusController.commitFocusedGridRow(action.absolutePath);
  const cellAction = event.currentTarget.querySelector<HTMLElement>(
    "[data-grid-cell-action]",
  );
  if (!cellAction) return;
  event.preventDefault();
  cellAction.click();
};

const runNoop: KeyboardActionHandlerMap["ignore"] = () => undefined;

const KEYBOARD_ACTION_HANDLERS: KeyboardActionHandlerMap = {
  focusHeader: runHeaderHandoff,
  focusTree: runTreeHandoff,
  openDetails: runDetailsHandoff,
  returnToCell: runHeaderReturn,
  navigate: runGridNavigation,
  activateCell: runCellActivation,
  ignore: runNoop,
};

const runKeyboardAction = (context: KeyboardActionContext): void => {
  const handler = KEYBOARD_ACTION_HANDLERS[context.action.type] as (
    actionContext: KeyboardActionContext,
  ) => void;
  handler(context);
};

type TableGridKeyboardOptions = {
  focusController: TableGridFocusController;
  focusUnitTree: (absolutePath?: string) => void;
  openDetailPane: (absolutePath: string) => void;
  pageSize: number;
  rowAbsolutePaths: readonly string[];
  selectedAbsolutePath?: string;
  sortableColumnIds: readonly string[];
  visibleColumnIds: readonly string[];
};

const handleGridKeyDown = (
  event: KeyboardEvent<HTMLElement>,
  focus: TableGridFocus,
  options: TableGridKeyboardOptions,
): void => {
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
  const context: TableGridKeyboardContext = {
    current: focus,
    key: event.key,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    pageSize: options.pageSize,
    rowAbsolutePaths: options.rowAbsolutePaths,
    visibleColumnIds: options.visibleColumnIds,
    sortableColumnIds: options.sortableColumnIds,
    selectedAbsolutePath: options.selectedAbsolutePath,
    headerReturnFocus: options.focusController.getHeaderReturnFocus(),
  };
  const action = resolveTableGridKeyboardAction(context);
  runKeyboardAction({
    action,
    event,
    focusController: options.focusController,
    focusUnitTree: options.focusUnitTree,
    openDetailPane: options.openDetailPane,
  } as KeyboardActionContext);
};

export const useTableGridKeyboard = (
  options: TableGridKeyboardOptions,
): ((event: KeyboardEvent<HTMLElement>, focus: TableGridFocus) => void) =>
  useCallback(
    (event, focus) => handleGridKeyDown(event, focus, options),
    [options],
  );
