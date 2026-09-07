import * as vscode from "vscode";
import type {
  SemanticDiffSourceLookupRequest,
  SemanticDiffSourceLookupResult,
} from "../../../application/parsing/AjsParserWithSourceIndexPort";
import {
  isSemanticDiffSourceCaptureBindingActive,
  lookupSemanticDiffSourceCaptureBinding,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSide } from "../../../application/semantic-diff/semanticDiffDto";
import type {
  SemanticDiffSourceActionDeps,
  SemanticDiffSourceActionFailureCode,
  SemanticDiffSourceActionRequest,
  SemanticDiffSourceActionResult,
} from "./semanticDiffExplorerSourceAction";
import type {
  SemanticDiffSourceCaptureEntry,
  SemanticDiffSourceHostDescriptor,
} from "./semanticDiffExplorerRegistry";

type SourceLookupSuccess = Readonly<{
  primaryRange: Readonly<{
    start: Readonly<{ line: number; character: number }>;
    end: Readonly<{ line: number; character: number }>;
  }>;
}>;

const sourceForSide = (
  entry: SemanticDiffSourceCaptureEntry,
  side: SemanticDiffSide,
): SemanticDiffSourceHostDescriptor => entry.sources[side];

const missingSourceRequest = (
  request: SemanticDiffSourceActionRequest,
): boolean =>
  request.side === null ||
  request.targetId === null ||
  request.targetKind === null;

const missingParameterKey = (
  request: SemanticDiffSourceActionRequest,
): boolean =>
  request.targetKind === "attribute" && request.parameterKey === null;

const sourceLookupRequest = (
  entry: SemanticDiffSourceCaptureEntry,
  request: SemanticDiffSourceActionRequest,
): SemanticDiffSourceLookupRequest => {
  const source = entry.binding[request.side as SemanticDiffSide];
  return request.targetKind === "attribute"
    ? {
        sourceIndexId: source.sourceIndex.sourceIndexId,
        unitId: request.targetId as string,
        targetKind: "attribute",
        parameterKey: request.parameterKey ?? "",
      }
    : {
        sourceIndexId: source.sourceIndex.sourceIndexId,
        unitId: request.targetId as string,
        targetKind: request.targetKind as "unit" | "jobnet",
      };
};

const lookupSourceRange = (
  entry: SemanticDiffSourceCaptureEntry,
  request: SemanticDiffSourceActionRequest,
): SemanticDiffSourceLookupResult => {
  let result: SemanticDiffSourceLookupResult;
  if (missingSourceRequest(request)) {
    result = { code: "source-index-missing" };
  } else if (missingParameterKey(request)) {
    result = { code: "parameter-key-missing" };
  } else {
    result = lookupSemanticDiffSourceCaptureBinding(
      entry.binding,
      request.side as SemanticDiffSide,
      sourceLookupRequest(entry, request),
    );
  }
  return result;
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

const sourceLookupFailureCode = (
  lookup: SemanticDiffSourceLookupResult,
): SemanticDiffSourceActionFailureCode => {
  const failureCodes: Record<string, SemanticDiffSourceActionFailureCode> = {
    "stale-source": "stale-source",
    "expired-source-index": "stale-source",
    "source-index-missing": "source-lookup-failed",
    "unit-missing": "source-lookup-failed",
    "parameter-key-missing": "source-lookup-failed",
    "parameter-occurrence-missing": "source-lookup-failed",
  };
  const result = "code" in lookup ? failureCodes[lookup.code] : undefined;
  return result ?? "unavailable-target";
};

const sourceIsCurrent = (
  descriptor: SemanticDiffSourceHostDescriptor,
  document: vscode.TextDocument,
  deps: SemanticDiffSourceActionDeps,
): boolean =>
  deps.isCurrent() &&
  sourceBindingIsActive(deps) &&
  matchesCapturedSource(descriptor, document);

const sourceBindingIsActive = (deps: SemanticDiffSourceActionDeps): boolean =>
  isSemanticDiffSourceCaptureBindingActive(deps.sourceCapture.binding);

const openCapturedSource = async (
  descriptor: SemanticDiffSourceHostDescriptor,
  deps: SemanticDiffSourceActionDeps,
): Promise<vscode.TextDocument | undefined> => {
  let document: vscode.TextDocument | undefined;
  try {
    document = await deps.openTextDocument(descriptor.uri);
  } catch {
    document = undefined;
  }
  return document;
};

const currentSourceDocument = (
  descriptor: SemanticDiffSourceHostDescriptor,
  document: vscode.TextDocument | undefined,
  deps: SemanticDiffSourceActionDeps,
): document is vscode.TextDocument =>
  document !== undefined && sourceIsCurrent(descriptor, document, deps);

const showCapturedSource = async (
  document: vscode.TextDocument,
  range: vscode.Range,
  deps: SemanticDiffSourceActionDeps,
): Promise<vscode.TextEditor | undefined> => {
  let editor: vscode.TextEditor | undefined;
  try {
    editor = await deps.showTextDocument(document, {
      preview: false,
      preserveFocus: false,
      viewColumn: vscode.ViewColumn.Active,
      selection: range,
    });
  } catch {
    editor = undefined;
  }
  return editor;
};

const showCurrentSource = async (
  options: Readonly<{
    descriptor: SemanticDiffSourceHostDescriptor;
    document: vscode.TextDocument | undefined;
    range: vscode.Range;
    deps: SemanticDiffSourceActionDeps;
  }>,
): Promise<vscode.TextEditor | undefined> =>
  currentSourceDocument(options.descriptor, options.document, options.deps) &&
  options.document
    ? showCapturedSource(options.document, options.range, options.deps)
    : undefined;

const currentSourceEditor = (
  options: Readonly<{
    descriptor: SemanticDiffSourceHostDescriptor;
    document: vscode.TextDocument | undefined;
    editor: vscode.TextEditor | undefined;
    deps: SemanticDiffSourceActionDeps;
  }>,
): boolean =>
  editorMatchesDocument(options.document, options.editor) &&
  currentSourceDocument(options.descriptor, options.document, options.deps);

const editorMatchesDocument = (
  document: vscode.TextDocument | undefined,
  editor: vscode.TextEditor | undefined,
): editor is vscode.TextEditor =>
  editor !== undefined &&
  document !== undefined &&
  editor.document === document;

const revealCapturedRange = (
  editor: vscode.TextEditor,
  range: vscode.Range,
): boolean => {
  let revealed = false;
  try {
    editor.revealRange(
      range,
      vscode.TextEditorRevealType.InCenterIfOutsideViewport,
    );
    revealed = true;
  } catch {
    revealed = false;
  }
  return revealed;
};

const readySourceEditor = (
  initiallyCurrent: boolean,
  finallyCurrent: boolean,
  editor: vscode.TextEditor | undefined,
): vscode.TextEditor | undefined =>
  initiallyCurrent && finallyCurrent ? editor : undefined;

const sourceRevealResult = (
  editor: vscode.TextEditor | undefined,
  range: vscode.Range,
): SemanticDiffSourceActionResult => {
  if (editor === undefined) {
    return { ok: false, code: "stale-source" };
  }
  return revealCapturedRange(editor, range)
    ? { ok: true, range }
    : { ok: false, code: "stale-source" };
};

const revealSourceRange = async (
  request: SemanticDiffSourceActionRequest,
  lookup: SourceLookupSuccess,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> => {
  const descriptor = sourceForSide(
    deps.sourceCapture,
    request.side as SemanticDiffSide,
  );
  const document = await openCapturedSource(descriptor, deps);
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
  const initiallyCurrent = currentSourceDocument(descriptor, document, deps);
  const editor = await showCurrentSource({ descriptor, document, range, deps });
  const finallyCurrent = currentSourceEditor({
    descriptor,
    document,
    editor,
    deps,
  });
  const readyEditor = readySourceEditor(
    initiallyCurrent,
    finallyCurrent,
    editor,
  );
  return sourceRevealResult(readyEditor, range);
};

export const runSemanticDiffExplorerSourceAction = async (
  request: SemanticDiffSourceActionRequest,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> => {
  let result: SemanticDiffSourceActionResult;
  if (!deps.isCurrent() || !sourceBindingIsActive(deps)) {
    result = { ok: false, code: "stale-source" };
  } else {
    const lookup = lookupSourceRange(deps.sourceCapture, request);
    result = await actionResultForLookup(request, lookup, deps);
  }
  return result;
};

const actionResultForLookup = async (
  request: SemanticDiffSourceActionRequest,
  lookup: SemanticDiffSourceLookupResult,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> => {
  const result: Promise<SemanticDiffSourceActionResult> =
    "primaryRange" in lookup
      ? sourceActionForRange(request, lookup, deps)
      : Promise.resolve<SemanticDiffSourceActionResult>({
          ok: false,
          code: sourceLookupFailureCode(lookup),
        });
  return result;
};

const sourceActionForRange = (
  request: SemanticDiffSourceActionRequest,
  lookup: SourceLookupSuccess,
  deps: SemanticDiffSourceActionDeps,
): Promise<SemanticDiffSourceActionResult> =>
  request.side !== null && request.targetId !== null
    ? revealSourceRange(request, lookup, deps)
    : Promise.resolve<SemanticDiffSourceActionResult>({
        ok: false,
        code: "unavailable-target",
      });
