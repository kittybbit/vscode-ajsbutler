import * as assert from "assert";
import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffResult,
  SemanticDiffRelationReference,
  SemanticDiffTarget,
  SemanticDiffUnitReference,
} from "../../application/semantic-diff/semanticDiffDto";
import { buildSemanticDiffFlowHighlights } from "../../application/flow-graph/buildSemanticDiffFlowHighlights";
import { createSemanticDiffDetail } from "../../application/semantic-diff/semanticDiffStructuredFacts";

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

const unitReference = (item: AjsUnit): SemanticDiffUnitReference => ({
  id: item.id,
  name: item.name,
  absolutePath: item.absolutePath,
  unitType: item.unitType,
});

const relationReference = (
  item: AjsRelation,
  units: AjsUnit[],
): SemanticDiffRelationReference => ({
  ...item,
  sourceUnitPath: units.find((unit) => unit.id === item.sourceUnitId)
    ?.absolutePath,
  targetUnitPath: units.find((unit) => unit.id === item.targetUnitId)
    ?.absolutePath,
});

const result = (
  before: AjsUnit[],
  after: AjsUnit[],
  overrides: Partial<SemanticDiffResult>,
): SemanticDiffResult => ({
  inputs: {
    before: {
      side: "before",
      jobGroupPath: "/root",
      unitIds: before.map((unit) => unit.id),
      relations: before.flatMap((unit) =>
        unit.relations.map((relation) => relationReference(relation, before)),
      ),
    },
    after: {
      side: "after",
      jobGroupPath: "/root",
      unitIds: after.map((unit) => unit.id),
      relations: after.flatMap((unit) =>
        unit.relations.map((relation) => relationReference(relation, after)),
      ),
    },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
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
      unit: unitReference(afterJob),
    };

    const highlights = buildSemanticDiffFlowHighlights(
      result([beforeJob], [afterJob, afterTail], {
        changes: [
          {
            id: "unit:renamed",
            kind: "renamed",
            elementKind: "unit",
            confirmationLevel: "confirmed",
            identityDecisionId: "identity:test:renamed",
            before: { kind: "unit", unit: unitReference(beforeJob) },
            after: afterJobTarget,
            relationPair: null,
          },
          {
            id: "relation:added",
            kind: "added",
            elementKind: "relation",
            confirmationLevel: "confirmed",
            after: {
              kind: "relation",
              relation: relationReference(afterRelation, [afterJob, afterTail]),
            },
            relationPair: {
              canonicalPair: {
                sourceUnitId: afterJob.id,
                targetUnitId: afterTail.id,
                type: "seq",
              },
              before: null,
              after: {
                ...relationReference(afterRelation, [afterJob, afterTail]),
                sourceUnitPath: afterJob.absolutePath,
                targetUnitPath: afterTail.absolutePath,
              },
            },
          },
        ],
        confirmationRequired: [
          {
            id: "confirm:job-after",
            target: afterJobTarget,
            reasonCode: "wait-target-changed",
            relatedTargets: [],
            constraints: [],
            detail: createSemanticDiffDetail({ parameterKey: "flwf" }),
            warning: null,
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
      result([beforeJob], [afterJob], {
        changes: [
          {
            id: "unit:removed",
            kind: "removed",
            elementKind: "unit",
            confirmationLevel: "confirmed",
            identityDecisionId: "identity:test:removed",
            before: { kind: "unit", unit: unitReference(beforeJob) },
            relationPair: null,
          },
          {
            id: "unit:candidate",
            kind: "changed",
            elementKind: "unit",
            confirmationLevel: "candidate",
            identityDecisionId: "identity:test:candidate",
            before: { kind: "unit", unit: unitReference(beforeJob) },
            relationPair: null,
          },
        ],
      }),
    );

    assert.deepStrictEqual([...highlights.nodes.entries()], []);
    assert.deepStrictEqual([...highlights.edges.entries()], []);
  });
});
