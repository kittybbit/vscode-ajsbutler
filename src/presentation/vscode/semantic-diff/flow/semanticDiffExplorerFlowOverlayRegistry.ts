import type { UnitListDocumentDto } from "../../../../application/unit-list/unitListDocument";
import { createViewerDocumentChangedMessage } from "../../../webview/viewerHostMessages";
import type {
  FlowOverlayOwner,
  SemanticDiffFlowPanel,
} from "./semanticDiffExplorerFlow";

type FlowOverlayEntry = Readonly<{
  owner: FlowOverlayOwner;
  panel: SemanticDiffFlowPanel;
  document: UnitListDocumentDto;
  operationId: number;
}>;

type ReplaceOverlayOptions = Readonly<{
  flowUri: string;
  panel: SemanticDiffFlowPanel;
  owner: FlowOverlayOwner;
  document: UnitListDocumentDto;
}>;

const sameOverlayOwner = (
  left: FlowOverlayOwner,
  right: FlowOverlayOwner,
): boolean =>
  left.sessionId === right.sessionId &&
  left.disposeEpoch === right.disposeEpoch;

const documentForClear = (
  entry: FlowOverlayEntry,
): UnitListDocumentDto | null => {
  const panelDocument = entry.panel.getBaseDocument?.();
  return panelDocument === undefined ? entry.document : panelDocument;
};

const postClearedOverlay = (entry: FlowOverlayEntry): void => {
  try {
    const baseDocument = documentForClear(entry);
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
};

/** Host-private one-overlay-per-Flow-URI ownership with stale-clear safety. */
export class SemanticDiffFlowOverlayRegistry {
  private readonly owners = new Map<string, FlowOverlayEntry>();
  private readonly nextOperationByFlowUri = new Map<string, number>();

  public replace({
    flowUri,
    panel,
    owner,
    document,
  }: ReplaceOverlayOptions): number {
    const operationId = this.nextOperation(flowUri);
    this.owners.set(flowUri, { owner, panel, document, operationId });
    return operationId;
  }

  private nextOperation(flowUri: string): number {
    const operationId = (this.nextOperationByFlowUri.get(flowUri) ?? 0) + 1;
    this.nextOperationByFlowUri.set(flowUri, operationId);
    return operationId;
  }

  public owns(flowUri: string, owner: FlowOverlayOwner): boolean {
    const current = this.owners.get(flowUri)?.owner;
    return current !== undefined && sameOverlayOwner(current, owner);
  }

  private canClear(
    entry: FlowOverlayEntry | undefined,
    owner: FlowOverlayOwner,
    operationId: number | undefined,
  ): entry is FlowOverlayEntry {
    if (!entry) return false;
    if (!sameOverlayOwner(entry.owner, owner)) return false;
    return operationId === undefined || entry.operationId === operationId;
  }

  public clear(
    flowUri: string,
    owner: FlowOverlayOwner,
    operationId?: number,
  ): void {
    const entry = this.owners.get(flowUri);
    if (!this.canClear(entry, owner, operationId)) return;
    this.owners.delete(flowUri);
    postClearedOverlay(entry);
  }

  public clearSession(sessionId: string): void {
    for (const [flowUri, entry] of this.owners) {
      if (entry.owner.sessionId !== sessionId) continue;
      this.clear(flowUri, entry.owner, entry.operationId);
    }
  }

  public get size(): number {
    return this.owners.size;
  }
}
