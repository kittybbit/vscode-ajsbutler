export const getRevealUnitAbsolutePath = (
  data: unknown,
): string | undefined => {
  if (!data || typeof data !== "object") {
    return undefined;
  }
  const absolutePath = (data as { absolutePath?: unknown }).absolutePath;
  return typeof absolutePath === "string" ? absolutePath : undefined;
};

type FlowRevealUnit = {
  id: string;
  absolutePath: string;
  unitType: string;
  parentId?: string;
  children: Array<unknown>;
};

export type FlowRevealTarget = {
  scopeUnitId: string;
  revealedUnitId: string;
  expandedAncestorUnitIds: string[];
};

const findFlowRevealUnitByAbsolutePath = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  absolutePath: string,
): FlowRevealUnit | undefined =>
  Array.from(unitById.values()).find(
    (unit) => unit.absolutePath === absolutePath,
  );

const findFlowRevealParentUnit = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  unit: FlowRevealUnit,
): FlowRevealUnit | undefined =>
  unit.parentId ? unitById.get(unit.parentId) : undefined;

const resolveFlowRevealScopeUnit = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  revealedUnit: FlowRevealUnit,
): FlowRevealUnit => {
  const directParent = findFlowRevealParentUnit(unitById, revealedUnit);
  if (directParent?.unitType === "rc") {
    return directParent;
  }

  let current = directParent;
  while (current) {
    if (current.unitType === "n") {
      return current;
    }
    current = findFlowRevealParentUnit(unitById, current);
  }

  return revealedUnit;
};

const collectExpandedAncestorUnitIds = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  revealedUnit: FlowRevealUnit,
  scopeUnit: FlowRevealUnit,
): string[] => {
  const expandedAncestorUnitIds: string[] = [];
  let current = findFlowRevealParentUnit(unitById, revealedUnit);
  while (current && current.id !== scopeUnit.id) {
    if (current.unitType === "n" && current.children.length > 0) {
      expandedAncestorUnitIds.unshift(current.id);
    }
    current = findFlowRevealParentUnit(unitById, current);
  }
  return expandedAncestorUnitIds;
};

export const resolveFlowRevealTarget = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  absolutePath: string,
): FlowRevealTarget | undefined => {
  const revealedUnit = findFlowRevealUnitByAbsolutePath(unitById, absolutePath);
  if (!revealedUnit) {
    return undefined;
  }

  const scopeUnit = resolveFlowRevealScopeUnit(unitById, revealedUnit);

  return {
    scopeUnitId: scopeUnit.id,
    revealedUnitId: revealedUnit.id,
    expandedAncestorUnitIds: collectExpandedAncestorUnitIds(
      unitById,
      revealedUnit,
      scopeUnit,
    ),
  };
};

export const findRowIndexByAbsolutePath = (
  rowIndexByAbsolutePath: ReadonlyMap<string, number>,
  absolutePath: string,
): number | undefined => rowIndexByAbsolutePath.get(absolutePath);
