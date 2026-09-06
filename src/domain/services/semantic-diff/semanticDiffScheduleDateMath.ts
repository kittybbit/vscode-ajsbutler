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
