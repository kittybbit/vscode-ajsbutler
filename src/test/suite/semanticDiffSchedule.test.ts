import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";

const params = (values: Record<string, string | string[]>): AjsParameter[] =>
  Object.entries(values).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map((item) => ({ key, value: item }))
      : [{ key, value }],
  );

const unit = (overrides: Partial<AjsUnit>): AjsUnit => ({
  id: overrides.absolutePath ?? "/root/jobnet/job",
  name: "job",
  unitAttribute: "job,,jp1admin,",
  unitType: "j",
  absolutePath: "/root/jobnet/job",
  depth: 2,
  parentId: "/root/jobnet",
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: params({ ty: "j", sc: "echo ok" }),
  relations: [] as AjsRelation[],
  children: [],
  ...overrides,
});

const jobnet = (
  absolutePath: string,
  children: AjsUnit[],
  parameterValues: Record<string, string | string[]>,
  overrides: Partial<AjsUnit> = {},
): AjsUnit => {
  const name = absolutePath.split("/").at(-1) ?? "jobnet";
  return unit({
    id: absolutePath,
    name,
    unitAttribute: `${name},,jp1admin,`,
    unitType: "n",
    absolutePath,
    depth: absolutePath.split("/").length - 2,
    parentId: absolutePath.split("/").slice(0, -1).join("/"),
    isRootJobnet: absolutePath.split("/").length === 3,
    hasSchedule: true,
    parameters: params({ ty: "n", ...parameterValues }),
    children,
    ...overrides,
  });
};

const document = (rootChildren: AjsUnit[]): AjsDocument => ({
  rootUnits: [
    unit({
      id: "/root",
      name: "root",
      unitAttribute: "root,,jp1admin,",
      unitType: "g",
      absolutePath: "/root",
      depth: 0,
      parentId: undefined,
      isRoot: true,
      layout: { h: 0, v: 0 },
      parameters: params({ ty: "g" }),
      children: rootChildren,
    }),
  ],
  warnings: [],
});

suite("Semantic Diff Schedule", () => {
  test("compares explicit root and nested jobnet runs within a bounded period", () => {
    const beforeNested = jobnet(
      "/root/main/nested",
      [],
      { sd: "04/11", st: "10:00" },
      { parentId: "/root/main", isRootJobnet: false },
    );
    const afterNested = jobnet(
      "/root/main/nested",
      [],
      { sd: "04/12", st: "10:00" },
      { parentId: "/root/main", isRootJobnet: false },
    );
    const beforeRoot = jobnet("/root/main", [beforeNested], {
      sd: "2026/04/10",
      st: "09:00",
    });
    const afterRoot = jobnet("/root/main", [afterNested], {
      sd: "2026/04/10",
      st: "10:00",
    });

    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([afterRoot]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });

    assert.deepStrictEqual(result.scheduleComparison?.period, {
      from: "2026-04-01",
      to: "2026-05-01",
    });
    assert.deepStrictEqual(
      result.scheduleComparison?.runChanges.map((change) => [
        change.kind,
        change.unitPath,
        change.date,
        change.before?.time ?? null,
        change.after?.time ?? null,
      ]),
      [
        ["added", "/root/main/nested", "2026-04-12", null, "10:00"],
        ["changed-time", "/root/main", "2026-04-10", "09:00", "10:00"],
        ["removed", "/root/main/nested", "2026-04-11", "10:00", null],
      ],
    );
    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["calculated-schedule-run-removed"],
    );
    assert.deepStrictEqual(result.confirmationRequired[0], {
      id: "confirm:schedule-run-removed:/root/main/nested:2026-04-11:10:00:1",
      reasonCode: "calculated-schedule-run-removed",
      target: {
        kind: "jobnet",
        unit: {
          id: afterNested.id,
          name: afterNested.name,
          absolutePath: afterNested.absolutePath,
          unitType: afterNested.unitType,
        },
      },
      relatedTargets: [],
      detail: {
        unitPath: afterNested.absolutePath,
        parameterKey: null,
        relationPair: null,
        scheduleRule: 1,
        period: { from: "2026-04-01", to: "2026-05-01" },
        beforeValues: ["date=2026-04-11", "time=10:00"],
        afterValues: [],
        rawValues: [],
        removedSources: [],
      },
      constraints: [
        {
          code: "jp1-ajs3-v13-rule-basis",
          detail: {
            unitPath: afterNested.absolutePath,
            parameterKey: null,
            relationPair: null,
            scheduleRule: 1,
            period: { from: "2026-04-01", to: "2026-05-01" },
            beforeValues: ["date=2026-04-11", "time=10:00"],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          warning: null,
        },
        {
          code: "runtime-state-not-verified",
          detail: {
            unitPath: afterNested.absolutePath,
            parameterKey: null,
            relationPair: null,
            scheduleRule: 1,
            period: { from: "2026-04-01", to: "2026-05-01" },
            beforeValues: ["date=2026-04-11", "time=10:00"],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          warning: null,
        },
        {
          code: "comparison-period",
          detail: {
            unitPath: afterNested.absolutePath,
            parameterKey: null,
            relationPair: null,
            scheduleRule: 1,
            period: { from: "2026-04-01", to: "2026-05-01" },
            beforeValues: ["date=2026-04-11", "time=10:00"],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          warning: null,
        },
      ],
      warning: null,
    });
  });

  test("reports after-side schedule-defined jobnets with zero calculated runs", () => {
    const beforeRoot = jobnet("/root/main", [], {
      sd: "2026/04/10",
      st: "09:00",
    });
    const afterRoot = jobnet("/root/main", [], {
      sd: "2026/06/01",
      st: "09:00",
    });

    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([afterRoot]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["calculated-schedule-run-removed", "no-calculated-schedule-run"],
    );
    const zeroRunConfirmation = result.confirmationRequired.find(
      (item) => item.reasonCode === "no-calculated-schedule-run",
    );
    assert.deepStrictEqual(zeroRunConfirmation?.detail, {
      unitPath: afterRoot.absolutePath,
      parameterKey: null,
      relationPair: null,
      scheduleRule: null,
      period: { from: "2026-04-01", to: "2026-05-01" },
      beforeValues: [],
      afterValues: [],
      rawValues: [],
      removedSources: [],
    });
    assert.deepStrictEqual(
      zeroRunConfirmation?.constraints.map((constraint) => constraint.code),
      [
        "jp1-ajs3-v13-rule-basis",
        "runtime-state-not-verified",
        "comparison-period",
      ],
    );
    assert.strictEqual(zeroRunConfirmation?.warning, null);
  });

  test("reports unsupported schedule elements as uncalculated instead of guessing", () => {
    const afterRoot = jobnet("/root/main", [], {
      cy: "(1,d)",
      ln: "1",
      sd: ["en", "2,2026/04/10", "2026/04/31"],
      st: ["+27:03", "3,11:00"],
    });

    const result = compareSemanticDiff({
      before: document([]),
      after: document([afterRoot]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });

    assert.deepStrictEqual(
      result.unsupportedItems.map((item) => item.reasonCode).sort(),
      [
        "cycle-schedule",
        "inherited-parent-rule",
        "invalid-calendar-day",
        "invalid-start-time",
        "missing-start-time",
        "unpaired-start-time",
        "unsupported-schedule-date",
      ],
    );
    assert.ok(
      result.unsupportedItems.every(
        (item) =>
          item.detail.unitPath === afterRoot.absolutePath &&
          item.warning?.code === item.reasonCode &&
          item.warning?.fallbackText !== null,
      ),
    );
    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("keeps unsupported-only and one-sided supported evidence non-conclusive", () => {
    const period = {
      from: "2026-04-01",
      to: "2026-05-01",
    };
    const compare = (beforeRoot: AjsUnit, afterRoot: AjsUnit) =>
      compareSemanticDiff({
        before: document(beforeRoot ? [beforeRoot] : []),
        after: document(afterRoot ? [afterRoot] : []),
        options: { jobGroupPath: "/root", scheduleComparisonPeriod: period },
      });

    const unsupportedBefore = jobnet("/root/main", [], {
      cy: "(1,d)",
      sd: "en",
      st: "+27:03",
    });
    const unsupportedAfter = jobnet("/root/main", [], {
      cy: "(1,d)",
      sd: "en",
      st: "+27:03",
    });
    assert.deepStrictEqual(
      compare(unsupportedBefore, unsupportedAfter).confirmationRequired,
      [],
    );

    const supportedBefore = jobnet("/root/main", [], {
      sd: "2026/04/10",
      st: "09:00",
    });
    const unsupportedOnlyAfter = jobnet("/root/main", [], {
      cy: "(1,d)",
    });
    assert.deepStrictEqual(
      compare(supportedBefore, unsupportedOnlyAfter).confirmationRequired,
      [],
    );

    const unsupportedOnlyBefore = jobnet("/root/main", [], {
      cy: "(1,d)",
    });
    const supportedAfter = jobnet("/root/main", [], {
      sd: "2026/04/10",
      st: "09:00",
    });
    assert.deepStrictEqual(
      compare(unsupportedOnlyBefore, supportedAfter).confirmationRequired,
      [],
    );
  });

  test("keeps mixed unsupported evidence while reporting supported zero and removed runs", () => {
    const beforeRoot = jobnet("/root/main", [], {
      sd: "2026/04/10",
      st: "09:00",
    });
    const afterRoot = jobnet("/root/main", [], {
      sd: ["2026/06/01", "en"],
      st: "09:00",
    });

    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([afterRoot]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["calculated-schedule-run-removed", "no-calculated-schedule-run"],
    );
    assert.ok(
      result.unsupportedItems.some(
        (item) =>
          item.side === "after" &&
          item.reasonCode === "unsupported-schedule-date",
      ),
    );
  });

  test("does not duplicate a schedule warning for a before-only removed jobnet", () => {
    const beforeRoot = jobnet("/root/main", [], {
      sd: "2026/04/10",
      st: "09:00",
    });

    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });

    assert.deepStrictEqual(
      result.scheduleComparison?.runChanges.map((change) => change.kind),
      ["removed"],
    );
    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("deduplicates identical removed-run confirmation IDs", () => {
    const beforeRoot = jobnet("/root/main", [], {
      sd: ["2026/04/10", "2026/04/10"],
      st: "09:00",
    });
    const afterRoot = jobnet("/root/main", [], {
      sd: "2026/06/01",
      st: "09:00",
    });

    const result = compareSemanticDiff({
      before: document([beforeRoot]),
      after: document([afterRoot]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-04-01",
          to: "2026-05-01",
        },
      },
    });

    assert.strictEqual(
      result.confirmationRequired.filter(
        (item) => item.reasonCode === "calculated-schedule-run-removed",
      ).length,
      1,
    );
  });

  test("reports invalid comparison periods as uncalculated schedule input", () => {
    const afterRoot = jobnet("/root/main", [], {
      sd: "2026/04/10",
      st: "09:00",
    });

    const result = compareSemanticDiff({
      before: document([]),
      after: document([afterRoot]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: {
          from: "2026-05-01",
          to: "2026-04-01",
        },
      },
    });

    assert.strictEqual(result.scheduleComparison, undefined);
    assert.deepStrictEqual(
      result.unsupportedItems.map((item) => item.reasonCode),
      ["invalid-schedule-comparison-period"],
    );
    assert.deepStrictEqual(result.limitations, [
      {
        code: "invalid_schedule_comparison_period",
        kind: "uncalculated",
        side: null,
        unitPath: null,
        detail: {
          unitPath: null,
          parameterKey: null,
          relationPair: null,
          scheduleRule: null,
          period: { from: "2026-05-01", to: "2026-04-01" },
          beforeValues: [],
          afterValues: [],
          rawValues: [],
          removedSources: [],
        },
        warning: {
          code: "invalid-schedule-comparison-period",
          detail: {
            unitPath: null,
            parameterKey: null,
            relationPair: null,
            scheduleRule: null,
            period: { from: "2026-05-01", to: "2026-04-01" },
            beforeValues: [],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          fallbackText:
            "schedule comparison period is invalid: from=2026-05-01, to=2026-04-01",
        },
      },
    ]);
  });
});
