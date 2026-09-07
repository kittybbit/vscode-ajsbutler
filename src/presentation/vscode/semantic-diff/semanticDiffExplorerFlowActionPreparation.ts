import { validateFlowGraphDocument } from "../../../application/flow-graph/flowGraphDocument";
import { findSemanticDiffFlowRelationOccurrences } from "../../../application/flow-graph/buildSemanticDiffFlowOverlay";
import type { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import type {
  SemanticDiffOutputContext,
  SemanticDiffRelationReference,
} from "../../../application/semantic-diff/semanticDiffDto";
import {
  relationForFlowTarget,
  targetForRecord,
  targetUnitIdForRequest,
} from "./semanticDiffExplorerFlowTargets";
import type {
  SemanticDiffFlowActionRequest,
  SemanticDiffFlowActionResult,
  SemanticDiffFlowHost,
  SemanticDiffFlowPanel,
} from "./semanticDiffExplorerFlow";
import type {
  PreparedFlowAction,
  ReadyFlowTarget,
  ResolvedFlowTarget,
} from "./semanticDiffExplorerFlowAction";

type FlowRelationPair = Pick<
  SemanticDiffRelationReference,
  "sourceUnitId" | "targetUnitId" | "type"
>;

const targetMissing = (
  targetId?: string,
): Readonly<{
  ok: false;
  code: "flow-target-missing";
  targetId?: string;
}> => ({
  ok: false,
  code: "flow-target-missing",
  ...(targetId === undefined ? {} : { targetId }),
});

const notReady = (): Readonly<{
  ok: false;
  code: "flow-not-ready";
}> => ({ ok: false, code: "flow-not-ready" });

const resolveTargetUnit = ({
  request,
  target,
  relation,
}: Readonly<{
  request: SemanticDiffFlowActionRequest;
  target: NonNullable<ReturnType<typeof targetForRecord>>;
  relation: FlowRelationPair | undefined;
}>): ResolvedFlowTarget | SemanticDiffFlowActionResult => {
  const targetUnitId =
    relation?.targetUnitId ?? targetUnitIdForRequest(request, target);
  return targetUnitId === undefined
    ? targetMissing()
    : { targetUnitId, relation };
};

const resolveKnownFlowTarget = (
  context: SemanticDiffOutputContext,
  request: SemanticDiffFlowActionRequest,
  target: NonNullable<ReturnType<typeof targetForRecord>>,
): ResolvedFlowTarget | SemanticDiffFlowActionResult => {
  const relation = relationForFlowTarget(context, request, target);
  return target.kind === "relation" && relation === undefined
    ? targetMissing(target.relation.targetUnitId)
    : resolveTargetUnit({ request, target, relation });
};

export const resolveFlowTarget = (
  context: SemanticDiffOutputContext,
  request: SemanticDiffFlowActionRequest,
): ResolvedFlowTarget | SemanticDiffFlowActionResult => {
  const target = targetForRecord(context, request);
  return target === undefined
    ? targetMissing()
    : resolveKnownFlowTarget(context, request, target);
};

const sourceIsCurrent = ({
  host,
  side,
  context,
  snapshot,
}: Readonly<{
  host: SemanticDiffFlowHost;
  side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
  context: SemanticDiffOutputContext;
  snapshot: NonNullable<
    ReturnType<NonNullable<SemanticDiffFlowHost["getSourceSnapshot"]>>
  >;
}>): boolean => {
  if (host.isSourceCurrent === undefined) return true;
  return host.isSourceCurrent(side, context, snapshot);
};

const createSnapshotFreshness =
  ({
    host,
    side,
    context,
    snapshot,
    isCurrent,
  }: Readonly<{
    host: SemanticDiffFlowHost;
    side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
    context: SemanticDiffOutputContext;
    snapshot: NonNullable<
      ReturnType<NonNullable<SemanticDiffFlowHost["getSourceSnapshot"]>>
    >;
    isCurrent: () => boolean;
  }>): (() => boolean) =>
  () =>
    isCurrent() &&
    sourceIsCurrent({
      host,
      side,
      context,
      snapshot,
    });

const createFreshnessForSide = ({
  host,
  side,
  context,
  isCurrent,
}: Readonly<{
  host: SemanticDiffFlowHost;
  side: NonNullable<SemanticDiffFlowActionRequest["side"]>;
  context: SemanticDiffOutputContext;
  isCurrent: () => boolean;
}>): (() => boolean) | undefined => {
  const getSourceSnapshot = host.getSourceSnapshot;
  if (getSourceSnapshot === undefined) return isCurrent;
  const snapshot = getSourceSnapshot(side, context);
  return snapshot === undefined
    ? undefined
    : createSnapshotFreshness({ host, side, context, snapshot, isCurrent });
};

const createSourceFreshness = ({
  host,
  request,
  context,
  isCurrent,
}: Readonly<{
  host: SemanticDiffFlowHost;
  request: SemanticDiffFlowActionRequest;
  context: SemanticDiffOutputContext;
  isCurrent: () => boolean;
}>): (() => boolean) | undefined => {
  if (request.side === null) return undefined;
  return createFreshnessForSide({
    host,
    side: request.side,
    context,
    isCurrent,
  });
};

const prepareTarget = ({
  context,
  request,
  isCurrent,
}: Readonly<{
  context: SemanticDiffOutputContext;
  request: SemanticDiffFlowActionRequest;
  isCurrent: () => boolean;
}>): ResolvedFlowTarget | SemanticDiffFlowActionResult =>
  request.side === null || !isCurrent()
    ? targetMissing()
    : resolveFlowTarget(context, request);

const prepareWithFreshness = ({
  host,
  request,
  context,
  target,
  isCurrent,
}: Readonly<{
  host: SemanticDiffFlowHost;
  request: SemanticDiffFlowActionRequest;
  context: SemanticDiffOutputContext;
  target: ResolvedFlowTarget;
  isCurrent: () => boolean;
}>): PreparedFlowAction | SemanticDiffFlowActionResult => {
  const isFresh = createSourceFreshness({
    host,
    request,
    context,
    isCurrent,
  });
  return isFresh === undefined || !isFresh() ? notReady() : { target, isFresh };
};

export const prepareFlowAction = ({
  host,
  request,
  context,
  isCurrent,
}: Readonly<{
  host: SemanticDiffFlowHost;
  request: SemanticDiffFlowActionRequest;
  context: SemanticDiffOutputContext;
  isCurrent: () => boolean;
}>): PreparedFlowAction | SemanticDiffFlowActionResult => {
  const target = prepareTarget({ context, request, isCurrent });
  return "targetUnitId" in target
    ? prepareWithFreshness({
        host,
        request,
        context,
        target,
        isCurrent,
      })
    : target;
};

const openFlowPanel = async ({
  host,
  request,
  context,
  targetUnitId,
}: Readonly<{
  host: SemanticDiffFlowHost;
  request: SemanticDiffFlowActionRequest;
  context: SemanticDiffOutputContext;
  targetUnitId: string;
}>): Promise<SemanticDiffFlowPanel | undefined> => {
  try {
    return await host.open(request.side!, targetUnitId, context);
  } catch {
    return undefined;
  }
};

const readFlowPanel = async (
  panel: SemanticDiffFlowPanel,
): Promise<UnitListDocumentDto | undefined> => {
  try {
    const ready = await panel.ready;
    return ready.document;
  } catch {
    return undefined;
  }
};

const readFreshFlowPanel = async ({
  panel,
  isFresh,
}: Readonly<{
  panel: SemanticDiffFlowPanel;
  isFresh: () => boolean;
}>): Promise<UnitListDocumentDto | undefined> => {
  const document = await readFlowPanel(panel);
  return document !== undefined && isFresh() ? document : undefined;
};

const relationTargetId = (
  relation: FlowRelationPair | undefined,
  targetUnitId: string,
): string => relation?.targetUnitId ?? targetUnitId;

const targetUnitForFlowDocument = (
  document: UnitListDocumentDto,
  relation: FlowRelationPair | undefined,
  targetUnitId: string,
): Readonly<{ absolutePath: string }> | undefined => {
  const validation = validateFlowGraphDocument(document);
  if (validation.status !== "available") return undefined;
  return validation.index.unitById.get(
    relationTargetId(relation, targetUnitId),
  );
};

const relationTargetIsMissing = (
  relation: FlowRelationPair | undefined,
  occurrences: readonly unknown[],
): boolean => relation !== undefined && occurrences.length === 0;

const buildReadyFlowTarget = ({
  panel,
  document,
  relation,
  targetUnitId,
}: Readonly<{
  panel: SemanticDiffFlowPanel;
  document: UnitListDocumentDto;
  relation: FlowRelationPair | undefined;
  targetUnitId: string;
}>): ReadyFlowTarget | SemanticDiffFlowActionResult => {
  const targetUnit = targetUnitForFlowDocument(
    document,
    relation,
    targetUnitId,
  );
  return targetUnit === undefined
    ? targetMissing(relation?.targetUnitId)
    : { panel, document, targetUnit };
};

const readyFlowTarget = ({
  panel,
  document,
  relation,
  targetUnitId,
}: Readonly<{
  panel: SemanticDiffFlowPanel;
  document: UnitListDocumentDto;
  relation: FlowRelationPair | undefined;
  targetUnitId: string;
}>): ReadyFlowTarget | SemanticDiffFlowActionResult => {
  const relationOccurrences = relation
    ? findSemanticDiffFlowRelationOccurrences(document, relation)
    : [];
  return relationTargetIsMissing(relation, relationOccurrences)
    ? targetMissing(relation!.targetUnitId)
    : buildReadyFlowTarget({ panel, document, relation, targetUnitId });
};

export const openReadyFlowTarget = async ({
  host,
  request,
  context,
  target,
  isFresh,
}: Readonly<{
  host: SemanticDiffFlowHost;
  request: SemanticDiffFlowActionRequest;
  context: SemanticDiffOutputContext;
  target: ResolvedFlowTarget;
  isFresh: () => boolean;
}>): Promise<ReadyFlowTarget | SemanticDiffFlowActionResult> => {
  const panel = await openFlowPanel({
    host,
    request,
    context,
    targetUnitId: target.targetUnitId,
  });
  if (panel === undefined) return notReady();
  const document = await readFreshFlowPanel({ panel, isFresh });
  if (document === undefined) return notReady();
  return readyFlowTarget({
    panel,
    document,
    relation: target.relation,
    targetUnitId: target.targetUnitId,
  });
};
