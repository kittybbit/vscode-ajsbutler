import { AjsUnit } from "../../../domain/models/ajs/AjsDocument";

const appendExpandableDescendants = (
  unit: AjsUnit,
  expandableUnitIds: string[],
) => {
  for (const child of unit.children) {
    if (child.unitType === "n" && child.children.length > 0) {
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

export const hasExpandedAllNestedUnitIds = (
  expandableUnitIds: readonly string[],
  expandedUnitIds: ReadonlySet<string>,
): boolean =>
  expandableUnitIds.length > 0 &&
  expandableUnitIds.every((unitId) => expandedUnitIds.has(unitId));
