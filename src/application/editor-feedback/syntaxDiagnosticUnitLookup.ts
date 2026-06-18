import {
  findAjsUnitParameter,
  findAjsUnitParameters,
  flattenAjsUnits,
  findParentAjsUnit,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../domain/models/ajs/AjsDocument";

export const findParameter = (
  unit: AjsUnit,
  key: string,
): AjsParameter | undefined => findAjsUnitParameter(unit, key);

export const findParameters = (unit: AjsUnit, key: string): AjsParameter[] =>
  findAjsUnitParameters(unit, key);

export const findUnitsByTypes = (
  document: AjsDocument,
  targetTypes: ReadonlySet<string>,
): AjsUnit[] =>
  flattenAjsUnits(document.rootUnits).filter((unit) => {
    const explicitUnitType = findParameter(unit, "ty")?.value;
    return explicitUnitType ? targetTypes.has(explicitUnitType) : false;
  });

export const hasStartConditionContext = (
  document: AjsDocument,
  unit: AjsUnit,
): boolean =>
  findParentAjsUnit(document, unit)?.children.some(
    (sibling) => findParameter(sibling, "ty")?.value === "rc",
  ) ?? false;
