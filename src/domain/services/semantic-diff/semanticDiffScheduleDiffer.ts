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
  left.localeCompare(right);
const runDateKey = (run: SemanticDiffScheduleRun): string =>
  `${run.unitPath}:${run.date}`;
const runTimestampKey = (run: SemanticDiffScheduleRun): string =>
  `${run.unitPath}:${run.date}:${run.time}`;
const decisionKey = (decision: SemanticDiffScheduleRunDecision): string => {
  if (decision.kind === "changed-time") {
    return `schedule:changed-time:${decision.unitPath}:${decision.date}`;
  }
  const run = decision.kind === "removed" ? decision.before : decision.after;
  return `schedule:${decision.kind}:${runTimestampKey(run)}`;
};

const groupByDate = (
  runs: SemanticDiffScheduleRun[],
): Map<string, SemanticDiffScheduleRun[]> => {
  const grouped = new Map<string, SemanticDiffScheduleRun[]>();
  runs.forEach((run) => {
    grouped.set(runDateKey(run), [
      ...(grouped.get(runDateKey(run)) ?? []),
      run,
    ]);
  });
  return grouped;
};

/** Compare two already projected run sets; no schedule interpretation occurs here. */
export const compareScheduleRuns = (
  beforeRuns: SemanticDiffScheduleRun[],
  afterRuns: SemanticDiffScheduleRun[],
  canonicalPathByPath: ReadonlyMap<string, string> = new Map(),
): SemanticDiffScheduleRunDecision[] => {
  const canonicalBeforeRuns = beforeRuns.map((run) => ({
    ...run,
    unitPath: canonicalPathByPath.get(run.unitPath) ?? run.unitPath,
  }));
  const beforeByDate = groupByDate(canonicalBeforeRuns);
  const afterByDate = groupByDate(afterRuns);
  return [...new Set([...beforeByDate.keys(), ...afterByDate.keys()])]
    .sort(compareStrings)
    .flatMap((dateKey): SemanticDiffScheduleRunDecision[] => {
      const before = beforeByDate.get(dateKey) ?? [];
      const after = afterByDate.get(dateKey) ?? [];
      if (
        before.length === 1 &&
        after.length === 1 &&
        before[0].time !== after[0].time
      ) {
        return [
          {
            kind: "changed-time",
            unitPath: after[0].unitPath,
            date: after[0].date,
            before: before[0],
            after: after[0],
          },
        ];
      }
      const beforeTimestamps = new Set(before.map(runTimestampKey));
      const afterTimestamps = new Set(after.map(runTimestampKey));
      return [
        ...before
          .filter((run) => !afterTimestamps.has(runTimestampKey(run)))
          .map((run) => ({
            kind: "removed" as const,
            unitPath: run.unitPath,
            date: run.date,
            before: run,
          })),
        ...after
          .filter((run) => !beforeTimestamps.has(runTimestampKey(run)))
          .map((run) => ({
            kind: "added" as const,
            unitPath: run.unitPath,
            date: run.date,
            after: run,
          })),
      ];
    })
    .sort((left, right) =>
      compareStrings(decisionKey(left), decisionKey(right)),
    );
};
