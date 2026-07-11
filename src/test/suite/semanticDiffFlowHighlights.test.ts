import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChangeSet,
  SemanticDiffTarget,
} from "../../domain/models/semantic-diff/SemanticDiff";
import { buildSemanticDiffFlowHighlights } from "../../application/flow-graph/buildSemanticDiffFlowHighlights";

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
  parameters: params({ ty: "j" }),
  relations: [],
  children: [],
  ...overrides,
});

const relation = (
  source: AjsUnit,
  target: AjsUnit,
  type: AjsRelation["type"] = "seq",
): AjsRelation => ({
  sourceUnitId: source.id,
  targetUnitId: target.id,
  type,
});

const document = (children: AjsUnit[]): AjsDocument => ({
  rootUnits: [
    unit({
      id: "/root",
      name: "root",
      unitType: "g",
      absolutePath: "/root",
      depth: 0,
      parentId: undefined,
      isRoot: true,
      children: [
        unit({
          id: "/root/jobnet",
          name: "jobnet",
          unitType: "n",
          absolutePath: "/root/jobnet",
          depth: 1,
          parentId: "/root",
          children,
        }),
      ],
    }),
  ],
  warnings: [],
});

const changeSet = (
  before: AjsDocument,
  after: AjsDocument,
  overrides: Partial<SemanticDiffChangeSet>,
): SemanticDiffChangeSet => ({
  inputs: {
    before: { side: "before", document: before, jobGroupPath: "/root" },
    after: { side: "after", document: after, jobGroupPath: "/root" },
  },
  changes: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
  reportSections: [],
  ...overrides,
});

suite("Semantic diff flow highlights", () => {
  test("builds after-side node and edge highlights from semantic diff DTOs", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job-before",
      name: "job-before",
      absolutePath: "/root/jobnet/job-before",
    });
    const afterJob = unit({
      id: "/root/jobnet/job-after",
      name: "job-after",
      absolutePath: "/root/jobnet/job-after",
    });
    const afterTail = unit({
      id: "/root/jobnet/tail",
      name: "tail",
      absolutePath: "/root/jobnet/tail",
    });
    const afterRelation = relation(afterJob, afterTail);
    afterJob.relations = [afterRelation];
    const afterJobTarget: SemanticDiffTarget = {
      kind: "unit",
      unit: afterJob,
    };

    const highlights = buildSemanticDiffFlowHighlights(
      changeSet(document([beforeJob]), document([afterJob, afterTail]), {
        changes: [
          {
            id: "unit:renamed",
            kind: "renamed",
            elementKind: "unit",
            confirmationLevel: "confirmed",
            before: { kind: "unit", unit: beforeJob },
            after: afterJobTarget,
            summary: "job renamed",
          },
          {
            id: "relation:added",
            kind: "added",
            elementKind: "relation",
            confirmationLevel: "confirmed",
            after: {
              kind: "relation",
              relation: afterRelation,
              sourceUnit: afterJob,
              targetUnit: afterTail,
            },
            summary: "relation added",
          },
        ],
        confirmationRequired: [
          {
            id: "confirm:job-after",
            target: afterJobTarget,
            changeContent: "wait target changed",
            rationale: "target changed",
            relatedTargets: [],
            constraints: [],
          },
        ],
      }),
    );

    assert.deepStrictEqual(highlights.nodes.get(afterJob.id), {
      kind: "confirmation-required",
      changeIds: ["unit:renamed"],
      confirmationIds: ["confirm:job-after"],
    });
    assert.deepStrictEqual(
      highlights.edges.get("/root/jobnet/job-after->/root/jobnet/tail:seq"),
      {
        kind: "changed",
        changeIds: ["relation:added"],
        confirmationIds: [],
      },
    );
  });

  test("keeps before-only removals and ambiguous candidates report-only", () => {
    const beforeJob = unit({
      id: "/root/jobnet/job-before",
      name: "job-before",
      absolutePath: "/root/jobnet/job-before",
    });
    const afterJob = unit({
      id: "/root/jobnet/job-after",
      name: "job-after",
      absolutePath: "/root/jobnet/job-after",
    });

    const highlights = buildSemanticDiffFlowHighlights(
      changeSet(document([beforeJob]), document([afterJob]), {
        changes: [
          {
            id: "unit:removed",
            kind: "removed",
            elementKind: "unit",
            confirmationLevel: "confirmed",
            before: { kind: "unit", unit: beforeJob },
            summary: "job removed",
          },
          {
            id: "unit:candidate",
            kind: "changed",
            elementKind: "unit",
            confirmationLevel: "candidate",
            before: { kind: "unit", unit: beforeJob },
            after: { kind: "unit", unit: afterJob },
            summary: "candidate",
          },
        ],
      }),
    );

    assert.deepStrictEqual([...highlights.nodes.entries()], []);
    assert.deepStrictEqual([...highlights.edges.entries()], []);
  });
});
