type UnitParameterSource = {
  parameters: Array<{
    key: string;
    value: string;
    position?: number;
  }>;
};

export const findUnitParameters = (
  unit: UnitParameterSource | undefined,
  key: string,
): Array<{ key: string; value: string; position?: number }> =>
  unit?.parameters.filter((parameter) => parameter.key === key) ?? [];

export const findUnitParameter = (
  unit: UnitParameterSource | undefined,
  key: string,
): { key: string; value: string; position?: number } | undefined =>
  findUnitParameters(unit, key)[0];

export const findUnitParameterValue = (
  unit: UnitParameterSource | undefined,
  key: string,
): string | undefined => findUnitParameter(unit, key)?.value;

export const findUnitParameterValues = (
  unit: UnitParameterSource | undefined,
  key: string,
): string[] =>
  findUnitParameters(unit, key).map((parameter) => parameter.value);
