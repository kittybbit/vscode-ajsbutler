import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../models/ajs/AjsDocument";
import type {
  ScheduleDateInterpretation,
  ScheduleDateWeekday,
} from "./ScheduleDate";
import {
  ancestorsOf,
  collectUnits,
  indexUnits,
  resolveScheduleCalendarSource,
  type ScheduleCalendarSourceResolution,
} from "./ScheduleCalendarIndex";
import { classifyCalendarSelector } from "./ScheduleCalendarEntries";
import {
  createOperationalMonth,
  isOperationalMonthInput,
  operationalBoundaries,
  resolveScheduleCalendarBaseContext,
} from "./ScheduleOperationalCalendar";

export type ScheduleCalendarContextStatus =
  | "supported"
  | "invalid"
  | "missing-context";

export type ScheduleCalendarBaseDay =
  | { kind: "numeric"; value: number }
  | { kind: "weekday"; weekday: ScheduleDateWeekday; occurrence: number };

export type ScheduleCalendarDayClassification = "open" | "closed";

export type ScheduleCalendarSelector =
  | {
      kind: "exact";
      year?: number;
      month: number;
      day: number;
      key: string;
    }
  | {
      kind: "weekday";
      weekday: ScheduleDateWeekday;
      key: string;
    };

export type ScheduleCalendarEntry = {
  selector: ScheduleCalendarSelector;
  classification: ScheduleCalendarDayClassification;
  parameter: AjsParameter;
};

export type ScheduleCalendarGroup = {
  entries: ScheduleCalendarEntry[];
};

export type ScheduleCalendarSelection = {
  status: ScheduleCalendarContextStatus;
  evidenceId: string;
  rawParameters: AjsParameter[];
};

export type ScheduleCalendarContext = {
  status: ScheduleCalendarContextStatus;
  selection: ScheduleCalendarSelection;
  sourceGroup?: AjsUnit;
  baseDay?: ScheduleCalendarBaseDay;
  baseMonth?: "th" | "ne";
  baseTime?: string;
  rawParameters: AjsParameter[];
  evidenceId: string;
  calendarGroups?: ScheduleCalendarGroup[];
};

export type ScheduleCalendarContextIndex = {
  byId: Map<string, AjsUnit[]>;
  byPath: Map<string, AjsUnit[]>;
  duplicatePath: boolean;
};

export type ScheduleCalendarDayResult =
  | {
      status: ScheduleCalendarDayClassification;
    }
  | {
      status: "missing-context" | "invalid";
      evidenceId: string;
    };

export const createScheduleCalendarContextIndex = (
  document: AjsDocument,
): ScheduleCalendarContextIndex => {
  const units = collectUnits(document);
  const byId = indexUnits(units, (unit) => unit.id);
  const byPath = indexUnits(units, (unit) => unit.absolutePath);
  return {
    byId,
    byPath,
    duplicatePath: [...byPath.values()].some((matches) => matches.length > 1),
  };
};

export const classifyScheduleCalendarDay = (
  context: {
    status: ScheduleCalendarContextStatus;
    evidenceId: string;
    calendarGroups?: ScheduleCalendarGroup[];
  },
  date: Date,
): ScheduleCalendarDayResult => {
  if (context.status !== "supported") {
    return {
      status: context.status,
      evidenceId: context.evidenceId,
    };
  }
  const groups = context.calendarGroups ?? [];
  return (
    classifyCalendarSelector(groups, date, "exact") ??
    classifyCalendarSelector(groups, date, "weekday") ?? {
      status: "missing-context",
      evidenceId: "schedule:calendar:missing-context:calendar",
    }
  );
};

export const resolveOperationalMonth = (
  context: ScheduleCalendarContext,
  year: number,
  month: number,
): ScheduleOperationalMonth | undefined => {
  if (!isOperationalMonthInput(context, month)) {
    return undefined;
  }
  const boundaries = operationalBoundaries(context, year, month);
  return createOperationalMonth(context, boundaries);
};

export type ScheduleOperationalMonth = {
  start: Date;
  endExclusive: Date;
};

export const isWithinOperationalMonth = (
  date: Date,
  month: ScheduleOperationalMonth,
): boolean => date >= month.start && date < month.endExclusive;

export const operationalMonthLength = (
  month: ScheduleOperationalMonth,
): number =>
  Math.floor(
    (month.endExclusive.getTime() - month.start.getTime()) / 86_400_000,
  );

export const operationalMonthDate = (
  month: ScheduleOperationalMonth,
  offset: number,
): Date => new Date(month.start.getTime() + offset * 86_400_000);

const relativeDayKinds = new Set(["relative", "open", "closed"]);

const isRelativeBackwardDay = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "backward" &&
  ["+", "*", "@"].includes(parsed.day.prefix ?? "");

const isRelativeWeekday = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "weekday" && parsed.day.prefix === "+";

type ClassifiedBackwardDay = Extract<
  ScheduleDateInterpretation["day"],
  { kind: "backward" }
>;

const isClassifiedBackwardDay = (
  parsed: ScheduleDateInterpretation,
): parsed is ScheduleDateInterpretation & { day: ClassifiedBackwardDay } =>
  parsed.day.kind === "backward" &&
  (parsed.day.prefix === "*" || parsed.day.prefix === "@");

const hasInvalidClassifiedOffset = (day: ClassifiedBackwardDay): boolean =>
  day.offset !== undefined && (day.offset < 0 || day.offset > 34);

export const relativeScheduleDateRequiresContext = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  relativeDayKinds.has(parsed.day.kind) ||
  isRelativeBackwardDay(parsed) ||
  isRelativeWeekday(parsed);

const hasInvalidMonth = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.month !== undefined && (parsed.month < 1 || parsed.month > 12);

const hasInvalidRelativeDay = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.day.kind === "relative" &&
  (parsed.day.value < 1 || parsed.day.value > 31);

const hasInvalidClassifiedDay = (parsed: ScheduleDateInterpretation): boolean =>
  (parsed.day.kind === "open" || parsed.day.kind === "closed") &&
  (parsed.day.value < 1 || parsed.day.value > 35);

const hasInvalidRelativeBackwardOffset = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "backward" &&
  parsed.day.prefix === "+" &&
  parsed.day.offset !== undefined &&
  (parsed.day.offset < 0 || parsed.day.offset > 30);

const hasInvalidClassifiedBackwardOffset = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  isClassifiedBackwardDay(parsed) && hasInvalidClassifiedOffset(parsed.day);

const hasInvalidRelativeWeekdayOccurrence = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  parsed.day.kind === "weekday" &&
  parsed.day.prefix === "+" &&
  typeof parsed.day.occurrence === "number" &&
  (parsed.day.occurrence < 1 || parsed.day.occurrence > 5);

const relativeDateValidators: readonly ((
  parsed: ScheduleDateInterpretation,
) => boolean)[] = [
  hasInvalidMonth,
  hasInvalidRelativeDay,
  hasInvalidClassifiedDay,
  hasInvalidRelativeBackwardOffset,
  hasInvalidClassifiedBackwardOffset,
  hasInvalidRelativeWeekdayOccurrence,
];

export const isSyntacticallyInvalidRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  relativeScheduleDateRequiresContext(parsed) &&
  relativeDateValidators.some((validate) => validate(parsed));

const isFullyQualifiedDate = (parsed: ScheduleDateInterpretation): boolean =>
  parsed.year !== undefined &&
  parsed.month !== undefined &&
  parsed.month >= 1 &&
  parsed.month <= 12;

export const isFullyQualifiedRelativeScheduleDate = (
  parsed: ScheduleDateInterpretation,
): boolean =>
  isFullyQualifiedDate(parsed) &&
  relativeScheduleDateRequiresContext(parsed) &&
  !isSyntacticallyInvalidRelativeScheduleDate(parsed);

const invalidHierarchyContext = (
  selection: ScheduleCalendarSelection,
  rawParameters: AjsParameter[],
): ScheduleCalendarContext => ({
  status: "invalid",
  selection,
  rawParameters,
  evidenceId: "schedule:calendar:invalid-base-or-conflict:hierarchy",
});

type SourceFailure = Extract<
  ScheduleCalendarSourceResolution,
  { status: "invalid" | "missing-context" }
>;

const sourceFailureContext = (
  source: SourceFailure,
): ScheduleCalendarContext => ({
  status: source.status,
  selection: source.selection,
  rawParameters: source.rawParameters,
  evidenceId: source.evidenceId,
});

/** Resolve a jobnet's definition-backed calendar/base context. */
export const resolveScheduleCalendarContext = (
  document: AjsDocument,
  unit: AjsUnit,
  index: ScheduleCalendarContextIndex = createScheduleCalendarContextIndex(
    document,
  ),
): ScheduleCalendarContext => {
  const ancestorResult = ancestorsOf(unit, index);
  const source = resolveScheduleCalendarSource({
    unit,
    index,
    ancestorResult,
  });
  if (source.status !== "supported") {
    return sourceFailureContext(source);
  }
  const sourceAncestors = ancestorsOf(source.sourceGroup, index);
  if (sourceAncestors.status === "invalid") {
    return invalidHierarchyContext(source.selection, source.rawParameters);
  }
  const groups = [
    source.sourceGroup,
    ...sourceAncestors.ancestors.filter(
      (ancestor) => ancestor.unitType === "g",
    ),
  ];
  return resolveScheduleCalendarBaseContext({
    groups,
    sourceGroup: source.sourceGroup,
    selection: source.selection,
    rawSelector: source.rawParameters,
  });
};
