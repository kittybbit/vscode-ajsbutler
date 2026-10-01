export type ScheduleDateWeekday =
  | "su"
  | "mo"
  | "tu"
  | "we"
  | "th"
  | "fr"
  | "sa";

export type ScheduleDateDay =
  | { kind: "calendar"; value: number }
  | { kind: "relative"; value: number }
  | { kind: "open"; value: number }
  | { kind: "closed"; value: number }
  | {
      kind: "backward";
      prefix: "+" | "*" | "@" | undefined;
      offset: number | undefined;
    }
  | {
      kind: "weekday";
      prefix: "+" | "";
      weekday: ScheduleDateWeekday;
      occurrence: number | "b" | undefined;
    }
  | { kind: "en" }
  | { kind: "ud" };

export type ScheduleDateInterpretation = {
  rule: number;
  hasExplicitRuleNumber: boolean;
  year: number | undefined;
  month: number | undefined;
  dayValue: string;
  day: ScheduleDateDay;
};

const scheduleDateValuePattern =
  /^((\d{1,3}),)?(?:(?:(\d{4})\/)?(\d{2})\/)?(.+)$/;

type ScheduleDateDayDecoder = (dayValue: string) => ScheduleDateDay | undefined;

const numericDayKinds = {
  "": "calendar",
  "+": "relative",
  "*": "open",
  "@": "closed",
} as const;

const backwardDayOffset = (value: string | undefined): number | undefined =>
  value === undefined ? undefined : Number(value);

const decodeNumericDay: ScheduleDateDayDecoder = (dayValue) => {
  const matched = /^([+*@])?(\d{2})$/.exec(dayValue);
  return matched
    ? {
        kind: numericDayKinds[
          (matched[1] ?? "") as keyof typeof numericDayKinds
        ],
        value: Number(matched[2]),
      }
    : undefined;
};

const decodeBackwardDay: ScheduleDateDayDecoder = (dayValue) => {
  const matched = /^([+*@])?b(?:-(\d{2}))?$/.exec(dayValue);
  return matched
    ? {
        kind: "backward",
        prefix: matched[1] as "+" | "*" | "@" | undefined,
        offset: backwardDayOffset(matched[2]),
      }
    : undefined;
};

const decodeWeekday: ScheduleDateDayDecoder = (dayValue) => {
  const matched = /^(\+?)(su|mo|tu|we|th|fr|sa)(?::(\d|b))?$/.exec(dayValue);
  return matched
    ? {
        kind: "weekday",
        prefix: matched[1] as "+" | "",
        weekday: matched[2] as ScheduleDateWeekday,
        occurrence: weekdayOccurrence(matched[3]),
      }
    : undefined;
};

const weekdayOccurrenceSpecialCases: Readonly<Partial<Record<string, "b">>> = {
  b: "b",
};

const weekdayOccurrence = (
  occurrence: string | undefined,
): number | "b" | undefined =>
  occurrence === undefined
    ? undefined
    : (weekdayOccurrenceSpecialCases[occurrence] ?? Number(occurrence));

const decodeScheduleDateKeyword: ScheduleDateDayDecoder = (dayValue) => {
  if (dayValue === "en") {
    return { kind: "en" };
  }
  if (dayValue === "ud") {
    return { kind: "ud" };
  }
  return undefined;
};

const scheduleDateDayDecoders: readonly ScheduleDateDayDecoder[] = [
  decodeNumericDay,
  decodeBackwardDay,
  decodeWeekday,
  decodeScheduleDateKeyword,
];

const interpretScheduleDateDay = (
  dayValue: string,
): ScheduleDateDay | undefined =>
  scheduleDateDayDecoders
    .map((decode) => decode(dayValue))
    .find(isScheduleDateDay);

const isScheduleDateDay = (
  day: ScheduleDateDay | undefined,
): day is ScheduleDateDay => day !== undefined;

const scheduleDateRuleNumber = (matched: RegExpExecArray): number =>
  matched[1] === undefined ? 1 : Number(matched[2]);

const scheduleDateYear = (matched: RegExpExecArray): number | undefined =>
  matched[3] === undefined ? undefined : Number(matched[3]);

const scheduleDateMonth = (matched: RegExpExecArray): number | undefined =>
  matched[4] === undefined ? undefined : Number(matched[4]);

const scheduleDateInterpretation = (
  matched: RegExpExecArray,
  day: ScheduleDateDay,
): ScheduleDateInterpretation => ({
  rule: scheduleDateRuleNumber(matched),
  hasExplicitRuleNumber: matched[1] !== undefined,
  year: scheduleDateYear(matched),
  month: scheduleDateMonth(matched),
  dayValue: matched[5],
  day,
});

export const interpretScheduleDateValue = (
  rawValue: string | undefined,
): ScheduleDateInterpretation | undefined => {
  const matched = scheduleDateValuePattern.exec(rawValue ?? "");
  if (matched === null) {
    return undefined;
  }
  const day = interpretScheduleDateDay(matched[5]);
  if (day === undefined) {
    return undefined;
  }
  return scheduleDateInterpretation(matched, day);
};

export const daysInGregorianMonth = (year: number, month: number): number => {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

export const isInvalidCalendarMonth = (month: number): boolean =>
  month < 1 || month > 12;

export const isInvalidCalendarDay = (day: number): boolean =>
  day < 1 || day > 31;

export const isImpossibleYearDay = (
  year: number | undefined,
  month: number,
  day: number,
): boolean => year !== undefined && day > daysInGregorianMonth(year, month);

export const createScheduleDate = (
  year: number,
  month: number,
  day: number,
): Date => {
  const date = new Date(Date.UTC(1970, 0, 1));
  date.setUTCFullYear(year, month - 1, day);
  return date;
};

const scheduleDateParts = (
  value: string,
): { year: number; month: number; day: number } | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return matched
    ? {
        year: Number(matched[1]),
        month: Number(matched[2]),
        day: Number(matched[3]),
      }
    : undefined;
};

const isSameScheduleDate = (
  date: Date,
  parts: { year: number; month: number; day: number },
): boolean =>
  date.getUTCFullYear() === parts.year &&
  date.getUTCMonth() === parts.month - 1 &&
  date.getUTCDate() === parts.day;

/** Parse a canonical UTC date without allowing Date to normalize invalid days. */
export const toUtcDate = (value: string): Date | undefined => {
  const parts = scheduleDateParts(value);
  if (!parts) {
    return undefined;
  }
  const date = createScheduleDate(parts.year, parts.month, parts.day);
  return isSameScheduleDate(date, parts) ? date : undefined;
};

export const formatScheduleDate = (
  year: number,
  month: number,
  day: number,
): string =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const daysInGregorianMonthOrUndefined = (
  year: number,
  month: number,
): number | undefined =>
  isInvalidCalendarMonth(month) ? undefined : daysInGregorianMonth(year, month);
