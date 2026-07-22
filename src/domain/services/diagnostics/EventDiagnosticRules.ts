import type { AjsParameter } from "../../models/ajs/AjsDocument";

const eventReceivingTimeoutBareModes = new Set(["n", "a"]);
const eventReceivingTimeoutFileModes = new Set(["n", "a", "d", "b"]);
const eventTimeoutActions = new Set(["kl", "nr", "wr", "an"]);

const getByteLength = (value: string): number =>
  new TextEncoder().encode(value).length;

const hasValidByteLength = (
  value: string,
  minimum: number,
  maximum: number,
): boolean => {
  const byteLength = getByteLength(value);
  return byteLength >= minimum && byteLength <= maximum;
};

export const parseExplicitEventDecimalInRange = (
  parameter: AjsParameter,
  minimum: number,
  maximum: number,
  allowNegative = false,
): number | undefined => {
  const decimalPattern = allowNegative ? /^-?\d+$/ : /^\d+$/;
  if (!decimalPattern.test(parameter.value)) {
    return undefined;
  }

  const value = Number(parameter.value);
  return value >= minimum && value <= maximum ? value : undefined;
};

const parseExplicitHexadecimalInRange = (
  value: string,
  minimum: number,
  maximum: number,
): number | undefined => {
  if (!/^[0-9a-fA-F]{1,8}$/.test(value)) {
    return undefined;
  }

  const numericValue = Number.parseInt(value, 16);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

export const hasValidExplicitEventHostLength = (
  parameter: AjsParameter,
): boolean => hasValidByteLength(parameter.value, 1, 255);

export const hasValidExplicitEventSendingId = (
  parameter: AjsParameter,
): boolean =>
  parseExplicitHexadecimalInRange(parameter.value, 0x00000000, 0x00001fff) !==
    undefined ||
  parseExplicitHexadecimalInRange(parameter.value, 0x7fff8000, 0x7fffffff) !==
    undefined;

export const hasValidExplicitEventReceivingId = (
  parameter: AjsParameter,
): boolean => {
  const segments = parameter.value.split(":");
  return (
    segments.length === 2 &&
    segments.every(
      (segment) =>
        parseExplicitHexadecimalInRange(segment, 0x00000000, 0xffffffff) !==
        undefined,
    )
  );
};

export const hasValidExplicitEventSourceIpAddress = (
  parameter: AjsParameter,
): boolean => {
  const octets = parameter.value.split(".");
  return (
    octets.length === 4 &&
    octets.every((octet) => {
      if (!/^\d+$/.test(octet)) {
        return false;
      }

      const value = Number(octet);
      return value >= 0 && value <= 255;
    })
  );
};

const hashEscapedContentPattern = /^(?:[^"#]|#["#])*#?$/;
const hashEscapedContentEscapePattern = /#(["#])/g;
const hashEscapedTrailingQuotePattern = /#$/;

export const parseHashEscapedQuotedEventStringContent = (
  value: string,
): string | undefined => {
  if (!value.startsWith('"') || !value.endsWith('"')) {
    return undefined;
  }

  const content = value.slice(1, -1);
  return hashEscapedContentPattern.test(content)
    ? content
        .replace(hashEscapedContentEscapePattern, "$1")
        .replace(hashEscapedTrailingQuotePattern, '"')
    : undefined;
};

export const hasValidExplicitEventReceivingQuotedString = (
  parameter: AjsParameter,
  minimum: number,
  maximum: number,
): boolean => {
  const content = parseHashEscapedQuotedEventStringContent(parameter.value);
  return content !== undefined && hasValidByteLength(content, minimum, maximum);
};

export const hasValidExplicitEventReceivingFilterReference = (
  parameter: AjsParameter,
): boolean => {
  const separatorIndex = parameter.value.indexOf(":");
  return (
    separatorIndex > 0 &&
    parseHashEscapedQuotedEventStringContent(
      parameter.value.slice(separatorIndex + 1),
    ) !== undefined
  );
};

export const hasValidExplicitEventReceivingTimeoutCondition = (
  parameter: AjsParameter,
): boolean => {
  if (eventReceivingTimeoutBareModes.has(parameter.value)) {
    return true;
  }

  const separatorIndex = parameter.value.indexOf(":");
  if (separatorIndex <= 0) {
    return false;
  }

  const mode = parameter.value.slice(0, separatorIndex);
  const fileName = parseHashEscapedQuotedEventStringContent(
    parameter.value.slice(separatorIndex + 1),
  );
  return (
    eventReceivingTimeoutFileModes.has(mode) &&
    fileName !== undefined &&
    hasValidByteLength(fileName, 1, 256)
  );
};

export const hasValidExplicitEventSearchCondition = (
  parameter: AjsParameter,
): boolean =>
  parameter.value === "no" ||
  parseExplicitEventDecimalInRange(parameter, 1, 720) !== undefined;

export const hasValidExplicitEventTimeoutAction = (
  parameter: AjsParameter,
): boolean => eventTimeoutActions.has(parameter.value);

export const getCanonicalEventReceivingFilterByteLength = (
  parameter: AjsParameter,
): number => getByteLength(`evwfr=${parameter.value};`);
