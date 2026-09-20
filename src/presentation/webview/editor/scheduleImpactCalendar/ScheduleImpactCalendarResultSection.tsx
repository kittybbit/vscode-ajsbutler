import React from "react";
import ResultSection from "../shared/result/ResultSection";
import { ScheduleImpactCalendarSectionBody } from "./ScheduleImpactCalendarSectionBody";

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
    <ScheduleImpactCalendarSectionBody
      rows={rows}
      ariaLabel={title}
      emptyLabel={emptyLabel}
    />
  </ResultSection>
);
