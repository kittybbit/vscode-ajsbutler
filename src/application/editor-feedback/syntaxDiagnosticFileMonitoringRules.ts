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
): boolean =>
  parseExplicitDecimalInRange({ parameter, minimum: 1, maximum: 600 }) !==
  undefined;

export const hasInvalidWildcardWithShortMonitoringInterval = (
  parameter: UnitParameter,
  unit: Unit,
): boolean => {
  if (!hasWildcard(parameter.value)) {
    return false;
  }

  return hasShortMonitoringInterval(unit);
};

const hasShortMonitoringInterval = (unit: Unit): boolean => {
  const monitoringInterval = parseEffectiveMonitoringInterval(unit);
  return (
    monitoringInterval !== undefined &&
    monitoringInterval >= 1 &&
    monitoringInterval <= 9
  );
};

const parseEffectiveMonitoringInterval = (unit: Unit): number | undefined => {
  const effectiveFlwi = findParameter(unit, "flwi")?.value ?? DEFAULTS.Flwi;
  if (!/^\d+$/.test(effectiveFlwi)) {
    return undefined;
  }

  return Number(effectiveFlwi);
};

export const splitFileMonitoringConditions = (value: string): Set<string> =>
  new Set(value.split(":").filter((condition) => condition.length > 0));
