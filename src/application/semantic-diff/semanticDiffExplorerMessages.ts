import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerActionAvailability,
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerCard,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerTreeNode,
  SemanticDiffExplorerViewModel,
} from "./semanticDiffExplorerDto";
import {
  isSemanticDiffExplorerActionId,
  isSemanticDiffExplorerSessionId,
} from "./semanticDiffExplorerDto";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffDetail,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRun,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffWarning,
  SemanticDiffConstraint,
} from "./semanticDiffDto";

export const SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES = 8 * 1024 * 1024;

export type SemanticDiffExplorerErrorCode =
  | "invalid-request"
  | "unknown-session"
  | "unknown-action"
  | "stale-request"
  | "superseded-session"
  | "disposed-session"
  | "record-not-found"
  | "unavailable-target"
  | "stale-source"
  | "source-lookup-failed"
  | "flow-not-ready"
  | "flow-target-missing"
  | "output-failed"
  | "payload-too-large"
  | "host-disposed";

export type ErrorCode = SemanticDiffExplorerErrorCode;

export type SemanticDiffExplorerErrorDetail = Readonly<{
  side: SemanticDiffSide | null;
  targetId: string | null;
}>;

export type ExplorerError = Readonly<{
  code: SemanticDiffExplorerErrorCode;
  detail: SemanticDiffExplorerErrorDetail | null;
}>;

export type SemanticDiffExplorerActionOutcome = Readonly<{
  kind: "source" | "flow" | "output";
  status: "completed" | "unavailable";
  side: SemanticDiffSide | null;
  targetId: string | null;
}>;

export type SemanticDiffExplorerReadyRequest = Readonly<{
  type: "ready";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: null;
}>;

export type SemanticDiffExplorerRefreshRequest = Readonly<{
  type: "refresh";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: null;
}>;

export type SemanticDiffExplorerActionRequest = Readonly<{
  type: "action";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: SemanticDiffExplorerActionId;
}>;

export type SemanticDiffExplorerRequest =
  | SemanticDiffExplorerReadyRequest
  | SemanticDiffExplorerRefreshRequest
  | SemanticDiffExplorerActionRequest;

export type SemanticDiffExplorerReadyReply = Readonly<{
  type: "ready" | "refreshed";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: null;
  ok: boolean;
  payload: SemanticDiffExplorerViewModel | null;
  error: ExplorerError | null;
}>;

export type SemanticDiffExplorerActionReply = Readonly<{
  type: "action";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: SemanticDiffExplorerActionId;
  ok: boolean;
  payload: SemanticDiffExplorerActionOutcome | null;
  error: ExplorerError | null;
}>;

export type SemanticDiffExplorerReply =
  | SemanticDiffExplorerReadyReply
  | SemanticDiffExplorerActionReply;

export type SemanticDiffExplorerSessionMessage = Readonly<{
  type: "session";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: null;
  actionId: null;
  ok: true;
  payload: SemanticDiffExplorerViewModel;
  error: null;
}>;

export type SemanticDiffExplorerActionResultMessage = Readonly<{
  type: "action-result";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: number;
  actionId: SemanticDiffExplorerActionId;
  ok: boolean;
  payload: SemanticDiffExplorerActionOutcome | null;
  error: ExplorerError | null;
}>;

export type SemanticDiffExplorerFailureMessage = Readonly<{
  type: "failure";
  sessionId: SemanticDiffExplorerSessionId | null;
  requestId: number | null;
  actionId: SemanticDiffExplorerActionId | null;
  ok: false;
  payload: null;
  error: ExplorerError;
}>;

export type SemanticDiffExplorerCloseMessage = Readonly<{
  type: "close";
  sessionId: SemanticDiffExplorerSessionId;
  requestId: null;
  actionId: null;
  ok: true;
  payload: null;
  error: null;
}>;

export type SemanticDiffExplorerHostMessage =
  | SemanticDiffExplorerSessionMessage
  | SemanticDiffExplorerActionResultMessage
  | SemanticDiffExplorerFailureMessage
  | SemanticDiffExplorerCloseMessage;

export type SemanticDiffExplorerMessage =
  | SemanticDiffExplorerRequest
  | SemanticDiffExplorerReply
  | SemanticDiffExplorerHostMessage;

export type SemanticDiffExplorerMessageValidationOptions = Readonly<{
  expectedSessionId?: SemanticDiffExplorerSessionId;
  actionIds?:
    | SemanticDiffExplorerActionLookup
    | ReadonlySet<SemanticDiffExplorerActionId>;
  minimumRequestId?: number;
  maxBytes?: number;
}>;

export type SemanticDiffExplorerMessageValidationResult =
  | Readonly<{ ok: true; value: SemanticDiffExplorerMessage }>
  | Readonly<{
      ok: false;
      code:
        | "invalid-request"
        | "unknown-session"
        | "unknown-action"
        | "stale-request"
        | "payload-too-large";
    }>;

const errorCodes: ReadonlySet<string> = new Set([
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
const unsupportedKinds = new Set([
  "unsupported",
  "uninterpretable",
  "uncalculated",
]);
const leafKinds = new Set([
  "change",
  "confirmation",
  "unsupported",
  "limitation",
  "schedule",
]);
const actionKinds = new Set(["source", "flow", "output"]);
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
const constraintCodes = new Set([
  "jp1-ajs3-v13-rule-basis",
  "runtime-state-not-verified",
  "external-state-not-verified",
  "comparison-period",
]);

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

const hasExactKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const actual = Object.keys(value);
  return (
    actual.length === keys.length && keys.every((key) => actual.includes(key))
  );
};

const isFinitePositiveInteger = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  Number.isSafeInteger(value) &&
  value > 0;

const isDenseArray = (value: unknown): value is unknown[] => {
  if (!Array.isArray(value) || Object.keys(value).length !== value.length)
    return false;
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) return false;
  }
  return true;
};

const isJsonValue = (
  value: unknown,
  ancestors = new Set<object>(),
): boolean => {
  if (value === null) return true;
  switch (typeof value) {
    case "string":
    case "boolean":
      return true;
    case "number":
      return Number.isFinite(value);
    case "object":
      break;
    default:
      return false;
  }
  if (ancestors.has(value)) return false;
  const nextAncestors = new Set(ancestors);
  nextAncestors.add(value);
  if (Array.isArray(value))
    return (
      isDenseArray(value) &&
      value.every((item) => isJsonValue(item, nextAncestors))
    );
  return (
    isPlainRecord(value) &&
    Object.values(value).every((item) => isJsonValue(item, nextAncestors))
  );
};

const isStringArray = (value: unknown): value is string[] =>
  isDenseArray(value) && value.every((item) => typeof item === "string");

const isUnitReference = (value: unknown): boolean =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["id", "name", "absolutePath", "unitType"]) &&
  Object.values(value).every((entry) => typeof entry === "string");

const isRelationReference = (value: unknown): boolean => {
  if (!isPlainRecord(value)) return false;
  const keys = Object.keys(value);
  const allowed = [
    "sourceUnitId",
    "targetUnitId",
    "type",
    "sourceUnitPath",
    "targetUnitPath",
  ];
  return (
    keys.length >= 3 &&
    keys.every((key) => allowed.includes(key)) &&
    keys.includes("sourceUnitId") &&
    keys.includes("targetUnitId") &&
    keys.includes("type") &&
    typeof value.sourceUnitId === "string" &&
    typeof value.targetUnitId === "string" &&
    (value.type === "seq" || value.type === "con") &&
    (!keys.includes("sourceUnitPath") ||
      typeof value.sourceUnitPath === "string") &&
    (!keys.includes("targetUnitPath") ||
      typeof value.targetUnitPath === "string")
  );
};

const isRelationEndpoint = (
  value: unknown,
): value is SemanticDiffRelationEndpoint =>
  isPlainRecord(value) &&
  hasExactKeys(value, [
    "sourceUnitPath",
    "sourceUnitId",
    "targetUnitPath",
    "targetUnitId",
    "type",
  ]) &&
  (value.sourceUnitPath === null || typeof value.sourceUnitPath === "string") &&
  typeof value.sourceUnitId === "string" &&
  (value.targetUnitPath === null || typeof value.targetUnitPath === "string") &&
  typeof value.targetUnitId === "string" &&
  (value.type === "seq" || value.type === "con");

const isRelationPair = (value: unknown): value is SemanticDiffRelationPair => {
  if (
    !isPlainRecord(value) ||
    !hasExactKeys(value, ["canonicalPair", "before", "after"]) ||
    !isPlainRecord(value.canonicalPair)
  )
    return false;
  const canonicalPair = value.canonicalPair;
  if (
    !hasExactKeys(canonicalPair, ["sourceUnitId", "targetUnitId", "type"]) ||
    typeof canonicalPair.sourceUnitId !== "string" ||
    typeof canonicalPair.targetUnitId !== "string" ||
    (canonicalPair.type !== "seq" && canonicalPair.type !== "con") ||
    (value.before !== null && !isRelationEndpoint(value.before)) ||
    (value.after !== null && !isRelationEndpoint(value.after))
  )
    return false;
  return [value.before, value.after].every(
    (endpoint) =>
      endpoint === null ||
      (isRelationEndpoint(endpoint) &&
        endpoint.sourceUnitId === canonicalPair.sourceUnitId &&
        endpoint.targetUnitId === canonicalPair.targetUnitId &&
        endpoint.type === canonicalPair.type),
  );
};

const isComparisonPeriod = (
  value: unknown,
): value is SemanticDiffComparisonPeriod =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["from", "to"]) &&
  typeof value.from === "string" &&
  typeof value.to === "string";

const isSemanticDiffDetail = (value: unknown): value is SemanticDiffDetail =>
  isPlainRecord(value) &&
  hasExactKeys(value, [
    "unitPath",
    "parameterKey",
    "relationPair",
    "scheduleRule",
    "period",
    "beforeValues",
    "afterValues",
    "rawValues",
    "removedSources",
  ]) &&
  (value.unitPath === null || typeof value.unitPath === "string") &&
  (value.parameterKey === null || typeof value.parameterKey === "string") &&
  (value.relationPair === null || isRelationPair(value.relationPair)) &&
  (value.scheduleRule === null ||
    (typeof value.scheduleRule === "number" &&
      Number.isFinite(value.scheduleRule))) &&
  (value.period === null || isComparisonPeriod(value.period)) &&
  isStringArray(value.beforeValues) &&
  isStringArray(value.afterValues) &&
  isStringArray(value.rawValues) &&
  isStringArray(value.removedSources);

const isSemanticDiffWarning = (value: unknown): value is SemanticDiffWarning =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["code", "detail", "fallbackText"]) &&
  typeof value.code === "string" &&
  isSemanticDiffDetail(value.detail) &&
  (value.fallbackText === null || typeof value.fallbackText === "string");

const isSemanticDiffConstraint = (
  value: unknown,
): value is SemanticDiffConstraint =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["code", "detail", "warning"]) &&
  constraintCodes.has(String(value.code)) &&
  isSemanticDiffDetail(value.detail) &&
  (value.warning === null || isSemanticDiffWarning(value.warning));

const isTarget = (value: unknown): value is SemanticDiffTarget => {
  if (!isPlainRecord(value) || typeof value.kind !== "string") return false;
  switch (value.kind) {
    case "job-group":
      return (
        hasExactKeys(value, ["kind"]) ||
        (hasExactKeys(value, ["kind", "path"]) &&
          typeof value.path === "string")
      );
    case "unit":
    case "jobnet":
      return (
        hasExactKeys(value, ["kind", "unit"]) && isUnitReference(value.unit)
      );
    case "relation":
      return (
        hasExactKeys(value, ["kind", "relation"]) &&
        isRelationReference(value.relation)
      );
    case "attribute":
      return (
        hasExactKeys(value, [
          "kind",
          "unit",
          "parameterKey",
          "category",
          "values",
        ]) &&
        isUnitReference(value.unit) &&
        typeof value.parameterKey === "string" &&
        attributeCategories.has(String(value.category)) &&
        isStringArray(value.values)
      );
    default:
      return false;
  }
};

const isActionAvailability = (
  value: unknown,
): value is SemanticDiffExplorerActionAvailability => {
  if (
    !isPlainRecord(value) ||
    !hasExactKeys(value, ["available", "actionId", "unavailableReason"])
  )
    return false;
  if (typeof value.available !== "boolean") return false;
  if (value.available)
    return (
      isSemanticDiffExplorerActionId(value.actionId) &&
      value.unavailableReason === null
    );
  return (
    value.actionId === null &&
    ["missing-target-side", "missing-target", "unsupported-target"].includes(
      String(value.unavailableReason),
    )
  );
};

const isActionSet = (value: unknown): value is SemanticDiffExplorerActionSet =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["source", "flow"]) &&
  isActionAvailability(value.source) &&
  isActionAvailability(value.flow);

const isTargetProjection = (value: unknown): boolean =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["side", "value"]) &&
  (value.side === null || value.side === "before" || value.side === "after") &&
  (value.value === null || isTarget(value.value));

const targetProjectionMatchesSide = (value: unknown, side: unknown): boolean =>
  isTargetProjection(value) && isPlainRecord(value) && value.side === side;

const isScheduleRun = (value: unknown): value is SemanticDiffScheduleRun =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["unitPath", "unitName", "rule", "date", "time"]) &&
  typeof value.unitPath === "string" &&
  typeof value.unitName === "string" &&
  typeof value.rule === "number" &&
  Number.isFinite(value.rule) &&
  typeof value.date === "string" &&
  typeof value.time === "string";

const isScheduleRunChange = (
  value: unknown,
): value is SemanticDiffScheduleRunChange =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["id", "kind", "unitPath", "date", "before", "after"]) &&
  typeof value.id === "string" &&
  (value.kind === "added" ||
    value.kind === "removed" ||
    value.kind === "changed-time") &&
  typeof value.unitPath === "string" &&
  typeof value.date === "string" &&
  (value.before === null || isScheduleRun(value.before)) &&
  (value.after === null || isScheduleRun(value.after)) &&
  ((value.kind === "added" && value.before === null && value.after !== null) ||
    (value.kind === "removed" &&
      value.before !== null &&
      value.after === null) ||
    (value.kind === "changed-time" &&
      value.before !== null &&
      value.after !== null));

const isLeaf = (value: unknown): value is SemanticDiffExplorerLeaf => {
  if (
    !isPlainRecord(value) ||
    typeof value.kind !== "string" ||
    !leafKinds.has(value.kind)
  )
    return false;
  if (typeof value.id !== "string" || typeof value.recordId !== "string")
    return false;
  if (!isActionSet(value.actions)) return false;
  switch (value.kind) {
    case "change":
      return (
        hasExactKeys(value, [
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
        ]) &&
        changeKinds.has(String(value.changeKind)) &&
        elementKinds.has(String(value.elementKind)) &&
        [
          "confirmed",
          "candidate",
          "confirmation-required",
          "unsupported",
        ].includes(String(value.confirmationLevel)) &&
        (value.attributeCategory === null ||
          attributeCategories.has(String(value.attributeCategory))) &&
        (value.identityDecisionId === null ||
          typeof value.identityDecisionId === "string") &&
        (value.targetSide === "before" || value.targetSide === "after") &&
        targetProjectionMatchesSide(value.target, value.targetSide) &&
        (value.before === null || isTarget(value.before)) &&
        (value.after === null || isTarget(value.after)) &&
        (value.relationPair === null || isRelationPair(value.relationPair)) &&
        value.detail === null &&
        Array.isArray(value.constraints) &&
        value.constraints.every(isSemanticDiffConstraint) &&
        (value.warning === null || isSemanticDiffWarning(value.warning))
      );
    case "confirmation":
      return (
        hasExactKeys(value, [
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
        ]) &&
        confirmationReasons.has(String(value.reasonCode)) &&
        (value.targetSide === "before" || value.targetSide === "after") &&
        targetProjectionMatchesSide(value.target, value.targetSide) &&
        Array.isArray(value.relatedTargets) &&
        value.relatedTargets.every(isTarget) &&
        isSemanticDiffDetail(value.detail) &&
        Array.isArray(value.constraints) &&
        value.constraints.every(isSemanticDiffConstraint) &&
        (value.warning === null || isSemanticDiffWarning(value.warning))
      );
    case "unsupported":
      return (
        hasExactKeys(value, [
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
        ]) &&
        unsupportedKinds.has(String(value.unsupportedKind)) &&
        (value.targetSide === null ||
          value.targetSide === "before" ||
          value.targetSide === "after") &&
        targetProjectionMatchesSide(value.target, value.targetSide) &&
        unsupportedReasons.has(String(value.reasonCode)) &&
        isSemanticDiffDetail(value.detail) &&
        (value.warning === null || isSemanticDiffWarning(value.warning))
      );
    case "limitation":
      return (
        hasExactKeys(value, [
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
        ]) &&
        limitationKinds.has(String(value.limitationKind)) &&
        typeof value.code === "string" &&
        (value.targetSide === null ||
          value.targetSide === "before" ||
          value.targetSide === "after") &&
        (value.unitPath === null || typeof value.unitPath === "string") &&
        isSemanticDiffDetail(value.detail) &&
        (value.warning === null || isSemanticDiffWarning(value.warning))
      );
    case "schedule":
      return (
        hasExactKeys(value, [
          "kind",
          "id",
          "recordId",
          "change",
          "targetSide",
          "target",
          "actions",
        ]) &&
        isScheduleRunChange(value.change) &&
        value.targetSide === null &&
        targetProjectionMatchesSide(value.target, null) &&
        isPlainRecord(value.target) &&
        value.target.value === null
      );
  }
  return false;
};

const expectedCardKeys = (id: unknown): readonly string[] | null => {
  switch (id) {
    case "changes":
      return ["added", "removed", "changed", "renamed", "moved"];
    case "elements":
      return ["job-group", "jobnet", "unit", "relation", "attribute"];
    case "attributes":
      return [...attributeCategories];
    case "confirmation-required":
      return ["required"];
    case "unsupported":
      return ["unsupported", "uninterpretable", "uncalculated"];
    case "limitations":
    case "schedule-run-changes":
      return ["total"];
    default:
      return null;
  }
};

const cardOrder: readonly SemanticDiffExplorerCard["id"][] = [
  "changes",
  "elements",
  "attributes",
  "confirmation-required",
  "unsupported",
  "limitations",
  "schedule-run-changes",
];

const isCard = (value: unknown): value is SemanticDiffExplorerCard => {
  if (
    !isPlainRecord(value) ||
    !hasExactKeys(value, ["id", "count", "counts"]) ||
    typeof value.id !== "string" ||
    typeof value.count !== "number" ||
    !Number.isSafeInteger(value.count) ||
    value.count < 0 ||
    !isPlainRecord(value.counts)
  )
    return false;
  const keys = expectedCardKeys(value.id);
  if (keys === null || !hasExactKeys(value.counts, keys)) return false;
  const counts = Object.values(value.counts);
  if (
    !counts.every(
      (count) =>
        typeof count === "number" && Number.isSafeInteger(count) && count >= 0,
    )
  )
    return false;
  return (
    value.count ===
    counts.reduce<number>((sum, count) => sum + (count as number), 0)
  );
};

const countTreeLeaves = (node: SemanticDiffExplorerTreeNode): number =>
  node.leaves.length +
  node.children.reduce((sum, child) => sum + countTreeLeaves(child), 0);

const isTreeNode = (value: unknown): value is SemanticDiffExplorerTreeNode => {
  if (
    !isPlainRecord(value) ||
    !hasExactKeys(value, ["id", "kind", "label", "path", "children", "leaves"])
  )
    return false;
  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    (value.path !== null && typeof value.path !== "string")
  )
    return false;
  if (
    !["root", "job-group", "unit"].includes(String(value.kind)) ||
    !Array.isArray(value.children) ||
    !Array.isArray(value.leaves)
  )
    return false;
  if (
    (value.kind === "root" &&
      (value.id !== "root" ||
        value.path !== null ||
        value.leaves.length > 0)) ||
    (value.kind !== "root" && value.id === "root")
  )
    return false;
  return (
    value.children.every(
      (child) => child.kind !== "root" && isTreeNode(child),
    ) && value.leaves.every(isLeaf)
  );
};

const isConfirmationOnlyLeaf = (leaf: SemanticDiffExplorerLeaf): boolean =>
  leaf.kind === "confirmation" ||
  (leaf.kind === "change" &&
    leaf.confirmationLevel === "confirmation-required");

const treeContainsOnlyConfirmationLeaves = (
  node: SemanticDiffExplorerTreeNode,
): boolean =>
  node.leaves.every(isConfirmationOnlyLeaf) &&
  node.children.every(treeContainsOnlyConfirmationLeaves);

export const isSemanticDiffExplorerViewModel = (
  value: unknown,
): value is SemanticDiffExplorerViewModel =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["filter", "cards", "tree", "leafCount", "status"]) &&
  (value.filter === "all" || value.filter === "confirmation-required") &&
  Array.isArray(value.cards) &&
  value.cards.length === 7 &&
  value.cards.every(isCard) &&
  value.cards.every((card, index) => card.id === cardOrder[index]) &&
  isTreeNode(value.tree) &&
  value.tree.kind === "root" &&
  value.tree.id === "root" &&
  value.tree.path === null &&
  value.tree.leaves.length === 0 &&
  typeof value.leafCount === "number" &&
  Number.isSafeInteger(value.leafCount) &&
  value.leafCount >= 0 &&
  countTreeLeaves(value.tree) === value.leafCount &&
  ((value.leafCount > 0 && value.status === "findings") ||
    (value.leafCount === 0 &&
      value.filter === "all" &&
      value.status === "empty") ||
    (value.leafCount === 0 &&
      value.filter === "confirmation-required" &&
      value.status === "filter-empty")) &&
  (value.filter === "all" || treeContainsOnlyConfirmationLeaves(value.tree));

const isActionOutcome = (
  value: unknown,
): value is SemanticDiffExplorerActionOutcome =>
  isPlainRecord(value) &&
  hasExactKeys(value, ["kind", "status", "side", "targetId"]) &&
  actionKinds.has(String(value.kind)) &&
  (value.status === "completed" || value.status === "unavailable") &&
  (value.side === null || value.side === "before" || value.side === "after") &&
  (value.targetId === null || typeof value.targetId === "string");

const isError = (value: unknown): value is ExplorerError => {
  if (
    !isPlainRecord(value) ||
    !hasExactKeys(value, ["code", "detail"]) ||
    typeof value.code !== "string" ||
    !errorCodes.has(value.code)
  )
    return false;
  if (value.detail === null) return true;
  return (
    isPlainRecord(value.detail) &&
    hasExactKeys(value.detail, ["side", "targetId"]) &&
    (value.detail.side === null ||
      value.detail.side === "before" ||
      value.detail.side === "after") &&
    (value.detail.targetId === null ||
      typeof value.detail.targetId === "string")
  );
};

const sessionMatches = (
  sessionId: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  isSemanticDiffExplorerSessionId(sessionId) &&
  (options.expectedSessionId === undefined ||
    sessionId === options.expectedSessionId);

const actionMatches = (
  actionId: unknown,
  options: SemanticDiffExplorerMessageValidationOptions,
): boolean =>
  isSemanticDiffExplorerActionId(actionId) &&
  (options.actionIds === undefined || options.actionIds.has(actionId));

const jsonByteLength = (value: unknown): number | null => {
  if (!isJsonValue(value)) return null;
  try {
    return new TextEncoder().encode(JSON.stringify(value)).byteLength;
  } catch {
    return null;
  }
};

type SemanticDiffExplorerMessageValidationCode =
  | "invalid-request"
  | "unknown-session"
  | "unknown-action"
  | "stale-request"
  | "payload-too-large";

const invalid = (
  code: SemanticDiffExplorerMessageValidationCode,
): SemanticDiffExplorerMessageValidationResult => ({ ok: false, code });

export const parseSemanticDiffExplorerRequest = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerRequest | undefined => {
  if (
    !isPlainRecord(value) ||
    !isJsonValue(value) ||
    typeof value.type !== "string"
  )
    return undefined;
  if (
    !hasExactKeys(value, ["type", "sessionId", "requestId", "actionId"]) ||
    !sessionMatches(value.sessionId, options) ||
    !isFinitePositiveInteger(value.requestId)
  )
    return undefined;
  if (
    options.minimumRequestId !== undefined &&
    value.requestId <= options.minimumRequestId
  )
    return undefined;
  const sessionId = value.sessionId as SemanticDiffExplorerSessionId;
  switch (value.type) {
    case "ready":
    case "refresh":
      return value.actionId === null
        ? {
            type: value.type,
            sessionId,
            requestId: value.requestId,
            actionId: null,
          }
        : undefined;
    case "action":
      return actionMatches(value.actionId, options)
        ? {
            type: "action",
            sessionId,
            requestId: value.requestId,
            actionId: value.actionId as SemanticDiffExplorerActionId,
          }
        : undefined;
    default:
      return undefined;
  }
};

export const parseSemanticDiffExplorerReply = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerReply | undefined => {
  if (
    !isPlainRecord(value) ||
    !isJsonValue(value) ||
    typeof value.type !== "string" ||
    !hasExactKeys(value, [
      "type",
      "sessionId",
      "requestId",
      "actionId",
      "ok",
      "payload",
      "error",
    ]) ||
    !sessionMatches(value.sessionId, options) ||
    !isFinitePositiveInteger(value.requestId) ||
    typeof value.ok !== "boolean"
  )
    return undefined;
  const sessionId = value.sessionId as SemanticDiffExplorerSessionId;
  if (
    options.minimumRequestId !== undefined &&
    value.requestId <= options.minimumRequestId
  )
    return undefined;
  if (value.type === "ready" || value.type === "refreshed") {
    const payloadValid =
      value.payload === null || isSemanticDiffExplorerViewModel(value.payload);
    if (
      value.actionId !== null ||
      !payloadValid ||
      (value.ok && (value.payload === null || value.error !== null)) ||
      (!value.ok && (value.payload !== null || !isError(value.error)))
    )
      return undefined;
    if (value.ok && value.error !== null) return undefined;
    return {
      type: value.type,
      sessionId,
      requestId: value.requestId,
      actionId: null,
      ok: value.ok,
      payload: value.payload as SemanticDiffExplorerViewModel | null,
      error: value.error as ExplorerError | null,
    };
  }
  if (value.type === "action" && actionMatches(value.actionId, options)) {
    const payloadValid =
      value.payload === null || isActionOutcome(value.payload);
    if (
      !payloadValid ||
      typeof value.actionId !== "string" ||
      (value.ok && (value.payload === null || value.error !== null)) ||
      (!value.ok && (value.payload !== null || !isError(value.error)))
    )
      return undefined;
    return {
      type: "action",
      sessionId,
      requestId: value.requestId,
      actionId: value.actionId as SemanticDiffExplorerActionId,
      ok: value.ok,
      payload: value.payload as SemanticDiffExplorerActionOutcome | null,
      error: value.error as ExplorerError | null,
    };
  }
  return undefined;
};

export const parseSemanticDiffExplorerHostMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerHostMessage | undefined => {
  if (
    !isPlainRecord(value) ||
    !isJsonValue(value) ||
    typeof value.type !== "string"
  )
    return undefined;
  if (value.type === "session") {
    if (
      !hasExactKeys(value, [
        "type",
        "sessionId",
        "requestId",
        "actionId",
        "ok",
        "payload",
        "error",
      ]) ||
      !sessionMatches(value.sessionId, options) ||
      value.requestId !== null ||
      value.actionId !== null ||
      value.ok !== true ||
      value.error !== null ||
      !isSemanticDiffExplorerViewModel(value.payload)
    )
      return undefined;
    return {
      type: "session",
      sessionId: value.sessionId as SemanticDiffExplorerSessionId,
      requestId: null,
      actionId: null,
      ok: true,
      payload: value.payload as SemanticDiffExplorerViewModel,
      error: null,
    };
  }
  if (value.type === "close") {
    if (
      !hasExactKeys(value, [
        "type",
        "sessionId",
        "requestId",
        "actionId",
        "ok",
        "payload",
        "error",
      ]) ||
      !sessionMatches(value.sessionId, options) ||
      value.requestId !== null ||
      value.actionId !== null ||
      value.ok !== true ||
      value.payload !== null ||
      value.error !== null
    )
      return undefined;
    return {
      type: "close",
      sessionId: value.sessionId as SemanticDiffExplorerSessionId,
      requestId: null,
      actionId: null,
      ok: true,
      payload: null,
      error: null,
    };
  }
  if (value.type === "failure") {
    if (
      !hasExactKeys(value, [
        "type",
        "sessionId",
        "requestId",
        "actionId",
        "ok",
        "payload",
        "error",
      ]) ||
      (value.sessionId !== null && !sessionMatches(value.sessionId, options)) ||
      (value.requestId !== null && !isFinitePositiveInteger(value.requestId)) ||
      (value.requestId !== null &&
        options.minimumRequestId !== undefined &&
        isFinitePositiveInteger(value.requestId) &&
        value.requestId <= options.minimumRequestId) ||
      (value.actionId !== null && !actionMatches(value.actionId, options)) ||
      value.ok !== false ||
      value.payload !== null ||
      !isError(value.error)
    )
      return undefined;
    return {
      type: "failure",
      sessionId: value.sessionId as SemanticDiffExplorerSessionId | null,
      requestId: value.requestId as number | null,
      actionId: value.actionId as SemanticDiffExplorerActionId | null,
      ok: false,
      payload: null,
      error: value.error as ExplorerError,
    };
  }
  if (value.type === "action-result") {
    if (
      !hasExactKeys(value, [
        "type",
        "sessionId",
        "requestId",
        "actionId",
        "ok",
        "payload",
        "error",
      ]) ||
      !sessionMatches(value.sessionId, options) ||
      !isFinitePositiveInteger(value.requestId) ||
      (options.minimumRequestId !== undefined &&
        value.requestId <= options.minimumRequestId) ||
      !actionMatches(value.actionId, options) ||
      typeof value.ok !== "boolean"
    )
      return undefined;
    const payloadValid =
      value.payload === null || isActionOutcome(value.payload);
    if (
      !payloadValid ||
      (value.ok && (value.payload === null || value.error !== null)) ||
      (!value.ok && (value.payload !== null || !isError(value.error)))
    )
      return undefined;
    return {
      type: "action-result",
      sessionId: value.sessionId as SemanticDiffExplorerSessionId,
      requestId: value.requestId,
      actionId: value.actionId as SemanticDiffExplorerActionId,
      ok: value.ok,
      payload: value.payload as SemanticDiffExplorerActionOutcome | null,
      error: value.error as ExplorerError | null,
    };
  }
  return undefined;
};

export const validateSemanticDiffExplorerMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): SemanticDiffExplorerMessageValidationResult => {
  const maxBytes = options.maxBytes ?? SEMANTIC_DIFF_EXPLORER_MAX_MESSAGE_BYTES;
  const bytes = jsonByteLength(value);
  if (bytes === null) return invalid("invalid-request");
  if (bytes > maxBytes) return invalid("payload-too-large");
  const request = parseSemanticDiffExplorerRequest(value, options);
  if (request) return { ok: true, value: request };
  const reply = parseSemanticDiffExplorerReply(value, options);
  if (reply) return { ok: true, value: reply };
  const host = parseSemanticDiffExplorerHostMessage(value, options);
  if (host) return { ok: true, value: host };
  if (
    isPlainRecord(value) &&
    isSemanticDiffExplorerSessionId(value.sessionId) &&
    options.expectedSessionId !== undefined &&
    value.sessionId !== options.expectedSessionId
  )
    return invalid("unknown-session");
  if (
    isPlainRecord(value) &&
    isSemanticDiffExplorerActionId(value.actionId) &&
    options.actionIds !== undefined &&
    !options.actionIds.has(value.actionId)
  )
    return invalid("unknown-action");
  if (
    isPlainRecord(value) &&
    isFinitePositiveInteger(value.requestId) &&
    options.minimumRequestId !== undefined &&
    value.requestId <= options.minimumRequestId
  )
    return invalid("stale-request");
  return invalid("invalid-request");
};

export const isSemanticDiffExplorerMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): value is SemanticDiffExplorerMessage =>
  validateSemanticDiffExplorerMessage(value, options).ok;

export const serializeSemanticDiffExplorerMessage = (
  value: unknown,
  options: SemanticDiffExplorerMessageValidationOptions = {},
): Readonly<
  | {
      ok: true;
      value: SemanticDiffExplorerMessage;
      json: string;
      bytes: number;
    }
  | { ok: false; error: ExplorerError }
> => {
  const validation = validateSemanticDiffExplorerMessage(value, options);
  if ("code" in validation)
    return { ok: false, error: { code: validation.code, detail: null } };
  const json = JSON.stringify(validation.value);
  const bytes = new TextEncoder().encode(json).byteLength;
  return { ok: true, value: validation.value, json, bytes };
};

export const createSemanticDiffExplorerError = (
  code: SemanticDiffExplorerErrorCode,
  detail: SemanticDiffExplorerErrorDetail | null = null,
): ExplorerError => {
  const error = { code, detail };
  if (!isError(error))
    throw new TypeError("Unknown or malformed Explorer error.");
  return error;
};

export const createSemanticDiffExplorerReadyRequest = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
): SemanticDiffExplorerReadyRequest => ({
  type: "ready",
  sessionId,
  requestId,
  actionId: null,
});

export const createSemanticDiffExplorerRefreshRequest = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
): SemanticDiffExplorerRefreshRequest => ({
  type: "refresh",
  sessionId,
  requestId,
  actionId: null,
});

export const createSemanticDiffExplorerActionRequest = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
  actionId: SemanticDiffExplorerActionId,
): SemanticDiffExplorerActionRequest => ({
  type: "action",
  sessionId,
  requestId,
  actionId,
});

export const createSemanticDiffExplorerActionOutcome = (
  kind: SemanticDiffExplorerActionOutcome["kind"],
  status: SemanticDiffExplorerActionOutcome["status"],
  side: SemanticDiffSide | null = null,
  targetId: string | null = null,
): SemanticDiffExplorerActionOutcome => ({ kind, status, side, targetId });

const assertResponsePayload = (
  payload: object | null,
  error: ExplorerError | null,
): void => {
  if ((payload === null) === (error === null)) {
    throw new TypeError(
      "Explorer response payload and error must use complementary nullability.",
    );
  }
};

export const createSemanticDiffExplorerReadyReply = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
  payload: SemanticDiffExplorerViewModel | null,
  error: ExplorerError | null = null,
): SemanticDiffExplorerReadyReply => {
  assertResponsePayload(payload, error);
  return {
    type: "ready",
    sessionId,
    requestId,
    actionId: null,
    ok: error === null && payload !== null,
    payload,
    error,
  };
};

export const createSemanticDiffExplorerRefreshReply = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
  payload: SemanticDiffExplorerViewModel | null,
  error: ExplorerError | null = null,
): SemanticDiffExplorerReadyReply => {
  assertResponsePayload(payload, error);
  return {
    type: "refreshed",
    sessionId,
    requestId,
    actionId: null,
    ok: error === null && payload !== null,
    payload,
    error,
  };
};

export const createSemanticDiffExplorerActionReply = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
  actionId: SemanticDiffExplorerActionId,
  payload: SemanticDiffExplorerActionOutcome | null,
  error: ExplorerError | null = null,
): SemanticDiffExplorerActionReply => {
  assertResponsePayload(payload, error);
  return {
    type: "action",
    sessionId,
    requestId,
    actionId,
    ok: error === null && payload !== null,
    payload,
    error,
  };
};

export const createSemanticDiffExplorerSessionMessage = (
  sessionId: SemanticDiffExplorerSessionId,
  payload: SemanticDiffExplorerViewModel,
): SemanticDiffExplorerSessionMessage => ({
  type: "session",
  sessionId,
  requestId: null,
  actionId: null,
  ok: true,
  payload,
  error: null,
});

export const createSemanticDiffExplorerActionResultMessage = (
  sessionId: SemanticDiffExplorerSessionId,
  requestId: number,
  actionId: SemanticDiffExplorerActionId,
  payload: SemanticDiffExplorerActionOutcome | null,
  error: ExplorerError | null = null,
): SemanticDiffExplorerActionResultMessage => {
  assertResponsePayload(payload, error);
  return {
    type: "action-result",
    sessionId,
    requestId,
    actionId,
    ok: error === null && payload !== null,
    payload,
    error,
  };
};

export const createSemanticDiffExplorerFailureMessage = (
  sessionId: SemanticDiffExplorerSessionId | null,
  requestId: number | null,
  actionId: SemanticDiffExplorerActionId | null,
  error: ExplorerError,
): SemanticDiffExplorerFailureMessage => ({
  type: "failure",
  sessionId,
  requestId,
  actionId,
  ok: false,
  payload: null,
  error,
});

export const createSemanticDiffExplorerCloseMessage = (
  sessionId: SemanticDiffExplorerSessionId,
): SemanticDiffExplorerCloseMessage => ({
  type: "close",
  sessionId,
  requestId: null,
  actionId: null,
  ok: true,
  payload: null,
  error: null,
});
