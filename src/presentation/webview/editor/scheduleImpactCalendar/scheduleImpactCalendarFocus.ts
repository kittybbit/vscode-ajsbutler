export const focusScheduleImpactCalendarControl = (
  element: HTMLElement | null,
): void => {
  element?.focus({ preventScroll: true });
};

export const scheduleImpactCalendarItemId = (id: string): string =>
  `schedule-impact-calendar-item-${id}`;

export type ScheduleImpactCalendarFocusableElementOptions = Readonly<{
  id: string | number;
  getElement: (id: string | number) => HTMLElement | undefined;
  focus: (element: HTMLElement) => void;
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  maxAttempts?: number;
}>;

const retryScheduleImpactCalendarFocus = ({
  attempts,
  maxAttempts,
  requestAnimationFrame,
  focusAfterScroll,
}: Readonly<{
  attempts: number;
  maxAttempts: number;
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  focusAfterScroll: () => void;
}>): void => {
  if (attempts < maxAttempts) requestAnimationFrame(focusAfterScroll);
};

/** Focuses an item after Virtuoso has mounted it following scrollToIndex. */
export const focusScheduleImpactCalendarItemAfterVirtualizedScroll = ({
  id,
  getElement,
  focus,
  requestAnimationFrame,
  maxAttempts = 8,
}: ScheduleImpactCalendarFocusableElementOptions): void => {
  let attempts = 0;
  const focusAfterScroll = (): void => {
    const element = getElement(id);
    if (element) {
      focus(element);
      return;
    }
    attempts += 1;
    retryScheduleImpactCalendarFocus({
      attempts,
      maxAttempts,
      requestAnimationFrame,
      focusAfterScroll,
    });
  };
  requestAnimationFrame(focusAfterScroll);
};
