import * as assert from "assert";
import {
  ScheduleImpactCalendarSessionRegistry,
  normalizeScheduleImpactCalendarLanguage,
} from "../../presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarSessionRegistry";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";

const context = {} as SemanticDiffOutputContext;
const sidecar = {} as SemanticDiffScheduleImpact;

suite("Schedule impact calendar session registry", () => {
  test("reuses a live parent child and permits a new identity after close", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const first = registry.open("sde-session-1", context, sidecar, "ja-JP");
    const reopened = registry.open("sde-session-1", context, sidecar, "en-US");
    assert.strictEqual(reopened.calendarSessionId, first.calendarSessionId);
    assert.strictEqual(reopened.displayLanguage, "ja");
    first.dispose();
    const second = registry.open("sde-session-1", context, sidecar, "en-US");
    assert.notStrictEqual(second.calendarSessionId, first.calendarSessionId);
    assert.strictEqual(registry.resolve(first.calendarSessionId), undefined);
  });

  test("accepts the object overload and ignores requests from another epoch", () => {
    let reveals = 0;
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const session = registry.open({
      parentSessionId: "sde-session-object",
      context,
      sidecar,
      reveal: () => {
        reveals += 1;
      },
    });
    const reused = registry.open({
      parentSessionId: "sde-session-object",
      context,
      sidecar,
    });
    assert.strictEqual(reused.calendarSessionId, session.calendarSessionId);
    assert.strictEqual(reveals, 1);
    assert.strictEqual(
      registry.acceptRequest(session.sessionId, 1, session.epoch + 1),
      false,
    );
    assert.strictEqual(registry.acceptRequest(session.sessionId, 1), true);
  });

  test("removes an orphaned parent mapping before opening a replacement", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const first = registry.open("sde-session-orphan", context, sidecar);
    assert.strictEqual(registry.releaseParent("sde-session-orphan"), 1);
    assert.strictEqual(
      registry.resolveForParent("sde-session-orphan"),
      undefined,
    );
    const second = registry.open("sde-session-orphan", context, sidecar);
    assert.notStrictEqual(first.calendarSessionId, second.calendarSessionId);
  });

  test("rejects stale requests and cascades parent disposal", () => {
    const registry = new ScheduleImpactCalendarSessionRegistry();
    const session = registry.open("sde-session-2", context, sidecar);
    assert.strictEqual(
      registry.acceptRequest(session.sessionId, 1, session.epoch),
      true,
    );
    assert.strictEqual(
      registry.acceptRequest(session.sessionId, 1, session.epoch),
      false,
    );
    assert.strictEqual(registry.releaseParent("sde-session-2"), 1);
    assert.strictEqual(
      registry.isCurrent(session.sessionId, session.epoch),
      false,
    );
  });

  test("normalizes only Japanese and English language families", () => {
    assert.strictEqual(normalizeScheduleImpactCalendarLanguage("ja"), "ja");
    assert.strictEqual(normalizeScheduleImpactCalendarLanguage("ja-JP"), "ja");
    assert.strictEqual(normalizeScheduleImpactCalendarLanguage("en-GB"), "en");
    assert.strictEqual(normalizeScheduleImpactCalendarLanguage("fr"), "en");
  });
});
