import * as assert from "assert";
import type {
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { evaluateSemanticDiffSchedule } from "../../domain/services/semantic-diff/semanticDiffScheduleRules";

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
        ["cy", "(1,d)", "cycle-schedule", undefined],
        ["ln", "1", "inherited-parent-rule", undefined],
        ["sd", "2,2026/04/10", "missing-start-time", 2],
        ["sd", "2026/04/31", "invalid-calendar-day", undefined],
        ["sd", "en", "unsupported-schedule-date", undefined],
        ["st", "+27:03", "invalid-start-time", undefined],
        ["st", "3,11:00", "unpaired-start-time", undefined],
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
      [after.id],
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

  test("uses interpreted token categories and rule association", () => {
    const after = jobnet("/root/main", {
      sd: [
        "2026/04/10",
        "0,15",
        "0,ud",
        "+15",
        "2,2026/04/31",
        "145,2026/04/10",
        "malformed",
      ],
      st: ["09:00", "0,10:00", "2,11:00"],
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
        ["0,ud", "unsupported-schedule-date", undefined],
        ["145,2026/04/10", "missing-start-time", 145],
        ["2,2026/04/31", "invalid-calendar-day", undefined],
        ["+15", "unsupported-schedule-date", undefined],
        ["malformed", "unsupported-schedule-date", undefined],
      ].sort(),
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
