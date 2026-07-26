import {
  findAjsUnitParameter,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import { DEFAULTS } from "../../models/parameters/Defaults";

const transferMacroQueuingTargetTypes = new Set(["j", "rj", "pj", "rp"]);
const transferMacroAllowedTargetTypes = new Set(["cj", "rcj", "qj", "rq"]);

export const parseQuotedTransferFileContent = (
  value: string,
): string | undefined => /^"((?:\\.|[^"\\])*)"$/.exec(value)?.[1];

export const isExplicitTransferMacroVariable = (value: string): boolean =>
  /^\?[^?\r\n]+\?$/.test(value);

export const hasValidExplicitTransferFileValue = (
  parameter: AjsParameter,
  unit: AjsUnit,
): boolean => {
  if (parseQuotedTransferFileContent(parameter.value) !== undefined) {
    return true;
  }

  if (!isExplicitTransferMacroVariable(parameter.value)) {
    return false;
  }

  if (transferMacroAllowedTargetTypes.has(unit.unitType)) {
    return true;
  }

  const effectiveJobType =
    findAjsUnitParameter(unit, "jty")?.value ?? DEFAULTS.Jty;
  return (
    transferMacroQueuingTargetTypes.has(unit.unitType) &&
    effectiveJobType === "q"
  );
};

export const hasValidExplicitTransferByteLength = (
  parameter: AjsParameter,
): boolean => {
  const value =
    parameter.value.length >= 2 &&
    parameter.value.startsWith('"') &&
    parameter.value.endsWith('"')
      ? parameter.value.slice(1, -1)
      : parameter.value;
  const byteLength = new TextEncoder().encode(value).length;
  return byteLength >= 1 && byteLength <= 511;
};

export const isAbsoluteTransferFilePath = (value: string): boolean =>
  value.startsWith("/") ||
  value.startsWith("\\") ||
  /^[A-Za-z]:[\\/]/.test(value);

export const hasInvalidExplicitTransferSourcePath = (
  parameter: AjsParameter,
): boolean => {
  const content = parseQuotedTransferFileContent(parameter.value);
  return content ? !isAbsoluteTransferFilePath(content) : false;
};
