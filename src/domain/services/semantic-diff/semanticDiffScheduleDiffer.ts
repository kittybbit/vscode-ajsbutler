import type { SemanticDiffScheduleRun } from "../../models/semantic-diff/SemanticDiff";

export type SemanticDiffScheduleRunDecision =
  | {
      kind: "changed-time";
      unitPath: string;
      date: string;
      before: SemanticDiffScheduleRun;
      after: SemanticDiffScheduleRun;
    }
  | {
      kind: "removed";
      unitPath: string;
      date: string;
      before: SemanticDiffScheduleRun;
    }
  | {
      kind: "added";
      unitPath: string;
      date: string;
      after: SemanticDiffScheduleRun;
    };

const compareStrings = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

type RunGroup = {
  sourceUnitPath: string;
  date: string;
  rule: number;
  before: SemanticDiffScheduleRun[];
  after: SemanticDiffScheduleRun[];
};

type IndexedDecision = {
  decision: SemanticDiffScheduleRunDecision;
  sourceUnitPath: string;
  date: string;
  rule: number;
  beforeTime: string;
  afterTime: string;
  occurrenceOrdinal: number;
};

const groupKey = (run: SemanticDiffScheduleRun): string =>
  JSON.stringify([run.unitPath, run.date, run.rule]);

const createRunGroup = (
  run: SemanticDiffScheduleRun,
  side: "before" | "after",
): RunGroup => ({
  sourceUnitPath: run.unitPath,
  date: run.date,
  rule: run.rule,
  before: side === "before" ? [run] : [],
  after: side === "after" ? [run] : [],
});

const appendRunToGroup = (
  group: RunGroup,
  run: SemanticDiffScheduleRun,
  side: "before" | "after",
): void => {
  group[side].push(run);
};

const addRun = (
  groups: Map<string, RunGroup>,
  run: SemanticDiffScheduleRun,
  side: "before" | "after",
): void => {
  const key = groupKey(run);
  const existing = groups.get(key);
  if (existing) {
    appendRunToGroup(existing, run, side);
    return;
  }
  groups.set(key, createRunGroup(run, side));
};

const addRuns = (
  groups: Map<string, RunGroup>,
  runs: SemanticDiffScheduleRun[],
  side: "before" | "after",
): void => runs.forEach((run) => addRun(groups, run, side));

const compareRuns = (
  left: SemanticDiffScheduleRun,
  right: SemanticDiffScheduleRun,
): number =>
  compareStrings(left.time, right.time) ||
  compareStrings(left.unitPath, right.unitPath) ||
  compareStrings(left.unitName, right.unitName);

const compareGroups = (left: RunGroup, right: RunGroup): number =>
  compareStrings(left.sourceUnitPath, right.sourceUnitPath) ||
  compareStrings(left.date, right.date) ||
  left.rule - right.rule;

const decisionKindOrder: Record<
  SemanticDiffScheduleRunDecision["kind"],
  number
> = {
  added: 0,
  "changed-time": 1,
  removed: 2,
};

const compareDecisionIdentity = (
  left: IndexedDecision,
  right: IndexedDecision,
): number =>
  compareStrings(left.sourceUnitPath, right.sourceUnitPath) ||
  compareStrings(left.date, right.date) ||
  left.rule - right.rule;

const compareDecisionValues = (
  left: IndexedDecision,
  right: IndexedDecision,
): number =>
  compareStrings(left.decision.kind, right.decision.kind) ||
  compareStrings(left.beforeTime, right.beforeTime) ||
  compareStrings(left.afterTime, right.afterTime) ||
  left.occurrenceOrdinal - right.occurrenceOrdinal;

const compareDecisions = (
  left: IndexedDecision,
  right: IndexedDecision,
): number => {
  const kindComparison =
    decisionKindOrder[left.decision.kind] -
    decisionKindOrder[right.decision.kind];
  if (kindComparison !== 0) {
    return kindComparison;
  }
  return (
    compareDecisionIdentity(left, right) || compareDecisionValues(left, right)
  );
};

const sortedGroups = (
  beforeRuns: SemanticDiffScheduleRun[],
  afterRuns: SemanticDiffScheduleRun[],
): RunGroup[] => {
  const groups = new Map<string, RunGroup>();
  addRuns(groups, beforeRuns, "before");
  addRuns(groups, afterRuns, "after");
  return [...groups.values()]
    .map((group) => ({
      ...group,
      before: [...group.before].sort(compareRuns),
      after: [...group.after].sort(compareRuns),
    }))
    .sort(compareGroups);
};

const canonicalizeRuns = (
  runs: SemanticDiffScheduleRun[],
  canonicalPathByPath: ReadonlyMap<string, string>,
): SemanticDiffScheduleRun[] =>
  runs.map((run) => {
    const unitPath = canonicalPathByPath.get(run.unitPath) ?? run.unitPath;
    return unitPath === run.unitPath ? run : { ...run, unitPath };
  });

const createIndexedDecision = (input: {
  decision: SemanticDiffScheduleRunDecision;
  group: RunGroup;
  beforeTime: string;
  afterTime: string;
  occurrenceOrdinal: number;
}): IndexedDecision => ({
  decision: input.decision,
  sourceUnitPath: input.group.sourceUnitPath,
  date: input.group.date,
  rule: input.group.rule,
  beforeTime: input.beforeTime,
  afterTime: input.afterTime,
  occurrenceOrdinal: input.occurrenceOrdinal,
});

const changedTimeDecision = (input: {
  group: RunGroup;
  before: SemanticDiffScheduleRun;
  after: SemanticDiffScheduleRun;
  occurrenceOrdinal: number;
}): IndexedDecision | undefined => {
  if (input.before.time === input.after.time) {
    return undefined;
  }
  return createIndexedDecision({
    decision: {
      kind: "changed-time",
      unitPath: input.group.sourceUnitPath,
      date: input.group.date,
      before: input.before,
      after: input.after,
    },
    group: input.group,
    beforeTime: input.before.time,
    afterTime: input.after.time,
    occurrenceOrdinal: input.occurrenceOrdinal,
  });
};

const changedTimeDecisions = (
  group: RunGroup,
  pairCount: number,
): IndexedDecision[] =>
  group.before.slice(0, pairCount).flatMap((before, occurrenceOrdinal) => {
    const after = group.after[occurrenceOrdinal];
    return after
      ? [
          changedTimeDecision({
            group,
            before,
            after,
            occurrenceOrdinal,
          }),
        ].filter(
          (decision): decision is IndexedDecision => decision !== undefined,
        )
      : [];
  });

const removedDecisions = (
  group: RunGroup,
  pairCount: number,
): IndexedDecision[] =>
  group.before.slice(pairCount).map((before, index) =>
    createIndexedDecision({
      decision: {
        kind: "removed",
        unitPath: group.sourceUnitPath,
        date: group.date,
        before,
      },
      group,
      beforeTime: before.time,
      afterTime: "",
      occurrenceOrdinal: pairCount + index,
    }),
  );

const addedDecisions = (
  group: RunGroup,
  pairCount: number,
): IndexedDecision[] =>
  group.after.slice(pairCount).map((after, index) =>
    createIndexedDecision({
      decision: {
        kind: "added",
        unitPath: group.sourceUnitPath,
        date: group.date,
        after,
      },
      group,
      beforeTime: "",
      afterTime: after.time,
      occurrenceOrdinal: pairCount + index,
    }),
  );

const decisionsForGroup = (group: RunGroup): IndexedDecision[] => {
  const pairCount = Math.min(group.before.length, group.after.length);
  return [
    ...changedTimeDecisions(group, pairCount),
    ...removedDecisions(group, pairCount),
    ...addedDecisions(group, pairCount),
  ];
};

const decisionsForGroups = (groups: RunGroup[]): IndexedDecision[] =>
  groups.flatMap(decisionsForGroup);

export const compareScheduleRuns = (
  beforeRuns: SemanticDiffScheduleRun[],
  afterRuns: SemanticDiffScheduleRun[],
  canonicalPathByPath: ReadonlyMap<string, string> = new Map(),
): SemanticDiffScheduleRunDecision[] =>
  decisionsForGroups(
    sortedGroups(canonicalizeRuns(beforeRuns, canonicalPathByPath), afterRuns),
  )
    .sort(compareDecisions)
    .map(({ decision }) => decision);
