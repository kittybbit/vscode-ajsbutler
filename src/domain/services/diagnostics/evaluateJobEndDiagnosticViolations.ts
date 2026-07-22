import {
  findAjsUnitParameter,
  findAjsUnitParameters,
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import { DEFAULTS } from "../../models/parameters/Defaults";
import {
  retryAbrDependencyViolationReasons,
  type DiagnosticViolation,
  type RetryAbrDependencyViolationReason,
} from "./DiagnosticViolation";
import { diagnosticRuleIds } from "./DiagnosticRuleId";
import {
  hasInvalidExplicitThresholdOrdering,
  parseExplicitJobEndDecimalInRange,
} from "./JobEndDiagnosticRules";

export const jobEndRangeViolationReasons = {
  invalidWarningThreshold: "invalid-warning-threshold",
  invalidAbnormalThreshold: "invalid-abnormal-threshold",
  invalidRetryStartCode: "invalid-retry-start-code",
  invalidRetryEndCode: "invalid-retry-end-code",
  invalidRetryCount: "invalid-retry-count",
  invalidRetryInterval: "invalid-retry-interval",
} as const;

export type JobEndRangeViolationReason =
  (typeof jobEndRangeViolationReasons)[keyof typeof jobEndRangeViolationReasons];

export const jobEndThresholdViolationReasons = {
  warningNotLessThanAbnormal: "warning-not-less-than-abnormal",
  abnormalNotGreaterThanWarning: "abnormal-not-greater-than-warning",
} as const;

export type JobEndThresholdViolationReason =
  (typeof jobEndThresholdViolationReasons)[keyof typeof jobEndThresholdViolationReasons];

export type JobEndDiagnosticViolationReason =
  | JobEndRangeViolationReason
  | JobEndThresholdViolationReason
  | RetryAbrDependencyViolationReason;

export type JobEndDiagnosticViolation =
  DiagnosticViolation<JobEndDiagnosticViolationReason>;

type JobEndRangeRule = Readonly<{
  key: string;
  minimum: number;
  maximum: number;
  reason: JobEndRangeViolationReason;
}>;

const jobEndDiagnosticTargetTypes = new Set([
  "j",
  "rj",
  "pj",
  "rp",
  "cj",
  "rcj",
  "qj",
  "rq",
]);

const retryParameterKeys = ["rjs", "rje", "rec", "rei"] as const;

const jobEndRangeRules: readonly JobEndRangeRule[] = [
  {
    key: "wth",
    minimum: 0,
    maximum: 2147483647,
    reason: jobEndRangeViolationReasons.invalidWarningThreshold,
  },
  {
    key: "tho",
    minimum: 0,
    maximum: 2147483647,
    reason: jobEndRangeViolationReasons.invalidAbnormalThreshold,
  },
  {
    key: "rjs",
    minimum: 1,
    maximum: 4294967295,
    reason: jobEndRangeViolationReasons.invalidRetryStartCode,
  },
  {
    key: "rje",
    minimum: 1,
    maximum: 4294967295,
    reason: jobEndRangeViolationReasons.invalidRetryEndCode,
  },
  {
    key: "rec",
    minimum: 1,
    maximum: 12,
    reason: jobEndRangeViolationReasons.invalidRetryCount,
  },
  {
    key: "rei",
    minimum: 1,
    maximum: 10,
    reason: jobEndRangeViolationReasons.invalidRetryInterval,
  },
];

const buildJobEndViolation = (
  ruleId: JobEndDiagnosticViolation["ruleId"],
  reason: JobEndDiagnosticViolationReason,
  evidence: AjsParameter,
): JobEndDiagnosticViolation => ({ ruleId, reason, evidence });

const evaluateJobEndRangeViolations = (
  unit: AjsUnit,
): JobEndDiagnosticViolation[] =>
  jobEndRangeRules.flatMap((rule) =>
    findAjsUnitParameters(unit, rule.key).flatMap((parameter) =>
      parseExplicitJobEndDecimalInRange(
        parameter,
        rule.minimum,
        rule.maximum,
      ) === undefined
        ? [
            buildJobEndViolation(
              diagnosticRuleIds.jobEndRange,
              rule.reason,
              parameter,
            ),
          ]
        : [],
    ),
  );

const evaluateThresholdOrderingViolations = (
  unit: AjsUnit,
  effectiveJobEndJudgment: string,
): JobEndDiagnosticViolation[] => {
  if (
    effectiveJobEndJudgment !== DEFAULTS.Jd ||
    !hasInvalidExplicitThresholdOrdering(unit)
  ) {
    return [];
  }

  const warningThreshold = findAjsUnitParameter(unit, "wth");
  const abnormalThreshold = findAjsUnitParameter(unit, "tho");
  return [
    ...(warningThreshold
      ? [
          buildJobEndViolation(
            diagnosticRuleIds.jobEndThreshold,
            jobEndThresholdViolationReasons.warningNotLessThanAbnormal,
            warningThreshold,
          ),
        ]
      : []),
    ...(abnormalThreshold
      ? [
          buildJobEndViolation(
            diagnosticRuleIds.jobEndThreshold,
            jobEndThresholdViolationReasons.abnormalNotGreaterThanWarning,
            abnormalThreshold,
          ),
        ]
      : []),
  ];
};

const collectRetryParameterViolations = (
  unit: AjsUnit,
  reason: RetryAbrDependencyViolationReason,
): JobEndDiagnosticViolation[] =>
  retryParameterKeys.flatMap((key) => {
    const parameter = findAjsUnitParameter(unit, key);
    return parameter
      ? [
          buildJobEndViolation(
            diagnosticRuleIds.retryAbrDependency,
            reason,
            parameter,
          ),
        ]
      : [];
  });

const evaluateRetryDependencyViolations = (
  unit: AjsUnit,
  effectiveJobEndJudgment: string,
  effectiveAutomaticRetry: string,
  automaticRetryParameter: AjsParameter | undefined,
): JobEndDiagnosticViolation[] => {
  if (effectiveJobEndJudgment !== DEFAULTS.Jd) {
    return [
      ...(automaticRetryParameter?.value === "y"
        ? [
            buildJobEndViolation(
              diagnosticRuleIds.retryAbrDependency,
              retryAbrDependencyViolationReasons.automaticRetryRequiresCodeEndJudgment,
              automaticRetryParameter,
            ),
          ]
        : []),
      ...collectRetryParameterViolations(
        unit,
        retryAbrDependencyViolationReasons.retryParameterRequiresCodeEndJudgment,
      ),
    ];
  }

  return effectiveAutomaticRetry === "y"
    ? []
    : collectRetryParameterViolations(
        unit,
        retryAbrDependencyViolationReasons.retryParameterRequiresAutomaticRetry,
      );
};

const evaluateJobEndViolationsForUnit = (
  unit: AjsUnit,
): JobEndDiagnosticViolation[] => {
  const automaticRetryParameter = findAjsUnitParameter(unit, "abr");
  const effectiveJobEndJudgment =
    findAjsUnitParameter(unit, "jd")?.value ?? DEFAULTS.Jd;
  const effectiveAutomaticRetry =
    automaticRetryParameter?.value ?? DEFAULTS.Abr;

  return [
    ...evaluateJobEndRangeViolations(unit),
    ...evaluateThresholdOrderingViolations(unit, effectiveJobEndJudgment),
    ...evaluateRetryDependencyViolations(
      unit,
      effectiveJobEndJudgment,
      effectiveAutomaticRetry,
      automaticRetryParameter,
    ),
  ];
};

const isJobEndDiagnosticTarget = (unit: AjsUnit): boolean => {
  const explicitUnitType = findAjsUnitParameter(unit, "ty")?.value;
  return explicitUnitType
    ? jobEndDiagnosticTargetTypes.has(explicitUnitType)
    : false;
};

export const evaluateJobEndDiagnosticViolations = (
  document: AjsDocument,
): JobEndDiagnosticViolation[] =>
  flattenAjsUnits(document.rootUnits)
    .filter(isJobEndDiagnosticTarget)
    .flatMap(evaluateJobEndViolationsForUnit);
