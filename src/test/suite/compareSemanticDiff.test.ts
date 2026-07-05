import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";

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

const jobnet = (
  name: string,
  children: AjsUnit[],
  overrides: Partial<AjsUnit> = {},
): AjsUnit => {
  const absolutePath = overrides.absolutePath ?? `/root/${name}`;
  return unit({
    id: absolutePath,
    name,
    unitAttribute: `${name},,jp1admin,`,
    unitType: "n",
    absolutePath,
    depth: 1,
    parentId: "/root",
    isRootJobnet: true,
    layout: { h: 1, v: 1 },
    parameters: params({ ty: "n" }),
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
      isRootJobnet: false,
      layout: { h: 0, v: 0 },
      parameters: params({ ty: "g" }),
      children: rootChildren,
    }),
  ],
  warnings: [],
});

const changeSummaries = (
  doc: ReturnType<typeof compareSemanticDiff>,
): string[] => doc.changes.map((change) => change.summary);

suite("Compare Semantic Diff", () => {
  test("ignores order-only definition changes", () => {
    const jobA = unit({
      id: "/root/jobnet/job-a",
      name: "job-a",
      absolutePath: "/root/jobnet/job-a",
      layout: { h: 1, v: 1 },
    });
    const jobB = unit({
      id: "/root/jobnet/job-b",
      name: "job-b",
      absolutePath: "/root/jobnet/job-b",
      layout: { h: 2, v: 1 },
    });

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [jobA, jobB])]),
      after: document([jobnet("jobnet", [jobB, jobA])]),
      options: { jobGroupPath: "/root" },
    });

    assert.deepStrictEqual(result.changes, []);
  });

  test("matches units by parent jobnet, name, and type rather than name alone", () => {
    const beforeLoad = unit({
      id: "/root/before/load",
      name: "LOAD",
      absolutePath: "/root/before/load",
      parentId: "/root/before",
    });
    const afterLoad = unit({
      id: "/root/after/load",
      name: "LOAD",
      absolutePath: "/root/after/load",
      parentId: "/root/after",
      parameters: params({ ty: "j", sc: "echo changed" }),
    });

    const result = compareSemanticDiff({
      before: document([jobnet("before", [beforeLoad])]),
      after: document([jobnet("after", [afterLoad])]),
      options: { jobGroupPath: "/root" },
    });

    assert.ok(
      changeSummaries(result).includes("LOAD removed"),
      "before LOAD should not be matched by name alone",
    );
    assert.ok(
      changeSummaries(result).includes("LOAD added"),
      "after LOAD should not be matched by name alone",
    );
    assert.ok(
      !result.changes.some((change) => change.elementKind === "attribute"),
      "unmatched same-name units should not produce attribute changes",
    );
  });

  test("reports execution attribute changes with user-facing categories", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job",
      absolutePath: "/root/jobnet/job",
      parameters: params({ ty: "j", sc: "echo before", eu: "user-a" }),
    });
    const afterJob = unit({
      id: "/root/jobnet/job",
      absolutePath: "/root/jobnet/job",
      parameters: params({ ty: "j", sc: "echo after", eu: "user-b" }),
    });

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeJob])]),
      after: document([jobnet("jobnet", [afterJob])]),
      options: { jobGroupPath: "/root" },
    });

    assert.deepStrictEqual(
      result.changes
        .filter((change) => change.elementKind === "attribute")
        .map((change) => [change.before?.kind, change.attributeCategory])
        .sort(),
      [
        ["attribute", "execution-definition"],
        ["attribute", "execution-environment"],
      ],
    );
  });

  test("confirms one-to-one fingerprint rename and relation correspondence", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job-a",
      name: "job-a",
      absolutePath: "/root/jobnet/job-a",
    });
    const afterJob = unit({
      id: "/root/jobnet/job-renamed",
      name: "job-renamed",
      absolutePath: "/root/jobnet/job-renamed",
    });
    const beforeTail = unit({
      id: "/root/jobnet/tail",
      name: "tail",
      absolutePath: "/root/jobnet/tail",
    });
    const afterTail = unit({
      id: "/root/jobnet/tail",
      name: "tail",
      absolutePath: "/root/jobnet/tail",
    });
    beforeJob.relations = [relation(beforeJob.id, beforeTail.id)];
    afterJob.relations = [relation(afterJob.id, afterTail.id)];

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeJob, beforeTail])]),
      after: document([jobnet("jobnet", [afterJob, afterTail])]),
      options: { jobGroupPath: "/root" },
    });

    assert.deepStrictEqual(
      result.changes.map((change) => [
        change.kind,
        change.elementKind,
        change.confirmationLevel,
      ]),
      [["renamed", "unit", "confirmed"]],
    );
  });

  test("keeps matched IDs side-specific when rename paths collide", () => {
    const beforeRenamed = unit({
      id: "/root/jobnet/job-a",
      name: "job-a",
      absolutePath: "/root/jobnet/job-a",
      parameters: params({ ty: "j", sc: "echo stable" }),
    });
    const beforeRemoved = unit({
      id: "/root/jobnet/job-b",
      name: "job-b",
      absolutePath: "/root/jobnet/job-b",
      parameters: params({ ty: "j", sc: "echo removed" }),
    });
    const afterRenamed = unit({
      id: "/root/jobnet/job-b",
      name: "job-b",
      absolutePath: "/root/jobnet/job-b",
      parameters: params({ ty: "j", sc: "echo stable" }),
    });

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeRenamed, beforeRemoved])]),
      after: document([jobnet("jobnet", [afterRenamed])]),
      options: { jobGroupPath: "/root" },
    });

    assert.deepStrictEqual(
      result.changes.map((change) => [change.kind, change.summary]),
      [
        ["removed", "job-b removed"],
        ["renamed", "job-a renamed to job-b"],
      ],
    );
  });

  test("leaves multiple fingerprint matches as candidates", () => {
    const beforeA = unit({
      id: "/root/jobnet/a",
      name: "a",
      absolutePath: "/root/jobnet/a",
    });
    const beforeB = unit({
      id: "/root/jobnet/b",
      name: "b",
      absolutePath: "/root/jobnet/b",
    });
    const afterC = unit({
      id: "/root/jobnet/c",
      name: "c",
      absolutePath: "/root/jobnet/c",
    });
    const afterD = unit({
      id: "/root/jobnet/d",
      name: "d",
      absolutePath: "/root/jobnet/d",
    });

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeA, beforeB])]),
      after: document([jobnet("jobnet", [afterC, afterD])]),
      options: { jobGroupPath: "/root" },
    });

    assert.deepStrictEqual(
      result.changes.map((change) => change.confirmationLevel),
      ["candidate", "candidate"],
    );
  });

  test("treats fingerprint-changing rename as deletion and addition", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job-a",
      name: "job-a",
      absolutePath: "/root/jobnet/job-a",
      parameters: params({ ty: "j", sc: "echo before" }),
    });
    const afterJob = unit({
      id: "/root/jobnet/job-renamed",
      name: "job-renamed",
      absolutePath: "/root/jobnet/job-renamed",
      parameters: params({ ty: "j", sc: "echo after" }),
    });

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeJob])]),
      after: document([jobnet("jobnet", [afterJob])]),
      options: { jobGroupPath: "/root" },
    });

    assert.deepStrictEqual(
      result.changes.map((change) => [change.kind, change.elementKind]),
      [
        ["added", "unit"],
        ["removed", "unit"],
      ],
    );
  });

  test("carries normalization warnings into comparison limitations", () => {
    const before = document([]);
    before.warnings = [
      {
        code: "missing_relation_target",
        message: "relation target was not found",
        unitPath: "/root/jobnet/job",
      },
    ];

    const result = compareSemanticDiff({
      before,
      after: document([]),
    });

    assert.deepStrictEqual(result.limitations, [
      {
        code: "missing_relation_target",
        kind: "normalization",
        side: "before",
        message: "relation target was not found",
        unitPath: "/root/jobnet/job",
        warning: before.warnings[0],
      },
    ]);
  });
});
