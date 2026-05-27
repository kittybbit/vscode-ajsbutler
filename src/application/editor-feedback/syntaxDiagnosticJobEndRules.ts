import type { Unit } from "../../domain/values/Unit";
import { parseExplicitDecimalInRange } from "./syntaxDiagnosticScalarValidators";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const hasInvalidExplicitThresholdOrdering = (unit: Unit): boolean => {
  const warningThreshold = parseExplicitDecimalInRange({
    parameter: findParameter(unit, "wth"),
    minimum: 0,
    maximum: 2147483647,
  });
  const abnormalThreshold = parseExplicitDecimalInRange({
    parameter: findParameter(unit, "tho"),
    minimum: 0,
    maximum: 2147483647,
  });

  if (warningThreshold === undefined || abnormalThreshold === undefined) {
    return false;
  }

  return warningThreshold >= abnormalThreshold;
};
