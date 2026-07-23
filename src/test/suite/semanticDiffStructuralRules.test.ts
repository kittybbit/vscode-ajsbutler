import * as assert from "assert";
import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import {
  buildSemanticDiffUnitCorrespondence,
  compareSemanticDiffAttributes,
  compareSemanticDiffRelations,
  semanticDiffUnitFingerprint,
  semanticDiffUnitIdentityKey,
  type SemanticDiffUnitMatch,
} from "../../domain/services/semantic-diff/semanticDiffStructuralRules";

const parameters = (values: Record<string, string>): AjsParameter[] =>
  Object.entries(values).map(([key, value]) => ({ key, value }));

const unit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
  id: "/root/jobnet/job",
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
  parameters: parameters({ ty: "j", sc: "echo ok" }),
  relations: [],
  children: [],
  ...overrides,
});

const jobnet = (absolutePath: string): AjsUnit =>
  unit({
    id: absolutePath,
    name: absolutePath.split("/").at(-1) ?? absolutePath,
    unitType: "n",
    absolutePath,
    depth: 1,
    parentId: "/root",
    isRootJobnet: true,
    parameters: parameters({ ty: "n" }),
  });

const unitMap = (...units: AjsUnit[]): Map<string, AjsUnit> =>
  new Map(units.map((item) => [item.id, item]));

const relation = (
  sourceUnitId: string,
  targetUnitId: string,
  type: AjsRelation["type"] = "seq",
): AjsRelation => ({ sourceUnitId, targetUnitId, type });

suite("Semantic Diff Structural Rules", () => {
  test("uses parent jobnet, name, and type for exact unit identity", () => {
    const beforeParent = jobnet("/root/before");
    const afterParent = jobnet("/root/after");
    const before = unit({
      id: "/root/before/load",
      name: "LOAD",
      absolutePath: "/root/before/load",
      parentId: beforeParent.id,
    });
    const after = unit({
      id: "/root/after/load",
      name: "LOAD",
      absolutePath: "/root/after/load",
      parentId: afterParent.id,
      parameters: parameters({ ty: "j", sc: "echo changed" }),
    });
    const beforeUnitById = unitMap(beforeParent, before);
    const afterUnitById = unitMap(afterParent, after);

    assert.deepStrictEqual(
      semanticDiffUnitIdentityKey(before, beforeUnitById),
      {
        kind: "unit",
        parentJobnetPath: "/root/before",
        unitName: "LOAD",
        unitType: "j",
      },
    );

    const result = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [before],
      afterUnits: [after],
      beforeUnitById,
      afterUnitById,
      jobGroupPath: "/root",
    });

    assert.deepStrictEqual(result.matches, []);
    assert.deepStrictEqual(result.removedUnits, [before]);
    assert.deepStrictEqual(result.addedUnits, [after]);
  });

  test("confirms only one-to-one fingerprints and preserves ambiguity", () => {
    const parent = jobnet("/root/jobnet");
    const before = unit({
      id: "before",
      name: "before",
      absolutePath: "before",
    });
    const after = unit({ id: "after", name: "after", absolutePath: "after" });
    const parentMap = unitMap(parent, before, after);

    assert.strictEqual(
      semanticDiffUnitFingerprint(before),
      semanticDiffUnitFingerprint(after),
    );

    const oneToOne = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [before],
      afterUnits: [after],
      beforeUnitById: parentMap,
      afterUnitById: parentMap,
    });
    assert.deepStrictEqual(
      oneToOne.fingerprintMatches.map((match) => [
        match.before.id,
        match.after.id,
        match.kind,
      ]),
      [["before", "after", "fingerprint"]],
    );

    const beforeSecond = unit({
      id: "before-2",
      name: "before-2",
      absolutePath: "before-2",
    });
    const afterSecond = unit({
      id: "after-2",
      name: "after-2",
      absolutePath: "after-2",
    });
    const ambiguousMap = unitMap(
      parent,
      before,
      beforeSecond,
      after,
      afterSecond,
    );
    const ambiguous = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [before, beforeSecond],
      afterUnits: [after, afterSecond],
      beforeUnitById: ambiguousMap,
      afterUnitById: ambiguousMap,
    });

    assert.strictEqual(ambiguous.fingerprintMatches.length, 0);
    assert.strictEqual(ambiguous.candidates.length, 1);
    assert.deepStrictEqual(ambiguous.removedUnits, []);
    assert.deepStrictEqual(ambiguous.addedUnits, []);
  });

  test("classifies changed parameters and scalar attributes", () => {
    const before = unit({
      comment: "before",
      parameters: parameters({ ty: "j", sc: "echo ok", eu: "user-a" }),
    });
    const after = unit({
      comment: "after",
      parameters: parameters({ eu: "user-b", sc: "echo ok", ty: "j" }),
    });

    assert.deepStrictEqual(compareSemanticDiffAttributes(before, after), [
      { key: "comment", category: "execution-definition" },
      { key: "eu", category: "execution-environment" },
    ]);
  });

  test("compares relations after applying unit correspondence", () => {
    const before = unit({
      id: "before",
      name: "before",
      absolutePath: "before",
    });
    const after = unit({ id: "after", name: "after", absolutePath: "after" });
    const beforeTail = unit({
      id: "before-tail",
      name: "tail",
      absolutePath: "before-tail",
    });
    const afterTail = unit({
      id: "after-tail",
      name: "tail",
      absolutePath: "after-tail",
    });
    before.relations = [relation(before.id, beforeTail.id)];
    after.relations = [relation(after.id, afterTail.id)];
    const matches: SemanticDiffUnitMatch[] = [
      { before, after, kind: "fingerprint" },
      { before: beforeTail, after: afterTail, kind: "exact" },
    ];

    const unchanged = compareSemanticDiffRelations({
      beforeUnits: [before, beforeTail],
      afterUnits: [after, afterTail],
      beforeUnitById: unitMap(before, beforeTail),
      afterUnitById: unitMap(after, afterTail),
      matches,
    });
    assert.deepStrictEqual(unchanged, []);

    after.relations = [relation(after.id, afterTail.id, "con")];
    const changed = compareSemanticDiffRelations({
      beforeUnits: [before, beforeTail],
      afterUnits: [after, afterTail],
      beforeUnitById: unitMap(before, beforeTail),
      afterUnitById: unitMap(after, afterTail),
      matches,
    });
    assert.deepStrictEqual(
      changed.map((decision) => [
        decision.kind,
        decision.pairKey,
        decision.relation.type,
      ]),
      [
        ["removed", "after->after-tail", "seq"],
        ["added", "after->after-tail", "con"],
      ],
    );
  });
});
