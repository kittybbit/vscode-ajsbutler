import { scheduleImpactCalendarEnglish } from "./scheduleImpactCalendar_en";
import { scheduleImpactCalendarJapanese } from "./scheduleImpactCalendar_ja";

export type ScheduleImpactCalendarLabels = typeof scheduleImpactCalendarEnglish;

export const normalizeScheduleImpactCalendarLocale = (
  language: string | undefined,
): "en" | "ja" =>
  (language ?? "").toLowerCase() === "ja" ||
  (language ?? "").toLowerCase().startsWith("ja-")
    ? "ja"
    : "en";

export const getScheduleImpactCalendarLabels = (
  language: string | undefined,
): ScheduleImpactCalendarLabels =>
  normalizeScheduleImpactCalendarLocale(language) === "ja"
    ? scheduleImpactCalendarJapanese
    : scheduleImpactCalendarEnglish;

export { scheduleImpactCalendarEnglish, scheduleImpactCalendarJapanese };
