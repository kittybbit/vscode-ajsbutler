import type { SemanticDiffExplorerLeaf } from "./semanticDiffExplorerDto";
import {
  asPlainRecord,
  hasExactKeys,
  isDenseArray,
  isNullableString,
  isSide,
} from "./semanticDiffExplorerMessagePrimitives";
import {
  isRelationPair,
  isScheduleRunChange,
  isSemanticDiffConstraint,
  isSemanticDiffDetail,
  isSemanticDiffExplorerActionSet,
  isSemanticDiffTarget,
  isSemanticDiffWarning,
  targetProjectionMatchesSide,
} from "./semanticDiffExplorerRecordGuards";

const all = (checks: readonly boolean[]): boolean => checks.every(Boolean);
const isKnown = (set: ReadonlySet<string>, value: unknown): boolean =>
  typeof value === "string" && set.has(value);

const changeKinds = new Set([
  "added",
  "removed",
  "changed",
  "renamed",
  "moved",
]);
const elementKinds = new Set([
  "job-group",
  "jobnet",
  "unit",
  "relation",
  "attribute",
]);
const confirmationLevels = new Set([
  "confirmed",
  "candidate",
  "confirmation-required",
  "unsupported",
]);
const confirmationReasons = new Set([
  "conditional-relation-removed",
  "wait-release-source-changed",
  "timeout-removed",
  "condition-judgment-changed",
  "wait-target-changed",
  "no-calculated-schedule-run",
  "calculated-schedule-run-removed",
  "execution-user-type-changed",
  "jp1-resource-group-changed",
]);
const unsupportedKinds = new Set([
  "unsupported",
  "uninterpretable",
  "uncalculated",
]);
const unsupportedReasons = new Set([
  "uninterpretable-file-monitoring-condition",
  "cycle-schedule",
  "closed-day-substitution",
  "shift-days",
  "calendar-selection",
  "inherited-parent-rule",
  "days-from-start",
  "invalid-start-time",
  "unpaired-start-time",
  "unsupported-schedule-date",
  "missing-start-time",
  "invalid-calendar-day",
  "invalid-schedule-comparison-period",
]);
const limitationKinds = new Set([
  "parse",
  "normalization",
  "unsupported",
  "uninterpretable",
  "uncalculated",
]);

const isLeafIdentity = (record: Record<string, unknown>): boolean =>
  typeof record.id === "string" && typeof record.recordId === "string";

const isLeafEnvelope = (record: Record<string, unknown>): boolean =>
  isLeafIdentity(record) && isSemanticDiffExplorerActionSet(record.actions);

const changeKeys = [
  "kind",
  "id",
  "recordId",
  "changeKind",
  "elementKind",
  "confirmationLevel",
  "attributeCategory",
  "identityDecisionId",
  "targetSide",
  "target",
  "before",
  "after",
  "relationPair",
  "detail",
  "constraints",
  "warning",
  "actions",
];

const isChangeFacts = (record: Record<string, unknown>): boolean =>
  all([
    isKnown(changeKinds, record.changeKind),
    isKnown(elementKinds, record.elementKind),
    isKnown(confirmationLevels, record.confirmationLevel),
    record.attributeCategory === null ||
      typeof record.attributeCategory === "string",
    record.identityDecisionId === null ||
      typeof record.identityDecisionId === "string",
    isSide(record.targetSide),
    targetProjectionMatchesSide(record.target, record.targetSide),
  ]);

const isChangeDetails = (record: Record<string, unknown>): boolean => {
  const constraints = isDenseArray(record.constraints);
  const constraintValues =
    constraints &&
    (record.constraints as unknown[]).every(isSemanticDiffConstraint);
  return all([
    record.before === null || isSemanticDiffTarget(record.before),
    record.after === null || isSemanticDiffTarget(record.after),
    record.relationPair === null || isRelationPair(record.relationPair),
    record.detail === null,
    constraints,
    constraintValues,
    record.warning === null || isSemanticDiffWarning(record.warning),
  ]);
};

const isChangeLeaf = (record: Record<string, unknown>): boolean =>
  all([
    hasExactKeys(record, changeKeys),
    isChangeFacts(record),
    isChangeDetails(record),
  ]);

const confirmationKeys = [
  "kind",
  "id",
  "recordId",
  "reasonCode",
  "targetSide",
  "target",
  "relatedTargets",
  "detail",
  "constraints",
  "warning",
  "actions",
];

const isConfirmationFacts = (record: Record<string, unknown>): boolean =>
  all([
    isKnown(confirmationReasons, record.reasonCode),
    isSide(record.targetSide),
    targetProjectionMatchesSide(record.target, record.targetSide),
  ]);

const isConfirmationDetails = (record: Record<string, unknown>): boolean => {
  const relatedTargets = isDenseArray(record.relatedTargets);
  const constraints = isDenseArray(record.constraints);
  return all([
    relatedTargets &&
      (record.relatedTargets as unknown[]).every(isSemanticDiffTarget),
    isSemanticDiffDetail(record.detail),
    constraints &&
      (record.constraints as unknown[]).every(isSemanticDiffConstraint),
    record.warning === null || isSemanticDiffWarning(record.warning),
  ]);
};

const isConfirmationLeaf = (record: Record<string, unknown>): boolean =>
  all([
    hasExactKeys(record, confirmationKeys),
    isConfirmationFacts(record),
    isConfirmationDetails(record),
  ]);

const unsupportedKeys = [
  "kind",
  "id",
  "recordId",
  "unsupportedKind",
  "reasonCode",
  "targetSide",
  "target",
  "detail",
  "warning",
  "actions",
];

const isUnsupportedLeaf = (record: Record<string, unknown>): boolean =>
  all([
    hasExactKeys(record, unsupportedKeys),
    isKnown(unsupportedKinds, record.unsupportedKind),
    isKnown(unsupportedReasons, record.reasonCode),
    isSide(record.targetSide),
    targetProjectionMatchesSide(record.target, record.targetSide),
    isSemanticDiffDetail(record.detail),
    record.warning === null || isSemanticDiffWarning(record.warning),
  ]);

const limitationKeys = [
  "kind",
  "id",
  "recordId",
  "limitationKind",
  "code",
  "targetSide",
  "unitPath",
  "detail",
  "warning",
  "actions",
];

const isLimitationLeaf = (record: Record<string, unknown>): boolean =>
  all([
    hasExactKeys(record, limitationKeys),
    isKnown(limitationKinds, record.limitationKind),
    typeof record.code === "string",
    isSide(record.targetSide),
    isNullableString(record.unitPath),
    isSemanticDiffDetail(record.detail),
    record.warning === null || isSemanticDiffWarning(record.warning),
  ]);

const isScheduleLeaf = (record: Record<string, unknown>): boolean => {
  const target = asPlainRecord(record.target);
  return all([
    hasExactKeys(record, [
      "kind",
      "id",
      "recordId",
      "change",
      "targetSide",
      "target",
      "actions",
    ]),
    isScheduleRunChange(record.change),
    record.targetSide === null,
    targetProjectionMatchesSide(record.target, null),
    target !== null && target.value === null,
  ]);
};

const leafChecks = new Map<
  string,
  (record: Record<string, unknown>) => boolean
>([
  ["change", isChangeLeaf],
  ["confirmation", isConfirmationLeaf],
  ["unsupported", isUnsupportedLeaf],
  ["limitation", isLimitationLeaf],
  ["schedule", isScheduleLeaf],
]);

const leafKinds = new Set(leafChecks.keys());

export const isSemanticDiffExplorerLeaf = (
  value: unknown,
): value is SemanticDiffExplorerLeaf => {
  const record = asPlainRecord(value);
  if (record === null || typeof record.kind !== "string") return false;
  const check = leafChecks.get(record.kind);
  return (
    check !== undefined &&
    leafKinds.has(record.kind) &&
    isLeafEnvelope(record) &&
    check(record)
  );
};
