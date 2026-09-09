import type { UnitListDocumentDto } from "../../../../application/unit-list/unitListDocument";
import type {
  SemanticDiffOutputContext,
  SemanticDiffSide,
  SemanticDiffTarget,
} from "../../../../application/semantic-diff/semanticDiffDto";

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

export type FlowOverlayOwner = Readonly<{
  sessionId: string;
  disposeEpoch: number;
}>;

export { createSemanticDiffFlowAction } from "./semanticDiffExplorerFlowAction";
export { SemanticDiffFlowOverlayRegistry } from "./semanticDiffExplorerFlowOverlayRegistry";
