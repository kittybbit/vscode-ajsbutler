import type { Unit, UnitParameter } from "../../domain/values/Unit";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import { isValidExplicitByteLengthValue } from "./syntaxDiagnosticScalarValidators";
import { parseExplicitDecimalInRange } from "./syntaxDiagnosticScalarValidators";
import { findParameter, findParameters } from "./syntaxDiagnosticUnitLookup";

export type UnitParameterDiagnosticRule = {
  key: string;
  message: string;
  isInvalid: (parameter: UnitParameter, unit: Unit) => boolean;
};

type ExplicitByteLengthRuleInput = {
  key: string;
  minimum: number;
  maximum: number;
  message: string;
};

type ExplicitDecimalRangeRuleInput = {
  key: string;
  minimum: number;
  maximum: number;
  message: string;
  options?: { allowNegative?: boolean };
};

export const buildDiagnostic = (
  parameter: UnitParameter,
  message: string,
): SyntaxDiagnosticDto => ({
  line: parameter.line ?? 1,
  column: parameter.column ?? 0,
  length: parameter.length ?? parameter.key.length,
  message,
  severity: "error" as const,
});

export const buildExplicitDecimalRangeRule = ({
  key,
  minimum,
  maximum,
  message,
  options = {},
}: ExplicitDecimalRangeRuleInput): UnitParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) =>
    parseExplicitDecimalInRange(parameter, minimum, maximum, options) ===
    undefined,
});

export const buildExplicitByteLengthRule = ({
  key,
  minimum,
  maximum,
  message,
}: ExplicitByteLengthRuleInput): UnitParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) =>
    !isValidExplicitByteLengthValue(parameter, minimum, maximum),
});

export const buildExplicitAllowedValuesRule = (
  key: string,
  allowedValues: ReadonlySet<string>,
  message: string,
): UnitParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) => !allowedValues.has(parameter.value),
});

export const buildRequiredParameterRule = (
  key: string,
  requiredKey: string,
  message: string,
): UnitParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (_parameter, unit) => !findParameter(unit, requiredKey),
});

export const collectRuleDiagnostics = (
  unit: Unit,
  rules: readonly UnitParameterDiagnosticRule[],
): SyntaxDiagnosticDto[] =>
  rules.flatMap((rule) => {
    const parameters = findParameters(unit, rule.key);
    return parameters.flatMap((parameter) =>
      rule.isInvalid(parameter, unit)
        ? [buildDiagnostic(parameter, rule.message)]
        : [],
    );
  });
