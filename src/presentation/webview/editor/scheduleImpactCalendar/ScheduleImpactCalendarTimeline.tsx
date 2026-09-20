import React from "react";
import Box from "@mui/material/Box";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultEmptyState from "../shared/result/ResultEmptyState";
import type { ScheduleImpactCalendarModel } from "./scheduleImpactCalendarModel";
import {
  TimelineList,
  useTimelineNavigation,
} from "./ScheduleImpactCalendarTimelineHelpers";

export const ScheduleImpactCalendarTimeline = ({
  model,
  labels,
  onAnnouncement,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  onAnnouncement: (value: string) => void;
}>): React.ReactElement => {
  const navigation = useTimelineNavigation(model, labels, onAnnouncement);
  return (
    <Box component="section" aria-label={labels.timeline}>
      <TimelineList model={model} labels={labels} navigation={navigation} />
      {model.visibleItems.length === 0 && (
        <ResultEmptyState>{labels.noResults}</ResultEmptyState>
      )}
    </Box>
  );
};
