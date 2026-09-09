import * as vscode from "vscode";
import type { SemanticDiffSide } from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffSourceCaptureEntry } from "./semanticDiffExplorerSourceTypes";
import { runSemanticDiffExplorerSourceAction } from "./semanticDiffExplorerSourceActionRunner";

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

export const executeSemanticDiffExplorerSourceAction = async (
  request: SemanticDiffSourceActionRequest,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> =>
  runSemanticDiffExplorerSourceAction(request, deps);
