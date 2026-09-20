import React, { useRef } from "react";
import Stack from "@mui/material/Stack";
import type {
  ScheduleImpactCalendarFilters as ScheduleImpactCalendarFilterState,
  ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import { focusScheduleImpactCalendarControl } from "./scheduleImpactCalendarFocus";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ViewerFilterSelect, {
  type ViewerFilterSelectProps,
} from "../shared/ViewerFilterSelect";

type CalendarFilterKey = keyof ScheduleImpactCalendarFilterState;
type CalendarFilterValues = Record<CalendarFilterKey, readonly string[]>;

const allOutcomes: ScheduleImpactCalendarFilterState["outcomes"] = [
  "supported-runs",
  "valid-no-runs",
  "partial",
  "uncalculated",
];

const allStates: ScheduleImpactCalendarFilterState["runStates"] = [
  "unchanged",
  "added",
  "removed",
  "changed-time",
];

const filterValue = <T extends string>(
  values: readonly T[],
  all: string,
): string => (values.length === 1 ? values[0]! : all);

const updateFilter = <T extends string>(
  current: readonly T[],
  value: string,
  all: readonly T[],
): readonly T[] => (value === "all" ? all : [value as T]);

const filterValues = (rootIds: readonly string[]): CalendarFilterValues => ({
  rootIds,
  outcomes: allOutcomes,
  runStates: allStates,
});

const updateCalendarFilters = ({
  filters,
  key,
  value,
  values,
}: Readonly<{
  filters: ScheduleImpactCalendarFilterState;
  key: CalendarFilterKey;
  value: string;
  values: CalendarFilterValues;
}>): ScheduleImpactCalendarFilterState =>
  ({
    ...filters,
    [key]: updateFilter(filters[key], value, values[key]),
  }) as ScheduleImpactCalendarFilterState;

const focusFilter = (
  key: CalendarFilterKey,
  refs: Readonly<{
    root: React.RefObject<HTMLDivElement | null>;
    outcome: React.RefObject<HTMLDivElement | null>;
    state: React.RefObject<HTMLDivElement | null>;
  }>,
): void =>
  focusScheduleImpactCalendarControl(
    {
      rootIds: refs.root,
      outcomes: refs.outcome,
      runStates: refs.state,
    }[key].current,
  );

const rootScopeSuffix = (
  scopeTransition: ScheduleImpactCalendarModel["rootOptions"][number]["scopeTransition"],
  labels: ScheduleImpactCalendarLabels,
): string =>
  scopeTransition === null
    ? ""
    : ` (${
        {
          "added-root-scope": labels.addedRootScope,
          "removed-root-scope": labels.removedRootScope,
        }[scopeTransition]
      })`;

const rootCounterpartSuffix = (
  counterpartPath: string | null,
  label: string,
): string =>
  counterpartPath === null ? "" : ` · ${label}: ${counterpartPath}`;

const rootOptionLabel = (
  root: ScheduleImpactCalendarModel["rootOptions"][number],
  labels: ScheduleImpactCalendarLabels,
): React.ReactElement => (
  <>
    {root.label}
    {rootScopeSuffix(root.scopeTransition, labels)}
    {rootCounterpartSuffix(root.counterpartPath, labels.counterpart)}
  </>
);

const rootOptions = (
  roots: ScheduleImpactCalendarModel["rootOptions"],
  labels: ScheduleImpactCalendarLabels,
) => [
  { value: "all", label: labels.all },
  ...roots.map((root) => ({
    value: root.id,
    label: rootOptionLabel(root, labels),
  })),
];

type CalendarFilterConfig = Readonly<{
  key: CalendarFilterKey;
  id: string;
  label: string;
  value: string;
  options: ViewerFilterSelectProps["options"];
  triggerRef: React.RefObject<HTMLDivElement | null>;
}>;

const CalendarFilter = ({
  id,
  label,
  value,
  options,
  triggerRef,
  onChange,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  options: ViewerFilterSelectProps["options"];
  triggerRef: React.RefObject<HTMLDivElement | null>;
  onChange: (value: string) => void;
}>): React.ReactElement => (
  <ViewerFilterSelect
    id={id}
    label={label}
    value={value}
    menuHeading={label}
    options={options}
    triggerRef={triggerRef}
    onChange={onChange}
  />
);

export const ScheduleImpactCalendarFilters = ({
  model,
  labels,
  onChange,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  onChange: (filters: ScheduleImpactCalendarFilterState) => void;
}>): React.ReactElement => {
  const rootRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const roots = model.rootOptions;
  const refs = { root: rootRef, outcome: outcomeRef, state: stateRef };
  const update = (key: CalendarFilterKey, value: string): void => {
    const next = updateCalendarFilters({
      filters: model.filters,
      key,
      value,
      values: filterValues(roots.map((root) => root.id)),
    });
    onChange(next);
    focusFilter(key, refs);
  };
  const filterConfigs = [
    {
      key: "rootIds" as const,
      id: "schedule-impact-calendar-root-filter",
      label: labels.root,
      value: filterValue(model.filters.rootIds, "all"),
      options: rootOptions(roots, labels),
      triggerRef: rootRef,
    },
    {
      key: "outcomes" as const,
      id: "schedule-impact-calendar-outcome-filter",
      label: labels.outcome,
      value: filterValue(model.filters.outcomes, "all"),
      options: [
        { value: "all", label: labels.all },
        { value: "supported-runs", label: labels.supportedRuns },
        { value: "valid-no-runs", label: labels.noRuns },
        { value: "partial", label: labels.partial },
        { value: "uncalculated", label: labels.uncalculated },
      ],
      triggerRef: outcomeRef,
    },
    {
      key: "runStates" as const,
      id: "schedule-impact-calendar-state-filter",
      label: labels.runState,
      value: filterValue(model.filters.runStates, "all"),
      options: [
        { value: "all", label: labels.all },
        { value: "unchanged", label: labels.unchanged },
        { value: "added", label: labels.added },
        { value: "removed", label: labels.removed },
        { value: "changed-time", label: labels.changedTime },
      ],
      triggerRef: stateRef,
    },
  ] satisfies readonly CalendarFilterConfig[];
  return (
    <Stack
      component="section"
      aria-label={labels.filters}
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      useFlexGap
      sx={{ flexWrap: "wrap", mb: 2 }}
    >
      {filterConfigs.map((config) => (
        <CalendarFilter
          key={config.id}
          {...config}
          onChange={(value) => update(config.key, value)}
        />
      ))}
    </Stack>
  );
};
