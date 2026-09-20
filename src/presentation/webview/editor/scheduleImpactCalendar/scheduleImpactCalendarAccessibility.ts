import type { ScheduleImpactCalendarModel } from "./scheduleImpactCalendarModel";

export type ScheduleImpactCalendarAnnouncementLabels = Readonly<{
  filtered: (visible: number, total: number) => string;
  selected: (value: string) => string;
}>;

export const scheduleImpactCalendarAnnouncement = (
  model: ScheduleImpactCalendarModel,
  labels: ScheduleImpactCalendarAnnouncementLabels,
): string =>
  model.filtered
    ? labels.filtered(model.visibleCount, model.globalCount)
    : labels.selected(`${model.globalCount}`);

export const scheduleImpactCalendarItemAccessibleName = (
  label: string,
  stateLabel: string,
): string => `${label}; ${stateLabel}`;

export const scheduleImpactCalendarFocusSelector = (id: string): string => {
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(id)
      : id.replaceAll('"', '\\"');
  return `[data-schedule-impact-calendar-item-id="${escaped}"]`;
};
