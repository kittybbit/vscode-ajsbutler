import {
  buildInvalidScheduleIssues,
  buildScheduleIssues,
  findScheduleIssueRoot,
  remapScheduleIssues,
  type BuildScheduleIssuesInput,
} from "./semanticDiffScheduleIssueProjection";
export {
  cloneDetail,
  compareIssues,
} from "./semanticDiffScheduleIssueProjection";
import {
  collectScheduleRunFacts,
  projectScheduleImpactRuns,
  type ScheduleRunFact,
} from "./semanticDiffScheduleRunProjection";
import {
  collectAjsUnitOccurrences,
  createAjsDocumentIndex,
} from "../../domain/models/ajs/AjsDocumentIndex";
import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffIdentityDecision,
  SemanticDiffResult,
  SemanticDiffScheduleRun,
  SemanticDiffSide,
} from "./semanticDiffDto";
import type { SemanticDiffScheduleEvaluation } from "../../domain/services/semantic-diff/semanticDiffScheduleRules";
import type {
  ScheduleProjectionFacts,
  SemanticDiffScheduleImpactCandidateGroup,
  SemanticDiffScheduleImpactIssue,
  SemanticDiffScheduleImpactRoot,
  SemanticDiffScheduleImpactRootMatchKind,
  SemanticDiffScheduleImpactRootOutcome,
  SemanticDiffScheduleImpactRootSide,
  SemanticDiffScheduleImpactRootStatus,
} from "./semanticDiffScheduleImpactDto";
import {
  candidateGroups,
  compareInOrder,
  compareOrdinal,
  confirmedIdentityStatuses,
  createSourceKeyForRun,
  encodeSemanticDiffScheduleImpactId,
  identityDecisionsByUnit,
  identityMatchKind,
  isRootJobnet,
  type CandidateReference,
  type SourceKeyForRun,
  type SourceKeyRootContext,
} from "./semanticDiffScheduleImpactIdentity";

const isFreezable = (value: unknown): value is object =>
  [value !== null, typeof value === "object", !Object.isFrozen(value)].every(
    Boolean,
  );

export const deepFreeze = <T>(value: T): T => {
  if (!isFreezable(value)) return value;
  Object.values(value as Record<string, unknown>).forEach((child) => {
    deepFreeze(child);
  });
  return Object.freeze(value);
};

const lastUnitByKey = (
  unitsByKey: ReadonlyMap<string, readonly AjsUnit[]>,
): Map<string, AjsUnit> => {
  const units = new Map<string, AjsUnit>();
  unitsByKey.forEach((matches, key) => {
    units.set(key, matches[matches.length - 1]!);
  });
  return units;
};

const isSelectedRoot = (unit: AjsUnit, jobGroupPath?: string): boolean =>
  isRootJobnet(unit) &&
  (!jobGroupPath || isWithinRoot(unit.absolutePath, jobGroupPath));

const rootUnits = (
  units: readonly AjsUnit[],
  jobGroupPath?: string,
): AjsUnit[] =>
  units
    .filter((unit) => isSelectedRoot(unit, jobGroupPath))
    .sort((left, right) =>
      compareOrdinal(left.absolutePath, right.absolutePath),
    );

const isWithinRoot = (path: string, rootPath: string): boolean =>
  [path === rootPath, path.startsWith(`${rootPath}/`)].some(Boolean);

export type BuildSemanticDiffScheduleImpactInput = Readonly<{
  result: SemanticDiffResult;
  before: AjsDocument;
  after: AjsDocument;
  scheduleEvaluation: SemanticDiffScheduleEvaluation;
}>;

type EvaluatedSchedule = Extract<
  SemanticDiffScheduleEvaluation,
  { kind: "evaluated" }
>;

const outcomesByState: ReadonlyMap<
  string,
  SemanticDiffScheduleImpactRootOutcome
> = new Map([
  ["true:true:true", "partial"],
  ["true:true:false", "partial"],
  ["true:false:true", "supported-runs"],
  ["true:false:false", "supported-runs"],
  ["false:false:true", "valid-no-runs"],
  ["false:false:false", "uncalculated"],
  ["false:true:true", "uncalculated"],
  ["false:true:false", "uncalculated"],
]);

const outcomeFor = (input: {
  runs: readonly SemanticDiffScheduleRun[];
  hasIssues: boolean;
  explicitNoRuns: boolean;
}): SemanticDiffScheduleImpactRootOutcome => {
  const hasRuns = input.runs.length > 0;
  const state = `${hasRuns}:${input.hasIssues}:${input.explicitNoRuns}`;
  return outcomesByState.get(state) ?? "uncalculated";
};

const sideRoot = (input: {
  unit: AjsUnit;
  side: SemanticDiffSide;
  rootId: string;
  rootContext: SourceKeyRootContext;
  runs: readonly ScheduleRunFact[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
  explicitNoRuns: boolean;
  unitsByPath: ReadonlyMap<string, AjsUnit>;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactRootSide => {
  const runs = projectScheduleImpactRuns({
    root: {
      id: input.rootId,
      matchKind: input.rootContext.matchKind,
      identityDecisionId: input.rootContext.identityDecisionId,
      scopeTransition: input.rootContext.scopeTransition,
    },
    side: input.side,
    runs: input.runs,
    sourceKeyForRun: input.sourceKeyForRun,
    unitsByPath: input.unitsByPath,
    rootUnit: input.unit,
  });
  const outcome = outcomeFor({
    runs: input.runs,
    hasIssues: input.issues.length > 0,
    explicitNoRuns: input.explicitNoRuns,
  });
  return {
    side: input.side,
    unitId: input.unit.id,
    unitPath: input.unit.absolutePath,
    unitName: input.unit.name,
    outcome,
    runs,
    issueIds: input.issues.map((issue) => issue.id),
  };
};

const rootIdFor = (
  side: "pair" | SemanticDiffSide,
  canonicalPath: string,
  matchKind: SemanticDiffScheduleImpactRootMatchKind,
): string =>
  encodeSemanticDiffScheduleImpactId(
    "root",
    side,
    canonicalPath,
    "",
    "",
    matchKind,
    0,
  );

type RootIssueMap = Map<string, SemanticDiffScheduleImpactIssue[]>;

type RootAssemblyContext = {
  rootRuns: {
    before: readonly ScheduleRunFact[];
    after: readonly ScheduleRunFact[];
  };
  rootIssues: {
    before: RootIssueMap;
    after: RootIssueMap;
  };
  noRuns: { before: ReadonlySet<string>; after: ReadonlySet<string> };
  unitsByPath: {
    before: ReadonlyMap<string, AjsUnit>;
    after: ReadonlyMap<string, AjsUnit>;
  };
  sourceKeyForRun: SourceKeyForRun;
};

type RootScopeTransition = SemanticDiffScheduleImpactRoot["scopeTransition"];

const isRootProjection = (unit: AjsUnit | null): unit is AjsUnit =>
  [unit]
    .filter((candidate): candidate is AjsUnit => candidate !== null)
    .some(isRootJobnet);

const runsWithinRoot = (
  runs: readonly ScheduleRunFact[],
  root: AjsUnit,
): readonly ScheduleRunFact[] =>
  runs.filter((run) => isWithinRoot(run.unitPath, root.absolutePath));

const buildRootSide = (input: {
  root: AjsUnit | null;
  side: SemanticDiffSide;
  rootId: string;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
  identityDecisionId: string | null;
  scopeTransition: RootScopeTransition;
  context: RootAssemblyContext;
}): SemanticDiffScheduleImpactRootSide | null => {
  const roots = [input.root]
    .filter((root): root is AjsUnit => root !== null)
    .filter(isRootJobnet);
  return (
    roots.map((root) =>
      sideRoot({
        unit: root,
        side: input.side,
        rootId: input.rootId,
        rootContext: {
          id: input.rootId,
          matchKind: input.matchKind,
          identityDecisionId: input.identityDecisionId,
          scopeTransition: input.scopeTransition,
        },
        runs: runsWithinRoot(input.context.rootRuns[input.side], root),
        issues:
          input.context.rootIssues[input.side].get(root.absolutePath) ?? [],
        explicitNoRuns: input.context.noRuns[input.side].has(root.id),
        unitsByPath: input.context.unitsByPath[input.side],
        sourceKeyForRun: input.context.sourceKeyForRun,
      }),
    )[0] ?? null
  );
};

type RootTransitionInput = {
  before: AjsUnit | null;
  after: AjsUnit | null;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
  identityDecisionId: string | null;
};

const isRemovedRootScope = (
  input: RootTransitionInput,
  beforeIsRoot: boolean,
  afterIsRoot: boolean,
): boolean =>
  [
    input.matchKind === "removed-root-scope",
    input.before !== null,
    input.after !== null,
    beforeIsRoot,
    !afterIsRoot,
  ].every(Boolean);

const removedRootScopeTransition = (
  input: RootTransitionInput,
  beforeIsRoot: boolean,
  afterIsRoot: boolean,
): RootScopeTransition => {
  if (!isRemovedRootScope(input, beforeIsRoot, afterIsRoot)) return null;
  const after = input.after!;
  return {
    kind: "removed-root-scope",
    counterpartPath: after.absolutePath,
    identityDecisionId: input.identityDecisionId!,
  };
};

const isAddedRootScope = (
  input: RootTransitionInput,
  beforeIsRoot: boolean,
  afterIsRoot: boolean,
): boolean =>
  [
    input.matchKind === "added-root-scope",
    input.before !== null,
    input.after !== null,
    !beforeIsRoot,
    afterIsRoot,
  ].every(Boolean);

const addedRootScopeTransition = (
  input: RootTransitionInput,
  beforeIsRoot: boolean,
  afterIsRoot: boolean,
): RootScopeTransition => {
  if (!isAddedRootScope(input, beforeIsRoot, afterIsRoot)) return null;
  const before = input.before!;
  return {
    kind: "added-root-scope",
    counterpartPath: before.absolutePath,
    identityDecisionId: input.identityDecisionId!,
  };
};

const rootScopeTransition = (
  input: RootTransitionInput,
): RootScopeTransition => {
  const beforeIsRoot = isRootProjection(input.before);
  const afterIsRoot = isRootProjection(input.after);
  return (
    [
      removedRootScopeTransition(input, beforeIsRoot, afterIsRoot),
      addedRootScopeTransition(input, beforeIsRoot, afterIsRoot),
    ].find((transition) => transition !== null) ?? null
  );
};

const rootProjectionSides: ReadonlyMap<string, "pair" | SemanticDiffSide> =
  new Map([
    ["true:true", "pair"],
    ["true:false", "before"],
    ["false:true", "after"],
    ["false:false", "after"],
  ]);

const rootProjectionSide = (
  beforeIsRoot: boolean,
  afterIsRoot: boolean,
): "pair" | SemanticDiffSide =>
  rootProjectionSides.get(`${beforeIsRoot}:${afterIsRoot}`)!;

const makeRoot = (input: {
  before: AjsUnit | null;
  after: AjsUnit | null;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
  identityDecisionId: string | null;
  context: RootAssemblyContext;
}): SemanticDiffScheduleImpactRoot => {
  const beforeIsRoot = isRootProjection(input.before);
  const afterIsRoot = isRootProjection(input.after);
  const canonicalUnit = input.after ?? input.before;
  if (!canonicalUnit) {
    throw new Error("Schedule-impact roots require at least one side");
  }
  const canonicalPath = canonicalUnit.absolutePath;
  const side = rootProjectionSide(beforeIsRoot, afterIsRoot);
  const id = rootIdFor(side, canonicalPath, input.matchKind);
  const scopeTransition = rootScopeTransition(input);
  const before = buildRootSide({
    root: input.before,
    side: "before",
    rootId: id,
    matchKind: input.matchKind,
    identityDecisionId: input.identityDecisionId,
    scopeTransition,
    context: input.context,
  });
  const after = buildRootSide({
    root: input.after,
    side: "after",
    rootId: id,
    matchKind: input.matchKind,
    identityDecisionId: input.identityDecisionId,
    scopeTransition,
    context: input.context,
  });
  return {
    id,
    matchKind: input.matchKind,
    canonicalPath,
    identityDecisionId: input.identityDecisionId,
    before,
    after,
    scopeTransition,
  };
};

const issuesByRoot = (
  issues: readonly SemanticDiffScheduleImpactIssue[],
  roots: readonly AjsUnit[],
): RootIssueMap => {
  const byRoot = new Map<string, SemanticDiffScheduleImpactIssue[]>();
  issues.forEach((issue) => addIssueToRootMap(byRoot, roots, issue));
  return byRoot;
};

const addIssueToRootMap = (
  byRoot: RootIssueMap,
  roots: readonly AjsUnit[],
  issue: SemanticDiffScheduleImpactIssue,
): void => {
  [issue.targetPath]
    .filter((path): path is string => path !== null)
    .map((path) => findScheduleIssueRoot(roots, path))
    .filter((root): root is AjsUnit => root !== undefined)
    .forEach((root) =>
      byRoot.set(root.absolutePath, [
        ...(byRoot.get(root.absolutePath) ?? []),
        issue,
      ]),
    );
};

const rootIssueMaps = (
  issues: {
    before: readonly SemanticDiffScheduleImpactIssue[];
    after: readonly SemanticDiffScheduleImpactIssue[];
  },
  roots: {
    before: readonly AjsUnit[];
    after: readonly AjsUnit[];
  },
): { before: RootIssueMap; after: RootIssueMap } => ({
  before: issuesByRoot(issues.before, roots.before),
  after: issuesByRoot(issues.after, roots.after),
});

const rootSideIdMap = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  side: SemanticDiffSide,
): Map<string, string> => {
  const ids = new Map<string, string>();
  roots
    .map((root) => ({ root, projection: root[side] }))
    .filter(
      (
        entry,
      ): entry is {
        root: SemanticDiffScheduleImpactRoot;
        projection: SemanticDiffScheduleImpactRootSide;
      } => entry.projection !== null,
    )
    .forEach(({ root, projection }) => ids.set(projection.unitPath, root.id));
  return ids;
};

const rootIdMaps = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
): { before: Map<string, string>; after: Map<string, string> } => ({
  before: rootSideIdMap(roots, "before"),
  after: rootSideIdMap(roots, "after"),
});

const createRootStatuses = (
  side: SemanticDiffSide,
  roots: readonly SemanticDiffScheduleImpactRootSide[],
  rootIds: ReadonlyMap<string, string>,
): SemanticDiffScheduleImpactRootStatus[] =>
  roots.map((root) => ({
    rootId: rootIds.get(root.unitPath)!,
    side,
    outcome: root.outcome,
    issueIds: root.issueIds,
  }));

type CreateRootsInput = {
  result: SemanticDiffResult;
  before: AjsDocument;
  after: AjsDocument;
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>;
};

type CandidateExclusions = {
  unitIds: ReadonlySet<string>;
  rootPaths: ReadonlySet<string>;
};

type CreateRootsContext = {
  input: CreateRootsInput;
  beforeRoots: AjsUnit[];
  afterRoots: AjsUnit[];
  beforeById: ReadonlyMap<string, AjsUnit>;
  afterById: ReadonlyMap<string, AjsUnit>;
  identity: ReturnType<typeof identityDecisionsByUnit>;
  issues: {
    before: readonly SemanticDiffScheduleImpactIssue[];
    after: readonly SemanticDiffScheduleImpactIssue[];
  };
  rootContext: RootAssemblyContext;
};

type RootBuildResult = {
  roots: SemanticDiffScheduleImpactRoot[];
  issues: {
    before: readonly SemanticDiffScheduleImpactIssue[];
    after: readonly SemanticDiffScheduleImpactIssue[];
  };
  candidates: SemanticDiffScheduleImpactCandidateGroup[];
};

const candidateRootPathsForDecision = (
  decision: SemanticDiffIdentityDecision,
  beforeById: ReadonlyMap<string, AjsUnit>,
  afterById: ReadonlyMap<string, AjsUnit>,
): string[] => {
  const rootPaths = (
    references: readonly CandidateReference[],
    units: ReadonlyMap<string, AjsUnit>,
  ): string[] =>
    references
      .map((reference) => units.get(reference.id))
      .filter((unit): unit is AjsUnit => unit !== undefined)
      .filter(isRootJobnet)
      .map((unit) => unit.absolutePath);
  return [
    ...rootPaths(decision.before, beforeById),
    ...rootPaths(decision.after, afterById),
  ];
};

const candidateExclusions = (
  decisions: readonly SemanticDiffIdentityDecision[],
  beforeById: ReadonlyMap<string, AjsUnit>,
  afterById: ReadonlyMap<string, AjsUnit>,
): CandidateExclusions => {
  const candidates = decisions.filter(
    (decision) => decision.status === "candidate",
  );
  return {
    unitIds: new Set(
      candidates.flatMap((decision) => [
        ...decision.before.map((reference) => reference.id),
        ...decision.after.map((reference) => reference.id),
      ]),
    ),
    rootPaths: new Set(
      candidates.flatMap((decision) =>
        candidateRootPathsForDecision(decision, beforeById, afterById),
      ),
    ),
  };
};

const createRootsContext = (input: CreateRootsInput): CreateRootsContext => {
  const beforeOccurrences = collectAjsUnitOccurrences(input.before);
  const afterOccurrences = collectAjsUnitOccurrences(input.after);
  const beforeIndex = createAjsDocumentIndex(beforeOccurrences);
  const afterIndex = createAjsDocumentIndex(afterOccurrences);
  const beforeRoots = rootUnits(
    beforeOccurrences,
    input.result.inputs.before.jobGroupPath,
  );
  const afterRoots = rootUnits(
    afterOccurrences,
    input.result.inputs.after.jobGroupPath,
  );
  const beforeById = lastUnitByKey(beforeIndex.byId);
  const afterById = lastUnitByKey(afterIndex.byId);
  const identity = identityDecisionsByUnit(input.result.identityDecisions);
  const sourceKeyForRun = createSourceKeyForRun(input.result);
  const sourceUnitsByPath = {
    before: lastUnitByKey(beforeIndex.byPath),
    after: lastUnitByKey(afterIndex.byPath),
  };
  const { runs, noRuns } = collectScheduleRunFacts({
    evaluation: input.evaluation,
    sourceUnitsByPath,
  });
  const exclusions = candidateExclusions(
    input.result.identityDecisions,
    beforeById,
    afterById,
  );
  const issueContext: BuildScheduleIssuesInput = {
    result: input.result,
    evaluation: input.evaluation,
    rootsBySide: { before: beforeRoots, after: afterRoots },
    rootIdsByPath: { before: new Map(), after: new Map() },
    excludedUnitIds: exclusions.unitIds,
    excludedRootPaths: exclusions.rootPaths,
  };
  const issues = buildScheduleIssues(issueContext);
  const rootContext: RootAssemblyContext = {
    rootRuns: runs,
    rootIssues: rootIssueMaps(issues, {
      before: beforeRoots,
      after: afterRoots,
    }),
    noRuns,
    unitsByPath: sourceUnitsByPath,
    sourceKeyForRun,
  };
  return {
    input,
    beforeRoots,
    afterRoots,
    beforeById,
    afterById,
    identity,
    issues,
    rootContext,
  };
};

const rootForTransition = (
  context: RootAssemblyContext,
  transition: RootTransitionInput,
): SemanticDiffScheduleImpactRoot =>
  makeRoot({
    before: transition.before,
    after: transition.after,
    matchKind: transition.matchKind,
    identityDecisionId: transition.identityDecisionId,
    context,
  });

const firstUnitForReferences = (
  references: readonly CandidateReference[],
  units: ReadonlyMap<string, AjsUnit>,
): AjsUnit | null =>
  references
    .map((reference) => units.get(reference.id))
    .find((unit): unit is AjsUnit => unit !== undefined) ?? null;

const firstRootForReferences = (
  references: readonly CandidateReference[],
  units: ReadonlyMap<string, AjsUnit>,
): AjsUnit | null =>
  references
    .map((reference) => units.get(reference.id))
    .find(
      (unit): unit is AjsUnit => unit !== undefined && isRootJobnet(unit),
    ) ?? null;

type RootTransitionCandidatesInput = {
  decision: SemanticDiffIdentityDecision;
  before: AjsUnit | null;
  after: AjsUnit | null;
  beforeAny: AjsUnit | null;
  afterAny: AjsUnit | null;
};

type RootTransitionProjectionInput = {
  candidates: RootTransitionCandidatesInput;
  conditions: readonly boolean[];
  before: AjsUnit | null;
  after: AjsUnit | null;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
};

const rootTransitionFromCandidates = (
  input: RootTransitionProjectionInput,
): RootTransitionInput | null =>
  [
    {
      before: input.before!,
      after: input.after!,
      matchKind: input.matchKind,
      identityDecisionId: input.candidates.decision.id,
    },
  ].filter(() => input.conditions.every(Boolean))[0] ?? null;

const pairedRootTransition = (
  input: RootTransitionCandidatesInput,
): RootTransitionInput | null =>
  rootTransitionFromCandidates({
    candidates: input,
    conditions: [input.before !== null, input.after !== null],
    before: input.before,
    after: input.after,
    matchKind: identityMatchKind(input.decision),
  });

const removedRootScopeTransitionForDecision = (
  input: RootTransitionCandidatesInput,
): RootTransitionInput | null =>
  rootTransitionFromCandidates({
    candidates: input,
    conditions: [
      input.before !== null,
      input.after === null,
      input.afterAny !== null,
    ],
    before: input.before,
    after: input.afterAny,
    matchKind: "removed-root-scope",
  });

const addedRootScopeTransitionForDecision = (
  input: RootTransitionCandidatesInput,
): RootTransitionInput | null =>
  rootTransitionFromCandidates({
    candidates: input,
    conditions: [
      input.before === null,
      input.after !== null,
      input.beforeAny !== null,
    ],
    before: input.beforeAny,
    after: input.after,
    matchKind: "added-root-scope",
  });

const rootTransitionForDecision = (
  decision: SemanticDiffIdentityDecision,
  beforeById: ReadonlyMap<string, AjsUnit>,
  afterById: ReadonlyMap<string, AjsUnit>,
): RootTransitionInput | null => {
  const before = firstRootForReferences(decision.before, beforeById);
  const after = firstRootForReferences(decision.after, afterById);
  const beforeAny = firstUnitForReferences(decision.before, beforeById);
  const afterAny = firstUnitForReferences(decision.after, afterById);
  const candidates = { decision, before, after, beforeAny, afterAny };
  return (
    [
      pairedRootTransition(candidates),
      removedRootScopeTransitionForDecision(candidates),
      addedRootScopeTransitionForDecision(candidates),
    ].find((transition) => transition !== null) ?? null
  );
};

const rootsForConfirmedDecisions = (
  decisions: readonly SemanticDiffIdentityDecision[],
  context: CreateRootsContext,
): SemanticDiffScheduleImpactRoot[] =>
  decisions
    .filter((decision) => confirmedIdentityStatuses.has(decision.status))
    .flatMap((decision) =>
      [
        rootTransitionForDecision(
          decision,
          context.beforeById,
          context.afterById,
        ),
      ]
        .filter(
          (transition): transition is RootTransitionInput =>
            transition !== null,
        )
        .map((transition) =>
          rootForTransition(context.rootContext, transition),
        ),
    );

const rootIsAlreadyRepresented = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  side: SemanticDiffSide,
  unitId: string,
): boolean => roots.some((root) => root[side]?.unitId === unitId);

type UnmatchedRootsInput = {
  roots: SemanticDiffScheduleImpactRoot[];
  sourceRoots: readonly AjsUnit[];
  side: SemanticDiffSide;
  identity: ReturnType<typeof identityDecisionsByUnit>;
  context: CreateRootsContext;
};

const shouldAppendUnmatchedRoot = (
  input: UnmatchedRootsInput,
  sourceRoot: AjsUnit,
  decision: SemanticDiffIdentityDecision | undefined,
): boolean =>
  !rootIsAlreadyRepresented(input.roots, input.side, sourceRoot.id) &&
  decision?.status !== "candidate";

const unmatchedRootTransition = (
  side: SemanticDiffSide,
  sourceRoot: AjsUnit,
  decision: SemanticDiffIdentityDecision | undefined,
): RootTransitionInput =>
  new Map<SemanticDiffSide, RootTransitionInput>([
    [
      "before",
      {
        before: sourceRoot,
        after: null,
        matchKind: "removed",
        identityDecisionId: decision?.id ?? null,
      },
    ],
    [
      "after",
      {
        before: null,
        after: sourceRoot,
        matchKind: "added",
        identityDecisionId: decision?.id ?? null,
      },
    ],
  ]).get(side)!;

const appendUnmatchedRoots = (input: UnmatchedRootsInput): void => {
  input.sourceRoots.forEach((sourceRoot) => {
    const decision = input.identity[input.side].get(sourceRoot.id);
    [shouldAppendUnmatchedRoot(input, sourceRoot, decision)]
      .filter(Boolean)
      .forEach(() =>
        input.roots.push(
          rootForTransition(
            input.context.rootContext,
            unmatchedRootTransition(input.side, sourceRoot, decision),
          ),
        ),
      );
  });
};

const sortRoots = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
): SemanticDiffScheduleImpactRoot[] =>
  [...roots].sort((left, right) =>
    compareInOrder([
      () => compareOrdinal(left.canonicalPath, right.canonicalPath),
      () => compareOrdinal(left.id, right.id),
    ]),
  );

const rootIssueIds = (
  issues: readonly SemanticDiffScheduleImpactIssue[],
  rootId: string,
): string[] =>
  issues.filter((issue) => issue.rootId === rootId).map((issue) => issue.id);

const rootSideWithIssueIds = (
  side: SemanticDiffScheduleImpactRootSide | null,
  issues: readonly SemanticDiffScheduleImpactIssue[],
  rootId: string,
): SemanticDiffScheduleImpactRootSide | null =>
  side === null ? null : { ...side, issueIds: rootIssueIds(issues, rootId) };

const rootWithIssueIds = (
  root: SemanticDiffScheduleImpactRoot,
  issues: {
    before: readonly SemanticDiffScheduleImpactIssue[];
    after: readonly SemanticDiffScheduleImpactIssue[];
  },
): SemanticDiffScheduleImpactRoot => ({
  ...root,
  before: rootSideWithIssueIds(root.before, issues.before, root.id),
  after: rootSideWithIssueIds(root.after, issues.after, root.id),
});

const finalizeRoots = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  issues: {
    before: readonly SemanticDiffScheduleImpactIssue[];
    after: readonly SemanticDiffScheduleImpactIssue[];
  },
): SemanticDiffScheduleImpactRoot[] =>
  roots.map((root) => rootWithIssueIds(root, issues));

const createRoots = (input: CreateRootsInput): RootBuildResult => {
  const context = createRootsContext(input);
  const roots = rootsForConfirmedDecisions(
    input.result.identityDecisions,
    context,
  );
  appendUnmatchedRoots({
    roots,
    sourceRoots: context.beforeRoots,
    side: "before",
    identity: context.identity,
    context,
  });
  appendUnmatchedRoots({
    roots,
    sourceRoots: context.afterRoots,
    side: "after",
    identity: context.identity,
    context,
  });
  const sortedRoots = sortRoots(roots);
  const ids = rootIdMaps(sortedRoots);
  const remappedIssues = remapScheduleIssues({
    issues: context.issues,
    rootsBySide: { before: context.beforeRoots, after: context.afterRoots },
    rootIdsByPath: ids,
  });
  return {
    roots: finalizeRoots(sortedRoots, remappedIssues),
    issues: remappedIssues,
    candidates: candidateGroups(
      input.result.identityDecisions,
      context.beforeById,
      context.afterById,
    ),
  };
};

type EvaluatedSideFacts = {
  rootProjections: readonly SemanticDiffScheduleImpactRootSide[];
  statuses: readonly SemanticDiffScheduleImpactRootStatus[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
};

const rootProjectionsForSide = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  side: SemanticDiffSide,
): SemanticDiffScheduleImpactRootSide[] =>
  roots
    .map((root) => root[side])
    .filter(
      (projection): projection is SemanticDiffScheduleImpactRootSide =>
        projection !== null,
    );

type EvaluatedSideFactsInput = {
  side: SemanticDiffSide;
  roots: readonly SemanticDiffScheduleImpactRootSide[];
  rootIds: ReadonlyMap<string, string>;
  issues: readonly SemanticDiffScheduleImpactIssue[];
};

const evaluatedSideFacts = (
  input: EvaluatedSideFactsInput,
): EvaluatedSideFacts => ({
  rootProjections: input.roots,
  statuses: createRootStatuses(input.side, input.roots, input.rootIds),
  issues: input.issues,
});

const evaluatedFacts = (
  input: BuildSemanticDiffScheduleImpactInput,
  evaluation: EvaluatedSchedule,
): Extract<ScheduleProjectionFacts, { kind: "evaluated" }> => {
  const built = createRoots({
    result: input.result,
    before: input.before,
    after: input.after,
    evaluation,
  });
  const rootIds = rootIdMaps(built.roots);
  const before = rootProjectionsForSide(built.roots, "before");
  const after = rootProjectionsForSide(built.roots, "after");
  return {
    kind: "evaluated",
    period: { ...evaluation.period },
    before: evaluatedSideFacts({
      side: "before",
      roots: before,
      rootIds: rootIds.before,
      issues: built.issues.before,
    }),
    after: evaluatedSideFacts({
      side: "after",
      roots: after,
      rootIds: rootIds.after,
      issues: built.issues.after,
    }),
    correspondence: built.roots,
    candidateGroups: built.candidates,
  };
};

const invalidFacts = (
  result: SemanticDiffResult,
  period: SemanticDiffComparisonPeriod,
): Extract<ScheduleProjectionFacts, { kind: "invalid" }> => ({
  kind: "invalid",
  period: { ...period },
  issues: buildInvalidScheduleIssues(result),
});

/** Build immutable application schedule facts from one schedule evaluation. */
const scheduleFactsBuilders: ReadonlyMap<
  SemanticDiffScheduleEvaluation["kind"],
  (input: BuildSemanticDiffScheduleImpactInput) => ScheduleProjectionFacts
> = new Map<
  SemanticDiffScheduleEvaluation["kind"],
  (input: BuildSemanticDiffScheduleImpactInput) => ScheduleProjectionFacts
>([
  ["not-requested", () => ({ kind: "not-requested" as const })],
  [
    "invalid-period",
    (input) =>
      invalidFacts(
        input.result,
        (
          input.scheduleEvaluation as Extract<
            SemanticDiffScheduleEvaluation,
            { kind: "invalid-period" }
          >
        ).period,
      ),
  ],
  [
    "evaluated",
    (input) =>
      evaluatedFacts(input, input.scheduleEvaluation as EvaluatedSchedule),
  ],
]);

export const buildScheduleProjectionFacts = (
  input: BuildSemanticDiffScheduleImpactInput,
): ScheduleProjectionFacts =>
  deepFreeze(scheduleFactsBuilders.get(input.scheduleEvaluation.kind)!(input));
