import type {
  SemanticDiffChangeKind,
  SemanticDiffConfirmationReason,
  SemanticDiffElementKind,
  SemanticDiffIdentityDecisionStatus,
  SemanticDiffUnsupportedKind,
} from "../../application/semantic-diff/semanticDiffDto";
import type {
  SemanticDiffJsonCanonicalPair,
  SemanticDiffJsonChange,
  SemanticDiffJsonConfirmation,
  SemanticDiffJsonConstraint,
  SemanticDiffJsonDetail,
  SemanticDiffJsonIdentityDecision,
  SemanticDiffJsonIdentityEvidence,
  SemanticDiffJsonIdentityField,
  SemanticDiffJsonLimitation,
  SemanticDiffJsonPeriod,
  SemanticDiffJsonRelationEndpoint,
  SemanticDiffJsonRelationPair,
  SemanticDiffJsonRelationReference,
  SemanticDiffJsonRun,
  SemanticDiffJsonRunChange,
  SemanticDiffJsonTarget,
  SemanticDiffJsonUnitReference,
  SemanticDiffJsonUnsupported,
  SemanticDiffJsonWarning,
} from "./semanticDiffJson";

export const changeKindOrder: readonly ChangeKind[] = [
  "added",
  "removed",
  "changed",
  "renamed",
  "moved",
];

export const elementKindOrder: readonly ElementKind[] = [
  "job-group",
  "jobnet",
  "unit",
  "relation",
  "attribute",
];

export const attributeCategoryOrder = [
  "execution-environment",
  "execution-definition",
  "start-condition",
  "end-control",
  "abnormal-end-control",
  "wait-condition",
  "external-integration",
  "schedule",
] as const;

export const unsupportedKindOrder: readonly UnsupportedKind[] = [
  "unsupported",
  "uninterpretable",
  "uncalculated",
];

export const confirmationReasonCodes: readonly SemanticDiffConfirmationReason[] =
  [
    "conditional-relation-removed",
    "wait-release-source-changed",
    "timeout-removed",
    "condition-judgment-changed",
    "wait-target-changed",
    "no-calculated-schedule-run",
    "calculated-schedule-run-removed",
    "execution-user-type-changed",
    "jp1-resource-group-changed",
  ];

export const identityStatusOrder: Record<
  SemanticDiffIdentityDecisionStatus,
  number
> = {
  exact: 0,
  "fingerprint-confirmed": 1,
  candidate: 2,
  removed: 3,
  added: 4,
};

type ChangeKind = SemanticDiffChangeKind;
type ElementKind = SemanticDiffElementKind;
type UnsupportedKind = SemanticDiffUnsupportedKind;

export const compareOrdinal = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

export const compareNumber = (left: number, right: number): number =>
  Number(left > right) - Number(left < right);

const firstDifference = (comparisons: readonly number[]): number => {
  for (const comparison of comparisons) {
    if (comparison !== 0) return comparison;
  }
  return 0;
};

const nullRank = <T>(value: T | null): number => Number(value !== null);

export const compareNullable = <T>(
  left: T | null,
  right: T | null,
  compare: (left: T, right: T) => number,
): number => {
  const rankComparison = compareNumber(nullRank(left), nullRank(right));
  if (rankComparison !== 0) return rankComparison;
  return left === null ? 0 : compare(left, right as T);
};

const compareSharedArrayValues = <T>(
  left: readonly T[],
  right: readonly T[],
  compare: (left: T, right: T) => number,
): number => {
  const sharedLength = Math.min(left.length, right.length);
  for (let index = 0; index < sharedLength; index += 1) {
    const comparison = compare(left[index], right[index]);
    if (comparison !== 0) return comparison;
  }
  return 0;
};

export const compareArrays = <T>(
  left: readonly T[],
  right: readonly T[],
  compare: (left: T, right: T) => number,
): number =>
  firstDifference([
    compareSharedArrayValues(left, right, compare),
    compareNumber(left.length, right.length),
  ]);

export const compareStringArrays = (
  left: readonly string[],
  right: readonly string[],
): number => compareArrays(left, right, compareOrdinal);

export const sortedStrings = (values: readonly string[]): string[] =>
  [...values].sort(compareOrdinal);

export const comparePeriods = (
  left: SemanticDiffJsonPeriod,
  right: SemanticDiffJsonPeriod,
): number =>
  firstDifference([
    compareOrdinal(left.from, right.from),
    compareOrdinal(left.to, right.to),
  ]);

export const compareUnitReferences = (
  left: SemanticDiffJsonUnitReference,
  right: SemanticDiffJsonUnitReference,
): number =>
  firstDifference([
    compareOrdinal(left.absolutePath, right.absolutePath),
    compareOrdinal(left.unitType, right.unitType),
    compareOrdinal(left.name, right.name),
    compareOrdinal(left.id, right.id),
  ]);

export const compareUnitReferencesWire = (
  left: SemanticDiffJsonUnitReference,
  right: SemanticDiffJsonUnitReference,
): number =>
  firstDifference([
    compareOrdinal(left.id, right.id),
    compareOrdinal(left.name, right.name),
    compareOrdinal(left.absolutePath, right.absolutePath),
    compareOrdinal(left.unitType, right.unitType),
  ]);

export const compareRelationReferences = (
  left: SemanticDiffJsonRelationReference,
  right: SemanticDiffJsonRelationReference,
): number =>
  firstDifference([
    compareOrdinal(left.sourceUnitId, right.sourceUnitId),
    compareOrdinal(left.targetUnitId, right.targetUnitId),
    compareOrdinal(left.type, right.type),
    compareNullable(left.sourceUnitPath, right.sourceUnitPath, compareOrdinal),
    compareNullable(left.targetUnitPath, right.targetUnitPath, compareOrdinal),
  ]);

export const compareCanonicalPairs = (
  left: SemanticDiffJsonCanonicalPair,
  right: SemanticDiffJsonCanonicalPair,
): number =>
  firstDifference([
    compareOrdinal(left.sourceUnitId, right.sourceUnitId),
    compareOrdinal(left.targetUnitId, right.targetUnitId),
    compareOrdinal(left.type, right.type),
  ]);

export const compareEndpoints = (
  left: SemanticDiffJsonRelationEndpoint,
  right: SemanticDiffJsonRelationEndpoint,
): number =>
  firstDifference([
    compareNullable(left.sourceUnitPath, right.sourceUnitPath, compareOrdinal),
    compareOrdinal(left.sourceUnitId, right.sourceUnitId),
    compareNullable(left.targetUnitPath, right.targetUnitPath, compareOrdinal),
    compareOrdinal(left.targetUnitId, right.targetUnitId),
    compareOrdinal(left.type, right.type),
  ]);

export const compareRelationPairs = (
  left: SemanticDiffJsonRelationPair,
  right: SemanticDiffJsonRelationPair,
): number =>
  firstDifference([
    compareCanonicalPairs(left.canonicalPair, right.canonicalPair),
    compareNullable(left.before, right.before, compareEndpoints),
    compareNullable(left.after, right.after, compareEndpoints),
  ]);

const compareAttributeTargets = (
  left: Extract<SemanticDiffJsonTarget, { kind: "attribute" }>,
  right: Extract<SemanticDiffJsonTarget, { kind: "attribute" }>,
): number =>
  firstDifference([
    compareUnitReferencesWire(left.unit, right.unit),
    compareOrdinal(left.parameterKey, right.parameterKey),
    compareOrdinal(left.category, right.category),
    compareStringArrays(left.values, right.values),
  ]);

const compareTargetPayload = (
  left: SemanticDiffJsonTarget,
  right: SemanticDiffJsonTarget,
): number => {
  if (left.kind !== right.kind) return 0;
  let comparison = 0;
  switch (left.kind) {
    case "job-group":
      comparison = compareNullable(
        left.path,
        (right as typeof left).path,
        compareOrdinal,
      );
      break;
    case "jobnet":
    case "unit":
      comparison = compareUnitReferencesWire(
        left.unit,
        (right as typeof left).unit,
      );
      break;
    case "relation":
      comparison = compareRelationReferences(
        left.relation,
        (right as typeof left).relation,
      );
      break;
    case "attribute":
      comparison = compareAttributeTargets(left, right as typeof left);
      break;
  }
  return comparison;
};

export const compareTargets = (
  left: SemanticDiffJsonTarget,
  right: SemanticDiffJsonTarget,
): number =>
  firstDifference([
    compareOrdinal(left.kind, right.kind),
    compareTargetPayload(left, right),
  ]);

export const compareDetails = (
  left: SemanticDiffJsonDetail,
  right: SemanticDiffJsonDetail,
): number =>
  firstDifference([
    compareNullable(left.unitPath, right.unitPath, compareOrdinal),
    compareNullable(left.parameterKey, right.parameterKey, compareOrdinal),
    compareNullable(
      left.relationPair,
      right.relationPair,
      compareRelationPairs,
    ),
    compareNullable(left.scheduleRule, right.scheduleRule, compareNumber),
    compareNullable(left.period, right.period, comparePeriods),
    compareStringArrays(left.beforeValues, right.beforeValues),
    compareStringArrays(left.afterValues, right.afterValues),
    compareStringArrays(left.rawValues, right.rawValues),
    compareStringArrays(left.removedSources, right.removedSources),
  ]);

export const compareWarnings = (
  left: SemanticDiffJsonWarning,
  right: SemanticDiffJsonWarning,
): number =>
  firstDifference([
    compareOrdinal(left.code, right.code),
    compareDetails(left.detail, right.detail),
    compareNullable(left.fallbackText, right.fallbackText, compareOrdinal),
  ]);

export const compareConstraints = (
  left: SemanticDiffJsonConstraint,
  right: SemanticDiffJsonConstraint,
): number =>
  firstDifference([
    compareOrdinal(left.code, right.code),
    compareDetails(left.detail, right.detail),
    compareNullable(left.warning, right.warning, compareWarnings),
  ]);

export const compareIdentityFields = (
  left: SemanticDiffJsonIdentityField,
  right: SemanticDiffJsonIdentityField,
): number =>
  firstDifference([
    compareOrdinal(left.key, right.key),
    compareOrdinal(left.presence, right.presence),
    compareStringArrays(left.values, right.values),
  ]);

const compareExactKeyEvidence = (
  left: Extract<SemanticDiffJsonIdentityEvidence, { kind: "exact-key" }>,
  right: Extract<SemanticDiffJsonIdentityEvidence, { kind: "exact-key" }>,
): number => {
  const keyKindComparison = compareOrdinal(left.key.kind, right.key.kind);
  if (keyKindComparison !== 0) return keyKindComparison;
  if (left.key.kind === "jobnet") {
    const rightKey = right.key as typeof left.key;
    return firstDifference([
      compareOrdinal(
        left.key.jobGroupRelativePath,
        rightKey.jobGroupRelativePath,
      ),
      compareOrdinal(left.key.unitType, rightKey.unitType),
    ]);
  }
  const rightKey = right.key as typeof left.key;
  return firstDifference([
    compareOrdinal(left.key.parentJobnetPath, rightKey.parentJobnetPath),
    compareOrdinal(left.key.unitName, rightKey.unitName),
    compareOrdinal(left.key.unitType, rightKey.unitType),
  ]);
};

const compareFingerprintEvidence = (
  left: Extract<SemanticDiffJsonIdentityEvidence, { kind: "fingerprint" }>,
  right: Extract<SemanticDiffJsonIdentityEvidence, { kind: "fingerprint" }>,
): number =>
  firstDifference([
    compareOrdinal(left.strategyId, right.strategyId),
    compareOrdinal(left.unitType, right.unitType),
    compareArrays(left.fields, right.fields, compareIdentityFields),
  ]);

const compareIdentityEvidencePayload = (
  left: SemanticDiffJsonIdentityEvidence,
  right: SemanticDiffJsonIdentityEvidence,
): number => {
  if (left.kind === "exact-key") {
    return right.kind === "exact-key"
      ? compareExactKeyEvidence(left, right)
      : 0;
  }
  return right.kind === "fingerprint"
    ? compareFingerprintEvidence(left, right)
    : 0;
};

export const compareIdentityEvidence = (
  left: SemanticDiffJsonIdentityEvidence,
  right: SemanticDiffJsonIdentityEvidence,
): number =>
  firstDifference([
    compareOrdinal(left.kind, right.kind),
    compareIdentityEvidencePayload(left, right),
  ]);

const compareIdentityDiscriminatorPayload = (
  left: SemanticDiffJsonIdentityDecision,
  right: SemanticDiffJsonIdentityDecision,
): number => {
  if (left.evidence.kind === "exact-key") {
    return right.evidence.kind === "exact-key"
      ? compareOrdinal(left.evidence.key.kind, right.evidence.key.kind)
      : 0;
  }
  if (right.evidence.kind !== "fingerprint") return 0;
  return firstDifference([
    compareOrdinal(left.evidence.strategyId, right.evidence.strategyId),
    compareOrdinal(left.evidence.unitType, right.evidence.unitType),
  ]);
};

export const compareIdentityDiscriminators = (
  left: SemanticDiffJsonIdentityDecision,
  right: SemanticDiffJsonIdentityDecision,
): number =>
  firstDifference([
    compareOrdinal(left.evidence.kind, right.evidence.kind),
    compareIdentityDiscriminatorPayload(left, right),
  ]);

export const compareIdentityDecisions = (
  left: SemanticDiffJsonIdentityDecision,
  right: SemanticDiffJsonIdentityDecision,
): number =>
  firstDifference([
    compareNumber(
      identityStatusOrder[left.status],
      identityStatusOrder[right.status],
    ),
    compareIdentityDiscriminators(left, right),
    compareOrdinal(left.rule, right.rule),
    compareArrays(left.before, right.before, compareUnitReferences),
    compareArrays(left.after, right.after, compareUnitReferences),
    compareIdentityEvidence(left.evidence, right.evidence),
    compareOrdinal(left.id, right.id),
  ]);

export const compareChanges = (
  left: SemanticDiffJsonChange,
  right: SemanticDiffJsonChange,
): number =>
  firstDifference([
    compareOrdinal(left.id, right.id),
    compareOrdinal(left.kind, right.kind),
    compareOrdinal(left.elementKind, right.elementKind),
    compareOrdinal(left.confirmationLevel, right.confirmationLevel),
    compareNullable(
      left.identityDecisionId,
      right.identityDecisionId,
      compareOrdinal,
    ),
    compareNullable(left.before, right.before, compareTargets),
    compareNullable(left.after, right.after, compareTargets),
    compareNullable(
      left.relationPair,
      right.relationPair,
      compareRelationPairs,
    ),
    compareNullable(
      left.attributeCategory,
      right.attributeCategory,
      compareOrdinal,
    ),
  ]);

export const compareConfirmations = (
  left: SemanticDiffJsonConfirmation,
  right: SemanticDiffJsonConfirmation,
): number =>
  firstDifference([
    compareOrdinal(left.id, right.id),
    compareOrdinal(left.reasonCode, right.reasonCode),
    compareTargets(left.target, right.target),
    compareArrays(left.relatedTargets, right.relatedTargets, compareTargets),
    compareDetails(left.detail, right.detail),
    compareArrays(left.constraints, right.constraints, compareConstraints),
    compareNullable(left.warning, right.warning, compareWarnings),
  ]);

export const compareUnsupported = (
  left: SemanticDiffJsonUnsupported,
  right: SemanticDiffJsonUnsupported,
): number =>
  firstDifference([
    compareOrdinal(left.id, right.id),
    compareOrdinal(left.kind, right.kind),
    compareNullable(left.side, right.side, compareOrdinal),
    compareOrdinal(left.reasonCode, right.reasonCode),
    compareNullable(left.target, right.target, compareTargets),
    compareDetails(left.detail, right.detail),
    compareNullable(left.warning, right.warning, compareWarnings),
  ]);

export const compareLimitations = (
  left: SemanticDiffJsonLimitation,
  right: SemanticDiffJsonLimitation,
): number =>
  firstDifference([
    compareOrdinal(left.code, right.code),
    compareOrdinal(left.kind, right.kind),
    compareNullable(left.side, right.side, compareOrdinal),
    compareNullable(left.unitPath, right.unitPath, compareOrdinal),
    compareDetails(left.detail, right.detail),
    compareNullable(left.warning, right.warning, compareWarnings),
  ]);

export const compareRuns = (
  left: SemanticDiffJsonRun,
  right: SemanticDiffJsonRun,
): number =>
  firstDifference([
    compareOrdinal(left.unitPath, right.unitPath),
    compareOrdinal(left.unitName, right.unitName),
    compareNumber(left.rule, right.rule),
    compareOrdinal(left.date, right.date),
    compareOrdinal(left.time, right.time),
  ]);

export const compareRunChanges = (
  left: SemanticDiffJsonRunChange,
  right: SemanticDiffJsonRunChange,
): number =>
  firstDifference([
    compareOrdinal(left.id, right.id),
    compareOrdinal(left.kind, right.kind),
    compareOrdinal(left.unitPath, right.unitPath),
    compareOrdinal(left.date, right.date),
    compareNullable(left.before, right.before, compareRuns),
    compareNullable(left.after, right.after, compareRuns),
  ]);
