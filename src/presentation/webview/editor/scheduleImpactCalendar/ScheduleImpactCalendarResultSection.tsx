import React from "react";
import ResultSection from "../shared/result/ResultSection";
import ResultEmptyState from "../shared/result/ResultEmptyState";
import { ScheduleImpactCalendarBoundedList } from "./ScheduleImpactCalendarBoundedList";

export const ScheduleImpactCalendarResultSection = ({
  title,
  count,
  globalCount,
  visibleCount,
  rows,
  emptyLabel,
}: Readonly<{
  title: string;
  count: string;
  globalCount: number;
  visibleCount: number;
  rows: readonly React.ReactElement[];
  emptyLabel: string;
}>): React.ReactElement => (
  <ResultSection
    title={title}
    ariaLabel={title}
    count={count}
    dataGlobalCount={globalCount}
    dataVisibleCount={visibleCount}
  >
    {rows.length === 0 ? (
      <ResultEmptyState role="alert">{emptyLabel}</ResultEmptyState>
    ) : (
      <ScheduleImpactCalendarBoundedList items={rows} ariaLabel={title} />
    )}
  </ResultSection>
);
