import * as assert from "assert";
import {
  buildSemanticDiffScheduleImpact,
  buildScheduleProjectionFacts,
  encodeSemanticDiffScheduleImpactId,
  type ScheduleProjectionFacts,
  type SemanticDiffScheduleImpactIssue,
  type SemanticDiffScheduleImpactRoot,
} from "../../application/semantic-diff/semanticDiffScheduleImpact";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleEvaluation } from "../../domain/services/semantic-diff/semanticDiffScheduleRules";

const parameters = (
  values: Record<string, string | string[]>,
): AjsParameter[] =>
  Object.entries(values).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map((item) => ({ key, value: item }))
      : [{ key, value }],
  );

const rootJobnet = (path: string): AjsUnit => ({
  id: path,
  name: path.split("/").at(-1) ?? "jobnet",
  unitAttribute: "jobnet,,jp1admin,",
  unitType: "n",
  absolutePath: path,
  depth: 1,
  parentId: "/root",
  isRoot: false,
  isRootJobnet: true,
  hasSchedule: true,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: parameters({ ty: "n" }),
  relations: [],
  children: [],
});

const document = (children: AjsUnit[]): AjsDocument => ({
  rootUnits: [
    {
      ...rootJobnet("/root"),
      name: "root",
      unitType: "g",
      parentId: undefined,
      isRoot: true,
      isRootJobnet: false,
      hasSchedule: false,
      parameters: parameters({ ty: "g" }),
      children,
    },
  ],
  warnings: [],
});

const result: SemanticDiffResult = {
  inputs: {
    before: { side: "before", unitIds: [], relations: [] },
    after: { side: "after", unitIds: [], relations: [] },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
};

suite("Semantic Diff schedule impact", () => {
  test("length-prefixes UTF-8 components without delimiter collisions", () => {
    const left = encodeSemanticDiffScheduleImpactId("a:b", "c");
    const right = encodeSemanticDiffScheduleImpactId("a", "b:c");
    const unicode = encodeSemanticDiffScheduleImpactId("あ");

    assert.notStrictEqual(left, right);
    assert.strictEqual(left, "3:a:b1:c");
    assert.strictEqual(unicode, "3:あ");
  });

  test("keeps an evaluated empty period available and immutable", () => {
    const facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }> = {
      kind: "evaluated",
      period: { from: "2026-04-01", to: "2026-05-01" },
      before: { rootProjections: [], statuses: [], issues: [] },
      after: { rootProjections: [], statuses: [], issues: [] },
      correspondence: [],
      candidateGroups: [],
    };
    const sidecar = buildSemanticDiffScheduleImpact({ result, facts });

    assert.deepStrictEqual(sidecar.period, facts.period);
    assert.deepStrictEqual(sidecar.roots, []);
    assert.deepStrictEqual(sidecar.timelineItems, []);
    assert.throws(() => {
      (sidecar as unknown as { period: { from: string } }).period.from =
        "changed";
    }, TypeError);
  });

  test("distinguishes identical calendar reasons by carried projection status", () => {
    const root = rootJobnet("/root/statuses");
    const identityDecision = {
      id: "identity:statuses",
      status: "exact" as const,
      rule: "exact-key" as const,
      before: [
        {
          id: root.id,
          name: root.name,
          absolutePath: root.absolutePath,
          unitType: root.unitType,
        },
      ],
      after: [
        {
          id: root.id,
          name: root.name,
          absolutePath: root.absolutePath,
          unitType: root.unitType,
        },
      ],
      evidence: {
        kind: "exact-key" as const,
        key: {
          kind: "jobnet" as const,
          jobGroupRelativePath: "statuses",
          unitType: "n",
        },
      },
    };
    const decision = (
      value: string,
      status: "invalid" | "missing-context" | "unsupported",
      reason:
        | "calendar-selection"
        | "missing-start-time" = "calendar-selection",
    ) => ({
      side: "after" as const,
      unit: root,
      parameter: {
        key: reason === "missing-start-time" ? "sd" : "jc",
        value,
      },
      reason,
      status,
    });
    const evaluation: SemanticDiffScheduleEvaluation = {
      kind: "evaluated",
      period: { from: "2026-04-01", to: "2026-05-01" },
      runDecisions: [],
      unsupportedDecisions: [
        decision("invalid", "invalid"),
        decision("missing", "missing-context"),
        decision("unsupported", "unsupported"),
        decision("missing-start", "invalid", "missing-start-time"),
        decision("same", "invalid"),
        decision("same", "unsupported"),
      ],
      zeroRunCandidates: [],
      zeroRunCandidatesBySide: { before: [], after: [] },
      pairEvaluations: [],
    };
    const facts = buildScheduleProjectionFacts({
      result: {
        ...result,
        identityDecisions: [identityDecision],
      },
      before: document([root]),
      after: document([root]),
      scheduleEvaluation: evaluation,
    });
    assert.strictEqual(facts.kind, "evaluated");
    if (facts.kind !== "evaluated") return;
    const sidecar = buildSemanticDiffScheduleImpact({
      result,
      facts,
    });

    assert.deepStrictEqual(
      sidecar.issues.map((issue) => [
        issue.reasonCode,
        issue.kind,
        issue.detail.rawValues,
      ]),
      [
        ["calendar-selection", "invalid", ["invalid"]],
        ["calendar-selection", "invalid", ["same"]],
        ["calendar-selection", "missing-context", ["missing"]],
        ["calendar-selection", "unsupported", ["same"]],
        ["calendar-selection", "unsupported", ["unsupported"]],
        ["missing-start-time", "uncalculated", ["missing-start"]],
      ],
    );
    assert.deepStrictEqual(
      sidecar.issues
        .filter((issue) => issue.detail.rawValues[0] === "same")
        .map((issue) => [issue.kind, issue.occurrenceOrdinal]),
      [
        ["invalid", 1],
        ["unsupported", 0],
      ],
    );
  });

  test("excludes ambiguous candidate-root issues from sidecar ownership", () => {
    const before = rootJobnet("/root/candidate-before");
    const after = rootJobnet("/root/candidate-after");
    const beforeNested = {
      ...before,
      id: `${before.id}/nested`,
      name: "nested",
      unitType: "rn" as const,
      absolutePath: `${before.absolutePath}/nested`,
      parentId: before.id,
      isRoot: false,
      isRootJobnet: false,
      children: [],
    };
    const afterNested = {
      ...after,
      id: `${after.id}/nested`,
      name: "nested",
      unitType: "rn" as const,
      absolutePath: `${after.absolutePath}/nested`,
      parentId: after.id,
      isRoot: false,
      isRootJobnet: false,
      children: [],
    };
    const beforeCandidateRoot = { ...before, children: [beforeNested] };
    const afterCandidateRoot = { ...after, children: [afterNested] };
    const identityDecision = {
      id: "identity:candidate-roots",
      status: "candidate" as const,
      rule: "ambiguous-fingerprint" as const,
      before: [
        {
          id: before.id,
          name: before.name,
          absolutePath: before.absolutePath,
          unitType: before.unitType,
        },
      ],
      after: [
        {
          id: after.id,
          name: after.name,
          absolutePath: after.absolutePath,
          unitType: after.unitType,
        },
      ],
      evidence: {
        kind: "fingerprint" as const,
        strategyId: "legacy-all-parameters-v1" as const,
        unitType: "n",
        fields: [],
      },
    };
    const evaluation: SemanticDiffScheduleEvaluation = {
      kind: "evaluated",
      period: { from: "2026-04-01", to: "2026-05-01" },
      runDecisions: [],
      unsupportedDecisions: [
        {
          side: "before",
          unit: before,
          parameter: { key: "cy", value: "2" },
          reason: "cycle-schedule",
        },
        {
          side: "after",
          unit: afterNested,
          parameter: { key: "cy", value: "3" },
          reason: "cycle-schedule",
        },
        {
          side: "before",
          unit: beforeNested,
          parameter: { key: "cy", value: "4" },
          reason: "cycle-schedule",
        },
      ],
      zeroRunCandidates: [],
      zeroRunCandidatesBySide: { before: [], after: [] },
      pairEvaluations: [],
    };
    const facts = buildScheduleProjectionFacts({
      result: { ...result, identityDecisions: [identityDecision] },
      before: document([beforeCandidateRoot]),
      after: document([afterCandidateRoot]),
      scheduleEvaluation: evaluation,
    });
    assert.strictEqual(facts.kind, "evaluated");
    if (facts.kind !== "evaluated") return;
    assert.deepStrictEqual(facts.before.issues, []);
    assert.deepStrictEqual(facts.after.issues, []);
    assert.deepStrictEqual(facts.correspondence, []);
    assert.strictEqual(facts.candidateGroups?.length, 1);
  });

  test("resolves an added or removed effect by its exact composite reference", () => {
    const rootId = encodeSemanticDiffScheduleImpactId(
      "root",
      "before",
      "/root/removed",
      "",
      "",
      "removed",
      0,
    );
    const run = {
      id: encodeSemanticDiffScheduleImpactId(
        "run",
        "before",
        rootId,
        "2026-04-01",
        "09:00",
        1,
        0,
      ),
      side: "before" as const,
      unitId: "/root/removed",
      unitPath: "/root/removed",
      unitName: "removed",
      rule: 1,
      date: "2026-04-01",
      time: "09:00",
      occurrenceOrdinal: 0,
      sourceChangeRef: null,
    };
    const root: SemanticDiffScheduleImpactRoot = {
      id: rootId,
      matchKind: "removed",
      canonicalPath: "/root/removed",
      identityDecisionId: null,
      before: {
        side: "before",
        unitId: "/root/removed",
        unitPath: "/root/removed",
        unitName: "removed",
        outcome: "supported-runs",
        runs: [run],
        issueIds: [],
      },
      after: null,
      scopeTransition: null,
    };
    const sidecar = buildSemanticDiffScheduleImpact({
      result: {
        ...result,
        scheduleComparison: {
          period: { from: "2026-04-01", to: "2026-05-01" },
          runChanges: [
            {
              id: "removed-change",
              kind: "removed",
              unitPath: "/root/removed",
              date: "2026-04-01",
              before: {
                unitPath: "/root/removed",
                unitName: "removed",
                rule: 1,
                date: "2026-04-01",
                time: "09:00",
              },
              after: null,
            },
          ],
        },
      },
      facts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: { rootProjections: [root.before!], statuses: [], issues: [] },
        after: { rootProjections: [], statuses: [], issues: [] },
        correspondence: [root],
      },
    });

    assert.strictEqual(sidecar.timelineItems[0]?.state, "removed");
    assert.deepStrictEqual(sidecar.timelineItems[0]?.sourceChangeRef, {
      id: "removed-change",
      occurrenceOrdinal: 0,
    });
    assert.deepStrictEqual(
      sidecar.roots[0]?.before?.runs[0]?.sourceChangeRef,
      sidecar.timelineItems[0]?.sourceChangeRef,
    );
  });

  test("matches duplicate and count-mismatch changed-time effects one-to-one", () => {
    const path = "/root/changed-times";
    const rootId = encodeSemanticDiffScheduleImpactId(
      "root",
      "pair",
      path,
      "",
      "",
      "exact",
      0,
    );
    const makeRun = (side: "before" | "after", time: string) => ({
      id: encodeSemanticDiffScheduleImpactId(
        "run",
        side,
        rootId,
        "2026-04-01",
        time,
        1,
        side === "before" ? (time === "09:00" ? 0 : 1) : 0,
      ),
      side,
      unitId: path,
      unitPath: path,
      unitName: "changed-times",
      rule: 1,
      date: "2026-04-01",
      time,
      occurrenceOrdinal: side === "before" ? (time === "09:00" ? 0 : 1) : 0,
      sourceChangeRef: null,
    });
    const beforeRuns = [makeRun("before", "09:00"), makeRun("before", "10:00")];
    const afterRuns = [makeRun("after", "11:00")];
    const root: SemanticDiffScheduleImpactRoot = {
      id: rootId,
      matchKind: "exact",
      canonicalPath: path,
      identityDecisionId: "identity",
      before: {
        side: "before",
        unitId: path,
        unitPath: path,
        unitName: "changed-times",
        outcome: "supported-runs",
        runs: beforeRuns,
        issueIds: [],
      },
      after: {
        side: "after",
        unitId: path,
        unitPath: path,
        unitName: "changed-times",
        outcome: "supported-runs",
        runs: afterRuns,
        issueIds: [],
      },
      scopeTransition: null,
    };
    const sidecar = buildSemanticDiffScheduleImpact({
      result: {
        ...result,
        scheduleComparison: {
          period: { from: "2026-04-01", to: "2026-05-01" },
          runChanges: [
            {
              id: "removed-10",
              kind: "removed",
              unitPath: path,
              date: "2026-04-01",
              before: {
                unitPath: path,
                unitName: "changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "10:00",
              },
              after: null,
            },
            {
              id: "changed-09-to-11",
              kind: "changed-time",
              unitPath: path,
              date: "2026-04-01",
              before: {
                unitPath: path,
                unitName: "changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "09:00",
              },
              after: {
                unitPath: path,
                unitName: "changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "11:00",
              },
            },
          ],
        },
      },
      facts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: { rootProjections: [root.before!], statuses: [], issues: [] },
        after: { rootProjections: [root.after!], statuses: [], issues: [] },
        correspondence: [root],
      },
    });
    assert.deepStrictEqual(
      sidecar.timelineItems.map((item) => [
        item.state,
        item.sourceChangeRef?.id,
      ]),
      [
        ["changed-time", "changed-09-to-11"],
        ["removed", "removed-10"],
      ],
    );
    assert.deepStrictEqual(
      sidecar.timelineItems.map((item) => [
        item.before?.sourceChangeRef?.id,
        item.after?.sourceChangeRef?.id,
      ]),
      [
        ["changed-09-to-11", "changed-09-to-11"],
        ["removed-10", undefined],
      ],
    );
  });

  test("keeps duplicate equal changed-time effects distinct with shuffled rows", () => {
    const path = "/root/duplicate-changed-times";
    const rootId = encodeSemanticDiffScheduleImpactId(
      "root",
      "pair",
      path,
      "",
      "",
      "exact",
      0,
    );
    const makeRun = (side: "before" | "after", ordinal: number) => ({
      id: encodeSemanticDiffScheduleImpactId(
        "run",
        side,
        rootId,
        "2026-04-01",
        side === "before" ? "09:00" : "10:00",
        1,
        ordinal,
      ),
      side,
      unitId: path,
      unitPath: path,
      unitName: "duplicate-changed-times",
      rule: 1,
      date: "2026-04-01",
      time: side === "before" ? "09:00" : "10:00",
      occurrenceOrdinal: ordinal,
      sourceChangeRef: null,
    });
    const beforeRuns = [makeRun("before", 0), makeRun("before", 1)];
    const afterRuns = [makeRun("after", 0), makeRun("after", 1)];
    const root: SemanticDiffScheduleImpactRoot = {
      id: rootId,
      matchKind: "exact",
      canonicalPath: path,
      identityDecisionId: "identity",
      before: {
        side: "before",
        unitId: path,
        unitPath: path,
        unitName: "duplicate-changed-times",
        outcome: "supported-runs",
        runs: beforeRuns,
        issueIds: [],
      },
      after: {
        side: "after",
        unitId: path,
        unitPath: path,
        unitName: "duplicate-changed-times",
        outcome: "supported-runs",
        runs: afterRuns,
        issueIds: [],
      },
      scopeTransition: null,
    };
    const sidecar = buildSemanticDiffScheduleImpact({
      result: {
        ...result,
        scheduleComparison: {
          period: { from: "2026-04-01", to: "2026-05-01" },
          runChanges: [
            {
              id: "duplicate-change-b",
              kind: "changed-time",
              unitPath: path,
              date: "2026-04-01",
              before: {
                unitPath: path,
                unitName: "duplicate-changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "09:00",
              },
              after: {
                unitPath: path,
                unitName: "duplicate-changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "10:00",
              },
            },
            {
              id: "duplicate-change-a",
              kind: "changed-time",
              unitPath: path,
              date: "2026-04-01",
              before: {
                unitPath: path,
                unitName: "duplicate-changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "09:00",
              },
              after: {
                unitPath: path,
                unitName: "duplicate-changed-times",
                rule: 1,
                date: "2026-04-01",
                time: "10:00",
              },
            },
          ],
        },
      },
      facts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: { rootProjections: [root.before!], statuses: [], issues: [] },
        after: { rootProjections: [root.after!], statuses: [], issues: [] },
        correspondence: [root],
      },
    });
    assert.deepStrictEqual(
      sidecar.timelineItems.map((item) => item.sourceChangeRef?.id),
      ["duplicate-change-b", "duplicate-change-a"],
    );
    assert.ok(
      sidecar.timelineItems.every(
        (item) =>
          item.before?.sourceChangeRef?.id === item.sourceChangeRef?.id &&
          item.after?.sourceChangeRef?.id === item.sourceChangeRef?.id,
      ),
    );
  });

  test("pairs nested runs by matched source identity without cross-pairing", () => {
    const path = "/root/nested-pair";
    const rootId = encodeSemanticDiffScheduleImpactId(
      "root",
      "pair",
      path,
      "",
      "",
      "exact",
      0,
    );
    const makeRun = (
      side: "before" | "after",
      unitId: string,
      unitPath: string,
      time: string,
    ) => ({
      id: `run:${side}:${unitId}:${time}`,
      side,
      unitId,
      unitPath,
      unitName: unitPath.split("/").at(-1) ?? unitPath,
      rule: 1,
      date: "2026-04-01",
      time,
      occurrenceOrdinal: 0,
      sourceChangeRef: null,
    });
    const beforeRuns = [
      makeRun("before", `${path}/a`, `${path}/a`, "09:00"),
      makeRun("before", `${path}/b`, `${path}/b`, "09:00"),
    ];
    const afterRuns = [
      makeRun("after", `${path}/b`, `${path}/b`, "09:00"),
      makeRun("after", `${path}/a`, `${path}/a`, "10:00"),
    ];
    const identity = (unitPath: string) => ({
      id: `identity:${unitPath}`,
      status: "exact" as const,
      rule: "exact-key" as const,
      before: [
        {
          id: unitPath,
          name: unitPath.split("/").at(-1) ?? unitPath,
          absolutePath: unitPath,
          unitType: "rn",
        },
      ],
      after: [
        {
          id: unitPath,
          name: unitPath.split("/").at(-1) ?? unitPath,
          absolutePath: unitPath,
          unitType: "rn",
        },
      ],
      evidence: {
        kind: "exact-key" as const,
        key: {
          kind: "unit" as const,
          parentJobnetPath: path,
          unitName: unitPath.split("/").at(-1) ?? unitPath,
          unitType: "rn",
        },
      },
    });
    const root: SemanticDiffScheduleImpactRoot = {
      id: rootId,
      matchKind: "exact",
      canonicalPath: path,
      identityDecisionId: "identity:root",
      before: {
        side: "before",
        unitId: path,
        unitPath: path,
        unitName: "nested-pair",
        outcome: "supported-runs",
        runs: beforeRuns,
        issueIds: [],
      },
      after: {
        side: "after",
        unitId: path,
        unitPath: path,
        unitName: "nested-pair",
        outcome: "supported-runs",
        runs: afterRuns,
        issueIds: [],
      },
      scopeTransition: null,
    };
    const sidecar = buildSemanticDiffScheduleImpact({
      result: {
        ...result,
        identityDecisions: [identity(`${path}/a`), identity(`${path}/b`)],
        scheduleComparison: {
          period: { from: "2026-04-01", to: "2026-05-01" },
          runChanges: [
            {
              id: "changed-a",
              kind: "changed-time",
              unitPath: `${path}/a`,
              date: "2026-04-01",
              before: {
                unitPath: `${path}/a`,
                unitName: "a",
                rule: 1,
                date: "2026-04-01",
                time: "09:00",
              },
              after: {
                unitPath: `${path}/a`,
                unitName: "a",
                rule: 1,
                date: "2026-04-01",
                time: "10:00",
              },
            },
          ],
        },
      },
      facts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: { rootProjections: [root.before], statuses: [], issues: [] },
        after: { rootProjections: [root.after], statuses: [], issues: [] },
        correspondence: [root],
      },
    });

    assert.deepStrictEqual(
      sidecar.timelineItems.map((item) => [
        item.state,
        item.before?.unitPath,
        item.after?.unitPath,
        item.sourceChangeRef?.id,
      ]),
      [
        ["changed-time", `${path}/a`, `${path}/a`, "changed-a"],
        ["unchanged", `${path}/b`, `${path}/b`, undefined],
      ],
    );
  });

  test("fails closed when a root-scope effect has no upstream change ref", () => {
    const makeTransitionRoot = (
      path: string,
      time: string,
      matchKind: "removed-root-scope" | "added-root-scope",
    ): SemanticDiffScheduleImpactRoot => {
      const rootId = encodeSemanticDiffScheduleImpactId(
        "root",
        matchKind === "removed-root-scope" ? "before" : "after",
        path,
        "",
        "",
        matchKind,
        0,
      );
      const side: "before" | "after" =
        matchKind === "removed-root-scope" ? "before" : "after";
      const run = {
        id: encodeSemanticDiffScheduleImpactId(
          "run",
          side,
          rootId,
          "2026-04-01",
          time,
          1,
          0,
        ),
        side,
        unitId: path,
        unitPath: path,
        unitName: path.split("/").at(-1) ?? "jobnet",
        rule: 1,
        date: "2026-04-01",
        time,
        occurrenceOrdinal: 0,
        sourceChangeRef: null,
      } as const;
      const projection = {
        side,
        unitId: path,
        unitPath: path,
        unitName: run.unitName,
        outcome: "supported-runs" as const,
        runs: [run],
        issueIds: [],
      };
      return {
        id: rootId,
        matchKind,
        canonicalPath: path,
        identityDecisionId: "identity",
        before: side === "before" ? projection : null,
        after: side === "after" ? projection : null,
        scopeTransition: {
          kind: matchKind,
          counterpartPath: `${path}/counterpart`,
          identityDecisionId: "identity",
        },
      };
    };

    const noRowRoot = makeTransitionRoot(
      "/root/no-row-transition",
      "09:00",
      "removed-root-scope",
    );
    assert.throws(
      () =>
        buildSemanticDiffScheduleImpact({
          result,
          facts: {
            kind: "evaluated",
            period: { from: "2026-04-01", to: "2026-05-01" },
            before: {
              rootProjections: [noRowRoot.before!],
              statuses: [],
              issues: [],
            },
            after: { rootProjections: [], statuses: [], issues: [] },
            correspondence: [noRowRoot],
          },
        }),
      /Changed schedule-impact effects require a change reference/,
    );
  });

  test("resolves one-sided root-scope effects against exact upstream rows", () => {
    const path = "/root/root-scope-transition";
    const rootId = encodeSemanticDiffScheduleImpactId(
      "root",
      "before",
      path,
      "",
      "",
      "removed-root-scope",
      0,
    );
    const run = {
      id: encodeSemanticDiffScheduleImpactId(
        "run",
        "before",
        rootId,
        "2026-04-01",
        "10:00",
        1,
        0,
      ),
      side: "before" as const,
      unitId: path,
      unitPath: path,
      unitName: "root-scope-transition",
      rule: 1,
      date: "2026-04-01",
      time: "10:00",
      occurrenceOrdinal: 0,
      sourceChangeRef: null,
    };
    const root: SemanticDiffScheduleImpactRoot = {
      id: rootId,
      matchKind: "removed-root-scope",
      canonicalPath: path,
      identityDecisionId: "identity",
      before: {
        side: "before",
        unitId: path,
        unitPath: path,
        unitName: "root-scope-transition",
        outcome: "supported-runs",
        runs: [run],
        issueIds: [],
      },
      after: null,
      scopeTransition: {
        kind: "removed-root-scope",
        counterpartPath: `${path}/counterpart`,
        identityDecisionId: "identity",
      },
    };
    const sidecar = buildSemanticDiffScheduleImpact({
      result: {
        ...result,
        scheduleComparison: {
          period: { from: "2026-04-01", to: "2026-05-01" },
          runChanges: [
            {
              id: "root-scope-removed",
              kind: "removed",
              unitPath: path,
              date: "2026-04-01",
              before: {
                unitPath: path,
                unitName: "root-scope-transition",
                rule: 1,
                date: "2026-04-01",
                time: "10:00",
              },
              after: null,
            },
          ],
        },
      },
      facts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: { rootProjections: [root.before!], statuses: [], issues: [] },
        after: { rootProjections: [], statuses: [], issues: [] },
        correspondence: [root],
      },
    });
    assert.deepStrictEqual(sidecar.timelineItems[0]?.sourceChangeRef, {
      id: "root-scope-removed",
      occurrenceOrdinal: 0,
    });
  });

  test("globally sorts shuffled multi-root issues", () => {
    const makeRoot = (path: string): SemanticDiffScheduleImpactRoot => {
      const rootId = encodeSemanticDiffScheduleImpactId(
        "root",
        "before",
        path,
        "",
        "",
        "removed",
        0,
      );
      return {
        id: rootId,
        matchKind: "removed",
        canonicalPath: path,
        identityDecisionId: null,
        before: {
          side: "before",
          unitId: path,
          unitPath: path,
          unitName: path.split("/").at(-1) ?? "jobnet",
          outcome: "uncalculated",
          runs: [],
          issueIds: [],
        },
        after: null,
        scopeTransition: null,
      };
    };
    const rootA = makeRoot("/root/a");
    const rootB = makeRoot("/root/b");
    const makeIssue = (
      root: SemanticDiffScheduleImpactRoot,
      path: string,
      rawValue: string,
    ): SemanticDiffScheduleImpactIssue => ({
      id: `${path}:${rawValue}`,
      occurrenceOrdinal: 0,
      kind: "unsupported",
      side: "before",
      rootId: root.id,
      reasonCode: "cycle-schedule",
      targetKind: "jobnet",
      targetId: path,
      targetPath: path,
      parameterKey: "cy",
      detail: {
        unitPath: path,
        parameterKey: "cy",
        relationPair: null,
        scheduleRule: 1,
        period: null,
        beforeValues: [],
        afterValues: [],
        rawValues: [rawValue],
        removedSources: [],
      },
    });
    const issueA = makeIssue(rootA, "/root/a", "2");
    const issueB = makeIssue(rootB, "/root/b", "3");
    const sidecar = buildSemanticDiffScheduleImpact({
      result,
      facts: {
        kind: "evaluated",
        period: { from: "2026-04-01", to: "2026-05-01" },
        before: {
          rootProjections: [rootB.before!, rootA.before!],
          statuses: [],
          issues: [issueB, issueA],
        },
        after: { rootProjections: [], statuses: [], issues: [] },
        correspondence: [rootB, rootA],
      },
    });

    assert.deepStrictEqual(
      sidecar.issues.map((issue) => issue.targetPath),
      ["/root/a", "/root/b"],
    );
  });
});
