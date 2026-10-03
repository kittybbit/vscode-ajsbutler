import type { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type {
  SemanticDiffIdentityDecision,
  SemanticDiffResult,
  SemanticDiffSide,
} from "./semanticDiffDto";
import type {
  SemanticDiffScheduleImpactCandidate,
  SemanticDiffScheduleImpactCandidateGroup,
  SemanticDiffScheduleImpactRoot,
} from "./semanticDiffScheduleImpactDto";

export const compareOrdinal = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

export const compareNumbers = (left: number, right: number): number =>
  left - right;

export const compareInOrder = (
  comparisons: readonly (() => number)[],
): number =>
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

export const isRootJobnet = (unit: AjsUnit): boolean =>
  [unit.unitType === "n", unit.isRootJobnet === true].every(Boolean);

export const identityDecisionsByUnit = (
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

export type SourceKeyRootContext = Pick<
  SemanticDiffScheduleImpactRoot,
  "id" | "scopeTransition" | "matchKind" | "identityDecisionId"
>;

export type SourceKeyForRun = (
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
export const confirmedIdentityStatuses = new Set([
  "exact",
  "fingerprint-confirmed",
]);

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

export const createSourceKeyForRun = (
  result: SemanticDiffResult,
): SourceKeyForRun => {
  const index = identityIndex(result.identityDecisions);
  return (root, side, run) => sourceKeyForRun({ index, root, side, run });
};

export const identityMatchKind = (
  decision: SemanticDiffIdentityDecision,
): "exact" | "fingerprint" =>
  new Map<string, "exact" | "fingerprint">([
    ["exact", "exact"],
    ["fingerprint-confirmed", "fingerprint"],
  ]).get(decision.status) ?? "fingerprint";

export type CandidateReference = SemanticDiffIdentityDecision["before"][number];

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

export const candidateGroups = (
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
