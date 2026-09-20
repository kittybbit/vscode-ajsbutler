import React from "react";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import type { SemanticDiffScheduleImpactCandidateGroup } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultCard from "../shared/result/ResultCard";
import ResultComparison from "../shared/result/ResultComparison";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import { ScheduleImpactCalendarBoundedList } from "./ScheduleImpactCalendarBoundedList";
import { ScheduleImpactCalendarResultSection } from "./ScheduleImpactCalendarResultSection";
import type { ScheduleImpactCalendarModel } from "./scheduleImpactCalendarModel";

const CandidateDetails = ({
  candidate,
  labels,
}: Readonly<{
  candidate: SemanticDiffScheduleImpactCandidateGroup["before"][number];
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => (
  <ListItem
    component="li"
    data-schedule-impact-calendar-candidate-id={candidate.id}
    sx={{ display: "block" }}
  >
    <ResultKeyValueList
      items={[
        { label: labels.unitName, value: candidate.unitName },
        { label: labels.unitPath, value: candidate.unitPath },
      ]}
    />
  </ListItem>
);

const CandidateSide = ({
  candidates,
  label,
  labels,
}: Readonly<{
  candidates: readonly SemanticDiffScheduleImpactCandidateGroup["before"][number][];
  label: string;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement =>
  candidates.length === 0 ? (
    <Typography>{labels.emptyCandidates}</Typography>
  ) : (
    <ScheduleImpactCalendarBoundedList
      items={candidates.map((candidate) => (
        <CandidateDetails
          key={candidate.id}
          candidate={candidate}
          labels={labels}
        />
      ))}
      ariaLabel={label}
    />
  );

const CandidateGroupCard = ({
  group,
  index,
  labels,
}: Readonly<{
  group: SemanticDiffScheduleImpactCandidateGroup;
  index: number;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const groupLabel = labels.candidateGroup(index + 1);
  return (
    <ResultCard
      title={groupLabel}
      ariaLabel={groupLabel}
      dataAttributes={{
        "data-schedule-impact-calendar-candidate-group-id": group.id,
      }}
      sx={{ p: 1, mb: 1 }}
    >
      <ResultComparison
        beforeLabel={labels.candidateBefore}
        afterLabel={labels.candidateAfter}
        before={
          <CandidateSide
            candidates={group.before}
            label={`${groupLabel}: ${labels.candidateBefore}`}
            labels={labels}
          />
        }
        after={
          <CandidateSide
            candidates={group.after}
            label={`${groupLabel}: ${labels.candidateAfter}`}
            labels={labels}
          />
        }
        ariaLabel={`${groupLabel}: ${labels.candidateBefore} / ${labels.candidateAfter}`}
      />
    </ResultCard>
  );
};

export const ScheduleImpactCalendarCandidates = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const rows = model.candidateGroups.map((group, index) => (
    <CandidateGroupCard
      key={group.id}
      group={group}
      index={index}
      labels={labels}
    />
  ));
  return (
    <ScheduleImpactCalendarResultSection
      title={labels.candidates}
      count={`${model.candidateGroups.length}/${model.candidateGroups.length}`}
      globalCount={model.candidateGroups.length}
      visibleCount={model.candidateGroups.length}
      rows={rows}
      emptyLabel={labels.emptyCandidates}
    />
  );
};
