import React from "react";
import ResultEmptyState from "../shared/result/ResultEmptyState";
import { ScheduleImpactCalendarBoundedList } from "./ScheduleImpactCalendarBoundedList";

export const ScheduleImpactCalendarSectionBody = ({
  rows,
  ariaLabel,
  emptyLabel,
}: Readonly<{
  rows: readonly React.ReactElement[];
  ariaLabel: string;
  emptyLabel: string;
}>): React.ReactElement =>
  rows.length === 0 ? (
    <ResultEmptyState role="alert">{emptyLabel}</ResultEmptyState>
  ) : (
    <ScheduleImpactCalendarBoundedList items={rows} ariaLabel={ariaLabel} />
  );
