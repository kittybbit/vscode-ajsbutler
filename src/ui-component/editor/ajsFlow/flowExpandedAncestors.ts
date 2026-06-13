export type FlowExpandableAncestorUnit = {
  id: string;
  unitType: string;
  parentId?: string;
  children: ReadonlyArray<unknown>;
};

type CollectExpandedAncestorUnitIdsArgs<
  Unit extends FlowExpandableAncestorUnit,
> = {
  unitById: ReadonlyMap<string, Unit>;
  unit: Unit;
  scopeUnit: Unit;
};

const findParentUnit = <Unit extends FlowExpandableAncestorUnit>(
  unitById: ReadonlyMap<string, Unit>,
  unit: Unit,
): Unit | undefined =>
  unit.parentId ? unitById.get(unit.parentId) : undefined;

type CollectAncestorUnitsArgs<Unit extends FlowExpandableAncestorUnit> = {
  unitById: ReadonlyMap<string, Unit>;
  unit: Unit;
  stopUnitId: string;
};

const collectAncestorUnits = <Unit extends FlowExpandableAncestorUnit>({
  unitById,
  unit,
  stopUnitId,
}: CollectAncestorUnitsArgs<Unit>): Unit[] => {
  const ancestorUnits: Unit[] = [];
  let current = findParentUnit(unitById, unit);

  while (current && current.id !== stopUnitId) {
    ancestorUnits.push(current);
    current = findParentUnit(unitById, current);
  }

  return ancestorUnits;
};

const isExpandableAncestorUnit = (unit: FlowExpandableAncestorUnit): boolean =>
  unit.unitType === "n" && unit.children.length > 0;

export const collectExpandedAncestorUnitIds = <
  Unit extends FlowExpandableAncestorUnit,
>({
  unitById,
  unit,
  scopeUnit,
}: CollectExpandedAncestorUnitIdsArgs<Unit>): string[] => {
  const ancestorUnits = collectAncestorUnits({
    unitById,
    unit,
    stopUnitId: scopeUnit.id,
  });

  return ancestorUnits
    .filter(isExpandableAncestorUnit)
    .map(({ id }) => id)
    .reverse();
};

type CollectExpandedAncestorUnitIdsForUnitsArgs<
  Unit extends FlowExpandableAncestorUnit,
> = {
  unitById: ReadonlyMap<string, Unit>;
  units: ReadonlyArray<Unit>;
  scopeUnit: Unit;
};

export const collectExpandedAncestorUnitIdsForUnits = <
  Unit extends FlowExpandableAncestorUnit,
>({
  unitById,
  units,
  scopeUnit,
}: CollectExpandedAncestorUnitIdsForUnitsArgs<Unit>): string[] => {
  const expandedAncestorUnitIds = units.flatMap((unit) =>
    collectExpandedAncestorUnitIds({
      unitById,
      unit,
      scopeUnit,
    }),
  );

  return [...new Set(expandedAncestorUnitIds)];
};
