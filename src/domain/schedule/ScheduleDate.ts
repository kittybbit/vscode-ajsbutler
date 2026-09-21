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

const scheduleDateWeekdayPattern = /^(\+?)(su|mo|tu|we|th|fr|sa)(?::(\d|b))?$/;

const scheduleDateWeekdays = new Set<ScheduleDateWeekday>([
  "su",
  "mo",
  "tu",
  "we",
  "th",
  "fr",
  "sa",
]);

const interpretScheduleDateDay = (
  dayValue: string,
): ScheduleDateDay | undefined => {
  const numericDay = /^([+*@])?(\d{2})$/.exec(dayValue);
  if (numericDay) {
    const value = Number(numericDay[2]);
    switch (numericDay[1]) {
      case "+":
        return { kind: "relative", value };
      case "*":
        return { kind: "open", value };
      case "@":
        return { kind: "closed", value };
      default:
        return { kind: "calendar", value };
    }
  }

  const backwardDay = /^([+*@])?b(?:-(\d{2}))?$/.exec(dayValue);
  if (backwardDay) {
    return {
      kind: "backward",
      prefix: backwardDay[1] as "+" | "*" | "@" | undefined,
      offset: backwardDay[2] === undefined ? undefined : Number(backwardDay[2]),
    };
  }

  const weekday = scheduleDateWeekdayPattern.exec(dayValue);
  if (weekday && scheduleDateWeekdays.has(weekday[2] as ScheduleDateWeekday)) {
    const occurrence = weekday[3];
    return {
      kind: "weekday",
      prefix: weekday[1] as "+" | "",
      weekday: weekday[2] as ScheduleDateWeekday,
      occurrence:
        occurrence === undefined
          ? undefined
          : occurrence === "b"
            ? "b"
            : Number(occurrence),
    };
  }

  if (dayValue === "en") {
    return { kind: "en" };
  }

  if (dayValue === "ud") {
    return { kind: "ud" };
  }

  return undefined;
};

export const interpretScheduleDateValue = (
  rawValue: string | undefined,
): ScheduleDateInterpretation | undefined => {
  const matched = scheduleDateValuePattern.exec(rawValue ?? "");
  if (!matched) {
    return undefined;
  }

  const dayValue = matched[5];
  const day = interpretScheduleDateDay(dayValue);
  if (!day) {
    return undefined;
  }

  return {
    rule: matched[1] === undefined ? 1 : Number(matched[2]),
    hasExplicitRuleNumber: matched[1] !== undefined,
    year: matched[3] === undefined ? undefined : Number(matched[3]),
    month: matched[4] === undefined ? undefined : Number(matched[4]),
    dayValue,
    day,
  };
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
