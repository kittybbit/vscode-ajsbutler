export type KeyboardSelectionCoalescer = {
  schedule: (absolutePath: string) => void;
  flush: () => void;
  cancel: () => void;
};

export const createKeyboardSelectionCoalescer = (
  commit: (absolutePath: string) => void,
  delayMs = 150,
): KeyboardSelectionCoalescer => {
  let pendingAbsolutePath: string | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clearTimer = (): void => {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
  };

  const flush = (): void => {
    clearTimer();
    const absolutePath = pendingAbsolutePath;
    pendingAbsolutePath = undefined;
    if (absolutePath !== undefined) commit(absolutePath);
  };

  return {
    schedule: (absolutePath: string): void => {
      pendingAbsolutePath = absolutePath;
      clearTimer();
      timer = setTimeout(flush, delayMs);
    },
    flush,
    cancel: (): void => {
      clearTimer();
      pendingAbsolutePath = undefined;
    },
  };
};
