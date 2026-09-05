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

const parameterList = (entries: Array<[string, string]>): AjsParameter[] =>
  entries.map(([key, value]) => ({ key, value }));

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

  test("selects every supported file and event target key", () => {
    const fileTargetKeys = ["flwf", "flwc"];
    const eventTargetKeys = [
      "evwid",
      "evwfr",
      "evhst",
      "evwms",
      "evdet",
      "evusr",
      "evgrp",
      "evuid",
      "evgid",
      "evpid",
      "evipa",
      "evesc",
    ];
    const matches = [...fileTargetKeys, ...eventTargetKeys].map(
      (parameterKey, index) => {
        const unitType = index < fileTargetKeys.length ? "flwj" : "evwj";
        const before = unit({
          id: `/root/jobnet/wait-${index}`,
          name: `wait-${index}`,
          absolutePath: `/root/jobnet/wait-${index}`,
          unitType,
          parameters: parameterList([
            ["ty", unitType],
            [parameterKey, `before-${index}`],
          ]),
        });
        const after = unit({
          ...before,
          parameters: parameterList([
            ["ty", unitType],
            [parameterKey, `after-${index}`],
          ]),
        });
        return {
          before,
          after,
          parameterKey,
          kind: "exact" as const,
        };
      },
    );

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: matches.map(({ before }) => before),
      afterUnits: matches.map(({ after }) => after),
      beforeUnitById: unitMap(...matches.map(({ before }) => before)),
      afterUnitById: unitMap(...matches.map(({ after }) => after)),
      matches,
    });

    assert.deepStrictEqual(
      result.confirmationDecisions
        .filter((decision) => decision.kind === "wait-target-changed")
        .map((decision) => decision.parameterKey)
        .sort(),
      [...fileTargetKeys, ...eventTargetKeys].sort(),
    );
  });

  test("selects before-only and after-only supported target keys", () => {
    const fileTargetKeys = ["flwf", "flwc"];
    const eventTargetKeys = [
      "evwid",
      "evwfr",
      "evhst",
      "evwms",
      "evdet",
      "evusr",
      "evgrp",
      "evuid",
      "evgid",
      "evpid",
      "evipa",
      "evesc",
    ];
    const targetKeys = [...fileTargetKeys, ...eventTargetKeys];
    const matches = targetKeys.flatMap((parameterKey, index) => {
      const unitType: "flwj" | "evwj" =
        index < fileTargetKeys.length ? "flwj" : "evwj";
      return ["before-only", "after-only"].map((caseKind) => {
        const before = unit({
          id: `/root/jobnet/${caseKind}-${parameterKey}`,
          name: `${caseKind}-${parameterKey}`,
          absolutePath: `/root/jobnet/${caseKind}-${parameterKey}`,
          unitType,
          parameters: parameterList([
            ["ty", unitType],
            ...(caseKind === "before-only"
              ? [[parameterKey, `before-${parameterKey}`] as [string, string]]
              : []),
          ]),
        });
        const after = unit({
          ...before,
          parameters: parameterList([
            ["ty", unitType],
            ...(caseKind === "after-only"
              ? [[parameterKey, `after-${parameterKey}`] as [string, string]]
              : []),
          ]),
        });
        return {
          before,
          after,
          parameterKey,
          caseKind,
          kind: "exact" as const,
        };
      });
    });

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: matches.map(({ before }) => before),
      afterUnits: matches.map(({ after }) => after),
      beforeUnitById: unitMap(...matches.map(({ before }) => before)),
      afterUnitById: unitMap(...matches.map(({ after }) => after)),
      matches,
    });
    const decisionsByAfterId = new Map(
      result.confirmationDecisions
        .filter((decision) => decision.kind === "wait-target-changed")
        .map((decision) => [decision.match.after.id, decision]),
    );

    assert.strictEqual(decisionsByAfterId.size, matches.length);
    matches.forEach(({ before, after, parameterKey, caseKind }) => {
      const decision = decisionsByAfterId.get(after.id);
      assert.ok(decision);
      assert.strictEqual(decision?.parameterKey, parameterKey);
      assert.deepStrictEqual(
        before.parameters
          .filter((parameter) => parameter.key === parameterKey)
          .map((parameter) => parameter.value),
        caseKind === "before-only" ? [`before-${parameterKey}`] : [],
      );
      assert.deepStrictEqual(
        after.parameters
          .filter((parameter) => parameter.key === parameterKey)
          .map((parameter) => parameter.value),
        caseKind === "after-only" ? [`after-${parameterKey}`] : [],
      );
    });
  });

  test("does not confirm unsupported file conditions or non-wait parameters", () => {
    const beforeUnsupported = unit({
      id: "/root/jobnet/unsupported",
      name: "unsupported",
      absolutePath: "/root/jobnet/unsupported",
      unitType: "flwj",
      parameters: parameterList([
        ["ty", "flwj"],
        ["flwc", "s:m"],
      ]),
    });
    const afterUnsupported = unit({
      ...beforeUnsupported,
      parameters: parameterList([
        ["ty", "flwj"],
        ["flwc", "s"],
      ]),
    });
    const beforeJob = unit({
      id: "/root/jobnet/job-with-wait-parameters",
      name: "job-with-wait-parameters",
      absolutePath: "/root/jobnet/job-with-wait-parameters",
      parameters: parameterList([
        ["ty", "j"],
        ["eun", "release-before"],
        ["flwf", "/before/file"],
      ]),
    });
    const afterJob = unit({
      ...beforeJob,
      parameters: parameterList([
        ["ty", "j"],
        ["eun", "release-after"],
        ["flwf", "/after/file"],
      ]),
    });
    const matches: SemanticDiffUnitMatch[] = [
      { before: beforeUnsupported, after: afterUnsupported, kind: "exact" },
      { before: beforeJob, after: afterJob, kind: "exact" },
    ];

    const result = evaluateSemanticDiffEvidence({
      beforeUnits: matches.map(({ before }) => before),
      afterUnits: matches.map(({ after }) => after),
      beforeUnitById: unitMap(...matches.map(({ before }) => before)),
      afterUnitById: unitMap(...matches.map(({ after }) => after)),
      matches,
    });

    assert.deepStrictEqual(result.confirmationDecisions, []);
    assert.deepStrictEqual(
      result.unsupportedDecisions.map((decision) => decision.match.after.id),
      [afterUnsupported.id],
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
