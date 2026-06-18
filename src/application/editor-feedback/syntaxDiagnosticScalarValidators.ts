import type { AjsParameter } from "../../domain/models/ajs/AjsDocument";

type ExplicitDecimalRangeInput = {
  parameter: AjsParameter | undefined;
  minimum: number;
  maximum: number;
  options?: { allowNegative?: boolean };
};

export const parseExplicitDecimalInRange = ({
  parameter,
  minimum,
  maximum,
  options = {},
}: ExplicitDecimalRangeInput): number | undefined => {
  const rawValue = parameter?.value;
  if (!isExplicitDecimalValue(rawValue, options)) {
    return undefined;
  }

  const numericValue = Number(rawValue);
  return isInRange(numericValue, minimum, maximum) ? numericValue : undefined;
};

const isExplicitDecimalValue = (
  value: string | undefined,
  options: { allowNegative?: boolean },
): value is string => Boolean(value && decimalPatternFor(options).test(value));

const decimalPatternFor = (options: { allowNegative?: boolean }): RegExp =>
  options.allowNegative ? /^-?\d+$/ : /^\d+$/;

export const parseExplicitHexadecimalInRange = (
  value: string | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  if (!isExplicitHexadecimalValue(value)) {
    return undefined;
  }

  const numericValue = Number.parseInt(value, 16);
  return isInRange(numericValue, minimum, maximum) ? numericValue : undefined;
};

const isExplicitHexadecimalValue = (
  value: string | undefined,
): value is string => Boolean(value && /^[0-9a-fA-F]{1,8}$/.test(value));

const isInRange = (value: number, minimum: number, maximum: number): boolean =>
  value >= minimum && value <= maximum;

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
  parameter: AjsParameter | undefined,
  minimum: number,
  maximum: number,
): boolean => {
  const rawValue = parameter?.value;
  if (rawValue === undefined) {
    return false;
  }

  return hasValidByteLength(rawValue, minimum, maximum);
};
