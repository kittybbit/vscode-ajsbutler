import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";
import { renderSemanticDiffMarkdown } from "../../application/semantic-diff/renderSemanticDiffMarkdown";

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
      result.confirmationRequired.map((item) => item.changeContent),
      ["source->target conditional relation removed or changed"],
    );
    assert.ok(
      result.confirmationRequired[0].constraints.some((constraint) =>
        constraint.includes("JP1/AJS3 v13 unit definition parameters"),
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
      result.confirmationRequired.map((item) => item.changeContent),
      ["wait explicit timeout etm removed", "wait wait release source changed"],
    );
    assert.ok(
      result.confirmationRequired.every((item) =>
        item.constraints.includes(
          "Runtime history and external conditions are not verified by this comparison.",
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
      result.confirmationRequired.map((item) => item.changeContent),
      ["job jd condition or judgment changed"],
    );
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
      result.confirmationRequired.map((item) => item.changeContent),
      [
        "event-wait wait target evwid changed",
        "file-wait wait target flwf changed",
      ],
    );
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
      result.unsupportedItems.map((item) => [item.kind, item.message]),
      [
        [
          "uninterpretable",
          "file monitoring condition flwc is not interpreted because it combines mutually exclusive conditions",
        ],
      ],
    );
    assert.deepStrictEqual(result.confirmationRequired, []);
  });
});
