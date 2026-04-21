import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";

export const isNestedJobnetUnit = (unit: AjsUnit): boolean =>
  ["n", "rn", "rm", "rr"].includes(unit.unitType);

export const isExpandableNestedUnit = (unit: AjsUnit): boolean =>
  isNestedJobnetUnit(unit) && unit.children.length > 0;

const appendExpandableDescendants = (
  unit: AjsUnit,
  expandableUnitIds: string[],
) => {
  for (const child of unit.children) {
    if (isExpandableNestedUnit(child)) {
      expandableUnitIds.push(child.id);
    }
    if (child.children.length > 0) {
      appendExpandableDescendants(child, expandableUnitIds);
    }
  }
};

export const collectExpandableNestedUnitIds = (
  currentUnit?: AjsUnit,
): string[] => {
  if (!currentUnit) {
    return [];
  }
  const expandableUnitIds: string[] = [];
  appendExpandableDescendants(currentUnit, expandableUnitIds);
  return expandableUnitIds;
};

export const collapseExpandedNestedUnitIds = (
  expandedUnitIds: readonly string[],
  collapsedUnitId: string,
  collapsedUnit?: AjsUnit,
): string[] => {
  if (!collapsedUnit) {
    return expandedUnitIds.filter((unitId) => unitId !== collapsedUnitId);
  }

  const descendantUnitIds = new Set(
    collectExpandableNestedUnitIds(collapsedUnit),
  );
  return expandedUnitIds.filter(
    (unitId) => unitId !== collapsedUnitId && !descendantUnitIds.has(unitId),
  );
};

export const hasExpandedAllNestedUnitIds = (
  expandableUnitIds: readonly string[],
  expandedUnitIds: ReadonlySet<string>,
): boolean =>
  expandableUnitIds.length > 0 &&
  expandableUnitIds.every((unitId) => expandedUnitIds.has(unitId));
