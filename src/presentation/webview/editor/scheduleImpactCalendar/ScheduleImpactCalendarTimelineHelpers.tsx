import React, { useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffScheduleImpactRun } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarLabels } from "../../../../resource/i18n/scheduleImpactCalendar";
import ResultCard from "../shared/result/ResultCard";
import ResultComparison from "../shared/result/ResultComparison";
import ResultEmptyState from "../shared/result/ResultEmptyState";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import ResultStatusChip from "../shared/result/ResultStatusChip";
import {
  SCHEDULE_IMPACT_CALENDAR_OVERSCAN,
  type ScheduleImpactCalendarModel,
} from "./scheduleImpactCalendarModel";
import { scheduleImpactCalendarItemAccessibleName } from "./scheduleImpactCalendarAccessibility";
import {
  focusScheduleImpactCalendarItemAfterVirtualizedScroll,
  scheduleImpactCalendarItemId,
} from "./scheduleImpactCalendarFocus";

export const runStateLabel = (
  value: string,
  labels: ScheduleImpactCalendarLabels,
): string =>
  ({
    unchanged: labels.unchanged,
    added: labels.added,
    removed: labels.removed,
    "changed-time": labels.changedTime,
  })[value] ?? value;

export const RunDetails = ({
  run,
  labels,
}: Readonly<{
  run: SemanticDiffScheduleImpactRun | null;
  labels: ScheduleImpactCalendarLabels;
}>): React.ReactElement => (
  <Box component="div">
    {run ? (
      <ResultKeyValueList
        items={[
          { label: labels.side, value: run.side },
          { label: labels.unitName, value: run.unitName },
          { label: labels.unitPath, value: run.unitPath },
          { label: labels.period, value: `${run.date} ${run.time}` },
          { label: labels.rule, value: run.rule },
          { label: labels.occurrence, value: run.occurrenceOrdinal },
        ]}
      />
    ) : (
      <ResultEmptyState role="status">{labels.none}</ResultEmptyState>
    )}
  </Box>
);

type TimelineEntry = ScheduleImpactCalendarModel["visibleItems"][number];

type TimelineNavigation = Readonly<{
  activeItemId: string | undefined;
  virtuosoRef: React.MutableRefObject<VirtuosoHandle | null>;
  itemElements: React.MutableRefObject<Map<string, HTMLElement>>;
  setActiveItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
  focusItem: (index: number) => void;
  handleItemKeyDown: (
    event: React.KeyboardEvent<HTMLElement>,
    index: number,
    entry: TimelineEntry,
  ) => void;
}>;

const nextTimelineIndex = (
  key: string,
  index: number,
  length: number,
): number | undefined => {
  const keyActions: Readonly<Record<string, (position: number) => number>> = {
    ArrowDown: (position) => Math.min(position + 1, length - 1),
    ArrowUp: (position) => Math.max(position - 1, 0),
    Home: () => 0,
    End: () => length - 1,
  };
  return keyActions[key]?.(index);
};

const focusRenderedTimelineItem = (
  context: Readonly<{
    entry: TimelineEntry;
    index: number;
    model: ScheduleImpactCalendarModel;
    virtuosoRef: React.MutableRefObject<VirtuosoHandle | null>;
    itemElements: React.MutableRefObject<Map<string, HTMLElement>>;
  }>,
): void => {
  const { entry, index, model, virtuosoRef, itemElements } = context;
  const element = itemElements.current.get(entry.item.id);
  if (element) {
    element.focus({ preventScroll: true });
    return;
  }
  if (model.virtualized) {
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
    return;
  }
  document
    .getElementById(scheduleImpactCalendarItemId(entry.item.id))
    ?.focus({ preventScroll: true });
};

const useTimelineActiveItem = (
  model: ScheduleImpactCalendarModel,
): [
  string | undefined,
  React.Dispatch<React.SetStateAction<string | undefined>>,
] => {
  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    model.visibleItems[0]?.item.id,
  );
  useEffect(() => {
    const activeItemExists = model.visibleItems.some(
      (entry) => entry.item.id === activeItemId,
    );
    if (!activeItemExists) setActiveItemId(model.visibleItems[0]?.item.id);
  }, [activeItemId, model.visibleItems]);
  return [activeItemId, setActiveItemId];
};

const focusTimelineItem = (
  index: number,
  context: Readonly<{
    model: ScheduleImpactCalendarModel;
    setActiveItemId: React.Dispatch<React.SetStateAction<string | undefined>>;
    virtuosoRef: React.MutableRefObject<VirtuosoHandle | null>;
    itemElements: React.MutableRefObject<Map<string, HTMLElement>>;
    onAnnouncement: (value: string) => void;
  }>,
): void => {
  const entry = context.model.visibleItems[index];
  if (!entry) return;
  context.setActiveItemId(entry.item.id);
  focusRenderedTimelineItem({
    entry,
    index,
    model: context.model,
    virtuosoRef: context.virtuosoRef,
    itemElements: context.itemElements,
  });
  context.onAnnouncement(entry.accessibleLabel);
};

const handleTimelineItemKeyDown = (
  context: Readonly<{
    event: React.KeyboardEvent<HTMLElement>;
    index: number;
    entry: TimelineEntry;
    model: ScheduleImpactCalendarModel;
    labels: ScheduleImpactCalendarLabels;
    onAnnouncement: (value: string) => void;
    focusItem: (position: number) => void;
  }>,
): void => {
  const { event, index, entry, model, labels, onAnnouncement, focusItem } =
    context;
  if (announceTimelineSelection({ event, entry, labels, onAnnouncement }))
    return;
  const nextIndex = nextTimelineIndex(
    event.key,
    index,
    model.visibleItems.length,
  );
  if (!hasTimelineMove(nextIndex, index)) return;
  event.preventDefault();
  focusItem(nextIndex);
};

const hasTimelineMove = (
  nextIndex: number | undefined,
  currentIndex: number,
): nextIndex is number => nextIndex !== undefined && nextIndex !== currentIndex;

export const useTimelineNavigation = (
  model: ScheduleImpactCalendarModel,
  labels: ScheduleImpactCalendarLabels,
  onAnnouncement: (value: string) => void,
): TimelineNavigation => {
  const [activeItemId, setActiveItemId] = useTimelineActiveItem(model);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const itemElements = useRef<Map<string, HTMLElement>>(new Map());
  const focusItem = (index: number): void =>
    focusTimelineItem(index, {
      model,
      setActiveItemId,
      virtuosoRef,
      itemElements,
      onAnnouncement,
    });
  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    index: number,
    entry: TimelineEntry,
  ): void =>
    handleTimelineItemKeyDown({
      event,
      index,
      entry,
      model,
      labels,
      onAnnouncement,
      focusItem,
    });
  return {
    activeItemId,
    virtuosoRef,
    itemElements,
    setActiveItemId,
    focusItem,
    handleItemKeyDown,
  };
};

const announceTimelineSelection = (
  context: Readonly<{
    event: React.KeyboardEvent<HTMLElement>;
    entry: TimelineEntry;
    labels: ScheduleImpactCalendarLabels;
    onAnnouncement: (value: string) => void;
  }>,
): boolean => {
  if (context.event.key !== "Enter" && context.event.key !== " ") return false;
  context.onAnnouncement(
    context.labels.selectedItem(context.entry.accessibleLabel),
  );
  return true;
};

export const ScheduleImpactCalendarTimelineItem = ({
  entry,
  index,
  activeItemId,
  model,
  labels,
  onFocus,
  onKeyDown,
  onRegister,
}: Readonly<{
  entry: TimelineEntry;
  index: number;
  activeItemId: string | undefined;
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  onFocus: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  onRegister: (element: HTMLElement | null) => void;
}>): React.ReactElement => (
  <Box
    component="li"
    id={scheduleImpactCalendarItemId(entry.item.id)}
    data-schedule-impact-calendar-item-id={entry.item.id}
    aria-label={entry.accessibleLabel}
    aria-posinset={index + 1}
    aria-setsize={model.visibleItems.length}
    tabIndex={activeItemId === entry.item.id ? 0 : -1}
    ref={onRegister}
    onClick={onFocus}
    onFocus={onFocus}
    onKeyDown={onKeyDown}
    sx={{ py: 0.5 }}
  >
    <ResultCard
      ariaLabel={scheduleImpactCalendarItemAccessibleName(
        entry.accessibleLabel,
        runStateLabel(entry.item.state, labels),
      )}
      sx={{ p: 0 }}
    >
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Typography component="strong" variant="body1">
          {entry.item.time}
        </Typography>
        <ResultStatusChip label={runStateLabel(entry.item.state, labels)} />
      </Stack>
      <Typography component="div" variant="body2">
        {entry.root?.after?.unitPath ??
          entry.root?.before?.unitPath ??
          entry.item.after?.unitPath ??
          entry.item.before?.unitPath}
      </Typography>
      <ResultKeyValueList
        items={[
          { label: labels.rule, value: entry.item.rule },
          { label: labels.side, value: entry.item.side },
          { label: labels.occurrence, value: entry.item.occurrenceOrdinal },
        ]}
      />
      <ResultComparison
        beforeLabel={labels.before}
        afterLabel={labels.after}
        before={<RunDetails run={entry.item.before} labels={labels} />}
        after={<RunDetails run={entry.item.after} labels={labels} />}
        ariaLabel={`${entry.accessibleLabel}: ${labels.before} / ${labels.after}`}
      />
    </ResultCard>
  </Box>
);

const renderTimelineItem = (
  context: Readonly<{
    entry: TimelineEntry;
    index: number;
    model: ScheduleImpactCalendarModel;
    labels: ScheduleImpactCalendarLabels;
    navigation: TimelineNavigation;
  }>,
): React.ReactElement => (
  <ScheduleImpactCalendarTimelineItem
    entry={context.entry}
    index={context.index}
    activeItemId={context.navigation.activeItemId}
    model={context.model}
    labels={context.labels}
    onFocus={() => context.navigation.setActiveItemId(context.entry.item.id)}
    onKeyDown={(event) =>
      context.navigation.handleItemKeyDown(event, context.index, context.entry)
    }
    onRegister={(element) => {
      if (element) {
        context.navigation.itemElements.current.set(
          context.entry.item.id,
          element,
        );
      } else {
        context.navigation.itemElements.current.delete(context.entry.item.id);
      }
    }}
  />
);

const StandardTimelineList = ({
  model,
  labels,
  navigation,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  navigation: TimelineNavigation;
}>): React.ReactElement => {
  return (
    <>
      {model.dateGroups.map((group) => (
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
                {renderTimelineItem({
                  entry,
                  index: model.visibleItems.findIndex(
                    (candidate) => candidate.item.id === entry.item.id,
                  ),
                  model,
                  labels,
                  navigation,
                })}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};

const VirtualizedTimelineList = ({
  model,
  labels,
  navigation,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  navigation: TimelineNavigation;
}>): React.ReactElement => {
  const VirtualizedTimelineList = React.forwardRef<
    HTMLDivElement,
    Readonly<{ children?: React.ReactNode; style?: React.CSSProperties }>
  >(({ children, style }, ref) => (
    <div ref={ref} role="list" aria-label={labels.timeline} style={style}>
      {children}
    </div>
  ));
  VirtualizedTimelineList.displayName = "VirtualizedTimelineList";
  return (
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
        ref={navigation.virtuosoRef}
        style={{ height: "100%", minHeight: "12rem" }}
        components={{ List: VirtualizedTimelineList }}
        data={model.visibleItems}
        totalCount={model.visibleItems.length}
        overscan={SCHEDULE_IMPACT_CALENDAR_OVERSCAN * 48}
        itemContent={(index, entry) => (
          <React.Fragment key={entry.item.id}>
            {(index === 0 ||
              model.visibleItems[index - 1]!.item.date !== entry.item.date) && (
              <Typography component="h2" variant="h6">
                {entry.item.date}
              </Typography>
            )}
            {renderTimelineItem({ entry, index, model, labels, navigation })}
          </React.Fragment>
        )}
      />
    </Box>
  );
};

export const TimelineList = ({
  model,
  labels,
  navigation,
}: Readonly<{
  model: ScheduleImpactCalendarModel;
  labels: ScheduleImpactCalendarLabels;
  navigation: TimelineNavigation;
}>): React.ReactElement =>
  model.virtualized ? (
    <VirtualizedTimelineList
      model={model}
      labels={labels}
      navigation={navigation}
    />
  ) : (
    <StandardTimelineList
      model={model}
      labels={labels}
      navigation={navigation}
    />
  );
