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

type CandidateDetailsProps = Readonly<{
  candidate: SemanticDiffScheduleImpactCandidateGroup["before"][number];
  labels: ScheduleImpactCalendarLabels;
}> &
  Omit<React.HTMLAttributes<HTMLLIElement>, "children">;

const CandidateDetails = React.forwardRef<HTMLLIElement, CandidateDetailsProps>(
  ({ candidate, labels, ...rowProps }, ref): React.ReactElement => (
    <ListItem
      {...rowProps}
      ref={ref}
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
  ),
);
CandidateDetails.displayName = "CandidateDetails";

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

type CandidateGroupCardProps = Readonly<{
  group: SemanticDiffScheduleImpactCandidateGroup;
  index: number;
  labels: ScheduleImpactCalendarLabels;
}> &
  Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title">;

const CandidateGroupCard = React.forwardRef<
  HTMLDivElement,
  CandidateGroupCardProps
>(
  (
    { group, index, labels, onFocus, onKeyDown, ...cardProps },
    ref,
  ): React.ReactElement => {
    const groupLabel = labels.candidateGroup(index + 1);
    return (
      <ResultCard
        {...cardProps}
        ref={ref}
        onFocus={(event) => {
          if (event.target === event.currentTarget) onFocus?.(event);
        }}
        onKeyDown={(event) => {
          if (event.target === event.currentTarget) onKeyDown?.(event);
        }}
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
  },
);
CandidateGroupCard.displayName = "CandidateGroupCard";

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
