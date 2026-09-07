import type { UnitListDocumentDto } from "../../../application/unit-list/unitListDocument";
import { buildSemanticDiffFlowOverlay } from "../../../application/flow-graph/buildSemanticDiffFlowOverlay";
import { validateFlowGraphDocument } from "../../../application/flow-graph/flowGraphDocument";
import type {
  SemanticDiffOutputContext,
  SemanticDiffRelationEndpoint,
  SemanticDiffSide,
  SemanticDiffTarget,
} from "../../../application/semantic-diff/semanticDiffDto";
import { recordAtSourceOccurrence } from "../../../application/semantic-diff/semanticDiffRecordOccurrence";
import { findSemanticDiffFlowRelationOccurrences } from "../../../application/flow-graph/buildSemanticDiffFlowOverlay";
import {
  createViewerDocumentChangedMessage,
  createViewerRevealUnitMessage,
} from "../../webview/viewerHostMessages";

export type SemanticDiffFlowActionRequest = Readonly<{
  sessionId: string;
  /** Host-only lifecycle epoch; webview payloads never receive this value. */
  disposeEpoch?: number;
  side: SemanticDiffSide | null;
  targetId: string | null;
  targetKind: "unit" | "jobnet" | "attribute" | null;
  recordId: string | null;
  recordKind: "change" | "confirmation" | "unsupported" | null;
  recordOccurrence: number | null;
  recordTarget: SemanticDiffTarget | null;
}>;

export type SemanticDiffFlowSourceSnapshot = Readonly<{
  sourceHandleId: string;
  version: number | null;
  text: string;
  uri: string;
}>;

export type SemanticDiffFlowPanel = Readonly<{
  flowUri: string;
  ready: Promise<Readonly<{ document: UnitListDocumentDto }>>;
  postMessage(message: unknown): void | Thenable<boolean>;
  getBaseDocument?(): UnitListDocumentDto | null;
}>;

export type SemanticDiffFlowHost = Readonly<{
  getSourceSnapshot?(
    side: SemanticDiffSide,
    context: SemanticDiffOutputContext,
  ): SemanticDiffFlowSourceSnapshot | undefined;
  isSourceCurrent?(
    side: SemanticDiffSide,
    context: SemanticDiffOutputContext,
    snapshot: SemanticDiffFlowSourceSnapshot,
  ): boolean;
  open(
    side: SemanticDiffSide,
    targetUnitId: string,
    context: SemanticDiffOutputContext,
  ): Promise<SemanticDiffFlowPanel>;
}>;

export type SemanticDiffFlowActionResult =
  | Readonly<{ ok: true }>
  | Readonly<{
      ok: false;
      code: "flow-not-ready" | "flow-target-missing";
      targetId?: string;
    }>;

type FlowOverlayOwner = Readonly<{
  sessionId: string;
  disposeEpoch: number;
}>;

const sameOverlayOwner = (
  left: FlowOverlayOwner,
  right: FlowOverlayOwner,
): boolean =>
  left.sessionId === right.sessionId &&
  left.disposeEpoch === right.disposeEpoch;

const compareCodeUnits = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const stableValueKey = (value: unknown): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    return `[${value.map(stableValueKey).join(",")}]`;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort(compareCodeUnits)
      .map((key) => `${JSON.stringify(key)}:${stableValueKey(record[key])}`)
      .join(",")}}`;
  }
  return `${typeof value}:${JSON.stringify(value)}`;
};

const sameSemanticDiffTarget = (
  left: SemanticDiffTarget | null | undefined,
  right: SemanticDiffTarget | null,
): boolean =>
  left !== null &&
  left !== undefined &&
  right !== null &&
  stableValueKey(left) === stableValueKey(right);

/** Host-private one-overlay-per-Flow-URI ownership with stale-clear safety. */
export class SemanticDiffFlowOverlayRegistry {
  private readonly owners = new Map<
    string,
    {
      owner: FlowOverlayOwner;
      panel: SemanticDiffFlowPanel;
      document: UnitListDocumentDto;
      operationId: number;
    }
  >();
  private readonly nextOperationByFlowUri = new Map<string, number>();

  public replace(
    flowUri: string,
    panel: SemanticDiffFlowPanel,
    owner: FlowOverlayOwner,
    document: UnitListDocumentDto,
  ): number {
    const operationId = (this.nextOperationByFlowUri.get(flowUri) ?? 0) + 1;
    this.nextOperationByFlowUri.set(flowUri, operationId);
    this.owners.set(flowUri, { owner, panel, document, operationId });
    return operationId;
  }

  public owns(flowUri: string, owner: FlowOverlayOwner): boolean {
    const current = this.owners.get(flowUri)?.owner;
    return current !== undefined && sameOverlayOwner(current, owner);
  }

  public clear(
    flowUri: string,
    owner: FlowOverlayOwner,
    operationId?: number,
  ): void {
    const entry = this.owners.get(flowUri);
    if (
      !entry ||
      !sameOverlayOwner(entry.owner, owner) ||
      (operationId !== undefined && entry.operationId !== operationId)
    ) {
      return;
    }
    this.owners.delete(flowUri);
    const panelDocument = entry.panel.getBaseDocument?.();
    const baseDocument =
      panelDocument === undefined ? entry.document : panelDocument;
    try {
      entry.panel.postMessage(
        createViewerDocumentChangedMessage(
          baseDocument
            ? { ...baseDocument, semanticDiffOverlay: null }
            : undefined,
        ),
      );
    } catch {
      // A stale/disposed Flow panel is already safe to leave unchanged.
    }
  }

  public clearSession(sessionId: string): void {
    for (const [flowUri, entry] of this.owners) {
      if (entry.owner.sessionId === sessionId) {
        this.clear(flowUri, entry.owner, entry.operationId);
      }
    }
  }

  public get size(): number {
    return this.owners.size;
  }
}

const targetForRecord = (
  context: SemanticDiffOutputContext,
  request: SemanticDiffFlowActionRequest,
): SemanticDiffTarget | undefined => {
  if (
    request.recordId === null ||
    request.recordKind === null ||
    request.recordOccurrence === null ||
    request.recordTarget === null ||
    !Number.isSafeInteger(request.recordOccurrence) ||
    request.recordOccurrence < 0
  ) {
    return undefined;
  }
  const occurrence = request.recordOccurrence;
  if (request.recordKind === "change") {
    const change = recordAtSourceOccurrence(
      context.result.changes,
      request.recordId,
      occurrence,
    );
    if (!change) return undefined;
    const side = request.side;
    const target = side === "before" ? change.before : change.after;
    return sameSemanticDiffTarget(target, request.recordTarget)
      ? target
      : undefined;
  }
  if (request.recordKind === "confirmation") {
    const item = recordAtSourceOccurrence(
      context.result.confirmationRequired,
      request.recordId,
      occurrence,
    );
    return item && sameSemanticDiffTarget(item.target, request.recordTarget)
      ? item.target
      : undefined;
  }
  const item = recordAtSourceOccurrence(
    context.result.unsupportedItems,
    request.recordId,
    occurrence,
  );
  return item && sameSemanticDiffTarget(item.target, request.recordTarget)
    ? item.target
    : undefined;
};

const targetUnitIdForRequest = (
  request: SemanticDiffFlowActionRequest,
  target: SemanticDiffTarget | undefined,
): string | undefined => {
  if (!target) return undefined;
  if (
    target.kind === "unit" ||
    target.kind === "jobnet" ||
    target.kind === "attribute"
  ) {
    if (
      request.targetId !== target.unit.id ||
      request.targetKind !== target.kind
    ) {
      return undefined;
    }
    return target.unit.id;
  }
  if (
    target.kind === "relation" &&
    request.targetId === null &&
    request.targetKind === null
  ) {
    return target.relation.targetUnitId;
  }
  return undefined;
};

type FlowRelationPair = Pick<
  SemanticDiffRelationEndpoint,
  "sourceUnitId" | "targetUnitId" | "type"
>;

const relationForFlowTarget = (
  context: SemanticDiffOutputContext,
  request: SemanticDiffFlowActionRequest,
  target: SemanticDiffTarget,
): FlowRelationPair | undefined => {
  if (target.kind !== "relation" || request.side === null) return undefined;
  if (
    request.recordId === null ||
    request.recordKind === null ||
    request.recordOccurrence === null
  ) {
    return undefined;
  }
  const occurrence = request.recordOccurrence;
  if (request.recordKind === "change") {
    const change = recordAtSourceOccurrence(
      context.result.changes,
      request.recordId,
      occurrence,
    );
    if (change?.relationPair !== null && change?.relationPair !== undefined) {
      return change.relationPair[request.side] ?? undefined;
    }
    return target.relation;
  }
  if (request.recordKind === "confirmation") {
    const item = recordAtSourceOccurrence(
      context.result.confirmationRequired,
      request.recordId,
      occurrence,
    );
    if (
      item?.detail.relationPair !== null &&
      item?.detail.relationPair !== undefined
    ) {
      return item.detail.relationPair[request.side] ?? undefined;
    }
    return target.relation;
  }
  const item = recordAtSourceOccurrence(
    context.result.unsupportedItems,
    request.recordId,
    occurrence,
  );
  if (
    item?.detail.relationPair !== null &&
    item?.detail.relationPair !== undefined
  ) {
    return item.detail.relationPair[request.side] ?? undefined;
  }
  return target.relation;
};

export const createSemanticDiffFlowAction =
  ({
    host,
    registry = new SemanticDiffFlowOverlayRegistry(),
  }: Readonly<{
    host: SemanticDiffFlowHost;
    registry?: SemanticDiffFlowOverlayRegistry;
  }>): ((
    request: SemanticDiffFlowActionRequest,
    context: SemanticDiffOutputContext,
    isCurrent: () => boolean,
  ) => Promise<SemanticDiffFlowActionResult>) =>
  async (request, context, isCurrent) => {
    if (!isCurrent() || request.side === null) {
      return { ok: false, code: "flow-target-missing" };
    }
    const target = targetForRecord(context, request);
    if (!target) return { ok: false, code: "flow-target-missing" };
    const relation = relationForFlowTarget(context, request, target);
    if (target.kind === "relation" && !relation) {
      return {
        ok: false,
        code: "flow-target-missing",
        targetId: target.relation.targetUnitId,
      };
    }
    const targetUnitId =
      relation?.targetUnitId ?? targetUnitIdForRequest(request, target);
    if (!targetUnitId) return { ok: false, code: "flow-target-missing" };

    const sourceSnapshot = host.getSourceSnapshot?.(request.side, context);
    if (host.getSourceSnapshot && !sourceSnapshot) {
      return { ok: false, code: "flow-not-ready" };
    }
    const isSourceCurrent = (): boolean =>
      sourceSnapshot === undefined ||
      (host.isSourceCurrent?.(
        request.side as SemanticDiffSide,
        context,
        sourceSnapshot,
      ) ??
        true);
    const isFresh = (): boolean => isCurrent() && isSourceCurrent();
    if (!isFresh()) return { ok: false, code: "flow-not-ready" };

    let panel: SemanticDiffFlowPanel;
    try {
      panel = await host.open(request.side, targetUnitId, context);
    } catch {
      return { ok: false, code: "flow-not-ready" };
    }
    let ready: Readonly<{ document: UnitListDocumentDto }>;
    try {
      ready = await panel.ready;
    } catch {
      return { ok: false, code: "flow-not-ready" };
    }
    if (!isFresh()) return { ok: false, code: "flow-not-ready" };
    const validation = validateFlowGraphDocument(ready.document);
    const relationOccurrences = relation
      ? findSemanticDiffFlowRelationOccurrences(ready.document, relation)
      : [];
    if (relation && relationOccurrences.length === 0) {
      return {
        ok: false,
        code: "flow-target-missing",
        targetId: relation.targetUnitId,
      };
    }
    const focusUnitId = relation
      ? relationOccurrences[0]?.targetUnitId
      : targetUnitId;
    const targetUnit =
      validation.status === "available"
        ? validation.index.unitById.get(focusUnitId ?? targetUnitId)
        : undefined;
    if (!targetUnit) {
      return {
        ok: false,
        code: "flow-target-missing",
        ...(relation ? { targetId: relation.targetUnitId } : {}),
      };
    }
    if (!isFresh()) return { ok: false, code: "flow-not-ready" };

    const owner: FlowOverlayOwner = Object.freeze({
      sessionId: request.sessionId,
      disposeEpoch: request.disposeEpoch ?? 0,
    });
    const document: UnitListDocumentDto = {
      ...ready.document,
      semanticDiffOverlay: buildSemanticDiffFlowOverlay(
        context.result,
        request.side,
        ready.document,
      ),
    };
    if (!isFresh()) return { ok: false, code: "flow-not-ready" };
    const operationId = registry.replace(
      panel.flowUri,
      panel,
      owner,
      ready.document,
    );
    try {
      const changed = panel.postMessage(
        createViewerDocumentChangedMessage(document),
      );
      if (
        typeof changed === "object" &&
        changed !== null &&
        "then" in changed
      ) {
        if (!(await changed)) {
          registry.clear(panel.flowUri, owner, operationId);
          return { ok: false, code: "flow-not-ready" };
        }
      }
      if (!isFresh()) {
        registry.clear(panel.flowUri, owner, operationId);
        return { ok: false, code: "flow-not-ready" };
      }
      const reveal = panel.postMessage(
        createViewerRevealUnitMessage(targetUnit.absolutePath),
      );
      if (typeof reveal === "object" && reveal !== null && "then" in reveal) {
        if (!(await reveal)) {
          registry.clear(panel.flowUri, owner, operationId);
          return { ok: false, code: "flow-not-ready" };
        }
      }
      if (!isFresh()) {
        registry.clear(panel.flowUri, owner, operationId);
        return { ok: false, code: "flow-not-ready" };
      }
    } catch {
      registry.clear(panel.flowUri, owner, operationId);
      return { ok: false, code: "flow-not-ready" };
    }
    return { ok: true };
  };
