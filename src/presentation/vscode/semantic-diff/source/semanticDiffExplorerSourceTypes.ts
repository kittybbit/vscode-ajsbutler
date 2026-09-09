import type { SemanticDiffSourceCaptureBinding } from "../../../../application/semantic-diff/semanticDiffSourceCapture";
import type { ImmutableSourceDescriptor } from "../../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSide } from "../../../../application/semantic-diff/semanticDiffDto";
import type * as vscode from "vscode";

export type SemanticDiffSourceHostDescriptor = ImmutableSourceDescriptor & {
  readonly uri: vscode.Uri;
};

export type SemanticDiffSourceCaptureEntry = Readonly<{
  binding: SemanticDiffSourceCaptureBinding;
  sources: Readonly<{
    before: SemanticDiffSourceHostDescriptor;
    after: SemanticDiffSourceHostDescriptor;
  }>;
  release: () => void;
}>;

export type SemanticDiffSourceActionRequest = Readonly<{
  side: SemanticDiffSide | null;
  targetId: string | null;
  targetKind: "unit" | "jobnet" | "attribute" | null;
  parameterKey: string | null;
}>;

export type SemanticDiffSourceActionFailureCode =
  | "unavailable-target"
  | "source-lookup-failed"
  | "stale-source";

export type SemanticDiffSourceActionResult =
  | Readonly<{ ok: true; range: vscode.Range }>
  | Readonly<{ ok: false; code: SemanticDiffSourceActionFailureCode }>;

export type SemanticDiffSourceActionDeps = Readonly<{
  sourceCapture: SemanticDiffSourceCaptureEntry;
  openTextDocument: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  showTextDocument: (
    document: vscode.TextDocument,
    options?: vscode.TextDocumentShowOptions,
  ) => Thenable<vscode.TextEditor>;
  isCurrent: () => boolean;
}>;
