import * as assert from "assert";
import type {
  AjsDocument,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffReportSection,
  SemanticDiffUnitReference,
  SemanticDiffUnsupportedItem,
} from "../../application/semantic-diff/semanticDiffDto";
import {
  compareSemanticDiff,
  createSemanticDiffChangeSet,
  type CompareSemanticDiff,
  type CompareSemanticDiffInput,
} from "../../application/semantic-diff/compareSemanticDiff";

const buildUnit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
  id: "/root/jobnet/job-a",
  name: "job-a",
  unitAttribute: "job-a,,jp1admin,",
  unitType: "j",
  absolutePath: "/root/jobnet/job-a",
  depth: 2,
  parentId: "/root/jobnet",
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: [{ key: "ty", value: "j" }],
  relations: [],
  children: [],
  ...overrides,
});

const relation: AjsRelation = {
  sourceUnitId: "/root/jobnet/job-a",
  targetUnitId: "/root/jobnet/job-b",
  type: "seq",
};

const beforeUnit = buildUnit({
  relations: [relation],
});
const afterUnit = buildUnit({
  id: "/root/jobnet/job-b",
  name: "job-b",
  absolutePath: "/root/jobnet/job-b",
});

const beforeDocument: AjsDocument = {
  rootUnits: [beforeUnit],
  warnings: [
    {
      code: "missing_relation_target",
      message: "relation target was not found",
      unitPath: "/root/jobnet/job-a",
    },
  ],
};

const afterDocument: AjsDocument = {
  rootUnits: [afterUnit],
  warnings: [],
};

const unitReference = (unit: AjsUnit): SemanticDiffUnitReference => ({
  id: unit.id,
  name: unit.name,
  absolutePath: unit.absolutePath,
  unitType: unit.unitType,
});

suite("Semantic Diff Contracts", () => {
  test("creates a host-neutral change set from normalized documents", () => {
    const input: CompareSemanticDiffInput = {
      before: beforeDocument,
      after: afterDocument,
      options: { jobGroupPath: "/root" },
    };

    const changeSet = createSemanticDiffChangeSet(input);

    assert.strictEqual(changeSet.inputs.before.jobGroupPath, "/root");
    assert.deepStrictEqual(changeSet.inputs.before.unitIds, [beforeUnit.id]);
    assert.deepStrictEqual(changeSet.inputs.after.unitIds, [afterUnit.id]);
    assert.deepStrictEqual(changeSet.inputs.before.relations, [
      {
        ...relation,
        sourceUnitPath: beforeUnit.absolutePath,
        targetUnitPath: undefined,
      },
    ]);
    assert.deepStrictEqual(changeSet.changes, []);
    assert.deepStrictEqual(changeSet.identityDecisions, []);
    assert.deepStrictEqual(changeSet.confirmationRequired, []);
    assert.deepStrictEqual(changeSet.unsupportedItems, []);
    assert.deepStrictEqual(changeSet.reportSections, []);
    assert.deepStrictEqual(changeSet.limitations, [
      {
        code: "missing_relation_target",
        kind: "normalization",
        side: "before",
        message: "relation target was not found",
        unitPath: "/root/jobnet/job-a",
      },
    ]);
    const serialized = JSON.stringify(changeSet);
    assert.strictEqual(serialized.includes("rootUnits"), false);
    assert.strictEqual(serialized.includes("unitAttribute"), false);
    assert.strictEqual(serialized.includes("parameters"), false);
    assert.strictEqual(serialized.includes('"warning"'), false);
  });

  test("constructs scalar report and flow DTOs without domain objects", () => {
    const change: SemanticDiffChange = {
      id: "change-1",
      kind: "changed",
      elementKind: "attribute",
      confirmationLevel: "confirmed",
      identityDecisionId: "identity:test:attribute",
      attributeCategory: "execution-definition",
      summary: "execution definition changed",
      before: {
        kind: "attribute",
        unit: unitReference(beforeUnit),
        parameterKey: "sc",
        category: "execution-definition",
        values: ["echo before"],
      },
      after: {
        kind: "attribute",
        unit: unitReference(afterUnit),
        parameterKey: "sc",
        category: "execution-definition",
        values: ["echo after"],
      },
    };
    const confirmationRequired: SemanticDiffConfirmationRequiredItem = {
      id: "confirmation-1",
      target: {
        kind: "relation",
        relation: {
          ...relation,
          sourceUnitPath: beforeUnit.absolutePath,
          targetUnitPath: afterUnit.absolutePath,
        },
      },
      changeContent: "start condition changed",
      rationale: "previous start path may no longer be available",
      relatedTargets: [],
      constraints: ["runtime history is not verified"],
    };
    const unsupportedItem: SemanticDiffUnsupportedItem = {
      id: "unsupported-1",
      kind: "unsupported",
      target: { kind: "unit", unit: unitReference(beforeUnit) },
      message: "unit type is not supported yet",
    };
    const reportSection: SemanticDiffReportSection = {
      id: "summary",
      title: "Summary",
      changeIds: [change.id],
      limitationCodes: [],
    };

    const changeSet = createSemanticDiffChangeSet(
      { before: beforeDocument, after: afterDocument },
      {
        changes: [change],
        confirmationRequired: [confirmationRequired],
        unsupportedItems: [unsupportedItem],
        reportSections: [reportSection],
        scheduleComparison: {
          period: { from: "2026-04-01", to: "2026-05-01" },
          runChanges: [
            {
              id: "schedule:added:/root/jobnet:2026-04-10:09:00",
              kind: "added",
              unitPath: "/root/jobnet",
              date: "2026-04-10",
              after: {
                unitPath: "/root/jobnet",
                unitName: "jobnet",
                rule: 1,
                date: "2026-04-10",
                time: "09:00",
              },
              summary: "/root/jobnet run added",
            },
          ],
        },
      },
    );

    assert.strictEqual(changeSet.changes[0], change);
    assert.strictEqual(change.identityDecisionId, "identity:test:attribute");
    assert.strictEqual(changeSet.confirmationRequired[0], confirmationRequired);
    assert.strictEqual(changeSet.unsupportedItems[0], unsupportedItem);
    assert.strictEqual(changeSet.reportSections[0], reportSection);
    assert.deepStrictEqual(changeSet.scheduleComparison?.period, {
      from: "2026-04-01",
      to: "2026-05-01",
    });
  });

  test("exposes a comparison entry point shape for later slices", () => {
    const compare: CompareSemanticDiff = (input) =>
      createSemanticDiffChangeSet(input);

    const result = compare({
      before: beforeDocument,
      after: afterDocument,
    });

    assert.strictEqual(result.inputs.before.side, "before");
    assert.strictEqual(result.inputs.after.side, "after");
  });

  test("projects identity decisions as a plain, complete DTO", () => {
    const result = compareSemanticDiff({
      before: beforeDocument,
      after: afterDocument,
    });

    assert.strictEqual(result.identityDecisions.length, 1);
    const [decision] = result.identityDecisions;
    assert.strictEqual(decision.status, "fingerprint-confirmed");
    assert.strictEqual(decision.rule, "one-to-one-fingerprint");
    assert.strictEqual(decision.id.startsWith("identity:v1:"), true);
    assert.deepStrictEqual(decision.before, [unitReference(beforeUnit)]);
    assert.deepStrictEqual(decision.after, [unitReference(afterUnit)]);
    assert.strictEqual(decision.evidence.kind, "fingerprint");
    if (decision.evidence.kind !== "fingerprint") {
      throw new Error("Expected fingerprint evidence.");
    }
    assert.strictEqual(
      decision.evidence.strategyId,
      "legacy-all-parameters-v1",
    );
    assert.deepStrictEqual(decision.evidence.fields, [
      { key: "unitType", presence: "present", values: ["j"] },
      { key: "groupType", presence: "present", values: [""] },
      { key: "permission", presence: "present", values: [""] },
      { key: "jp1Username", presence: "present", values: [""] },
      { key: "jp1ResourceGroup", presence: "present", values: [""] },
      { key: "parameters", presence: "present", values: ["ty=j"] },
    ]);
    assert.strictEqual(JSON.stringify(result).includes("rootUnits"), false);
    assert.strictEqual(JSON.stringify(result).includes("Map"), false);
    assert.strictEqual(JSON.stringify(result).includes("function"), false);
  });
});
