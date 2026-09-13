import React, { useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import GlobalStyles from "@mui/material/GlobalStyles";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import type {
  SemanticDiffScheduleImpact,
  SemanticDiffScheduleImpactRootSide,
  SemanticDiffScheduleImpactRun,
} from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import { createScheduleImpactCalendarBridge } from "../scheduleImpactCalendarBridge";
import {
  buildScheduleImpactCalendarModel,
  getScheduleImpactCalendarRootOutcomes,
  SCHEDULE_IMPACT_CALENDAR_OVERSCAN,
  SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD,
  type ScheduleImpactCalendarFilters,
  type ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import {
  scheduleImpactCalendarAnnouncement,
  scheduleImpactCalendarItemAccessibleName,
} from "./scheduleImpactCalendarAccessibility";
import {
  focusScheduleImpactCalendarControl,
  focusScheduleImpactCalendarItemAfterVirtualizedScroll,
  scheduleImpactCalendarItemId,
} from "./scheduleImpactCalendarFocus";
import {
  getScheduleImpactCalendarLabels,
  type ScheduleImpactCalendarLabels,
} from "../../../../resource/i18n/scheduleImpactCalendar";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerGlobalStyles,
  semanticDiffExplorerFocusSx,
} from "../../shared/muiTheme";

type CalendarState = Readonly<{
  sessionId: string;
  sidecar: SemanticDiffScheduleImpact;
}>;

type ScheduleImpactCalendarAppProps = Readonly<{
  sidecar?: SemanticDiffScheduleImpact;
  language?: string;
  themeMode?: "light" | "dark";
}>;

const readLanguage = (fallback?: string): string =>
  fallback ?? document.documentElement.lang ?? "en";

const useCalendarSession = (): Readonly<{
  state: CalendarState | undefined;
  failure: boolean;
}> => {
  const sessionId = document.body.dataset.scheduleImpactCalendarSessionId;
  const [state, setState] = useState<CalendarState | undefined>();
  const [failure, setFailure] = useState(false);
  useEffect(() => {
    if (!sessionId) {
      setFailure(true);
      return undefined;
    }
    const bridge = createScheduleImpactCalendarBridge(sessionId);
    const unsubscribe = bridge.onMessage((message) => {
      if (message.type === "session") {
        setState({ sessionId: message.sessionId, sidecar: message.payload });
      } else if (message.type === "failure") {
        setFailure(true);
      } else if (message.type === "close") {
        setState(undefined);
      }
    });
    bridge.sendReady();
    return () => {
      unsubscribe();
      bridge.dispose();
    };
  }, [sessionId]);
  return { state, failure };
};

const filterValue = <T extends string>(
  values: readonly T[],
  all: string,
): string => (values.length === 1 ? values[0]! : all);

const updateFilter = <T extends string>(
  current: readonly T[],
  value: string,
  all: readonly T[],
): readonly T[] => (value === "all" ? all : [value as T]);

const CalendarFilters = ({
  model,
  labels,
  onChange,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  onChange: (filters: ScheduleImpactCalendarFilters) => void;
}>): React.ReactElement => {
  const rootRef = useRef<HTMLSelectElement>(null);
  const outcomeRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const roots = model.rootOptions;
  const update = (
    key: keyof ScheduleImpactCalendarFilters,
    value: string,
  ): void => {
    const allRoots = roots.map((root) => root.id);
    const allOutcomes: ScheduleImpactCalendarFilters["outcomes"] = [
      "supported-runs",
      "valid-no-runs",
      "partial",
      "uncalculated",
    ];
    const allStates: ScheduleImpactCalendarFilters["runStates"] = [
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
      <li key={root.id} data-schedule-impact-calendar-root-id={root.id}>
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
      </li>
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
      <Typography component="h2" variant="h6">
        {labels.rootStatus}
      </Typography>
      {rows.length === 0 ? (
        <Typography>{labels.noResults}</Typography>
      ) : (
        <BoundedList items={rows} ariaLabel={labels.rootStatus} />
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
    <li key={root.id} data-schedule-impact-calendar-no-runs-root-id={root.id}>
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
    </li>
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
      <Typography component="h2" variant="h6">
        {labels.noRuns}
      </Typography>
      {rows.length === 0 ? (
        <Typography>{labels.emptyNoRuns}</Typography>
      ) : (
        <BoundedList items={rows} ariaLabel={labels.noRuns} />
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
      <li
        key={value.label}
        data-legend-pattern={value.pattern}
        style={{ borderBottom: `2px ${value.pattern} currentColor` }}
      >
        <Typography component="span" aria-hidden="true" sx={{ mr: 1 }}>
          {value.icon}
        </Typography>
        <Typography component="span">{value.label}</Typography>
      </li>
    ));
  return (
    <Box
      component="section"
      aria-label={labels.legend}
      data-testid="schedule-impact-calendar-legend"
      sx={{ mb: 2 }}
    >
      <Typography component="h2" variant="h6">
        {labels.legend}
      </Typography>
      <Typography component="h3" variant="body1">
        {labels.runState}
      </Typography>
      <Box component="ul" aria-label={labels.runState} sx={{ pl: 3, m: 0 }}>
        {items(runStates)}
      </Box>
      <Typography component="h3" variant="body1">
        {labels.outcome}
      </Typography>
      <Box component="ul" aria-label={labels.outcome} sx={{ pl: 3, m: 0 }}>
        {items(outcomes)}
      </Box>
    </Box>
  );
};

const runStateLabel = (
  value: string,
  labels: ScheduleImpactCalendarLabels,
): string =>
  (
    ({
      unchanged: labels.unchanged,
      added: labels.added,
      removed: labels.removed,
      "changed-time": labels.changedTime,
    }) as Record<string, string>
  )[value] ?? value;

const sourceChangeRefLabel = (
  run: SemanticDiffScheduleImpactRun | null,
  labels: ScheduleImpactCalendarLabels,
): string =>
  run?.sourceChangeRef
    ? `${run.sourceChangeRef.id}:${run.sourceChangeRef.occurrenceOrdinal}`
    : labels.none;

const RunDetails = ({
  run,
  label,
  labels,
}: Readonly<{
  run: SemanticDiffScheduleImpactRun | null;
  label: string;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => (
  <Box component="section" aria-label={label}>
    <Typography component="h4" variant="body2">
      {label}
    </Typography>
    {run ? (
      <Box component="dl" sx={{ m: 0 }}>
        <Typography component="dt" variant="body2">
          {labels.id}: {run.id}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.side}: {run.side}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.unitId}: {run.unitId}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.unitName}: {run.unitName}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.unitPath}: {run.unitPath}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.period}: {run.date} {run.time}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.rule}: {run.rule} · {labels.occurrence}:{" "}
          {run.occurrenceOrdinal}
        </Typography>
        <Typography component="dd" variant="body2" sx={{ m: 0 }}>
          {labels.sourceChangeRef}: {sourceChangeRefLabel(run, labels)}
        </Typography>
      </Box>
    ) : (
      <Typography component="p" variant="body2">
        {labels.none}
      </Typography>
    )}
  </Box>
);

const BoundedList = ({
  items,
  ariaLabel,
}: Readonly<{
  items: readonly React.ReactElement[];
  ariaLabel: string;
}>): React.ReactElement => {
  const listRef = useRef<VirtuosoHandle>(null);
  const itemElements = useRef<Map<number, HTMLElement>>(new Map());
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (items.length > 0 && activeIndex >= items.length) {
      setActiveIndex(items.length - 1);
    }
  }, [activeIndex, items.length]);
  const registerItem = (index: number, element: HTMLElement | null): void => {
    if (element) itemElements.current.set(index, element);
    else itemElements.current.delete(index);
  };
  const focusItem = (index: number): void => {
    const element = itemElements.current.get(index);
    if (element) {
      element.focus({ preventScroll: true });
      return;
    }
    listRef.current?.scrollToIndex({
      index,
      align: "center",
      behavior: "auto",
    });
    focusScheduleImpactCalendarItemAfterVirtualizedScroll({
      id: index,
      getElement: (itemIndex) => itemElements.current.get(Number(itemIndex)),
      focus: (target) => target.focus({ preventScroll: true }),
      requestAnimationFrame: window.requestAnimationFrame,
    });
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    index: number,
  ): void => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowDown")
      nextIndex = Math.min(index + 1, items.length - 1);
    else if (event.key === "ArrowUp") nextIndex = Math.max(index - 1, 0);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === undefined || nextIndex === index) return;
    event.preventDefault();
    setActiveIndex(nextIndex);
    focusItem(nextIndex);
  };
  const itemWithFocus = (
    item: React.ReactElement,
    index: number,
  ): React.ReactElement =>
    React.cloneElement(item, {
      tabIndex: activeIndex === index ? 0 : -1,
      "aria-posinset": index + 1,
      "aria-setsize": items.length,
      "data-schedule-impact-calendar-bounded-index": index,
      ref: (element: HTMLElement | null) => registerItem(index, element),
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        setActiveIndex(index);
        const original = (item.props as { onFocus?: unknown }).onFocus;
        if (typeof original === "function") original(event);
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        handleKeyDown(event, index);
        const original = (item.props as { onKeyDown?: unknown }).onKeyDown;
        if (typeof original === "function") original(event);
      },
    } as never);
  const focusedItems = items.map(itemWithFocus);
  if (items.length <= SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD) {
    return (
      <Box
        component="ul"
        aria-label={ariaLabel}
        data-schedule-impact-calendar-list-count={items.length}
        sx={{ pl: 3 }}
      >
        {focusedItems}
      </Box>
    );
  }
  const VirtualizedList = React.forwardRef<
    HTMLDivElement,
    Readonly<{ children?: React.ReactNode; style?: React.CSSProperties }>
  >(({ children, style }, ref) => (
    <div
      ref={ref}
      role="list"
      aria-label={ariaLabel}
      data-schedule-impact-calendar-list-count={items.length}
      style={style}
    >
      {children}
    </div>
  ));
  VirtualizedList.displayName = "ScheduleImpactCalendarList";
  return (
    <Virtuoso
      ref={listRef}
      style={{ height: "12rem", minHeight: "12rem" }}
      components={{ List: VirtualizedList }}
      data={items}
      totalCount={items.length}
      overscan={SCHEDULE_IMPACT_CALENDAR_OVERSCAN * 48}
      itemContent={(index, item) => itemWithFocus(item, index)}
    />
  );
};

const Timeline = ({
  model,
  labels,
  onAnnouncement,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  onAnnouncement: (value: string) => void;
}>): React.ReactElement => {
  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    model.visibleItems[0]?.item.id,
  );
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const itemElements = useRef<Map<string, HTMLElement>>(new Map());
  useEffect(() => {
    if (
      activeItemId !== undefined &&
      model.visibleItems.some((entry) => entry.item.id === activeItemId)
    ) {
      return;
    }
    setActiveItemId(model.visibleItems[0]?.item.id);
  }, [activeItemId, model.visibleItems]);
  const focusItem = (index: number): void => {
    const entry = model.visibleItems[index];
    if (!entry) return;
    setActiveItemId(entry.item.id);
    const element = itemElements.current.get(entry.item.id);
    if (element) {
      element.focus({ preventScroll: true });
    } else if (model.virtualized) {
      virtuosoRef.current?.scrollToIndex({
        index,
        align: "center",
        behavior: "auto",
      });
      focusScheduleImpactCalendarItemAfterVirtualizedScroll({
        id: entry.item.id,
        getElement: (itemId) => itemElements.current.get(String(itemId)),
        focus: (target) => target.focus({ preventScroll: true }),
        requestAnimationFrame: window.requestAnimationFrame,
      });
    } else {
      document
        .getElementById(scheduleImpactCalendarItemId(entry.item.id))
        ?.focus({ preventScroll: true });
    }
    onAnnouncement(entry.accessibleLabel);
  };
  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    index: number,
    itemId: string,
  ): void => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowDown")
      nextIndex = Math.min(index + 1, model.visibleItems.length - 1);
    else if (event.key === "ArrowUp") nextIndex = Math.max(index - 1, 0);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = model.visibleItems.length - 1;
    else if (event.key === "Enter" || event.key === " ") {
      onAnnouncement(labels.selected(itemId));
      return;
    }
    if (nextIndex === undefined || nextIndex === index) return;
    event.preventDefault();
    focusItem(nextIndex);
  };
  const VirtualizedTimelineList = React.forwardRef<
    HTMLDivElement,
    Readonly<{ children?: React.ReactNode; style?: React.CSSProperties }>
  >(({ children, style }, ref) => (
    <div ref={ref} role="list" aria-label={labels.timeline} style={style}>
      {children}
    </div>
  ));
  VirtualizedTimelineList.displayName = "VirtualizedTimelineList";
  const renderItem = (
    index: number,
    entry: ScheduleImpactCalendarModel["visibleItems"][number],
  ): React.ReactElement => (
    <Box
      component="li"
      id={scheduleImpactCalendarItemId(entry.item.id)}
      data-schedule-impact-calendar-item-id={entry.item.id}
      aria-label={entry.accessibleLabel}
      aria-posinset={index + 1}
      aria-setsize={model.visibleItems.length}
      tabIndex={activeItemId === entry.item.id ? 0 : -1}
      ref={(element: HTMLElement | null) => {
        if (element) itemElements.current.set(entry.item.id, element);
        else itemElements.current.delete(entry.item.id);
      }}
      onClick={() => setActiveItemId(entry.item.id)}
      onFocus={() => setActiveItemId(entry.item.id)}
      onKeyDown={(event) => handleItemKeyDown(event, index, entry.item.id)}
      sx={{ py: 0.5 }}
    >
      <Paper
        component="article"
        variant="outlined"
        sx={{ p: 1 }}
        aria-label={scheduleImpactCalendarItemAccessibleName(
          entry.accessibleLabel,
          runStateLabel(entry.item.state, labels),
        )}
      >
        <Typography component="strong" variant="body1">
          {entry.item.time} · {runStateLabel(entry.item.state, labels)}
        </Typography>
        <Typography component="div" variant="body2">
          {entry.root?.after?.unitPath ??
            entry.root?.before?.unitPath ??
            entry.item.after?.unitPath ??
            entry.item.before?.unitPath}
        </Typography>
        <Typography component="div" variant="body2">
          {labels.rule}: {entry.item.rule} · {labels.before}:{" "}
          {entry.item.before?.time ?? "—"} · {labels.after}:{" "}
          {entry.item.after?.time ?? "—"}
        </Typography>
        <Typography component="div" variant="body2">
          {labels.id}: {entry.item.id} · {labels.side}: {entry.item.side} ·{" "}
          {labels.root}: {entry.item.rootId} · {labels.occurrence}:{" "}
          {entry.item.occurrenceOrdinal}
        </Typography>
        <Typography component="div" variant="body2">
          {labels.sourceChangeRef}:{" "}
          {entry.item.sourceChangeRef
            ? `${entry.item.sourceChangeRef.id}:${entry.item.sourceChangeRef.occurrenceOrdinal}`
            : labels.none}
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <RunDetails
            run={entry.item.before}
            label={labels.before}
            labels={labels}
          />
          <RunDetails
            run={entry.item.after}
            label={labels.after}
            labels={labels}
          />
        </Stack>
      </Paper>
    </Box>
  );
  const virtualizedItems = model.visibleItems;
  return (
    <Box component="section" aria-label={labels.timeline}>
      {model.virtualized ? (
        <Box
          component="div"
          aria-label={labels.timeline}
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            minHeight: "12rem",
            height: "calc(100vh - 20rem)",
            overflow: "auto",
          }}
        >
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: "100%", minHeight: "12rem" }}
            components={{ List: VirtualizedTimelineList }}
            data={virtualizedItems}
            totalCount={virtualizedItems.length}
            overscan={SCHEDULE_IMPACT_CALENDAR_OVERSCAN * 48}
            itemContent={(index, entry) => (
              <React.Fragment key={entry.item.id}>
                {(index === 0 ||
                  virtualizedItems[index - 1]!.item.date !==
                    entry.item.date) && (
                  <Typography component="h2" variant="h6">
                    {entry.item.date}
                  </Typography>
                )}
                {renderItem(
                  model.visibleItems.findIndex(
                    (candidate) => candidate.item.id === entry.item.id,
                  ),
                  entry,
                )}
              </React.Fragment>
            )}
          />
        </Box>
      ) : (
        model.dateGroups.map((group) => (
          <Box
            component="section"
            key={group.date}
            aria-labelledby={`schedule-impact-calendar-date-${group.date}`}
            sx={{ mb: 2 }}
          >
            <Typography
              component="h2"
              id={`schedule-impact-calendar-date-${group.date}`}
              variant="h6"
            >
              {group.date}
            </Typography>
            <Box
              component="ol"
              aria-label={`${group.date} ${labels.timeline}`}
              sx={{ listStyle: "none", m: 0, p: 0 }}
            >
              {group.items.map((entry) => (
                <React.Fragment key={entry.item.id}>
                  {renderItem(
                    model.visibleItems.findIndex(
                      (candidate) => candidate.item.id === entry.item.id,
                    ),
                    entry,
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        ))
      )}
      {model.visibleItems.length === 0 && (
        <Typography role="status">{labels.noResults}</Typography>
      )}
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
    <li
      key={candidate.id}
      data-schedule-impact-calendar-candidate-id={candidate.id}
    >
      <Typography component="span">
        {labels.id}: {candidate.id} · {labels.unitId}: {candidate.unitId} ·{" "}
        {labels.unitName}: {candidate.unitName} · {labels.unitPath}:{" "}
        {candidate.unitPath}
      </Typography>
    </li>
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
        <BoundedList
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
        <BoundedList
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
      <Typography component="h2" variant="h6">
        {labels.candidates}
      </Typography>
      {rows.length === 0 ? (
        <Typography>{labels.emptyCandidates}</Typography>
      ) : (
        <BoundedList items={rows} ariaLabel={labels.candidates} />
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
    <li key={issue.id} data-schedule-impact-calendar-issue-id={issue.id}>
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
    </li>
  ));
  return (
    <Box
      component="section"
      aria-label={labels.issues}
      data-global-count={model.issues.length}
      data-visible-count={model.visibleIssues.length}
      sx={{ mb: 2 }}
    >
      <Typography component="h2" variant="h6">
        {labels.issues}
      </Typography>
      {rows.length === 0 ? (
        <Typography>{labels.emptyIssues}</Typography>
      ) : (
        <BoundedList items={rows} ariaLabel={labels.issues} />
      )}
    </Box>
  );
};

export const ScheduleImpactCalendarView = ({
  sidecar,
  language = "en",
  themeMode = "light",
}: Readonly<{
  sidecar: SemanticDiffScheduleImpact;
  language?: string;
  themeMode?: "light" | "dark";
}>): React.ReactElement => {
  const labels = getScheduleImpactCalendarLabels(language);
  const [filters, setFilters] =
    useState<Partial<ScheduleImpactCalendarFilters>>();
  const model = useMemo(
    () => buildScheduleImpactCalendarModel(sidecar, filters),
    [sidecar, filters],
  );
  const [announcement, setAnnouncement] = useState("");
  useEffect(
    () => setAnnouncement(scheduleImpactCalendarAnnouncement(model, labels)),
    [labels, model],
  );
  return (
    <ThemeProvider theme={createSemanticDiffTheme({ mode: themeMode })}>
      <CssBaseline />
      <GlobalStyles styles={semanticDiffExplorerGlobalStyles} />
      <Box
        component="main"
        aria-labelledby="schedule-impact-calendar-title"
        data-testid="schedule-impact-calendar"
        sx={{
          width: "100%",
          minWidth: 0,
          minHeight: "100vh",
          p: { xs: 1, sm: 2 },
          overflowWrap: "anywhere",
          "@media (prefers-reduced-motion: reduce)": {
            "*": {
              scrollBehavior: "auto !important",
              transition: "none !important",
              animation: "none !important",
            },
          },
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          id="schedule-impact-calendar-title"
        >
          {labels.title}
        </Typography>
        <Typography component="p">
          {labels.period}: [{sidecar.period.from}, {sidecar.period.to})
        </Typography>
        <Typography component="p" role="status" aria-live="polite">
          {labels.results(model.visibleCount, model.globalCount)}
        </Typography>
        <Typography
          component="div"
          aria-live="polite"
          aria-atomic="true"
          sx={{ minHeight: "1.5em" }}
        >
          {announcement}
        </Typography>
        <CalendarFilters
          model={model}
          labels={labels}
          onChange={(next) => {
            setFilters(next);
            setAnnouncement(labels.filterChanged);
          }}
        />
        <Legend labels={labels} />
        <RootStatus model={model} labels={labels} />
        <ValidNoRuns model={model} labels={labels} />
        <Candidates model={model} labels={labels} />
        <Issues model={model} labels={labels} />
        <Timeline
          model={model}
          labels={labels}
          onAnnouncement={setAnnouncement}
        />
      </Box>
    </ThemeProvider>
  );
};

export const ScheduleImpactCalendarApp = ({
  sidecar: providedSidecar,
  language,
  themeMode = "light",
}: ScheduleImpactCalendarAppProps): React.ReactElement => {
  const session = useCalendarSession();
  const sidecar = providedSidecar ?? session.state?.sidecar;
  const labels = getScheduleImpactCalendarLabels(readLanguage(language));
  if (!sidecar)
    return (
      <ThemeProvider theme={createSemanticDiffTheme({ mode: themeMode })}>
        <CssBaseline />
        <Box
          component="main"
          aria-labelledby="schedule-impact-calendar-title"
          sx={{ p: 2 }}
        >
          <Typography
            component="h1"
            id="schedule-impact-calendar-title"
            variant="h4"
          >
            {session.failure ? labels.failed : labels.title}
          </Typography>
          <Typography role="status" aria-live="polite">
            {session.failure ? labels.error : labels.loading}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  return (
    <ScheduleImpactCalendarView
      sidecar={sidecar}
      language={readLanguage(language)}
      themeMode={themeMode}
    />
  );
};

export default ScheduleImpactCalendarApp;
