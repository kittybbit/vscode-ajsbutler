import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffScheduleImpactRootSide } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  getScheduleImpactCalendarRootOutcomes,
  type ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import { ScheduleImpactCalendarBoundedList } from "./ScheduleImpactCalendarBoundedList";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";

const SectionHeading = ({
  children,
  visible,
  total,
}: Readonly<{
  children: React.ReactNode;
  visible?: number;
  total?: number;
}>): React.ReactElement => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Typography component="h2" variant="h6">
      {children}
    </Typography>
    {visible !== undefined && total !== undefined && (
      <Chip
        size="small"
        label={`${visible}/${total}`}
        aria-label={`${visible}/${total}`}
      />
    )}
  </Stack>
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
  ): string =>
    side
      ? `${labels.side}: ${side.side} · ${labels.unitId}: ${side.unitId} · ${labels.unitName}: ${side.unitName} · ${labels.unitPath}: ${side.unitPath} · ${labels.outcome}: ${outcomeLabel(side.outcome)}`
      : labels.absentSide;
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
      >
        <Typography component="span">
          {labels.id}: {root.id} · {labels.unitPath}: {root.label} ·{" "}
          {outcomes.map(outcomeLabel).join(" / ")}
          {sourceRoot &&
            ` · ${labels.before}: ${sideDetails(sourceRoot.before)}`}
          {sourceRoot && ` · ${labels.after}: ${sideDetails(sourceRoot.after)}`}
          {root.scopeTransition === "added-root-scope"
            ? ` · ${labels.scopeTransition}: ${labels.addedRootScope} · ${labels.identityDecisionId}: ${sourceRoot?.scopeTransition?.identityDecisionId ?? labels.none}`
            : root.scopeTransition === "removed-root-scope"
              ? ` · ${labels.scopeTransition}: ${labels.removedRootScope} · ${labels.identityDecisionId}: ${sourceRoot?.scopeTransition?.identityDecisionId ?? labels.none}`
              : ""}
          {root.counterpartPath
            ? ` · ${labels.counterpart}: ${root.counterpartPath}`
            : ""}
        </Typography>
      </ListItem>
    );
  });
  return (
    <Box
      component="section"
      aria-label={labels.rootStatus}
      data-global-count={model.rootOptions.length}
      data-visible-count={model.visibleRootOptions.length}
      sx={{ mb: 2 }}
    >
      <SectionHeading
        visible={model.visibleRootOptions.length}
        total={model.rootOptions.length}
      >
        {labels.rootStatus}
      </SectionHeading>
      {rows.length === 0 ? (
        <Alert severity="info" variant="outlined">
          {labels.noResults}
        </Alert>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.rootStatus}
        />
      )}
    </Box>
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
  const rows = roots.map((root) => (
    <ListItem
      component="li"
      key={root.id}
      data-schedule-impact-calendar-no-runs-root-id={root.id}
    >
      <Typography component="span">
        {labels.id}: {root.id} · {labels.before}:{" "}
        {root.before
          ? `${labels.side}: ${root.before.side} · ${labels.unitPath}: ${root.before.unitPath} · ${labels.outcome}: ${outcomeLabel(root.before.outcome)}`
          : labels.absentSide}{" "}
        · {labels.after}:{" "}
        {root.after
          ? `${labels.side}: ${root.after.side} · ${labels.unitPath}: ${root.after.unitPath} · ${labels.outcome}: ${outcomeLabel(root.after.outcome)}`
          : labels.absentSide}
        {root.scopeTransition &&
          ` · ${labels.scopeTransition}: ${root.scopeTransition.kind} · ${labels.identityDecisionId}: ${root.scopeTransition.identityDecisionId}`}
      </Typography>
    </ListItem>
  ));
  const total = model.roots.filter((root) =>
    getScheduleImpactCalendarRootOutcomes(root).includes("valid-no-runs"),
  ).length;
  return (
    <Box
      component="section"
      aria-label={labels.noRuns}
      data-global-count={total}
      data-visible-count={rows.length}
      sx={{ mb: 2 }}
    >
      <SectionHeading visible={rows.length} total={total}>
        {labels.noRuns}
      </SectionHeading>
      {rows.length === 0 ? (
        <Alert severity="info" variant="outlined">
          {labels.emptyNoRuns}
        </Alert>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.noRuns}
        />
      )}
    </Box>
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
    <Box
      component="section"
      aria-label={labels.legend}
      data-testid="schedule-impact-calendar-legend"
      sx={{ mb: 2 }}
    >
      <SectionHeading>{labels.legend}</SectionHeading>
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
    </Box>
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
      <Typography component="span">
        {labels.id}: {candidate.id} · {labels.unitId}: {candidate.unitId} ·{" "}
        {labels.unitName}: {candidate.unitName} · {labels.unitPath}:{" "}
        {candidate.unitPath}
      </Typography>
    </ListItem>
  );
  const rows = model.candidateGroups.map((group) => (
    <Paper
      component="article"
      variant="outlined"
      key={group.id}
      data-schedule-impact-calendar-candidate-group-id={group.id}
      sx={{ p: 1, mb: 1 }}
      aria-label={group.id}
    >
      <Typography component="h3" variant="subtitle1">
        {labels.id}: {group.id}
      </Typography>
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
    </Paper>
  ));
  return (
    <Box
      component="section"
      aria-label={labels.candidates}
      data-global-count={model.candidateGroups.length}
      data-visible-count={model.candidateGroups.length}
      sx={{ mb: 2 }}
    >
      <SectionHeading
        visible={model.candidateGroups.length}
        total={model.candidateGroups.length}
      >
        {labels.candidates}
      </SectionHeading>
      {rows.length === 0 ? (
        <Alert severity="info" variant="outlined">
          {labels.emptyCandidates}
        </Alert>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.candidates}
        />
      )}
    </Box>
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
    <ListItem
      component="li"
      key={issue.id}
      data-schedule-impact-calendar-issue-id={issue.id}
      sx={{ display: "block" }}
    >
      <Typography component="div" variant="body2">
        {labels.id}: {issue.id} · {labels.occurrence}: {issue.occurrenceOrdinal}{" "}
        · {labels.kind}: {issue.kind} · {labels.side}:{" "}
        {issue.side ?? labels.none}
      </Typography>
      <Typography component="div" variant="body2">
        {labels.root}: {issue.rootId ?? labels.none} · {labels.reason}:{" "}
        {issue.reasonCode}
      </Typography>
      <Typography component="div" variant="body2">
        {labels.targetKind}: {issue.targetKind} · {labels.targetId}:{" "}
        {issue.targetId ?? labels.none} · {labels.unitPath}:{" "}
        {issue.targetPath ?? labels.none} · {labels.parameterKey}:{" "}
        {issue.parameterKey ?? labels.none}
      </Typography>
      <Box
        component="pre"
        sx={{ m: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
      >
        {labels.detail}: {JSON.stringify(issue.detail)}
      </Box>
    </ListItem>
  ));
  return (
    <Box
      component="section"
      aria-label={labels.issues}
      data-global-count={model.issues.length}
      data-visible-count={model.visibleIssues.length}
      sx={{ mb: 2 }}
    >
      <SectionHeading
        visible={model.visibleIssues.length}
        total={model.issues.length}
      >
        {labels.issues}
      </SectionHeading>
      {rows.length === 0 ? (
        <Alert severity="info" variant="outlined">
          {labels.emptyIssues}
        </Alert>
      ) : (
        <ScheduleImpactCalendarBoundedList
          items={rows}
          ariaLabel={labels.issues}
        />
      )}
    </Box>
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
