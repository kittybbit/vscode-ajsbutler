import type { Unit, UnitParameter } from "../../domain/values/Unit";

export const flattenUnits = (units: Unit[]): Unit[] =>
  units.reduce<Unit[]>(
    (allUnits, unit) => [...allUnits, unit, ...flattenUnits(unit.children)],
    [],
  );

export const findParameter = (
  unit: Unit,
  key: string,
): UnitParameter | undefined =>
  unit.parameters.find((parameter) => parameter.key === key);

export const findParameters = (unit: Unit, key: string): UnitParameter[] =>
  unit.parameters.filter((parameter) => parameter.key === key);

export const findUnitsByTypes = (
  rootUnits: Unit[],
  targetTypes: Set<string>,
): Unit[] =>
  flattenUnits(rootUnits).filter((unit) => {
    const unitType = findParameter(unit, "ty")?.value;
    return unitType ? targetTypes.has(unitType) : false;
  });

export const hasStartConditionContext = (unit: Unit): boolean =>
  unit.parent?.children.some(
    (sibling) => findParameter(sibling, "ty")?.value === "rc",
  ) ?? false;
