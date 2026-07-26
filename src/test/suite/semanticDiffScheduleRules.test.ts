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
        ["changed-time", "/root/main", "2026-04-10"],
        ["removed", "/root/main/nested", "2026-04-11"],
        ["added", "/root/main/nested", "2026-04-12"],
      ],
    );
    assert.deepStrictEqual(result.unsupportedDecisions, []);
    assert.deepStrictEqual(result.zeroRunCandidates, []);
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
      [after.id],
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
