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
  left < right ? -1 : left > right ? 1 : 0;

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

const addRuns = (
  groups: Map<string, RunGroup>,
  runs: SemanticDiffScheduleRun[],
  side: "before" | "after",
): void => {
  for (const run of runs) {
    const key = groupKey(run);
    const existing = groups.get(key);
    if (existing) {
      existing[side].push(run);
      continue;
    }
    groups.set(key, {
      sourceUnitPath: run.unitPath,
      date: run.date,
      rule: run.rule,
      before: side === "before" ? [run] : [],
      after: side === "after" ? [run] : [],
    });
  }
};

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

const compareDecisions = (
  left: IndexedDecision,
  right: IndexedDecision,
): number =>
  (left.decision.kind === "added"
    ? 0
    : left.decision.kind === "changed-time"
      ? 1
      : 2) -
    (right.decision.kind === "added"
      ? 0
      : right.decision.kind === "changed-time"
        ? 1
        : 2) ||
  compareStrings(left.sourceUnitPath, right.sourceUnitPath) ||
  compareStrings(left.date, right.date) ||
  left.rule - right.rule ||
  compareStrings(left.decision.kind, right.decision.kind) ||
  compareStrings(left.beforeTime, right.beforeTime) ||
  compareStrings(left.afterTime, right.afterTime) ||
  left.occurrenceOrdinal - right.occurrenceOrdinal;

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

export const compareScheduleRuns = (
  beforeRuns: SemanticDiffScheduleRun[],
  afterRuns: SemanticDiffScheduleRun[],
  canonicalPathByPath: ReadonlyMap<string, string> = new Map(),
): SemanticDiffScheduleRunDecision[] => {
  const canonicalBefore = beforeRuns.map((run) => {
    const unitPath = canonicalPathByPath.get(run.unitPath) ?? run.unitPath;
    return unitPath === run.unitPath ? run : { ...run, unitPath };
  });

  const indexed: IndexedDecision[] = [];
  for (const group of sortedGroups(canonicalBefore, afterRuns)) {
    const pairCount = Math.min(group.before.length, group.after.length);
    for (
      let occurrenceOrdinal = 0;
      occurrenceOrdinal < pairCount;
      occurrenceOrdinal += 1
    ) {
      const before = group.before[occurrenceOrdinal];
      const after = group.after[occurrenceOrdinal];
      if (before.time === after.time) {
        continue;
      }
      indexed.push({
        decision: {
          kind: "changed-time",
          unitPath: group.sourceUnitPath,
          date: group.date,
          before,
          after,
        },
        sourceUnitPath: group.sourceUnitPath,
        date: group.date,
        rule: group.rule,
        beforeTime: before.time,
        afterTime: after.time,
        occurrenceOrdinal,
      });
    }

    for (
      let occurrenceOrdinal = pairCount;
      occurrenceOrdinal < group.before.length;
      occurrenceOrdinal += 1
    ) {
      const before = group.before[occurrenceOrdinal];
      indexed.push({
        decision: {
          kind: "removed",
          unitPath: group.sourceUnitPath,
          date: group.date,
          before,
        },
        sourceUnitPath: group.sourceUnitPath,
        date: group.date,
        rule: group.rule,
        beforeTime: before.time,
        afterTime: "",
        occurrenceOrdinal,
      });
    }

    for (
      let occurrenceOrdinal = pairCount;
      occurrenceOrdinal < group.after.length;
      occurrenceOrdinal += 1
    ) {
      const after = group.after[occurrenceOrdinal];
      indexed.push({
        decision: {
          kind: "added",
          unitPath: group.sourceUnitPath,
          date: group.date,
          after,
        },
        sourceUnitPath: group.sourceUnitPath,
        date: group.date,
        rule: group.rule,
        beforeTime: "",
        afterTime: after.time,
        occurrenceOrdinal,
      });
    }
  }

  return indexed.sort(compareDecisions).map(({ decision }) => decision);
};
