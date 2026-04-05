import { Unit } from "./Unit";

export const findUnitParameters = (
  unit: Unit | undefined,
  key: string,
): Array<{ key: string; value: string; position?: number }> =>
  unit?.parameters.filter((parameter) => parameter.key === key) ?? [];

export const findUnitParameter = (
  unit: Unit | undefined,
  key: string,
): { key: string; value: string; position?: number } | undefined =>
  findUnitParameters(unit, key)[0];

export const findUnitParameterValue = (
  unit: Unit | undefined,
  key: string,
): string | undefined => findUnitParameter(unit, key)?.value;

export const findUnitParameterValues = (
  unit: Unit | undefined,
  key: string,
): string[] =>
  findUnitParameters(unit, key).map((parameter) => parameter.value);
