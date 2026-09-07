import * as vscode from "vscode";
import {
  type SemanticDiffSourceLookupRequest,
  type SemanticDiffSourceLookupResult,
} from "../../../application/parsing/AjsParserWithSourceIndexPort";
import {
  isSemanticDiffSourceCaptureBindingActive,
  lookupSemanticDiffSourceCaptureBinding,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSide } from "../../../application/semantic-diff/semanticDiffDto";
import type {
  SemanticDiffSourceCaptureEntry,
  SemanticDiffSourceHostDescriptor,
} from "./semanticDiffExplorerRegistry";

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

const sourceForSide = (
  entry: SemanticDiffSourceCaptureEntry,
  side: SemanticDiffSide,
): SemanticDiffSourceHostDescriptor => entry.sources[side];

const lookupSourceRange = (
  entry: SemanticDiffSourceCaptureEntry,
  request: SemanticDiffSourceActionRequest,
): SemanticDiffSourceLookupResult => {
  if (
    request.side === null ||
    request.targetId === null ||
    request.targetKind === null
  ) {
    return { code: "source-index-missing" };
  }
  const source = entry.binding[request.side];
  const lookupRequest: SemanticDiffSourceLookupRequest =
    request.targetKind === "attribute"
      ? {
          sourceIndexId: source.sourceIndex.sourceIndexId,
          unitId: request.targetId,
          targetKind: "attribute",
          parameterKey: request.parameterKey ?? "",
        }
      : {
          sourceIndexId: source.sourceIndex.sourceIndexId,
          unitId: request.targetId,
          targetKind: request.targetKind,
        };
  if (request.targetKind === "attribute") {
    if (request.parameterKey === null) return { code: "parameter-key-missing" };
    return lookupSemanticDiffSourceCaptureBinding(
      entry.binding,
      request.side,
      lookupRequest,
    );
  }
  return lookupSemanticDiffSourceCaptureBinding(
    entry.binding,
    request.side,
    lookupRequest,
  );
};

const sameVersion = (
  descriptor: SemanticDiffSourceHostDescriptor,
  document: vscode.TextDocument,
): boolean =>
  descriptor.version === null ||
  typeof document.version !== "number" ||
  descriptor.version === document.version;

const matchesCapturedSource = (
  descriptor: SemanticDiffSourceHostDescriptor,
  document: vscode.TextDocument,
): boolean => {
  try {
    return (
      document.getText() === descriptor.text &&
      sameVersion(descriptor, document)
    );
  } catch {
    return false;
  }
};

export const executeSemanticDiffExplorerSourceAction = async (
  request: SemanticDiffSourceActionRequest,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> => {
  if (
    !deps.isCurrent() ||
    !isSemanticDiffSourceCaptureBindingActive(deps.sourceCapture.binding)
  ) {
    return { ok: false, code: "stale-source" };
  }
  const lookup = lookupSourceRange(deps.sourceCapture, request);
  if (!("primaryRange" in lookup)) {
    return {
      ok: false,
      code:
        lookup.code === "stale-source" || lookup.code === "expired-source-index"
          ? "stale-source"
          : lookup.code === "source-index-missing" ||
              lookup.code === "unit-missing" ||
              lookup.code === "parameter-key-missing" ||
              lookup.code === "parameter-occurrence-missing"
            ? "source-lookup-failed"
            : "unavailable-target",
    };
  }
  if (request.side === null || request.targetId === null) {
    return { ok: false, code: "unavailable-target" };
  }
  const descriptor = sourceForSide(deps.sourceCapture, request.side);
  let document: vscode.TextDocument;
  try {
    document = await deps.openTextDocument(descriptor.uri);
  } catch {
    return { ok: false, code: "stale-source" };
  }
  if (
    !deps.isCurrent() ||
    !isSemanticDiffSourceCaptureBindingActive(deps.sourceCapture.binding) ||
    !matchesCapturedSource(descriptor, document)
  ) {
    return { ok: false, code: "stale-source" };
  }
  const range = new vscode.Range(
    new vscode.Position(
      lookup.primaryRange.start.line,
      lookup.primaryRange.start.character,
    ),
    new vscode.Position(
      lookup.primaryRange.end.line,
      lookup.primaryRange.end.character,
    ),
  );
  let editor: vscode.TextEditor;
  try {
    editor = await deps.showTextDocument(document, {
      preview: false,
      preserveFocus: false,
      viewColumn: vscode.ViewColumn.Active,
      selection: range,
    });
  } catch {
    return { ok: false, code: "stale-source" };
  }
  if (
    !deps.isCurrent() ||
    !isSemanticDiffSourceCaptureBindingActive(deps.sourceCapture.binding) ||
    editor.document !== document ||
    !matchesCapturedSource(descriptor, document)
  ) {
    return { ok: false, code: "stale-source" };
  }
  try {
    editor.revealRange(
      range,
      vscode.TextEditorRevealType.InCenterIfOutsideViewport,
    );
  } catch {
    return { ok: false, code: "stale-source" };
  }
  return { ok: true, range };
};
