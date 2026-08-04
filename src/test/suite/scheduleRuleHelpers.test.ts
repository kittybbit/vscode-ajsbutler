import * as assert from "assert";
import {
  interpretScheduleDateValue,
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
  test("interprets schedule-date rule association and token categories", () => {
    assert.deepStrictEqual(interpretScheduleDateValue("en"), {
      rule: 1,
      hasExplicitRuleNumber: false,
      year: undefined,
      month: undefined,
      dayValue: "en",
      day: { kind: "en" },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("2,2026/04/27"), {
      rule: 2,
      hasExplicitRuleNumber: true,
      year: 2026,
      month: 4,
      dayValue: "27",
      day: { kind: "calendar", value: 27 },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("3,+10"), {
      rule: 3,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "+10",
      day: { kind: "relative", value: 10 },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("4,*10"), {
      rule: 4,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "*10",
      day: { kind: "open", value: 10 },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("5,@b-30"), {
      rule: 5,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "@b-30",
      day: { kind: "backward", prefix: "@", offset: 30 },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("6,+su:b"), {
      rule: 6,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "+su:b",
      day: {
        kind: "weekday",
        prefix: "+",
        weekday: "su",
        occurrence: "b",
      },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("0,ud"), {
      rule: 0,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "ud",
      day: { kind: "ud" },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("0,15"), {
      rule: 0,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "15",
      day: { kind: "calendar", value: 15 },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("145,2036/12/31"), {
      rule: 145,
      hasExplicitRuleNumber: true,
      year: 2036,
      month: 12,
      dayValue: "31",
      day: { kind: "calendar", value: 31 },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("ud"), {
      rule: 1,
      hasExplicitRuleNumber: false,
      year: undefined,
      month: undefined,
      dayValue: "ud",
      day: { kind: "ud" },
    });
    assert.deepStrictEqual(interpretScheduleDateValue("1,ud"), {
      rule: 1,
      hasExplicitRuleNumber: true,
      year: undefined,
      month: undefined,
      dayValue: "ud",
      day: { kind: "ud" },
    });
  });

  test("keeps the legacy schedule-date helper as a compatibility projection", () => {
    const values = [
      "en",
      "2,2026/04/27",
      "3,+10",
      "4,*10",
      "5,@b-30",
      "6,+su:b",
      "0,ud",
      "0,15",
      "145,2036/12/31",
      "ud",
      "1,ud",
      "0000/00/01",
      "1,2024/02/xx",
      "1,",
    ];

    for (const value of values) {
      const interpreted = interpretScheduleDateValue(value);
      const legacy = parseScheduleDateValue(value);

      if (interpreted === undefined) {
        assert.strictEqual(legacy, undefined);
        continue;
      }

      const yearMonth =
        interpreted.month === undefined
          ? undefined
          : `${
              interpreted.year === undefined
                ? ""
                : `${String(interpreted.year).padStart(4, "0")}/`
            }${String(interpreted.month).padStart(2, "0")}/`;
      assert.deepStrictEqual(legacy, {
        rule: interpreted.rule,
        yearMonth,
        day: interpreted.dayValue,
      });
    }
  });

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

  test("preserves explicit schedule-rule numbers at the helper boundary", () => {
    assert.deepStrictEqual(parseScheduleDateValue("144,2036/12/31"), {
      rule: 144,
      yearMonth: "2036/12/",
      day: "31",
    });
    assert.deepStrictEqual(parseStartTimeValue("144,+47:59"), {
      rule: 144,
      value: "+47:59",
    });
    assert.deepStrictEqual(parseWaitCountValue("144,999"), {
      rule: 144,
      value: "999",
    });
    assert.deepStrictEqual(parseWaitTimeValue("144,2879"), {
      rule: 144,
      value: "2879",
    });
    assert.deepStrictEqual(parseScheduleByDaysFromStartValue("144,af,31,31"), {
      rule: 144,
      type: "af",
      scheduleByDaysFromStart: "31",
      maxShiftableDays: "31",
    });
  });

  test("applies cftd defaults and mode-specific max-shift fields", () => {
    const cases = [
      [
        "be",
        {
          rule: 1,
          type: "be",
          scheduleByDaysFromStart: "1",
          maxShiftableDays: "10",
        },
      ],
      [
        "2,af,4,8",
        {
          rule: 2,
          type: "af",
          scheduleByDaysFromStart: "4",
          maxShiftableDays: "8",
        },
      ],
      [
        "db,4,8",
        {
          rule: 1,
          type: "db",
          scheduleByDaysFromStart: "4",
          maxShiftableDays: undefined,
        },
      ],
      [
        "da,31",
        {
          rule: 1,
          type: "da",
          scheduleByDaysFromStart: "31",
          maxShiftableDays: undefined,
        },
      ],
      [
        "no",
        {
          rule: 1,
          type: "no",
          scheduleByDaysFromStart: undefined,
          maxShiftableDays: undefined,
        },
      ],
    ] as const;

    for (const [rawValue, expected] of cases) {
      assert.deepStrictEqual(
        parseScheduleByDaysFromStartValue(rawValue),
        expected,
      );
    }
  });

  test("does not partially parse unsupported value shapes", () => {
    assert.strictEqual(parseScheduleDateValue("1,2024/02/xx"), undefined);
    assert.strictEqual(parseScheduleDateValue("1,"), undefined);
    assert.strictEqual(parseStartTimeValue("09:00x"), undefined);
    assert.strictEqual(parseDelayTimeValue("+09:00"), undefined);
    assert.strictEqual(parseWaitTimeValue("M120"), undefined);
    assert.strictEqual(parseCycleValue("(3,q)"), undefined);
    assert.strictEqual(parseClosedDaySubstitutionValue("before"), undefined);
    assert.strictEqual(parseScheduleByDaysFromStartValue("be,3,9x"), undefined);
    assert.strictEqual(
      parseScheduleByDaysFromStartValue("be,3,9,1"),
      undefined,
    );
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
    assert.deepStrictEqual(
      resolveEffectiveStartConditionMonitoringPair("un", "un"),
      {
        numberOfTimes: "un",
        time: "un",
      },
    );
    assert.deepStrictEqual(
      resolveEffectiveStartConditionMonitoringPair("invalid", "00:30"),
      {},
    );
  });
});
