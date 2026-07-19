import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import {
  isExplicitMacroVariable,
  parseQuotedStringLiteralContent,
} from "./syntaxDiagnosticStringValidators";
import {
  transferMacroAllowedTargetTypes,
  transferMacroQueuingTargetTypes,
} from "./syntaxDiagnosticTargetTypes";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const isAbsoluteTransferFilePath = (value: string): boolean =>
  value.startsWith("/") ||
  value.startsWith("\\") ||
  /^[A-Za-z]:[\\/]/.test(value);

export const isValidExplicitTransferFileValue = (
  parameter: AjsParameter | undefined,
  unit: AjsUnit,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  if (parseQuotedStringLiteralContent(rawValue) !== undefined) {
    return true;
  }

  if (!isExplicitMacroVariable(rawValue)) {
    return false;
  }

  if (transferMacroAllowedTargetTypes.has(unit.unitType)) {
    return true;
  }

  const effectiveJobType = findParameter(unit, "jty")?.value ?? DEFAULTS.Jty;
  return (
    transferMacroQueuingTargetTypes.has(unit.unitType) &&
    effectiveJobType === "q"
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
