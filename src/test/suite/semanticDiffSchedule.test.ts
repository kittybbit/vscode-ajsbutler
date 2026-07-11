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
        change.summary,
      ]),
      [
        [
          "changed-time",
          "/root/main run on 2026-04-10 changed from 09:00 to 10:00",
        ],
        ["removed", "/root/main/nested run on 2026-04-11 10:00 removed"],
        ["added", "/root/main/nested run on 2026-04-12 10:00 added"],
      ],
    );
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
      result.confirmationRequired.map((item) => item.changeContent),
      ["main has no calculated runs in the schedule comparison period"],
    );
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
      result.unsupportedItems.map((item) => item.message).sort(),
      [
        "/root/main cy=(1,d): cycle schedules are not calculated in this slice",
        "/root/main ln=1: inherited parent-rule schedules are not calculated in this slice",
        "/root/main sd=2,2026/04/10: matching st for schedule rule 2 is missing or uncalculated",
        "/root/main sd=2026/04/31: schedule date is not a valid calendar day in the comparison period",
        "/root/main sd=en: schedule date is not a supported explicit calendar day in YYYY/MM/DD, MM/DD, or DD form",
        "/root/main st=3,11:00: matching sd for this start-time rule is missing",
        "/root/main st=+27:03: start time is missing, unparsable, offset-based, day-crossing, or outside HH:MM",
      ],
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
      result.unsupportedItems.map((item) => item.message),
      ["schedule comparison period is invalid: from=2026-05-01, to=2026-04-01"],
    );
    assert.deepStrictEqual(result.limitations, [
      {
        code: "invalid_schedule_comparison_period",
        kind: "uncalculated",
        message:
          "schedule comparison period is invalid: from=2026-05-01, to=2026-04-01",
      },
    ]);
  });
});
