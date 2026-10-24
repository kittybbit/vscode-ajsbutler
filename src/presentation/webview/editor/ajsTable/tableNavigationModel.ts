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

type AxisMovement = (
  index: number,
  itemCount: number,
  pageSize: number,
) => number;

type MovementTarget = "cell" | "header";

type TableMovementRule = {
  row?: AxisMovement;
  column?: AxisMovement;
  target?: MovementTarget;
  transition?: "headerAtFirstRow" | "firstSortableHeader";
};

const keepAxis: AxisMovement = (index) => index;
const firstAxis: AxisMovement = () => 0;
const lastAxis: AxisMovement = (_index, itemCount) => itemCount - 1;
const currentOrFirstAxis: AxisMovement = (index) => Math.max(index, 0);

const offsetAxis =
  (offset: number): AxisMovement =>
  (index, itemCount) =>
    clampIndex(index + offset, itemCount);

const pageAxis =
  (direction: -1 | 1): AxisMovement =>
  (index, itemCount, pageSize) =>
    clampIndex(index + direction * Math.max(pageSize, 1), itemCount);

const LAST_GRID_CELL: TableMovementRule = { row: lastAxis, column: lastAxis };

const CELL_MOVEMENTS: Readonly<Record<string, TableMovementRule>> = {
  ArrowLeft: { column: offsetAxis(-1) },
  ArrowRight: { column: offsetAxis(1) },
  ArrowUp: {
    row: offsetAxis(-1),
    transition: "headerAtFirstRow",
  },
  ArrowDown: { row: offsetAxis(1) },
  PageUp: { row: pageAxis(-1) },
  PageDown: { row: pageAxis(1) },
  Home: { column: firstAxis },
  End: { column: lastAxis },
};

const CELL_CONTROL_MOVEMENTS: Readonly<Record<string, TableMovementRule>> = {
  Home: {
    row: firstAxis,
    column: firstAxis,
    transition: "firstSortableHeader",
  },
  End: LAST_GRID_CELL,
};

const HEADER_MOVEMENTS: Readonly<Record<string, TableMovementRule>> = {
  ArrowLeft: { column: offsetAxis(-1), target: "header" },
  Home: { column: firstAxis, target: "header" },
  ArrowRight: { column: offsetAxis(1), target: "header" },
  End: { column: lastAxis, target: "header" },
  ArrowDown: { row: firstAxis, column: currentOrFirstAxis },
  PageDown: { row: firstAxis, column: currentOrFirstAxis },
};

const HEADER_CONTROL_MOVEMENTS: Readonly<Record<string, TableMovementRule>> = {
  End: LAST_GRID_CELL,
};

type MovementRuleContext = {
  key: string;
  ctrlKey: boolean | undefined;
  movements: Readonly<Record<string, TableMovementRule>>;
  controlMovements: Readonly<Record<string, TableMovementRule>>;
};

const resolveMovementRule = ({
  key,
  ctrlKey,
  movements,
  controlMovements,
}: MovementRuleContext): TableMovementRule | undefined =>
  (ctrlKey ? controlMovements[key] : undefined) ?? movements[key];

type MovementTransitionInput = {
  context: TableGridNavigationContext;
  current: TableGridFocus;
  rowIndex: number;
};

type MovementTransitionResolver = (
  input: MovementTransitionInput,
) => TableGridFocus | undefined;

const enterHeaderAtFirstRow: MovementTransitionResolver = ({
  current,
  rowIndex,
}) =>
  current.kind === "cell" && rowIndex === 0
    ? { kind: "header", columnId: current.columnId }
    : undefined;

const enterFirstSortableHeader: MovementTransitionResolver = ({ context }) => {
  const columnId = context.sortableColumnIds[0];
  return columnId ? { kind: "header", columnId } : undefined;
};

const MOVEMENT_TRANSITIONS: Readonly<
  Record<
    NonNullable<TableMovementRule["transition"]>,
    MovementTransitionResolver
  >
> = {
  headerAtFirstRow: enterHeaderAtFirstRow,
  firstSortableHeader: enterFirstSortableHeader,
};

const resolveMovementTransition = ({
  context,
  current,
  rowIndex,
  transition,
}: MovementTransitionInput & {
  transition: TableMovementRule["transition"];
}): TableGridFocus | undefined =>
  transition
    ? MOVEMENT_TRANSITIONS[transition]({ context, current, rowIndex })
    : undefined;

type MovementTargetInput = MovementTransitionInput & {
  columnIndex: number;
};

type MovementTargetResolver = (
  input: MovementTargetInput,
) => TableGridFocus | undefined;

const resolveCellMovementTarget: MovementTargetResolver = ({
  context,
  rowIndex,
  columnIndex,
}) =>
  cellFocus(
    context.rowAbsolutePaths,
    context.visibleColumnIds,
    rowIndex,
    columnIndex,
  );

const resolveHeaderMovementTarget: MovementTargetResolver = ({
  context,
  current,
  columnIndex,
}) => {
  const columnId = context.visibleColumnIds[columnIndex];
  return columnId ? { kind: "header", columnId } : current;
};

const MOVEMENT_TARGETS: Readonly<
  Record<MovementTarget, MovementTargetResolver>
> = {
  cell: resolveCellMovementTarget,
  header: resolveHeaderMovementTarget,
};

type MovementApplicationInput = MovementTransitionInput & {
  columnIndex: number;
  rule: TableMovementRule;
};

const applyMovementRule = ({
  context,
  current,
  rowIndex,
  columnIndex,
  rule,
}: MovementApplicationInput): TableGridFocus | undefined => {
  const transitionFocus = resolveMovementTransition({
    context,
    current,
    rowIndex,
    transition: rule.transition,
  });
  if (transitionFocus) return transitionFocus;
  const nextRowIndex = (rule.row ?? keepAxis)(
    rowIndex,
    context.rowAbsolutePaths.length,
    context.pageSize,
  );
  const nextColumnIndex = (rule.column ?? keepAxis)(
    columnIndex,
    context.visibleColumnIds.length,
    context.pageSize,
  );
  return MOVEMENT_TARGETS[rule.target ?? "cell"]({
    context,
    current,
    rowIndex: nextRowIndex,
    columnIndex: nextColumnIndex,
  });
};
const moveHeaderFocus = (
  context: TableGridNavigationContext,
): TableGridFocus | undefined => {
  const { current, key, ctrlKey, visibleColumnIds } = context;
  if (current?.kind !== "header") return current;
  const visibleIndex = visibleColumnIds.indexOf(current.columnId);
  const movement = resolveMovementRule({
    key,
    ctrlKey,
    movements: HEADER_MOVEMENTS,
    controlMovements: HEADER_CONTROL_MOVEMENTS,
  });
  return movement
    ? applyMovementRule({
        context,
        current,
        rowIndex: 0,
        columnIndex: visibleIndex,
        rule: movement,
      })
    : current;
};

const moveCellFocus = (
  context: TableGridNavigationContext,
): TableGridFocus | undefined => {
  const { current, key, ctrlKey, rowAbsolutePaths, visibleColumnIds } = context;
  if (current?.kind !== "cell") return current;
  const rowIndex = rowAbsolutePaths.indexOf(current.absolutePath);
  const columnIndex = visibleColumnIds.indexOf(current.columnId);
  if (rowIndex < 0 || columnIndex < 0) return current;
  const movement = resolveMovementRule({
    key,
    ctrlKey,
    movements: CELL_MOVEMENTS,
    controlMovements: CELL_CONTROL_MOVEMENTS,
  });
  return movement
    ? applyMovementRule({
        context,
        current,
        rowIndex,
        columnIndex,
        rule: movement,
      })
    : current;
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
