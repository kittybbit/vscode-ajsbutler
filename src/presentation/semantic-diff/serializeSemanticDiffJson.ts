import type {
  SemanticDiffChange,
  SemanticDiffComparisonPeriod,
  SemanticDiffConfirmationReason,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffConstraint,
  SemanticDiffDetail,
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityField,
  SemanticDiffUnitReference,
  SemanticDiffInputPair,
  SemanticDiffLimitation,
  SemanticDiffOutputContext,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffRelationReference,
  SemanticDiffResult,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffScope,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
  SemanticDiffWarning,
} from "../../application/semantic-diff/semanticDiffDto";
import {
  SEMANTIC_DIFF_JSON_MEDIA_TYPE,
  type SemanticDiffJsonCanonicalPair,
  type SemanticDiffJsonChange,
  type SemanticDiffJsonConfirmation,
  type SemanticDiffJsonConstraint,
  type SemanticDiffJsonDetail,
  type SemanticDiffJsonIdentityDecision,
  type SemanticDiffJsonIdentityEvidence,
  type SemanticDiffJsonIdentityField,
  type SemanticDiffJsonInputPair,
  type SemanticDiffJsonLimitation,
  type SemanticDiffJsonOutput,
  type SemanticDiffJsonPeriod,
  type SemanticDiffJsonRelationEndpoint,
  type SemanticDiffJsonRelationPair,
  type SemanticDiffJsonRelationReference,
  type SemanticDiffJsonResult,
  type SemanticDiffJsonRun,
  type SemanticDiffJsonRunChange,
  type SemanticDiffJsonSchedule,
  type SemanticDiffJsonScope,
  type SemanticDiffJsonSummary,
  type SemanticDiffJsonTarget,
  type SemanticDiffJsonUnitReference,
  type SemanticDiffJsonUnsupported,
  type SemanticDiffJsonV1,
  type SemanticDiffJsonWarning,
} from "./semanticDiffJson";

const changeKindOrder = [
  "added",
  "removed",
  "changed",
  "renamed",
  "moved",
] as const;

const elementKindOrder = [
  "job-group",
  "jobnet",
  "unit",
  "relation",
  "attribute",
] as const;

const attributeCategoryOrder = [
  "execution-environment",
  "execution-definition",
  "start-condition",
  "end-control",
  "abnormal-end-control",
  "wait-condition",
  "external-integration",
  "schedule",
] as const;

const unsupportedKindOrder = [
  "unsupported",
  "uninterpretable",
  "uncalculated",
] as const;

const confirmationReasonCodes: readonly SemanticDiffConfirmationReason[] = [
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

const identityStatusOrder: Record<
  SemanticDiffJsonIdentityDecision["status"],
  number
> = {
  exact: 0,
  "fingerprint-confirmed": 1,
  candidate: 2,
  removed: 3,
  added: 4,
};

const compareOrdinal = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

const compareNumber = (left: number, right: number): number =>
  Number(left > right) - Number(left < right);

const compareNullable = <T>(
  left: T | null,
  right: T | null,
  compare: (left: T, right: T) => number,
): number => {
  if (left === null) return right === null ? 0 : -1;
  if (right === null) return 1;
  return compare(left, right);
};

const compareArrays = <T>(
  left: readonly T[],
  right: readonly T[],
  compare: (left: T, right: T) => number,
): number => {
  const sharedLength = Math.min(left.length, right.length);
  for (let index = 0; index < sharedLength; index += 1) {
    const comparison = compare(left[index], right[index]);
    if (comparison !== 0) return comparison;
  }
  return compareNumber(left.length, right.length);
};

const compareStringArrays = (
  left: readonly string[],
  right: readonly string[],
): number => compareArrays(left, right, compareOrdinal);

const sortedStrings = (values: readonly string[]): string[] =>
  [...values].sort(compareOrdinal);

const requiredValue = <T>(value: T | undefined, field: string): T => {
  if (value === undefined) {
    throw new TypeError(`Semantic Diff JSON requires ${field}.`);
  }
  return value;
};

const requiredNullable = <T>(
  value: T | null | undefined,
  field: string,
): T | null => requiredValue(value, field);

const assertNoUndefined = (
  value: unknown,
  path = "$",
  seen = new Set<object>(),
): void => {
  if (value === undefined) {
    throw new TypeError(
      `Semantic Diff JSON has an undefined value at ${path}.`,
    );
  }
  if (value === null || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      assertNoUndefined(entry, `${path}[${index}]`, seen),
    );
    return;
  }
  Object.entries(value).forEach(([key, entry]) =>
    assertNoUndefined(entry, `${path}.${key}`, seen),
  );
};

const finiteNumber = (value: number, field: string): number => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Semantic Diff JSON requires a finite ${field}.`);
  }
  return value;
};

const isConfirmationReason = (
  value: string,
): value is SemanticDiffConfirmationReason =>
  confirmationReasonCodes.some((code) => code === value);

const projectPeriod = (
  value: SemanticDiffComparisonPeriod,
): SemanticDiffJsonPeriod => ({
  from: requiredValue(value.from, "comparison period.from"),
  to: requiredValue(value.to, "comparison period.to"),
});

const comparePeriods = (
  left: SemanticDiffJsonPeriod,
  right: SemanticDiffJsonPeriod,
): number =>
  compareOrdinal(left.from, right.from) || compareOrdinal(left.to, right.to);

const projectUnitReference = (
  reference: SemanticDiffUnitReference,
): SemanticDiffJsonUnitReference => ({
  id: reference.id,
  name: reference.name,
  absolutePath: reference.absolutePath,
  unitType: reference.unitType,
});

const compareUnitReferences = (
  left: SemanticDiffJsonUnitReference,
  right: SemanticDiffJsonUnitReference,
): number =>
  compareOrdinal(left.absolutePath, right.absolutePath) ||
  compareOrdinal(left.unitType, right.unitType) ||
  compareOrdinal(left.name, right.name) ||
  compareOrdinal(left.id, right.id);

const compareUnitReferencesWire = (
  left: SemanticDiffJsonUnitReference,
  right: SemanticDiffJsonUnitReference,
): number =>
  compareOrdinal(left.id, right.id) ||
  compareOrdinal(left.name, right.name) ||
  compareOrdinal(left.absolutePath, right.absolutePath) ||
  compareOrdinal(left.unitType, right.unitType);

const projectUnitReferences = (
  references: readonly SemanticDiffUnitReference[],
): SemanticDiffJsonUnitReference[] =>
  references.map(projectUnitReference).sort(compareUnitReferences);

const projectRelationReference = (
  relation: SemanticDiffRelationReference,
): SemanticDiffJsonRelationReference => ({
  sourceUnitId: relation.sourceUnitId,
  targetUnitId: relation.targetUnitId,
  type: relation.type,
  sourceUnitPath: relation.sourceUnitPath ?? null,
  targetUnitPath: relation.targetUnitPath ?? null,
});

const compareRelationReferences = (
  left: SemanticDiffJsonRelationReference,
  right: SemanticDiffJsonRelationReference,
): number =>
  compareOrdinal(left.sourceUnitId, right.sourceUnitId) ||
  compareOrdinal(left.targetUnitId, right.targetUnitId) ||
  compareOrdinal(left.type, right.type) ||
  compareNullable(left.sourceUnitPath, right.sourceUnitPath, compareOrdinal) ||
  compareNullable(left.targetUnitPath, right.targetUnitPath, compareOrdinal);

const projectScope = (scope: SemanticDiffScope): SemanticDiffJsonScope => ({
  side: scope.side,
  jobGroupPath: scope.jobGroupPath ?? null,
  unitIds: sortedStrings(scope.unitIds),
  relations: scope.relations
    .map(projectRelationReference)
    .sort(compareRelationReferences),
});

const projectInputs = (
  inputs: SemanticDiffInputPair,
): SemanticDiffJsonInputPair => ({
  before: projectScope(inputs.before),
  after: projectScope(inputs.after),
});

const projectCanonicalPair = (
  pair: SemanticDiffRelationPair["canonicalPair"],
): SemanticDiffJsonCanonicalPair => ({
  sourceUnitId: pair.sourceUnitId,
  targetUnitId: pair.targetUnitId,
  type: pair.type,
});

const compareCanonicalPairs = (
  left: SemanticDiffJsonCanonicalPair,
  right: SemanticDiffJsonCanonicalPair,
): number =>
  compareOrdinal(left.sourceUnitId, right.sourceUnitId) ||
  compareOrdinal(left.targetUnitId, right.targetUnitId) ||
  compareOrdinal(left.type, right.type);

const projectEndpoint = (
  endpoint: SemanticDiffRelationEndpoint,
): SemanticDiffJsonRelationEndpoint => ({
  sourceUnitPath: requiredNullable(
    endpoint.sourceUnitPath,
    "relation endpoint.sourceUnitPath",
  ),
  sourceUnitId: endpoint.sourceUnitId,
  targetUnitPath: requiredNullable(
    endpoint.targetUnitPath,
    "relation endpoint.targetUnitPath",
  ),
  targetUnitId: endpoint.targetUnitId,
  type: endpoint.type,
});

const compareEndpoints = (
  left: SemanticDiffJsonRelationEndpoint,
  right: SemanticDiffJsonRelationEndpoint,
): number =>
  compareNullable(left.sourceUnitPath, right.sourceUnitPath, compareOrdinal) ||
  compareOrdinal(left.sourceUnitId, right.sourceUnitId) ||
  compareNullable(left.targetUnitPath, right.targetUnitPath, compareOrdinal) ||
  compareOrdinal(left.targetUnitId, right.targetUnitId) ||
  compareOrdinal(left.type, right.type);

const projectRelationPair = (
  pair: SemanticDiffRelationPair | null,
): SemanticDiffJsonRelationPair | null => {
  if (pair === undefined) {
    throw new TypeError("Semantic Diff JSON requires relationPair.");
  }
  if (pair === null) return null;
  const before = requiredNullable(pair.before, "relationPair.before");
  const after = requiredNullable(pair.after, "relationPair.after");
  return {
    canonicalPair: projectCanonicalPair(pair.canonicalPair),
    before: before ? projectEndpoint(before) : null,
    after: after ? projectEndpoint(after) : null,
  };
};

const compareRelationPairs = (
  left: SemanticDiffJsonRelationPair,
  right: SemanticDiffJsonRelationPair,
): number =>
  compareCanonicalPairs(left.canonicalPair, right.canonicalPair) ||
  compareNullable(left.before, right.before, compareEndpoints) ||
  compareNullable(left.after, right.after, compareEndpoints);

const projectTarget = (target: SemanticDiffTarget): SemanticDiffJsonTarget => {
  switch (target.kind) {
    case "job-group":
      return { kind: "job-group", path: target.path ?? null };
    case "jobnet":
    case "unit":
      return { kind: target.kind, unit: projectUnitReference(target.unit) };
    case "relation":
      return {
        kind: "relation",
        relation: projectRelationReference(target.relation),
      };
    case "attribute":
      return {
        kind: "attribute",
        unit: projectUnitReference(target.unit),
        parameterKey: target.parameterKey,
        category: target.category,
        values: sortedStrings(target.values),
      };
  }
};

const compareTargets = (
  left: SemanticDiffJsonTarget,
  right: SemanticDiffJsonTarget,
): number => {
  const kindComparison = compareOrdinal(left.kind, right.kind);
  if (kindComparison !== 0) return kindComparison;
  switch (left.kind) {
    case "job-group":
      return compareNullable(
        left.path,
        (right as typeof left).path,
        compareOrdinal,
      );
    case "jobnet":
    case "unit":
      return compareUnitReferencesWire(left.unit, (right as typeof left).unit);
    case "relation":
      return compareRelationReferences(
        left.relation,
        (right as typeof left).relation,
      );
    case "attribute": {
      const other = right as typeof left;
      return (
        compareUnitReferencesWire(left.unit, other.unit) ||
        compareOrdinal(left.parameterKey, other.parameterKey) ||
        compareOrdinal(left.category, other.category) ||
        compareStringArrays(left.values, other.values)
      );
    }
  }
};

const projectDetail = (detail: SemanticDiffDetail): SemanticDiffJsonDetail => {
  const scheduleRule = requiredNullable(
    detail.scheduleRule,
    "detail.scheduleRule",
  );
  const period = requiredNullable(detail.period, "detail.period");
  return {
    unitPath: requiredNullable(detail.unitPath, "detail.unitPath"),
    parameterKey: requiredNullable(detail.parameterKey, "detail.parameterKey"),
    relationPair: projectRelationPair(
      requiredNullable(detail.relationPair, "detail.relationPair"),
    ),
    scheduleRule:
      scheduleRule === null
        ? null
        : finiteNumber(scheduleRule, "schedule rule"),
    period: period ? projectPeriod(period) : null,
    beforeValues: sortedStrings(
      requiredValue(detail.beforeValues, "detail.beforeValues"),
    ),
    afterValues: sortedStrings(
      requiredValue(detail.afterValues, "detail.afterValues"),
    ),
    rawValues: sortedStrings(
      requiredValue(detail.rawValues, "detail.rawValues"),
    ),
    removedSources: sortedStrings(
      requiredValue(detail.removedSources, "detail.removedSources"),
    ),
  };
};

const compareDetails = (
  left: SemanticDiffJsonDetail,
  right: SemanticDiffJsonDetail,
): number =>
  compareNullable(left.unitPath, right.unitPath, compareOrdinal) ||
  compareNullable(left.parameterKey, right.parameterKey, compareOrdinal) ||
  compareNullable(
    left.relationPair,
    right.relationPair,
    compareRelationPairs,
  ) ||
  compareNullable(left.scheduleRule, right.scheduleRule, compareNumber) ||
  compareNullable(left.period, right.period, comparePeriods) ||
  compareStringArrays(left.beforeValues, right.beforeValues) ||
  compareStringArrays(left.afterValues, right.afterValues) ||
  compareStringArrays(left.rawValues, right.rawValues) ||
  compareStringArrays(left.removedSources, right.removedSources);

const projectWarning = (
  warning: SemanticDiffWarning | null,
): SemanticDiffJsonWarning | null => {
  if (warning === undefined) {
    throw new TypeError("Semantic Diff JSON requires warning.");
  }
  if (warning === null) return null;
  return {
    code: warning.code,
    detail: projectDetail(warning.detail),
    fallbackText: requiredNullable(
      warning.fallbackText,
      "warning.fallbackText",
    ),
  };
};

const compareWarnings = (
  left: SemanticDiffJsonWarning,
  right: SemanticDiffJsonWarning,
): number =>
  compareOrdinal(left.code, right.code) ||
  compareDetails(left.detail, right.detail) ||
  compareNullable(left.fallbackText, right.fallbackText, compareOrdinal);

const projectConstraint = (
  constraint: SemanticDiffConstraint,
): SemanticDiffJsonConstraint => ({
  code: constraint.code,
  detail: projectDetail(constraint.detail),
  warning: projectWarning(constraint.warning),
});

const compareConstraints = (
  left: SemanticDiffJsonConstraint,
  right: SemanticDiffJsonConstraint,
): number =>
  compareOrdinal(left.code, right.code) ||
  compareDetails(left.detail, right.detail) ||
  compareNullable(left.warning, right.warning, compareWarnings);

const projectIdentityField = (
  field: SemanticDiffIdentityField,
): SemanticDiffJsonIdentityField => ({
  key: field.key,
  presence: field.presence,
  values: [...field.values],
});

const compareIdentityFields = (
  left: SemanticDiffJsonIdentityField,
  right: SemanticDiffJsonIdentityField,
): number =>
  compareOrdinal(left.key, right.key) ||
  compareOrdinal(left.presence, right.presence) ||
  compareStringArrays(left.values, right.values);

const projectIdentityEvidence = (
  evidence: SemanticDiffIdentityDecision["evidence"],
): SemanticDiffJsonIdentityEvidence => {
  if (evidence.kind === "exact-key") {
    if (evidence.key.kind === "jobnet") {
      return {
        kind: "exact-key",
        key: {
          kind: "jobnet",
          jobGroupRelativePath: evidence.key.jobGroupRelativePath,
          unitType: evidence.key.unitType,
        },
      };
    }
    return {
      kind: "exact-key",
      key: {
        kind: "unit",
        parentJobnetPath: evidence.key.parentJobnetPath,
        unitName: evidence.key.unitName,
        unitType: evidence.key.unitType,
      },
    };
  }
  return {
    kind: "fingerprint",
    strategyId: evidence.strategyId,
    unitType: evidence.unitType,
    fields: evidence.fields.map(projectIdentityField),
  };
};

const compareIdentityEvidence = (
  left: SemanticDiffJsonIdentityEvidence,
  right: SemanticDiffJsonIdentityEvidence,
): number => {
  const kindComparison = compareOrdinal(left.kind, right.kind);
  if (kindComparison !== 0) return kindComparison;
  if (left.kind === "exact-key" && right.kind === "exact-key") {
    const keyKindComparison = compareOrdinal(left.key.kind, right.key.kind);
    if (keyKindComparison !== 0) return keyKindComparison;
    if (left.key.kind === "jobnet" && right.key.kind === "jobnet") {
      return (
        compareOrdinal(
          left.key.jobGroupRelativePath,
          right.key.jobGroupRelativePath,
        ) || compareOrdinal(left.key.unitType, right.key.unitType)
      );
    }
    if (left.key.kind === "unit" && right.key.kind === "unit") {
      return (
        compareOrdinal(left.key.parentJobnetPath, right.key.parentJobnetPath) ||
        compareOrdinal(left.key.unitName, right.key.unitName) ||
        compareOrdinal(left.key.unitType, right.key.unitType)
      );
    }
    return 0;
  }
  if (left.kind === "fingerprint" && right.kind === "fingerprint") {
    return (
      compareOrdinal(left.strategyId, right.strategyId) ||
      compareOrdinal(left.unitType, right.unitType) ||
      compareArrays(left.fields, right.fields, compareIdentityFields)
    );
  }
  return 0;
};

const compareIdentityDiscriminators = (
  left: SemanticDiffJsonIdentityDecision,
  right: SemanticDiffJsonIdentityDecision,
): number => {
  const evidenceKindComparison = compareOrdinal(
    left.evidence.kind,
    right.evidence.kind,
  );
  if (evidenceKindComparison !== 0) return evidenceKindComparison;
  if (
    left.evidence.kind === "exact-key" &&
    right.evidence.kind === "exact-key"
  ) {
    return compareOrdinal(left.evidence.key.kind, right.evidence.key.kind);
  }
  if (
    left.evidence.kind === "fingerprint" &&
    right.evidence.kind === "fingerprint"
  ) {
    return (
      compareOrdinal(left.evidence.strategyId, right.evidence.strategyId) ||
      compareOrdinal(left.evidence.unitType, right.evidence.unitType)
    );
  }
  return 0;
};

const projectIdentityDecision = (
  decision: SemanticDiffIdentityDecision,
): SemanticDiffJsonIdentityDecision => ({
  id: decision.id,
  status: decision.status,
  rule: decision.rule,
  before: projectUnitReferences(decision.before),
  after: projectUnitReferences(decision.after),
  evidence: projectIdentityEvidence(decision.evidence),
});

const compareIdentityDecisions = (
  left: SemanticDiffJsonIdentityDecision,
  right: SemanticDiffJsonIdentityDecision,
): number => {
  const statusComparison = compareNumber(
    identityStatusOrder[left.status],
    identityStatusOrder[right.status],
  );
  if (statusComparison !== 0) return statusComparison;

  return (
    compareIdentityDiscriminators(left, right) ||
    compareOrdinal(left.rule, right.rule) ||
    compareArrays(left.before, right.before, compareUnitReferences) ||
    compareArrays(left.after, right.after, compareUnitReferences) ||
    compareIdentityEvidence(left.evidence, right.evidence) ||
    compareOrdinal(left.id, right.id)
  );
};

const projectChange = (change: SemanticDiffChange): SemanticDiffJsonChange => ({
  id: change.id,
  kind: change.kind,
  elementKind: change.elementKind,
  confirmationLevel: change.confirmationLevel,
  identityDecisionId:
    "identityDecisionId" in change
      ? requiredValue(change.identityDecisionId, "change.identityDecisionId")
      : null,
  before: change.before ? projectTarget(change.before) : null,
  after: change.after ? projectTarget(change.after) : null,
  relationPair: projectRelationPair(change.relationPair),
  attributeCategory: change.attributeCategory ?? null,
});

const compareChanges = (
  left: SemanticDiffJsonChange,
  right: SemanticDiffJsonChange,
): number =>
  compareOrdinal(left.id, right.id) ||
  compareOrdinal(left.kind, right.kind) ||
  compareOrdinal(left.elementKind, right.elementKind) ||
  compareOrdinal(left.confirmationLevel, right.confirmationLevel) ||
  compareNullable(
    left.identityDecisionId,
    right.identityDecisionId,
    compareOrdinal,
  ) ||
  compareNullable(left.before, right.before, compareTargets) ||
  compareNullable(left.after, right.after, compareTargets) ||
  compareNullable(
    left.relationPair,
    right.relationPair,
    compareRelationPairs,
  ) ||
  compareNullable(
    left.attributeCategory,
    right.attributeCategory,
    compareOrdinal,
  );

const projectConfirmation = (
  item: SemanticDiffConfirmationRequiredItem,
): SemanticDiffJsonConfirmation => {
  if (!isConfirmationReason(item.reasonCode)) {
    throw new TypeError(
      `Semantic Diff JSON does not support confirmation reason "${item.reasonCode}".`,
    );
  }
  return {
    id: item.id,
    reasonCode: item.reasonCode,
    target: projectTarget(item.target),
    relatedTargets: item.relatedTargets.map(projectTarget).sort(compareTargets),
    detail: projectDetail(item.detail),
    constraints: item.constraints
      .map(projectConstraint)
      .sort(compareConstraints),
    warning: projectWarning(item.warning),
  };
};

const compareConfirmations = (
  left: SemanticDiffJsonConfirmation,
  right: SemanticDiffJsonConfirmation,
): number =>
  compareOrdinal(left.id, right.id) ||
  compareOrdinal(left.reasonCode, right.reasonCode) ||
  compareTargets(left.target, right.target) ||
  compareArrays(left.relatedTargets, right.relatedTargets, compareTargets) ||
  compareDetails(left.detail, right.detail) ||
  compareArrays(left.constraints, right.constraints, compareConstraints) ||
  compareNullable(left.warning, right.warning, compareWarnings);

const projectUnsupported = (
  item: SemanticDiffUnsupportedItem,
): SemanticDiffJsonUnsupported => {
  const side = requiredNullable(item.side, "unsupported.side");
  const target = requiredNullable(item.target, "unsupported.target");
  return {
    id: item.id,
    kind: item.kind,
    side,
    reasonCode: item.reasonCode,
    target: target ? projectTarget(target) : null,
    detail: projectDetail(item.detail),
    warning: projectWarning(item.warning),
  };
};

const compareUnsupported = (
  left: SemanticDiffJsonUnsupported,
  right: SemanticDiffJsonUnsupported,
): number =>
  compareOrdinal(left.id, right.id) ||
  compareOrdinal(left.kind, right.kind) ||
  compareNullable(left.side, right.side, compareOrdinal) ||
  compareOrdinal(left.reasonCode, right.reasonCode) ||
  compareNullable(left.target, right.target, compareTargets) ||
  compareDetails(left.detail, right.detail) ||
  compareNullable(left.warning, right.warning, compareWarnings);

const projectLimitation = (
  limitation: SemanticDiffLimitation,
): SemanticDiffJsonLimitation => ({
  code: limitation.code,
  kind: limitation.kind,
  side: requiredNullable(limitation.side, "limitation.side"),
  unitPath: requiredNullable(limitation.unitPath, "limitation.unitPath"),
  detail: projectDetail(limitation.detail),
  warning: projectWarning(limitation.warning),
});

const compareLimitations = (
  left: SemanticDiffJsonLimitation,
  right: SemanticDiffJsonLimitation,
): number =>
  compareOrdinal(left.code, right.code) ||
  compareOrdinal(left.kind, right.kind) ||
  compareNullable(left.side, right.side, compareOrdinal) ||
  compareNullable(left.unitPath, right.unitPath, compareOrdinal) ||
  compareDetails(left.detail, right.detail) ||
  compareNullable(left.warning, right.warning, compareWarnings);

const projectRun = (run: SemanticDiffScheduleRun): SemanticDiffJsonRun => ({
  unitPath: run.unitPath,
  unitName: run.unitName,
  rule: finiteNumber(run.rule, "schedule rule"),
  date: run.date,
  time: run.time,
});

const compareRuns = (
  left: SemanticDiffJsonRun,
  right: SemanticDiffJsonRun,
): number =>
  compareOrdinal(left.unitPath, right.unitPath) ||
  compareOrdinal(left.unitName, right.unitName) ||
  compareNumber(left.rule, right.rule) ||
  compareOrdinal(left.date, right.date) ||
  compareOrdinal(left.time, right.time);

const projectRunChange = (
  change: SemanticDiffScheduleRunChange,
): SemanticDiffJsonRunChange => {
  const before = requiredNullable(change.before, "schedule run-change.before");
  const after = requiredNullable(change.after, "schedule run-change.after");
  return {
    id: change.id,
    kind: change.kind,
    unitPath: change.unitPath,
    date: change.date,
    before: before ? projectRun(before) : null,
    after: after ? projectRun(after) : null,
  };
};

const compareRunChanges = (
  left: SemanticDiffJsonRunChange,
  right: SemanticDiffJsonRunChange,
): number =>
  compareOrdinal(left.id, right.id) ||
  compareOrdinal(left.kind, right.kind) ||
  compareOrdinal(left.unitPath, right.unitPath) ||
  compareOrdinal(left.date, right.date) ||
  compareNullable(left.before, right.before, compareRuns) ||
  compareNullable(left.after, right.after, compareRuns);

const projectSchedule = (
  result: SemanticDiffResult,
): SemanticDiffJsonSchedule | null =>
  result.scheduleComparison
    ? {
        period: projectPeriod(result.scheduleComparison.period),
        runChanges: result.scheduleComparison.runChanges
          .map(projectRunChange)
          .sort(compareRunChanges),
      }
    : null;

const projectCountMap = <T extends string>(
  source: Readonly<Record<T, number>>,
  keys: readonly T[],
): Record<T, number> => {
  const result = {} as Record<T, number>;
  keys.forEach((key) => {
    result[key] = finiteNumber(source[key], `summary count ${key}`);
  });
  return result;
};

const projectSummary = (
  summary: SemanticDiffJsonSummary,
): SemanticDiffJsonSummary => ({
  changeCountsByKind: projectCountMap(
    summary.changeCountsByKind,
    changeKindOrder,
  ),
  changeCountsByElementKind: projectCountMap(
    summary.changeCountsByElementKind,
    elementKindOrder,
  ),
  changeCountsByAttributeCategory: projectCountMap(
    summary.changeCountsByAttributeCategory,
    attributeCategoryOrder,
  ),
  unsupportedCountsByKind: projectCountMap(
    summary.unsupportedCountsByKind,
    unsupportedKindOrder,
  ),
  confirmationRequiredCount: finiteNumber(
    summary.confirmationRequiredCount,
    "confirmation-required count",
  ),
  limitationCount: finiteNumber(summary.limitationCount, "limitation count"),
  scheduleRunChangeCount: finiteNumber(
    summary.scheduleRunChangeCount,
    "schedule run-change count",
  ),
  hasUncalculated: summary.hasUncalculated,
  hasFindings: summary.hasFindings,
});

const projectResult = (result: SemanticDiffResult): SemanticDiffJsonResult => ({
  inputs: projectInputs(result.inputs),
  identityDecisions: result.identityDecisions
    .map(projectIdentityDecision)
    .sort(compareIdentityDecisions),
  changes: result.changes.map(projectChange).sort(compareChanges),
  confirmationRequired: result.confirmationRequired
    .map(projectConfirmation)
    .sort(compareConfirmations),
  unsupportedItems: result.unsupportedItems
    .map(projectUnsupported)
    .sort(compareUnsupported),
  limitations: result.limitations
    .map(projectLimitation)
    .sort(compareLimitations),
  schedule: projectSchedule(result),
});

/** Build the explicit version 1 JSON DTO without mutating the source context. */
export const buildSemanticDiffJsonV1 = (
  context: SemanticDiffOutputContext,
): SemanticDiffJsonV1 => {
  const document: SemanticDiffJsonV1 = {
    schema: "ajsbutler.semantic-diff",
    schemaVersion: 1,
    summary: projectSummary(context.summary),
    result: projectResult(context.result),
  };
  assertNoUndefined(document);
  return document;
};

/** Serialize one immutable output context as deterministic locale-neutral JSON. */
export const serializeSemanticDiffJson = (
  context: SemanticDiffOutputContext,
): string => `${JSON.stringify(buildSemanticDiffJsonV1(context), null, 2)}\n`;

/** Return JSON content with the media type needed by a later host dispatcher. */
export const renderSemanticDiffJson = (
  context: SemanticDiffOutputContext,
): SemanticDiffJsonOutput => ({
  mediaType: SEMANTIC_DIFF_JSON_MEDIA_TYPE,
  content: serializeSemanticDiffJson(context),
});
