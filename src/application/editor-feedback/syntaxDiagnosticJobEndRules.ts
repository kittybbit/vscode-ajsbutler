import type { Unit } from "../../domain/values/Unit";
import { parseExplicitDecimalInRange } from "./syntaxDiagnosticScalarValidators";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const hasInvalidExplicitThresholdOrdering = (unit: Unit): boolean => {
  const warningThreshold = parseExplicitDecimalInRange(
    findParameter(unit, "wth"),
    0,
    2147483647,
  );
  const abnormalThreshold = parseExplicitDecimalInRange(
    findParameter(unit, "tho"),
    0,
    2147483647,
  );

  if (warningThreshold === undefined || abnormalThreshold === undefined) {
    return false;
  }

  return warningThreshold >= abnormalThreshold;
};
