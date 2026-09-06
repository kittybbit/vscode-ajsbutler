import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffScheduleRun,
} from "../../models/semantic-diff/SemanticDiff";
import type {
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleProjection,
  SemanticDiffScheduleProjectionInput,
  SemanticDiffScheduleRuleInterpretation,
} from "./semanticDiffScheduleTypes";
import {
  createSubstitutionAnalysis,
  hasScheduleSubstitution,
} from "./semanticDiffScheduleSubstitutionAnalysis";
import { projectScheduleRules } from "./semanticDiffScheduleRuleProjection";
import { toUtcDate } from "./semanticDiffScheduleDateMath";
import type { ValidSchedulePeriod } from "./semanticDiffScheduleCandidateTypes";

const parsePeriod = (
  period: SemanticDiffComparisonPeriod,
): ValidSchedulePeriod | undefined => {
  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from < to ? { from, to } : undefined;
};

const addUtcDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 86_400_000);

const projectionInput = (
  inputOrInterpretation:
    | SemanticDiffScheduleProjectionInput
    | SemanticDiffScheduleInterpretation,
  periodInput?: SemanticDiffComparisonPeriod,
): {
  interpretation: SemanticDiffScheduleInterpretation;
  period: SemanticDiffComparisonPeriod | undefined;
  calendarContext: SemanticDiffScheduleProjectionInput["calendarContext"];
} =>
  "interpretation" in inputOrInterpretation
    ? {
        interpretation: inputOrInterpretation.interpretation,
        period: inputOrInterpretation.period,
        calendarContext: inputOrInterpretation.calendarContext,
      }
    : {
        interpretation: inputOrInterpretation,
        period: periodInput,
        calendarContext: undefined,
      };

const emptyProjection = (
  interpretation: SemanticDiffScheduleInterpretation,
  status: SemanticDiffScheduleProjection["status"],
  completeness: SemanticDiffScheduleProjection["completeness"],
): SemanticDiffScheduleProjection => ({
  unit: interpretation.unit,
  status,
  completeness,
  runs: [],
  rules: interpretation.rules,
  evidence: interpretation.rules.map((rule) => rule.evidence),
});

const unresolvedWholeRules = (
  interpretation: SemanticDiffScheduleInterpretation,
): Set<number> =>
  new Set(
    interpretation.rules
      .filter(
        (rule) => rule.parameter.key === "cy" || rule.parameter.key === "cftd",
      )
      .map(
        (rule) =>
          rule.rule ??
          Number(/^([0-9]{1,3}),/.exec(rule.parameter.value)?.[1] ?? "1"),
      ),
  );

const candidatePeriod = (input: {
  period: ValidSchedulePeriod;
  substitutions: ReturnType<typeof createSubstitutionAnalysis>;
}): ValidSchedulePeriod =>
  hasScheduleSubstitution(input.substitutions)
    ? {
        from: addUtcDays(input.period.from, -31),
        to: addUtcDays(input.period.to, 31),
      }
    : input.period;

const isCompleteRule = (
  rule: SemanticDiffScheduleRuleInterpretation,
): boolean => rule.status === "supported" || rule.status === "no-runs";

const scheduleDateRules = (
  rules: SemanticDiffScheduleRuleInterpretation[],
): SemanticDiffScheduleRuleInterpretation[] =>
  rules.filter((rule) => rule.parameter.key === "sd");

const completenessForRules = (
  rules: SemanticDiffScheduleRuleInterpretation[],
): "complete" | "partial" | "none" => {
  const dates = scheduleDateRules(rules);
  const complete = rules.every(isCompleteRule);
  const partial = dates.some(isCompleteRule);
  const key = `${dates.length > 0}-${complete}-${partial}`;
  return {
    "false-false-false": "none",
    "false-true-false": "none",
    "false-false-true": "none",
    "false-true-true": "none",
    "true-true-true": "complete",
    "true-true-false": "complete",
    "true-false-true": "partial",
    "true-false-false": "none",
  }[key] as "complete" | "partial" | "none";
};

const incompleteStatus = (
  rules: SemanticDiffScheduleRuleInterpretation[],
): SemanticDiffScheduleProjection["status"] => {
  const invalid = rules.some((rule) => rule.status === "invalid");
  const missing = rules.some((rule) => rule.status === "missing-context");
  const key = `${invalid}-${missing}` as
    | "true-true"
    | "true-false"
    | "false-true"
    | "false-false";
  return (
    {
      "true-true": "invalid",
      "true-false": "invalid",
      "false-true": "missing-context",
      "false-false": "unsupported",
    } as const
  )[key];
};

const projectionStatus = (input: {
  completeness: "complete" | "partial" | "none";
  runs: SemanticDiffScheduleRun[];
  rules: SemanticDiffScheduleRuleInterpretation[];
}): SemanticDiffScheduleProjection["status"] => {
  const complete = input.runs.length === 0 ? "no-runs" : "supported";
  return {
    complete,
    partial: "supported",
    none: incompleteStatus(input.rules),
  }[input.completeness] as SemanticDiffScheduleProjection["status"];
};

const summarizeScheduleProjection = (input: {
  interpretation: SemanticDiffScheduleInterpretation;
  projected: ReturnType<typeof projectScheduleRules>;
}): SemanticDiffScheduleProjection => {
  const completeness = input.interpretation.hasRuleZeroUndefined
    ? "complete"
    : completenessForRules(input.projected.rules);
  return {
    unit: input.interpretation.unit,
    status: projectionStatus({
      completeness,
      runs: input.projected.runs,
      rules: input.projected.rules,
    }),
    completeness,
    runs: input.projected.runs,
    rules: input.projected.rules,
    evidence: input.projected.rules.map((rule) => rule.evidence),
  };
};

const projectValidatedSchedule = (input: {
  interpretation: SemanticDiffScheduleInterpretation;
  period: ValidSchedulePeriod;
  calendarContext: SemanticDiffScheduleProjectionInput["calendarContext"];
}): SemanticDiffScheduleProjection => {
  const substitutions = createSubstitutionAnalysis(input.interpretation);
  const projected = projectScheduleRules({
    interpretation: input.interpretation,
    parsedPeriod: input.period,
    candidatePeriod: candidatePeriod({
      period: input.period,
      substitutions,
    }),
    calendarContext: input.calendarContext,
    substitutions,
    unresolvedWholeRules: unresolvedWholeRules(input.interpretation),
  });
  return summarizeScheduleProjection({
    interpretation: input.interpretation,
    projected,
  });
};

const invalidPeriodProjection = (input: {
  interpretation: SemanticDiffScheduleInterpretation;
  period: SemanticDiffComparisonPeriod | undefined;
  parsedPeriod: ValidSchedulePeriod | undefined;
}): SemanticDiffScheduleProjection | undefined =>
  !input.period || !input.parsedPeriod
    ? emptyProjection(input.interpretation, "invalid", "none")
    : undefined;

const zeroRunProjection = (
  interpretation: SemanticDiffScheduleInterpretation,
): SemanticDiffScheduleProjection | undefined =>
  interpretation.hasRuleZeroUndefined
    ? emptyProjection(interpretation, "no-runs", "complete")
    : undefined;

const earlyProjection = (input: {
  interpretation: SemanticDiffScheduleInterpretation;
  period: SemanticDiffComparisonPeriod | undefined;
  parsedPeriod: ValidSchedulePeriod | undefined;
}): SemanticDiffScheduleProjection | undefined =>
  invalidPeriodProjection(input) ?? zeroRunProjection(input.interpretation);

/** Project one interpreted unit over a validated, half-open period. */
export function projectScheduleRuns(
  input: SemanticDiffScheduleProjectionInput,
): SemanticDiffScheduleProjection;
export function projectScheduleRuns(
  interpretation: SemanticDiffScheduleInterpretation,
  period: SemanticDiffComparisonPeriod,
): SemanticDiffScheduleProjection;
export function projectScheduleRuns(
  inputOrInterpretation:
    | SemanticDiffScheduleProjectionInput
    | SemanticDiffScheduleInterpretation,
  periodInput?: SemanticDiffComparisonPeriod,
): SemanticDiffScheduleProjection {
  const input = projectionInput(inputOrInterpretation, periodInput);
  const parsedPeriod = input.period ? parsePeriod(input.period) : undefined;
  const early = earlyProjection({
    interpretation: input.interpretation,
    period: input.period,
    parsedPeriod,
  });
  return (
    early ??
    projectValidatedSchedule({
      interpretation: input.interpretation,
      period: parsedPeriod!,
      calendarContext: input.calendarContext,
    })
  );
}
