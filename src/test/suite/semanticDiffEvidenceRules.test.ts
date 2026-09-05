import * as assert from "assert";
import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { TySymbols } from "../../domain/values/AjsType";
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

  test("applies the closed v13 execution-user applicability and default matrix", () => {
    const applicableTypes = new Set([
      "j",
      "rj",
      "pj",
      "rp",
      "qj",
      "rq",
      "evsj",
      "revsj",
      "mlsj",
      "rmlsj",
      "mqsj",
      "rmqsj",
      "mssj",
      "rmssj",
      "cmsj",
      "rcmsj",
      "pwlj",
      "rpwlj",
      "pwrj",
      "rpwrj",
      "cj",
      "rcj",
      "cpj",
      "rcpj",
      "fxj",
      "rfxj",
      "htpj",
      "rhtpj",
    ]);
    const matches = TySymbols.map((unitType) => {
      const before = unit({
        id: `/root/jobnet/eu-${unitType}`,
        name: `eu-${unitType}`,
        absolutePath: `/root/jobnet/eu-${unitType}`,
        unitType,
        parameters: parameterList([
          ["ty", unitType],
          ["eu", "ent"],
        ]),
      });
      const after = unit({
        ...before,
        parameters: parameterList([
          ["ty", unitType],
          ["eu", "def"],
        ]),
      });
      return { before, after, kind: "exact" as const };
    });
    const result = evaluateSemanticDiffEvidence({
      beforeUnits: matches.map(({ before }) => before),
      afterUnits: matches.map(({ after }) => after),
      beforeUnitById: unitMap(...matches.map(({ before }) => before)),
      afterUnitById: unitMap(...matches.map(({ after }) => after)),
      matches,
    });

    assert.deepStrictEqual(
      result.confirmationDecisions
        .filter((decision) => decision.kind === "execution-user-type-changed")
        .map((decision) => decision.match.after.unitType)
        .sort(),
      [...applicableTypes].sort(),
    );
    assert.strictEqual(
      result.confirmationDecisions.filter(
        (decision) => decision.kind === "jp1-resource-group-changed",
      ).length,
      0,
    );
  });

  test("uses unit-type defaults and ignores invalid execution-user evidence", () => {
    const cases = [
      ["ordinary-default-equal", "j", {}, { eu: "ent" }, false],
      ["ordinary-default-different", "j", {}, { eu: "def" }, true],
      ["http-default-equal", "htpj", {}, { eu: "def" }, false],
      ["http-default-different", "htpj", {}, { eu: "ent" }, true],
      ["recovery-http-default-equal", "rhtpj", {}, { eu: "def" }, false],
      ["recovery-http-default-different", "rhtpj", {}, { eu: "ent" }, true],
      ["invalid-before", "j", { eu: "invalid" }, { eu: "def" }, false],
      ["invalid-after", "j", { eu: "ent" }, { eu: "invalid" }, false],
      ["duplicate-before", "j", { eu: "ent" }, { eu: "def" }, false],
    ] as const;
    const matches = cases.map(
      ([name, unitType, beforeValues, afterValues], index) => {
        const before = unit({
          id: `/root/jobnet/${name}`,
          name,
          absolutePath: `/root/jobnet/${name}`,
          unitType,
          parameters: parameterList([
            ["ty", unitType],
            ...Object.entries(beforeValues),
            ...(index === cases.length - 1
              ? [["eu", "ent"] as [string, string]]
              : []),
          ]),
        });
        const after = unit({
          ...before,
          parameters: parameterList([
            ["ty", unitType],
            ...Object.entries(afterValues),
          ]),
        });
        return {
          before,
          after,
          expected: cases[index][4],
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

    matches.forEach(({ after, expected }) => {
      assert.strictEqual(
        result.confirmationDecisions.some(
          (decision) =>
            decision.kind === "execution-user-type-changed" &&
            decision.match.after.id === after.id,
        ),
        expected,
      );
    });
  });

  test("does not elevate excluded environment keys", () => {
    const before = unit({
      permission: "r",
      jp1Username: "jp1-before",
      parameters: parameterList([
        ["ty", "j"],
        ["un", "user-before"],
        ["qu", "queue-before"],
        ["mqque", "mq-before"],
        ["mqmgr", "manager-before"],
        ["ntsrc", "host-before"],
      ]),
    });
    const after = unit({
      ...before,
      permission: "w",
      jp1Username: "jp1-after",
      parameters: parameterList([
        ["ty", "j"],
        ["un", "user-after"],
        ["qu", "queue-after"],
        ["mqque", "mq-after"],
        ["mqmgr", "manager-after"],
        ["ntsrc", "host-after"],
      ]),
    });
    const result = evaluateSemanticDiffEvidence({
      beforeUnits: [before],
      afterUnits: [after],
      beforeUnitById: unitMap(before),
      afterUnitById: unitMap(after),
      matches: [{ before, after, kind: "exact" }],
    });

    assert.deepStrictEqual(result.confirmationDecisions, []);
  });

  test("compares raw resource-group evidence without treating rg parameters as GR", () => {
    const rawCases = [
      ["undefined-to-empty", undefined, "", true],
      ["empty-to-value", "", "group-a", true],
      ["value-to-undefined", "group-a", undefined, true],
      ["unchanged", "group-a", "group-a", false],
    ] as const;
    const matches = rawCases.map(
      ([name, beforeGroup, afterGroup, expected]) => {
        const before = unit({
          id: `/root/jobnet/rg-${name}`,
          name: `rg-${name}`,
          absolutePath: `/root/jobnet/rg-${name}`,
          jp1ResourceGroup: beforeGroup,
        });
        const after = unit({
          ...before,
          jp1ResourceGroup: afterGroup,
        });
        return { before, after, expected, kind: "exact" as const };
      },
    );
    const parameterBefore = unit({
      id: "/root/jobnet/rg-parameter",
      name: "rg-parameter",
      absolutePath: "/root/jobnet/rg-parameter",
      parameters: parameterList([
        ["ty", "j"],
        ["rg", "1"],
      ]),
    });
    const parameterAfter = unit({
      ...parameterBefore,
      parameters: parameterList([
        ["ty", "j"],
        ["rg", "2"],
      ]),
    });
    const allMatches = [
      ...matches,
      {
        before: parameterBefore,
        after: parameterAfter,
        kind: "exact" as const,
      },
    ];
    const result = evaluateSemanticDiffEvidence({
      beforeUnits: allMatches.map(({ before }) => before),
      afterUnits: allMatches.map(({ after }) => after),
      beforeUnitById: unitMap(...allMatches.map(({ before }) => before)),
      afterUnitById: unitMap(...allMatches.map(({ after }) => after)),
      matches: allMatches,
    });

    matches.forEach(({ after, expected }) => {
      assert.strictEqual(
        result.confirmationDecisions.some(
          (decision) =>
            decision.kind === "jp1-resource-group-changed" &&
            decision.match.after.id === after.id,
        ),
        expected,
      );
    });
    assert.strictEqual(
      result.confirmationDecisions.some(
        (decision) =>
          decision.kind !== "conditional-relation-removed" &&
          decision.match.after.id === parameterAfter.id,
      ),
      false,
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
