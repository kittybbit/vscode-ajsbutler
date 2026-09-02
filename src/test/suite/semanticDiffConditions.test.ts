import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";
import { renderSemanticDiffMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffMarkdown";

const relation = (
  sourceUnitId: string,
  targetUnitId: string,
  type: AjsRelation["type"] = "seq",
): AjsRelation => ({
  sourceUnitId,
  targetUnitId,
  type,
});

const params = (values: Record<string, string>): AjsParameter[] =>
  Object.entries(values).map(([key, value]) => ({ key, value }));

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
  relations: [],
  children: [],
  ...overrides,
});

const typedUnit = (
  name: string,
  unitType: AjsUnitType,
  parameters: Record<string, string>,
): AjsUnit =>
  unit({
    id: `/root/jobnet/${name}`,
    name,
    unitType,
    absolutePath: `/root/jobnet/${name}`,
    parameters: params({ ty: unitType, ...parameters }),
  });

const jobnet = (children: AjsUnit[]): AjsUnit =>
  unit({
    id: "/root/jobnet",
    name: "jobnet",
    unitAttribute: "jobnet,,jp1admin,",
    unitType: "n",
    absolutePath: "/root/jobnet",
    depth: 1,
    parentId: "/root",
    isRootJobnet: true,
    parameters: params({ ty: "n" }),
    children,
  });

const document = (children: AjsUnit[]): AjsDocument => ({
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
      parameters: params({ ty: "g" }),
      children: [jobnet(children)],
    }),
  ],
  warnings: [],
});

const compareChildren = (before: AjsUnit[], after: AjsUnit[]) =>
  compareSemanticDiff({
    before: document(before),
    after: document(after),
    options: { jobGroupPath: "/root" },
  });

suite("Semantic diff condition checks", () => {
  test("requires confirmation when a conditional relation is removed", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "con"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });

    const result = compareChildren(
      [beforeSource, beforeTarget],
      [afterSource, afterTarget],
    );

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["conditional-relation-removed"],
    );
    assert.deepStrictEqual(
      result.confirmationRequired[0].detail.relationPair?.canonicalPair,
      {
        sourceUnitId: beforeSource.id,
        targetUnitId: beforeTarget.id,
        type: "con",
      },
    );
    assert.strictEqual(result.confirmationRequired[0].warning, null);
    assert.ok(
      result.confirmationRequired[0].constraints.some(
        (constraint) => constraint.code === "jp1-ajs3-v13-rule-basis",
      ),
    );
  });

  test("does not treat plain predecessor removal as a confirmation-required problem", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "seq"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });

    const result = compareChildren(
      [beforeSource, beforeTarget],
      [afterSource, afterTarget],
    );

    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("reports wait release source changes and timeout removal", () => {
    const beforeRelease = typedUnit("release-a", "j", { sc: "echo release" });
    const afterRelease = typedUnit("release-b", "j", { sc: "echo release" });
    const beforeWait = typedUnit("wait", "evwj", {
      eun: "release-a",
      evwid: "00000001:00000002",
      etm: "30",
    });
    const afterWait = typedUnit("wait", "evwj", {
      eun: "release-b",
      evwid: "00000001:00000002",
    });

    const result = compareChildren(
      [beforeRelease, beforeWait],
      [afterRelease, afterWait],
    );

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["timeout-removed", "wait-release-source-changed"],
    );
    const timeout = result.confirmationRequired.find(
      (item) => item.reasonCode === "timeout-removed",
    );
    const release = result.confirmationRequired.find(
      (item) => item.reasonCode === "wait-release-source-changed",
    );
    assert.deepStrictEqual(timeout?.detail, {
      unitPath: afterWait.absolutePath,
      parameterKey: "etm",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["30"],
      afterValues: [],
      rawValues: [],
      removedSources: [],
    });
    assert.deepStrictEqual(release?.detail, {
      unitPath: afterWait.absolutePath,
      parameterKey: "eun",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["release-a"],
      afterValues: ["release-b"],
      rawValues: ["release-a"],
      removedSources: ["release-a"],
    });
    assert.strictEqual(timeout?.warning, null);
    assert.strictEqual(release?.warning, null);
    assert.ok(
      result.confirmationRequired.every((item) =>
        item.constraints.some(
          (constraint) => constraint.code === "runtime-state-not-verified",
        ),
      ),
    );
  });

  test("requires confirmation when supported end judgment parameters change", () => {
    const beforeJob = typedUnit("job", "j", {
      sc: "echo job",
      jd: "cod",
      wth: "10",
      tho: "20",
    });
    const afterJob = typedUnit("job", "j", {
      sc: "echo job",
      jd: "ab",
      wth: "10",
      tho: "20",
    });

    const result = compareChildren([beforeJob], [afterJob]);

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["condition-judgment-changed"],
    );
    assert.deepStrictEqual(result.confirmationRequired[0].detail, {
      unitPath: afterJob.absolutePath,
      parameterKey: "jd",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["cod"],
      afterValues: ["ab"],
      rawValues: [],
      removedSources: [],
    });
  });

  test("reports file and event wait target changes with external constraints in the report", () => {
    const beforeFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/before.dat"',
      flwc: "c",
    });
    const afterFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/after.dat"',
      flwc: "c",
    });
    const beforeEvent = typedUnit("event-wait", "evwj", {
      evwid: "00000001:00000002",
    });
    const afterEvent = typedUnit("event-wait", "evwj", {
      evwid: "00000001:00000003",
    });

    const result = compareChildren(
      [beforeFile, beforeEvent],
      [afterFile, afterEvent],
    );
    const report = renderSemanticDiffMarkdown(result);

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["wait-target-changed", "wait-target-changed"],
    );
    const waitDetails = result.confirmationRequired.map((item) => [
      item.detail.parameterKey,
      item.detail.beforeValues,
      item.detail.afterValues,
    ]);
    assert.deepStrictEqual(waitDetails, [
      ["evwid", ["00000001:00000002"], ["00000001:00000003"]],
      ["flwf", ['"/var/before.dat"'], ['"/var/after.dat"']],
    ]);
    assert.ok(report.includes("External files, events, hosts"));
    assert.ok(report.includes("Rule basis: JP1/AJS3 v13"));
  });

  test("reports uninterpretable file monitoring conditions instead of making a false claim", () => {
    const beforeFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/data.dat"',
      flwc: "s:m",
    });
    const afterFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/data.dat"',
      flwc: "s:m",
    });

    const result = compareChildren([beforeFile], [afterFile]);

    assert.deepStrictEqual(
      result.unsupportedItems.map((item) => [item.kind, item.reasonCode]),
      [["uninterpretable", "uninterpretable-file-monitoring-condition"]],
    );
    assert.deepStrictEqual(result.unsupportedItems[0].detail, {
      unitPath: afterFile.absolutePath,
      parameterKey: "flwc",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["s:m"],
      afterValues: ["s:m"],
      rawValues: [],
      removedSources: [],
    });
    assert.ok(result.unsupportedItems[0].warning);
    assert.deepStrictEqual(result.confirmationRequired, []);
  });
});
