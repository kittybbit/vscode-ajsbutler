import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import { isValidExplicitByteLengthValue } from "./syntaxDiagnosticScalarValidators";
import { parseExplicitDecimalInRange } from "./syntaxDiagnosticScalarValidators";
import { findParameter, findParameters } from "./syntaxDiagnosticUnitLookup";

export type AjsParameterDiagnosticRule = {
  key: string;
  message: string;
  isInvalid: (parameter: AjsParameter, unit: AjsUnit) => boolean;
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
  parameter: AjsParameter,
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
}: ExplicitDecimalRangeRuleInput): AjsParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) =>
    parseExplicitDecimalInRange({ parameter, minimum, maximum, options }) ===
    undefined,
});

export const buildExplicitByteLengthRule = ({
  key,
  minimum,
  maximum,
  message,
}: ExplicitByteLengthRuleInput): AjsParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) =>
    !isValidExplicitByteLengthValue(parameter, minimum, maximum),
});

export const buildExplicitAllowedValuesRule = (
  key: string,
  allowedValues: ReadonlySet<string>,
  message: string,
): AjsParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (parameter) => !allowedValues.has(parameter.value),
});

export const buildRequiredParameterRule = (
  key: string,
  requiredKey: string,
  message: string,
): AjsParameterDiagnosticRule => ({
  key,
  message,
  isInvalid: (_parameter, unit) => !findParameter(unit, requiredKey),
});

export const collectRuleDiagnostics = (
  unit: AjsUnit,
  rules: readonly AjsParameterDiagnosticRule[],
): SyntaxDiagnosticDto[] =>
  rules.flatMap((rule) => {
    const parameters = findParameters(unit, rule.key);
    return parameters.flatMap((parameter) =>
      rule.isInvalid(parameter, unit)
        ? [buildDiagnostic(parameter, rule.message)]
        : [],
    );
  });
