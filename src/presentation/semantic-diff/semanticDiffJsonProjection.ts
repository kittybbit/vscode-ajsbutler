import type {
  SemanticDiffChange,
  SemanticDiffComparisonPeriod,
  SemanticDiffConfirmationReason,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffConstraint,
  SemanticDiffDetail,
  SemanticDiffIdentityDecision,
  SemanticDiffIdentityField,
  SemanticDiffInputPair,
  SemanticDiffLimitation,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffRelationReference,
  SemanticDiffResult,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffScope,
  SemanticDiffTarget,
  SemanticDiffUnitReference,
  SemanticDiffUnsupportedItem,
  SemanticDiffWarning,
} from "../../application/semantic-diff/semanticDiffDto";
import {
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
  type SemanticDiffJsonWarning,
} from "./semanticDiffJson";
import {
  attributeCategoryOrder,
  changeKindOrder,
  compareChanges,
  compareConfirmations,
  compareConstraints,
  compareIdentityDecisions,
  compareLimitations,
  compareRelationReferences,
  compareRunChanges,
  compareTargets,
  compareUnsupported,
  compareUnitReferences,
  confirmationReasonCodes,
  elementKindOrder,
  sortedStrings,
  unsupportedKindOrder,
} from "./semanticDiffJsonOrdering";
import {
  finiteNumber,
  requiredNullable,
  requiredValue,
} from "./semanticDiffJsonValidation";

export const projectPeriod = (
  value: SemanticDiffComparisonPeriod,
): SemanticDiffJsonPeriod => ({
  from: requiredValue(value.from, "comparison period.from"),
  to: requiredValue(value.to, "comparison period.to"),
});

export const projectUnitReference = (
  reference: SemanticDiffUnitReference,
): SemanticDiffJsonUnitReference => ({
  id: reference.id,
  name: reference.name,
  absolutePath: reference.absolutePath,
  unitType: reference.unitType,
});

export const projectUnitReferences = (
  references: readonly SemanticDiffUnitReference[],
): SemanticDiffJsonUnitReference[] =>
  references.map(projectUnitReference).sort(compareUnitReferences);

export const projectRelationReference = (
  relation: SemanticDiffRelationReference,
): SemanticDiffJsonRelationReference => ({
  sourceUnitId: relation.sourceUnitId,
  targetUnitId: relation.targetUnitId,
  type: relation.type,
  sourceUnitPath: relation.sourceUnitPath ?? null,
  targetUnitPath: relation.targetUnitPath ?? null,
});

export const projectScope = (
  scope: SemanticDiffScope,
): SemanticDiffJsonScope => ({
  side: scope.side,
  jobGroupPath: scope.jobGroupPath ?? null,
  unitIds: sortedStrings(scope.unitIds),
  relations: scope.relations
    .map(projectRelationReference)
    .sort(compareRelationReferences),
});

export const projectInputs = (
  inputs: SemanticDiffInputPair,
): SemanticDiffJsonInputPair => ({
  before: projectScope(inputs.before),
  after: projectScope(inputs.after),
});

export const projectCanonicalPair = (
  pair: SemanticDiffRelationPair["canonicalPair"],
): SemanticDiffJsonCanonicalPair => ({
  sourceUnitId: pair.sourceUnitId,
  targetUnitId: pair.targetUnitId,
  type: pair.type,
});

export const projectEndpoint = (
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

const projectOptionalEndpoint = (
  endpoint: SemanticDiffRelationEndpoint | null,
): SemanticDiffJsonRelationEndpoint | null =>
  endpoint === null ? null : projectEndpoint(endpoint);

export const projectRelationPair = (
  pair: SemanticDiffRelationPair | null,
): SemanticDiffJsonRelationPair | null => {
  if (pair === undefined) {
    throw new TypeError("Semantic Diff JSON requires relationPair.");
  }
  if (pair === null) return null;
  return {
    canonicalPair: projectCanonicalPair(pair.canonicalPair),
    before: projectOptionalEndpoint(
      requiredNullable(pair.before, "relationPair.before"),
    ),
    after: projectOptionalEndpoint(
      requiredNullable(pair.after, "relationPair.after"),
    ),
  };
};

type TargetKind = SemanticDiffTarget["kind"];
type TargetFor<K extends TargetKind> = K extends "jobnet" | "unit"
  ? Extract<SemanticDiffTarget, { kind: "jobnet" | "unit" }>
  : Extract<SemanticDiffTarget, { kind: K }>;
type TargetProjector<K extends TargetKind> = (
  target: TargetFor<K>,
) => SemanticDiffJsonTarget;
type TargetProjectors = {
  [K in TargetKind]: TargetProjector<K>;
};

const targetProjectors: TargetProjectors = {
  "job-group": (target) => ({ kind: "job-group", path: target.path ?? null }),
  jobnet: (target) => ({
    kind: "jobnet",
    unit: projectUnitReference(target.unit),
  }),
  unit: (target) => ({
    kind: "unit",
    unit: projectUnitReference(target.unit),
  }),
  relation: (target) => ({
    kind: "relation",
    relation: projectRelationReference(target.relation),
  }),
  attribute: (target) => ({
    kind: "attribute",
    unit: projectUnitReference(target.unit),
    parameterKey: target.parameterKey,
    category: target.category,
    values: sortedStrings(target.values),
  }),
};

export const projectTarget = (
  target: SemanticDiffTarget,
): SemanticDiffJsonTarget => targetProjectors[target.kind](target as never);

export const projectDetail = (
  detail: SemanticDiffDetail,
): SemanticDiffJsonDetail => ({
  unitPath: requiredNullable(detail.unitPath, "detail.unitPath"),
  parameterKey: requiredNullable(detail.parameterKey, "detail.parameterKey"),
  relationPair: projectRelationPair(
    requiredNullable(detail.relationPair, "detail.relationPair"),
  ),
  scheduleRule:
    detail.scheduleRule === null
      ? null
      : finiteNumber(
          requiredValue(detail.scheduleRule, "detail.scheduleRule"),
          "schedule rule",
        ),
  period:
    detail.period === null
      ? null
      : projectPeriod(requiredValue(detail.period, "detail.period")),
  beforeValues: sortedStrings(
    requiredValue(detail.beforeValues, "detail.beforeValues"),
  ),
  afterValues: sortedStrings(
    requiredValue(detail.afterValues, "detail.afterValues"),
  ),
  rawValues: sortedStrings(requiredValue(detail.rawValues, "detail.rawValues")),
  removedSources: sortedStrings(
    requiredValue(detail.removedSources, "detail.removedSources"),
  ),
});

export const projectWarning = (
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

export const projectConstraint = (
  constraint: SemanticDiffConstraint,
): SemanticDiffJsonConstraint => ({
  code: constraint.code,
  detail: projectDetail(constraint.detail),
  warning: projectWarning(constraint.warning),
});

const projectIdentityField = (
  field: SemanticDiffIdentityField,
): SemanticDiffJsonIdentityField => ({
  key: field.key,
  presence: field.presence,
  values: [...field.values],
});

const projectExactKeyEvidence = (
  evidence: Extract<
    SemanticDiffIdentityDecision["evidence"],
    { kind: "exact-key" }
  >,
): SemanticDiffJsonIdentityEvidence => {
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
};

export const projectIdentityEvidence = (
  evidence: SemanticDiffIdentityDecision["evidence"],
): SemanticDiffJsonIdentityEvidence => {
  if (evidence.kind === "exact-key") {
    return projectExactKeyEvidence(evidence);
  }
  return {
    kind: "fingerprint",
    strategyId: evidence.strategyId,
    unitType: evidence.unitType,
    fields: evidence.fields.map(projectIdentityField),
  };
};

export const projectIdentityDecision = (
  decision: SemanticDiffIdentityDecision,
): SemanticDiffJsonIdentityDecision => ({
  id: decision.id,
  status: decision.status,
  rule: decision.rule,
  before: projectUnitReferences(decision.before),
  after: projectUnitReferences(decision.after),
  evidence: projectIdentityEvidence(decision.evidence),
});

const projectIdentityDecisionId = (
  change: SemanticDiffChange,
): string | null =>
  "identityDecisionId" in change
    ? requiredValue(change.identityDecisionId, "change.identityDecisionId")
    : null;

const projectOptionalTarget = (
  target: SemanticDiffTarget | null | undefined,
): SemanticDiffJsonTarget | null => {
  if (target === undefined) return null;
  if (target === null) return null;
  return projectTarget(target);
};

export const projectChange = (
  change: SemanticDiffChange,
): SemanticDiffJsonChange => ({
  id: requiredValue(change.id, "change.id"),
  kind: change.kind,
  elementKind: change.elementKind,
  confirmationLevel: change.confirmationLevel,
  identityDecisionId: projectIdentityDecisionId(change),
  before: projectOptionalTarget(change.before),
  after: projectOptionalTarget(change.after),
  relationPair: projectRelationPair(change.relationPair),
  attributeCategory: change.attributeCategory ?? null,
});

const isConfirmationReason = (
  value: string,
  reasonCodes: readonly SemanticDiffConfirmationReason[],
): value is SemanticDiffConfirmationReason =>
  reasonCodes.includes(value as SemanticDiffConfirmationReason);

const requireConfirmationReason = (
  reasonCode: string,
): SemanticDiffConfirmationReason => {
  if (!isConfirmationReason(reasonCode, confirmationReasonCodes)) {
    throw new TypeError(
      `Semantic Diff JSON does not support confirmation reason "${reasonCode}".`,
    );
  }
  return reasonCode;
};

export const projectConfirmation = (
  item: SemanticDiffConfirmationRequiredItem,
): SemanticDiffJsonConfirmation => ({
  id: item.id,
  reasonCode: requireConfirmationReason(item.reasonCode),
  target: projectTarget(item.target),
  relatedTargets: item.relatedTargets.map(projectTarget).sort(compareTargets),
  detail: projectDetail(item.detail),
  constraints: item.constraints.map(projectConstraint).sort(compareConstraints),
  warning: projectWarning(item.warning),
});

export const projectUnsupported = (
  item: SemanticDiffUnsupportedItem,
): SemanticDiffJsonUnsupported => {
  const side = requiredNullable(item.side, "unsupported.side");
  const target = requiredNullable(item.target, "unsupported.target");
  return {
    id: item.id,
    kind: item.kind,
    side,
    reasonCode: item.reasonCode,
    target: target === null ? null : projectTarget(target),
    detail: projectDetail(item.detail),
    warning: projectWarning(item.warning),
  };
};

export const projectLimitation = (
  limitation: SemanticDiffLimitation,
): SemanticDiffJsonLimitation => ({
  code: limitation.code,
  kind: limitation.kind,
  side: requiredNullable(limitation.side, "limitation.side"),
  unitPath: requiredNullable(limitation.unitPath, "limitation.unitPath"),
  detail: projectDetail(limitation.detail),
  warning: projectWarning(limitation.warning),
});

export const projectRun = (
  run: SemanticDiffScheduleRun,
): SemanticDiffJsonRun => ({
  unitPath: run.unitPath,
  unitName: run.unitName,
  rule: finiteNumber(run.rule, "schedule rule"),
  date: run.date,
  time: run.time,
});

const projectOptionalRun = (
  run: SemanticDiffScheduleRun | null,
  field: string,
): SemanticDiffJsonRun | null => {
  const requiredRun = requiredNullable(run, field);
  if (requiredRun === null) return null;
  return projectRun(requiredRun);
};

export const projectRunChange = (
  change: SemanticDiffScheduleRunChange,
): SemanticDiffJsonRunChange => ({
  id: change.id,
  kind: change.kind,
  unitPath: change.unitPath,
  date: change.date,
  before: projectOptionalRun(change.before, "schedule run-change.before"),
  after: projectOptionalRun(change.after, "schedule run-change.after"),
});

export const projectSchedule = (
  result: SemanticDiffResult,
): SemanticDiffJsonSchedule | null =>
  result.scheduleComparison === undefined
    ? null
    : {
        period: projectPeriod(result.scheduleComparison.period),
        runChanges: result.scheduleComparison.runChanges
          .map(projectRunChange)
          .sort(compareRunChanges),
      };

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

export const projectSummary = (
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

export const projectResult = (
  result: SemanticDiffResult,
): SemanticDiffJsonResult => ({
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
