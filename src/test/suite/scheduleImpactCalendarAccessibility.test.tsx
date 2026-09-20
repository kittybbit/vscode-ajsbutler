import * as assert from "assert";
import {
  scheduleImpactCalendarFocusSelector,
  scheduleImpactCalendarItemAccessibleName,
} from "../../presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarAccessibility";
import { focusScheduleImpactCalendarItemAfterVirtualizedScroll } from "../../presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarFocus";

suite("Schedule impact calendar accessibility", () => {
  test("keeps state in the accessible item name and safely builds focus selectors", () => {
    assert.strictEqual(
      scheduleImpactCalendarItemAccessibleName("2026-01-01 /root", "Added"),
      "2026-01-01 /root; Added",
    );
    assert.strictEqual(
      scheduleImpactCalendarFocusSelector('item"1'),
      '[data-schedule-impact-calendar-item-id="item\\"1"]',
    );
  });

  test("uses semantic timeline context without internal keys", () => {
    const accessibleName = scheduleImpactCalendarItemAccessibleName(
      "date=2026-01-01 path=/jobs/example.ajs/job side=after occurrence=2",
      "Added",
    );
    assert.match(accessibleName, /\/jobs\/example\.ajs\/job/);
    assert.match(accessibleName, /occurrence=2/);
    assert.doesNotMatch(
      accessibleName,
      /(?:item|run|root|candidate|issue|decision|sourceChangeRef)-?id|unitId=/i,
    );
  });

  test("retries focus until a virtualized item is mounted", () => {
    const frames: FrameRequestCallback[] = [];
    const elements = new Map<string, HTMLElement>();
    const target = { focus: () => undefined } as unknown as HTMLElement;
    let focused = 0;
    target.focus = () => {
      focused += 1;
    };
    focusScheduleImpactCalendarItemAfterVirtualizedScroll({
      id: "last",
      getElement: (id) => elements.get(String(id)),
      focus: (element) => element.focus(),
      requestAnimationFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
    });
    assert.strictEqual(frames.length, 1);
    frames.shift()!(0);
    assert.strictEqual(focused, 0);
    elements.set("last", target);
    frames.shift()!(0);
    assert.strictEqual(focused, 1);
  });
});
