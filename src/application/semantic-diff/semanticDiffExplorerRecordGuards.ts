import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffConstraint,
  SemanticDiffDetail,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffTarget,
  SemanticDiffWarning,
} from "./semanticDiffDto";
import type {
  ExplorerError,
  SemanticDiffExplorerActionAvailability,
  SemanticDiffExplorerActionOutcome,
  SemanticDiffExplorerActionSet,
} from "./semanticDiffExplorerMessages";
import {
  asPlainRecord,
  hasExactKeys,
  isNullableString,
  isRelationType,
  isSide,
  isStringArray,
} from "./semanticDiffExplorerMessagePrimitives";
import { isSemanticDiffExplorerActionId } from "./semanticDiffExplorerDto";

const all = (checks: readonly boolean[]): boolean => checks.every(Boolean);
const isKnown = (set: ReadonlySet<string>, value: unknown): boolean =>
  typeof value === "string" && set.has(value);

const attributeCategories = new Set([
  "execution-environment",
  "execution-definition",
  "start-condition",
  "end-control",
  "abnormal-end-control",
  "wait-condition",
  "external-integration",
  "schedule",
]);
const constraintCodes = new Set([
  "jp1-ajs3-v13-rule-basis",
  "runtime-state-not-verified",
  "external-state-not-verified",
  "comparison-period",
]);
const actionKinds = new Set(["source", "flow", "output"]);
const errorCodes = new Set([
  "invalid-request",
  "unknown-session",
  "unknown-action",
  "stale-request",
  "superseded-session",
  "disposed-session",
  "record-not-found",
  "unavailable-target",
  "stale-source",
  "source-lookup-failed",
  "flow-not-ready",
  "flow-target-missing",
  "output-failed",
  "payload-too-large",
  "host-disposed",
]);

const isUnitReference = (value: unknown): boolean => {
  const record = asPlainRecord(value);
  if (record === null) return false;
  const shape = hasExactKeys(record, ["id", "name", "absolutePath", "unitType"]);
  const values = Object.values(record).every((entry) => typeof entry === "string");
  return shape && values;
};

const relationReferenceKeys = [
  "sourceUnitId",
  "targetUnitId",
  "type",
  "sourceUnitPath",
  "targetUnitPath",
];

const hasRelationReferenceKeys = (record: Record<string, unknown>): boolean => {
  const keys = Object.keys(record);
  const required = ["sourceUnitId", "targetUnitId", "type"];
  return all([
    keys.length >= required.length,
    keys.every((key) => relationReferenceKeys.includes(key)),
    required.every((key) => keys.includes(key)),
  ]);
};

const hasRelationReferenceValues = (
  record: Record<string, unknown>,
): boolean => {
  const sourcePath =
    !Object.hasOwn(record, "sourceUnitPath") ||
    typeof record.sourceUnitPath === "string";
  const targetPath =
    !Object.hasOwn(record, "targetUnitPath") ||
    typeof record.targetUnitPath === "string";
  return all([
    typeof record.sourceUnitId === "string",
    typeof record.targetUnitId === "string",
    isRelationType(record.type),
    sourcePath,
    targetPath,
  ]);
};

const isRelationReference = (value: unknown): boolean => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([hasRelationReferenceKeys(record), hasRelationReferenceValues(record)]);
};

const relationEndpointKeys = [
  "sourceUnitPath",
  "sourceUnitId",
  "targetUnitPath",
  "targetUnitId",
  "type",
];

const isRelationEndpoint = (
  value: unknown,
): value is SemanticDiffRelationEndpoint => {
  const record = asPlainRecord(value);
  if (record === null || !hasExactKeys(record, relationEndpointKeys)) {
    return false;
  }
  return all([
    isNullableString(record.sourceUnitPath),
    typeof record.sourceUnitId === "string",
    isNullableString(record.targetUnitPath),
    typeof record.targetUnitId === "string",
    isRelationType(record.type),
  ]);
};

const isCanonicalPair = (value: unknown): value is Record<string, unknown> => {
  const record = asPlainRecord(value);
  if (record === null) return false;
  return all([
    hasExactKeys(record, ["sourceUnitId", "targetUnitId", "type"]),
    typeof record.sourceUnitId === "string",
    typeof record.targetUnitId === "string",
    isRelationType(record.type),
  ]);
};

const endpointMatchesPair = (
  endpoint: unknown,
  pair: Record<string, unknown>,
): boolean => {
  const record = asPlainRecord(endpoint);
  if (record === null) return endpoint === null;
  return all([
    isRelationEndpoint(record),
    record.sourceUnitId === pair.sourceUnitId,
    record.targetUnitId === pair.targetUnitId,
    record.type === pair.type,
  ]);
};

export const isRelationPair = (
  value: unknown,
): value is SemanticDiffRelationPair => {
  const record = asPlainRecord(value);
  return record !== null && isRelationPairRecord(record);
};

const isRelationPairRecord = (record: Record<string, unknown>): boolean => {
  const pair = asPlainRecord(record.canonicalPair);
  const shape = hasExactKeys(record, ["canonicalPair", "before", "after"]);
  if (pair === null || !isCanonicalPair(pair)) return false;
  const endpoints = all([
    record.before === null || isRelationEndpoint(record.before),
    record.after === null || isRelationEndpoint(record.after),
  ]);
  return all([
    shape,
    endpoints,
    endpointMatchesPair(record.before, pair),
    endpointMatchesPair(record.after, pair),
  ]);
};

export const isComparisonPeriod = (
  value: unknown,
): value is SemanticDiffComparisonPeriod => {
  const record = asPlainRecord(value);
  if (record === null) return false;
  return all([
    hasExactKeys(record, ["from", "to"]),
    typeof record.from === "string",
    typeof record.to === "string",
  ]);
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const detailKeys = [
  "unitPath",
  "parameterKey",
  "relationPair",
  "scheduleRule",
  "period",
  "beforeValues",
  "afterValues",
  "rawValues",
  "removedSources",
];

const hasDetailScalars = (record: Record<string, unknown>): boolean =>
  all([
    isNullableString(record.unitPath),
    isNullableString(record.parameterKey),
    record.relationPair === null || isRelationPair(record.relationPair),
    record.scheduleRule === null || isFiniteNumber(record.scheduleRule),
    record.period === null || isComparisonPeriod(record.period),
  ]);

const hasDetailArrays = (record: Record<string, unknown>): boolean =>
  all([
    isStringArray(record.beforeValues),
    isStringArray(record.afterValues),
    isStringArray(record.rawValues),
    isStringArray(record.removedSources),
  ]);

export const isSemanticDiffDetail = (
  value: unknown,
): value is SemanticDiffDetail => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([hasExactKeys(record, detailKeys), hasDetailScalars(record), hasDetailArrays(record)]);
};

export const isSemanticDiffWarning = (
  value: unknown,
): value is SemanticDiffWarning => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["code", "detail", "fallbackText"]),
      typeof record.code === "string",
      isSemanticDiffDetail(record.detail),
      isNullableString(record.fallbackText),
    ]);
};

export const isSemanticDiffConstraint = (
  value: unknown,
): value is SemanticDiffConstraint => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["code", "detail", "warning"]),
      isKnown(constraintCodes, record.code),
      isSemanticDiffDetail(record.detail),
      record.warning === null || isSemanticDiffWarning(record.warning),
    ]);
};

const isJobGroupTarget = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["kind"]) ||
  (hasExactKeys(record, ["kind", "path"]) && typeof record.path === "string");
const isUnitTarget = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["kind", "unit"]) && isUnitReference(record.unit);
const isRelationTarget = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["kind", "relation"]) && isRelationReference(record.relation);
const isAttributeTarget = (record: Record<string, unknown>): boolean =>
  all([
    hasExactKeys(record, ["kind", "unit", "parameterKey", "category", "values"]),
    isUnitReference(record.unit),
    typeof record.parameterKey === "string",
    isKnown(attributeCategories, record.category),
    isStringArray(record.values),
  ]);

const targetChecks = new Map<string, (record: Record<string, unknown>) => boolean>([
  ["job-group", isJobGroupTarget],
  ["unit", isUnitTarget],
  ["jobnet", isUnitTarget],
  ["relation", isRelationTarget],
  ["attribute", isAttributeTarget],
]);

export const isSemanticDiffTarget = (
  value: unknown,
): value is SemanticDiffTarget => {
  const record = asPlainRecord(value);
  if (record === null || typeof record.kind !== "string") return false;
  const check = targetChecks.get(record.kind);
  return check !== undefined && check(record);
};

const unavailableReasons = new Set([
  "missing-target-side",
  "missing-target",
  "unsupported-target",
]);

const isAvailableAction = (record: Record<string, unknown>): boolean =>
  isSemanticDiffExplorerActionId(record.actionId) && record.unavailableReason === null;
const isUnavailableAction = (record: Record<string, unknown>): boolean =>
  record.actionId === null && isKnown(unavailableReasons, record.unavailableReason);

const isActionAvailabilityShape = (record: Record<string, unknown>): boolean =>
  hasExactKeys(record, ["available", "actionId", "unavailableReason"]) &&
  typeof record.available === "boolean";

const isActionAvailabilityValue = (record: Record<string, unknown>): boolean =>
  record.available
    ? isAvailableAction(record)
    : isUnavailableAction(record);

export const isSemanticDiffExplorerActionAvailability = (
  value: unknown,
): value is SemanticDiffExplorerActionAvailability => {
  const record = asPlainRecord(value);
  if (record === null) return false;
  return all([isActionAvailabilityShape(record), isActionAvailabilityValue(record)]);
};

export const isSemanticDiffExplorerActionSet = (
  value: unknown,
): value is SemanticDiffExplorerActionSet => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["source", "flow"]),
      isSemanticDiffExplorerActionAvailability(record.source),
      isSemanticDiffExplorerActionAvailability(record.flow),
    ]);
};

const isTargetProjection = (value: unknown): boolean => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["side", "value"]),
      isSide(record.side),
      record.value === null || isSemanticDiffTarget(record.value),
    ]);
};

export const targetProjectionMatchesSide = (
  value: unknown,
  side: unknown,
): boolean => {
  const record = asPlainRecord(value);
  return record !== null && isTargetProjection(record) && record.side === side;
};

export const isScheduleRun = (value: unknown): value is SemanticDiffScheduleRun => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["unitPath", "unitName", "rule", "date", "time"]),
      typeof record.unitPath === "string",
      typeof record.unitName === "string",
      isFiniteNumber(record.rule),
      typeof record.date === "string",
      typeof record.time === "string",
    ]);
};

const isScheduleKind = (value: unknown): boolean =>
  value === "added" || value === "removed" || value === "changed-time";

const addedSides = (record: Record<string, unknown>): boolean =>
  record.before === null && record.after !== null;
const removedSides = (record: Record<string, unknown>): boolean =>
  record.before !== null && record.after === null;
const changedSides = (record: Record<string, unknown>): boolean =>
  record.before !== null && record.after !== null;

const scheduleSideChecks = new Map<string, (record: Record<string, unknown>) => boolean>([
  ["added", addedSides],
  ["removed", removedSides],
  ["changed-time", changedSides],
]);

const scheduleSidesMatch = (record: Record<string, unknown>): boolean =>
  scheduleSideChecks.get(record.kind as string)?.(record) ?? false;

export const isScheduleRunChange = (
  value: unknown,
): value is SemanticDiffScheduleRunChange => {
  const record = asPlainRecord(value);
  if (record === null || !hasExactKeys(record, ["id", "kind", "unitPath", "date", "before", "after"])) {
    return false;
  }
  const beforeValid = record.before === null || isScheduleRun(record.before);
  const afterValid = record.after === null || isScheduleRun(record.after);
  return all([
    typeof record.id === "string",
    isScheduleKind(record.kind),
    typeof record.unitPath === "string",
    typeof record.date === "string",
    beforeValid,
    afterValid,
    scheduleSidesMatch(record),
  ]);
};

export const isSemanticDiffExplorerActionOutcome = (
  value: unknown,
): value is SemanticDiffExplorerActionOutcome => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["kind", "status", "side", "targetId"]),
      isKnown(actionKinds, record.kind),
      record.status === "completed" || record.status === "unavailable",
      isSide(record.side),
      isNullableString(record.targetId),
    ]);
};

const isErrorDetail = (value: unknown): boolean => {
  const record = asPlainRecord(value);
  return record !== null &&
    all([
      hasExactKeys(record, ["side", "targetId"]),
      isSide(record.side),
      isNullableString(record.targetId),
    ]);
};

export const isSemanticDiffExplorerError = (
  value: unknown,
): value is ExplorerError => {
  const record = asPlainRecord(value);
  if (record === null || !hasExactKeys(record, ["code", "detail"])) {
    return false;
  }
  return all([
    isKnown(errorCodes, record.code),
    record.detail === null || isErrorDetail(record.detail),
  ]);
};
