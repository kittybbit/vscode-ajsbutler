import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import {
  isValidExplicitGovernedByteLengthValue,
  parseExplicitDecimalInRange,
} from "./syntaxDiagnosticScalarValidators";
import { hasWildcard } from "./syntaxDiagnosticStringValidators";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const isValidExplicitFileMonitoringFileName = (
  parameter: AjsParameter | undefined,
): boolean => isValidExplicitGovernedByteLengthValue(parameter, 1, 255);

export const isValidExplicitFileMonitoringInterval = (
  parameter: AjsParameter | undefined,
): boolean =>
  parseExplicitDecimalInRange({ parameter, minimum: 1, maximum: 600 }) !==
  undefined;

export const isValidExplicitFileMonitoringConditions = (
  parameter: AjsParameter,
): boolean => /^c(?::d(?::[sm])?)?$/.test(parameter.value);

export const hasInvalidWildcardWithShortMonitoringInterval = (
  parameter: AjsParameter,
  unit: AjsUnit,
): boolean => {
  if (!hasWildcard(parameter.value)) {
    return false;
  }

  return hasShortMonitoringInterval(unit);
};

const hasShortMonitoringInterval = (unit: AjsUnit): boolean => {
  const monitoringInterval = parseEffectiveMonitoringInterval(unit);
  return (
    monitoringInterval !== undefined &&
    monitoringInterval >= 1 &&
    monitoringInterval <= 9
  );
};

const parseEffectiveMonitoringInterval = (
  unit: AjsUnit,
): number | undefined => {
  const effectiveFlwi = findParameter(unit, "flwi")?.value ?? DEFAULTS.Flwi;
  if (!/^\d+$/.test(effectiveFlwi)) {
    return undefined;
  }

  return Number(effectiveFlwi);
};

export const splitFileMonitoringConditions = (value: string): Set<string> =>
  new Set(value.split(":").filter((condition) => condition.length > 0));
