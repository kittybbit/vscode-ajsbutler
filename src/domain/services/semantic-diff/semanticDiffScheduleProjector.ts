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
import {
  operationalMonthDate,
  operationalMonthLength,
  isFullyQualifiedRelativeScheduleDate,
  isSyntacticallyInvalidRelativeScheduleDate,
  relativeScheduleDateRequiresContext,
  resolveOperationalMonth,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";

type ValidPeriod = { from: Date; to: Date };

type DateCandidateResult = {
  candidates: string[];
  invalid: boolean;
  deferred: boolean;
  contextInvalid?: boolean;
};

const createGregorianDate = (
  year: number,
  monthIndex: number,
  day: number,
): Date => {
  const date = new Date(Date.UTC(1970, 0, 1));
  date.setUTCFullYear(year, monthIndex, day);
  return date;
};

const toUtcDate = (value: string): Date | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return undefined;
  }
  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  const date = createGregorianDate(year, month - 1, day);
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : undefined;
};

const daysInGregorianMonth = (
  year: number,
  month: number,
): number | undefined => {
  if (month < 1 || month > 12) {
    return undefined;
  }
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

const formatDate = (year: number, month: number, day: number): string =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const relativeDateCandidates = (
  parsed: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
  context: SemanticDiffScheduleCalendarContext,
): DateCandidateResult => {
  if (parsed.year === undefined || parsed.month === undefined) {
    return { candidates: [], invalid: false, deferred: true };
  }
  if (parsed.month < 1 || parsed.month > 12) {
    return { candidates: [], invalid: true, deferred: false };
  }
  const operationalMonth = resolveOperationalMonth(
    context,
    parsed.year,
    parsed.month,
  );
  if (!operationalMonth) {
    return {
      candidates: [],
      invalid: true,
      deferred: false,
      contextInvalid: true,
    };
  }
  const length = operationalMonthLength(operationalMonth);
  if (parsed.day.kind === "relative") {
    const offset = parsed.day.value - 1;
    return offset < 0 || offset >= length
      ? { candidates: [], invalid: true, deferred: false }
      : {
          candidates: [
            formatDate(
              operationalMonthDate(operationalMonth, offset).getUTCFullYear(),
              operationalMonthDate(operationalMonth, offset).getUTCMonth() + 1,
              operationalMonthDate(operationalMonth, offset).getUTCDate(),
            ),
          ],
          invalid: false,
          deferred: false,
        };
  }
  if (parsed.day.kind === "backward" && parsed.day.prefix === "+") {
    const offset = parsed.day.offset ?? 0;
    return offset < 0 || offset >= length
      ? { candidates: [], invalid: true, deferred: false }
      : {
          candidates: [
            formatDate(
              operationalMonthDate(
                operationalMonth,
                length - 1 - offset,
              ).getUTCFullYear(),
              operationalMonthDate(
                operationalMonth,
                length - 1 - offset,
              ).getUTCMonth() + 1,
              operationalMonthDate(
                operationalMonth,
                length - 1 - offset,
              ).getUTCDate(),
            ),
          ],
          invalid: false,
          deferred: false,
        };
  }
  if (parsed.day.kind === "weekday" && parsed.day.prefix === "+") {
    const weekday = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
      parsed.day.weekday,
    );
    const matchingDates = Array.from({ length }, (_, offset) =>
      operationalMonthDate(operationalMonth, offset),
    ).filter((date) => date.getUTCDay() === weekday);
    if (parsed.day.occurrence === "b") {
      const date = matchingDates.at(-1);
      return date
        ? {
            candidates: [
              formatDate(
                date.getUTCFullYear(),
                date.getUTCMonth() + 1,
                date.getUTCDate(),
              ),
            ],
            invalid: false,
            deferred: false,
          }
        : { candidates: [], invalid: false, deferred: false };
    }
    const occurrence = parsed.day.occurrence ?? 1;
    if (occurrence < 1 || occurrence > 5) {
      return { candidates: [], invalid: true, deferred: false };
    }
    const date = matchingDates[occurrence - 1];
    return date
      ? {
          candidates: [
            formatDate(
              date.getUTCFullYear(),
              date.getUTCMonth() + 1,
              date.getUTCDate(),
            ),
          ],
          invalid: false,
          deferred: false,
        }
      : { candidates: [], invalid: false, deferred: false };
  }
  return { candidates: [], invalid: false, deferred: true };
};

const dateCandidates = (
  parameter: AjsParameter,
  period: ValidPeriod,
  calendarContext?: SemanticDiffScheduleCalendarContext,
): DateCandidateResult => {
  const parsed = interpretScheduleDateValue(parameter.value);
  if (!parsed) {
    return { candidates: [], invalid: true, deferred: false };
  }

  if (relativeScheduleDateRequiresContext(parsed)) {
    return calendarContext
      ? relativeDateCandidates(parsed, calendarContext)
      : { candidates: [], invalid: false, deferred: true };
  }

  if (
    parsed.year !== undefined &&
    parsed.month !== undefined &&
    parsed.day.kind === "backward" &&
    parsed.day.prefix === undefined
  ) {
    const days = daysInGregorianMonth(parsed.year, parsed.month);
    const offset = parsed.day.offset ?? 0;
    if (days === undefined || offset < 0 || offset >= days) {
      return { candidates: [], invalid: true, deferred: false };
    }
    return {
      candidates: [formatDate(parsed.year, parsed.month, days - offset)],
      invalid: false,
      deferred: false,
    };
  }

  if (
    parsed.year !== undefined &&
    parsed.month !== undefined &&
    parsed.day.kind === "weekday" &&
    parsed.day.prefix === ""
  ) {
    const days = daysInGregorianMonth(parsed.year, parsed.month);
    if (days === undefined) {
      return { candidates: [], invalid: true, deferred: false };
    }
    const weekday = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
      parsed.day.weekday,
    );
    const firstWeekday = createGregorianDate(
      parsed.year,
      parsed.month - 1,
      1,
    ).getUTCDay();
    if (parsed.day.occurrence === "b") {
      const lastWeekday = createGregorianDate(
        parsed.year,
        parsed.month - 1,
        days,
      ).getUTCDay();
      const day = days - ((lastWeekday - weekday + 7) % 7);
      return {
        candidates: [formatDate(parsed.year, parsed.month, day)],
        invalid: false,
        deferred: false,
      };
    }
    const occurrence = parsed.day.occurrence ?? 1;
    if (occurrence < 1 || occurrence > 5) {
      return { candidates: [], invalid: true, deferred: false };
    }
    const day = 1 + ((weekday - firstWeekday + 7) % 7) + (occurrence - 1) * 7;
    return day > days
      ? { candidates: [], invalid: false, deferred: false }
      : {
          candidates: [formatDate(parsed.year, parsed.month, day)],
          invalid: false,
          deferred: false,
        };
  }

  if (parsed.day.kind !== "calendar") {
    return { candidates: [], invalid: false, deferred: true };
  }
  const day = String(parsed.day.value).padStart(2, "0");
  if (parsed.year !== undefined && parsed.month !== undefined) {
    return {
      candidates: [
        `${String(parsed.year).padStart(4, "0")}-${String(parsed.month).padStart(2, "0")}-${day}`,
      ],
      invalid: false,
      deferred: false,
    };
  }
  const years = Array.from(
    { length: period.to.getUTCFullYear() - period.from.getUTCFullYear() + 1 },
    (_, index) => period.from.getUTCFullYear() + index,
  );
  if (parsed.month !== undefined) {
    return {
      candidates: years.map(
        (year) => `${year}-${String(parsed.month).padStart(2, "0")}-${day}`,
      ),
      invalid: false,
      deferred: false,
    };
  }
  return {
    candidates: years.flatMap((year) =>
      Array.from(
        { length: 12 },
        (_, index) => `${year}-${String(index + 1).padStart(2, "0")}-${day}`,
      ),
    ),
    invalid: false,
    deferred: false,
  };
};

const parsePeriod = (
  period: SemanticDiffComparisonPeriod,
): ValidPeriod | undefined => {
  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from < to ? { from, to } : undefined;
};

const projectedDateEvidenceId = (
  rule: SemanticDiffScheduleRuleInterpretation,
  runs: SemanticDiffScheduleRun[],
): string => {
  if (rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")) {
    return rule.evidence.id;
  }
  return `schedule:sd:${runs.length === 0 ? "no-runs" : "supported"}:${rule.rule ?? 1}`;
};

const invalidDateEvidenceId = (
  rule: SemanticDiffScheduleRuleInterpretation,
): string =>
  rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")
    ? rule.evidence.id
    : `schedule:sd:invalid-calendar-day:${rule.rule ?? rule.parameter.value}`;

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
  const calendarContext =
    "interpretation" in inputOrInterpretation
      ? inputOrInterpretation.calendarContext
      : undefined;
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
    if (rule.parameter.key === "jc" && calendarContext) {
      const selection = calendarContext.selection;
      return cloneRule(rule, {
        status: selection.status,
        reason:
          selection.status === "supported" ? undefined : "calendar-selection",
        evidence: {
          id: selection.evidenceId,
          rawParameters: [...selection.rawParameters],
          rule: rule.rule,
        },
      });
    }
    if (rule.parameter.key !== "sd" || !rule.date) {
      return rule;
    }
    const startTime = startTimes.get(rule.rule ?? 1);
    if (relativeScheduleDateRequiresContext(rule.date)) {
      if (isSyntacticallyInvalidRelativeScheduleDate(rule.date)) {
        return cloneRule(rule, {
          status: "invalid",
          reason: "invalid-calendar-day",
          evidence: {
            id: invalidDateEvidenceId(rule),
            rawParameters: [
              rule.parameter,
              ...(startTime?.parameter ? [startTime.parameter] : []),
            ],
            rule: rule.rule,
          },
        });
      }
      // Omitted year/month relative forms are not promoted by this slice.
      if (!isFullyQualifiedRelativeScheduleDate(rule.date)) {
        return rule;
      }
      if (!calendarContext) {
        return rule;
      }
      if (calendarContext.status !== "supported") {
        return cloneRule(rule, {
          status: calendarContext.status,
          reason: "calendar-selection",
          evidence: {
            id: calendarContext.evidenceId,
            rawParameters: [rule.parameter, ...calendarContext.rawParameters],
            rule: rule.rule,
          },
        });
      }
    } else if (rule.status !== "supported") {
      return rule;
    }
    const candidateResult = dateCandidates(
      rule.parameter,
      parsedPeriod,
      calendarContext,
    );
    const candidates = candidateResult.candidates;
    if (candidateResult.deferred) {
      return rule;
    }
    if (candidateResult.contextInvalid) {
      return cloneRule(rule, {
        status: "invalid",
        reason: "calendar-selection",
        evidence: {
          id: "schedule:calendar:invalid-base-or-conflict:sdd",
          rawParameters: [
            rule.parameter,
            ...(calendarContext?.rawParameters ?? []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (
      candidateResult.invalid ||
      (candidates.length > 0 &&
        candidates.every((candidate) => !toUtcDate(candidate)))
    ) {
      return cloneRule(rule, {
        status: "invalid",
        reason: "invalid-calendar-day",
        evidence: {
          id: invalidDateEvidenceId(rule),
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
          id: rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")
            ? rule.evidence.id
            : `schedule:sd:missing-start-time:${rule.rule ?? 1}`,
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
      reason: undefined,
      evidence: {
        id: projectedDateEvidenceId(rule, runs),
        rawParameters: [
          rule.parameter,
          startTime.parameter,
          ...(relativeScheduleDateRequiresContext(rule.date)
            ? (calendarContext?.rawParameters ?? [])
            : []),
        ],
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
    dateCandidates(
      rule.parameter,
      parsedPeriod,
      calendarContext,
    ).candidates.forEach((candidate) => {
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
