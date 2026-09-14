import React, { useRef } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Stack from "@mui/material/Stack";
import type {
  ScheduleImpactCalendarFilters as ScheduleImpactCalendarFilterState,
  ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import { focusScheduleImpactCalendarControl } from "./scheduleImpactCalendarFocus";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import { semanticDiffExplorerFocusSx } from "../../shared/muiTheme";

const filterValue = <T extends string>(
  values: readonly T[],
  all: string,
): string => (values.length === 1 ? values[0]! : all);

const updateFilter = <T extends string>(
  current: readonly T[],
  value: string,
  all: readonly T[],
): readonly T[] => (value === "all" ? all : [value as T]);

export const ScheduleImpactCalendarFilters = ({
  model,
  labels,
  onChange,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  onChange: (filters: ScheduleImpactCalendarFilterState) => void;
}>): React.ReactElement => {
  const rootRef = useRef<HTMLSelectElement>(null);
  const outcomeRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const roots = model.rootOptions;
  const update = (
    key: keyof ScheduleImpactCalendarFilterState,
    value: string,
  ): void => {
    const allRoots = roots.map((root) => root.id);
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
    const next = {
      ...model.filters,
      rootIds:
        key === "rootIds"
          ? updateFilter(model.filters.rootIds, value, allRoots)
          : model.filters.rootIds,
      outcomes:
        key === "outcomes"
          ? updateFilter(model.filters.outcomes, value, allOutcomes)
          : model.filters.outcomes,
      runStates:
        key === "runStates"
          ? updateFilter(model.filters.runStates, value, allStates)
          : model.filters.runStates,
    };
    onChange(next);
    focusScheduleImpactCalendarControl(
      key === "rootIds"
        ? rootRef.current
        : key === "outcomes"
          ? outcomeRef.current
          : stateRef.current,
    );
  };
  return (
    <Stack
      component="section"
      aria-label={labels.filters}
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      useFlexGap
      sx={{ flexWrap: "wrap", mb: 2 }}
    >
      <FormControl sx={{ minWidth: 14 * 16 }}>
        <InputLabel htmlFor="schedule-impact-calendar-root-filter">
          {labels.root}
        </InputLabel>
        <NativeSelect
          id="schedule-impact-calendar-root-filter"
          inputProps={{ "aria-label": labels.root }}
          value={filterValue(model.filters.rootIds, "all")}
          ref={rootRef}
          onChange={(event) => update("rootIds", event.target.value)}
          sx={semanticDiffExplorerFocusSx}
        >
          <option value="all">{labels.all}</option>
          {roots.map((root) => (
            <option key={root.id} value={root.id}>
              {root.label}
              {root.scopeTransition
                ? ` (${root.scopeTransition === "added-root-scope" ? labels.addedRootScope : labels.removedRootScope})`
                : ""}
              {root.counterpartPath
                ? ` · ${labels.counterpart}: ${root.counterpartPath}`
                : ""}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      <FormControl sx={{ minWidth: 14 * 16 }}>
        <InputLabel htmlFor="schedule-impact-calendar-outcome-filter">
          {labels.outcome}
        </InputLabel>
        <NativeSelect
          id="schedule-impact-calendar-outcome-filter"
          inputProps={{ "aria-label": labels.outcome }}
          value={filterValue(model.filters.outcomes, "all")}
          ref={outcomeRef}
          onChange={(event) => update("outcomes", event.target.value)}
          sx={semanticDiffExplorerFocusSx}
        >
          <option value="all">{labels.all}</option>
          <option value="supported-runs">{labels.supportedRuns}</option>
          <option value="valid-no-runs">{labels.noRuns}</option>
          <option value="partial">{labels.partial}</option>
          <option value="uncalculated">{labels.uncalculated}</option>
        </NativeSelect>
      </FormControl>
      <FormControl sx={{ minWidth: 14 * 16 }}>
        <InputLabel htmlFor="schedule-impact-calendar-state-filter">
          {labels.runState}
        </InputLabel>
        <NativeSelect
          id="schedule-impact-calendar-state-filter"
          inputProps={{ "aria-label": labels.runState }}
          value={filterValue(model.filters.runStates, "all")}
          ref={stateRef}
          onChange={(event) => update("runStates", event.target.value)}
          sx={semanticDiffExplorerFocusSx}
        >
          <option value="all">{labels.all}</option>
          <option value="unchanged">{labels.unchanged}</option>
          <option value="added">{labels.added}</option>
          <option value="removed">{labels.removed}</option>
          <option value="changed-time">{labels.changedTime}</option>
        </NativeSelect>
      </FormControl>
    </Stack>
  );
};
