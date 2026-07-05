import {
  findAjsUnitParameters,
  type AjsParameter,
  type AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import {
  parseScheduleDateValue,
  parseStartTimeValue,
} from "../../domain/models/parameters/scheduleRuleHelpers";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffLimitation,
  SemanticDiffScheduleComparison,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";

export type ScheduleDiffPeriodOption = SemanticDiffComparisonPeriod;

export type ScheduleDiffMatchedUnit = {
  before: AjsUnit;
  after: AjsUnit;
};

export type ScheduleDiffInput = {
  beforeUnits: AjsUnit[];
  afterUnits: AjsUnit[];
  beforeUnitById: Map<string, AjsUnit>;
  afterUnitById: Map<string, AjsUnit>;
  matches: ScheduleDiffMatchedUnit[];
  period?: ScheduleDiffPeriodOption;
  toUnitTarget: (
    unit: AjsUnit,
    unitById: Map<string, AjsUnit>,
  ) => SemanticDiffTarget;
};

export type ScheduleDiffResult = {
  scheduleComparison?: SemanticDiffScheduleComparison;
  confirmationRequired: SemanticDiffConfirmationRequiredItem[];
  unsupportedItems: SemanticDiffUnsupportedItem[];
  limitations: SemanticDiffLimitation[];
};

type ValidPeriod = {
  from: Date;
  to: Date;
  display: SemanticDiffComparisonPeriod;
};

type ScheduleSide = "before" | "after";

type ScheduleCollection = {
  runs: SemanticDiffScheduleRun[];
  unsupportedItems: SemanticDiffUnsupportedItem[];
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
const unsupportedScheduleParameterKeys = new Map<string, string>([
  ["cy", "cycle schedules are not calculated in this slice"],
  ["sh", "closed-day substitution is not calculated in this slice"],
  ["shd", "shift days are not calculated in this slice"],
  ["sc", "calendar selection is not calculated in this slice"],
  ["ln", "inherited parent-rule schedules are not calculated in this slice"],
  ["cftd", "schedule-by-days-from-start is not calculated in this slice"],
]);

const scheduleBasisConstraint =
  "Rule basis: JP1/AJS3 v13 unit definition schedule parameters sd and st for explicit directly defined jobnet schedules.";

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
  period: ScheduleDiffPeriodOption | undefined,
): ValidPeriod | undefined => {
  if (!period) {
    return undefined;
  }

  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from.getTime() < to.getTime()
    ? { from, to, display: period }
    : undefined;
};

const isJobnetUnit = (unit: AjsUnit): boolean => jobnetTypes.has(unit.unitType);

const hasDirectScheduleParameters = (unit: AjsUnit): boolean =>
  unit.parameters.some((parameter) => scheduleParameterKeys.has(parameter.key));

const ruleValueId = (parameter: AjsParameter): string =>
  `${parameter.key}:${parameter.value}`;

const createUnsupportedItem = ({
  side,
  unit,
  unitById,
  parameter,
  message,
  toUnitTarget,
}: {
  side: ScheduleSide;
  unit: AjsUnit;
  unitById: Map<string, AjsUnit>;
  parameter?: AjsParameter;
  message: string;
  toUnitTarget: ScheduleDiffInput["toUnitTarget"];
}): SemanticDiffUnsupportedItem => ({
  id: [
    "uncalculated",
    "schedule",
    side,
    unit.id,
    parameter ? ruleValueId(parameter) : "period",
  ].join(":"),
  kind: "uncalculated",
  side,
  target: toUnitTarget(unit, unitById),
  message: parameter
    ? `${unit.absolutePath} ${parameter.key}=${parameter.value}: ${message}`
    : `${unit.absolutePath}: ${message}`,
});

const createPeriodUnsupportedItem = (
  unit: AjsUnit | undefined,
  period: ScheduleDiffPeriodOption,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
  unitById: Map<string, AjsUnit>,
): SemanticDiffUnsupportedItem => ({
  id: "uncalculated:schedule:period",
  kind: "uncalculated",
  target: unit ? toUnitTarget(unit, unitById) : undefined,
  message: `schedule comparison period is invalid: from=${period.from}, to=${period.to}`,
});

const createPeriodLimitation = (
  period: ScheduleDiffPeriodOption,
): SemanticDiffLimitation => ({
  code: "invalid_schedule_comparison_period",
  kind: "uncalculated",
  message: `schedule comparison period is invalid: from=${period.from}, to=${period.to}`,
});

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

const unsupportedScheduleParameters = (
  side: ScheduleSide,
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffUnsupportedItem[] =>
  unit.parameters
    .filter((parameter) => unsupportedScheduleParameterKeys.has(parameter.key))
    .map((parameter) =>
      createUnsupportedItem({
        side,
        unit,
        unitById,
        parameter,
        message: unsupportedScheduleParameterKeys.get(parameter.key)!,
        toUnitTarget,
      }),
    );

const unsupportedStartTimeParameters = (
  side: ScheduleSide,
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffUnsupportedItem[] =>
  findAjsUnitParameters(unit, "st")
    .filter((parameter) => {
      const parsed = parseStartTimeValue(parameter.value);
      return !parsed || !isNormalStartTime(parsed.value);
    })
    .map((parameter) =>
      createUnsupportedItem({
        side,
        unit,
        unitById,
        parameter,
        message:
          "start time is missing, unparsable, offset-based, day-crossing, or outside HH:MM",
        toUnitTarget,
      }),
    );

const unsupportedUnpairedStartTimeParameters = (
  side: ScheduleSide,
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffUnsupportedItem[] => {
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
    .map((parameter) =>
      createUnsupportedItem({
        side,
        unit,
        unitById,
        parameter,
        message: "matching sd for this start-time rule is missing",
        toUnitTarget,
      }),
    );
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
    const month = yearMonth;
    const dates: string[] = [];
    for (
      let year = period.from.getUTCFullYear();
      year <= period.to.getUTCFullYear();
      year += 1
    ) {
      dates.push(`${year}-${month}-${parsed.day}`);
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

const unsupportedScheduleDate = (
  side: ScheduleSide,
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  parameter: AjsParameter,
  startTimeByRule: Map<number, AjsParameter>,
  period: ValidPeriod,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffUnsupportedItem | undefined => {
  const parsedDate = parseScheduleDateValue(parameter.value);
  if (!parsedDate || !parsedDate.day || !/^\d{2}$/.test(parsedDate.day)) {
    return createUnsupportedItem({
      side,
      unit,
      unitById,
      parameter,
      message:
        "schedule date is not a supported explicit calendar day in YYYY/MM/DD, MM/DD, or DD form",
      toUnitTarget,
    });
  }

  if (!startTimeByRule.has(parsedDate.rule)) {
    return createUnsupportedItem({
      side,
      unit,
      unitById,
      parameter,
      message: `matching st for schedule rule ${parsedDate.rule} is missing or uncalculated`,
      toUnitTarget,
    });
  }

  if (
    explicitDateCandidates(parameter.value, period).every(
      (date) => !toUtcDate(date),
    )
  ) {
    return createUnsupportedItem({
      side,
      unit,
      unitById,
      parameter,
      message:
        "schedule date is not a valid calendar day in the comparison period",
      toUnitTarget,
    });
  }

  return undefined;
};

const collectScheduleSide = ({
  side,
  units,
  unitById,
  period,
  toUnitTarget,
}: {
  side: ScheduleSide;
  units: AjsUnit[];
  unitById: Map<string, AjsUnit>;
  period: ValidPeriod;
  toUnitTarget: ScheduleDiffInput["toUnitTarget"];
}): ScheduleCollection => {
  const runs: SemanticDiffScheduleRun[] = [];
  const unsupportedItems: SemanticDiffUnsupportedItem[] = [];
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

      unsupportedItems.push(
        ...unsupportedScheduleParameters(side, unit, unitById, toUnitTarget),
        ...unsupportedStartTimeParameters(side, unit, unitById, toUnitTarget),
        ...unsupportedUnpairedStartTimeParameters(
          side,
          unit,
          unitById,
          toUnitTarget,
        ),
        ...scheduleDateParameters
          .map((parameter) =>
            unsupportedScheduleDate(
              side,
              unit,
              unitById,
              parameter,
              startTimeByRule,
              period,
              toUnitTarget,
            ),
          )
          .filter(
            (item): item is SemanticDiffUnsupportedItem => item !== undefined,
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
    unsupportedItems,
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

const createScheduleRunChanges = (
  beforeRuns: SemanticDiffScheduleRun[],
  afterRuns: SemanticDiffScheduleRun[],
): SemanticDiffScheduleRunChange[] => {
  const beforeByDate = groupRunsByDate(beforeRuns);
  const afterByDate = groupRunsByDate(afterRuns);

  return [...new Set([...beforeByDate.keys(), ...afterByDate.keys()])]
    .sort(compareStrings)
    .flatMap((dateKey): SemanticDiffScheduleRunChange[] => {
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
            id: `schedule:changed-time:${dateKey}`,
            kind: "changed-time",
            unitPath: after.unitPath,
            date: after.date,
            before,
            after,
            summary: `${after.unitPath} run on ${after.date} changed from ${before.time} to ${after.time}`,
          },
        ];
      }

      const afterTimestamps = new Set(afterDateRuns.map(runTimestampKey));
      const beforeTimestamps = new Set(beforeDateRuns.map(runTimestampKey));
      return [
        ...beforeDateRuns
          .filter((run) => !afterTimestamps.has(runTimestampKey(run)))
          .map(
            (run): SemanticDiffScheduleRunChange => ({
              id: `schedule:removed:${runTimestampKey(run)}`,
              kind: "removed",
              unitPath: run.unitPath,
              date: run.date,
              before: run,
              summary: `${run.unitPath} run on ${run.date} ${run.time} removed`,
            }),
          ),
        ...afterDateRuns
          .filter((run) => !beforeTimestamps.has(runTimestampKey(run)))
          .map(
            (run): SemanticDiffScheduleRunChange => ({
              id: `schedule:added:${runTimestampKey(run)}`,
              kind: "added",
              unitPath: run.unitPath,
              date: run.date,
              after: run,
              summary: `${run.unitPath} run on ${run.date} ${run.time} added`,
            }),
          ),
      ];
    })
    .sort((left, right) => compareStrings(left.id, right.id));
};

const createZeroRunConfirmation = (
  unit: AjsUnit,
  unitById: Map<string, AjsUnit>,
  period: SemanticDiffComparisonPeriod,
  toUnitTarget: ScheduleDiffInput["toUnitTarget"],
): SemanticDiffConfirmationRequiredItem => ({
  id: `confirm:schedule-zero-runs:${unit.id}`,
  target: toUnitTarget(unit, unitById),
  changeContent: `${unit.name} has no calculated runs in the schedule comparison period`,
  rationale:
    "a schedule-defined jobnet may no longer have an execution opportunity in the compared period",
  relatedTargets: [],
  constraints: [
    scheduleBasisConstraint,
    `Comparison period: ${period.from} to ${period.to} (exclusive)`,
  ],
});

export const compareScheduleDiff = (
  input: ScheduleDiffInput,
): ScheduleDiffResult => {
  if (!input.period) {
    return {
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
    };
  }

  const period = parsePeriod(input.period);
  if (!period) {
    return {
      confirmationRequired: [],
      unsupportedItems: [
        createPeriodUnsupportedItem(
          input.afterUnits.find(isJobnetUnit),
          input.period,
          input.toUnitTarget,
          input.afterUnitById,
        ),
      ],
      limitations: [createPeriodLimitation(input.period)],
    };
  }

  const before = collectScheduleSide({
    side: "before",
    units: input.beforeUnits,
    unitById: input.beforeUnitById,
    period,
    toUnitTarget: input.toUnitTarget,
  });
  const after = collectScheduleSide({
    side: "after",
    units: input.afterUnits,
    unitById: input.afterUnitById,
    period,
    toUnitTarget: input.toUnitTarget,
  });
  const afterPathByBeforePath = new Map(
    input.matches.map((match) => [
      match.before.absolutePath,
      match.after.absolutePath,
    ]),
  );
  const runChanges = createScheduleRunChanges(
    before.runs.map((run) => canonicalRun(run, afterPathByBeforePath)),
    after.runs,
  );

  return {
    scheduleComparison: {
      period: period.display,
      runChanges,
    },
    confirmationRequired: after.zeroRunCandidates.map((unit) =>
      createZeroRunConfirmation(
        unit,
        input.afterUnitById,
        period.display,
        input.toUnitTarget,
      ),
    ),
    unsupportedItems: [...before.unsupportedItems, ...after.unsupportedItems],
    limitations: [],
  };
};
