import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type { SemanticDiffScheduleEvaluation } from "../../domain/services/semantic-diff/semanticDiffScheduleRules";
import type {
  SemanticDiffScheduleRun,
  SemanticDiffSide,
} from "./semanticDiffDto";
import type { SemanticDiffScheduleImpactRun } from "./semanticDiffScheduleImpactDto";
import {
  compareInOrder,
  compareNumbers,
  compareOrdinal,
  encodeSemanticDiffScheduleImpactId,
  type SourceKeyForRun,
  type SourceKeyRootContext,
} from "./semanticDiffScheduleImpactIdentity";

type IndexedRun = SemanticDiffScheduleRun & {
  unitId?: string;
  occurrenceOrdinal: number;
  sourceKey: string;
};

export type ScheduleRunFact = Readonly<
  SemanticDiffScheduleRun & { unitId?: string }
>;
type ScheduleRun = ScheduleRunFact;
type EvaluatedSchedule = Extract<
  SemanticDiffScheduleEvaluation,
  { kind: "evaluated" }
>;

type IndexedRunsInput = {
  root: SourceKeyRootContext;
  side: SemanticDiffSide;
  runs: readonly ScheduleRun[];
  sourceKeyForRun: SourceKeyForRun;
};

const indexedRuns = (input: IndexedRunsInput): IndexedRun[] => {
  const grouped = new Map<string, ScheduleRun[]>();
  [...input.runs]
    .sort((left, right) =>
      compareInOrder([
        () => compareOrdinal(left.date, right.date),
        () => compareNumbers(left.rule, right.rule),
        () => compareOrdinal(left.time, right.time),
        () => compareOrdinal(left.unitPath, right.unitPath),
        () => compareOrdinal(left.unitName, right.unitName),
      ]),
    )
    .forEach((run) => {
      const key = encodeSemanticDiffScheduleImpactId(
        input.sourceKeyForRun(input.root, input.side, {
          unitId: run.unitId,
          unitPath: run.unitPath,
        }),
        run.date,
        run.rule,
      );
      grouped.set(key, [...(grouped.get(key) ?? []), run]);
    });
  return [...grouped.entries()]
    .sort(([left], [right]) => compareOrdinal(left, right))
    .flatMap(([sourceKey, values]) =>
      values.map((run, occurrenceOrdinal) => ({
        ...run,
        occurrenceOrdinal,
        sourceKey,
      })),
    );
};

const runWithId = (input: {
  run: IndexedRun;
  side: SemanticDiffSide;
  rootId: string;
  unitId: string;
  sourceChangeRef: Readonly<{ id: string; occurrenceOrdinal: number }> | null;
}): SemanticDiffScheduleImpactRun => ({
  id: encodeSemanticDiffScheduleImpactId(
    "run",
    input.side,
    input.rootId,
    input.run.sourceKey,
    input.run.date,
    input.run.time,
    input.run.rule,
    input.run.occurrenceOrdinal,
  ),
  side: input.side,
  unitId: input.unitId,
  unitPath: input.run.unitPath,
  unitName: input.run.unitName,
  rule: input.run.rule,
  date: input.run.date,
  time: input.run.time,
  occurrenceOrdinal: input.run.occurrenceOrdinal,
  sourceChangeRef: input.sourceChangeRef,
});

type ScheduleRunsBySide = { before: ScheduleRun[]; after: ScheduleRun[] };
type ScheduleRunDecision = EvaluatedSchedule["runDecisions"][number];

const pairedRunPaths = (
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>,
): ReadonlySet<string> => {
  const paths = new Set<string>();
  evaluation.pairEvaluations.forEach((pair) => {
    paths.add(pair.before.unit.absolutePath);
    paths.add(pair.after.unit.absolutePath);
  });
  return paths;
};

const appendPairRuns = (
  runs: ScheduleRunsBySide,
  evaluation: EvaluatedSchedule,
): void => {
  evaluation.pairEvaluations.forEach((pair) => {
    runs.before.push(
      ...pair.before.runs.map((run) => ({
        ...run,
        unitId: pair.before.unit.id,
      })),
    );
    runs.after.push(
      ...pair.after.runs.map((run) => ({ ...run, unitId: pair.after.unit.id })),
    );
  });
};

const isUnpairedRunDecision = (
  decision: ScheduleRunDecision,
  pairedPaths: ReadonlySet<string>,
): boolean => {
  const decisionPaths = new Map<
    string,
    (decision: ScheduleRunDecision) => string
  >([
    [
      "removed",
      (candidate) =>
        (candidate as Extract<ScheduleRunDecision, { kind: "removed" }>).before
          .unitPath,
    ],
    [
      "added",
      (candidate) =>
        (candidate as Extract<ScheduleRunDecision, { kind: "added" }>).after
          .unitPath,
    ],
  ]);
  const path = decisionPaths.get(decision.kind)?.(decision);
  return [path !== undefined, !pairedPaths.has(path ?? "")].every(Boolean);
};

type UnpairedRunDecisionInput = {
  runs: ScheduleRunsBySide;
  decision: ScheduleRunDecision;
  sourceUnitsByPath: {
    before: ReadonlyMap<string, AjsUnit>;
    after: ReadonlyMap<string, AjsUnit>;
  };
  pairedPaths: ReadonlySet<string>;
};

const appendRemovedRun = (input: UnpairedRunDecisionInput): void => {
  const decision = input.decision as Extract<
    ScheduleRunDecision,
    { kind: "removed" }
  >;
  input.runs.before.push({
    ...decision.before,
    unitId: input.sourceUnitsByPath.before.get(decision.before.unitPath)?.id,
  });
};

const appendAddedRun = (input: UnpairedRunDecisionInput): void => {
  const decision = input.decision as Extract<
    ScheduleRunDecision,
    { kind: "added" }
  >;
  input.runs.after.push({
    ...decision.after,
    unitId: input.sourceUnitsByPath.after.get(decision.after.unitPath)?.id,
  });
};

const unpairedRunAppenders: ReadonlyMap<
  string,
  (input: UnpairedRunDecisionInput) => void
> = new Map([
  ["removed", appendRemovedRun],
  ["added", appendAddedRun],
]);

const appendUnpairedRunDecision = (input: UnpairedRunDecisionInput): void => {
  if (!isUnpairedRunDecision(input.decision, input.pairedPaths)) return;
  unpairedRunAppenders.get(input.decision.kind)?.(input);
};

const scheduleRunsBySide = (
  evaluation: EvaluatedSchedule,
  sourceUnitsByPath: {
    before: ReadonlyMap<string, AjsUnit>;
    after: ReadonlyMap<string, AjsUnit>;
  },
): ScheduleRunsBySide => {
  const runs: ScheduleRunsBySide = { before: [], after: [] };
  appendPairRuns(runs, evaluation);
  const pairedPaths = pairedRunPaths(evaluation);
  evaluation.runDecisions.forEach((decision) =>
    appendUnpairedRunDecision({
      runs,
      decision,
      sourceUnitsByPath,
      pairedPaths,
    }),
  );
  return runs;
};

const noRunsBySide = (
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>,
): { before: Set<string>; after: Set<string> } => {
  const noRuns = {
    before: new Set<string>(),
    after: new Set<string>(),
  };
  evaluation.zeroRunCandidatesBySide.before.forEach((unit) =>
    noRuns.before.add(unit.id),
  );
  evaluation.zeroRunCandidatesBySide.after.forEach((unit) =>
    noRuns.after.add(unit.id),
  );
  return noRuns;
};

export type CollectScheduleRunFactsInput = Readonly<{
  evaluation: EvaluatedSchedule;
  sourceUnitsByPath: Readonly<{
    before: ReadonlyMap<string, AjsUnit>;
    after: ReadonlyMap<string, AjsUnit>;
  }>;
}>;

export type CollectedScheduleRunFacts = Readonly<{
  runs: Readonly<{
    before: readonly ScheduleRunFact[];
    after: readonly ScheduleRunFact[];
  }>;
  noRuns: Readonly<{
    before: ReadonlySet<string>;
    after: ReadonlySet<string>;
  }>;
}>;

export const collectScheduleRunFacts = (
  input: CollectScheduleRunFactsInput,
): CollectedScheduleRunFacts => ({
  runs: scheduleRunsBySide(input.evaluation, input.sourceUnitsByPath),
  noRuns: noRunsBySide(input.evaluation),
});

export type ProjectScheduleImpactRunsInput = Readonly<{
  root: SourceKeyRootContext;
  side: SemanticDiffSide;
  runs: readonly ScheduleRunFact[];
  unitsByPath: ReadonlyMap<string, AjsUnit>;
  rootUnit: AjsUnit;
  sourceKeyForRun: SourceKeyForRun;
}>;

export type ProjectedScheduleImpactRuns = readonly SemanticDiffScheduleImpactRun[];

export const projectScheduleImpactRuns = (
  input: ProjectScheduleImpactRunsInput,
): ProjectedScheduleImpactRuns =>
  indexedRuns(input).map((run) =>
    runWithId({
      run,
      side: input.side,
      rootId: input.root.id,
      unitId:
        run.unitId ??
        input.unitsByPath.get(run.unitPath)?.id ??
        input.rootUnit.id,
      sourceChangeRef: null,
    }),
  );
