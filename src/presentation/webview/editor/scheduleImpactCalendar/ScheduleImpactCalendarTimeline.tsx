import React, { useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffScheduleImpactRun } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  SCHEDULE_IMPACT_CALENDAR_OVERSCAN,
  type ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import { scheduleImpactCalendarItemAccessibleName } from "./scheduleImpactCalendarAccessibility";
import {
  focusScheduleImpactCalendarItemAfterVirtualizedScroll,
  scheduleImpactCalendarItemId,
} from "./scheduleImpactCalendarFocus";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";

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

export const ScheduleImpactCalendarTimeline = ({
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
        <Alert severity="info" variant="outlined" role="status">
          {labels.noResults}
        </Alert>
      )}
    </Box>
  );
};
