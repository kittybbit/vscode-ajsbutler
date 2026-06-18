import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { parseExplicitDecimalInRange } from "./syntaxDiagnosticScalarValidators";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const hasInvalidExplicitThresholdOrdering = (unit: AjsUnit): boolean => {
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
