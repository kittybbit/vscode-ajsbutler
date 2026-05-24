import type { UnitParameter } from "../../domain/values/Unit";
import {
  hasValidByteLength,
  isValidExplicitByteLengthValue,
  parseExplicitDecimalInRange,
  parseExplicitHexadecimalInRange,
} from "./syntaxDiagnosticScalarValidators";
import { parseHashEscapedQuotedStringLiteralContent } from "./syntaxDiagnosticStringValidators";

const EVENT_RECEIVING_TIMEOUT_BARE_MODES = new Set(["n", "a"]);
const EVENT_RECEIVING_TIMEOUT_FILE_MODES = new Set(["n", "a", "d", "b"]);

type EventReceivingTimeoutFileCondition = {
  readonly mode: string;
  readonly rawFileName: string;
};

const parseEventReceivingTimeoutFileCondition = (
  rawValue: string,
): EventReceivingTimeoutFileCondition | undefined => {
  const separatorIndex = rawValue.indexOf(":");
  return separatorIndex > 0
    ? {
        mode: rawValue.slice(0, separatorIndex),
        rawFileName: rawValue.slice(separatorIndex + 1),
      }
    : undefined;
};

const isValidEventReceivingTimeoutFileName = (rawFileName: string): boolean => {
  const fileName = parseHashEscapedQuotedStringLiteralContent(rawFileName);
  return fileName !== undefined && hasValidByteLength(fileName, 1, 256);
};

const isValidEventReceivingTimeoutFileCondition = (
  rawValue: string,
): boolean => {
  const condition = parseEventReceivingTimeoutFileCondition(rawValue);
  return (
    condition !== undefined &&
    EVENT_RECEIVING_TIMEOUT_FILE_MODES.has(condition.mode) &&
    isValidEventReceivingTimeoutFileName(condition.rawFileName)
  );
};

export const isValidExplicitEventHostValue = (
  parameter: UnitParameter | undefined,
): boolean => isValidExplicitByteLengthValue(parameter, 1, 255);

export const isValidExplicitColonSeparatedHexadecimalEventId = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const segments = rawValue.split(":");
  if (segments.length !== 2) {
    return false;
  }

  return segments.every(
    (segment) =>
      parseExplicitHexadecimalInRange(segment, 0x00000000, 0xffffffff) !==
      undefined,
  );
};

export const isValidExplicitIpv4Address = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const octets = rawValue.split(".");
  if (octets.length !== 4) {
    return false;
  }

  return octets.every((octet) => {
    if (!/^\d+$/.test(octet)) {
      return false;
    }

    const numericValue = Number(octet);
    return numericValue >= 0 && numericValue <= 255;
  });
};

export const isValidExplicitEventReceivingQuotedString = (
  parameter: UnitParameter | undefined,
  minimum: number,
  maximum: number,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const content = parseHashEscapedQuotedStringLiteralContent(rawValue);
  return content !== undefined && hasValidByteLength(content, minimum, maximum);
};

export const isValidExplicitEventReceivingFilterReference = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue || !hasValidByteLength(rawValue, 1, 2048)) {
    return false;
  }

  const separatorIndex = rawValue.indexOf(":");
  if (separatorIndex <= 0) {
    return false;
  }

  const attributeName = rawValue.slice(0, separatorIndex);
  const attributeValue = rawValue.slice(separatorIndex + 1);
  return (
    attributeName.length > 0 &&
    parseHashEscapedQuotedStringLiteralContent(attributeValue) !== undefined
  );
};

export const isValidExplicitEventReceivingTimeoutCondition = (
  parameter: UnitParameter | undefined,
): boolean =>
  parameter?.value !== undefined &&
  (EVENT_RECEIVING_TIMEOUT_BARE_MODES.has(parameter.value) ||
    isValidEventReceivingTimeoutFileCondition(parameter.value));

export const isValidExplicitEventSearchCondition = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  if (rawValue === "no") {
    return true;
  }

  return parseExplicitDecimalInRange(parameter, 1, 720) !== undefined;
};
