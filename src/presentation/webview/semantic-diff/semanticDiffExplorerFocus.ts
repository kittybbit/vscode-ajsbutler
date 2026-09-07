export type FocusExplorerRowOptions = Readonly<{
  id: string;
  getElement: (rowId: string) => HTMLElement | undefined;
  focus: (element: HTMLElement) => void;
  requestAnimationFrame: (callback: FrameRequestCallback) => number;
  maxAttempts?: number;
}>;

const focusRenderedRow = ({
  id,
  getElement,
  focus,
}: Readonly<{
  id: string;
  getElement: (rowId: string) => HTMLElement | undefined;
  focus: (element: HTMLElement) => void;
}>): boolean => {
  const rendered = getElement(id);
  if (!rendered) return false;
  focus(rendered);
  return true;
};

const scheduleFocusRetry = ({
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

export const focusExplorerRowAfterVirtualizedScroll = ({
  id,
  getElement,
  focus,
  requestAnimationFrame,
  maxAttempts = 8,
}: FocusExplorerRowOptions): void => {
  let attempts = 0;
  const focusAfterScroll = (): void => {
    if (focusRenderedRow({ id, getElement, focus })) return;
    attempts += 1;
    scheduleFocusRetry({
      attempts,
      maxAttempts,
      requestAnimationFrame,
      focusAfterScroll,
    });
  };
  requestAnimationFrame(focusAfterScroll);
};
