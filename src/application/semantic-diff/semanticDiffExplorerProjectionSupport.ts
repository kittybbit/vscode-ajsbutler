import type {
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffConstraint,
  SemanticDiffDetail,
  SemanticDiffLimitation,
  SemanticDiffRelationEndpoint,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
  SemanticDiffTarget,
  SemanticDiffUnsupportedItem,
  SemanticDiffWarning,
} from "./semanticDiffDto";
import type {
  SemanticDiffExplorerActionAvailability,
  SemanticDiffExplorerActionIdAllocator,
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerChangeLeaf,
  SemanticDiffExplorerConfirmationLeaf,
  SemanticDiffExplorerLimitationLeaf,
  SemanticDiffExplorerScheduleLeaf,
  SemanticDiffExplorerTarget,
  SemanticDiffExplorerUnsupportedLeaf,
} from "./semanticDiffExplorerDto";

export const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);
export const freezeArray = <T>(values: readonly T[]): T[] =>
  Object.freeze([...values]) as unknown as T[];

export const cloneWarning = (
  warning: SemanticDiffWarning | null,
): SemanticDiffWarning | null =>
  warning === null
    ? null
    : freeze({
        code: warning.code,
        detail: cloneDetail(warning.detail),
        fallbackText: warning.fallbackText,
      });

export const cloneDetail = (detail: SemanticDiffDetail): SemanticDiffDetail =>
  freeze({
    unitPath: detail.unitPath,
    parameterKey: detail.parameterKey,
    relationPair: cloneRelationPair(detail.relationPair),
    scheduleRule: detail.scheduleRule,
    period: detail.period === null ? null : freeze({ ...detail.period }),
    beforeValues: freezeArray(detail.beforeValues),
    afterValues: freezeArray(detail.afterValues),
    rawValues: freezeArray(detail.rawValues),
    removedSources: freezeArray(detail.removedSources),
  });

export const cloneConstraint = (
  constraint: SemanticDiffConstraint,
): SemanticDiffConstraint =>
  freeze({
    code: constraint.code,
    detail: cloneDetail(constraint.detail),
    warning: cloneWarning(constraint.warning),
  });

const cloneEndpoint = (
  endpoint: SemanticDiffRelationEndpoint | null,
): SemanticDiffRelationEndpoint | null =>
  endpoint === null
    ? null
    : freeze({
        sourceUnitPath: endpoint.sourceUnitPath,
        sourceUnitId: endpoint.sourceUnitId,
        targetUnitPath: endpoint.targetUnitPath,
        targetUnitId: endpoint.targetUnitId,
        type: endpoint.type,
      });

export const cloneRelationPair = (
  pair: SemanticDiffRelationPair | null,
): SemanticDiffRelationPair | null =>
  pair === null
    ? null
    : freeze({
        canonicalPair: freeze({ ...pair.canonicalPair }),
        before: cloneEndpoint(pair.before),
        after: cloneEndpoint(pair.after),
      });

const cloneJobGroupTarget = (
  target: SemanticDiffTarget & { kind: "job-group" },
) =>
  freeze({
    kind: target.kind,
    ...(target.path === undefined ? {} : { path: target.path }),
  });
const cloneUnitTarget = (
  target: SemanticDiffTarget & { kind: "unit" | "jobnet" },
) => freeze({ kind: target.kind, unit: freeze({ ...target.unit }) });
const cloneRelationTarget = (
  target: SemanticDiffTarget & { kind: "relation" },
) => freeze({ kind: target.kind, relation: freeze({ ...target.relation }) });
const cloneAttributeTarget = (
  target: SemanticDiffTarget & { kind: "attribute" },
) =>
  freeze({
    kind: target.kind,
    unit: freeze({ ...target.unit }),
    parameterKey: target.parameterKey,
    category: target.category,
    values: freezeArray(target.values),
  });

const targetCloners = new Map<
  string,
  (target: SemanticDiffTarget) => SemanticDiffTarget
>([
  [
    "job-group",
    cloneJobGroupTarget as (target: SemanticDiffTarget) => SemanticDiffTarget,
  ],
  [
    "unit",
    cloneUnitTarget as (target: SemanticDiffTarget) => SemanticDiffTarget,
  ],
  [
    "jobnet",
    cloneUnitTarget as (target: SemanticDiffTarget) => SemanticDiffTarget,
  ],
  [
    "relation",
    cloneRelationTarget as (target: SemanticDiffTarget) => SemanticDiffTarget,
  ],
  [
    "attribute",
    cloneAttributeTarget as (target: SemanticDiffTarget) => SemanticDiffTarget,
  ],
]);

export const cloneTarget = (
  target: SemanticDiffTarget | null | undefined,
): SemanticDiffTarget | null => {
  if (target === null || target === undefined) return null;
  return targetCloners.get(target.kind)?.(target) ?? null;
};

/** Return the closed, upstream-declared side for a change kind. */
export const semanticDiffChangeTargetSide = (
  kind: SemanticDiffChange["kind"],
): SemanticDiffSide | undefined => {
  const sides = new Map<string, SemanticDiffSide>([
    ["added", "after"],
    ["removed", "before"],
    ["changed", "after"],
    ["renamed", "after"],
    ["moved", "after"],
  ]);
  return sides.get(kind);
};

/** Return the exhaustive side mapping for the review-risk reason union. */
export const semanticDiffConfirmationTargetSide = (
  reasonCode: SemanticDiffConfirmationRequiredItem["reasonCode"],
): SemanticDiffSide | undefined => {
  const sides = new Map<string, SemanticDiffSide>([
    ["conditional-relation-removed", "before"],
    ["wait-release-source-changed", "after"],
    ["timeout-removed", "after"],
    ["condition-judgment-changed", "after"],
    ["wait-target-changed", "after"],
    ["no-calculated-schedule-run", "after"],
    ["calculated-schedule-run-removed", "after"],
    ["execution-user-type-changed", "after"],
    ["jp1-resource-group-changed", "after"],
  ]);
  return sides.get(reasonCode);
};

const targetUnitId = (target: SemanticDiffTarget): string | null => {
  if (
    target.kind === "unit" ||
    target.kind === "jobnet" ||
    target.kind === "attribute"
  ) {
    return target.unit.id;
  }
  return null;
};

const explorerTarget = (
  side: SemanticDiffSide | null,
  target: SemanticDiffTarget | null,
): SemanticDiffExplorerTarget => freeze({ side, value: target });

const unavailableAction = (
  unavailableReason: Exclude<
    SemanticDiffExplorerActionAvailability["unavailableReason"],
    null
  >,
): SemanticDiffExplorerActionAvailability =>
  freeze({ available: false, actionId: null, unavailableReason });

const availableAction = (
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerActionAvailability =>
  freeze({
    available: true,
    actionId: actionIdAllocator(),
    unavailableReason: null,
  });

type ActionSetInput = {
  side: SemanticDiffSide | null;
  target: SemanticDiffTarget | null;
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
  relationPair?: SemanticDiffRelationPair | null;
};

const missingActionSet = (
  reason: "missing-target-side" | "missing-target",
): SemanticDiffExplorerActionSet =>
  freeze({
    source: unavailableAction(reason),
    flow: unavailableAction(reason),
  });

const relationFlowAvailable = (
  pair: SemanticDiffRelationPair | null | undefined,
  side: SemanticDiffSide,
): boolean => {
  if (
    pair === null ||
    pair === undefined ||
    (side !== "before" && side !== "after")
  ) {
    return false;
  }
  const endpoint = pair[side];
  return (
    endpoint !== null &&
    endpoint !== undefined &&
    [
      endpoint.sourceUnitId.length > 0,
      endpoint.targetUnitId.length > 0,
      endpoint.sourceUnitPath !== null,
      endpoint.targetUnitPath !== null,
    ].every(Boolean)
  );
};

const relationActionSet = (
  input: ActionSetInput,
): SemanticDiffExplorerActionSet =>
  freeze({
    source: unavailableAction("unsupported-target"),
    flow: relationFlowAvailable(
      input.relationPair,
      input.side as SemanticDiffSide,
    )
      ? availableAction(input.actionIdAllocator)
      : unavailableAction("missing-target"),
  });

const targetActionSet = (
  input: ActionSetInput,
  id: string | null,
): SemanticDiffExplorerActionSet =>
  freeze({
    source:
      id === null
        ? unavailableAction("unsupported-target")
        : availableAction(input.actionIdAllocator),
    flow:
      id === null
        ? unavailableAction("unsupported-target")
        : availableAction(input.actionIdAllocator),
  });

export const createActionSet = (
  input: ActionSetInput,
): SemanticDiffExplorerActionSet => actionSetForInput(input);

const actionSetForInput = (
  input: ActionSetInput,
): SemanticDiffExplorerActionSet => {
  const missing = missingActionReason(input);
  if (missing !== null) return missingActionSet(missing);
  return input.target.kind === "relation"
    ? relationActionSet(input)
    : targetActionSet(input, targetUnitId(input.target));
};

const missingActionReason = (
  input: ActionSetInput,
): "missing-target-side" | "missing-target" | null => {
  if (input.side === null) return "missing-target-side";
  if (input.target === null) return "missing-target";
  return null;
};

export const changeLeaf = (
  change: SemanticDiffChange,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerChangeLeaf => {
  const side = semanticDiffChangeTargetSide(change.kind);
  if (side === undefined)
    throw new TypeError("Unknown Semantic Diff change kind.");
  const before = cloneTarget(change.before);
  const after = cloneTarget(change.after);
  const target = side === "before" ? before : after;
  return freeze({
    kind: "change",
    id: `change:${change.id}:${occurrence}`,
    recordId: change.id,
    changeKind: change.kind,
    elementKind: change.elementKind,
    confirmationLevel: change.confirmationLevel,
    attributeCategory: change.attributeCategory ?? null,
    identityDecisionId: change.identityDecisionId ?? null,
    targetSide: side,
    target: explorerTarget(side, target),
    before,
    after,
    relationPair: cloneRelationPair(change.relationPair),
    detail: null,
    constraints: freeze([]),
    warning: null,
    actions: createActionSet({
      side,
      target,
      actionIdAllocator,
      relationPair: change.relationPair,
    }),
  });
};

export const confirmationLeaf = (
  item: SemanticDiffConfirmationRequiredItem,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerConfirmationLeaf => {
  const side = semanticDiffConfirmationTargetSide(item.reasonCode);
  if (side === undefined)
    throw new TypeError("Unknown Semantic Diff confirmation reason.");
  const target = cloneTarget(item.target);
  return freeze({
    kind: "confirmation",
    id: `confirmation:${item.id}:${occurrence}`,
    recordId: item.id,
    reasonCode: item.reasonCode,
    targetSide: side,
    target: explorerTarget(side, target),
    relatedTargets: freeze(
      item.relatedTargets.map(
        (related) => cloneTarget(related) as SemanticDiffTarget,
      ),
    ),
    detail: cloneDetail(item.detail),
    constraints: freeze(item.constraints.map(cloneConstraint)),
    warning: cloneWarning(item.warning),
    actions: createActionSet({
      side,
      target,
      actionIdAllocator,
      relationPair: item.detail.relationPair,
    }),
  });
};

export const unsupportedLeaf = (
  item: SemanticDiffUnsupportedItem,
  occurrence: number,
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator,
): SemanticDiffExplorerUnsupportedLeaf => {
  const target = cloneTarget(item.target);
  return freeze({
    kind: "unsupported",
    id: `unsupported:${item.id}:${occurrence}`,
    recordId: item.id,
    unsupportedKind: item.kind,
    reasonCode: item.reasonCode,
    targetSide: item.side,
    target: explorerTarget(item.side, target),
    detail: cloneDetail(item.detail),
    warning: cloneWarning(item.warning),
    actions: createActionSet({
      side: item.side,
      target,
      actionIdAllocator,
      relationPair: item.detail.relationPair,
    }),
  });
};

const unavailableActionSet = (): SemanticDiffExplorerActionSet =>
  freeze({
    source: unavailableAction("unsupported-target"),
    flow: unavailableAction("unsupported-target"),
  });

export const limitationLeaf = (
  item: SemanticDiffLimitation,
  occurrence: number,
): SemanticDiffExplorerLimitationLeaf =>
  freeze({
    kind: "limitation",
    id: `limitation:${item.code}:${occurrence}`,
    recordId: item.code,
    limitationKind: item.kind,
    code: item.code,
    targetSide: item.side,
    unitPath: item.unitPath,
    detail: cloneDetail(item.detail),
    warning: cloneWarning(item.warning),
    actions: unavailableActionSet(),
  });

export const scheduleLeaf = (
  change: SemanticDiffScheduleRunChange,
  occurrence: number,
): SemanticDiffExplorerScheduleLeaf =>
  freeze({
    kind: "schedule",
    id: `schedule:${change.id}:${occurrence}`,
    recordId: change.id,
    change: freeze({
      ...change,
      before: change.before === null ? null : freeze({ ...change.before }),
      after: change.after === null ? null : freeze({ ...change.after }),
    }),
    targetSide: null,
    target: explorerTarget(null, null),
    actions: freeze({
      source: unavailableAction("missing-target-side"),
      flow: unavailableAction("missing-target-side"),
    }),
  });
