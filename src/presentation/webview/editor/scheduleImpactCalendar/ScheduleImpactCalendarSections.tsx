import React from "react";
import Stack from "@mui/material/Stack";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import type { ScheduleImpactCalendarModel } from "./scheduleImpactCalendarModel";
import { ScheduleImpactCalendarCandidates } from "./ScheduleImpactCalendarCandidates";
import { ScheduleImpactCalendarIssues } from "./ScheduleImpactCalendarIssues";
import { ScheduleImpactCalendarLegend } from "./ScheduleImpactCalendarLegend";
import { RootStatus, ValidNoRuns } from "./ScheduleImpactCalendarRootSections";

export const ScheduleImpactCalendarSections = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => (
  <Stack spacing={1.5}>
    <RootStatus model={model} labels={labels} />
    <ValidNoRuns model={model} labels={labels} />
    <ScheduleImpactCalendarCandidates model={model} labels={labels} />
    <ScheduleImpactCalendarIssues model={model} labels={labels} />
    <ScheduleImpactCalendarLegend labels={labels} />
  </Stack>
);
