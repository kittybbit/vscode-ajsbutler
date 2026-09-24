import type { AjsParameter } from "../models/ajs/AjsDocument";
import {
  createScheduleDate,
  daysInGregorianMonthOrUndefined,
  formatScheduleDate,
  interpretScheduleDateValue,
  type ScheduleDateDay,
  type ScheduleDateInterpretation,
} from "./ScheduleDate";
import {
  classifyScheduleCalendarDay,
  operationalMonthDate,
  operationalMonthLength,
  relativeScheduleDateRequiresContext,
  resolveOperationalMonth,
  type ScheduleCalendarContext,
  type ScheduleOperationalMonth,
} from "./ScheduleCalendar";

type ValidSchedulePeriod = { from: Date; to: Date };

export type ScheduleDateCandidateResult = {
  candidates: string[];
  invalid: boolean;
  deferred: boolean;
  contextInvalid?: boolean;
  contextMissing?: boolean;
  contextEvidenceId?: string;
};

type ScheduleDayClassification =
  | "open"
  | "closed"
  | { status: "missing-context" | "invalid"; evidenceId: string };

const emptyScheduleDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: false,
  deferred: false,
});

const deferredScheduleDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: false,
  deferred: true,
});

const invalidScheduleDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: true,
  deferred: false,
});

const singleScheduleDateCandidate = (
  candidate: string,
): ScheduleDateCandidateResult => ({
  candidates: [candidate],
  invalid: false,
  deferred: false,
});

const classificationFailure = (
  classification: Exclude<ScheduleDayClassification, "open" | "closed">,
): ScheduleDateCandidateResult =>
  classification.status === "invalid"
    ? {
        ...invalidScheduleDateCandidates(),
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
        result: singleScheduleDateCandidate(
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
  return result.result ?? emptyScheduleDateCandidates();
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

type ParsedScheduleDate = NonNullable<
  ReturnType<typeof interpretScheduleDateValue>
>;

type AbsoluteWeekdayInput = {
  parsed: ParsedScheduleDate & {
    year: number;
    month: number;
    day: Extract<ParsedScheduleDate["day"], { kind: "weekday" }>;
  };
  days: number;
  weekday: number;
  firstWeekday: number;
};

const absoluteBackwardCandidate = (
  parsed: ParsedScheduleDate & {
    year: number;
    month: number;
    day: Extract<ParsedScheduleDate["day"], { kind: "backward" }>;
  },
): ScheduleDateCandidateResult => {
  const days = daysInGregorianMonthOrUndefined(parsed.year, parsed.month);
  const offset = parsed.day.offset ?? 0;
  return days === undefined || offset < 0 || offset >= days
    ? invalidScheduleDateCandidates()
    : singleScheduleDateCandidate(
        formatScheduleDate(parsed.year, parsed.month, days - offset),
      );
};

const lastWeekdayCandidate = (
  input: Omit<AbsoluteWeekdayInput, "firstWeekday">,
): ScheduleDateCandidateResult => {
  const lastWeekday = createScheduleDate(
    input.parsed.year,
    input.parsed.month,
    input.days,
  ).getUTCDay();
  const day = input.days - ((lastWeekday - input.weekday + 7) % 7);
  return singleScheduleDateCandidate(
    formatScheduleDate(input.parsed.year, input.parsed.month, day),
  );
};

const forwardWeekdayCandidate = (
  input: AbsoluteWeekdayInput,
): ScheduleDateCandidateResult =>
  isInvalidWeekdayOccurrence(input.parsed.day)
    ? invalidScheduleDateCandidates()
    : candidateForWeekdayOccurrence(input);

const isInvalidWeekdayOccurrence = (
  day: Extract<ParsedScheduleDate["day"], { kind: "weekday" }>,
): boolean =>
  typeof day.occurrence === "number" &&
  (day.occurrence < 1 || day.occurrence > 5);

const weekdayOccurrenceNumber = (
  occurrence: number | "b" | undefined,
): number => (typeof occurrence === "number" ? occurrence : 1);

const candidateForWeekdayOccurrence = (
  input: AbsoluteWeekdayInput & { firstWeekday: number },
): ScheduleDateCandidateResult => {
  const occurrence = weekdayOccurrenceNumber(input.parsed.day.occurrence);
  const day =
    1 + ((input.weekday - input.firstWeekday + 7) % 7) + (occurrence - 1) * 7;
  return day > input.days
    ? emptyScheduleDateCandidates()
    : singleScheduleDateCandidate(
        formatScheduleDate(input.parsed.year, input.parsed.month, day),
      );
};

const absoluteWeekdayCandidate = (
  parsed: ParsedScheduleDate & {
    year: number;
    month: number;
    day: Extract<ParsedScheduleDate["day"], { kind: "weekday" }>;
  },
): ScheduleDateCandidateResult => {
  const days = daysInGregorianMonthOrUndefined(parsed.year, parsed.month);
  if (days === undefined) {
    return invalidScheduleDateCandidates();
  }
  const weekday = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
    parsed.day.weekday,
  );
  const firstWeekday = createScheduleDate(
    parsed.year,
    parsed.month,
    1,
  ).getUTCDay();
  return parsed.day.occurrence === "b"
    ? lastWeekdayCandidate({ parsed, days, weekday })
    : forwardWeekdayCandidate({ parsed, days, weekday, firstWeekday });
};

const exactCalendarDate = (
  parsed: ParsedScheduleDate & {
    year: number;
    month: number;
    day: Extract<ParsedScheduleDate["day"], { kind: "calendar" }>;
  },
): ScheduleDateCandidateResult =>
  singleScheduleDateCandidate(
    `${String(parsed.year).padStart(4, "0")}-${String(parsed.month).padStart(2, "0")}-${String(parsed.day.value).padStart(2, "0")}`,
  );

const calendarCandidatesForYears = (input: {
  years: number[];
  day: string;
  month?: number;
}): ScheduleDateCandidateResult =>
  input.month === undefined
    ? {
        candidates: input.years.flatMap((year) =>
          Array.from(
            { length: 12 },
            (_, index) =>
              `${year}-${String(index + 1).padStart(2, "0")}-${input.day}`,
          ),
        ),
        invalid: false,
        deferred: false,
      }
    : {
        candidates: input.years.map(
          (year) =>
            `${year}-${String(input.month).padStart(2, "0")}-${input.day}`,
        ),
        invalid: false,
        deferred: false,
      };

const calendarCandidates = (
  parsed: ParsedScheduleDate & {
    day: Extract<ParsedScheduleDate["day"], { kind: "calendar" }>;
  },
  period: ValidSchedulePeriod,
): ScheduleDateCandidateResult => {
  const day = String(parsed.day.value).padStart(2, "0");
  if (parsed.year !== undefined && parsed.month !== undefined) {
    return exactCalendarDate({
      ...parsed,
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
    });
  }
  const years = Array.from(
    { length: period.to.getUTCFullYear() - period.from.getUTCFullYear() + 1 },
    (_, index) => period.from.getUTCFullYear() + index,
  );
  return calendarCandidatesForYears({ years, day, month: parsed.month });
};

const hasFullDate = (
  parsed: ParsedScheduleDate,
): parsed is ParsedScheduleDate & { year: number; month: number } =>
  parsed.year !== undefined && parsed.month !== undefined;

const isAbsoluteBackward = (
  parsed: ParsedScheduleDate,
): parsed is ParsedScheduleDate & {
  year: number;
  month: number;
  day: Extract<ParsedScheduleDate["day"], { kind: "backward" }>;
} =>
  hasFullDate(parsed) &&
  parsed.day.kind === "backward" &&
  parsed.day.prefix === undefined;

const isAbsoluteWeekday = (
  parsed: ParsedScheduleDate,
): parsed is ParsedScheduleDate & {
  year: number;
  month: number;
  day: Extract<ParsedScheduleDate["day"], { kind: "weekday" }>;
} =>
  hasFullDate(parsed) &&
  parsed.day.kind === "weekday" &&
  parsed.day.prefix === "";

const calendarCandidate = (
  parsed: ParsedScheduleDate,
  period: ValidSchedulePeriod,
): ScheduleDateCandidateResult | undefined =>
  parsed.day.kind === "calendar"
    ? calendarCandidates({ ...parsed, day: parsed.day }, period)
    : undefined;

const absoluteCandidates = (
  parsed: ParsedScheduleDate,
  period: ValidSchedulePeriod,
): ScheduleDateCandidateResult => {
  if (isAbsoluteBackward(parsed)) {
    return absoluteBackwardCandidate({
      ...parsed,
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
    });
  }
  if (isAbsoluteWeekday(parsed)) {
    return absoluteWeekdayCandidate({
      ...parsed,
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
    });
  }
  return calendarCandidate(parsed, period) ?? deferredScheduleDateCandidates();
};

const relativeCandidates = (
  parsed: ParsedScheduleDate,
  context: ScheduleCalendarContext | undefined,
): ScheduleDateCandidateResult =>
  context
    ? operationalDateCandidates({ parsed, context })
    : deferredScheduleDateCandidates();

/** Route one interpreted schedule date to absolute or calendar-relative candidates. */
export const resolveScheduleDateCandidates = (input: {
  parameter: AjsParameter;
  period: ValidSchedulePeriod;
  calendarContext?: ScheduleCalendarContext;
}): ScheduleDateCandidateResult => {
  const parsed = interpretScheduleDateValue(input.parameter.value);
  if (!parsed) {
    return invalidScheduleDateCandidates();
  }
  return relativeScheduleDateRequiresContext(parsed)
    ? relativeCandidates(parsed, input.calendarContext)
    : absoluteCandidates(parsed, input.period);
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
    ? invalidScheduleDateCandidates()
    : singleScheduleDateCandidate(dateCandidateAt(month, offset));
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
  month: ScheduleOperationalMonth,
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
  month: ScheduleOperationalMonth,
): ScheduleDateCandidateResult =>
  operationalDayHandlers[day.kind]?.(day, month) ??
  deferredScheduleDateCandidates();

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
    return { result: deferredScheduleDateCandidates() };
  }
  if (isInvalidOperationalMonth(parsed.month)) {
    return { result: invalidScheduleDateCandidates() };
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
    : { result: { ...invalidScheduleDateCandidates(), contextInvalid: true } };
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
const operationalDateCandidates = ({
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
