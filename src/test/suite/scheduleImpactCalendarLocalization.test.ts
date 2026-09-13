import * as assert from "assert";
import {
  getScheduleImpactCalendarLabels,
  normalizeScheduleImpactCalendarLocale,
} from "../../resource/i18n/scheduleImpactCalendar";

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
    assert.strictEqual(japanese.results(2, 5), "5 件中 2 件を表示");
  });
});
