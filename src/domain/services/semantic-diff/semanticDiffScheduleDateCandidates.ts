import type { AjsParameter } from "../../models/ajs/AjsDocument";
import { interpretScheduleDateValue } from "../../models/parameters/scheduleDateInterpreter";
import {
  relativeScheduleDateRequiresContext,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";
import {
  deferredScheduleDateCandidates,
  emptyScheduleDateCandidates,
  invalidScheduleDateCandidates,
  singleScheduleDateCandidate,
  type ScheduleDateCandidateResult,
  type ValidSchedulePeriod,
} from "./semanticDiffScheduleCandidateTypes";
import {
  createScheduleDate,
  daysInGregorianMonthOrUndefined,
  formatScheduleDate,
} from "./semanticDiffScheduleDateMath";
import { operationalDateCandidates } from "./semanticDiffScheduleOperationalCandidates";

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
  context: SemanticDiffScheduleCalendarContext | undefined,
): ScheduleDateCandidateResult =>
  context
    ? operationalDateCandidates({ parsed, context })
    : deferredScheduleDateCandidates();

/** Route one interpreted schedule date to absolute or calendar-relative candidates. */
export const scheduleDateCandidates = (input: {
  parameter: AjsParameter;
  period: ValidSchedulePeriod;
  calendarContext?: SemanticDiffScheduleCalendarContext;
}): ScheduleDateCandidateResult => {
  const parsed = interpretScheduleDateValue(input.parameter.value);
  if (!parsed) {
    return invalidScheduleDateCandidates();
  }
  return relativeScheduleDateRequiresContext(parsed)
    ? relativeCandidates(parsed, input.calendarContext)
    : absoluteCandidates(parsed, input.period);
};
