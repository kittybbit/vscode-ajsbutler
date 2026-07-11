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
  SemanticDiffUnsupportedItem,
} from "../../domain/models/semantic-diff/SemanticDiff";
import {
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

suite("Semantic Diff Contracts", () => {
  test("creates a host-neutral change set from normalized documents", () => {
    const input: CompareSemanticDiffInput = {
      before: beforeDocument,
      after: afterDocument,
      options: { jobGroupPath: "/root" },
    };

    const changeSet = createSemanticDiffChangeSet(input);

    assert.strictEqual(changeSet.inputs.before.document, beforeDocument);
    assert.strictEqual(changeSet.inputs.after.document, afterDocument);
    assert.strictEqual(changeSet.inputs.before.jobGroupPath, "/root");
    assert.deepStrictEqual(changeSet.changes, []);
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
        warning: beforeDocument.warnings[0],
      },
    ]);
  });

  test("represents semantic categories without parser or host objects", () => {
    const change: SemanticDiffChange = {
      id: "change-1",
      kind: "changed",
      elementKind: "attribute",
      confirmationLevel: "confirmed",
      attributeCategory: "execution-definition",
      summary: "execution definition changed",
      before: {
        kind: "attribute",
        unit: beforeUnit,
        parameterKey: "sc",
        category: "execution-definition",
      },
      after: {
        kind: "attribute",
        unit: afterUnit,
        parameterKey: "sc",
        category: "execution-definition",
      },
    };
    const confirmationRequired: SemanticDiffConfirmationRequiredItem = {
      id: "confirmation-1",
      target: {
        kind: "relation",
        relation,
        sourceUnit: beforeUnit,
        targetUnit: afterUnit,
      },
      changeContent: "start condition changed",
      rationale: "previous start path may no longer be available",
      relatedTargets: [],
      constraints: ["runtime history is not verified"],
    };
    const unsupportedItem: SemanticDiffUnsupportedItem = {
      id: "unsupported-1",
      kind: "unsupported",
      target: { kind: "unit", unit: beforeUnit },
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
      },
    );

    assert.strictEqual(changeSet.changes[0], change);
    assert.strictEqual(changeSet.confirmationRequired[0], confirmationRequired);
    assert.strictEqual(changeSet.unsupportedItems[0], unsupportedItem);
    assert.strictEqual(changeSet.reportSections[0], reportSection);
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
});
