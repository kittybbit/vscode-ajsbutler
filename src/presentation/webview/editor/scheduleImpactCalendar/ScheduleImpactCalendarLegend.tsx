import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultSection from "../shared/result/ResultSection";

type LegendValue = Readonly<{
  label: string;
  icon: string;
  pattern: string;
}>;

const LegendItems = ({
  ariaLabel,
  values,
}: Readonly<{
  ariaLabel: string;
  values: readonly LegendValue[];
}>): React.ReactElement => (
  <List component="ul" aria-label={ariaLabel} sx={{ pl: 3, m: 0 }}>
    {values.map((value) => (
      <ListItem
        component="li"
        key={value.label}
        data-legend-pattern={value.pattern}
        style={{ borderBottom: `2px ${value.pattern} currentColor` }}
      >
        <Typography component="span" aria-hidden="true" sx={{ mr: 1 }}>
          {value.icon}
        </Typography>
        <Typography component="span">{value.label}</Typography>
      </ListItem>
    ))}
  </List>
);

export const ScheduleImpactCalendarLegend = ({
  labels,
}: Readonly<{ labels: ScheduleImpactCalendarLabels }>): React.ReactElement => {
  const runStates = [
    { label: labels.unchanged, icon: "●", pattern: "solid" },
    { label: labels.added, icon: "+", pattern: "dashed" },
    { label: labels.removed, icon: "−", pattern: "dotted" },
    { label: labels.changedTime, icon: "↔", pattern: "double" },
  ];
  const outcomes = [
    { label: labels.supportedRuns, icon: "●", pattern: "solid" },
    { label: labels.noRuns, icon: "○", pattern: "dashed" },
    { label: labels.partial, icon: "△", pattern: "dotted" },
    { label: labels.uncalculated, icon: "?", pattern: "double" },
  ];
  return (
    <ResultSection
      title={labels.legend}
      ariaLabel={labels.legend}
      dataTestId="schedule-impact-calendar-legend"
      sx={{ mb: 0 }}
    >
      <Typography component="h3" variant="body1">
        {labels.runState}
      </Typography>
      <LegendItems ariaLabel={labels.runState} values={runStates} />
      <Typography component="h3" variant="body1">
        {labels.outcome}
      </Typography>
      <LegendItems ariaLabel={labels.outcome} values={outcomes} />
    </ResultSection>
  );
};
