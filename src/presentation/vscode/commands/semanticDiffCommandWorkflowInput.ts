import type * as vscode from "vscode";
import type { BuildSemanticDiffPresentationArtifactsResult } from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import {
  failedStep,
  readyStep,
  type CommandFailure,
  type CommandStep,
  type SemanticDiffCommandErrorCode,
} from "./semanticDiffCommandSteps";
import type { SemanticDiffCommandDeps } from "./semanticDiffCommand";

export const MAX_SEMANTIC_DIFF_SOURCE_BYTES = 8 * 1024 * 1024;

export type WorkflowAfterSnapshot = Readonly<{
  uri: vscode.Uri;
  version: number | null;
  text: string;
}>;

type SourceValidationFailure = Readonly<{
  code: SemanticDiffCommandErrorCode;
  message: string;
}>;

const sourceTextFailureDetail = (
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): SourceValidationFailure => ({
  code: side === "after" ? "after-non-text" : "before-file-non-text",
  message:
    side === "after"
      ? localization.afterNonText
      : localization.beforeFileNonText,
});

const sourceSizeFailureDetail = (
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): SourceValidationFailure => ({
  code: side === "after" ? "after-too-large" : "before-file-too-large",
  message:
    side === "after"
      ? localization.afterTooLarge
      : localization.beforeFileTooLarge,
});

const sourceValidationFailure = (
  text: string,
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): SourceValidationFailure | undefined => {
  if (text.includes("\u0000")) {
    return sourceTextFailureDetail(side, localization);
  }
  return new TextEncoder().encode(text).byteLength >
    MAX_SEMANTIC_DIFF_SOURCE_BYTES
    ? sourceSizeFailureDetail(side, localization)
    : undefined;
};

export const sourceTextFailure = (
  text: string,
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined => {
  const detail = sourceValidationFailure(text, side, localization);
  return detail ? failedStep(detail.code, detail.message) : undefined;
};

type ParseFailureKind = "before" | "after" | "both" | "none";

const parseFailureKind = (
  result: Extract<BuildSemanticDiffPresentationArtifactsResult, { ok: false }>,
): ParseFailureKind => {
  const failedSides =
    Number(result.errors.before.length > 0) +
    Number(result.errors.after.length > 0) * 2;
  return (["none", "before", "after", "both"] as const)[
    failedSides
  ] as ParseFailureKind;
};

export const parseFailureMessage = (
  result: Extract<BuildSemanticDiffPresentationArtifactsResult, { ok: false }>,
  localization: SemanticDiffCommandLocalization,
): string => {
  const messages: Record<ParseFailureKind, string> = {
    before: localization.parseFailedBefore,
    after: localization.parseFailedAfter,
    both: localization.parseFailedBoth,
    none: localization.parseFailed,
  };
  return messages[parseFailureKind(result)];
};

const readWorkflowEditor = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandStep<vscode.TextEditor> => {
  try {
    const activeEditor = deps.getActiveEditor();
    return activeEditor
      ? readyStep(activeEditor)
      : failedStep("no-active-editor", localization.noActiveEditor);
  } catch {
    return failedStep("active-editor-failed", localization.activeEditorFailed);
  }
};

const snapshotFromWorkflowEditor = (
  editor: vscode.TextEditor,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  try {
    const document = editor.document;
    const text = document.getText();
    return describeWorkflowAfter(document, text, localization);
  } catch {
    return failedStep("active-editor-failed", localization.activeEditorFailed);
  }
};

const describeWorkflowAfter = (
  document: vscode.TextDocument,
  text: string,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  const textStep = validateWorkflowAfterText(text, localization);
  return textStep.kind === "failed"
    ? textStep
    : workflowAfterSnapshot(document, textStep.value, localization);
};

const validateWorkflowAfterText = (
  text: string,
  localization: SemanticDiffCommandLocalization,
): CommandStep<string> => {
  const failure = sourceTextFailure(text, "after", localization);
  return failure ? failure : readyStep(text);
};

const workflowAfterSnapshot = (
  document: vscode.TextDocument,
  text: string,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  if (!document.uri) {
    return failedStep("active-editor-failed", localization.activeEditorFailed);
  }
  return readyStep({
    uri: document.uri,
    version: typeof document.version === "number" ? document.version : null,
    text,
  });
};

export const readWorkflowAfterSnapshot = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  const editorStep = readWorkflowEditor(deps, localization);
  return editorStep.kind === "failed"
    ? editorStep
    : snapshotFromWorkflowEditor(editorStep.value, localization);
};
