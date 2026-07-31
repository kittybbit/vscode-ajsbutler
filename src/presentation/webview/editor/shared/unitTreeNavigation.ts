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

const appendVisibleUnitTreeRows = (
  units: readonly UnitTreeNavigationUnit[],
  expandedUnitIds: ReadonlySet<string>,
  isUnitEnabled: (unit: UnitTreeNavigationUnit) => boolean,
  rows: UnitTreeNavigationRow[],
): void => {
  for (const unit of units) {
    const hasChildren = unit.children.length > 0;
    const isExpanded = hasChildren && expandedUnitIds.has(unit.id);
    rows.push({
      id: unit.id,
      parentId: unit.parentId,
      depth: unit.depth,
      hasChildren,
      isEnabled: isUnitEnabled(unit),
      isExpanded,
    });
    if (isExpanded) {
      appendVisibleUnitTreeRows(
        unit.children,
        expandedUnitIds,
        isUnitEnabled,
        rows,
      );
    }
  }
};

export const resolveVisibleUnitTreeRows = (
  rootUnits: readonly UnitTreeNavigationUnit[],
  expandedUnitIds: ReadonlySet<string>,
  isUnitEnabled: (unit: UnitTreeNavigationUnit) => boolean,
): UnitTreeNavigationRow[] => {
  const rows: UnitTreeNavigationRow[] = [];
  appendVisibleUnitTreeRows(rootUnits, expandedUnitIds, isUnitEnabled, rows);
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

export const resolveUnitTreeNavigationKey = (
  rows: readonly UnitTreeNavigationRow[],
  currentUnitId: string,
  options: UnitTreeNavigationKeyOptions,
): UnitTreeNavigationResult => {
  if (hasNavigationModifier(options)) {
    return { suppressDefault: false };
  }
  const currentRow = rows.find((row) => row.id === currentUnitId);
  if (!currentRow || !currentRow.isEnabled) {
    return { suppressDefault: false };
  }

  switch (options.key) {
    case "ArrowDown": {
      const targetUnitId = resolveDirectionalTarget(rows, currentUnitId, 1);
      return {
        action: targetUnitId ? { kind: "focus", targetUnitId } : undefined,
        suppressDefault: true,
      };
    }
    case "ArrowUp": {
      const targetUnitId = resolveDirectionalTarget(rows, currentUnitId, -1);
      return {
        action: targetUnitId ? { kind: "focus", targetUnitId } : undefined,
        suppressDefault: true,
      };
    }
    case "Home": {
      const firstEnabledRow = resolveEnabledRows(rows)[0];
      return {
        action: firstEnabledRow
          ? { kind: "focus", targetUnitId: firstEnabledRow.id }
          : undefined,
        suppressDefault: true,
      };
    }
    case "End": {
      const enabledRows = resolveEnabledRows(rows);
      const lastEnabledRow = enabledRows[enabledRows.length - 1];
      return {
        action: lastEnabledRow
          ? { kind: "focus", targetUnitId: lastEnabledRow.id }
          : undefined,
        suppressDefault: true,
      };
    }
    case "ArrowRight": {
      if (!currentRow.hasChildren) {
        return { suppressDefault: true };
      }
      if (!currentRow.isExpanded) {
        return {
          action: { kind: "expand", targetUnitId: currentUnitId },
          suppressDefault: true,
        };
      }
      const targetUnitId = resolveChildTarget(rows, currentRow);
      return {
        action: targetUnitId ? { kind: "focus", targetUnitId } : undefined,
        suppressDefault: true,
      };
    }
    case "ArrowLeft": {
      if (currentRow.isExpanded) {
        return {
          action: { kind: "collapse", targetUnitId: currentUnitId },
          suppressDefault: true,
        };
      }
      const parentTarget = resolveParentTarget(rows, currentRow);
      return {
        action: parentTarget
          ? { kind: "focus", targetUnitId: parentTarget }
          : undefined,
        suppressDefault: true,
      };
    }
    case "Enter":
    case " ":
      return {
        action: { kind: "select", targetUnitId: currentUnitId },
        suppressDefault: true,
      };
    default:
      return { suppressDefault: false };
  }
};
