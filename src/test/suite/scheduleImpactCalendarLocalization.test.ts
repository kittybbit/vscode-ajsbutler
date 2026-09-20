import * as assert from "assert";
import {
  getScheduleImpactCalendarLabels,
  normalizeScheduleImpactCalendarLocale,
} from "../../resource/i18n/scheduleImpactCalendar";
import { formatLocalizedDateRange } from "../../presentation/webview/editor/shared/result/formatLocalizedDateRange";

suite("Schedule impact calendar localization", () => {
  test("uses Japanese only for the Japanese language family", () => {
    assert.strictEqual(normalizeScheduleImpactCalendarLocale("ja-JP"), "ja");
    assert.strictEqual(normalizeScheduleImpactCalendarLocale("en-US"), "en");
    assert.strictEqual(normalizeScheduleImpactCalendarLocale("fr"), "en");
    assert.strictEqual(
      getScheduleImpactCalendarLabels("ja").title,
      "スケジュール影響カレンダー",
    );
  });

  test("does not localize facts in result announcements", () => {
    const english = getScheduleImpactCalendarLabels("en");
    const japanese = getScheduleImpactCalendarLabels("ja");
    assert.strictEqual(
      english.results(2, 5),
      "2 of 5 timeline entries visible",
    );
    assert.strictEqual(
      english.selected("3"),
      "Schedule impact calendar contains 3 entries.",
    );
    assert.strictEqual(japanese.results(2, 5), "5 件中 2 件を表示");
    assert.strictEqual(
      english.selectedItem("2026-01-01 /jobs/example.ajs, occurrence 2"),
      "Selected schedule impact: 2026-01-01 /jobs/example.ajs, occurrence 2.",
    );
    assert.strictEqual(
      japanese.selectedItem("2026-01-01 /jobs/example.ajs, occurrence 2"),
      "選択したスケジュール影響: 2026-01-01 /jobs/example.ajs, occurrence 2。",
    );
  });

  test("uses localized range separators for half-open periods", () => {
    assert.strictEqual(
      formatLocalizedDateRange("2026-01-01", "2026-01-04", "en"),
      "2026-01-01 – 2026-01-04",
    );
    assert.strictEqual(
      formatLocalizedDateRange("2026-01-01", "2026-01-04", "ja"),
      "2026-01-01〜2026-01-04",
    );
  });
});
