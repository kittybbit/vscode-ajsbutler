import type { AjsParameter, AjsUnit } from "../../models/ajs/AjsDocument";
import type { ScheduleDateWeekday } from "../../models/parameters/scheduleDateInterpreter";
import {
  createScheduleDate,
  daysInGregorianMonth,
} from "./semanticDiffScheduleDateMath";
import {
  resolveCalendarGroups,
  type CalendarGroupsResult,
} from "./semanticDiffScheduleCalendarSelectors";
import type {
  SemanticDiffScheduleBaseDay,
  SemanticDiffScheduleCalendarContext,
  SemanticDiffScheduleCalendarSelection,
} from "./semanticDiffScheduleCalendarTypes";
import { createScheduleCalendarContext } from "./semanticDiffScheduleCalendarTypes";

type BaseParameterResult = {
  parameter?: AjsParameter;
  parameters: AjsParameter[];
  invalid: boolean;
};

const baseParameterResult = (
  parameters: AjsParameter[],
): BaseParameterResult | undefined => {
  if (parameters.length > 1) {
    return { parameters, invalid: true };
  }
  if (parameters.length === 1) {
    return { parameter: parameters[0], parameters, invalid: false };
  }
  return undefined;
};

const baseParametersFor = (group: AjsUnit, key: "sdd" | "md" | "stt") =>
  group.parameters.filter((parameter) => parameter.key === key);

const findBaseParameter = (
  groups: AjsUnit[],
  key: "sdd" | "md" | "stt",
): BaseParameterResult =>
  groups
    .map((group) => baseParameterResult(baseParametersFor(group, key)))
    .find((result): result is BaseParameterResult => result !== undefined) ?? {
    parameters: [],
    invalid: false,
  };

const numericBaseDay = (
  value: string,
): SemanticDiffScheduleBaseDay | undefined => {
  const numeric = Number(value);
  return /^\d{1,2}$/.test(value) && numeric >= 1 && numeric <= 31
    ? { kind: "numeric", value: numeric }
    : undefined;
};

const weekdayBaseDay = (
  value: string,
): SemanticDiffScheduleBaseDay | undefined => {
  const weekday = /^(su|mo|tu|we|th|fr|sa)(?::([1-5]))?$/.exec(value);
  return weekday
    ? {
        kind: "weekday",
        weekday: weekday[1] as ScheduleDateWeekday,
        occurrence: Number(weekday[2] ?? "1"),
      }
    : undefined;
};

export const parseBaseDay = (
  value: string,
): SemanticDiffScheduleBaseDay | undefined =>
  numericBaseDay(value) ?? weekdayBaseDay(value);

export const isValidBaseTime = (value: string): boolean => {
  const matched = /^(\d{2}):(\d{2})$/.exec(value);
  return matched !== null && Number(matched[1]) < 24 && Number(matched[2]) < 60;
};

const calendarParameters = (group: AjsUnit): AjsParameter[] =>
  group.parameters.filter(
    (parameter) => parameter.key === "op" || parameter.key === "cl",
  );

type BaseSettings = {
  baseDay: SemanticDiffScheduleBaseDay;
  baseMonth: "th" | "ne";
  baseTime: string;
  rawParameters: AjsParameter[];
};

type BaseSettingsResult =
  | { status: "supported"; settings: BaseSettings }
  | { status: "missing-context"; settings: BaseSettings }
  | { status: "invalid"; key: string; rawParameters: AjsParameter[] };

type BaseParameters = {
  sdd: BaseParameterResult;
  md: BaseParameterResult;
  stt: BaseParameterResult;
};

const resolveBaseParameters = (groups: AjsUnit[]): BaseParameters => ({
  sdd: findBaseParameter(groups, "sdd"),
  md: findBaseParameter(groups, "md"),
  stt: findBaseParameter(groups, "stt"),
});

const baseParameterValues = (parameters: BaseParameters): AjsParameter[] => [
  ...parameters.sdd.parameters,
  ...parameters.md.parameters,
  ...parameters.stt.parameters,
];

const firstInvalidBaseParameter = (
  parameters: BaseParameters,
): "sdd" | "md" | "stt" | undefined =>
  (["sdd", "md", "stt"] as const).find((key) => parameters[key].invalid);

const parameterValue = (
  parameter: AjsParameter | undefined,
  fallback: string,
): string => parameter?.value ?? fallback;

const parseBaseMonth = (value: string): "th" | "ne" | undefined =>
  value === "th" || value === "ne" ? value : undefined;

const parseBaseTime = (value: string): string | undefined =>
  isValidBaseTime(value) ? value : undefined;

type ParsedBaseSettings = {
  baseDay: SemanticDiffScheduleBaseDay | undefined;
  baseMonth: "th" | "ne" | undefined;
  baseTime: string | undefined;
};

const parseBaseSettings = (parameters: BaseParameters): ParsedBaseSettings => ({
  baseDay: parseBaseDay(parameterValue(parameters.sdd.parameter, "1")),
  baseMonth: parseBaseMonth(parameterValue(parameters.md.parameter, "th")),
  baseTime: parseBaseTime(parameterValue(parameters.stt.parameter, "00:00")),
});

const firstInvalidBaseSetting = (
  settings: ParsedBaseSettings,
): "sdd" | "md" | "stt" | undefined =>
  [
    { key: "sdd" as const, valid: settings.baseDay !== undefined },
    { key: "md" as const, valid: settings.baseMonth !== undefined },
    { key: "stt" as const, valid: settings.baseTime !== undefined },
  ].find((setting) => !setting.valid)?.key;

const resolveBaseSettings = (input: {
  groups: AjsUnit[];
  rawSelector: AjsParameter[];
}): BaseSettingsResult => {
  const baseParameters = resolveBaseParameters(input.groups);
  const rawParameters = [
    ...input.rawSelector,
    ...baseParameterValues(baseParameters),
    ...input.groups.flatMap(calendarParameters),
  ];
  const invalidParameter = firstInvalidBaseParameter(baseParameters);
  const parsedSettings = parseBaseSettings(baseParameters);
  const invalidSetting = firstInvalidBaseSetting(parsedSettings);
  const invalidKey = invalidParameter ?? invalidSetting;
  if (invalidKey) {
    return { status: "invalid", key: invalidKey, rawParameters };
  }
  const settings: BaseSettings = {
    baseDay: parsedSettings.baseDay as SemanticDiffScheduleBaseDay,
    baseMonth: parsedSettings.baseMonth as "th" | "ne",
    baseTime: parsedSettings.baseTime as string,
    rawParameters,
  };
  return settings.baseTime === "00:00"
    ? { status: "supported", settings }
    : { status: "missing-context", settings };
};

const invalidBaseContext = (
  selection: SemanticDiffScheduleCalendarSelection,
  rawParameters: AjsParameter[],
  key: string,
): SemanticDiffScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: "invalid",
    selection,
    rawParameters,
    evidenceId: `schedule:calendar:invalid-base-or-conflict:${key}`,
  });

const missingTimeContext = (
  input: {
    selection: SemanticDiffScheduleCalendarSelection;
    sourceGroup: AjsUnit;
  },
  settings: BaseSettings,
): SemanticDiffScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: "missing-context",
    selection: input.selection,
    sourceGroup: input.sourceGroup,
    ...settings,
    evidenceId: "schedule:calendar:missing-context:stt",
  });

const resolvedCalendarContext = (
  input: {
    groups: AjsUnit[];
    selection: SemanticDiffScheduleCalendarSelection;
    sourceGroup: AjsUnit;
  },
  settings: BaseSettings,
): SemanticDiffScheduleCalendarContext => {
  const resolvedCalendarGroups: CalendarGroupsResult = resolveCalendarGroups(
    input.groups,
  );
  if (resolvedCalendarGroups.invalidKey) {
    return invalidBaseContext(
      input.selection,
      settings.rawParameters,
      resolvedCalendarGroups.invalidKey,
    );
  }
  return createScheduleCalendarContext({
    status: "supported",
    selection: input.selection,
    sourceGroup: input.sourceGroup,
    ...settings,
    evidenceId: "schedule:calendar:resolved",
    calendarGroups: resolvedCalendarGroups.groups,
  });
};

const contextForBaseSettings = (
  input: {
    groups: AjsUnit[];
    selection: SemanticDiffScheduleCalendarSelection;
    sourceGroup: AjsUnit;
  },
  settings: Exclude<BaseSettingsResult, { status: "invalid" }>,
): SemanticDiffScheduleCalendarContext =>
  settings.status === "missing-context"
    ? missingTimeContext(input, settings.settings)
    : resolvedCalendarContext(input, settings.settings);

export const resolveScheduleCalendarBaseContext = (input: {
  groups: AjsUnit[];
  sourceGroup: AjsUnit;
  selection: SemanticDiffScheduleCalendarSelection;
  rawSelector: AjsParameter[];
}): SemanticDiffScheduleCalendarContext => {
  const settings = resolveBaseSettings(input);
  if (settings.status === "invalid") {
    return invalidBaseContext(
      input.selection,
      settings.rawParameters,
      settings.key,
    );
  }
  return contextForBaseSettings(input, settings);
};

const numericBaseDayNumber = (
  days: number,
  baseDay: Extract<SemanticDiffScheduleBaseDay, { kind: "numeric" }>,
): number | undefined => (baseDay.value <= days ? baseDay.value : undefined);

type WeekdayBaseDayInput = {
  year: number;
  month: number;
  days: number;
  baseDay: Extract<SemanticDiffScheduleBaseDay, { kind: "weekday" }>;
};

const weekdayBaseDayNumber = ({
  year,
  month,
  days,
  baseDay,
}: WeekdayBaseDayInput): number | undefined => {
  const target = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
    baseDay.weekday,
  );
  const first = createScheduleDate(year, month, 1).getUTCDay();
  const day = 1 + ((target - first + 7) % 7) + (baseDay.occurrence - 1) * 7;
  return day <= days ? day : undefined;
};

export const baseDayNumber = (
  year: number,
  month: number,
  baseDay: SemanticDiffScheduleBaseDay,
): number | undefined => {
  const days = daysInGregorianMonth(year, month);
  return baseDay.kind === "numeric"
    ? numericBaseDayNumber(days, baseDay)
    : weekdayBaseDayNumber({ year, month, days, baseDay });
};

type CalendarMonth = { year: number; month: number };

const previousMonth = (year: number, month: number): CalendarMonth =>
  month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };

const nextMonth = (year: number, month: number): CalendarMonth =>
  month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

const monthBoundary = (
  year: number,
  month: number,
  direction: "previous" | "next",
): CalendarMonth =>
  direction === "previous"
    ? previousMonth(year, month)
    : nextMonth(year, month);

type OperationalCalendarContext = SemanticDiffScheduleCalendarContext & {
  status: "supported";
  baseDay: SemanticDiffScheduleBaseDay;
  baseMonth: "th" | "ne";
};

const isOperationalMonthInput = (
  context: SemanticDiffScheduleCalendarContext,
  month: number,
): context is OperationalCalendarContext =>
  hasOperationalBase(context) && isValidCalendarMonth(month);

const hasOperationalBase = (
  context: SemanticDiffScheduleCalendarContext,
): context is OperationalCalendarContext =>
  context.status === "supported" &&
  context.baseDay !== undefined &&
  context.baseMonth !== undefined;

const isValidCalendarMonth = (month: number): boolean =>
  month >= 1 && month <= 12;

type OperationalBoundaries = {
  start: CalendarMonth;
  end: CalendarMonth;
};

const operationalBoundaries = (
  context: OperationalCalendarContext,
  year: number,
  month: number,
): OperationalBoundaries => {
  const previous = monthBoundary(year, month, "previous");
  const next = monthBoundary(year, month, "next");
  return context.baseMonth === "th"
    ? { start: { year, month }, end: next }
    : { start: previous, end: { year, month } };
};

const createOperationalMonth = (
  context: OperationalCalendarContext,
  boundaries: OperationalBoundaries,
): SemanticDiffOperationalMonth | undefined => {
  const startDay = baseDayNumber(
    boundaries.start.year,
    boundaries.start.month,
    context.baseDay,
  );
  const endDay = baseDayNumber(
    boundaries.end.year,
    boundaries.end.month,
    context.baseDay,
  );
  if (startDay === undefined || endDay === undefined) {
    return undefined;
  }
  return {
    start: createScheduleDate(
      boundaries.start.year,
      boundaries.start.month,
      startDay,
    ),
    endExclusive: createScheduleDate(
      boundaries.end.year,
      boundaries.end.month,
      endDay,
    ),
  };
};

/** Build one definition-backed operational month without host calendar data. */
export const resolveOperationalMonth = (
  context: SemanticDiffScheduleCalendarContext,
  year: number,
  month: number,
): SemanticDiffOperationalMonth | undefined => {
  if (!isOperationalMonthInput(context, month)) {
    return undefined;
  }
  const boundaries = operationalBoundaries(context, year, month);
  return createOperationalMonth(context, boundaries);
};

export type SemanticDiffOperationalMonth = {
  start: Date;
  endExclusive: Date;
};

export const isWithinOperationalMonth = (
  date: Date,
  month: SemanticDiffOperationalMonth,
): boolean => date >= month.start && date < month.endExclusive;

export const operationalMonthLength = (
  month: SemanticDiffOperationalMonth,
): number =>
  Math.floor(
    (month.endExclusive.getTime() - month.start.getTime()) / 86_400_000,
  );

export const operationalMonthDate = (
  month: SemanticDiffOperationalMonth,
  offset: number,
): Date => new Date(month.start.getTime() + offset * 86_400_000);
