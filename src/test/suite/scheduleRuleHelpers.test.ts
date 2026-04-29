import * as assert from "assert";
import {
  parseClosedDaySubstitutionValue,
  parseCycleValue,
  parseDelayTimeValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseScheduleDateValue,
  parseShiftDaysValue,
  parseStartTimeValue,
  parseWaitCountValue,
  parseWaitTimeValue,
  resolveEffectiveStartConditionMonitoringPair,
} from "../../domain/models/parameters/scheduleRuleHelpers";

suite("Schedule rule helpers", () => {
  test("parses supported schedule-rule values with omitted rule defaults", () => {
    assert.deepStrictEqual(parseScheduleDateValue("en"), {
      rule: 1,
      yearMonth: undefined,
      day: "en",
    });
    assert.deepStrictEqual(parseScheduleDateValue("2,2026/04/27"), {
      rule: 2,
      yearMonth: "2026/04/",
      day: "27",
    });
    assert.deepStrictEqual(parseStartTimeValue("+09:00"), {
      rule: 1,
      value: "+09:00",
    });
    assert.deepStrictEqual(parseDelayTimeValue("2,U60"), {
      rule: 2,
      value: "U60",
    });
    assert.deepStrictEqual(parseWaitTimeValue("un"), {
      rule: 1,
      value: "un",
    });
    assert.deepStrictEqual(parseParentScheduleRuleValue("3"), {
      rule: 1,
      value: "3",
    });
    assert.deepStrictEqual(parseCycleValue("(3,d)"), {
      rule: 1,
      value: "(3,d)",
    });
    assert.deepStrictEqual(parseClosedDaySubstitutionValue("ca"), {
      rule: 1,
      value: "ca",
    });
    assert.deepStrictEqual(parseShiftDaysValue("5"), {
      rule: 1,
      value: "5",
    });
    assert.deepStrictEqual(parseWaitCountValue("un"), {
      rule: 1,
      value: "un",
    });
  });

  test("parses cftd defaults and mode-specific max-shift fields", () => {
    assert.deepStrictEqual(parseScheduleByDaysFromStartValue("be"), {
      rule: 1,
      type: "be",
      scheduleByDaysFromStart: "1",
      maxShiftableDays: "10",
    });
    assert.deepStrictEqual(parseScheduleByDaysFromStartValue("2,af,4,8"), {
      rule: 2,
      type: "af",
      scheduleByDaysFromStart: "4",
      maxShiftableDays: "8",
    });
    assert.deepStrictEqual(parseScheduleByDaysFromStartValue("db,4,8"), {
      rule: 1,
      type: "db",
      scheduleByDaysFromStart: "4",
      maxShiftableDays: undefined,
    });
    assert.deepStrictEqual(parseScheduleByDaysFromStartValue("no"), {
      rule: 1,
      type: "no",
      scheduleByDaysFromStart: undefined,
      maxShiftableDays: undefined,
    });
  });

  test("does not partially parse unsupported value shapes", () => {
    assert.strictEqual(parseStartTimeValue("09:00x"), undefined);
    assert.strictEqual(parseDelayTimeValue("+09:00"), undefined);
    assert.strictEqual(parseWaitTimeValue("M120"), undefined);
    assert.strictEqual(parseCycleValue("(3,q)"), undefined);
    assert.strictEqual(parseClosedDaySubstitutionValue("before"), undefined);
    assert.strictEqual(parseScheduleByDaysFromStartValue("be,3,9x"), undefined);
  });

  test("resolves effective wc and wt pairs", () => {
    assert.deepStrictEqual(
      resolveEffectiveStartConditionMonitoringPair("4", "00:30"),
      {
        numberOfTimes: "4",
        time: "00:30",
      },
    );
    assert.deepStrictEqual(
      resolveEffectiveStartConditionMonitoringPair("no", "00:30"),
      {},
    );
    assert.deepStrictEqual(
      resolveEffectiveStartConditionMonitoringPair("4", "no"),
      {},
    );
    assert.deepStrictEqual(
      resolveEffectiveStartConditionMonitoringPair(undefined, "00:30"),
      {},
    );
  });
});
