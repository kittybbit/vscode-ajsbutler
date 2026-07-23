import {
  findAjsUnitParameters,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import {
  parseScheduleDateValue,
  parseStartTimeValue,
} from "../../models/parameters/scheduleRuleHelpers";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffScheduleRun,
} from "../../models/semantic-diff/SemanticDiff";
import type { SemanticDiffUnitMatch } from "./semanticDiffStructuralRules";

export type SemanticDiffScheduleMatchedUnit = Pick<
  SemanticDiffUnitMatch,
  "before" | "after"
>;

export type SemanticDiffScheduleSide = "before" | "after";

export type SemanticDiffScheduleUnsupportedReason =
  | "cycle-schedule"
  | "closed-day-substitution"
  | "shift-days"
  | "calendar-selection"
  | "inherited-parent-rule"
  | "days-from-start"
  | "invalid-start-time"
  | "unpaired-start-time"
  | "unsupported-schedule-date"
  | "missing-start-time"
  | "invalid-calendar-day";

export type SemanticDiffScheduleUnsupportedDecision = {
  side: SemanticDiffScheduleSide;
  unit: AjsUnit;
  parameter: AjsParameter;
  reason: SemanticDiffScheduleUnsupportedReason;
  scheduleRule?: number;
};

export type SemanticDiffScheduleRunDecision =
  | {
      kind: "changed-time";
      unitPath: string;
      date: string;
      before: SemanticDiffScheduleRun;
      after: SemanticDiffScheduleRun;
    }
  | {
      kind: "removed";
      unitPath: string;
      date: string;
      before: SemanticDiffScheduleRun;
    }
  | {
      kind: "added";
      unitPath: string;
      date: string;
      after: SemanticDiffScheduleRun;
    };

export type SemanticDiffScheduleEvaluation =
  | {
      kind: "not-requested";
    }
  | {
      kind: "invalid-period";
      period: SemanticDiffComparisonPeriod;
    }
  | {
      kind: "evaluated";
      period: SemanticDiffComparisonPeriod;
      runDecisions: SemanticDiffScheduleRunDecision[];
      unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
      zeroRunCandidates: AjsUnit[];
    };

export type EvaluateSemanticDiffScheduleInput = {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  matches: SemanticDiffScheduleMatchedUnit[];
  period?: SemanticDiffComparisonPeriod;
};

type ValidPeriod = {
  from: Date;
  to: Date;
  display: SemanticDiffComparisonPeriod;
};

type ScheduleCollection = {
  runs: SemanticDiffScheduleRun[];
  unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[];
  zeroRunCandidates: AjsUnit[];
};

const jobnetTypes = new Set(["n", "rn", "rm", "rr"]);
const scheduleParameterKeys = new Set([
  "sd",
  "st",
  "cy",
  "sh",
  "shd",
  "sc",
  "ln",
  "cftd",
]);
const unsupportedScheduleParameterReasons = new Map<
  string,
  SemanticDiffScheduleUnsupportedReason
>([
  ["cy", "cycle-schedule"],
  ["sh", "closed-day-substitution"],
  ["shd", "shift-days"],
  ["sc", "calendar-selection"],
  ["ln", "inherited-parent-rule"],
  ["cftd", "days-from-start"],
]);

const compareStrings = (left: string, right: string): number =>
  left.localeCompare(right);

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
  return from && to && from.getTime() < to.getTime()
    ? { from, to, display: period }
    : undefined;
};

const isJobnetUnit = (unit: AjsUnit): boolean => jobnetTypes.has(unit.unitType);

const hasDirectScheduleParameters = (unit: AjsUnit): boolean =>
  unit.parameters.some((parameter) => scheduleParameterKeys.has(parameter.key));

const isNormalStartTime = (value: string): boolean => {
  const matched = /^(\d{2}):(\d{2})$/.exec(value);
  return !!matched && Number(matched[1]) < 24 && Number(matched[2]) < 60;
};

const firstParameterByParsedRule = (
  parameters: AjsParameter[],
): Map<number, AjsParameter> => {
  const byRule = new Map<number, AjsParameter>();
  parameters.forEach((parameter) => {
    const parsed = parseStartTimeValue(parameter.value);
    if (parsed && !byRule.has(parsed.rule)) {
      byRule.set(parsed.rule, parameter);
    }
  });
  return byRule;
};

const parsedRuleSet = (
  parameters: AjsParameter[],
  parse: (value: string) => { rule: number } | undefined,
): Set<number> =>
  new Set(
    parameters
      .map((parameter) => parse(parameter.value)?.rule)
      .filter((rule): rule is number => rule !== undefined),
  );

const unsupportedScheduleParameterDecisions = (
  side: SemanticDiffScheduleSide,
  unit: AjsUnit,
): SemanticDiffScheduleUnsupportedDecision[] =>
  unit.parameters
    .filter((parameter) =>
      unsupportedScheduleParameterReasons.has(parameter.key),
    )
    .map((parameter) => ({
      side,
      unit,
      parameter,
      reason: unsupportedScheduleParameterReasons.get(parameter.key)!,
    }));

const unsupportedStartTimeDecisions = (
  side: SemanticDiffScheduleSide,
  unit: AjsUnit,
): SemanticDiffScheduleUnsupportedDecision[] =>
  findAjsUnitParameters(unit, "st")
    .filter((parameter) => {
      const parsed = parseStartTimeValue(parameter.value);
      return !parsed || !isNormalStartTime(parsed.value);
    })
    .map((parameter) => ({
      side,
      unit,
      parameter,
      reason: "invalid-start-time",
    }));

const unsupportedUnpairedStartTimeDecisions = (
  side: SemanticDiffScheduleSide,
  unit: AjsUnit,
): SemanticDiffScheduleUnsupportedDecision[] => {
  const scheduleDateRules = parsedRuleSet(
    findAjsUnitParameters(unit, "sd"),
    parseScheduleDateValue,
  );
  return findAjsUnitParameters(unit, "st")
    .filter((parameter) => {
      const parsed = parseStartTimeValue(parameter.value);
      return (
        parsed &&
        isNormalStartTime(parsed.value) &&
        !scheduleDateRules.has(parsed.rule)
      );
    })
    .map((parameter) => ({
      side,
      unit,
      parameter,
      reason: "unpaired-start-time",
    }));
};

const explicitDateCandidates = (
  rawDateValue: string,
  period: ValidPeriod,
): string[] => {
  const parsed = parseScheduleDateValue(rawDateValue);
  if (!parsed || !parsed.day || !/^\d{2}$/.test(parsed.day)) {
    return [];
  }

  const yearMonth = parsed.yearMonth?.slice(0, -1);
  if (yearMonth?.length === 7) {
    return [`${yearMonth}-${parsed.day}`.replace(/\//g, "-")];
  }

  if (yearMonth?.length === 2) {
    const dates: string[] = [];
    for (
      let year = period.from.getUTCFullYear();
      year <= period.to.getUTCFullYear();
      year += 1
    ) {
      dates.push(`${year}-${yearMonth}-${parsed.day}`);
    }
    return dates;
  }

  const dates: string[] = [];
  for (
    let year = period.from.getUTCFullYear();
    year <= period.to.getUTCFullYear();
    year += 1
  ) {
    for (let month = 1; month <= 12; month += 1) {
      dates.push(`${year}-${String(month).padStart(2, "0")}-${parsed.day}`);
    }
  }
  return dates;
};

const isDateInPeriod = (dateValue: string, period: ValidPeriod): boolean => {
  const date = toUtcDate(dateValue);
  return !!date && date.getTime() >= period.from.getTime() && date < period.to;
};

const createRunsForScheduleDate = (
  unit: AjsUnit,
  scheduleDate: AjsParameter,
  startTimeByRule: Map<number, AjsParameter>,
  period: ValidPeriod,
): SemanticDiffScheduleRun[] => {
  const parsedDate = parseScheduleDateValue(scheduleDate.value);
  const startTime = parsedDate
    ? startTimeByRule.get(parsedDate.rule)
    : undefined;
  const parsedStartTime = startTime
    ? parseStartTimeValue(startTime.value)
    : undefined;

  if (
    !parsedDate ||
    !startTime ||
    !parsedStartTime ||
    !isNormalStartTime(parsedStartTime.value)
  ) {
    return [];
  }

  return explicitDateCandidates(scheduleDate.value, period)
    .filter((date) => isDateInPeriod(date, period))
    .map((date) => ({
      unitPath: unit.absolutePath,
      unitName: unit.name,
      rule: parsedDate.rule,
      date,
      time: parsedStartTime.value,
    }));
};

const unsupportedScheduleDateDecision = (
  side: SemanticDiffScheduleSide,
  unit: AjsUnit,
  parameter: AjsParameter,
  startTimeByRule: Map<number, AjsParameter>,
  period: ValidPeriod,
): SemanticDiffScheduleUnsupportedDecision | undefined => {
  const parsedDate = parseScheduleDateValue(parameter.value);
  if (!parsedDate || !parsedDate.day || !/^\d{2}$/.test(parsedDate.day)) {
    return {
      side,
      unit,
      parameter,
      reason: "unsupported-schedule-date",
    };
  }

  if (!startTimeByRule.has(parsedDate.rule)) {
    return {
      side,
      unit,
      parameter,
      reason: "missing-start-time",
      scheduleRule: parsedDate.rule,
    };
  }

  if (
    explicitDateCandidates(parameter.value, period).every(
      (date) => !toUtcDate(date),
    )
  ) {
    return {
      side,
      unit,
      parameter,
      reason: "invalid-calendar-day",
    };
  }

  return undefined;
};

const collectScheduleSide = (
  side: SemanticDiffScheduleSide,
  units: AjsUnit[],
  period: ValidPeriod,
): ScheduleCollection => {
  const runs: SemanticDiffScheduleRun[] = [];
  const unsupportedDecisions: SemanticDiffScheduleUnsupportedDecision[] = [];
  const zeroRunCandidates: AjsUnit[] = [];

  units
    .filter(isJobnetUnit)
    .filter(hasDirectScheduleParameters)
    .forEach((unit) => {
      const startTimeParameters = findAjsUnitParameters(unit, "st");
      const startTimeByRule = firstParameterByParsedRule(startTimeParameters);
      const scheduleDateParameters = findAjsUnitParameters(unit, "sd");
      const unitRuns = scheduleDateParameters.flatMap((scheduleDate) =>
        createRunsForScheduleDate(unit, scheduleDate, startTimeByRule, period),
      );

      runs.push(...unitRuns);
      if (unitRuns.length === 0) {
        zeroRunCandidates.push(unit);
      }

      unsupportedDecisions.push(
        ...unsupportedScheduleParameterDecisions(side, unit),
        ...unsupportedStartTimeDecisions(side, unit),
        ...unsupportedUnpairedStartTimeDecisions(side, unit),
        ...scheduleDateParameters
          .map((parameter) =>
            unsupportedScheduleDateDecision(
              side,
              unit,
              parameter,
              startTimeByRule,
              period,
            ),
          )
          .filter(
            (decision): decision is SemanticDiffScheduleUnsupportedDecision =>
              decision !== undefined,
          ),
      );
    });

  return {
    runs: runs.sort((left, right) =>
      compareStrings(
        `${left.unitPath}:${left.date}:${left.time}:${left.rule}`,
        `${right.unitPath}:${right.date}:${right.time}:${right.rule}`,
      ),
    ),
    unsupportedDecisions,
    zeroRunCandidates,
  };
};

const canonicalRun = (
  run: SemanticDiffScheduleRun,
  canonicalPathByPath: Map<string, string>,
): SemanticDiffScheduleRun => ({
  ...run,
  unitPath: canonicalPathByPath.get(run.unitPath) ?? run.unitPath,
});

const runDateKey = (run: SemanticDiffScheduleRun): string =>
  `${run.unitPath}:${run.date}`;

const runTimestampKey = (run: SemanticDiffScheduleRun): string =>
  `${run.unitPath}:${run.date}:${run.time}`;

const groupRunsByDate = (
  runs: SemanticDiffScheduleRun[],
): Map<string, SemanticDiffScheduleRun[]> => {
  const grouped = new Map<string, SemanticDiffScheduleRun[]>();
  runs.forEach((run) => {
    grouped.set(runDateKey(run), [
      ...(grouped.get(runDateKey(run)) ?? []),
      run,
    ]);
  });
  return grouped;
};

const scheduleRunDecisionKey = (
  decision: SemanticDiffScheduleRunDecision,
): string => {
  if (decision.kind === "changed-time") {
    return `schedule:changed-time:${decision.unitPath}:${decision.date}`;
  }
  const run = decision.kind === "removed" ? decision.before : decision.after;
  return `schedule:${decision.kind}:${runTimestampKey(run)}`;
};

const compareScheduleRuns = (
  beforeRuns: SemanticDiffScheduleRun[],
  afterRuns: SemanticDiffScheduleRun[],
): SemanticDiffScheduleRunDecision[] => {
  const beforeByDate = groupRunsByDate(beforeRuns);
  const afterByDate = groupRunsByDate(afterRuns);

  return [...new Set([...beforeByDate.keys(), ...afterByDate.keys()])]
    .sort(compareStrings)
    .flatMap((dateKey): SemanticDiffScheduleRunDecision[] => {
      const beforeDateRuns = beforeByDate.get(dateKey) ?? [];
      const afterDateRuns = afterByDate.get(dateKey) ?? [];

      if (
        beforeDateRuns.length === 1 &&
        afterDateRuns.length === 1 &&
        beforeDateRuns[0].time !== afterDateRuns[0].time
      ) {
        const before = beforeDateRuns[0];
        const after = afterDateRuns[0];
        return [
          {
            kind: "changed-time",
            unitPath: after.unitPath,
            date: after.date,
            before,
            after,
          },
        ];
      }

      const afterTimestamps = new Set(afterDateRuns.map(runTimestampKey));
      const beforeTimestamps = new Set(beforeDateRuns.map(runTimestampKey));
      return [
        ...beforeDateRuns
          .filter((run) => !afterTimestamps.has(runTimestampKey(run)))
          .map(
            (run): SemanticDiffScheduleRunDecision => ({
              kind: "removed",
              unitPath: run.unitPath,
              date: run.date,
              before: run,
            }),
          ),
        ...afterDateRuns
          .filter((run) => !beforeTimestamps.has(runTimestampKey(run)))
          .map(
            (run): SemanticDiffScheduleRunDecision => ({
              kind: "added",
              unitPath: run.unitPath,
              date: run.date,
              after: run,
            }),
          ),
      ];
    })
    .sort((left, right) =>
      compareStrings(
        scheduleRunDecisionKey(left),
        scheduleRunDecisionKey(right),
      ),
    );
};

export const evaluateSemanticDiffSchedule = (
  input: EvaluateSemanticDiffScheduleInput,
): SemanticDiffScheduleEvaluation => {
  if (!input.period) {
    return { kind: "not-requested" };
  }

  const period = parsePeriod(input.period);
  if (!period) {
    return { kind: "invalid-period", period: input.period };
  }

  const before = collectScheduleSide("before", input.beforeUnits, period);
  const after = collectScheduleSide("after", input.afterUnits, period);
  const afterPathByBeforePath = new Map(
    input.matches.map((match) => [
      match.before.absolutePath,
      match.after.absolutePath,
    ]),
  );

  return {
    kind: "evaluated",
    period: period.display,
    runDecisions: compareScheduleRuns(
      before.runs.map((run) => canonicalRun(run, afterPathByBeforePath)),
      after.runs,
    ),
    unsupportedDecisions: [
      ...before.unsupportedDecisions,
      ...after.unsupportedDecisions,
    ],
    zeroRunCandidates: after.zeroRunCandidates,
  };
};
