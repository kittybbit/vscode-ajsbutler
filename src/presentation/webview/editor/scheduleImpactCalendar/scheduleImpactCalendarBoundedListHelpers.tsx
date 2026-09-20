import React, { useEffect, useRef, useState } from "react";
import List from "@mui/material/List";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { focusScheduleImpactCalendarItemAfterVirtualizedScroll } from "./scheduleImpactCalendarFocus";
import {
  SCHEDULE_IMPACT_CALENDAR_OVERSCAN,
  SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD,
} from "./scheduleImpactCalendarModel";

type BoundedListItemProps = React.HTMLAttributes<HTMLElement> &
  React.RefAttributes<HTMLElement> & {
    "aria-posinset"?: number;
    "aria-setsize"?: number;
    "data-schedule-impact-calendar-bounded-index"?: number;
  };

type BoundedListItem = React.ReactElement<BoundedListItemProps>;

export type BoundedListFocusModel = Readonly<{
  listRef: React.MutableRefObject<VirtuosoHandle | null>;
  focusedItems: readonly React.ReactElement[];
  itemWithFocus: (
    item: React.ReactElement,
    index: number,
  ) => React.ReactElement;
}>;

const nextBoundedListIndex = (
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

const invokeOptionalHandler = <T,>(handler: unknown, event: T): void => {
  if (typeof handler === "function") handler(event);
};

const focusBoundedListItem = (
  index: number,
  listRef: React.MutableRefObject<VirtuosoHandle | null>,
  itemElements: React.MutableRefObject<Map<number, HTMLElement>>,
): void => {
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

const createBoundedListItem = ({
  item,
  index,
  activeIndex,
  length,
  registerItem,
  setActiveIndex,
  focusItem,
}: Readonly<{
  item: React.ReactElement;
  index: number;
  activeIndex: number;
  length: number;
  registerItem: (index: number, element: HTMLElement | null) => void;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  focusItem: (index: number) => void;
}>): React.ReactElement => {
  const typedItem = item as BoundedListItem;
  const cloneProps: Partial<BoundedListItemProps> = {
    tabIndex: activeIndex === index ? 0 : -1,
    "aria-posinset": index + 1,
    "aria-setsize": length,
    "data-schedule-impact-calendar-bounded-index": index,
    ref: (element: HTMLElement | null) => registerItem(index, element),
    onFocus: createBoundedFocusHandler(typedItem, index, setActiveIndex),
    onKeyDown: createBoundedKeyDownHandler({
      item: typedItem,
      index,
      length,
      setActiveIndex,
      focusItem,
    }),
  };
  return React.cloneElement(typedItem, cloneProps);
};

const createBoundedFocusHandler =
  (
    item: BoundedListItem,
    index: number,
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
  ) =>
  (event: React.FocusEvent<HTMLElement>): void => {
    setActiveIndex(index);
    invokeOptionalHandler(item.props.onFocus, event);
  };

const createBoundedKeyDownHandler =
  (
    context: Readonly<{
      item: BoundedListItem;
      index: number;
      length: number;
      setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
      focusItem: (index: number) => void;
    }>,
  ) =>
  (event: React.KeyboardEvent<HTMLElement>): void => {
    const nextIndex = nextBoundedListIndex(
      event.key,
      context.index,
      context.length,
    );
    if (nextIndex !== undefined && nextIndex !== context.index) {
      event.preventDefault();
      context.setActiveIndex(nextIndex);
      context.focusItem(nextIndex);
    }
    invokeOptionalHandler(context.item.props.onKeyDown, event);
  };

const registerBoundedListItem = (
  itemElements: React.MutableRefObject<Map<number, HTMLElement>>,
  index: number,
  element: HTMLElement | null,
): void => {
  if (element) itemElements.current.set(index, element);
  else itemElements.current.delete(index);
};

export const useBoundedListFocus = (
  items: readonly React.ReactElement[],
): BoundedListFocusModel => {
  const listRef = useRef<VirtuosoHandle>(null);
  const itemElements = useRef<Map<number, HTMLElement>>(new Map());
  const [activeIndex, setActiveIndex] = useBoundedListActiveIndex(items.length);
  const registerItem = (index: number, element: HTMLElement | null): void => {
    registerBoundedListItem(itemElements, index, element);
  };
  const focusItem = (index: number): void =>
    focusBoundedListItem(index, listRef, itemElements);
  const itemWithFocus = (
    item: React.ReactElement,
    index: number,
  ): React.ReactElement =>
    createBoundedListItem({
      item,
      index,
      activeIndex,
      length: items.length,
      registerItem,
      setActiveIndex,
      focusItem,
    });
  return { listRef, focusedItems: items.map(itemWithFocus), itemWithFocus };
};

const useBoundedListActiveIndex = (
  length: number,
): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (length > 0 && activeIndex >= length) setActiveIndex(length - 1);
  }, [activeIndex, length]);
  return [activeIndex, setActiveIndex];
};

const VirtualizedBoundedList = ({
  ariaLabel,
  items,
  listRef,
  itemWithFocus,
}: Readonly<{
  ariaLabel: string;
  items: readonly React.ReactElement[];
  listRef: React.MutableRefObject<VirtuosoHandle | null>;
  itemWithFocus: BoundedListFocusModel["itemWithFocus"];
}>): React.ReactElement => {
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

export const BoundedListContent = ({
  ariaLabel,
  items,
  focusModel,
}: Readonly<{
  ariaLabel: string;
  items: readonly React.ReactElement[];
  focusModel: BoundedListFocusModel;
}>): React.ReactElement =>
  items.length <= SCHEDULE_IMPACT_CALENDAR_VIRTUALIZATION_THRESHOLD ? (
    <List
      component="ul"
      aria-label={ariaLabel}
      data-schedule-impact-calendar-list-count={items.length}
      sx={{ pl: 3 }}
    >
      {focusModel.focusedItems}
    </List>
  ) : (
    <VirtualizedBoundedList
      ariaLabel={ariaLabel}
      items={items}
      listRef={focusModel.listRef}
      itemWithFocus={focusModel.itemWithFocus}
    />
  );
