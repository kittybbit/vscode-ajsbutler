import type { UnitParameter } from "../../domain/values/Unit";

export const parseExplicitDecimalInRange = (
  parameter: UnitParameter | undefined,
  minimum: number,
  maximum: number,
  options: { allowNegative?: boolean } = {},
): number | undefined => {
  const rawValue = parameter?.value;
  const decimalPattern = options.allowNegative ? /^-?\d+$/ : /^\d+$/;
  if (!rawValue || !decimalPattern.test(rawValue)) {
    return undefined;
  }

  const numericValue = Number(rawValue);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

export const parseExplicitHexadecimalInRange = (
  value: string | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  if (!value || !/^[0-9a-fA-F]{1,8}$/.test(value)) {
    return undefined;
  }

  const numericValue = Number.parseInt(value, 16);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

export const getByteLength = (value: string): number =>
  new TextEncoder().encode(value).length;

export const hasValidByteLength = (
  value: string,
  minimum: number,
  maximum: number,
): boolean => {
  const byteLength = getByteLength(value);
  return byteLength >= minimum && byteLength <= maximum;
};

export const isValidExplicitByteLengthValue = (
  parameter: UnitParameter | undefined,
  minimum: number,
  maximum: number,
): boolean => {
  const rawValue = parameter?.value;
  if (rawValue === undefined) {
    return false;
  }

  return hasValidByteLength(rawValue, minimum, maximum);
};
