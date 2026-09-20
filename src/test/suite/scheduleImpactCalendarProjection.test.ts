import * as assert from "assert";
import type {
  SemanticDiffScheduleImpact,
  SemanticDiffScheduleImpactIssue,
  SemanticDiffScheduleImpactRoot,
} from "../../application/semantic-diff/semanticDiffScheduleImpact";
import {
  buildScheduleImpactCalendarModel,
  getScheduleImpactCalendarRootOutcomes,
} from "../../presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel";

const root = (
  id: string,
  outcome: "supported-runs" | "valid-no-runs" | "partial" | "uncalculated",
): SemanticDiffScheduleImpactRoot => ({
  id,
  matchKind: "exact",
  canonicalPath: `/root/${id}`,
  identityDecisionId: null,
  before: {
    side: "before",
    unitId: `${id}-before`,
    unitPath: `/root/${id}`,
    unitName: id,
    outcome,
    runs: [],
    issueIds: [],
  },
  after: null,
  scopeTransition: null,
});

const sidecar = (): SemanticDiffScheduleImpact => {
  const first = root("a", "supported-runs");
  const second = root("b", "valid-no-runs");
  return {
    period: { from: "2026-01-01", to: "2026-01-04" },
    roots: [first, second],
    candidateGroups: [],
    timelineItems: [
      {
        id: "second",
        state: "added",
        side: "after",
        rootId: second.id,
        date: "2026-01-02",
        time: "09:00",
        rule: 1,
        occurrenceOrdinal: 0,
        before: null,
        after: {
          id: "run-2",
          unitId: "b-after",
          unitPath: "/root/b",
          unitName: "b",
          rule: 1,
          date: "2026-01-02",
          time: "09:00",
          side: "after",
          occurrenceOrdinal: 0,
          sourceChangeRef: null,
        },
        sourceChangeRef: null,
      },
      {
        id: "first",
        state: "unchanged",
        side: "pair",
        rootId: first.id,
        date: "2026-01-01",
        time: "08:00",
        rule: 1,
        occurrenceOrdinal: 0,
        before: null,
        after: null,
        sourceChangeRef: null,
      },
    ],
    issues: [issue("issue-a", first.id), issue("issue-b", second.id)],
  };
};

const issue = (
  id: string,
  rootId: string,
): SemanticDiffScheduleImpactIssue => ({
  id,
  occurrenceOrdinal: 0,
  kind: "uncalculated",
  side: "after",
  rootId,
  reasonCode: "runtime-state-not-verified",
  targetKind: "attribute",
  targetId: `${id}-target`,
  targetPath: `/root/${rootId}/job`,
  parameterKey: "schedule",
  detail: {
    unitPath: `/root/${rootId}/job`,
    parameterKey: "schedule",
    relationPair: null,
    scheduleRule: 1,
    period: { from: "2026-01-01", to: "2026-01-04" },
    beforeValues: [],
    afterValues: [],
    rawValues: [],
    removedSources: [],
  },
});

suite("Schedule impact calendar projection", () => {
  test("orders timeline entries without changing source facts", () => {
    const impact = sidecar();
    const model = buildScheduleImpactCalendarModel(impact);
    assert.deepStrictEqual(
      model.allItems.map((entry) => entry.item.id),
      ["first", "second"],
    );
    assert.strictEqual(model.globalCount, 2);
    assert.strictEqual(model.visibleCount, 2);
    assert.strictEqual(impact.timelineItems[0]?.id, "second");
    assert.match(
      model.allItems[0]?.accessibleLabel ?? "",
      /date=2026-01-01.*path=\/root\/a.*side=pair.*occurrence=0.*state=unchanged/,
    );
    assert.doesNotMatch(
      model.allItems[0]?.accessibleLabel ?? "",
      /\b(?:id|rootId|unitId|sourceChangeRef)=/,
    );
  });

  test("applies root, outcome, and run-state filters conjunctively", () => {
    const impact = sidecar();
    const model = buildScheduleImpactCalendarModel(impact, {
      rootIds: ["a", "b"],
      outcomes: ["valid-no-runs"],
      runStates: ["added"],
    });
    assert.deepStrictEqual(
      model.visibleItems.map((entry) => entry.item.id),
      ["second"],
    );
    assert.strictEqual(model.globalCount, 2);
    assert.strictEqual(model.visibleCount, 1);
    assert.deepStrictEqual(
      model.visibleRoots.map((root) => root.id),
      ["b"],
    );
    assert.deepStrictEqual(
      model.visibleIssues.map((entry) => entry.id),
      ["issue-b"],
    );
    assert.strictEqual(model.issues.length, 2);
  });

  test("retains both side outcomes for a paired root", () => {
    const paired = root("paired", "supported-runs");
    const withAfter = {
      ...paired,
      after: {
        ...paired.before!,
        outcome: "valid-no-runs" as const,
        side: "after" as const,
      },
    };
    assert.deepStrictEqual(getScheduleImpactCalendarRootOutcomes(withAfter), [
      "supported-runs",
      "valid-no-runs",
    ]);
  });

  test("keeps duplicate user names distinguishable without internal IDs", () => {
    const impact = sidecar();
    const duplicate = {
      ...impact.timelineItems[0]!,
      id: "duplicate-internal-key",
      date: "2026-01-03",
      time: "11:00",
      before: {
        id: "duplicate-run-key",
        unitId: "duplicate-unit-key",
        unitPath: "/root/a/job",
        unitName: "same-name",
        rule: 1,
        date: "2026-01-03",
        time: "11:00",
        side: "before" as const,
        occurrenceOrdinal: 3,
        sourceChangeRef: { id: "duplicate-change-key", occurrenceOrdinal: 3 },
      },
    };
    const model = buildScheduleImpactCalendarModel({
      ...impact,
      timelineItems: [
        {
          ...impact.timelineItems[0]!,
          before: duplicate.before,
          date: "2026-01-02",
          time: "10:00",
          occurrenceOrdinal: 2,
        },
        duplicate,
      ],
    });
    const labels = model.visibleItems.map((entry) => entry.accessibleLabel);
    assert.strictEqual(labels.length, 2);
    assert.notStrictEqual(labels[0], labels[1]);
    labels.forEach((label) =>
      assert.doesNotMatch(
        label,
        /duplicate-internal-key|duplicate-run-key|duplicate-change-key/,
      ),
    );
  });
});
