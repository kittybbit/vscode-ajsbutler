import type { AjsUnit } from "../models/ajs/AjsDocument";
import { type ScheduleCalendarContext } from "./ScheduleCalendar";
import { parseSchedulePeriod } from "./SchedulePeriod";
import {
  createSubstitutionAnalysis,
  hasScheduleSubstitution,
} from "./ScheduleSubstitutionAnalysis";
import { projectScheduleRules } from "./ScheduleProjectionRules";
import type {
  ScheduleEvidence,
  ScheduleInterpretation,
  ScheduleRuleInterpretation,
  ScheduleStatus,
} from "./ScheduleInterpretation";

export type ScheduleProjectionPeriod = Readonly<{ from: string; to: string }>;

export type ScheduleProjectionInput = Readonly<{
  interpretation: ScheduleInterpretation;
  period: ScheduleProjectionPeriod;
  calendarContext?: ScheduleCalendarContext;
}>;

export type ScheduleRun = {
  unitPath: string;
  unitName: string;
  rule: number;
  date: string;
  time: string;
};

export type ScheduleProjection = {
  unit: AjsUnit;
  status: ScheduleStatus;
  completeness: "complete" | "partial" | "none";
  runs: ScheduleRun[];
  rules: ScheduleRuleInterpretation[];
  evidence: ScheduleEvidence[];
};

type ValidSchedulePeriod = { from: Date; to: Date };

const projectionPeriodOrEmptyBounds = (
  period: ScheduleProjectionPeriod | undefined,
): ScheduleProjectionPeriod => {
  if (
    !period ||
    typeof period.from !== "string" ||
    typeof period.to !== "string"
  ) {
    return { from: "", to: "" };
  }
  return { from: period.from, to: period.to };
};

const parsePeriod = (
  period: ScheduleProjectionPeriod | undefined,
): ValidSchedulePeriod | undefined => {
  const bounds = projectionPeriodOrEmptyBounds(period);
  const parsed = parseSchedulePeriod(bounds);
  return parsed.kind === "valid"
    ? { from: parsed.fromDate, to: parsed.toDate }
    : undefined;
};

const addUtcDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 86_400_000);

const emptyProjection = (
  interpretation: ScheduleInterpretation,
  status: ScheduleProjection["status"],
  completeness: ScheduleProjection["completeness"],
): ScheduleProjection => ({
  unit: interpretation.unit,
  status,
  completeness,
  runs: [],
  rules: interpretation.rules,
  evidence: interpretation.rules.map((rule) => rule.evidence),
});

const unresolvedWholeRules = (
  interpretation: ScheduleInterpretation,
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

const isCompleteRule = (rule: ScheduleRuleInterpretation): boolean =>
  rule.status === "supported" || rule.status === "no-runs";

const scheduleDateRules = (
  rules: ScheduleRuleInterpretation[],
): ScheduleRuleInterpretation[] =>
  rules.filter((rule) => rule.parameter.key === "sd");

const completenessForRules = (
  rules: ScheduleRuleInterpretation[],
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
  rules: ScheduleRuleInterpretation[],
): ScheduleProjection["status"] => {
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
  runs: ScheduleRun[];
  rules: ScheduleRuleInterpretation[];
}): ScheduleProjection["status"] => {
  const complete = input.runs.length === 0 ? "no-runs" : "supported";
  return {
    complete,
    partial: "supported",
    none: incompleteStatus(input.rules),
  }[input.completeness] as ScheduleProjection["status"];
};

const summarizeScheduleProjection = (input: {
  interpretation: ScheduleInterpretation;
  projected: ReturnType<typeof projectScheduleRules>;
}): ScheduleProjection => {
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
  interpretation: ScheduleInterpretation;
  period: ValidSchedulePeriod;
  calendarContext: ScheduleProjectionInput["calendarContext"];
}): ScheduleProjection => {
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
  interpretation: ScheduleInterpretation;
  period: ScheduleProjectionPeriod | undefined;
  parsedPeriod: ValidSchedulePeriod | undefined;
}): ScheduleProjection | undefined =>
  !input.period || !input.parsedPeriod
    ? emptyProjection(input.interpretation, "invalid", "none")
    : undefined;

const zeroRunProjection = (
  interpretation: ScheduleInterpretation,
): ScheduleProjection | undefined =>
  interpretation.hasRuleZeroUndefined
    ? emptyProjection(interpretation, "no-runs", "complete")
    : undefined;

const earlyProjection = (input: {
  interpretation: ScheduleInterpretation;
  period: ScheduleProjectionPeriod | undefined;
  parsedPeriod: ValidSchedulePeriod | undefined;
}): ScheduleProjection | undefined =>
  invalidPeriodProjection(input) ?? zeroRunProjection(input.interpretation);

export const projectScheduleRuns = (
  input: ScheduleProjectionInput,
): ScheduleProjection => {
  const parsedPeriod = parsePeriod(input.period);
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
};
