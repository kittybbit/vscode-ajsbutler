import type {
  ScheduleDateDay,
  ScheduleDateInterpretation,
} from "../../models/parameters/scheduleDateInterpreter";
import {
  operationalMonthDate,
  resolveOperationalMonth,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";
import {
  operationalMonthLength,
  type SemanticDiffOperationalMonth,
} from "./semanticDiffScheduleOperationalMonth";
import { classifiedDayCandidates } from "./semanticDiffScheduleClassifiedDayCandidates";
import {
  deferredScheduleDateCandidates,
  emptyScheduleDateCandidates,
  invalidScheduleDateCandidates,
  singleScheduleDateCandidate,
  type ScheduleDateCandidateResult,
} from "./semanticDiffScheduleCandidateTypes";
import { formatScheduleDate } from "./semanticDiffScheduleDateMath";

type OperationalCandidateInput = {
  parsed: ScheduleDateInterpretation;
  context: SemanticDiffScheduleCalendarContext;
};

const dateCandidateAt = (
  month: SemanticDiffOperationalMonth,
  offset: number,
): string => {
  const date = operationalMonthDate(month, offset);
  return formatScheduleDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
};

const offsetCandidate = (
  month: SemanticDiffOperationalMonth,
  offset: number,
): ScheduleDateCandidateResult => {
  const length = operationalMonthLength(month);
  return offset < 0 || offset >= length
    ? invalidScheduleDateCandidates()
    : singleScheduleDateCandidate(dateCandidateAt(month, offset));
};

const relativeCandidate = (
  day: Extract<ScheduleDateDay, { kind: "relative" }>,
  month: SemanticDiffOperationalMonth,
): ScheduleDateCandidateResult => offsetCandidate(month, day.value - 1);

const backwardCandidate = (
  day: Extract<ScheduleDateDay, { kind: "backward" }>,
  month: SemanticDiffOperationalMonth,
): ScheduleDateCandidateResult => {
  const length = operationalMonthLength(month);
  return offsetCandidate(month, length - 1 - (day.offset ?? 0));
};

const weekdayDates = (
  day: Extract<ScheduleDateDay, { kind: "weekday" }>,
  month: SemanticDiffOperationalMonth,
): Date[] => {
  const weekday = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
    day.weekday,
  );
  return Array.from({ length: operationalMonthLength(month) }, (_, offset) =>
    operationalMonthDate(month, offset),
  ).filter((date) => date.getUTCDay() === weekday);
};

const weekdayOccurrenceDate = (
  day: Extract<ScheduleDateDay, { kind: "weekday" }>,
  dates: Date[],
): Date | undefined => {
  const occurrence = day.occurrence === "b" ? -1 : (day.occurrence ?? 1) - 1;
  return occurrence === -1 ? dates.at(-1) : dates[occurrence];
};

const isInvalidWeekdayOccurrence = (
  day: Extract<ScheduleDateDay, { kind: "weekday" }>,
): boolean =>
  typeof day.occurrence === "number" &&
  (day.occurrence < 1 || day.occurrence > 5);

const formatOperationalWeekday = (date: Date): string =>
  formatScheduleDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );

const weekdayCandidate = (
  day: Extract<ScheduleDateDay, { kind: "weekday" }>,
  month: SemanticDiffOperationalMonth,
): ScheduleDateCandidateResult => {
  const dates = weekdayDates(day, month);
  const date = weekdayOccurrenceDate(day, dates);
  if (isInvalidWeekdayOccurrence(day)) {
    return invalidScheduleDateCandidates();
  }
  return date
    ? singleScheduleDateCandidate(formatOperationalWeekday(date))
    : emptyScheduleDateCandidates();
};

const isRelativeDay = (
  day: ScheduleDateDay,
): day is Extract<ScheduleDateDay, { kind: "relative" }> =>
  day.kind === "relative";

const isForwardBackwardDay = (
  day: ScheduleDateDay,
): day is Extract<ScheduleDateDay, { kind: "backward" }> =>
  day.kind === "backward" && day.prefix === "+";

const isForwardWeekday = (
  day: ScheduleDateDay,
): day is Extract<ScheduleDateDay, { kind: "weekday" }> =>
  day.kind === "weekday" && day.prefix === "+";

type OperationalDayHandler = (
  day: ScheduleDateDay,
  month: SemanticDiffOperationalMonth,
) => ScheduleDateCandidateResult;

const operationalDayHandlers: Partial<
  Record<ScheduleDateDay["kind"], OperationalDayHandler>
> = {
  relative: (day, month) =>
    isRelativeDay(day)
      ? relativeCandidate(day, month)
      : deferredScheduleDateCandidates(),
  backward: (day, month) =>
    isForwardBackwardDay(day)
      ? backwardCandidate(day, month)
      : deferredScheduleDateCandidates(),
  weekday: (day, month) =>
    isForwardWeekday(day)
      ? weekdayCandidate(day, month)
      : deferredScheduleDateCandidates(),
};

const operationalDayCandidate = (
  day: ScheduleDateDay,
  month: SemanticDiffOperationalMonth,
): ScheduleDateCandidateResult =>
  operationalDayHandlers[day.kind]?.(day, month) ??
  deferredScheduleDateCandidates();

type OperationalMonthResult =
  | { month: SemanticDiffOperationalMonth }
  | { result: ScheduleDateCandidateResult };

type FullOperationalMonthInput =
  | { year: number; month: number }
  | { result: ScheduleDateCandidateResult };

const hasYearAndMonth = (
  parsed: ScheduleDateInterpretation,
): parsed is ScheduleDateInterpretation & { year: number; month: number } =>
  parsed.year !== undefined && parsed.month !== undefined;

const isInvalidOperationalMonth = (month: number): boolean =>
  month < 1 || month > 12;

const fullOperationalMonthInput = (
  parsed: ScheduleDateInterpretation,
): FullOperationalMonthInput => {
  if (!hasYearAndMonth(parsed)) {
    return { result: deferredScheduleDateCandidates() };
  }
  if (isInvalidOperationalMonth(parsed.month)) {
    return { result: invalidScheduleDateCandidates() };
  }
  return { year: parsed.year, month: parsed.month };
};

const operationalMonthFor = (
  parsed: ScheduleDateInterpretation,
  context: SemanticDiffScheduleCalendarContext,
): OperationalMonthResult => {
  const input = fullOperationalMonthInput(parsed);
  if ("result" in input) {
    return input;
  }
  const month = resolveOperationalMonth(context, input.year, input.month);
  return month
    ? { month }
    : { result: { ...invalidScheduleDateCandidates(), contextInvalid: true } };
};

const classifiedCandidate = (
  parsed: ScheduleDateInterpretation,
  month: SemanticDiffOperationalMonth,
  context: SemanticDiffScheduleCalendarContext,
): ScheduleDateCandidateResult | undefined =>
  parsed.day.kind === "open" ||
  parsed.day.kind === "closed" ||
  parsed.day.kind === "backward"
    ? classifiedDayCandidates({ day: parsed.day, month, context })
    : undefined;

/** Project numeric and weekday dates in a definition-backed month. */
export const operationalDateCandidates = ({
  parsed,
  context,
}: OperationalCandidateInput): ScheduleDateCandidateResult => {
  const monthResult = operationalMonthFor(parsed, context);
  if ("result" in monthResult) {
    return monthResult.result;
  }
  const classified = classifiedCandidate(parsed, monthResult.month, context);
  return classified ?? operationalDayCandidate(parsed.day, monthResult.month);
};
