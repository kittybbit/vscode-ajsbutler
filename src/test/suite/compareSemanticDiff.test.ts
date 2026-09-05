import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";
import { localizedChangeSummary } from "../../presentation/semantic-diff/semanticDiffMarkdownLocalization";

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
): string[] => doc.changes.map((change) => localizedChangeSummary(change));

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
    assert.ok(
      result.identityDecisions.length > 0 &&
        result.identityDecisions.every(
          (decision) => decision.status === "exact",
        ),
    );
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
      !result.changes.some(
        (change) =>
          change.elementKind === "attribute" &&
          localizedChangeSummary(change).startsWith("LOAD"),
      ),
      "unmatched same-name units should not produce attribute changes",
    );
  });

  test("reports execution attribute changes with user-facing categories", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job",
      absolutePath: "/root/jobnet/job",
      parameters: params({ ty: "j", sc: "echo stable", eu: "user-a" }),
    });
    const afterJob = unit({
      id: "/root/jobnet/job",
      absolutePath: "/root/jobnet/job",
      unitAttribute: "job,,jp1admin,changed",
      parameters: params({ ty: "j", sc: "echo stable", eu: "user-b" }),
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
    assert.ok(
      result.changes
        .filter((change) => change.elementKind === "attribute")
        .every((change) =>
          result.identityDecisions.some(
            (decision) => decision.id === change.identityDecisionId,
          ),
        ),
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
    const [rename] = result.changes;
    assert.ok(rename.identityDecisionId);
    assert.deepStrictEqual(
      result.identityDecisions.find(
        (decision) => decision.id === rename.identityDecisionId,
      )?.status,
      "fingerprint-confirmed",
    );
  });

  test("keeps exact identity precedence when rename paths collide", () => {
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
      result.changes.map((change) => [
        change.kind,
        localizedChangeSummary(change),
      ]),
      [
        ["changed", "job-b sc changed"],
        ["removed", "job-a removed"],
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
    assert.ok(result.changes.every((change) => change.after === undefined));
    const candidateDecision = result.identityDecisions.find(
      (decision) => decision.status === "candidate",
    );
    assert.ok(candidateDecision);
    assert.strictEqual(candidateDecision.before.length, 2);
    assert.strictEqual(candidateDecision.after.length, 2);
    assert.ok(
      result.changes.every(
        (change) => change.identityDecisionId === candidateDecision.id,
      ),
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
    assert.deepStrictEqual(
      result.identityDecisions
        .filter((decision) => decision.status !== "exact")
        .map((decision) => decision.status),
      ["removed", "added"],
    );
    assert.ok(
      result.changes.every((change) =>
        result.identityDecisions.some(
          (decision) => decision.id === change.identityDecisionId,
        ),
      ),
    );
  });

  test("projects every identity outcome in deterministic DTO order", () => {
    const beforeExact = unit({
      id: "/root/jobnet/exact",
      name: "exact",
      absolutePath: "/root/jobnet/exact",
    });
    const afterExact = unit({
      id: "/root/jobnet/exact",
      name: "exact",
      absolutePath: "/root/jobnet/exact",
    });
    const beforeRenamed = unit({
      id: "/root/jobnet/rename-before",
      name: "rename-before",
      absolutePath: "/root/jobnet/rename-before",
      parameters: params({ ty: "j", sc: "echo rename" }),
    });
    const afterRenamed = unit({
      id: "/root/jobnet/rename-after",
      name: "rename-after",
      absolutePath: "/root/jobnet/rename-after",
      parameters: params({ ty: "j", sc: "echo rename" }),
    });
    const beforeCandidateA = unit({
      id: "/root/jobnet/candidate-a",
      name: "candidate-a",
      absolutePath: "/root/jobnet/candidate-a",
      parameters: params({ ty: "j", sc: "echo candidate" }),
    });
    const beforeCandidateB = unit({
      id: "/root/jobnet/candidate-b",
      name: "candidate-b",
      absolutePath: "/root/jobnet/candidate-b",
      parameters: params({ ty: "j", sc: "echo candidate" }),
    });
    const afterCandidateC = unit({
      id: "/root/jobnet/candidate-c",
      name: "candidate-c",
      absolutePath: "/root/jobnet/candidate-c",
      parameters: params({ ty: "j", sc: "echo candidate" }),
    });
    const afterCandidateD = unit({
      id: "/root/jobnet/candidate-d",
      name: "candidate-d",
      absolutePath: "/root/jobnet/candidate-d",
      parameters: params({ ty: "j", sc: "echo candidate" }),
    });
    const beforeRemoved = unit({
      id: "/root/jobnet/removed",
      name: "removed",
      absolutePath: "/root/jobnet/removed",
      parameters: params({ ty: "j", sc: "echo removed" }),
    });
    const afterAdded = unit({
      id: "/root/jobnet/added",
      name: "added",
      absolutePath: "/root/jobnet/added",
      parameters: params({ ty: "j", sc: "echo added" }),
    });
    const beforeJobnet = jobnet("jobnet", [
      beforeExact,
      beforeRenamed,
      beforeCandidateA,
      beforeCandidateB,
      beforeRemoved,
    ]);
    const afterJobnet = jobnet("jobnet", [
      afterExact,
      afterRenamed,
      afterCandidateC,
      afterCandidateD,
      afterAdded,
    ]);
    const input = {
      before: document([beforeJobnet]),
      after: document([afterJobnet]),
      options: { jobGroupPath: "/root" },
    };
    const result = compareSemanticDiff(input);
    const repeated = compareSemanticDiff(input);

    assert.deepStrictEqual(
      result.identityDecisions.map((decision) => decision.status),
      [
        "exact",
        "exact",
        "exact",
        "fingerprint-confirmed",
        "candidate",
        "removed",
        "added",
      ],
    );
    assert.deepStrictEqual(
      result.identityDecisions.map((decision) => decision.id),
      repeated.identityDecisions.map((decision) => decision.id),
    );
    assert.strictEqual(
      new Set(result.identityDecisions.map((decision) => decision.id)).size,
      result.identityDecisions.length,
    );
    const candidate = result.identityDecisions.find(
      (decision) => decision.status === "candidate",
    );
    assert.ok(candidate);
    assert.deepStrictEqual(
      candidate.after.map((reference) => reference.id),
      [afterCandidateC.id, afterCandidateD.id],
    );
    assert.ok(
      result.changes
        .filter((change) => change.confirmationLevel === "candidate")
        .every(
          (change) =>
            change.after === undefined &&
            change.identityDecisionId === candidate.id,
        ),
    );
    assert.ok(
      result.changes.every((change) =>
        result.identityDecisions.some(
          (decision) => decision.id === change.identityDecisionId,
        ),
      ),
    );
    const serialized = JSON.stringify(result);
    assert.doesNotThrow(() => JSON.parse(serialized));
    assert.strictEqual(serialized.includes("AjsUnit"), false);
  });

  test("does not attach identity decisions to relation changes", () => {
    const beforeSource = unit({
      id: "/root/jobnet/source",
      name: "source",
      absolutePath: "/root/jobnet/source",
    });
    const beforeTarget = unit({
      id: "/root/jobnet/target",
      name: "target",
      absolutePath: "/root/jobnet/target",
    });
    beforeSource.relations = [relation(beforeSource.id, beforeTarget.id)];
    const afterSource = unit({
      id: beforeSource.id,
      name: beforeSource.name,
      absolutePath: beforeSource.absolutePath,
    });
    const afterTarget = unit({
      id: beforeTarget.id,
      name: beforeTarget.name,
      absolutePath: beforeTarget.absolutePath,
    });

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeSource, beforeTarget])]),
      after: document([jobnet("jobnet", [afterSource, afterTarget])]),
      options: { jobGroupPath: "/root" },
    });
    const [relationChange] = result.changes.filter(
      (change) => change.elementKind === "relation",
    );

    assert.ok(relationChange);
    assert.strictEqual("identityDecisionId" in relationChange, false);
    assert.deepStrictEqual(relationChange.relationPair, {
      canonicalPair: {
        sourceUnitId: beforeSource.id,
        targetUnitId: beforeTarget.id,
        type: "seq",
      },
      before: {
        sourceUnitPath: beforeSource.absolutePath,
        sourceUnitId: beforeSource.id,
        targetUnitPath: beforeTarget.absolutePath,
        targetUnitId: beforeTarget.id,
        type: "seq",
      },
      after: null,
    });
  });

  test("remaps relation canonical pairs through fingerprint correspondence", () => {
    const beforeSource = unit({
      id: "/root/jobnet/source-before",
      name: "source-before",
      absolutePath: "/root/jobnet/source-before",
      parameters: params({ ty: "j", sc: "echo source" }),
    });
    const beforeTarget = unit({
      id: "/root/jobnet/target-before",
      name: "target-before",
      absolutePath: "/root/jobnet/target-before",
      parameters: params({ ty: "j", sc: "echo target" }),
    });
    const afterSource = unit({
      id: "/root/jobnet/source-after",
      name: "source-after",
      absolutePath: "/root/jobnet/source-after",
      parameters: params({ ty: "j", sc: "echo source" }),
    });
    const afterTarget = unit({
      id: "/root/jobnet/target-after",
      name: "target-after",
      absolutePath: "/root/jobnet/target-after",
      parameters: params({ ty: "j", sc: "echo target" }),
    });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "seq"),
    ];

    const result = compareSemanticDiff({
      before: document([jobnet("jobnet", [beforeSource, beforeTarget])]),
      after: document([jobnet("jobnet", [afterSource, afterTarget])]),
      options: { jobGroupPath: "/root" },
    });
    const relationChanges = result.changes.filter(
      (change) => change.elementKind === "relation",
    );

    assert.deepStrictEqual(
      relationChanges.map((change) => [change.kind, change.relationPair]),
      [
        [
          "removed",
          {
            canonicalPair: {
              sourceUnitId: afterSource.id,
              targetUnitId: afterTarget.id,
              type: "seq",
            },
            before: {
              sourceUnitPath: beforeSource.absolutePath,
              sourceUnitId: beforeSource.id,
              targetUnitPath: beforeTarget.absolutePath,
              targetUnitId: beforeTarget.id,
              type: "seq",
            },
            after: null,
          },
        ],
      ],
    );
    const changedUnit = result.changes.find(
      (change) =>
        change.elementKind === "unit" &&
        change.before?.kind === "unit" &&
        change.after?.kind === "unit" &&
        change.before.unit.id === beforeSource.id,
    );
    assert.ok(changedUnit?.identityDecisionId);
    assert.ok(
      result.identityDecisions.some(
        (decision) => decision.id === changedUnit?.identityDecisionId,
      ),
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
        unitPath: "/root/jobnet/job",
        detail: {
          unitPath: "/root/jobnet/job",
          parameterKey: null,
          relationPair: null,
          scheduleRule: null,
          period: null,
          beforeValues: [],
          afterValues: [],
          rawValues: [],
          removedSources: [],
        },
        warning: {
          code: "missing_relation_target",
          detail: {
            unitPath: "/root/jobnet/job",
            parameterKey: null,
            relationPair: null,
            scheduleRule: null,
            period: null,
            beforeValues: [],
            afterValues: [],
            rawValues: [],
            removedSources: [],
          },
          fallbackText: "relation target was not found",
        },
      },
    ]);
  });
});
