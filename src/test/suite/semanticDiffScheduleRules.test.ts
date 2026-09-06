import * as assert from "assert";
import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import {
  compareScheduleRuns,
  evaluateSemanticDiffSchedule,
  interpretSchedule,
  projectScheduleRuns,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";

const parameters = (
  values: Record<string, string | string[]>,
): AjsParameter[] =>
  Object.entries(values).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map((item) => ({ key, value: item }))
      : [{ key, value }],
  );

const jobnet = (
  absolutePath: string,
  parameterValues: Record<string, string | string[]>,
): AjsUnit => ({
  id: absolutePath,
  name: absolutePath.split("/").at(-1) ?? absolutePath,
  unitAttribute: "jobnet,,jp1admin,",
  unitType: "n",
  absolutePath,
  depth: 1,
  parentId: "/root",
  isRoot: false,
  isRootJobnet: true,
  hasSchedule: true,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: parameters({ ty: "n", ...parameterValues }),
  relations: [],
  children: [],
});

suite("Semantic Diff Schedule Rules", () => {
  test("evaluates explicit runs within the bounded period", () => {
    const beforeRoot = jobnet("/root/main", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const afterRoot = jobnet("/root/main", {
      sd: "2026/04/10",
      st: "10:00",
    });
    const beforeNested = jobnet("/root/main/nested", {
      sd: "04/11",
      st: "10:00",
    });
    const afterNested = jobnet("/root/main/nested", {
      sd: "04/12",
      st: "10:00",
    });

    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [beforeRoot, beforeNested],
      afterUnits: [afterRoot, afterNested],
      matches: [
        { before: beforeRoot, after: afterRoot },
        { before: beforeNested, after: afterNested },
      ],
      period: { from: "2026-04-01", to: "2026-05-01" },
    });

    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.deepStrictEqual(
      result.runDecisions.map((decision) => [
        decision.kind,
        decision.unitPath,
        decision.date,
      ]),
      [
        ["added", "/root/main/nested", "2026-04-12"],
        ["changed-time", "/root/main", "2026-04-10"],
        ["removed", "/root/main/nested", "2026-04-11"],
      ],
    );
    assert.deepStrictEqual(result.unsupportedDecisions, []);
    assert.deepStrictEqual(result.zeroRunCandidates, []);
    assert.deepStrictEqual(
      result.pairEvaluations.map((pair) => [
        pair.after.unit.id,
        pair.before.evidence,
        pair.before.supportedPairCount,
        pair.after.evidence,
        pair.after.supportedPairCount,
      ]),
      [
        ["/root/main", "supported", 1, "supported", 1],
        ["/root/main/nested", "supported", 1, "supported", 1],
      ],
    );
  });

  test("keeps unsupported and zero-run evidence explicit", () => {
    const after = jobnet("/root/main", {
      cy: "(1,d)",
      ln: "1",
      sd: ["en", "2,2026/04/10", "2026/04/31"],
      st: ["+27:03", "3,11:00"],
    });

    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [after],
      matches: [],
      period: { from: "2026-04-01", to: "2026-05-01" },
    });

    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.deepStrictEqual(
      result.unsupportedDecisions
        .map((decision) => [
          decision.parameter.key,
          decision.parameter.value,
          decision.reason,
          decision.scheduleRule,
        ])
        .sort(),
      [
        ["cy", "(1,d)", "cycle-schedule", 1],
        ["ln", "1", "inherited-parent-rule", 1],
        ["sd", "2,2026/04/10", "missing-start-time", 2],
        ["sd", "2026/04/31", "invalid-calendar-day", 1],
        ["sd", "en", "unsupported-schedule-date", 1],
        ["st", "+27:03", "invalid-start-time", 1],
        ["st", "3,11:00", "unpaired-start-time", 3],
      ].sort(),
    );
    assert.deepStrictEqual(
      result.zeroRunCandidates.map((unit) => unit.id),
      [],
    );
    assert.deepStrictEqual(result.pairEvaluations, []);
  });

  test("classifies mixed supported and unsupported evidence without losing pairs", () => {
    const before = jobnet("/root/main", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const after = jobnet("/root/main", {
      sd: ["2026/06/01", "en"],
      st: "09:00",
    });

    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [before],
      afterUnits: [after],
      matches: [{ before, after }],
      period: { from: "2026-04-01", to: "2026-05-01" },
    });

    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.deepStrictEqual(
      result.zeroRunCandidates.map((unit) => unit.id),
      [],
    );
    assert.deepStrictEqual(result.pairEvaluations, [
      {
        before: {
          unit: before,
          evidence: "supported",
          supportedPairCount: 1,
          runs: [
            {
              unitPath: before.absolutePath,
              unitName: before.name,
              rule: 1,
              date: "2026-04-10",
              time: "09:00",
            },
          ],
        },
        after: {
          unit: after,
          evidence: "mixed",
          supportedPairCount: 1,
          runs: [],
        },
      },
    ]);
  });

  test("exposes separate interpretation, projection, and differ boundaries", () => {
    const after = jobnet("/root/main", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const interpretation = interpretSchedule(after);
    assert.deepStrictEqual(interpretSchedule({ unit: after }), interpretation);
    assert.strictEqual(interpretation.scheduleDateRules[0].status, "supported");
    assert.strictEqual(interpretation.startTimeRules[0].status, "supported");
    assert.strictEqual(
      interpretation.scheduleDateRules[0].evidence.id,
      "schedule:sd:supported:1",
    );

    const projection = projectScheduleRuns({
      interpretation,
      period: { from: "2026-04-01", to: "2026-05-01" },
    });
    assert.strictEqual(projection.status, "supported");
    assert.strictEqual(projection.completeness, "complete");
    assert.deepStrictEqual(
      projection.runs.map((run) => run.date),
      ["2026-04-10"],
    );
    assert.deepStrictEqual(
      compareScheduleRuns(projection.runs, []).map((decision) => decision.kind),
      ["removed"],
    );
  });

  test("keeps valid dates independent from invalid start-time evidence", () => {
    const after = jobnet("/root/main", {
      sd: "2026/04/10",
      st: "+27:03",
    });
    const interpretation = interpretSchedule(after);
    const projection = projectScheduleRuns({
      interpretation,
      period: { from: "2026-04-01", to: "2026-05-01" },
    });

    assert.deepStrictEqual(projection.runs, []);
    assert.strictEqual(
      projection.rules.find((rule) => rule.parameter.key === "sd")?.status,
      "supported",
    );
    assert.strictEqual(
      projection.rules.find((rule) => rule.parameter.key === "st")?.reason,
      "invalid-start-time",
    );
    assert.deepStrictEqual(
      evaluateSemanticDiffSchedule({
        beforeUnits: [],
        afterUnits: [after],
        matches: [],
        period: { from: "2026-04-01", to: "2026-05-01" },
      }).kind,
      "evaluated",
    );
  });

  test("treats rule-zero undefined schedules as complete no-runs evidence", () => {
    const after = jobnet("/root/main", {
      sd: "0,ud",
      st: "09:00",
    });
    const interpretation = interpretSchedule(after);
    assert.strictEqual(interpretation.hasRuleZeroUndefined, true);
    assert.strictEqual(
      interpretation.scheduleDateRules[0].evidence.id,
      "JP1-PARAM-SCHEDULE-UD-001",
    );
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [after],
      matches: [],
      period: { from: "2026-04-01", to: "2026-05-01" },
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.deepStrictEqual(
      result.zeroRunCandidates.map((unit) => unit.id),
      [after.id],
    );
  });

  test("does not evaluate an sc-only jobnet and retains jc as unresolved evidence", () => {
    const scriptOnly = jobnet("/root/script-only", { sc: "echo ok" });
    const withCalendarSelector = jobnet("/root/calendar", { jc: "/root/cal" });
    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [scriptOnly, withCalendarSelector],
      matches: [],
      period: { from: "2026-04-01", to: "2026-05-01" },
    });
    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.deepStrictEqual(result.pairEvaluations, []);
    assert.deepStrictEqual(
      result.unsupportedDecisions.map((decision) => [
        decision.unit.id,
        decision.parameter.key,
        decision.reason,
      ]),
      [[withCalendarSelector.id, "jc", "calendar-selection"]],
    );
  });

  test("uses interpreted token categories and rule association", () => {
    const after = jobnet("/root/main", {
      sd: [
        "2026/04/10",
        "0,15",
        "+15",
        "2,2026/04/31",
        "145,2026/04/10",
        "malformed",
      ],
      st: ["09:00", "0,10:00", "2,11:00", "3,11:00"],
    });

    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [after],
      matches: [],
      period: { from: "2026-04-01", to: "2026-05-01" },
    });

    const interpretation = interpretSchedule(after);
    const malformed = interpretation.scheduleDateRules.find(
      (rule) => rule.parameter.value === "malformed",
    );
    assert.strictEqual(malformed?.status, "unsupported");
    assert.strictEqual(malformed?.reason, "unsupported-schedule-date");
    assert.strictEqual(
      malformed?.evidence.id,
      "schedule:sd:unsupported:malformed",
    );
    assert.deepStrictEqual(malformed?.evidence.rawParameters, [
      { key: "sd", value: "malformed" },
    ]);
    const unpaired = interpretation.startTimeRules.find(
      (rule) => rule.parameter.value === "3,11:00",
    );
    assert.strictEqual(unpaired?.rule, 3);
    assert.strictEqual(unpaired?.reason, "unpaired-start-time");
    assert.strictEqual(unpaired?.evidence.id, "schedule:st:unpaired:3");
    assert.deepStrictEqual(unpaired?.evidence.rawParameters, [
      { key: "st", value: "3,11:00" },
    ]);

    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.deepStrictEqual(
      result.runDecisions
        .filter((decision) => decision.kind === "added")
        .map((decision) => [decision.date, decision.after.rule]),
      [
        ["2026-04-10", 1],
        ["2026-04-15", 0],
      ],
    );
    assert.deepStrictEqual(
      result.unsupportedDecisions
        .filter((decision) => decision.parameter.key === "sd")
        .map((decision) => [
          decision.parameter.value,
          decision.reason,
          decision.scheduleRule,
        ])
        .sort(),
      [
        ["145,2026/04/10", "missing-start-time", 145],
        ["2,2026/04/31", "invalid-calendar-day", 2],
        ["+15", "unsupported-schedule-date", 1],
        ["malformed", "unsupported-schedule-date", undefined],
      ].sort(),
    );
  });

  test("keeps keyed unsupported handlers associated with their rules", () => {
    const after = jobnet("/root/main", {
      sh: "2,be",
      shd: "3,2",
      jc: "/root/calendar",
      cftd: "5,be,2,3",
    });

    assert.deepStrictEqual(
      interpretSchedule(after)
        .rules.filter((rule) => rule.reason !== undefined)
        .map((rule) => [
          rule.parameter.key,
          rule.rule,
          rule.reason,
          rule.evidence.rawParameters,
        ]),
      [
        ["sh", 2, "closed-day-substitution", [{ key: "sh", value: "2,be" }]],
        ["shd", 3, "shift-days", [{ key: "shd", value: "3,2" }]],
        [
          "jc",
          undefined,
          "calendar-selection",
          [{ key: "jc", value: "/root/calendar" }],
        ],
        ["cftd", 5, "days-from-start", [{ key: "cftd", value: "5,be,2,3" }]],
      ],
    );
  });

  test("projects fully qualified Gregorian month-end forms", () => {
    const after = jobnet("/root/main", {
      sd: [
        "1,2024/02/b",
        "2,1900/02/b",
        "3,2000/02/b-00",
        "4,2026/04/b-29",
        "5,2026/04/b-30",
        "6,2026/13/b",
        "7,2026/01/b-00",
        "8,2026/01/b-30",
        "9,2026/01/b-31",
      ],
      st: [
        "1,09:00",
        "2,09:00",
        "3,09:00",
        "4,09:00",
        "5,09:00",
        "6,09:00",
        "7,09:00",
        "8,09:00",
        "9,09:00",
      ],
    });
    const interpretation = interpretSchedule(after);
    assert.deepStrictEqual(
      interpretation.scheduleDateRules.map((rule) => [
        rule.parameter.value,
        rule.status,
        rule.evidence.id,
      ]),
      [
        ["1,2024/02/b", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["2,1900/02/b", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["3,2000/02/b-00", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["4,2026/04/b-29", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["5,2026/04/b-30", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["6,2026/13/b", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["7,2026/01/b-00", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["8,2026/01/b-30", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["9,2026/01/b-31", "supported", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
      ],
    );
    const projection = projectScheduleRuns({
      interpretation,
      period: { from: "1900-01-01", to: "2027-01-01" },
    });
    assert.deepStrictEqual(
      projection.runs.map((run) => [run.rule, run.date]),
      [
        [1, "2024-02-29"],
        [2, "1900-02-28"],
        [3, "2000-02-29"],
        [4, "2026-04-01"],
        [7, "2026-01-31"],
        [8, "2026-01-01"],
      ],
    );
    assert.deepStrictEqual(
      projection.rules
        .filter(
          (rule) =>
            rule.parameter.key === "sd" &&
            ["5,2026/04/b-30", "6,2026/13/b", "9,2026/01/b-31"].includes(
              rule.parameter.value,
            ),
        )
        .map((rule) => [rule.status, rule.reason, rule.evidence.id]),
      [
        ["invalid", "invalid-calendar-day", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["invalid", "invalid-calendar-day", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
        ["invalid", "invalid-calendar-day", "JP1-PARAM-SCHEDULE-MONTH-END-001"],
      ],
    );
    assert.strictEqual(
      projection.evidence.find((item) => item.rule === 1)?.id,
      "JP1-PARAM-SCHEDULE-MONTH-END-001",
    );
    assert.deepStrictEqual(
      projectScheduleRuns({
        interpretation,
        period: { from: "2024-02-29", to: "2024-03-01" },
      }).runs.map((run) => run.date),
      ["2024-02-29"],
    );
    assert.deepStrictEqual(
      projectScheduleRuns({
        interpretation,
        period: { from: "2024-02-01", to: "2024-02-29" },
      }).runs.map((run) => run.date),
      [],
    );
  });

  test("projects absolute weekday forms and keeps omitted or relative forms unresolved", () => {
    const after = jobnet("/root/main", {
      sd: [
        "1,2026/04/mo",
        "2,2026/04/mo:2",
        "3,2026/04/mo:b",
        "4,2026/02/su:5",
        "5,2026/04/mo:0",
        "6,2026/04/mo:6",
        "7,2026/04/+mo",
        "8,04/mo",
        "9,04/b",
        "10,b",
      ],
      st: [
        "1,09:00",
        "2,09:00",
        "3,09:00",
        "4,09:00",
        "5,09:00",
        "6,09:00",
        "7,09:00",
        "8,09:00",
        "9,09:00",
        "10,09:00",
      ],
    });
    const interpretation = interpretSchedule(after);
    assert.deepStrictEqual(
      interpretation.scheduleDateRules.map((rule) => [
        rule.parameter.value,
        rule.status,
        rule.evidence.id,
      ]),
      [
        ["1,2026/04/mo", "supported", "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        ["2,2026/04/mo:2", "supported", "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        ["3,2026/04/mo:b", "supported", "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        ["4,2026/02/su:5", "supported", "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        ["5,2026/04/mo:0", "supported", "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        ["6,2026/04/mo:6", "supported", "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        ["7,2026/04/+mo", "unsupported", "JP1-PARAM-SCHEDULE-RELATIVE-001"],
        ["8,04/mo", "unsupported", "schedule:sd:unsupported:8"],
        ["9,04/b", "unsupported", "schedule:sd:unsupported:9"],
        ["10,b", "unsupported", "schedule:sd:unsupported:10"],
      ],
    );
    const projection = projectScheduleRuns({
      interpretation,
      period: { from: "2026-02-01", to: "2026-05-01" },
    });
    assert.deepStrictEqual(
      projection.runs.map((run) => [run.rule, run.date]),
      [
        [1, "2026-04-06"],
        [2, "2026-04-13"],
        [3, "2026-04-27"],
      ],
    );
    assert.deepStrictEqual(
      projection.rules
        .filter(
          (rule) =>
            rule.parameter.key === "sd" && [4, 5, 6].includes(rule.rule ?? -1),
        )
        .map((rule) => [rule.rule, rule.status, rule.reason, rule.evidence.id]),
      [
        [4, "no-runs", undefined, "JP1-PARAM-SCHEDULE-WEEKDAY-001"],
        [
          5,
          "invalid",
          "invalid-calendar-day",
          "JP1-PARAM-SCHEDULE-WEEKDAY-001",
        ],
        [
          6,
          "invalid",
          "invalid-calendar-day",
          "JP1-PARAM-SCHEDULE-WEEKDAY-001",
        ],
      ],
    );
  });

  test("bounds calendar candidates to the comparison period", () => {
    const after = jobnet("/root/main", {
      sd: [
        ...Array.from({ length: 8 }, (_, index) =>
          String(index + 1).padStart(2, "0"),
        ),
        "en",
        "not-a-date",
      ],
      st: "09:00",
    });

    const result = evaluateSemanticDiffSchedule({
      beforeUnits: [],
      afterUnits: [after],
      matches: [],
      period: { from: "2024-01-01", to: "2027-01-01" },
    });

    assert.strictEqual(result.kind, "evaluated");
    if (result.kind !== "evaluated") {
      return;
    }
    assert.strictEqual(result.runDecisions.length, 8 * 36);
    assert.deepStrictEqual(
      result.unsupportedDecisions
        .filter((decision) => decision.parameter.key === "sd")
        .map((decision) => decision.reason),
      ["unsupported-schedule-date", "unsupported-schedule-date"],
    );
  });

  test("distinguishes missing and invalid comparison periods", () => {
    assert.deepStrictEqual(
      evaluateSemanticDiffSchedule({
        beforeUnits: [],
        afterUnits: [],
        matches: [],
      }),
      { kind: "not-requested" },
    );
    assert.deepStrictEqual(
      evaluateSemanticDiffSchedule({
        beforeUnits: [],
        afterUnits: [],
        matches: [],
        period: { from: "2026-05-01", to: "2026-04-01" },
      }),
      {
        kind: "invalid-period",
        period: { from: "2026-05-01", to: "2026-04-01" },
      },
    );
  });
});
