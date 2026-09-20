import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { ScheduleImpactCalendarModel } from "./scheduleImpactCalendarModel";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultStatusChip from "../shared/result/ResultStatusChip";

export const ScheduleImpactCalendarHeader = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => (
  <AppBar
    component="header"
    position="sticky"
    color="default"
    elevation={1}
    sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar }}
  >
    <Toolbar sx={{ gap: 1.25, minHeight: "3.5rem", flexWrap: "wrap", py: 1 }}>
      <Box sx={{ minWidth: 0, flex: "1 1 20rem" }}>
        <Typography
          component="h1"
          variant="h4"
          id="schedule-impact-calendar-title"
          sx={{ overflowWrap: "anywhere" }}
        >
          {labels.title}
        </Typography>
        <Typography component="p" sx={{ m: 0 }}>
          {labels.period}: [{model.period.from}, {model.period.to})
        </Typography>
      </Box>
      <ResultStatusChip
        label={labels.results(model.visibleCount, model.globalCount)}
        role="status"
        ariaLive="polite"
        dataTestId="schedule-impact-calendar-result-count"
      />
    </Toolbar>
  </AppBar>
);

export default ScheduleImpactCalendarHeader;
