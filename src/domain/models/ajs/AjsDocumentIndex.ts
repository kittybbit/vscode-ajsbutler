import type { AjsDocument, AjsUnit } from "./AjsDocument";

export type AjsDocumentIndex = {
  readonly byId: ReadonlyMap<string, readonly AjsUnit[]>;
  readonly byPath: ReadonlyMap<string, readonly AjsUnit[]>;
};

const appendChildren = (pending: AjsUnit[], unit: AjsUnit): void => {
  [...unit.children].reverse().forEach((child) => pending.push(child));
};

const visitUnit = (
  units: AjsUnit[],
  visited: Set<AjsUnit>,
  unit: AjsUnit,
): boolean => {
  if (visited.has(unit)) {
    return false;
  }
  visited.add(unit);
  units.push(unit);
  return true;
};

const processPendingUnit = (
  pending: AjsUnit[],
  units: AjsUnit[],
  visited: Set<AjsUnit>,
): void => {
  const unit = pending.pop() as AjsUnit;
  if (visitUnit(units, visited, unit)) {
    appendChildren(pending, unit);
  }
};

export const collectUniqueAjsUnits = (document: AjsDocument): AjsUnit[] => {
  const units: AjsUnit[] = [];
  const pending = [...document.rootUnits].reverse();
  const visited = new Set<AjsUnit>();
  while (pending.length > 0) {
    processPendingUnit(pending, units, visited);
  }
  return units;
};

export const collectAjsUnitOccurrences = (document: AjsDocument): AjsUnit[] => {
  const units: AjsUnit[] = [];
  const visit = (children: readonly AjsUnit[]): void => {
    children.forEach((unit) => {
      units.push(unit);
      visit(unit.children);
    });
  };
  visit(document.rootUnits);
  return units;
};

const appendUnit = (
  index: Map<string, AjsUnit[]>,
  key: string,
  unit: AjsUnit,
): Map<string, AjsUnit[]> => {
  const matches = index.get(key) ?? [];
  matches.push(unit);
  index.set(key, matches);
  return index;
};

export const indexAjsUnits = (
  units: readonly AjsUnit[],
  key: (unit: AjsUnit) => string,
): ReadonlyMap<string, readonly AjsUnit[]> =>
  units.reduce(
    (index, unit) => appendUnit(index, key(unit), unit),
    new Map<string, AjsUnit[]>(),
  );

export const createAjsDocumentIndex = (
  units: readonly AjsUnit[],
): AjsDocumentIndex => ({
  byId: indexAjsUnits(units, (unit) => unit.id),
  byPath: indexAjsUnits(units, (unit) => unit.absolutePath),
});
