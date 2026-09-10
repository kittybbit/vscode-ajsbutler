import * as assert from "assert";
import {
  ScheduleImpactCalendarSessionRegistry,
  normalizeScheduleImpactCalendarLanguage,
} from "../../presentation/vscode/webview/scheduleImpactCalendarSessionRegistry";
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
