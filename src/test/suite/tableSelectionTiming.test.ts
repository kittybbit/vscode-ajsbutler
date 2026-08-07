import * as assert from "assert";
import { createKeyboardSelectionCoalescer } from "../../presentation/webview/editor/ajsTable/tableSelectionTiming";

suite("Table keyboard selection timing", () => {
  let pendingTimer: (() => void) | undefined;
  let nextTimerId = 0;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;

  setup(() => {
    pendingTimer = undefined;
    nextTimerId = 0;
    globalThis.setTimeout = ((callback: TimerHandler) => {
      pendingTimer = callback as () => void;
      return ++nextTimerId as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout;
    globalThis.clearTimeout = (() => {
      pendingTimer = undefined;
    }) as typeof clearTimeout;
  });

  teardown(() => {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  });

  test("coalesces repeated ArrowDown and PageDown row movement", () => {
    const committed: string[] = [];
    const selection = createKeyboardSelectionCoalescer((path) =>
      committed.push(path),
    );

    selection.schedule("/root/arrow-1");
    selection.schedule("/root/arrow-2");
    selection.schedule("/root/page-final");

    assert.deepStrictEqual(committed, []);
    pendingTimer?.();
    assert.deepStrictEqual(committed, ["/root/page-final"]);
  });

  test("flushes the final focused row for an immediate explicit action", () => {
    const committed: string[] = [];
    const selection = createKeyboardSelectionCoalescer((path) =>
      committed.push(path),
    );

    selection.schedule("/root/focused-before-details");
    selection.flush();

    assert.deepStrictEqual(committed, ["/root/focused-before-details"]);
    assert.strictEqual(pendingTimer, undefined);
  });

  test("cancels pending selection when the document or grid is discarded", () => {
    const committed: string[] = [];
    const selection = createKeyboardSelectionCoalescer((path) =>
      committed.push(path),
    );

    selection.schedule("/root/stale-row");
    selection.cancel();
    pendingTimer?.();

    assert.deepStrictEqual(committed, []);
  });
});
