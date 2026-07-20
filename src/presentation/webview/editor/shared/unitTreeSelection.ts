import type { AjsUnit } from "../../../../domain/models/ajs/AjsDocument";

type UnitTreeLookupUnit = Pick<AjsUnit, "id" | "parentId">;

export const collectUnitTreeParentUnitIds = (
  unit: UnitTreeLookupUnit | undefined,
  unitById: ReadonlyMap<string, UnitTreeLookupUnit>,
): string[] => {
  const parentUnitIds: string[] = [];
  const visited = new Set<string>();
  let parentId = unit?.parentId;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    parentUnitIds.push(parentId);
    parentId = unitById.get(parentId)?.parentId;
  }

  return parentUnitIds;
};

export const collectUnitTreeAncestorUnitIds = (
  unitId: string | undefined,
  unitById: ReadonlyMap<string, UnitTreeLookupUnit>,
): string[] =>
  unitId
    ? collectUnitTreeParentUnitIds(unitById.get(unitId), unitById).reverse()
    : [];
