export const resolveHasSchedule = (scheduleValues: string[]): boolean =>
  scheduleValues.some((value) => !/^(\d+,)?ud$/.test(value.trim()));
