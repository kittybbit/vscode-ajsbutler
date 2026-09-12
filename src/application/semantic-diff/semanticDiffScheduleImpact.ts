import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffDetail,
  SemanticDiffIdentityDecision,
  SemanticDiffResult,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnitTarget,
} from "./semanticDiffDto";
import type {
  SemanticDiffScheduleEvaluation,
  SemanticDiffScheduleUnsupportedDecision,
} from "../../domain/services/semantic-diff/semanticDiffScheduleRules";

export type SemanticDiffScheduleImpactRootOutcome =
  | "supported-runs"
  | "valid-no-runs"
  | "partial"
  | "uncalculated";

export type SemanticDiffScheduleImpactRunState =
  | "unchanged"
  | "added"
  | "removed"
  | "changed-time";

export type SemanticDiffScheduleImpactIssueKind =
  | "invalid"
  | "missing-context"
  | "unsupported"
  | "uncalculated";

export type SemanticDiffScheduleImpactRun = Readonly<{
  id: string;
  side: SemanticDiffSide;
  unitId: string;
  unitPath: string;
  unitName: string;
  rule: number;
  date: string;
  time: string;
  occurrenceOrdinal: number;
  sourceChangeRef: Readonly<{
    id: string;
    occurrenceOrdinal: number;
  }> | null;
}>;

export type SemanticDiffScheduleImpactIssue = Readonly<{
  id: string;
  occurrenceOrdinal: number;
  kind: SemanticDiffScheduleImpactIssueKind;
  side: SemanticDiffSide | null;
  rootId: string | null;
  reasonCode: string;
  targetKind: string;
  targetId: string | null;
  targetPath: string | null;
  parameterKey: string | null;
  detail: SemanticDiffDetail;
}>;

export type SemanticDiffScheduleImpactRootSide = Readonly<{
  side: SemanticDiffSide;
  unitId: string;
  unitPath: string;
  unitName: string;
  outcome: SemanticDiffScheduleImpactRootOutcome;
  runs: readonly SemanticDiffScheduleImpactRun[];
  issueIds: readonly string[];
}>;

export type SemanticDiffScheduleImpactRootMatchKind =
  | "exact"
  | "fingerprint"
  | "added"
  | "removed"
  | "added-root-scope"
  | "removed-root-scope";

export type SemanticDiffScheduleImpactRoot = Readonly<{
  id: string;
  matchKind: SemanticDiffScheduleImpactRootMatchKind;
  canonicalPath: string;
  identityDecisionId: string | null;
  before: SemanticDiffScheduleImpactRootSide | null;
  after: SemanticDiffScheduleImpactRootSide | null;
  scopeTransition: Readonly<{
    kind: "removed-root-scope" | "added-root-scope";
    counterpartPath: string;
    identityDecisionId: string;
  }> | null;
}>;

export type SemanticDiffScheduleImpactCandidate = Readonly<{
  id: string;
  unitId: string;
  unitName: string;
  unitPath: string;
}>;

export type SemanticDiffScheduleImpactCandidateGroup = Readonly<{
  id: string;
  before: readonly SemanticDiffScheduleImpactCandidate[];
  after: readonly SemanticDiffScheduleImpactCandidate[];
}>;

export type SemanticDiffScheduleImpactTimelineItem = Readonly<{
  id: string;
  state: SemanticDiffScheduleImpactRunState;
  side: SemanticDiffSide | "pair";
  rootId: string;
  date: string;
  time: string;
  rule: number;
  occurrenceOrdinal: number;
  before: SemanticDiffScheduleImpactRun | null;
  after: SemanticDiffScheduleImpactRun | null;
  sourceChangeRef: Readonly<{
    id: string;
    occurrenceOrdinal: number;
  }> | null;
}>;

export type SemanticDiffScheduleImpact = Readonly<{
  period: SemanticDiffComparisonPeriod;
  roots: readonly SemanticDiffScheduleImpactRoot[];
  candidateGroups: readonly SemanticDiffScheduleImpactCandidateGroup[];
  timelineItems: readonly SemanticDiffScheduleImpactTimelineItem[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
}>;

export type SemanticDiffScheduleImpactRootStatus = Readonly<{
  rootId: string;
  side: SemanticDiffSide;
  outcome: SemanticDiffScheduleImpactRootOutcome;
  issueIds: readonly string[];
}>;

export type ScheduleProjectionFacts =
  | Readonly<{ kind: "not-requested" }>
  | Readonly<{
      kind: "invalid";
      period: SemanticDiffComparisonPeriod;
      issues: readonly SemanticDiffScheduleImpactIssue[];
    }>
  | Readonly<{
      kind: "evaluated";
      period: SemanticDiffComparisonPeriod;
      before: Readonly<{
        rootProjections: readonly SemanticDiffScheduleImpactRootSide[];
        statuses: readonly SemanticDiffScheduleImpactRootStatus[];
        issues: readonly SemanticDiffScheduleImpactIssue[];
      }>;
      after: Readonly<{
        rootProjections: readonly SemanticDiffScheduleImpactRootSide[];
        statuses: readonly SemanticDiffScheduleImpactRootStatus[];
        issues: readonly SemanticDiffScheduleImpactIssue[];
      }>;
      correspondence: readonly SemanticDiffScheduleImpactRoot[];
      candidateGroups?: readonly SemanticDiffScheduleImpactCandidateGroup[];
    }>;

export type BuildSemanticDiffScheduleImpactInput = Readonly<{
  result: SemanticDiffResult;
  before: AjsDocument;
  after: AjsDocument;
  scheduleEvaluation: SemanticDiffScheduleEvaluation;
}>;

const compareOrdinal = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

const compareNumbers = (left: number, right: number): number => left - right;

const compareInOrder = (comparisons: readonly (() => number)[]): number =>
  comparisons.reduce((result, comparison) => result || comparison(), 0);

const utf8Length = (value: string): number =>
  new TextEncoder().encode(value).byteLength;

const lengthPrefix = (value: string): string => `${utf8Length(value)}:${value}`;

const isValidNumericIdentity = (component: string | number): boolean =>
  typeof component !== "number" ||
  (Number.isSafeInteger(component) && component >= 0);

const assertValidIdentityComponent = (component: string | number): void => {
  if (!isValidNumericIdentity(component)) {
    throw new RangeError(
      "Schedule-impact numeric identity components must be finite non-negative integers",
    );
  }
};

/** Encode every sidecar identity using length-prefixed UTF-8 components. */
export const encodeSemanticDiffScheduleImpactId = (
  ...components: readonly (string | number)[]
): string => {
  components.forEach(assertValidIdentityComponent);
  return components
    .map((component) => lengthPrefix(String(component)))
    .join("");
};

export const encodeScheduleImpactId = encodeSemanticDiffScheduleImpactId;

const isFreezable = (value: unknown): value is object =>
  [value !== null, typeof value === "object", !Object.isFrozen(value)].every(
    Boolean,
  );

const deepFreeze = <T>(value: T): T => {
  if (!isFreezable(value)) return value;
  Object.values(value as Record<string, unknown>).forEach((child) => {
    deepFreeze(child);
  });
  return Object.freeze(value);
};

const isRootJobnet = (unit: AjsUnit): boolean =>
  [unit.unitType === "n", unit.isRootJobnet === true].every(Boolean);

const unitsById = (document: AjsDocument): Map<string, AjsUnit> => {
  const units = new Map<string, AjsUnit>();
  const visit = (children: readonly AjsUnit[]): void => {
    children.forEach((unit) => {
      units.set(unit.id, unit);
      visit(unit.children);
    });
  };
  visit(document.rootUnits);
  return units;
};

const unitsByPath = (document: AjsDocument): Map<string, AjsUnit> => {
  const units = new Map<string, AjsUnit>();
  const visit = (children: readonly AjsUnit[]): void => {
    children.forEach((unit) => {
      units.set(unit.absolutePath, unit);
      visit(unit.children);
    });
  };
  visit(document.rootUnits);
  return units;
};

const flattenUnits = (
  children: readonly AjsUnit[],
  units: AjsUnit[] = [],
): AjsUnit[] => {
  children.forEach((unit) => {
    units.push(unit);
    flattenUnits(unit.children, units);
  });
  return units;
};

const isSelectedRoot = (unit: AjsUnit, jobGroupPath?: string): boolean =>
  isRootJobnet(unit) &&
  (!jobGroupPath || isWithinRoot(unit.absolutePath, jobGroupPath));

const rootUnits = (document: AjsDocument, jobGroupPath?: string): AjsUnit[] =>
  flattenUnits(document.rootUnits)
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

const identityDecisionsByUnit = (
  decisions: readonly SemanticDiffIdentityDecision[],
): {
  before: Map<string, SemanticDiffIdentityDecision>;
  after: Map<string, SemanticDiffIdentityDecision>;
} => {
  const before = new Map<string, SemanticDiffIdentityDecision>();
  const after = new Map<string, SemanticDiffIdentityDecision>();
  decisions.forEach((decision) => {
    decision.before.forEach((unit) => before.set(unit.id, decision));
    decision.after.forEach((unit) => after.set(unit.id, decision));
  });
  return { before, after };
};

type SourceKeyRootContext = Pick<
  SemanticDiffScheduleImpactRoot,
  "id" | "scopeTransition" | "matchKind" | "identityDecisionId"
>;

type SourceKeyForRun = (
  root: SourceKeyRootContext,
  side: SemanticDiffSide,
  run: { unitId?: string; unitPath: string },
) => string;

type IdentityIndex = ReturnType<typeof identityDecisionsByUnit> & {
  byPath: {
    before: Map<string, SemanticDiffIdentityDecision>;
    after: Map<string, SemanticDiffIdentityDecision>;
  };
};

const identityIndex = (
  decisions: readonly SemanticDiffIdentityDecision[],
): IdentityIndex => {
  const byUnit = identityDecisionsByUnit(decisions);
  const byPath = {
    before: new Map<string, SemanticDiffIdentityDecision>(),
    after: new Map<string, SemanticDiffIdentityDecision>(),
  };
  decisions.forEach((decision) => {
    decision.before.forEach((reference) =>
      byPath.before.set(reference.absolutePath, decision),
    );
    decision.after.forEach((reference) =>
      byPath.after.set(reference.absolutePath, decision),
    );
  });
  return { ...byUnit, byPath };
};

const decisionForRun = (
  index: IdentityIndex,
  side: SemanticDiffSide,
  run: { unitId?: string; unitPath: string },
): SemanticDiffIdentityDecision | undefined =>
  index[side].get(run.unitId ?? "") ?? index.byPath[side].get(run.unitPath);

const confirmedIdentityStates = new Set([
  "false:exact",
  "false:fingerprint-confirmed",
]);
const confirmedIdentityStatuses = new Set(["exact", "fingerprint-confirmed"]);

const isConfirmedIdentity = (
  root: SourceKeyRootContext,
  decision: SemanticDiffIdentityDecision | undefined,
): decision is SemanticDiffIdentityDecision =>
  confirmedIdentityStates.has(
    `${Boolean(root.scopeTransition)}:${decision?.status ?? ""}`,
  );

const isMatchedRootFallback = (
  root: SourceKeyRootContext,
  decision: SemanticDiffIdentityDecision | undefined,
): boolean =>
  new Set(["false:undefined:exact", "false:undefined:fingerprint"]).has(
    `${Boolean(root.scopeTransition)}:${decision?.status ?? "undefined"}:${root.matchKind}`,
  );

const matchedSourceKey = (
  side: SemanticDiffSide,
  run: { unitId?: string; unitPath: string },
  decision: SemanticDiffIdentityDecision,
): string => {
  const sideReferences = decision[side];
  const runKeys = new Set(
    [run.unitId, run.unitPath].filter(
      (value): value is string => value !== undefined,
    ),
  );
  const sourceReference =
    sideReferences.find((reference) =>
      [reference.id, reference.absolutePath].some((key) => runKeys.has(key)),
    ) ?? sideReferences[0];
  return encodeSemanticDiffScheduleImpactId(
    "matched-source",
    decision.id,
    [
      decision.after[0]?.absolutePath,
      decision.before[0]?.absolutePath,
      sourceReference?.absolutePath,
      run.unitPath,
    ].find((path): path is string => path !== undefined)!,
  );
};

const sourceKeyForConfirmedRun = (
  side: SemanticDiffSide,
  run: { unitId?: string; unitPath: string },
  decision: SemanticDiffIdentityDecision,
): string => matchedSourceKey(side, run, decision);

const sourceKeyForMatchedRoot = (
  root: SourceKeyRootContext,
  run: { unitId?: string; unitPath: string },
): string =>
  encodeSemanticDiffScheduleImpactId(
    "matched-source",
    root.identityDecisionId ?? root.id,
    run.unitPath,
  );

const sourceKeyForOneSidedRun = (
  side: SemanticDiffSide,
  run: { unitId?: string; unitPath: string },
): string =>
  encodeSemanticDiffScheduleImpactId(
    "one-sided-source",
    side,
    run.unitId ?? run.unitPath,
    run.unitPath,
  );

type SourceKeyStrategyInput = {
  input: {
    root: SourceKeyRootContext;
    side: SemanticDiffSide;
    run: { unitId?: string; unitPath: string };
  };
  decision: SemanticDiffIdentityDecision | undefined;
};

const sourceKeyStrategies: ReadonlyMap<
  string,
  (input: SourceKeyStrategyInput) => string
> = new Map([
  [
    "confirmed",
    ({ input, decision }) =>
      sourceKeyForConfirmedRun(input.side, input.run, decision!),
  ],
  ["matched", ({ input }) => sourceKeyForMatchedRoot(input.root, input.run)],
  ["one-sided", ({ input }) => sourceKeyForOneSidedRun(input.side, input.run)],
]);

const sourceKeyForRun = (input: {
  index: IdentityIndex;
  root: SourceKeyRootContext;
  side: SemanticDiffSide;
  run: { unitId?: string; unitPath: string };
}): string => {
  const decision = decisionForRun(input.index, input.side, input.run);
  const strategyKey =
    [
      {
        matches: isConfirmedIdentity(input.root, decision),
        key: "confirmed",
      },
      {
        matches: isMatchedRootFallback(input.root, decision),
        key: "matched",
      },
    ].find(({ matches }) => matches)?.key ?? "one-sided";
  return sourceKeyStrategies.get(strategyKey)!({ input, decision });
};

const createSourceKeyForRun = (result: SemanticDiffResult): SourceKeyForRun => {
  const index = identityIndex(result.identityDecisions);
  return (root, side, run) => sourceKeyForRun({ index, root, side, run });
};

const identityMatchKind = (
  decision: SemanticDiffIdentityDecision,
): "exact" | "fingerprint" =>
  new Map<string, "exact" | "fingerprint">([
    ["exact", "exact"],
    ["fingerprint-confirmed", "fingerprint"],
  ]).get(decision.status) ?? "fingerprint";

type CandidateReference = SemanticDiffIdentityDecision["before"][number];

const candidateForReference = (
  reference: CandidateReference,
  units: ReadonlyMap<string, AjsUnit>,
): SemanticDiffScheduleImpactCandidate | undefined => {
  const unit = units.get(reference.id);
  return [unit]
    .filter((candidate): candidate is AjsUnit => candidate !== undefined)
    .filter(isRootJobnet)
    .map((root) => ({
      id: reference.id,
      unitId: reference.id,
      unitName: root.name,
      unitPath: root.absolutePath,
    }))[0];
};

const compareCandidates = (
  left: SemanticDiffScheduleImpactCandidate,
  right: SemanticDiffScheduleImpactCandidate,
): number =>
  compareInOrder([
    () => compareOrdinal(left.unitPath, right.unitPath),
    () => compareOrdinal(left.unitId, right.unitId),
    () => compareOrdinal(left.unitName, right.unitName),
  ]);

const candidateSide = (
  references: readonly CandidateReference[],
  units: ReadonlyMap<string, AjsUnit>,
): SemanticDiffScheduleImpactCandidate[] =>
  references
    .map((reference) => candidateForReference(reference, units))
    .filter(
      (candidate): candidate is SemanticDiffScheduleImpactCandidate =>
        candidate !== undefined,
    )
    .sort(compareCandidates);

const candidateGroupForDecision = (
  decision: SemanticDiffIdentityDecision,
  beforeUnits: ReadonlyMap<string, AjsUnit>,
  afterUnits: ReadonlyMap<string, AjsUnit>,
): SemanticDiffScheduleImpactCandidateGroup | undefined => {
  const before = candidateSide(decision.before, beforeUnits);
  const after = candidateSide(decision.after, afterUnits);
  const canonicalPath = after[0]?.unitPath ?? before[0]?.unitPath ?? "";
  const group = {
    id: encodeSemanticDiffScheduleImpactId(
      "candidate-group",
      "pair",
      canonicalPath,
      "",
      "",
      "fingerprint",
      0,
    ),
    before,
    after,
  };
  return [group].filter(() => before.length > 0 || after.length > 0)[0];
};

const candidateGroups = (
  decisions: readonly SemanticDiffIdentityDecision[],
  beforeUnits: ReadonlyMap<string, AjsUnit>,
  afterUnits: ReadonlyMap<string, AjsUnit>,
): SemanticDiffScheduleImpactCandidateGroup[] =>
  decisions
    .filter((decision) => decision.status === "candidate")
    .map((decision) =>
      candidateGroupForDecision(decision, beforeUnits, afterUnits),
    )
    .filter((group) => group !== undefined)
    .sort((left, right) => compareOrdinal(left.id, right.id));

type IndexedRun = SemanticDiffScheduleRun & {
  unitId?: string;
  occurrenceOrdinal: number;
  sourceKey: string;
};

type ScheduleRun = SemanticDiffScheduleRun & { unitId?: string };
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

const cloneDetail = (detail: SemanticDiffDetail): SemanticDiffDetail => ({
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
  runs: readonly ScheduleRun[];
  issues: readonly SemanticDiffScheduleImpactIssue[];
  explicitNoRuns: boolean;
  unitsByPath: ReadonlyMap<string, AjsUnit>;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactRootSide => {
  const indexed = indexedRuns({
    root: {
      id: input.rootId,
      matchKind: input.rootContext.matchKind,
      identityDecisionId: input.rootContext.identityDecisionId,
      scopeTransition: input.rootContext.scopeTransition,
    },
    side: input.side,
    runs: input.runs,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  const outcome = outcomeFor({
    runs: input.runs,
    hasIssues: input.issues.length > 0,
    explicitNoRuns: input.explicitNoRuns,
  });
  const runs = indexed.map((run) => {
    return runWithId({
      run,
      side: input.side,
      rootId: input.rootId,
      unitId:
        run.unitId ?? input.unitsByPath.get(run.unitPath)?.id ?? input.unit.id,
      sourceChangeRef: null,
    });
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
    before: readonly ScheduleRun[];
    after: readonly ScheduleRun[];
  };
  rootIssues: {
    before: RootIssueMap;
    after: RootIssueMap;
  };
  noRuns: { before: Set<string>; after: Set<string> };
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
  runs: readonly ScheduleRun[],
  root: AjsUnit,
): readonly ScheduleRun[] =>
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

const compareIssues = (
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

type TimelineRun = SemanticDiffScheduleImpactRun;
type TimelineRunGroups = ReadonlyMap<string, readonly TimelineRun[]>;

type TimelineGroupKeyInput = {
  root: SemanticDiffScheduleImpactRoot;
  side: SemanticDiffSide;
  run: TimelineRun;
  sourceKeyForRun: SourceKeyForRun;
};

const timelineGroupKey = (input: TimelineGroupKeyInput): string =>
  encodeSemanticDiffScheduleImpactId(
    input.sourceKeyForRun(input.root, input.side, input.run),
    input.run.date,
    input.run.rule,
  );

type TimelineRunGroupInput = {
  root: SemanticDiffScheduleImpactRoot;
  side: SemanticDiffSide;
  runs: readonly TimelineRun[];
  sourceKeyForRun: SourceKeyForRun;
};

const groupTimelineRuns = (input: TimelineRunGroupInput): TimelineRunGroups => {
  const groups = new Map<string, TimelineRun[]>();
  input.runs.forEach((run) => {
    const key = timelineGroupKey({
      root: input.root,
      side: input.side,
      run,
      sourceKeyForRun: input.sourceKeyForRun,
    });
    groups.set(key, [...(groups.get(key) ?? []), run]);
  });
  return groups;
};

const timelineRunOrder = (left: TimelineRun, right: TimelineRun): number =>
  compareInOrder([
    () => compareOrdinal(left.time, right.time),
    () => compareOrdinal(left.unitPath, right.unitPath),
    () => compareOrdinal(left.unitId, right.unitId),
    () => compareOrdinal(left.unitName, right.unitName),
  ]);

const sortedTimelineRuns = (runs: readonly TimelineRun[]): TimelineRun[] =>
  [...runs].sort(timelineRunOrder);

const timelineGroupKeys = (
  before: TimelineRunGroups,
  after: TimelineRunGroups,
): string[] =>
  [...new Set([...before.keys(), ...after.keys()])].sort(compareOrdinal);

const runPairState = (
  before: TimelineRun | null,
  after: TimelineRun | null,
): SemanticDiffScheduleImpactRunState => {
  const hasBefore = before !== null;
  const hasAfter = after !== null;
  const sameTime = hasBefore && hasAfter && before.time === after.time;
  const state = `${hasBefore}:${hasAfter}:${sameTime}`;
  return (
    new Map<string, SemanticDiffScheduleImpactRunState>([
      ["true:true:true", "unchanged"],
      ["true:true:false", "changed-time"],
      ["true:false:false", "removed"],
      ["false:true:false", "added"],
    ]).get(state) ?? "added"
  );
};

const timelineSides: ReadonlyMap<
  SemanticDiffScheduleImpactRunState,
  SemanticDiffSide | "pair"
> = new Map([
  ["unchanged", "pair"],
  ["changed-time", "pair"],
  ["added", "after"],
  ["removed", "before"],
]);

const timelineSide = (
  state: SemanticDiffScheduleImpactRunState,
): SemanticDiffSide | "pair" => timelineSides.get(state)!;

const timelineTime = (
  state: SemanticDiffScheduleImpactRunState,
  before: TimelineRun | null,
  after: TimelineRun | null,
): string =>
  new Map<
    string,
    (before: TimelineRun | null, after: TimelineRun | null) => string
  >([
    [
      "changed-time",
      (before, after) =>
        encodeSemanticDiffScheduleImpactId(before!.time, after!.time),
    ],
    ["unchanged", (_, after) => after!.time],
    ["removed", (before) => before!.time],
    ["added", (_, after) => after!.time],
  ]).get(state)!(before, after);

type TimelineSourceKeyInput = {
  root: SemanticDiffScheduleImpactRoot;
  before: TimelineRun | null;
  after: TimelineRun | null;
  sourceKeyForRun: SourceKeyForRun;
};

const timelineSourceKey = (input: TimelineSourceKeyInput): string => {
  const side = new Map<boolean, SemanticDiffSide>([
    [true, "before"],
    [false, "after"],
  ]).get(input.before !== null)!;
  return input.sourceKeyForRun(input.root, side, input.before ?? input.after!);
};

const timelineItemForPair = (input: {
  root: SemanticDiffScheduleImpactRoot;
  before: TimelineRun | null;
  after: TimelineRun | null;
  ordinal: number;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem => {
  const state = runPairState(input.before, input.after);
  const side = timelineSide(state);
  const source = input.after ?? input.before;
  const sourceKey = timelineSourceKey({
    root: input.root,
    before: input.before,
    after: input.after,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  return {
    id: encodeSemanticDiffScheduleImpactId(
      "timeline",
      side,
      input.root.id,
      sourceKey,
      source!.date,
      timelineTime(state, input.before, input.after),
      source!.rule,
      input.ordinal,
    ),
    state,
    side,
    rootId: input.root.id,
    date: source!.date,
    time: timelineTime(state, input.before, input.after),
    rule: source!.rule,
    occurrenceOrdinal: input.ordinal,
    before: input.before,
    after: input.after,
    sourceChangeRef:
      input.before?.sourceChangeRef ?? input.after?.sourceChangeRef ?? null,
  };
};

const timelineItemsForGroup = (input: {
  root: SemanticDiffScheduleImpactRoot;
  key: string;
  beforeGroups: TimelineRunGroups;
  afterGroups: TimelineRunGroups;
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem[] => {
  const beforeRuns = sortedTimelineRuns(
    input.beforeGroups.get(input.key) ?? [],
  );
  const afterRuns = sortedTimelineRuns(input.afterGroups.get(input.key) ?? []);
  const maxRuns = Math.max(beforeRuns.length, afterRuns.length);
  return Array.from({ length: maxRuns }, (_, ordinal) =>
    timelineItemForPair({
      root: input.root,
      before: beforeRuns[ordinal] ?? null,
      after: afterRuns[ordinal] ?? null,
      ordinal,
      sourceKeyForRun: input.sourceKeyForRun,
    }),
  );
};

const matchRuns = (input: {
  root: SemanticDiffScheduleImpactRoot;
  before: readonly SemanticDiffScheduleImpactRun[];
  after: readonly SemanticDiffScheduleImpactRun[];
  sourceKeyForRun: SourceKeyForRun;
}): SemanticDiffScheduleImpactTimelineItem[] => {
  const beforeGroups = groupTimelineRuns({
    root: input.root,
    side: "before",
    runs: input.before,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  const afterGroups = groupTimelineRuns({
    root: input.root,
    side: "after",
    runs: input.after,
    sourceKeyForRun: input.sourceKeyForRun,
  });
  return timelineGroupKeys(beforeGroups, afterGroups).flatMap((key) =>
    timelineItemsForGroup({
      root: input.root,
      key,
      beforeGroups,
      afterGroups,
      sourceKeyForRun: input.sourceKeyForRun,
    }),
  );
};

const timelineOrder = (
  left: SemanticDiffScheduleImpactTimelineItem,
  right: SemanticDiffScheduleImpactTimelineItem,
): number =>
  compareInOrder([
    () => compareOrdinal(left.rootId, right.rootId),
    () =>
      compareOrdinal(
        left.before?.id ?? left.after?.id ?? "",
        right.before?.id ?? right.after?.id ?? "",
      ),
    () => compareOrdinal(left.date, right.date),
    () => compareNumbers(left.rule, right.rule),
    () => compareOrdinal(left.time, right.time),
    () => compareNumbers(left.occurrenceOrdinal, right.occurrenceOrdinal),
  ]);

const timeline = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): SemanticDiffScheduleImpactTimelineItem[] =>
  roots
    .flatMap((root) =>
      matchRuns({
        root,
        before: root.before?.runs ?? [],
        after: root.after?.runs ?? [],
        sourceKeyForRun,
      }),
    )
    .sort(timelineOrder);

type SourceChangeReference = Readonly<{
  id: string;
  occurrenceOrdinal: number;
}>;

const changedTimeMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean =>
  [
    change.before?.rule === item.rule,
    change.after?.rule === item.rule,
    change.before?.time === (item.before?.time ?? ""),
    change.after?.time === (item.after?.time ?? ""),
  ].every(Boolean);

type OneSidedScheduleRunChange = SemanticDiffScheduleRunChange;

const oneSidedChangeMatches = (
  change: OneSidedScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean => {
  const changedRun = {
    added: change.after,
    removed: change.before,
  }[change.kind];
  const expectedTime = {
    added: item.after?.time ?? "",
    removed: item.before?.time ?? "",
  }[change.kind];
  return [
    changedRun?.rule === item.rule,
    changedRun?.time === expectedTime,
  ].every(Boolean);
};

const sourceChangeIdentityMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
  source: SemanticDiffScheduleImpactRun,
): boolean =>
  [
    change.unitPath === source.unitPath,
    change.date === item.date,
    change.kind === item.state,
  ].every(Boolean);

const sourceChangeValueMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean =>
  new Map<string, (change: SemanticDiffScheduleRunChange) => boolean>([
    ["changed-time", (candidate) => changedTimeMatches(candidate, item)],
    ["added", (candidate) => oneSidedChangeMatches(candidate, item)],
    ["removed", (candidate) => oneSidedChangeMatches(candidate, item)],
  ]).get(change.kind)!(change);

const sourceChangeMatches = (
  change: SemanticDiffScheduleRunChange,
  item: SemanticDiffScheduleImpactTimelineItem,
): boolean => {
  const source = item.after ?? item.before;
  const matcher = new Map<boolean, () => boolean>([
    [
      true,
      () =>
        [
          sourceChangeIdentityMatches(change, item, source!),
          sourceChangeValueMatches(change, item),
        ].every(Boolean),
    ],
    [false, () => false],
  ]).get(source !== undefined)!;
  return matcher();
};

const sourceChangeCandidateIndex = (
  changes: readonly SemanticDiffScheduleRunChange[],
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: ReadonlySet<number>,
): number =>
  changes.findIndex((change, index) =>
    [!usedChangeIndices.has(index), sourceChangeMatches(change, item)].every(
      Boolean,
    ),
  );

const sourceChangeOccurrenceOrdinal = (
  changes: readonly SemanticDiffScheduleRunChange[],
  candidateIndex: number,
): number => {
  const candidate = changes[candidateIndex];
  return changes
    .slice(0, candidateIndex)
    .filter((change) => change.id === candidate.id).length;
};

const sourceChangeReferenceForChangedItem = (
  changes: readonly SemanticDiffScheduleRunChange[],
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: Set<number>,
): SourceChangeReference | null => {
  const candidateIndex = sourceChangeCandidateIndex(
    changes,
    item,
    usedChangeIndices,
  );
  if (candidateIndex < 0) return null;
  usedChangeIndices.add(candidateIndex);
  const candidate = changes[candidateIndex];
  return {
    id: candidate.id,
    occurrenceOrdinal: sourceChangeOccurrenceOrdinal(changes, candidateIndex),
  };
};

const sourceChangeRefForTimelineItem = (
  result: SemanticDiffResult,
  item: SemanticDiffScheduleImpactTimelineItem,
  usedChangeIndices: Set<number>,
): SourceChangeReference | null => {
  const changes = result.scheduleComparison?.runChanges ?? [];
  if (item.state === "unchanged") return null;
  return sourceChangeReferenceForChangedItem(changes, item, usedChangeIndices);
};

const timelineItemsWithReferences = (
  result: SemanticDiffResult,
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): SemanticDiffScheduleImpactTimelineItem[] => {
  const usedChangeIndices = new Set<number>();
  return timeline(roots, sourceKeyForRun).map((item) => ({
    ...item,
    sourceChangeRef: sourceChangeRefForTimelineItem(
      result,
      item,
      usedChangeIndices,
    ),
  }));
};

const addTimelineRunReferences = (
  referencesByRunId: Map<string, SourceChangeReference>,
  item: SemanticDiffScheduleImpactTimelineItem,
): void => {
  if (!item.sourceChangeRef) return;
  [item.before, item.after]
    .filter((run): run is SemanticDiffScheduleImpactRun => run !== null)
    .forEach((run) => referencesByRunId.set(run.id, item.sourceChangeRef!));
};

const referencesByRunId = (
  items: readonly SemanticDiffScheduleImpactTimelineItem[],
): Map<string, SourceChangeReference> => {
  const references = new Map<string, SourceChangeReference>();
  items.forEach((item) => addTimelineRunReferences(references, item));
  return references;
};

const cloneRunWithReference = (
  run: SemanticDiffScheduleImpactRun,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRun => ({
  ...run,
  sourceChangeRef: references.get(run.id) ?? null,
});

const rootSideWithReferences = (
  side: SemanticDiffScheduleImpactRootSide | null,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRootSide | null =>
  side === null
    ? null
    : {
        ...side,
        runs: side.runs.map((run) => cloneRunWithReference(run, references)),
      };

const rootWithReferences = (
  root: SemanticDiffScheduleImpactRoot,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRoot => ({
  ...root,
  before: rootSideWithReferences(root.before, references),
  after: rootSideWithReferences(root.after, references),
});

const timelineRunWithReference = (
  run: SemanticDiffScheduleImpactRun | null,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactRun | null =>
  run === null ? null : cloneRunWithReference(run, references);

const timelineItemWithReferences = (
  item: SemanticDiffScheduleImpactTimelineItem,
  references: ReadonlyMap<string, SourceChangeReference>,
): SemanticDiffScheduleImpactTimelineItem => ({
  ...item,
  before: timelineRunWithReference(item.before, references),
  after: timelineRunWithReference(item.after, references),
});

const attachSourceChangeReferences = (
  result: SemanticDiffResult,
  roots: readonly SemanticDiffScheduleImpactRoot[],
  sourceKeyForRun: SourceKeyForRun,
): {
  roots: SemanticDiffScheduleImpactRoot[];
  timelineItems: SemanticDiffScheduleImpactTimelineItem[];
} => {
  const timelineItems = timelineItemsWithReferences(
    result,
    roots,
    sourceKeyForRun,
  );
  const references = referencesByRunId(timelineItems);
  return {
    roots: roots.map((root) => rootWithReferences(root, references)),
    timelineItems: timelineItems.map((item) =>
      timelineItemWithReferences(item, references),
    ),
  };
};

const sourceChangeReferenceKey = (reference: {
  id: string;
  occurrenceOrdinal: number;
}): string => `${reference.id}\u0000${reference.occurrenceOrdinal}`;

type ScheduleRunChanges = readonly NonNullable<
  NonNullable<SemanticDiffResult["scheduleComparison"]>["runChanges"][number]
>[];

const changesById = (
  changes: ScheduleRunChanges,
): ReadonlyMap<string, readonly ScheduleRunChanges[number][]> => {
  const byId = new Map<string, ScheduleRunChanges[number][]>();
  changes.forEach((change) =>
    byId.set(change.id, [...(byId.get(change.id) ?? []), change]),
  );
  return byId;
};

const validateSourceChangeReference = (
  byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
  reference: SourceChangeReference,
): void => {
  const candidates = byId.get(reference.id) ?? [];
  const errors: readonly [boolean, string][] = [
    [
      !Number.isSafeInteger(reference.occurrenceOrdinal),
      "Invalid schedule-impact source-change ordinal",
    ],
    [
      !candidates[reference.occurrenceOrdinal],
      "Unknown schedule-impact source-change reference",
    ],
  ];
  const error = errors.find(([invalid]) => invalid)?.[1];
  if (error) throw new Error(error);
};

const timelineRuns = (
  item: SemanticDiffScheduleImpactTimelineItem,
): SemanticDiffScheduleImpactRun[] =>
  [item.before, item.after].filter(
    (run): run is SemanticDiffScheduleImpactRun => run !== null,
  );

const hasRunSourceChangeReferences = (
  runs: readonly SemanticDiffScheduleImpactRun[],
): boolean => runs.some((run) => run.sourceChangeRef !== null);

const validateUnchangedTimelineItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
): void => {
  const runs = timelineRuns(item);
  const hasReferences = [
    item.sourceChangeRef !== null,
    hasRunSourceChangeReferences(runs),
  ].some(Boolean);
  if (hasReferences) {
    throw new Error("Unchanged schedule-impact runs cannot reference changes");
  }
};

const validateChangedRunReferences = (
  runs: readonly SemanticDiffScheduleImpactRun[],
  effectKey: string,
): void => {
  const referencesDiffer = runs.some((run) => {
    const reference = run.sourceChangeRef;
    return new Map<boolean, () => boolean>([
      [true, () => true],
      [false, () => sourceChangeReferenceKey(reference!) !== effectKey],
    ]).get(reference === null)!();
  });
  if (referencesDiffer) {
    throw new Error("Schedule-impact run and timeline references differ");
  }
};

const sourceChangeReferenceForItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
): SourceChangeReference => {
  if (!item.sourceChangeRef) {
    throw new Error(
      "Changed schedule-impact effects require a change reference",
    );
  }
  return item.sourceChangeRef;
};

const sourceChangeOwnerActions: ReadonlyMap<boolean, () => void> = new Map([
  [
    true,
    () => {
      throw new Error(
        "A schedule-change reference crosses schedule-impact effects",
      );
    },
  ],
  [false, () => undefined],
]);

const claimSourceChangeOwner = (
  owners: Map<string, string>,
  effectKey: string,
  itemId: string,
): void => {
  const owner = owners.get(effectKey);
  const ownerConflict = owner !== undefined && owner !== itemId;
  sourceChangeOwnerActions.get(ownerConflict)!();
  owners.set(effectKey, itemId);
};

const validateChangedTimelineItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
  byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
  owners: Map<string, string>,
): void => {
  const effectReference = sourceChangeReferenceForItem(item);
  validateSourceChangeReference(byId, effectReference);
  const effectKey = sourceChangeReferenceKey(effectReference);
  claimSourceChangeOwner(owners, effectKey, item.id);
  validateChangedRunReferences(timelineRuns(item), effectKey);
};

const timelineValidators: ReadonlyMap<
  SemanticDiffScheduleImpactRunState,
  (
    item: SemanticDiffScheduleImpactTimelineItem,
    byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
    owners: Map<string, string>,
  ) => void
> = new Map([
  ["unchanged", (item) => validateUnchangedTimelineItem(item)],
  [
    "added",
    (item, byId, owners) => validateChangedTimelineItem(item, byId, owners),
  ],
  [
    "removed",
    (item, byId, owners) => validateChangedTimelineItem(item, byId, owners),
  ],
  [
    "changed-time",
    (item, byId, owners) => validateChangedTimelineItem(item, byId, owners),
  ],
]);

const validateTimelineItem = (
  item: SemanticDiffScheduleImpactTimelineItem,
  byId: ReadonlyMap<string, readonly ScheduleRunChanges[number][]>,
  owners: Map<string, string>,
): void => timelineValidators.get(item.state)!(item, byId, owners);

const validateSourceChangeReferences = (
  result: SemanticDiffResult,
  items: readonly SemanticDiffScheduleImpactTimelineItem[],
): void => {
  const changes = result.scheduleComparison?.runChanges ?? [];
  const byId = changesById(changes);
  const owners = new Map<string, string>();
  items.forEach((item) => validateTimelineItem(item, byId, owners));
};

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

const createRootsContext = (input: CreateRootsInput): CreateRootsContext => {
  const beforeRoots = rootUnits(
    input.before,
    input.result.inputs.before.jobGroupPath,
  );
  const afterRoots = rootUnits(
    input.after,
    input.result.inputs.after.jobGroupPath,
  );
  const beforeById = unitsById(input.before);
  const afterById = unitsById(input.after);
  const identity = identityDecisionsByUnit(input.result.identityDecisions);
  const sourceKeyForRun = createSourceKeyForRun(input.result);
  const sourceUnitsByPath = {
    before: unitsByPath(input.before),
    after: unitsByPath(input.after),
  };
  const runs = scheduleRunsBySide(input.evaluation, sourceUnitsByPath);
  const noRuns = noRunsBySide(input.evaluation);
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

/** Project the immutable sidecar without comparison or schedule recalculation. */
const cloneImpactRun = (
  run: SemanticDiffScheduleImpactRun,
): SemanticDiffScheduleImpactRun => ({
  ...run,
  sourceChangeRef: cloneOptionalObject(run.sourceChangeRef),
});

const cloneImpactSide = (
  side: SemanticDiffScheduleImpactRootSide,
): SemanticDiffScheduleImpactRootSide => ({
  ...side,
  runs: side.runs.map(cloneImpactRun),
  issueIds: [...side.issueIds],
});

const cloneOptionalImpactSide = (
  side: SemanticDiffScheduleImpactRootSide | null,
): SemanticDiffScheduleImpactRootSide | null =>
  side === null ? null : cloneImpactSide(side);

const cloneImpactRoot = (
  root: SemanticDiffScheduleImpactRoot,
): SemanticDiffScheduleImpactRoot => ({
  ...root,
  before: cloneOptionalImpactSide(root.before),
  after: cloneOptionalImpactSide(root.after),
  scopeTransition: cloneOptionalObject(root.scopeTransition),
});

const cloneImpactRoots = (
  roots: readonly SemanticDiffScheduleImpactRoot[],
): SemanticDiffScheduleImpactRoot[] => roots.map(cloneImpactRoot);

const cloneImpactIssues = (
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>,
): SemanticDiffScheduleImpactIssue[] =>
  [...facts.before.issues, ...facts.after.issues]
    .map((issue) => ({
      ...issue,
      detail: cloneDetail(issue.detail),
    }))
    .sort(compareIssues);

const cloneImpactCandidates = (
  candidates: readonly SemanticDiffScheduleImpactCandidateGroup[] | undefined,
): SemanticDiffScheduleImpactCandidateGroup[] =>
  (candidates ?? []).map((group) => ({
    ...group,
    before: group.before.map((candidate) => ({ ...candidate })),
    after: group.after.map((candidate) => ({ ...candidate })),
  }));

type ClonedImpactProjection = {
  roots: SemanticDiffScheduleImpactRoot[];
  issues: SemanticDiffScheduleImpactIssue[];
  candidateGroups: SemanticDiffScheduleImpactCandidateGroup[];
};

const cloneImpactProjection = (
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>,
): ClonedImpactProjection => ({
  roots: cloneImpactRoots(facts.correspondence),
  issues: cloneImpactIssues(facts),
  candidateGroups: cloneImpactCandidates(facts.candidateGroups),
});

const buildSemanticDiffScheduleImpactOutput = (input: {
  result: SemanticDiffResult;
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>;
}): SemanticDiffScheduleImpact => {
  const projection = cloneImpactProjection(input.facts);
  const attached = attachSourceChangeReferences(
    input.result,
    projection.roots,
    createSourceKeyForRun(input.result),
  );
  validateSourceChangeReferences(input.result, attached.timelineItems);
  return deepFreeze({
    period: input.facts.period,
    roots: attached.roots,
    candidateGroups: projection.candidateGroups,
    timelineItems: attached.timelineItems,
    issues: projection.issues,
  });
};

export const buildSemanticDiffScheduleImpact = (input: {
  result: SemanticDiffResult;
  facts: Extract<ScheduleProjectionFacts, { kind: "evaluated" }>;
}): SemanticDiffScheduleImpact => buildSemanticDiffScheduleImpactOutput(input);

export const buildScheduleImpact = buildSemanticDiffScheduleImpact;
