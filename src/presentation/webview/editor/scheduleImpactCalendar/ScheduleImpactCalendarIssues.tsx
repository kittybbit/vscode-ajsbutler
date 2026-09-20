import React from "react";
import type { SemanticDiffScheduleImpactIssue } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultCard from "../shared/result/ResultCard";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import { ScheduleImpactCalendarResultSection } from "./ScheduleImpactCalendarResultSection";
import type { ScheduleImpactCalendarModel } from "./scheduleImpactCalendarModel";

const internalIssueDetailKeys = new Set([
  "id",
  "unitId",
  "sourceUnitId",
  "targetUnitId",
  "identityDecisionId",
  "sourceChangeRef",
  "removedSources",
]);

const IssueDetail = ({
  detail,
}: Readonly<{ detail: unknown }>): React.ReactElement => (
  <>
    {JSON.stringify(detail, (key, value: unknown) =>
      internalIssueDetailKeys.has(key) ? undefined : value,
    )}
  </>
);

const issueFacts = (
  issue: SemanticDiffScheduleImpactIssue,
  labels: ScheduleImpactCalendarLabels,
): ReadonlyArray<{ label: string; value: React.ReactNode }> => [
  { label: labels.occurrence, value: issue.occurrenceOrdinal },
  { label: labels.kind, value: issue.kind },
  { label: labels.side, value: issue.side ?? labels.none },
  { label: labels.reason, value: issue.reasonCode },
  { label: labels.targetKind, value: issue.targetKind },
  { label: labels.targetId, value: issue.targetId ?? labels.none },
  { label: labels.unitPath, value: issue.targetPath ?? labels.none },
  { label: labels.parameterKey, value: issue.parameterKey ?? labels.none },
  { label: labels.detail, value: <IssueDetail detail={issue.detail} /> },
];

const IssueCard = ({
  issue,
  labels,
}: Readonly<{
  issue: SemanticDiffScheduleImpactIssue;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const issueLabel = `${labels.issue}: ${issue.kind}, ${labels.occurrence} ${issue.occurrenceOrdinal}, ${labels.targetId} ${issue.targetId ?? labels.none}`;
  return (
    <ResultCard
      ariaLabel={issueLabel}
      dataAttributes={{ "data-schedule-impact-calendar-issue-id": issue.id }}
      sx={{
        p: 0,
        "& .MuiCardContent-root": {
          p: 0.5,
          "&:last-child": { pb: 0.5 },
        },
      }}
    >
      <ResultKeyValueList dense items={issueFacts(issue, labels)} />
    </ResultCard>
  );
};

export const ScheduleImpactCalendarIssues = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const rows = model.visibleIssues.map((issue) => (
    <IssueCard key={issue.id} issue={issue} labels={labels} />
  ));
  return (
    <ScheduleImpactCalendarResultSection
      title={labels.issues}
      count={`${model.visibleIssues.length}/${model.issues.length}`}
      globalCount={model.issues.length}
      visibleCount={model.visibleIssues.length}
      rows={rows}
      emptyLabel={labels.emptyIssues}
    />
  );
};
