import React, { useEffect, useRef, useState } from "react";
import List from "@mui/material/List";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { focusScheduleImpactCalendarItemAfterVirtualizedScroll } from "./scheduleImpactCalendarFocus";
import {
  SCHEDULE_IMPACT_CALENDAR_OVERSCAN,
  SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD,
} from "./scheduleImpactCalendarModel";

export const ScheduleImpactCalendarBoundedList = ({
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
      <List
        component="ul"
        aria-label={ariaLabel}
        data-schedule-impact-calendar-list-count={items.length}
        sx={{ pl: 3 }}
      >
        {focusedItems}
      </List>
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
