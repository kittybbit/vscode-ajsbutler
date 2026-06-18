import type { AjsParameter } from "../../domain/models/ajs/AjsDocument";
import {
  isExplicitMacroVariable,
  parseQuotedStringLiteralContent,
} from "./syntaxDiagnosticStringValidators";

export const isAbsoluteTransferFilePath = (value: string): boolean =>
  value.startsWith("/") ||
  value.startsWith("\\") ||
  /^[A-Za-z]:[\\/]/.test(value);

export const isValidExplicitTransferFileValue = (
  parameter: AjsParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  return (
    parseQuotedStringLiteralContent(rawValue) !== undefined ||
    isExplicitMacroVariable(rawValue)
  );
};

export const hasInvalidExplicitTransferSourcePath = (
  parameter: AjsParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const quotedContent = parseQuotedStringLiteralContent(rawValue);
  return quotedContent ? !isAbsoluteTransferFilePath(quotedContent) : false;
};
