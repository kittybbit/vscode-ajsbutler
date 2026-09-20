import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffScheduleImpactRootSide } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  getScheduleImpactCalendarRootOutcomes,
  type ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import { ScheduleImpactCalendarBoundedList } from "./ScheduleImpactCalendarBoundedList";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultCard from "../shared/result/ResultCard";
import ResultEmptyState from "../shared/result/ResultEmptyState";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import ResultSection from "../shared/result/ResultSection";
import ResultStatusChip from "../shared/result/ResultStatusChip";

const ScheduleImpactCalendarIssueDetail = ({
  detail,
}: Readonly<{ detail: unknown }>): React.ReactElement => (
  <>{JSON.stringify(detail)}</>
);

const RootStatus = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const outcomeLabel = (outcome: string): string =>
    outcome === "supported-runs"
      ? labels.supportedRuns
      : outcome === "valid-no-runs"
        ? labels.noRuns
        : outcome === "partial"
          ? labels.partial
          : labels.uncalculated;
  const sideDetails = (
    side: SemanticDiffScheduleImpactRootSide | null,
  ): React.ReactElement => (
    <ResultKeyValueList
      dense
      items={
        side
          ? [
              { label: labels.side, value: side.side },
              { label: labels.unitId, value: side.unitId },
              { label: labels.unitName, value: side.unitName },
              { label: labels.unitPath, value: side.unitPath },
              { label: labels.outcome, value: outcomeLabel(side.outcome) },
            ]
          : [{ label: labels.side, value: labels.absentSide }]
      }
    />
  );
  const rows = model.visibleRootOptions.map((root) => {
    const sourceRoot = model.visibleRoots.find(
      (candidate) => candidate.id === root.id,
    );
    const outcomes = sourceRoot
      ? getScheduleImpactCalendarRootOutcomes(sourceRoot)
      : [];
    return (
      <ListItem
        component="li"
        key={root.id}
        data-schedule-impact-calendar-root-id={root.id}
        sx={{ display: "block", py: 0.5 }}
      >
        <ResultCard ariaLabel={`${labels.id}: ${root.id}`} sx={{ p: 0 }}>
          <ResultKeyValueList
            items={[
              { label: labels.id, value: root.id },
              { label: labels.unitPath, value: root.label },
              {
                label: labels.outcome,
                value: (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    {outcomes.map((outcome) => (
                      <ResultStatusChip
                        key={outcome}
                        label={outcomeLabel(outcome)}
                      />
                    ))}
                  </Stack>
                ),
              },
              ...(sourceRoot
                ? [
                    {
                      label: labels.before,
                      value: sideDetails(sourceRoot.before),
                    },
                    {
                      label: labels.after,
                      value: sideDetails(sourceRoot.after),
                    },
                  ]
                : []),
              ...(root.scopeTransition
                ? [
                    {
                      label: labels.scopeTransition,
                      value:
                        root.scopeTransition === "added-root-scope"
                          ? labels.addedRootScope
                          : labels.removedRootScope,
                    },
                    {
                      label: labels.identityDecisionId,
                      value:
                        sourceRoot?.scopeTransition?.identityDecisionId ??
                        labels.none,
                    },
                  ]
                : []),
              ...(root.counterpartPath
                ? [{ label: labels.counterpart, value: root.counterpartPath }]
                : []),
            ]}
          />
        </ResultCard>
      </ListItem>
    );
  });
  return (
    <ResultSection
      title={labels.rootStatus}
      ariaLabel={labels.rootStatus}
      count={`${model.visibleRootOptions.length}/${model.rootOptions.length}`}
      dataGlobalCount={model.rootOptions.length}
      dataVisibleCount={model.visibleRootOptions.length}
    >
      {rows.length === 0 ? (
        <ResultEmptyState role="alert">{labels.noResults}</ResultEmptyState>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.rootStatus}
        />
      )}
    </ResultSection>
  );
};

const ValidNoRuns = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const outcomeLabel = (outcome: string): string =>
    outcome === "supported-runs"
      ? labels.supportedRuns
      : outcome === "valid-no-runs"
        ? labels.noRuns
        : outcome === "partial"
          ? labels.partial
          : labels.uncalculated;
  const roots = model.visibleRoots.filter((root) =>
    getScheduleImpactCalendarRootOutcomes(root).includes("valid-no-runs"),
  );
  const sideDetails = (
    side: SemanticDiffScheduleImpactRootSide | null,
  ): React.ReactElement => (
    <ResultKeyValueList
      dense
      items={
        side
          ? [
              { label: labels.side, value: side.side },
              { label: labels.unitPath, value: side.unitPath },
              { label: labels.outcome, value: outcomeLabel(side.outcome) },
            ]
          : [{ label: labels.side, value: labels.absentSide }]
      }
    />
  );
  const rows = roots.map((root) => (
    <ListItem
      component="li"
      key={root.id}
      data-schedule-impact-calendar-no-runs-root-id={root.id}
      sx={{ display: "block", py: 0.5 }}
    >
      <ResultCard ariaLabel={`${labels.id}: ${root.id}`} sx={{ p: 0 }}>
        <ResultKeyValueList
          items={[
            { label: labels.id, value: root.id },
            {
              label: labels.before,
              value: sideDetails(root.before),
            },
            {
              label: labels.after,
              value: sideDetails(root.after),
            },
            ...(root.scopeTransition
              ? [
                  {
                    label: labels.scopeTransition,
                    value: root.scopeTransition.kind,
                  },
                  {
                    label: labels.identityDecisionId,
                    value: root.scopeTransition.identityDecisionId,
                  },
                ]
              : []),
          ]}
        />
      </ResultCard>
    </ListItem>
  ));
  const total = model.roots.filter((root) =>
    getScheduleImpactCalendarRootOutcomes(root).includes("valid-no-runs"),
  ).length;
  return (
    <ResultSection
      title={labels.noRuns}
      ariaLabel={labels.noRuns}
      count={`${rows.length}/${total}`}
      dataGlobalCount={total}
      dataVisibleCount={rows.length}
    >
      {rows.length === 0 ? (
        <ResultEmptyState role="alert">{labels.emptyNoRuns}</ResultEmptyState>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.noRuns}
        />
      )}
    </ResultSection>
  );
};

const Legend = ({
  labels,
}: Readonly<{
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
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
  const items = (
    values: readonly Readonly<{
      label: string;
      icon: string;
      pattern: string;
    }>[],
  ): React.ReactElement[] =>
    values.map((value) => (
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
    ));
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
      <List component="ul" aria-label={labels.runState} sx={{ pl: 3, m: 0 }}>
        {items(runStates)}
      </List>
      <Typography component="h3" variant="body1">
        {labels.outcome}
      </Typography>
      <List component="ul" aria-label={labels.outcome} sx={{ pl: 3, m: 0 }}>
        {items(outcomes)}
      </List>
    </ResultSection>
  );
};

const Candidates = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const candidateDetails = (
    candidate: Readonly<{
      id: string;
      unitId: string;
      unitName: string;
      unitPath: string;
    }>,
  ): React.ReactElement => (
    <ListItem
      component="li"
      key={candidate.id}
      data-schedule-impact-calendar-candidate-id={candidate.id}
      sx={{ display: "block" }}
    >
      <ResultKeyValueList
        items={[
          { label: labels.id, value: candidate.id },
          { label: labels.unitId, value: candidate.unitId },
          { label: labels.unitName, value: candidate.unitName },
          { label: labels.unitPath, value: candidate.unitPath },
        ]}
      />
    </ListItem>
  );
  const rows = model.candidateGroups.map((group) => (
    <ResultCard
      key={group.id}
      title={`${labels.id}: ${group.id}`}
      ariaLabel={group.id}
      dataAttributes={{
        "data-schedule-impact-calendar-candidate-group-id": group.id,
      }}
      sx={{ p: 1, mb: 1 }}
    >
      <Typography component="h4" variant="body2">
        {labels.candidateBefore}
      </Typography>
      {group.before.length === 0 ? (
        <Typography>{labels.emptyCandidates}</Typography>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={group.before.map(candidateDetails)}
          ariaLabel={`${group.id} ${labels.candidateBefore}`}
        />
      )}
      <Typography component="h4" variant="body2">
        {labels.candidateAfter}
      </Typography>
      {group.after.length === 0 ? (
        <Typography>{labels.emptyCandidates}</Typography>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={group.after.map(candidateDetails)}
          ariaLabel={`${group.id} ${labels.candidateAfter}`}
        />
      )}
    </ResultCard>
  ));
  return (
    <ResultSection
      title={labels.candidates}
      ariaLabel={labels.candidates}
      count={`${model.candidateGroups.length}/${model.candidateGroups.length}`}
      dataGlobalCount={model.candidateGroups.length}
      dataVisibleCount={model.candidateGroups.length}
    >
      {rows.length === 0 ? (
        <ResultEmptyState role="alert">
          {labels.emptyCandidates}
        </ResultEmptyState>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.candidates}
        />
      )}
    </ResultSection>
  );
};

const Issues = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const rows = model.visibleIssues.map((issue) => (
    <ResultCard
      key={issue.id}
      ariaLabel={`${labels.id}: ${issue.id}`}
      dataAttributes={{ "data-schedule-impact-calendar-issue-id": issue.id }}
      sx={{
        p: 0,
        "& .MuiCardContent-root": {
          p: 0.5,
          "&:last-child": { pb: 0.5 },
        },
      }}
    >
      <ResultKeyValueList
        dense
        items={[
          { label: labels.id, value: issue.id },
          { label: labels.occurrence, value: issue.occurrenceOrdinal },
          { label: labels.kind, value: issue.kind },
          { label: labels.side, value: issue.side ?? labels.none },
          { label: labels.root, value: issue.rootId ?? labels.none },
          { label: labels.reason, value: issue.reasonCode },
          { label: labels.targetKind, value: issue.targetKind },
          { label: labels.targetId, value: issue.targetId ?? labels.none },
          { label: labels.unitPath, value: issue.targetPath ?? labels.none },
          {
            label: labels.parameterKey,
            value: issue.parameterKey ?? labels.none,
          },
          {
            label: labels.detail,
            value: <ScheduleImpactCalendarIssueDetail detail={issue.detail} />,
          },
        ]}
      />
    </ResultCard>
  ));
  return (
    <ResultSection
      title={labels.issues}
      ariaLabel={labels.issues}
      count={`${model.visibleIssues.length}/${model.issues.length}`}
      dataGlobalCount={model.issues.length}
      dataVisibleCount={model.visibleIssues.length}
    >
      {rows.length === 0 ? (
        <ResultEmptyState role="alert">{labels.emptyIssues}</ResultEmptyState>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.issues}
        />
      )}
    </ResultSection>
  );
};

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
    <Candidates model={model} labels={labels} />
    <Issues model={model} labels={labels} />
    <Legend labels={labels} />
  </Stack>
);
