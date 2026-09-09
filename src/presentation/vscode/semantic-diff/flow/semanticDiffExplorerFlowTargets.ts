import type {
  SemanticDiffOutputContext,
  SemanticDiffRelationEndpoint,
  SemanticDiffTarget,
} from "../../../../application/semantic-diff/semanticDiffDto";
import { recordAtSourceOccurrence } from "../../../../application/semantic-diff/semanticDiffRecordOccurrence";
import type { SemanticDiffFlowActionRequest } from "./semanticDiffExplorerFlowTypes";

type FlowRelationPair = Pick<
  SemanticDiffRelationEndpoint,
  "sourceUnitId" | "targetUnitId" | "type"
>;

const compareCodeUnits = (left: string, right: string): number =>
  Number(left > right) - Number(left < right);

const stableArrayKey = (value: unknown[]): string =>
  `[${value.map(stableValueKey).join(",")}]`;

const stableObjectKey = (value: Record<string, unknown>): string =>
  `{${Object.keys(value)
    .sort(compareCodeUnits)
    .map((key) => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
    .join(",")}}`;

const stableStructuredValueKey = (value: unknown): string =>
  typeof value === "object"
    ? stableObjectKey(value as Record<string, unknown>)
    : `${typeof value}:${JSON.stringify(value)}`;

const stableValueKey = (value: unknown): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return stableArrayKey(value);
  return stableStructuredValueKey(value);
};

export const sameSemanticDiffTarget = (
  left: SemanticDiffTarget | null | undefined,
  right: SemanticDiffTarget | null,
): boolean => {
  if (left === null || left === undefined || right === null) return false;
  return stableValueKey(left) === stableValueKey(right);
};

const hasRecordSelection = (request: SemanticDiffFlowActionRequest): boolean =>
  request.recordId !== null &&
  request.recordKind !== null &&
  request.recordTarget !== null &&
  request.recordOccurrence !== null;

type ValidRecordRequest = SemanticDiffFlowActionRequest & {
  recordId: string;
  recordKind: "change" | "confirmation" | "unsupported";
  recordOccurrence: number;
  recordTarget: SemanticDiffTarget;
};

const hasValidOccurrence = (
  request: SemanticDiffFlowActionRequest,
): request is ValidRecordRequest =>
  hasRecordSelection(request) &&
  Number.isSafeInteger(request.recordOccurrence) &&
  request.recordOccurrence >= 0;

const targetForChange = (
  context: SemanticDiffOutputContext,
  request: ValidRecordRequest,
): SemanticDiffTarget | undefined => {
  const change = recordAtSourceOccurrence(
    context.result.changes,
    request.recordId,
    request.recordOccurrence,
  );
  const target = request.side === "before" ? change?.before : change?.after;
  return sameSemanticDiffTarget(target, request.recordTarget)
    ? (target ?? undefined)
    : undefined;
};

const targetForConfirmation = (
  context: SemanticDiffOutputContext,
  request: ValidRecordRequest,
): SemanticDiffTarget | undefined => {
  const item = recordAtSourceOccurrence(
    context.result.confirmationRequired,
    request.recordId,
    request.recordOccurrence,
  );
  return item && sameSemanticDiffTarget(item.target, request.recordTarget)
    ? item.target
    : undefined;
};

const targetForUnsupported = (
  context: SemanticDiffOutputContext,
  request: ValidRecordRequest,
): SemanticDiffTarget | undefined => {
  const item = recordAtSourceOccurrence(
    context.result.unsupportedItems,
    request.recordId,
    request.recordOccurrence,
  );
  return item && sameSemanticDiffTarget(item.target, request.recordTarget)
    ? (item.target ?? undefined)
    : undefined;
};

export const targetForRecord = (
  context: SemanticDiffOutputContext,
  request: SemanticDiffFlowActionRequest,
): SemanticDiffTarget | undefined => {
  if (!hasValidOccurrence(request)) return undefined;
  const resolvers = {
    change: targetForChange,
    confirmation: targetForConfirmation,
    unsupported: targetForUnsupported,
  } satisfies Record<ValidRecordRequest["recordKind"], typeof targetForChange>;
  return resolvers[request.recordKind](context, request);
};

const targetUnitId = (
  request: SemanticDiffFlowActionRequest,
  target: Extract<
    SemanticDiffTarget,
    { kind: "unit" | "jobnet" | "attribute" }
  >,
): string | undefined => {
  if (request.targetId !== target.unit.id) return undefined;
  if (request.targetKind !== target.kind) return undefined;
  return target.unit.id;
};

const relationUnitId = (
  request: SemanticDiffFlowActionRequest,
  target: Extract<SemanticDiffTarget, { kind: "relation" }>,
): string | undefined =>
  request.targetId === null && request.targetKind === null
    ? target.relation.targetUnitId
    : undefined;

const isRelationTarget = (
  target: SemanticDiffTarget,
): target is Extract<SemanticDiffTarget, { kind: "relation" }> =>
  target.kind === "relation";

const targetUnitIdForPresentTarget = (
  request: SemanticDiffFlowActionRequest,
  target: SemanticDiffTarget,
): string | undefined => {
  if (isRelationTarget(target)) return relationUnitId(request, target);
  if (target.kind === "job-group") return undefined;
  return targetUnitId(request, target);
};

export const targetUnitIdForRequest = (
  request: SemanticDiffFlowActionRequest,
  target: SemanticDiffTarget | undefined,
): string | undefined =>
  target === undefined
    ? undefined
    : targetUnitIdForPresentTarget(request, target);

const relationPairFromChange = (
  context: SemanticDiffOutputContext,
  request: ValidRecordRequest & {
    side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
  },
): FlowRelationPair | null =>
  recordAtSourceOccurrence(
    context.result.changes,
    request.recordId,
    request.recordOccurrence,
  )?.relationPair?.[request.side] ?? null;

const relationPairFromConfirmationOrUnsupported = (
  context: SemanticDiffOutputContext,
  request: ValidRecordRequest & {
    side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
  },
): FlowRelationPair | null => {
  if (request.recordKind === "confirmation") {
    return (
      recordAtSourceOccurrence(
        context.result.confirmationRequired,
        request.recordId,
        request.recordOccurrence,
      )?.detail.relationPair?.[request.side] ?? null
    );
  }
  return (
    recordAtSourceOccurrence(
      context.result.unsupportedItems,
      request.recordId,
      request.recordOccurrence,
    )?.detail.relationPair?.[request.side] ?? null
  );
};

const relationPairForRecord = (
  context: SemanticDiffOutputContext,
  request: ValidRecordRequest & {
    side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
  },
): FlowRelationPair | null => {
  return request.recordKind === "change"
    ? relationPairFromChange(context, request)
    : relationPairFromConfirmationOrUnsupported(context, request);
};

const relationRequestReady = (
  request: SemanticDiffFlowActionRequest,
): request is ValidRecordRequest & {
  side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
} => request.side !== null && hasValidOccurrence(request);

export const relationForFlowTarget = (
  context: SemanticDiffOutputContext,
  request: SemanticDiffFlowActionRequest,
  target: SemanticDiffTarget,
): FlowRelationPair | undefined => {
  if (target.kind !== "relation") return undefined;
  if (!relationRequestReady(request)) return undefined;
  return relationPairForRecord(context, request) ?? target.relation;
};
