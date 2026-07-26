import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";

export const isNestedJobnetUnit = (unit: FlowGraphUnitDto): boolean =>
  ["n", "rn", "rm", "rr"].includes(unit.unitType);

export const isExpandableNestedUnit = (unit: FlowGraphUnitDto): boolean =>
  isNestedJobnetUnit(unit) && unit.children.length > 0;

const expandableNestedUnitId = (unit: FlowGraphUnitDto): string[] =>
  isExpandableNestedUnit(unit) ? [unit.id] : [];

const collectChildExpandableNestedUnitIds = (
  unit: FlowGraphUnitDto,
): string[] => [
  ...expandableNestedUnitId(unit),
  ...collectExpandableNestedUnitIds(unit),
];

export const collectExpandableNestedUnitIds = (
  currentUnit?: FlowGraphUnitDto,
): string[] => {
  if (!currentUnit) {
    return [];
  }
  return currentUnit.children.flatMap(collectChildExpandableNestedUnitIds);
};

export const collapseExpandedNestedUnitIds = (
  expandedUnitIds: readonly string[],
  collapsedUnitId: string,
  collapsedUnit?: FlowGraphUnitDto,
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
