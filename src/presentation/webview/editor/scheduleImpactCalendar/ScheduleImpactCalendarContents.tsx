import React, { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffScheduleImpact } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  buildScheduleImpactCalendarModel,
  type ScheduleImpactCalendarFilters,
} from "./scheduleImpactCalendarModel";
import { scheduleImpactCalendarAnnouncement } from "./scheduleImpactCalendarAccessibility";
import { getScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import { ScheduleImpactCalendarFilters as CalendarFilters } from "./ScheduleImpactCalendarFilters";
import { ScheduleImpactCalendarHeader } from "./ScheduleImpactCalendarHeader";
import { ScheduleImpactCalendarSections } from "./ScheduleImpactCalendarSections";
import { ScheduleImpactCalendarTimeline } from "./ScheduleImpactCalendarTimeline";
import ResultSection from "../shared/result/ResultSection";

export type ScheduleImpactCalendarContentsProps = Readonly<{
  sidecar: SemanticDiffScheduleImpact;
  language?: string;
}>;

export const ScheduleImpactCalendarContents = ({
  sidecar,
  language = "en",
}: ScheduleImpactCalendarContentsProps): React.ReactElement => {
  const labels = getScheduleImpactCalendarLabels(language);
  const [filters, setFilters] =
    useState<Partial<ScheduleImpactCalendarFilters>>();
  const model = useMemo(
    () => buildScheduleImpactCalendarModel(sidecar, filters),
    [sidecar, filters],
  );
  const [announcement, setAnnouncement] = useState("");
  useEffect(
    () => setAnnouncement(scheduleImpactCalendarAnnouncement(model, labels)),
    [labels, model],
  );
  return (
    <Stack
      component="main"
      aria-labelledby="schedule-impact-calendar-title"
      data-testid="schedule-impact-calendar"
      direction="column"
      spacing={1}
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        height: "100vh",
        overflow: "auto",
        p: { xs: 1, sm: 2 },
        overflowWrap: "anywhere",
        "@media (prefers-reduced-motion: reduce)": {
          "*": {
            scrollBehavior: "auto !important",
            transition: "none !important",
            animation: "none !important",
          },
        },
      }}
    >
      <ScheduleImpactCalendarHeader model={model} labels={labels} />
      <Typography
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{ minHeight: "1.5em" }}
      >
        {announcement}
      </Typography>
      <ResultSection title={labels.filters} ariaLabel={labels.filters}>
        <CalendarFilters
          model={model}
          labels={labels}
          onChange={(next) => {
            setFilters(next);
            setAnnouncement(labels.filterChanged);
          }}
        />
      </ResultSection>
      <ScheduleImpactCalendarSections model={model} labels={labels} />
      <ScheduleImpactCalendarTimeline
        model={model}
        labels={labels}
        onAnnouncement={setAnnouncement}
      />
    </Stack>
  );
};

export default ScheduleImpactCalendarContents;
