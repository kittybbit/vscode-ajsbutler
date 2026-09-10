import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { compareSemanticDiffWithArtifacts } from "../../application/semantic-diff/compareSemanticDiffWithArtifacts";
import { buildSemanticDiffPresentationArtifactsFromComparison } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";

const parameters = (
  values: Record<string, string | string[]>,
): AjsParameter[] =>
  Object.entries(values).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map((item) => ({ key, value: item }))
      : [{ key, value }],
  );

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
  parameters: parameters({ ty: "j", sc: "echo ok" }),
  relations: [],
  children: [],
  ...overrides,
});

const rootJobnet = (
  path: string,
  schedule: Record<string, string | string[]>,
  overrides: Partial<AjsUnit> = {},
): AjsUnit =>
  unit({
    id: path,
    name: path.split("/").at(-1) ?? "jobnet",
    unitAttribute: "jobnet,,jp1admin,",
    unitType: "n",
    absolutePath: path,
    depth: 1,
    parentId: "/root",
    isRootJobnet: true,
    hasSchedule: true,
    parameters: parameters({ ty: "n", ...schedule }),
    ...overrides,
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
      parameters: parameters({ ty: "g" }),
      children,
    }),
  ],
  warnings: [],
});

suite("Semantic Diff comparison artifacts", () => {
  test("returns not-requested facts without changing the public result", () => {
    const input = {
      before: document([
        rootJobnet("/root/before", { sd: "2026/04/01", st: "09:00" }),
      ]),
      after: document([
        rootJobnet("/root/before", { sd: "2026/04/01", st: "09:00" }),
      ]),
    };
    const artifacts = compareSemanticDiffWithArtifacts(input);

    assert.deepStrictEqual(artifacts.scheduleProjectionFacts, {
      kind: "not-requested",
    });
    assert.strictEqual(artifacts.result.scheduleComparison, undefined);
    assert.deepStrictEqual(
      artifacts.result,
      compareSemanticDiffWithArtifacts(input).result,
    );
  });

  test("preserves an invalid period as a closed facts state", () => {
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([]),
      after: document([
        rootJobnet("/root/after", { sd: "2026/04/01", st: "09:00" }),
      ]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-31", to: "2026-05-01" },
      },
    });

    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "invalid");
    if (artifacts.scheduleProjectionFacts.kind !== "invalid") return;
    assert.deepStrictEqual(artifacts.scheduleProjectionFacts.period, {
      from: "2026-04-31",
      to: "2026-05-01",
    });
    assert.strictEqual(artifacts.scheduleProjectionFacts.issues.length, 1);
    assert.deepStrictEqual(artifacts.result.scheduleComparison, undefined);
  });

  test("evaluates one period and retains both root projections", () => {
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([
        rootJobnet("/root/main", { sd: "2026/04/10", st: "09:00" }),
      ]),
      after: document([
        rootJobnet("/root/main", { sd: "2026/04/10", st: "10:00" }),
      ]),
      options: {
        jobGroupPath: "/root",
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    assert.deepStrictEqual(artifacts.scheduleProjectionFacts.period, {
      from: "2026-04-01",
      to: "2026-05-01",
    });
    assert.strictEqual(
      artifacts.scheduleProjectionFacts.before.rootProjections.length,
      1,
    );
    assert.strictEqual(
      artifacts.scheduleProjectionFacts.after.rootProjections.length,
      1,
    );
    assert.strictEqual(
      artifacts.scheduleProjectionFacts.before.rootProjections[0]?.outcome,
      "supported-runs",
    );
    assert.strictEqual(
      artifacts.scheduleProjectionFacts.after.rootProjections[0]?.outcome,
      "supported-runs",
    );
    assert.strictEqual(
      artifacts.result.scheduleComparison?.runChanges.length,
      1,
    );

    const presentation = buildSemanticDiffPresentationArtifactsFromComparison({
      result: artifacts.result,
      scheduleProjectionFacts: artifacts.scheduleProjectionFacts,
    });
    assert.strictEqual(presentation.scheduleImpact.kind, "available");
    if (presentation.scheduleImpact.kind !== "available") return;
    assert.deepStrictEqual(
      presentation.scheduleImpact.sidecar.timelineItems.map(
        (item) => item.state,
      ),
      ["changed-time"],
    );
    assert.strictEqual(
      presentation.scheduleImpact.sidecar.timelineItems[0]?.before?.time,
      "09:00",
    );
    assert.strictEqual(
      presentation.scheduleImpact.sidecar.timelineItems[0]?.after?.time,
      "10:00",
    );
    const timelineItem = presentation.scheduleImpact.sidecar.timelineItems[0]!;
    assert.strictEqual(timelineItem.time, "5:09:005:10:00");
    assert.ok(timelineItem.sourceChangeRef);
    assert.deepStrictEqual(
      timelineItem.before?.sourceChangeRef,
      timelineItem.sourceChangeRef,
    );
    assert.deepStrictEqual(
      timelineItem.after?.sourceChangeRef,
      timelineItem.sourceChangeRef,
    );
    const referencedChanges = artifacts.result.scheduleComparison!.runChanges;
    const referenced = referencedChanges.filter(
      (change) => change.id === timelineItem.sourceChangeRef!.id,
    )[timelineItem.sourceChangeRef!.occurrenceOrdinal];
    assert.ok(referenced);
    assert.strictEqual(referenced?.kind, "changed-time");
  });

  test("limits schedule-impact roots and issues to the comparison scope", () => {
    const inScope = rootJobnet(
      "/root/in/main",
      { sd: "2026/04/10", st: "09:00", cy: "2" },
      { parentId: "/root/in", depth: 2 },
    );
    const outOfScope = rootJobnet(
      "/root/out/main",
      { sd: "2026/04/10", st: "09:00", cy: "3" },
      { parentId: "/root/out", depth: 2 },
    );
    const inGroup = unit({
      id: "/root/in",
      name: "in",
      unitType: "g",
      absolutePath: "/root/in",
      depth: 1,
      parentId: "/root",
      parameters: parameters({ ty: "g" }),
      children: [inScope],
    });
    const outGroup = unit({
      id: "/root/out",
      name: "out",
      unitType: "g",
      absolutePath: "/root/out",
      depth: 1,
      parentId: "/root",
      parameters: parameters({ ty: "g" }),
      children: [outOfScope],
    });
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([inGroup, outGroup]),
      after: document([inGroup, outGroup]),
      options: {
        jobGroupPath: "/root/in",
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    assert.deepStrictEqual(
      artifacts.scheduleProjectionFacts.correspondence.map(
        (root) => root.canonicalPath,
      ),
      ["/root/in/main"],
    );
    assert.deepStrictEqual(
      artifacts.scheduleProjectionFacts.after.issues.map(
        (issue) => issue.targetPath,
      ),
      ["/root/in/main"],
    );
    assert.ok(
      artifacts.scheduleProjectionFacts.after.rootProjections.every((root) =>
        root.unitPath.startsWith("/root/in/"),
      ),
    );
  });

  test("fails closed for root-scope transitions without a row", () => {
    const before = rootJobnet("/root/transition", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const after = rootJobnet(
      "/root/transition",
      { sd: "2026/04/10", st: "09:00" },
      { isRootJobnet: false },
    );
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([before]),
      after: document([after]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.deepStrictEqual(artifacts.result.scheduleComparison?.runChanges, []);
    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    const [root] = artifacts.scheduleProjectionFacts.correspondence;
    assert.strictEqual(root?.matchKind, "removed-root-scope");
    assert.strictEqual(root?.after, null);
    assert.strictEqual(
      artifacts.scheduleProjectionFacts.before.rootProjections[0]?.runs.length,
      1,
    );
    assert.throws(
      () =>
        buildSemanticDiffPresentationArtifactsFromComparison({
          result: artifacts.result,
          scheduleProjectionFacts: artifacts.scheduleProjectionFacts,
        }),
      /Changed schedule-impact effects require a change reference/,
    );
  });

  test("fails closed when a changed-time root-scope effect has no matching row", () => {
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([
        rootJobnet("/root/changed-transition", {
          sd: "2026/04/10",
          st: "09:00",
        }),
      ]),
      after: document([
        rootJobnet(
          "/root/changed-transition",
          { sd: "2026/04/10", st: "10:00" },
          { isRootJobnet: false },
        ),
      ]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(
      artifacts.result.scheduleComparison?.runChanges[0]?.kind,
      "changed-time",
    );
    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    assert.throws(
      () =>
        buildSemanticDiffPresentationArtifactsFromComparison({
          result: artifacts.result,
          scheduleProjectionFacts: artifacts.scheduleProjectionFacts,
        }),
      /Changed schedule-impact effects require a change reference/,
    );
  });

  test("keeps explicit no-runs distinct from an uncalculated root", () => {
    const noRuns = compareSemanticDiffWithArtifacts({
      before: document([]),
      after: document([
        rootJobnet("/root/no-runs", { sd: "2026/06/01", st: "09:00" }),
      ]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });
    const missingContext = compareSemanticDiffWithArtifacts({
      before: document([]),
      after: document([rootJobnet("/root/missing", { sd: "2026/04/01" })]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(noRuns.scheduleProjectionFacts.kind, "evaluated");
    assert.strictEqual(
      missingContext.scheduleProjectionFacts.kind,
      "evaluated",
    );
    if (
      noRuns.scheduleProjectionFacts.kind !== "evaluated" ||
      missingContext.scheduleProjectionFacts.kind !== "evaluated"
    ) {
      return;
    }
    assert.strictEqual(
      noRuns.scheduleProjectionFacts.after.rootProjections[0]?.outcome,
      "valid-no-runs",
    );
    assert.strictEqual(
      missingContext.scheduleProjectionFacts.after.rootProjections[0]?.outcome,
      "uncalculated",
    );
    assert.strictEqual(
      missingContext.scheduleProjectionFacts.after.issues[0]?.kind,
      "uncalculated",
    );
  });

  test("keeps nested schedule issues under their closed root", () => {
    const nested = unit({
      id: "/root/main/nested",
      name: "nested",
      unitType: "rn",
      absolutePath: "/root/main/nested",
      parentId: "/root/main",
      parameters: parameters({ ty: "rn", cy: "48" }),
    });
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([
        rootJobnet(
          "/root/main",
          { sd: "2026/04/01", st: "09:00" },
          {
            children: [nested],
          },
        ),
      ]),
      after: document([
        rootJobnet(
          "/root/main",
          { sd: "2026/04/01", st: "09:00" },
          {
            children: [nested],
          },
        ),
      ]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    const root = artifacts.scheduleProjectionFacts.after.rootProjections[0]!;
    const issue = artifacts.scheduleProjectionFacts.after.issues.find(
      (candidate) => candidate.targetPath === "/root/main/nested",
    );
    assert.ok(issue);
    assert.strictEqual(
      issue?.rootId,
      artifacts.scheduleProjectionFacts.after.statuses[0]?.rootId,
    );
    assert.ok(root.issueIds.includes(issue!.id));
    assert.strictEqual(issue?.targetKind, "jobnet");
  });

  test("preserves structured detail for duplicate unsupported decisions", () => {
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([
        rootJobnet("/root/main", {
          sd: "2026/04/01",
          st: "09:00",
          cy: ["2", "3"],
        }),
      ]),
      after: document([
        rootJobnet("/root/main", {
          sd: "2026/04/01",
          st: "09:00",
          cy: ["2", "3"],
        }),
      ]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    const issues = artifacts.scheduleProjectionFacts.after.issues.filter(
      (issue) =>
        issue.targetPath === "/root/main" && issue.parameterKey === "cy",
    );
    assert.strictEqual(issues.length, 2);
    assert.deepStrictEqual(
      issues.map((issue) => issue.detail.rawValues),
      [["2"], ["3"]],
    );
    assert.notDeepStrictEqual(
      issues[0]?.detail.rawValues,
      issues[1]?.detail.rawValues,
    );
  });

  test("keeps real duplicate and nested schedule runs source-local", () => {
    const nested = (
      path: string,
      name: string,
      schedule: Record<string, string | string[]>,
    ): AjsUnit =>
      unit({
        id: path,
        name,
        unitType: "rn",
        absolutePath: path,
        depth: 2,
        parentId: "/root/main",
        hasSchedule: true,
        parameters: parameters({ ty: "rn", ...schedule }),
      });
    const beforeNestedA = nested("/root/main/a", "a", {
      sd: ["2026/04/10", "2026/04/10"],
      st: ["09:00", "09:00"],
    });
    const afterNestedA = nested("/root/main/a", "a", {
      sd: "2026/04/10",
      st: "10:00",
    });
    const beforeNestedB = nested("/root/main/b", "b", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const afterNestedB = nested("/root/main/b", "b", {
      sd: "2026/04/10",
      st: "09:00",
    });
    const artifacts = compareSemanticDiffWithArtifacts({
      before: document([
        rootJobnet(
          "/root/main",
          {
            sd: "2026/04/10",
            st: "08:00",
          },
          { children: [beforeNestedA, beforeNestedB] },
        ),
      ]),
      after: document([
        rootJobnet(
          "/root/main",
          {
            sd: "2026/04/10",
            st: "08:00",
          },
          { children: [afterNestedA, afterNestedB] },
        ),
      ]),
      options: {
        scheduleComparisonPeriod: { from: "2026-04-01", to: "2026-05-01" },
      },
    });

    assert.strictEqual(artifacts.scheduleProjectionFacts.kind, "evaluated");
    if (artifacts.scheduleProjectionFacts.kind !== "evaluated") return;
    const changes = artifacts.result.scheduleComparison?.runChanges ?? [];
    assert.deepStrictEqual(
      changes.map((change) => [
        change.kind,
        change.unitPath,
        change.before?.time ?? "",
        change.after?.time ?? "",
      ]),
      [
        ["changed-time", "/root/main/a", "09:00", "10:00"],
        ["removed", "/root/main/a", "09:00", ""],
      ],
    );
    const presentation = buildSemanticDiffPresentationArtifactsFromComparison({
      result: artifacts.result,
      scheduleProjectionFacts: artifacts.scheduleProjectionFacts,
    });
    assert.strictEqual(presentation.scheduleImpact.kind, "available");
    if (presentation.scheduleImpact.kind !== "available") return;
    assert.deepStrictEqual(
      presentation.scheduleImpact.sidecar.timelineItems.map((item) => [
        item.state,
        item.before?.unitPath ?? item.after?.unitPath,
        item.sourceChangeRef?.id,
      ]),
      [
        ["unchanged", "/root/main", undefined],
        [
          "changed-time",
          "/root/main/a",
          "schedule:changed-time:/root/main/a:2026-04-10",
        ],
        [
          "removed",
          "/root/main/a",
          "schedule:removed:/root/main/a:2026-04-10:09:00",
        ],
        ["unchanged", "/root/main/b", undefined],
      ],
    );
  });
});
