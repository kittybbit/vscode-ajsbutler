import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { Unit, UnitParameter } from "../../domain/values/Unit";
import {
  isValidExplicitByteLengthValue,
  parseExplicitDecimalInRange,
} from "./syntaxDiagnosticScalarValidators";
import { hasWildcard } from "./syntaxDiagnosticStringValidators";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const isValidExplicitFileMonitoringFileName = (
  parameter: UnitParameter | undefined,
): boolean => isValidExplicitByteLengthValue(parameter, 1, 255);

export const isValidExplicitFileMonitoringInterval = (
  parameter: UnitParameter | undefined,
): boolean => parseExplicitDecimalInRange(parameter, 1, 600) !== undefined;

export const hasInvalidWildcardWithShortMonitoringInterval = (
  parameter: UnitParameter,
  unit: Unit,
): boolean => {
  if (!hasWildcard(parameter.value)) {
    return false;
  }

  const effectiveFlwi = findParameter(unit, "flwi")?.value ?? DEFAULTS.Flwi;
  if (!/^\d+$/.test(effectiveFlwi)) {
    return false;
  }

  const monitoringInterval = Number(effectiveFlwi);
  return monitoringInterval >= 1 && monitoringInterval <= 9;
};

export const splitFileMonitoringConditions = (value: string): Set<string> =>
  new Set(value.split(":").filter((condition) => condition.length > 0));
