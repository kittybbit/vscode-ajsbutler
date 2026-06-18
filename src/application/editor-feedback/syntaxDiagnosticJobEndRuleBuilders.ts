import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
} from "./syntaxDiagnosticCore";
import { hasInvalidExplicitThresholdOrdering } from "./syntaxDiagnosticJobEndRules";
import { findParameter, findUnitsByTypes } from "./syntaxDiagnosticUnitLookup";
import {
  jobEndJudgmentDiagnosticTargetTypes,
  jobEndJudgmentRetryParameterKeys,
} from "./syntaxDiagnosticTargetTypes";
import { jobEndJudgmentNumericRangeRules } from "./syntaxDiagnosticRuleSets";

const collectRetryParameterDiagnostics = (
  unit: AjsUnit,
  buildMessage: (retryParameterKey: string) => string,
): SyntaxDiagnosticDto[] =>
  jobEndJudgmentRetryParameterKeys.flatMap((retryParameterKey) => {
    const retryParameter = findParameter(unit, retryParameterKey);
    return retryParameter
      ? [buildDiagnostic(retryParameter, buildMessage(retryParameterKey))]
      : [];
  });

type OptionalParameterDiagnosticInput = {
  parameter: AjsParameter | undefined;
  message: string;
};

const collectOptionalParameterDiagnostics = (
  inputs: readonly OptionalParameterDiagnosticInput[],
): SyntaxDiagnosticDto[] =>
  inputs.flatMap(({ parameter, message }) =>
    parameter ? [buildDiagnostic(parameter, message)] : [],
  );

const shouldCheckThresholdOrdering = ({
  unit,
  effectiveJobEndJudgment,
}: JobEndJudgmentContext): boolean =>
  effectiveJobEndJudgment === DEFAULTS.Jd &&
  hasInvalidExplicitThresholdOrdering(unit);

type JobEndJudgmentContext = {
  unit: AjsUnit;
  effectiveJobEndJudgment: string;
  effectiveAutomaticRetry: string;
  abrParameter: AjsParameter | undefined;
  warningThresholdParameter: AjsParameter | undefined;
  abnormalThresholdParameter: AjsParameter | undefined;
};

const collectThresholdOrderingDiagnostics = (
  context: JobEndJudgmentContext,
): SyntaxDiagnosticDto[] => {
  if (!shouldCheckThresholdOrdering(context)) {
    return [];
  }

  return collectOptionalParameterDiagnostics([
    {
      parameter: context.warningThresholdParameter,
      message:
        "Warning threshold (wth) must be less than abnormal threshold (tho).",
    },
    {
      parameter: context.abnormalThresholdParameter,
      message:
        "Abnormal threshold (tho) must be greater than warning threshold (wth).",
    },
  ]);
};

const collectInvalidEndJudgmentRetryDiagnostics = (
  unit: AjsUnit,
  abrParameter: AjsParameter | undefined,
): SyntaxDiagnosticDto[] => [
  ...(abrParameter?.value === "y"
    ? [
        buildDiagnostic(
          abrParameter,
          "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
        ),
      ]
    : []),
  ...collectRetryParameterDiagnostics(
    unit,
    (retryParameterKey) =>
      `Retry parameter (${retryParameterKey}) requires end judgment (jd) to be cod.`,
  ),
];

const collectAutomaticRetryDisabledDiagnostics = (
  unit: AjsUnit,
): SyntaxDiagnosticDto[] =>
  collectRetryParameterDiagnostics(
    unit,
    (retryParameterKey) =>
      `Retry parameter (${retryParameterKey}) requires automatic retry (abr) to be y.`,
  );

const collectJobEndJudgmentRetryGateDiagnostics = (
  context: JobEndJudgmentContext,
): SyntaxDiagnosticDto[] => {
  if (context.effectiveJobEndJudgment !== DEFAULTS.Jd) {
    return collectInvalidEndJudgmentRetryDiagnostics(
      context.unit,
      context.abrParameter,
    );
  }

  return context.effectiveAutomaticRetry === "y"
    ? []
    : collectAutomaticRetryDisabledDiagnostics(context.unit);
};

const getJobEndJudgmentContext = (unit: AjsUnit): JobEndJudgmentContext => {
  const abrParameter = findParameter(unit, "abr");
  return {
    unit,
    effectiveJobEndJudgment: findParameter(unit, "jd")?.value ?? DEFAULTS.Jd,
    effectiveAutomaticRetry: abrParameter?.value ?? DEFAULTS.Abr,
    abrParameter,
    warningThresholdParameter: findParameter(unit, "wth"),
    abnormalThresholdParameter: findParameter(unit, "tho"),
  };
};

const buildJobEndJudgmentDiagnosticsForUnit = (
  unit: AjsUnit,
): SyntaxDiagnosticDto[] => {
  const context = getJobEndJudgmentContext(unit);

  return [
    ...collectRuleDiagnostics(unit, jobEndJudgmentNumericRangeRules),
    ...collectThresholdOrderingDiagnostics(context),
    ...collectJobEndJudgmentRetryGateDiagnostics(context),
  ];
};

export const buildJobEndJudgmentDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(document, jobEndJudgmentDiagnosticTargetTypes).flatMap(
    buildJobEndJudgmentDiagnosticsForUnit,
  );
