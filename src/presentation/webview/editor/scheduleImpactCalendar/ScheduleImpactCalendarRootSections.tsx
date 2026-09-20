import React from "react";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import type {
  SemanticDiffScheduleImpactRoot,
  SemanticDiffScheduleImpactRootSide,
} from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultCard from "../shared/result/ResultCard";
import ResultComparison from "../shared/result/ResultComparison";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import ResultStatusChip from "../shared/result/ResultStatusChip";
import { ScheduleImpactCalendarResultSection } from "./ScheduleImpactCalendarResultSection";
import {
  getScheduleImpactCalendarRootOutcomes,
  type ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";

type CalendarFact = Readonly<{
  label: string;
  value: React.ReactNode;
}>;

const rootPath = (root: SemanticDiffScheduleImpactRoot): string =>
  root.after?.unitPath ?? root.before?.unitPath ?? root.canonicalPath;

const outcomeLabel = (
  outcome: string,
  labels: ScheduleImpactCalendarLabels,
): string =>
  ({
    "supported-runs": labels.supportedRuns,
    "valid-no-runs": labels.noRuns,
    partial: labels.partial,
    uncalculated: labels.uncalculated,
  })[outcome as keyof Record<string, string>] ?? labels.uncalculated;

const RootSideDetails = ({
  side,
  labels,
  includeUnitName,
}: Readonly<{
  side: SemanticDiffScheduleImpactRootSide | null;
  labels: ScheduleImpactCalendarLabels;
  includeUnitName: boolean;
}>): React.ReactElement => {
  if (!side) {
    return (
      <ResultKeyValueList
        dense
        items={[{ label: labels.side, value: labels.absentSide }]}
      />
    );
  }
  const items = [
    { label: labels.side, value: side.side },
    ...(includeUnitName
      ? [{ label: labels.unitName, value: side.unitName }]
      : []),
    { label: labels.unitPath, value: side.unitPath },
    { label: labels.outcome, value: outcomeLabel(side.outcome, labels) },
  ];
  return <ResultKeyValueList dense items={items} />;
};

const RootOutcomeChips = ({
  outcomes,
  labels,
}: Readonly<{
  outcomes: readonly string[];
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => (
  <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
    {outcomes.map((outcome) => (
      <ResultStatusChip key={outcome} label={outcomeLabel(outcome, labels)} />
    ))}
  </Stack>
);

const rootTransitionFact = (
  root: ScheduleImpactCalendarModel["rootOptions"][number],
  labels: ScheduleImpactCalendarLabels,
): CalendarFact | undefined => {
  if (!root.scopeTransition) return undefined;
  return {
    label: labels.scopeTransition,
    value: rootTransitionLabel(root.scopeTransition, labels),
  };
};

const rootTransitionLabel = (
  transition: NonNullable<
    ScheduleImpactCalendarModel["rootOptions"][number]["scopeTransition"]
  >,
  labels: ScheduleImpactCalendarLabels,
): string =>
  transition === "added-root-scope"
    ? labels.addedRootScope
    : labels.removedRootScope;

const rootCounterpartFact = (
  root: ScheduleImpactCalendarModel["rootOptions"][number],
  labels: ScheduleImpactCalendarLabels,
): CalendarFact | undefined =>
  root.counterpartPath
    ? { label: labels.counterpart, value: root.counterpartPath }
    : undefined;

const rootOptionFacts = (
  root: ScheduleImpactCalendarModel["rootOptions"][number],
  outcomes: readonly string[],
  labels: ScheduleImpactCalendarLabels,
): readonly CalendarFact[] => [
  { label: labels.unitPath, value: root.label },
  {
    label: labels.outcome,
    value: <RootOutcomeChips outcomes={outcomes} labels={labels} />,
  },
  ...[
    rootTransitionFact(root, labels),
    rootCounterpartFact(root, labels),
  ].filter((fact): fact is CalendarFact => fact !== undefined),
];

const RootStatusCard = ({
  root,
  sourceRoot,
  labels,
}: Readonly<{
  root: ScheduleImpactCalendarModel["visibleRootOptions"][number];
  sourceRoot: SemanticDiffScheduleImpactRoot | undefined;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const outcomes = sourceRoot
    ? getScheduleImpactCalendarRootOutcomes(sourceRoot)
    : [];
  return (
    <ListItem
      component="li"
      data-schedule-impact-calendar-root-id={root.id}
      sx={{ display: "block", py: 0.5 }}
    >
      <ResultCard ariaLabel={`${labels.root}: ${root.label}`} sx={{ p: 0 }}>
        <ResultKeyValueList items={rootOptionFacts(root, outcomes, labels)} />
        <ResultComparison
          beforeLabel={labels.before}
          afterLabel={labels.after}
          before={
            <RootSideDetails
              side={sourceRoot?.before ?? null}
              labels={labels}
              includeUnitName
            />
          }
          after={
            <RootSideDetails
              side={sourceRoot?.after ?? null}
              labels={labels}
              includeUnitName
            />
          }
          ariaLabel={`${labels.root}: ${root.label}, ${labels.before} / ${labels.after}`}
        />
      </ResultCard>
    </ListItem>
  );
};

export const RootStatus = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const rows = model.visibleRootOptions.map((root) => (
    <RootStatusCard
      key={root.id}
      root={root}
      sourceRoot={model.visibleRoots.find(
        (candidate) => candidate.id === root.id,
      )}
      labels={labels}
    />
  ));
  return (
    <ScheduleImpactCalendarResultSection
      title={labels.rootStatus}
      count={`${model.visibleRootOptions.length}/${model.rootOptions.length}`}
      globalCount={model.rootOptions.length}
      visibleCount={model.visibleRootOptions.length}
      rows={rows}
      emptyLabel={labels.noResults}
    />
  );
};

const ValidNoRunsCard = ({
  root,
  labels,
}: Readonly<{
  root: SemanticDiffScheduleImpactRoot;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const path = rootPath(root);
  return (
    <ListItem
      component="li"
      data-schedule-impact-calendar-no-runs-root-id={root.id}
      sx={{ display: "block", py: 0.5 }}
    >
      <ResultCard ariaLabel={`${labels.root}: ${path}`} sx={{ p: 0 }}>
        <ResultKeyValueList
          items={[
            { label: labels.unitPath, value: path },
            ...(root.scopeTransition
              ? [
                  {
                    label: labels.scopeTransition,
                    value: root.scopeTransition.kind,
                  },
                ]
              : []),
          ]}
        />
        <ResultComparison
          beforeLabel={labels.before}
          afterLabel={labels.after}
          before={
            <RootSideDetails
              side={root.before}
              labels={labels}
              includeUnitName={false}
            />
          }
          after={
            <RootSideDetails
              side={root.after}
              labels={labels}
              includeUnitName={false}
            />
          }
          ariaLabel={`${labels.root}: ${path}, ${labels.before} / ${labels.after}`}
        />
      </ResultCard>
    </ListItem>
  );
};

export const ValidNoRuns = ({
  model,
  labels,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => {
  const roots = model.visibleRoots.filter((root) =>
    getScheduleImpactCalendarRootOutcomes(root).includes("valid-no-runs"),
  );
  const total = model.roots.filter((root) =>
    getScheduleImpactCalendarRootOutcomes(root).includes("valid-no-runs"),
  ).length;
  const rows = roots.map((root) => (
    <ValidNoRunsCard key={root.id} root={root} labels={labels} />
  ));
  return (
    <ScheduleImpactCalendarResultSection
      title={labels.noRuns}
      count={`${rows.length}/${total}`}
      globalCount={total}
      visibleCount={rows.length}
      rows={rows}
      emptyLabel={labels.emptyNoRuns}
    />
  );
};
