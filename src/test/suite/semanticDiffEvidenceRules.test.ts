import * as assert from "assert";
import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { evaluateSemanticDiffEvidence } from "../../domain/services/semantic-diff/semanticDiffEvidenceRules";
import type { SemanticDiffUnitMatch } from "../../domain/services/semantic-diff/semanticDiffStructuralRules";

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

const relation = (
  sourceUnitId: string,
  targetUnitId: string,
  type: AjsRelation["type"],
): AjsRelation => ({ sourceUnitId, targetUnitId, type });

const unitMap = (...units: AjsUnit[]): Map<string, AjsUnit> =>
  new Map(units.map((item) => [item.id, item]));

suite("Semantic Diff Evidence Rules", () => {
  test("evaluates wait, timeout, condition, and unsupported evidence", () => {
    const beforeWait = unit({
      id: "/root/jobnet/wait",
      name: "wait",
      absolutePath: "/root/jobnet/wait",
      unitType: "flwj",
      parameters: parameters({
        ty: "flwj",
        eun: "release-before",
        fd: "10",
        flwf: "/before/file",
        flwc: "s:m",
      }),
    });
    const afterWait = unit({
      ...beforeWait,
      parameters: parameters({
        ty: "flwj",
        eun: "release-after",
        flwf: "/after/file",
        flwc: "s",
      }),
    });
    const beforeJudgment = unit({
      id: "/root/jobnet/judgment",
      name: "judgment",
      absolutePath: "/root/jobnet/judgment",
      parameters: parameters({ ty: "j", jd: "before" }),
    });
    const afterJudgment = unit({
      ...beforeJudgment,
      parameters: parameters({ ty: "j", jd: "after" }),
    });
    const matches: SemanticDiffUnitMatch[] = [
      { before: beforeWait, after: afterWait, kind: "exact" },
      { before: beforeJudgment, after: afterJudgment, kind: "exact" },
    ];

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: [beforeWait, beforeJudgment],
      afterUnits: [afterWait, afterJudgment],
      beforeUnitById: unitMap(beforeWait, beforeJudgment),
      afterUnitById: unitMap(afterWait, afterJudgment),
      matches,
    });

    assert.deepStrictEqual(
      result.confirmationDecisions.map((decision) => [
        decision.kind,
        "parameterKey" in decision ? decision.parameterKey : undefined,
      ]),
      [
        ["wait-release-source-changed", "eun"],
        ["timeout-removed", "fd"],
        ["condition-judgment-changed", "jd"],
        ["wait-target-changed", "flwc"],
        ["wait-target-changed", "flwf"],
      ],
    );
    assert.deepStrictEqual(
      result.confirmationDecisions
        .filter((decision) => decision.kind === "wait-release-source-changed")
        .flatMap((decision) => decision.removedSources),
      ["release-before"],
    );
    assert.deepStrictEqual(
      result.unsupportedDecisions.map((decision) => [
        decision.kind,
        decision.match.after.id,
      ]),
      [["uninterpretable-file-monitoring-condition", afterWait.id]],
    );
  });

  test("requires confirmation only for removed conditional relations", () => {
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
    const afterSource = unit({ ...beforeSource });
    const afterTarget = unit({ ...beforeTarget });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "con"),
      relation(beforeSource.id, beforeTarget.id, "seq"),
    ];
    const matches: SemanticDiffUnitMatch[] = [
      { before: beforeSource, after: afterSource, kind: "exact" },
      { before: beforeTarget, after: afterTarget, kind: "exact" },
    ];

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: [beforeSource, beforeTarget],
      afterUnits: [afterSource, afterTarget],
      beforeUnitById: unitMap(beforeSource, beforeTarget),
      afterUnitById: unitMap(afterSource, afterTarget),
      matches,
    });

    assert.deepStrictEqual(
      result.confirmationDecisions.map((decision) => [
        decision.kind,
        "pairKey" in decision ? decision.pairKey : undefined,
        "relation" in decision ? decision.relation.type : undefined,
      ]),
      [
        [
          "conditional-relation-removed",
          `${afterSource.id}->${afterTarget.id}`,
          "con",
        ],
      ],
    );
  });

  test("does not recommend a conditional relation when an endpoint is removed", () => {
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
    const afterSource = unit({ ...beforeSource });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "con"),
    ];

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: [beforeSource, beforeTarget],
      afterUnits: [afterSource],
      beforeUnitById: unitMap(beforeSource, beforeTarget),
      afterUnitById: unitMap(afterSource),
      matches: [{ before: beforeSource, after: afterSource, kind: "exact" }],
    });

    assert.deepStrictEqual(result.confirmationDecisions, []);
  });

  test("does not reuse an after fingerprint-match ID as a removed before endpoint", () => {
    const beforeSource = unit({
      id: "/root/jobnet/source",
      name: "source",
      absolutePath: "/root/jobnet/source",
    });
    const beforeRemovedTarget = unit({
      id: "/root/jobnet/target",
      name: "removed-target",
      absolutePath: "/root/jobnet/target",
    });
    const beforeFingerprintMatch = unit({
      id: "/root/jobnet/other",
      name: "other",
      absolutePath: "/root/jobnet/other",
    });
    const afterSource = unit({ ...beforeSource });
    const afterFingerprintMatch = unit({
      ...beforeFingerprintMatch,
      id: beforeRemovedTarget.id,
      name: "reused-target-id",
      absolutePath: beforeRemovedTarget.absolutePath,
    });
    beforeSource.relations = [
      relation(beforeSource.id, beforeRemovedTarget.id, "con"),
    ];

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: [beforeSource, beforeRemovedTarget, beforeFingerprintMatch],
      afterUnits: [afterSource, afterFingerprintMatch],
      beforeUnitById: unitMap(
        beforeSource,
        beforeRemovedTarget,
        beforeFingerprintMatch,
      ),
      afterUnitById: unitMap(afterSource, afterFingerprintMatch),
      matches: [
        { before: beforeSource, after: afterSource, kind: "exact" },
        {
          before: beforeFingerprintMatch,
          after: afterFingerprintMatch,
          kind: "fingerprint",
        },
      ],
    });

    assert.deepStrictEqual(result.confirmationDecisions, []);
  });
});
