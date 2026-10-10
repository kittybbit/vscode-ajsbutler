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
  SemanticDiffDetail,
  SemanticDiffIdentityDecision,
  SemanticDiffResult,
  SemanticDiffScheduleRun,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnitTarget,
} from "./semanticDiffDto";
import type {
  SemanticDiffScheduleEvaluation,
  SemanticDiffScheduleUnsupportedDecision,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";
import type {
  ScheduleProjectionFacts,
  SemanticDiffScheduleImpactCandidateGroup,
  SemanticDiffScheduleImpactIssue,
  SemanticDiffScheduleImpactIssueKind,
  SemanticDiffScheduleImpactRoot,
  SemanticDiffScheduleImpactRootMatchKind,
  SemanticDiffScheduleImpactRootOutcome,
  SemanticDiffScheduleImpactRootSide,
  SemanticDiffScheduleImpactRootStatus,
} from "./semanticDiffScheduleImpactDto";
import {
  candidateGroups,
  compareInOrder,
  compareNumbers,
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

const owningRoot = (
  roots: readonly AjsUnit[],
  path: string,
): AjsUnit | undefined =>
  [...roots]
    .filter((root) => isWithinRoot(path, root.absolutePath))
    .sort((left, right) =>
      compareInOrder([
        () => right.absolutePath.length - left.absolutePath.length,
        () => compareOrdinal(left.absolutePath, right.absolutePath),
      ]),
    )[0];

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

const reasonIssueKinds: ReadonlyMap<
  SemanticDiffScheduleUnsupportedDecision["reason"],
  SemanticDiffScheduleImpactIssueKind
> = new Map([
  ["invalid-start-time", "invalid"],
  ["invalid-calendar-day", "invalid"],
  ["unsupported-schedule-date", "invalid"],
  ["missing-start-time", "uncalculated"],
  ["unpaired-start-time", "uncalculated"],
]);

const projectionIssueKinds: ReadonlyMap<
  string,
  SemanticDiffScheduleImpactIssueKind
> = new Map([
  ["calendar-selection\u0000missing-context", "missing-context"],
  ["closed-day-substitution\u0000missing-context", "missing-context"],
  ["calendar-selection\u0000invalid", "invalid"],
  ["closed-day-substitution\u0000invalid", "invalid"],
]);

const projectionIssueKind = (
  decision: Pick<SemanticDiffScheduleUnsupportedDecision, "reason" | "status">,
): SemanticDiffScheduleImpactIssueKind | undefined =>
  projectionIssueKinds.get(`${decision.reason}\u0000${decision.status ?? ""}`);

const reasonIssueKind = (
  reason: SemanticDiffScheduleUnsupportedDecision["reason"],
): SemanticDiffScheduleImpactIssueKind =>
  reasonIssueKinds.get(reason) ?? "unsupported";

const issueKind = (
  decision: Pick<SemanticDiffScheduleUnsupportedDecision, "reason" | "status">,
): SemanticDiffScheduleImpactIssueKind =>
  projectionIssueKind(decision) ?? reasonIssueKind(decision.reason);

const issueKindOrder: Record<SemanticDiffScheduleImpactIssueKind, number> = {
  invalid: 0,
  "missing-context": 1,
  unsupported: 2,
  uncalculated: 3,
};

const cloneOptionalObject = <T extends object>(value: T | null): T | null =>
  value === null ? null : { ...value };

const cloneRelationPair = (
  relationPair: SemanticDiffDetail["relationPair"],
): SemanticDiffDetail["relationPair"] =>
  relationPair === null
    ? null
    : {
        canonicalPair: { ...relationPair.canonicalPair },
        before: cloneOptionalObject(relationPair.before),
        after: cloneOptionalObject(relationPair.after),
      };

export const cloneDetail = (
  detail: SemanticDiffDetail,
): SemanticDiffDetail => ({
  ...detail,
  relationPair: cloneRelationPair(detail.relationPair),
  period: detail.period ? { ...detail.period } : null,
  beforeValues: [...detail.beforeValues],
  afterValues: [...detail.afterValues],
  rawValues: [...detail.rawValues],
  removedSources: [...detail.removedSources],
});

const isJobnetTargetForDecision = (
  item: SemanticDiffResult["unsupportedItems"][number],
  decision: SemanticDiffScheduleUnsupportedDecision,
): boolean =>
  item.target?.kind === "jobnet" && item.target.unit.id === decision.unit.id;

const hasMatchingUnsupportedParameter = (
  item: SemanticDiffResult["unsupportedItems"][number],
  decision: SemanticDiffScheduleUnsupportedDecision,
): boolean =>
  item.detail.parameterKey === decision.parameter.key &&
  item.detail.rawValues.includes(decision.parameter.value);

const isMatchingUnsupportedItem = (
  item: SemanticDiffResult["unsupportedItems"][number],
  decision: SemanticDiffScheduleUnsupportedDecision,
): boolean =>
  [
    item.side === decision.side,
    item.reasonCode === decision.reason,
    isJobnetTargetForDecision(item, decision),
    hasMatchingUnsupportedParameter(item, decision),
  ].every(Boolean);

const detailForUnsupported = (
  result: SemanticDiffResult,
  decision: SemanticDiffScheduleUnsupportedDecision,
): SemanticDiffDetail =>
  result.unsupportedItems.find((candidateItem) =>
    isMatchingUnsupportedItem(candidateItem, decision),
  )?.detail ?? {
    unitPath: decision.unit.absolutePath,
    parameterKey: decision.parameter.key,
    relationPair: null,
    scheduleRule: decision.scheduleRule ?? null,
    period: result.scheduleComparison?.period ?? null,
    beforeValues: [],
    afterValues: [],
    rawValues: [decision.parameter.value],
    removedSources: [],
  };

const detailOrderingKey = (detail: SemanticDiffDetail): string =>
  JSON.stringify({
    parameterKey: detail.parameterKey,
    rawValues: detail.rawValues,
    beforeValues: detail.beforeValues,
    afterValues: detail.afterValues,
    removedSources: detail.removedSources,
  });

const issueTargetKind = (
  decision: SemanticDiffScheduleUnsupportedDecision,
): string =>
  new Set(["n", "rn", "rm", "rr"]).has(decision.unit.unitType)
    ? "jobnet"
    : "unit";

const issueId = (input: {
  side: SemanticDiffSide | null;
  rootId: string | null;
  kind: SemanticDiffScheduleImpactIssueKind;
  reasonCode: string;
  targetKind: string;
  targetId: string | null;
  targetPath: string | null;
  parameterKey: string | null;
  occurrenceOrdinal: number;
}): string =>
  encodeSemanticDiffScheduleImpactId(
    "issue",
    input.side ?? "none",
    input.rootId ?? "none",
    "",
    "",
    encodeSemanticDiffScheduleImpactId(
      input.kind,
      input.reasonCode,
      input.targetKind,
      input.targetId ?? "none",
      input.targetPath ?? "none",
      input.parameterKey ?? "null",
    ),
    input.occurrenceOrdinal,
  );

type ScheduleIssueContext = {
  result: SemanticDiffResult;
  evaluation: Extract<SemanticDiffScheduleEvaluation, { kind: "evaluated" }>;
  rootsBySide: { before: AjsUnit[]; after: AjsUnit[] };
  rootIdsByPath: { before: Map<string, string>; after: Map<string, string> };
  excludedUnitIds: ReadonlySet<string>;
  excludedRootPaths: ReadonlySet<string>;
};

const compareUnsupportedDecisions =
  (
    result: SemanticDiffResult,
    rootsBySide: { before: AjsUnit[]; after: AjsUnit[] },
  ) =>
  (
    left: SemanticDiffScheduleUnsupportedDecision,
    right: SemanticDiffScheduleUnsupportedDecision,
  ): number => {
    const leftRoot = owningRoot(rootsBySide[left.side], left.unit.absolutePath);
    const rightRoot = owningRoot(
      rootsBySide[right.side],
      right.unit.absolutePath,
    );
    const leftKind = issueKind(left);
    const rightKind = issueKind(right);
    return compareInOrder([
      () =>
        compareOrdinal(
          leftRoot?.absolutePath ?? "",
          rightRoot?.absolutePath ?? "",
        ),
      () => compareOrdinal(left.side, right.side),
      () => compareNumbers(issueKindOrder[leftKind], issueKindOrder[rightKind]),
      () => compareOrdinal(left.reason, right.reason),
      () => compareOrdinal(issueTargetKind(left), issueTargetKind(right)),
      () => compareOrdinal(left.unit.id, right.unit.id),
      () => compareOrdinal(left.unit.absolutePath, right.unit.absolutePath),
      () => compareOrdinal(left.parameter.key, right.parameter.key),
      () =>
        compareOrdinal(
          detailOrderingKey(detailForUnsupported(result, left)),
          detailOrderingKey(detailForUnsupported(result, right)),
        ),
      () => compareNumbers(left.scheduleRule ?? -1, right.scheduleRule ?? -1),
      () => compareOrdinal(left.parameter.value, right.parameter.value),
    ]);
  };

const isExcludedScheduleIssue = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  context: ScheduleIssueContext,
): boolean =>
  [
    context.excludedUnitIds.has(decision.unit.id),
    [...context.excludedRootPaths].some((path) =>
      isWithinRoot(decision.unit.absolutePath, path),
    ),
  ].some(Boolean);

type ScheduleIssueMetadata = {
  rootId: string | null;
  kind: SemanticDiffScheduleImpactIssueKind;
  targetKind: string;
  targetId: string;
  targetPath: string;
  parameterKey: string;
  detail: SemanticDiffDetail;
};

const scheduleIssueMetadata = (
  context: ScheduleIssueContext,
  decision: SemanticDiffScheduleUnsupportedDecision,
): ScheduleIssueMetadata | undefined => {
  const root = owningRoot(
    context.rootsBySide[decision.side],
    decision.unit.absolutePath,
  );
  return [root]
    .filter((candidate): candidate is AjsUnit => candidate !== undefined)
    .filter(() => !isExcludedScheduleIssue(decision, context))
    .map((includedRoot) => ({
      rootId:
        context.rootIdsByPath[decision.side].get(includedRoot.absolutePath) ??
        null,
      kind: issueKind(decision),
      targetKind: issueTargetKind(decision),
      targetId: decision.unit.id,
      targetPath: decision.unit.absolutePath,
      parameterKey: decision.parameter.key,
      detail: detailForUnsupported(context.result, decision),
    }))[0];
};

const scheduleIssueCountKey = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  metadata: ScheduleIssueMetadata,
): string =>
  [
    decision.side,
    metadata.rootId,
    metadata.kind,
    decision.reason,
    metadata.targetKind,
    metadata.targetId,
    metadata.targetPath,
    metadata.parameterKey,
  ].join("\u0000");

const scheduleIssue = (
  decision: SemanticDiffScheduleUnsupportedDecision,
  metadata: ScheduleIssueMetadata,
  occurrenceOrdinal: number,
): SemanticDiffScheduleImpactIssue => ({
  id: issueId({
    side: decision.side,
    rootId: metadata.rootId,
    kind: metadata.kind,
    reasonCode: decision.reason,
    targetKind: metadata.targetKind,
    targetId: metadata.targetId,
    targetPath: metadata.targetPath,
    parameterKey: metadata.parameterKey,
    occurrenceOrdinal,
  }),
  occurrenceOrdinal,
  kind: metadata.kind,
  side: decision.side,
  rootId: metadata.rootId,
  reasonCode: new Map<boolean, string>([
    [true, decision.reason],
    [false, "uncalculated"],
  ]).get(Boolean(decision.reason))!,
  targetKind: metadata.targetKind,
  targetId: metadata.targetId,
  targetPath: metadata.targetPath,
  parameterKey: metadata.parameterKey,
  detail: cloneDetail(metadata.detail),
});

const scheduleIssueForDecision = (
  context: ScheduleIssueContext,
  decision: SemanticDiffScheduleUnsupportedDecision,
  counts: Map<string, number>,
): SemanticDiffScheduleImpactIssue | undefined => {
  const metadata = scheduleIssueMetadata(context, decision);
  if (!metadata) return undefined;
  const countKey = scheduleIssueCountKey(decision, metadata);
  const occurrenceOrdinal = counts.get(countKey) ?? 0;
  counts.set(countKey, occurrenceOrdinal + 1);
  return scheduleIssue(decision, metadata, occurrenceOrdinal);
};

const collectedScheduleIssues = (
  context: ScheduleIssueContext,
): SemanticDiffScheduleImpactIssue[] => {
  const counts = new Map<string, number>();
  return [...context.evaluation.unsupportedDecisions]
    .sort(compareUnsupportedDecisions(context.result, context.rootsBySide))
    .flatMap((decision) => {
      const issue = scheduleIssueForDecision(context, decision, counts);
      return [issue].filter(
        (candidate): candidate is SemanticDiffScheduleImpactIssue =>
          candidate !== undefined,
      );
    });
};

const issuesForSide = (
  issues: readonly SemanticDiffScheduleImpactIssue[],
  side: SemanticDiffSide,
): SemanticDiffScheduleImpactIssue[] =>
  issues
    .filter((issue) => issue.side === side)
    .sort((left, right) => compareOrdinal(left.id, right.id));

const scheduleIssues = (
  context: ScheduleIssueContext,
): {
  before: SemanticDiffScheduleImpactIssue[];
  after: SemanticDiffScheduleImpactIssue[];
} => {
  const issues = collectedScheduleIssues(context);
  return {
    before: issuesForSide(issues, "before"),
    after: issuesForSide(issues, "after"),
  };
};

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
    .map((path) => owningRoot(roots, path))
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
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
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

export const compareIssues = (
  left: SemanticDiffScheduleImpactIssue,
  right: SemanticDiffScheduleImpactIssue,
): number =>
  compareInOrder([
    () => compareOrdinal(left.rootId ?? "", right.rootId ?? ""),
    () => compareOrdinal(left.side ?? "", right.side ?? ""),
    () => compareNumbers(issueKindOrder[left.kind], issueKindOrder[right.kind]),
    () => compareOrdinal(left.reasonCode, right.reasonCode),
    () => compareOrdinal(left.targetKind, right.targetKind),
    () => compareOrdinal(left.targetId ?? "", right.targetId ?? ""),
    () => compareOrdinal(left.targetPath ?? "", right.targetPath ?? ""),
    () => compareOrdinal(left.parameterKey ?? "", right.parameterKey ?? ""),
    () =>
      compareOrdinal(
        detailOrderingKey(left.detail),
        detailOrderingKey(right.detail),
      ),
    () => compareNumbers(left.occurrenceOrdinal, right.occurrenceOrdinal),
    () => compareOrdinal(left.id, right.id),
  ]);

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
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
  };
  rootContext: RootAssemblyContext;
};

type RootBuildResult = {
  roots: SemanticDiffScheduleImpactRoot[];
  issues: {
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
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
  const issueContext: ScheduleIssueContext = {
    result: input.result,
    evaluation: input.evaluation,
    rootsBySide: { before: beforeRoots, after: afterRoots },
    rootIdsByPath: { before: new Map(), after: new Map() },
    excludedUnitIds: exclusions.unitIds,
    excludedRootPaths: exclusions.rootPaths,
  };
  const issues = scheduleIssues(issueContext);
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

const rootIdForResolvedPath = (
  root: AjsUnit | undefined,
  ids: ReadonlyMap<string, string>,
): string | null => (root ? (ids.get(root.absolutePath) ?? null) : null);

type RootIdForPathInput = {
  side: SemanticDiffSide;
  path: string | null;
  sourceRoots: ReadonlyMap<SemanticDiffSide, readonly AjsUnit[]>;
  ids: { before: Map<string, string>; after: Map<string, string> };
};

const rootIdForPath = (input: RootIdForPathInput): string | null => {
  if (!input.path) return null;
  const root = owningRoot(input.sourceRoots.get(input.side) ?? [], input.path);
  return rootIdForResolvedPath(root, input.ids[input.side]);
};

const rekeyIssue = (
  issue: SemanticDiffScheduleImpactIssue,
  rootId: string | null,
): SemanticDiffScheduleImpactIssue => ({
  ...issue,
  rootId,
  id: issueId({
    side: issue.side,
    rootId,
    kind: issue.kind,
    reasonCode: issue.reasonCode,
    targetKind: issue.targetKind,
    targetId: issue.targetId,
    targetPath: issue.targetPath,
    parameterKey: issue.parameterKey,
    occurrenceOrdinal: issue.occurrenceOrdinal,
  }),
});

type RemapIssuesForSideInput = {
  issues: readonly SemanticDiffScheduleImpactIssue[];
  side: SemanticDiffSide;
  roots: ReadonlyMap<SemanticDiffSide, readonly AjsUnit[]>;
  ids: { before: Map<string, string>; after: Map<string, string> };
};

const remapIssuesForSide = (
  input: RemapIssuesForSideInput,
): SemanticDiffScheduleImpactIssue[] =>
  input.issues
    .map((issue) =>
      rekeyIssue(
        issue,
        rootIdForPath({
          side: input.side,
          path: issue.targetPath,
          sourceRoots: input.roots,
          ids: input.ids,
        }),
      ),
    )
    .sort(compareIssues);

const remapIssues = (
  issues: {
    before: SemanticDiffScheduleImpactIssue[];
    after: SemanticDiffScheduleImpactIssue[];
  },
  context: CreateRootsContext,
  ids: { before: Map<string, string>; after: Map<string, string> },
): {
  before: SemanticDiffScheduleImpactIssue[];
  after: SemanticDiffScheduleImpactIssue[];
} => {
  const roots = new Map<SemanticDiffSide, readonly AjsUnit[]>([
    ["before", context.beforeRoots],
    ["after", context.afterRoots],
  ]);
  return {
    before: remapIssuesForSide({
      issues: issues.before,
      side: "before",
      roots,
      ids,
    }),
    after: remapIssuesForSide({
      issues: issues.after,
      side: "after",
      roots,
      ids,
    }),
  };
};

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
  const remappedIssues = remapIssues(context.issues, context, ids);
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

const invalidTargetIdForKind: ReadonlyMap<
  string,
  (target: SemanticDiffTarget) => string
> = new Map([
  ["jobnet", (target) => (target as SemanticDiffUnitTarget).unit.id],
  ["unit", (target) => (target as SemanticDiffUnitTarget).unit.id],
]);

const invalidTargetId = (target: SemanticDiffTarget | null): string | null =>
  invalidTargetIdForKind.get(target?.kind ?? "")?.(target!) ?? null;

const invalidFacts = (
  result: SemanticDiffResult,
  period: SemanticDiffComparisonPeriod,
): Extract<ScheduleProjectionFacts, { kind: "invalid" }> => ({
  kind: "invalid",
  period: { ...period },
  issues: result.unsupportedItems
    .filter((item) => item.reasonCode === "invalid-schedule-comparison-period")
    .map((item, occurrenceOrdinal) => {
      const targetKind = item.target?.kind ?? "schedule";
      const targetId = invalidTargetId(item.target ?? null);
      const targetPath = item.detail.unitPath;
      const parameterKey = item.detail.parameterKey;
      return {
        id: issueId({
          side: null,
          rootId: null,
          kind: "invalid",
          reasonCode: item.reasonCode,
          targetKind,
          targetId,
          targetPath,
          parameterKey,
          occurrenceOrdinal,
        }),
        occurrenceOrdinal,
        kind: "invalid" as const,
        side: null,
        rootId: null,
        reasonCode: item.reasonCode,
        targetKind,
        targetId,
        targetPath,
        parameterKey,
        detail: cloneDetail(item.detail),
      };
    }),
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
