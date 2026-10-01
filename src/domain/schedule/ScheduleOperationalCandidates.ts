import {
  formatScheduleDate,
  type ScheduleDateDay,
  type ScheduleDateInterpretation,
} from "./ScheduleDate";
import {
  classifyScheduleCalendarDay,
  operationalMonthDate,
  operationalMonthLength,
  resolveOperationalMonth,
  type ScheduleCalendarContext,
  type ScheduleOperationalMonth,
} from "./ScheduleCalendar";
import type { ScheduleDateCandidateResult } from "./ScheduleCandidateResolver";

const emptyOperationalDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: false,
  deferred: false,
});

const deferredOperationalDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: false,
  deferred: true,
});

const invalidOperationalDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: true,
  deferred: false,
});

const singleOperationalDateCandidate = (
  candidate: string,
): ScheduleDateCandidateResult => ({
  candidates: [candidate],
  invalid: false,
  deferred: false,
});

type ScheduleDayClassification =
  | "open"
  | "closed"
  | { status: "missing-context" | "invalid"; evidenceId: string };

const classificationFailure = (
  classification: Exclude<ScheduleDayClassification, "open" | "closed">,
): ScheduleDateCandidateResult =>
  classification.status === "invalid"
    ? {
        ...invalidOperationalDateCandidates(),
        contextInvalid: true,
        contextEvidenceId: classification.evidenceId,
      }
    : {
        candidates: [],
        invalid: false,
        deferred: false,
        contextMissing: true,
        contextEvidenceId: classification.evidenceId,
      };

type ClassifiedDay = Extract<
  ScheduleDateDay,
  { kind: "open" | "closed" | "backward" }
>;

type ClassifiedCandidateInput = {
  day: ClassifiedDay;
  month: ScheduleOperationalMonth;
  context: ScheduleCalendarContext;
};

const classifyOffset = (
  context: ScheduleCalendarContext,
  month: ScheduleOperationalMonth,
  offset: number,
): ScheduleDayClassification => {
  const result = classifyScheduleCalendarDay(
    context,
    operationalMonthDate(month, offset),
  );
  return "evidenceId" in result
    ? { status: result.status, evidenceId: result.evidenceId }
    : result.status;
};

const formattedDateAt = (
  month: ScheduleOperationalMonth,
  offset: number,
): string => {
  const date = operationalMonthDate(month, offset);
  return formatScheduleDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
};

type ClassificationSearchStep = {
  qualifying: number;
  result?: ScheduleDateCandidateResult;
};

const classificationSearchStep = (input: {
  classification: ScheduleDayClassification;
  target: "open" | "closed";
  qualifying: number;
  occurrence: number;
  month: ScheduleOperationalMonth;
  offset: number;
}): ClassificationSearchStep => {
  if (typeof input.classification !== "string") {
    return {
      qualifying: input.qualifying,
      result: classificationFailure(input.classification),
    };
  }
  return input.classification === input.target
    ? matchingClassificationStep({
        target: input.target,
        qualifying: input.qualifying,
        occurrence: input.occurrence,
        month: input.month,
        offset: input.offset,
      })
    : { qualifying: input.qualifying };
};

const matchingClassificationStep = (input: {
  target: "open" | "closed";
  qualifying: number;
  occurrence: number;
  month: ScheduleOperationalMonth;
  offset: number;
}): ClassificationSearchStep =>
  input.qualifying === input.occurrence
    ? {
        qualifying: input.qualifying,
        result: singleOperationalDateCandidate(
          formattedDateAt(input.month, input.offset),
        ),
      }
    : { qualifying: input.qualifying + 1 };

const findClassifiedCandidate = (input: {
  context: ScheduleCalendarContext;
  month: ScheduleOperationalMonth;
  offsets: Iterable<number>;
  target: "open" | "closed";
  occurrence: number;
}): ScheduleDateCandidateResult => {
  const result = Array.from(input.offsets).reduce<ClassificationSearchStep>(
    (state, offset) =>
      state.result
        ? state
        : classificationSearchStep({
            classification: classifyOffset(input.context, input.month, offset),
            target: input.target,
            qualifying: state.qualifying,
            occurrence: input.occurrence,
            month: input.month,
            offset,
          }),
    { qualifying: 0 },
  );
  return result.result ?? emptyOperationalDateCandidates();
};

const isForwardClassifiedDay = (
  day: ClassifiedDay,
): day is Extract<ClassifiedDay, { kind: "open" | "closed" }> =>
  day.kind === "open" || day.kind === "closed";

const isBackwardClassifiedDay = (
  day: ClassifiedDay,
): day is Extract<ClassifiedDay, { kind: "backward" }> =>
  day.kind === "backward" && (day.prefix === "*" || day.prefix === "@");

const forwardClassifiedCandidate = (
  input: ClassifiedCandidateInput & {
    day: Extract<ClassifiedDay, { kind: "open" | "closed" }>;
  },
): ScheduleDateCandidateResult =>
  findClassifiedCandidate({
    context: input.context,
    month: input.month,
    offsets: Array.from(
      { length: operationalMonthLength(input.month) },
      (_, offset) => offset,
    ),
    target: input.day.kind,
    occurrence: input.day.value - 1,
  });

const backwardClassifiedCandidate = (
  input: ClassifiedCandidateInput & {
    day: Extract<ClassifiedDay, { kind: "backward" }>;
  },
): ScheduleDateCandidateResult =>
  findClassifiedCandidate({
    context: input.context,
    month: input.month,
    offsets: Array.from(
      { length: operationalMonthLength(input.month) },
      (_, index) => operationalMonthLength(input.month) - 1 - index,
    ),
    target: input.day.prefix === "*" ? "open" : "closed",
    occurrence: input.day.offset ?? 0,
  });

/** Project definition-classified open/closed schedule days. */

const classifiedDayCandidates = (
  input: ClassifiedCandidateInput,
): ScheduleDateCandidateResult | undefined => {
  if (isForwardClassifiedDay(input.day)) {
    return forwardClassifiedCandidate({
      context: input.context,
      month: input.month,
      day: input.day,
    });
  }
  if (isBackwardClassifiedDay(input.day)) {
    return backwardClassifiedCandidate({
      context: input.context,
      month: input.month,
      day: input.day,
    });
  }
  return undefined;
};

type OperationalCandidateInput = {
  parsed: ScheduleDateInterpretation;
  context: ScheduleCalendarContext;
};

const dateCandidateAt = (
  month: ScheduleOperationalMonth,
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
  month: ScheduleOperationalMonth,
  offset: number,
): ScheduleDateCandidateResult => {
  const length = operationalMonthLength(month);
  return offset < 0 || offset >= length
    ? invalidOperationalDateCandidates()
    : singleOperationalDateCandidate(dateCandidateAt(month, offset));
};

const relativeCandidate = (
  day: Extract<ScheduleDateDay, { kind: "relative" }>,
  month: ScheduleOperationalMonth,
): ScheduleDateCandidateResult => offsetCandidate(month, day.value - 1);

const backwardCandidate = (
  day: Extract<ScheduleDateDay, { kind: "backward" }>,
  month: ScheduleOperationalMonth,
): ScheduleDateCandidateResult => {
  const length = operationalMonthLength(month);
  return offsetCandidate(month, length - 1 - (day.offset ?? 0));
};

const weekdayDates = (
  day: Extract<ScheduleDateDay, { kind: "weekday" }>,
  month: ScheduleOperationalMonth,
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

const isInvalidAbsoluteWeekdayOccurrence = (
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
  month: ScheduleOperationalMonth,
): ScheduleDateCandidateResult => {
  const dates = weekdayDates(day, month);
  const date = weekdayOccurrenceDate(day, dates);
  if (isInvalidAbsoluteWeekdayOccurrence(day)) {
    return invalidOperationalDateCandidates();
  }
  return date
    ? singleOperationalDateCandidate(formatOperationalWeekday(date))
    : emptyOperationalDateCandidates();
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
  month: ScheduleOperationalMonth,
) => ScheduleDateCandidateResult;

const operationalDayHandlers: Partial<
  Record<ScheduleDateDay["kind"], OperationalDayHandler>
> = {
  relative: (day, month) =>
    isRelativeDay(day)
      ? relativeCandidate(day, month)
      : deferredOperationalDateCandidates(),
  backward: (day, month) =>
    isForwardBackwardDay(day)
      ? backwardCandidate(day, month)
      : deferredOperationalDateCandidates(),
  weekday: (day, month) =>
    isForwardWeekday(day)
      ? weekdayCandidate(day, month)
      : deferredOperationalDateCandidates(),
};

const operationalDayCandidate = (
  day: ScheduleDateDay,
  month: ScheduleOperationalMonth,
): ScheduleDateCandidateResult =>
  operationalDayHandlers[day.kind]?.(day, month) ??
  deferredOperationalDateCandidates();

type OperationalMonthResult =
  | { month: ScheduleOperationalMonth }
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
    return { result: deferredOperationalDateCandidates() };
  }
  if (isInvalidOperationalMonth(parsed.month)) {
    return { result: invalidOperationalDateCandidates() };
  }
  return { year: parsed.year, month: parsed.month };
};

const operationalMonthFor = (
  parsed: ScheduleDateInterpretation,
  context: ScheduleCalendarContext,
): OperationalMonthResult => {
  const input = fullOperationalMonthInput(parsed);
  if ("result" in input) {
    return input;
  }
  const month = resolveOperationalMonth(context, input.year, input.month);
  return month
    ? { month }
    : {
        result: { ...invalidOperationalDateCandidates(), contextInvalid: true },
      };
};

const classifiedCandidate = (
  parsed: ScheduleDateInterpretation,
  month: ScheduleOperationalMonth,
  context: ScheduleCalendarContext,
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
