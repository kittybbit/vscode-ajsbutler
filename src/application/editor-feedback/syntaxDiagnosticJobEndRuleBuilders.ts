import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { Unit, UnitParameter } from "../../domain/values/Unit";
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
  unit: Unit,
  buildMessage: (retryParameterKey: string) => string,
): SyntaxDiagnosticDto[] =>
  jobEndJudgmentRetryParameterKeys.flatMap((retryParameterKey) => {
    const retryParameter = findParameter(unit, retryParameterKey);
    return retryParameter
      ? [buildDiagnostic(retryParameter, buildMessage(retryParameterKey))]
      : [];
  });

type OptionalParameterDiagnosticInput = {
  parameter: UnitParameter | undefined;
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
  unit: Unit;
  effectiveJobEndJudgment: string;
  effectiveAutomaticRetry: string;
  abrParameter: UnitParameter | undefined;
  warningThresholdParameter: UnitParameter | undefined;
  abnormalThresholdParameter: UnitParameter | undefined;
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
  unit: Unit,
  abrParameter: UnitParameter | undefined,
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
  unit: Unit,
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

const getJobEndJudgmentContext = (unit: Unit): JobEndJudgmentContext => {
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
  unit: Unit,
): SyntaxDiagnosticDto[] => {
  const context = getJobEndJudgmentContext(unit);

  return [
    ...collectRuleDiagnostics(unit, jobEndJudgmentNumericRangeRules),
    ...collectThresholdOrderingDiagnostics(context),
    ...collectJobEndJudgmentRetryGateDiagnostics(context),
  ];
};

export const buildJobEndJudgmentDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, jobEndJudgmentDiagnosticTargetTypes).flatMap(
    buildJobEndJudgmentDiagnosticsForUnit,
  );
