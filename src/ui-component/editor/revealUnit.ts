import { collectExpandedAncestorUnitIds } from "./ajsFlow/flowExpandedAncestors";

const isObjectRecord = (data: unknown): data is Record<string, unknown> =>
  !!data && typeof data === "object";

const getStringProperty = (
  data: Record<string, unknown>,
  propertyName: string,
): string | undefined => {
  const value = data[propertyName];
  return typeof value === "string" ? value : undefined;
};

export const getRevealUnitAbsolutePath = (data: unknown): string | undefined =>
  isObjectRecord(data) ? getStringProperty(data, "absolutePath") : undefined;

type FlowRevealUnit = {
  id: string;
  absolutePath: string;
  unitType: string;
  isRootJobnet?: boolean;
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

const isConditionUnit = (unit: FlowRevealUnit | undefined): boolean =>
  unit?.unitType === "rc";

const isJobnetUnit = (unit: FlowRevealUnit | undefined): boolean =>
  unit?.unitType === "n";

const isJobGroupUnit = (unit: FlowRevealUnit | undefined): boolean =>
  unit?.unitType === "g";

const isRootJobnetUnit = (unit: FlowRevealUnit | undefined): boolean =>
  unit?.unitType === "n" && unit.isRootJobnet === true;

const isDescendantOf = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  unit: FlowRevealUnit,
  ancestor: FlowRevealUnit,
): boolean => {
  let current = findFlowRevealParentUnit(unitById, unit);
  while (current) {
    if (current.id === ancestor.id) {
      return true;
    }
    current = findFlowRevealParentUnit(unitById, current);
  }
  return false;
};

const findFirstDescendantRootJobnet = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  unit: FlowRevealUnit,
): FlowRevealUnit | undefined =>
  Array.from(unitById.values()).find(
    (candidate) =>
      isRootJobnetUnit(candidate) && isDescendantOf(unitById, candidate, unit),
  );

const findNearestJobnetAncestor = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  unit: FlowRevealUnit | undefined,
): FlowRevealUnit | undefined => {
  let current = unit;
  while (current && !isJobnetUnit(current)) {
    current = findFlowRevealParentUnit(unitById, current);
  }
  return current;
};

const resolveFlowRevealScopeUnit = (
  unitById: ReadonlyMap<string, FlowRevealUnit>,
  revealedUnit: FlowRevealUnit,
): FlowRevealUnit => {
  if (isJobGroupUnit(revealedUnit)) {
    return (
      findFirstDescendantRootJobnet(unitById, revealedUnit) ?? revealedUnit
    );
  }

  const directParent = findFlowRevealParentUnit(unitById, revealedUnit);
  if (isConditionUnit(directParent)) {
    return directParent;
  }

  return findNearestJobnetAncestor(unitById, directParent) ?? revealedUnit;
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
    expandedAncestorUnitIds: collectExpandedAncestorUnitIds({
      unitById,
      unit: revealedUnit,
      scopeUnit,
    }),
  };
};

export const findRowIndexByAbsolutePath = (
  rowIndexByAbsolutePath: ReadonlyMap<string, number>,
  absolutePath: string,
): number | undefined => rowIndexByAbsolutePath.get(absolutePath);
