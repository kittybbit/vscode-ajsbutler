export type UnitTreeNavigationUnit = {
  children: readonly UnitTreeNavigationUnit[];
  depth: number;
  id: string;
  parentId?: string;
};

export type UnitTreeNavigationRow = {
  id: string;
  parentId?: string;
  depth: number;
  hasChildren: boolean;
  isEnabled: boolean;
  isExpanded: boolean;
};

export type UnitTreeNavigationAction =
  | { kind: "focus"; targetUnitId: string }
  | { kind: "expand"; targetUnitId: string }
  | { kind: "collapse"; targetUnitId: string }
  | { kind: "select"; targetUnitId: string };

export type UnitTreeNavigationResult = {
  action?: UnitTreeNavigationAction;
  suppressDefault: boolean;
};

type UnitTreeNavigationKeyOptions = {
  altKey?: boolean;
  ctrlKey?: boolean;
  key: string;
  metaKey?: boolean;
  shiftKey?: boolean;
};

type AppendVisibleUnitTreeRowsContext = {
  units: readonly UnitTreeNavigationUnit[];
  expandedUnitIds: ReadonlySet<string>;
  isUnitEnabled: (unit: UnitTreeNavigationUnit) => boolean;
  rows: UnitTreeNavigationRow[];
};

const toVisibleUnitTreeRow = (
  unit: UnitTreeNavigationUnit,
  expandedUnitIds: ReadonlySet<string>,
  isUnitEnabled: (unit: UnitTreeNavigationUnit) => boolean,
): UnitTreeNavigationRow => {
  const hasChildren = unit.children.length > 0;
  return {
    id: unit.id,
    parentId: unit.parentId,
    depth: unit.depth,
    hasChildren,
    isEnabled: isUnitEnabled(unit),
    isExpanded: hasChildren && expandedUnitIds.has(unit.id),
  };
};

const appendVisibleUnitTreeChildren = (
  unit: UnitTreeNavigationUnit,
  row: UnitTreeNavigationRow,
  context: Omit<AppendVisibleUnitTreeRowsContext, "units">,
): void => {
  if (!row.isExpanded) {
    return;
  }
  appendVisibleUnitTreeRows({
    ...context,
    units: unit.children,
  });
};

const appendVisibleUnitTreeRows = ({
  units,
  expandedUnitIds,
  isUnitEnabled,
  rows,
}: AppendVisibleUnitTreeRowsContext): void => {
  for (const unit of units) {
    const row = toVisibleUnitTreeRow(unit, expandedUnitIds, isUnitEnabled);
    rows.push(row);
    appendVisibleUnitTreeChildren(unit, row, {
      expandedUnitIds,
      isUnitEnabled,
      rows,
    });
  }
};

export const resolveVisibleUnitTreeRows = (
  rootUnits: readonly UnitTreeNavigationUnit[],
  expandedUnitIds: ReadonlySet<string>,
  isUnitEnabled: (unit: UnitTreeNavigationUnit) => boolean,
): UnitTreeNavigationRow[] => {
  const rows: UnitTreeNavigationRow[] = [];
  appendVisibleUnitTreeRows({
    units: rootUnits,
    expandedUnitIds,
    isUnitEnabled,
    rows,
  });
  return rows;
};

const hasNavigationModifier = ({
  altKey,
  ctrlKey,
  metaKey,
  shiftKey,
}: UnitTreeNavigationKeyOptions): boolean =>
  Boolean(altKey || ctrlKey || metaKey || shiftKey);

const resolveEnabledRows = (
  rows: readonly UnitTreeNavigationRow[],
): readonly UnitTreeNavigationRow[] => rows.filter((row) => row.isEnabled);

const resolveDirectionalTarget = (
  rows: readonly UnitTreeNavigationRow[],
  currentUnitId: string,
  offset: -1 | 1,
): string | undefined => {
  const enabledRows = resolveEnabledRows(rows);
  const currentIndex = enabledRows.findIndex((row) => row.id === currentUnitId);
  return enabledRows[currentIndex + offset]?.id;
};

const resolveParentTarget = (
  rows: readonly UnitTreeNavigationRow[],
  currentRow: UnitTreeNavigationRow,
): string | undefined =>
  currentRow.parentId &&
  rows.some((row) => row.id === currentRow.parentId && row.isEnabled)
    ? currentRow.parentId
    : undefined;

const resolveChildTarget = (
  rows: readonly UnitTreeNavigationRow[],
  currentRow: UnitTreeNavigationRow,
): string | undefined =>
  rows.find((row) => row.parentId === currentRow.id && row.isEnabled)?.id;

const focusResult = (
  targetUnitId: string | undefined,
): UnitTreeNavigationResult => ({
  action: targetUnitId ? { kind: "focus", targetUnitId } : undefined,
  suppressDefault: true,
});

const resolveVerticalNavigation = (
  rows: readonly UnitTreeNavigationRow[],
  currentUnitId: string,
  offset: -1 | 1,
): UnitTreeNavigationResult =>
  focusResult(resolveDirectionalTarget(rows, currentUnitId, offset));

const resolveHomeNavigation = (
  rows: readonly UnitTreeNavigationRow[],
): UnitTreeNavigationResult => focusResult(resolveEnabledRows(rows)[0]?.id);

const resolveEndNavigation = (
  rows: readonly UnitTreeNavigationRow[],
): UnitTreeNavigationResult => {
  const enabledRows = resolveEnabledRows(rows);
  return focusResult(enabledRows[enabledRows.length - 1]?.id);
};

const resolveRightNavigation = (
  rows: readonly UnitTreeNavigationRow[],
  currentRow: UnitTreeNavigationRow,
): UnitTreeNavigationResult => {
  if (!currentRow.hasChildren) {
    return { suppressDefault: true };
  }
  if (!currentRow.isExpanded) {
    return {
      action: { kind: "expand", targetUnitId: currentRow.id },
      suppressDefault: true,
    };
  }
  return focusResult(resolveChildTarget(rows, currentRow));
};

const resolveLeftNavigation = (
  rows: readonly UnitTreeNavigationRow[],
  currentRow: UnitTreeNavigationRow,
): UnitTreeNavigationResult => {
  if (currentRow.isExpanded) {
    return {
      action: { kind: "collapse", targetUnitId: currentRow.id },
      suppressDefault: true,
    };
  }
  return focusResult(resolveParentTarget(rows, currentRow));
};

const resolveSelection = (currentUnitId: string): UnitTreeNavigationResult => ({
  action: { kind: "select", targetUnitId: currentUnitId },
  suppressDefault: true,
});

type UnitTreeNavigationResolver = (
  rows: readonly UnitTreeNavigationRow[],
  currentRow: UnitTreeNavigationRow,
) => UnitTreeNavigationResult;

const navigationResolvers: Readonly<
  Record<string, UnitTreeNavigationResolver>
> = {
  ArrowDown: (rows, currentRow) =>
    resolveVerticalNavigation(rows, currentRow.id, 1),
  ArrowUp: (rows, currentRow) =>
    resolveVerticalNavigation(rows, currentRow.id, -1),
  Home: (rows) => resolveHomeNavigation(rows),
  End: (rows) => resolveEndNavigation(rows),
  ArrowRight: (rows, currentRow) => resolveRightNavigation(rows, currentRow),
  ArrowLeft: (rows, currentRow) => resolveLeftNavigation(rows, currentRow),
  Enter: (_rows, currentRow) => resolveSelection(currentRow.id),
  " ": (_rows, currentRow) => resolveSelection(currentRow.id),
};

type UnitTreeNavigationResultContext = {
  rows: readonly UnitTreeNavigationRow[];
  currentRow: UnitTreeNavigationRow;
  key: string;
};

const resolveUnitTreeNavigationResult = ({
  rows,
  currentRow,
  key,
}: UnitTreeNavigationResultContext): UnitTreeNavigationResult => {
  const resolver = navigationResolvers[key];
  return resolver?.(rows, currentRow) ?? { suppressDefault: false };
};

const isNavigableUnitTreeRow = (
  currentRow: UnitTreeNavigationRow | undefined,
  options: UnitTreeNavigationKeyOptions,
): boolean => currentRow?.isEnabled === true && !hasNavigationModifier(options);

export const resolveUnitTreeNavigationKey = (
  rows: readonly UnitTreeNavigationRow[],
  currentUnitId: string,
  options: UnitTreeNavigationKeyOptions,
): UnitTreeNavigationResult => {
  const defaultResult = { suppressDefault: false };
  const currentRow = rows.find((row) => row.id === currentUnitId);
  return isNavigableUnitTreeRow(currentRow, options)
    ? resolveUnitTreeNavigationResult({
        rows,
        currentRow: currentRow as UnitTreeNavigationRow,
        key: options.key,
      })
    : defaultResult;
};
