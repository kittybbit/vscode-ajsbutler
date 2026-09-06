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
