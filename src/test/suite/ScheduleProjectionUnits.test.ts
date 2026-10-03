import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { isDirectScheduleJobnet } from "../../domain/schedule/ScheduleInterpretation";
import { projectDirectScheduleUnits } from "../../domain/schedule/ScheduleProjection";

const parameters = (values: Record<string, string>): AjsParameter[] =>
  Object.entries(values).map(([key, value]) => ({ key, value }));

const unit = (
  absolutePath: string,
  unitType: AjsUnit["unitType"],
  values: Record<string, string> = {},
  children: AjsUnit[] = [],
): AjsUnit => ({
  id: absolutePath,
  name: absolutePath.split("/").at(-1) ?? absolutePath,
  unitAttribute: "unit,,jp1admin,",
  unitType,
  absolutePath,
  depth: absolutePath.split("/").length - 1,
  parentId: absolutePath.slice(0, absolutePath.lastIndexOf("/")) || undefined,
  isRoot: unitType === "g" && absolutePath === "/root",
  isRootJobnet: unitType === "n" && absolutePath.split("/").length === 3,
  hasSchedule:
    unitType === "n" ||
    unitType === "rn" ||
    unitType === "rm" ||
    unitType === "rr",
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: parameters({ ty: unitType, ...values }),
  relations: [],
  children,
});

const document = (root: AjsUnit): AjsDocument => ({
  rootUnits: [root],
  warnings: [],
});

suite("Schedule Projection Units", () => {
  const period = { from: "2026-04-01", to: "2026-05-01" };

  test("selects only direct schedules on supported jobnet types", () => {
    const direct = ["n", "rn", "rm", "rr"].map((unitType, index) =>
      unit(`/root/direct-${index}`, unitType as AjsUnit["unitType"], {
        sd: "2026/04/10",
      }),
    );
    const groupWithSchedule = unit("/root/group", "g", {
      sd: "2026/04/10",
    });
    const jobWithSchedule = unit("/root/job", "j", {
      sd: "2026/04/10",
    });
    const scOnly = unit("/root/sc-only", "n", { sc: "echo ok" });
    const inheritedOnly = unit("/root/inherited-only", "n");

    assert.deepStrictEqual(
      [
        ...direct,
        groupWithSchedule,
        jobWithSchedule,
        scOnly,
        inheritedOnly,
      ].map(isDirectScheduleJobnet),
      [true, true, true, true, false, false, false, false],
    );
  });

  test("preserves selected input order and duplicate units", () => {
    const first = unit("/root/first", "n", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const second = unit("/root/second", "rn", {
      sd: "2026/04/11",
      st: "10:00",
    });
    const scOnly = unit("/root/sc-only", "n", { sc: "echo ok" });

    const projections = projectDirectScheduleUnits({
      units: [first, scOnly, second, first],
      period,
    });

    assert.deepStrictEqual(
      projections.map(({ interpretation }) => interpretation.unit),
      [first, second, first],
    );
    assert.deepStrictEqual(
      projections.flatMap(({ projection }) =>
        projection.runs.map((run) => [run.unitPath, run.date, run.time]),
      ),
      [
        [first.absolutePath, "2026-04-10", "09:00"],
        [second.absolutePath, "2026-04-11", "10:00"],
        [first.absolutePath, "2026-04-10", "09:00"],
      ],
    );
  });

  test("builds one calendar index and uses the supplied document context", () => {
    const first = unit("/root/first", "n", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const second = unit("/root/second", "n", {
      sd: "2026/04/+01",
      st: "10:00",
    });
    const root = unit("/root", "g", { sdd: "01" }, [first, second]);
    let rootUnitsReads = 0;
    const suppliedDocument: AjsDocument = {
      get rootUnits() {
        rootUnitsReads += 1;
        return [root];
      },
      warnings: [],
    };

    const projections = projectDirectScheduleUnits({
      units: [first, second],
      period,
      document: suppliedDocument,
    });

    assert.strictEqual(rootUnitsReads, 1);
    assert.deepStrictEqual(
      projections.map(({ projection }) =>
        projection.runs.map((run) => [run.date, run.time]),
      ),
      [[["2026-04-01", "09:00"]], [["2026-04-01", "10:00"]]],
    );
  });

  test("keeps document contexts independent and preserves period preconditions", () => {
    const scheduled = unit("/root/main", "n", {
      sd: "2026/04/+01",
      st: "09:00",
    });
    const beforeDocument = document(
      unit("/root", "g", { sdd: "01" }, [scheduled]),
    );
    const afterDocument = document(
      unit("/root", "g", { sdd: "15" }, [scheduled]),
    );
    const projectWith = (definition: AjsDocument) =>
      projectDirectScheduleUnits({
        units: [scheduled],
        period,
        document: definition,
      })[0]?.projection;

    const before = projectWith(beforeDocument);
    const after = projectWith(afterDocument);
    assert.deepStrictEqual(
      before?.runs.map((run) => run.date),
      ["2026-04-01"],
    );
    assert.deepStrictEqual(
      after?.runs.map((run) => run.date),
      ["2026-04-15"],
    );

    const zeroRun = unit("/root/no-runs", "n", { sd: "0,ud" });
    const invalidPeriod = projectDirectScheduleUnits({
      units: [zeroRun],
      period: { from: "not-a-date", to: "2026-05-01" },
    })[0]?.projection;
    const validPeriod = projectDirectScheduleUnits({
      units: [zeroRun],
      period,
    })[0]?.projection;
    assert.strictEqual(invalidPeriod?.status, "invalid");
    assert.strictEqual(invalidPeriod?.completeness, "none");
    assert.strictEqual(validPeriod?.status, "no-runs");
    assert.strictEqual(validPeriod?.completeness, "complete");
  });
});
