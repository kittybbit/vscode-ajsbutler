import {
  findAjsUnitParameter,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";

export const parseExplicitJobEndDecimalInRange = (
  parameter: AjsParameter | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  const rawValue = parameter?.value;
  if (!rawValue || !/^\d+$/.test(rawValue)) {
    return undefined;
  }

  const numericValue = Number(rawValue);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

export const hasInvalidExplicitThresholdOrdering = (unit: AjsUnit): boolean => {
  const warningThreshold = parseExplicitJobEndDecimalInRange(
    findAjsUnitParameter(unit, "wth"),
    0,
    2147483647,
  );
  const abnormalThreshold = parseExplicitJobEndDecimalInRange(
    findAjsUnitParameter(unit, "tho"),
    0,
    2147483647,
  );

  return (
    warningThreshold !== undefined &&
    abnormalThreshold !== undefined &&
    warningThreshold >= abnormalThreshold
  );
};
