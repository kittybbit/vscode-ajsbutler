import type { AjsParameter } from "../../models/ajs/AjsDocument";
import { interpretScheduleDateValue } from "../../models/parameters/scheduleDateInterpreter";
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

type ValidPeriod = { from: Date; to: Date };

const toUtcDate = (value: string): Date | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return undefined;
  }
  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : undefined;
};

const parsePeriod = (
  period: SemanticDiffComparisonPeriod,
): ValidPeriod | undefined => {
  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from < to ? { from, to } : undefined;
};

const dateCandidates = (
  parameter: AjsParameter,
  period: ValidPeriod,
): string[] => {
  const parsed = interpretScheduleDateValue(parameter.value);
  if (!parsed || parsed.day.kind !== "calendar") {
    return [];
  }
  const day = String(parsed.day.value).padStart(2, "0");
  if (parsed.year !== undefined && parsed.month !== undefined) {
    return [
      `${String(parsed.year).padStart(4, "0")}-${String(parsed.month).padStart(2, "0")}-${day}`,
    ];
  }
  const years = Array.from(
    { length: period.to.getUTCFullYear() - period.from.getUTCFullYear() + 1 },
    (_, index) => period.from.getUTCFullYear() + index,
  );
  if (parsed.month !== undefined) {
    return years.map(
      (year) => `${year}-${String(parsed.month).padStart(2, "0")}-${day}`,
    );
  }
  return years.flatMap((year) =>
    Array.from(
      { length: 12 },
      (_, index) => `${year}-${String(index + 1).padStart(2, "0")}-${day}`,
    ),
  );
};

const isWithin = (date: Date, period: ValidPeriod): boolean =>
  date >= period.from && date < period.to;

const statusForRules = (
  rules: SemanticDiffScheduleRuleInterpretation[],
  hasRuleZeroUndefined: boolean,
): "complete" | "partial" | "none" => {
  if (hasRuleZeroUndefined) {
    return "complete";
  }
  const scheduleDateRules = rules.filter((rule) => rule.parameter.key === "sd");
  if (scheduleDateRules.length === 0) {
    return "none";
  }
  if (
    rules.every(
      (rule) => rule.status === "supported" || rule.status === "no-runs",
    )
  ) {
    return "complete";
  }
  return scheduleDateRules.some(
    (rule) => rule.status === "supported" || rule.status === "no-runs",
  )
    ? "partial"
    : "none";
};

const cloneRule = (
  rule: SemanticDiffScheduleRuleInterpretation,
  patch: Partial<SemanticDiffScheduleRuleInterpretation>,
): SemanticDiffScheduleRuleInterpretation => ({ ...rule, ...patch });

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
  const interpretation =
    "interpretation" in inputOrInterpretation
      ? inputOrInterpretation.interpretation
      : inputOrInterpretation;
  const period =
    "interpretation" in inputOrInterpretation
      ? inputOrInterpretation.period
      : periodInput;
  if (!period) {
    return {
      unit: interpretation.unit,
      status: "invalid",
      completeness: "none",
      runs: [],
      rules: interpretation.rules,
      evidence: interpretation.rules.map((rule) => rule.evidence),
    };
  }
  const parsedPeriod = parsePeriod(period);
  if (!parsedPeriod) {
    return {
      unit: interpretation.unit,
      status: "invalid",
      completeness: "none",
      runs: [],
      rules: interpretation.rules,
      evidence: interpretation.rules.map((rule) => rule.evidence),
    };
  }
  if (interpretation.hasRuleZeroUndefined) {
    return {
      unit: interpretation.unit,
      status: "no-runs",
      completeness: "complete",
      runs: [],
      rules: interpretation.rules,
      evidence: interpretation.rules.map((rule) => rule.evidence),
    };
  }

  const startTimes = new Map<number, SemanticDiffScheduleRuleInterpretation>();
  interpretation.startTimeRules.forEach((rule) => {
    // The first definition remains effective.  Keep an invalid first value in
    // the map as well, so a later duplicate cannot silently become effective.
    if (rule.rule !== undefined && !startTimes.has(rule.rule)) {
      startTimes.set(rule.rule, rule);
    }
  });
  const projectedRules = interpretation.rules.map((rule) => {
    if (
      rule.parameter.key !== "sd" ||
      rule.status !== "supported" ||
      !rule.date
    ) {
      return rule;
    }
    const startTime = startTimes.get(rule.rule ?? 1);
    const candidates = dateCandidates(rule.parameter, parsedPeriod);
    if (
      candidates.length === 0 ||
      candidates.every((candidate) => !toUtcDate(candidate))
    ) {
      return cloneRule(rule, {
        status: "invalid",
        reason: "invalid-calendar-day",
        evidence: {
          id: `schedule:sd:invalid-calendar-day:${rule.rule ?? rule.parameter.value}`,
          rawParameters: [
            rule.parameter,
            ...(startTime?.parameter ? [startTime.parameter] : []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (!startTime) {
      return cloneRule(rule, {
        status: "missing-context",
        reason: "missing-start-time",
        evidence: {
          id: `schedule:sd:missing-start-time:${rule.rule ?? 1}`,
          rawParameters: [
            rule.parameter,
            ...(startTime?.parameter ? [startTime.parameter] : []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (startTime.status !== "supported" || !startTime.startTime) {
      // The date is independently valid; retain its domain evidence and let
      // the invalid start-time rule carry the legacy unsupported item.
      return rule;
    }
    const runs = candidates
      .map((candidate) => ({ date: candidate, parsed: toUtcDate(candidate) }))
      .filter(
        (candidate): candidate is { date: string; parsed: Date } =>
          candidate.parsed !== undefined &&
          isWithin(candidate.parsed, parsedPeriod),
      )
      .map(({ date }) => ({
        unitPath: interpretation.unit.absolutePath,
        unitName: interpretation.unit.name,
        rule: rule.rule ?? 1,
        date,
        time: startTime.startTime!.value,
      }));
    return cloneRule(rule, {
      status: runs.length === 0 ? "no-runs" : "supported",
      evidence: {
        id: `schedule:sd:${runs.length === 0 ? "no-runs" : "supported"}:${rule.rule ?? 1}`,
        rawParameters: [rule.parameter, startTime.parameter],
        rule: rule.rule,
      },
    });
  });

  const runs: SemanticDiffScheduleRun[] = [];
  projectedRules.forEach((rule) => {
    if (
      rule.parameter.key !== "sd" ||
      rule.status !== "supported" ||
      !rule.date
    ) {
      return;
    }
    const startTime = startTimes.get(rule.rule ?? 1);
    if (
      !startTime ||
      startTime.status !== "supported" ||
      !startTime.startTime
    ) {
      return;
    }
    dateCandidates(rule.parameter, parsedPeriod).forEach((candidate) => {
      const date = toUtcDate(candidate);
      if (date && isWithin(date, parsedPeriod)) {
        runs.push({
          unitPath: interpretation.unit.absolutePath,
          unitName: interpretation.unit.name,
          rule: rule.rule ?? 1,
          date: candidate,
          time: startTime.startTime.value,
        });
      }
    });
  });
  const completeness = statusForRules(projectedRules, false);
  const status =
    completeness === "complete"
      ? runs.length === 0
        ? "no-runs"
        : "supported"
      : completeness === "partial"
        ? "supported"
        : projectedRules.some((rule) => rule.status === "invalid")
          ? "invalid"
          : projectedRules.some((rule) => rule.status === "missing-context")
            ? "missing-context"
            : "unsupported";
  return {
    unit: interpretation.unit,
    status,
    completeness,
    runs,
    rules: projectedRules,
    evidence: projectedRules.map((rule) => rule.evidence),
  };
}
