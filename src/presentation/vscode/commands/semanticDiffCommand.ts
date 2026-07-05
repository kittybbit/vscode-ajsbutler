import type * as vscode from "vscode";
import type { BuildSemanticDiffReport } from "../../../application/semantic-diff/buildSemanticDiffReport";

export const COMPARE_SEMANTIC_DIFF_COMMAND = "ajsbutler.compareSemanticDiff";

export type SemanticDiffReportAction = "copied" | "saved" | "cancelled";

export type SemanticDiffCommandResult =
  | {
      ok: true;
      report: string;
      action: SemanticDiffReportAction;
    }
  | {
      ok: false;
      error: {
        code:
          | "no-active-editor"
          | "cancelled"
          | "read-failed"
          | "parse-failed"
          | "copy-failed"
          | "save-failed";
        message: string;
      };
    };

export type SemanticDiffCommandDeps = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showOpenDialog: (
    options: vscode.OpenDialogOptions,
  ) => Thenable<vscode.Uri[] | undefined>;
  showSaveDialog: (
    options: vscode.SaveDialogOptions,
  ) => Thenable<vscode.Uri | undefined>;
  showInformationMessage: (
    message: string,
    ...items: string[]
  ) => Thenable<string | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  readFile: (uri: vscode.Uri) => Thenable<Uint8Array>;
  writeFile: (uri: vscode.Uri, content: Uint8Array) => Thenable<void>;
  writeClipboard: (text: string) => Thenable<void>;
  buildSemanticDiffReport: BuildSemanticDiffReport;
};

const textDecoder = new TextDecoder("utf-8");
const textEncoder = new TextEncoder();
const SAVE_ACTION = "Save";

const commandError = (
  code: Extract<SemanticDiffCommandResult, { ok: false }>["error"]["code"],
  message: string,
): Extract<SemanticDiffCommandResult, { ok: false }> => ({
  ok: false,
  error: { code, message },
});

const safeShowErrorMessage = async (
  deps: SemanticDiffCommandDeps,
  message: string,
): Promise<void> => {
  await deps.showErrorMessage(message);
};

const readBeforeDefinition = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "ready"; content: string }
  | { kind: "cancelled" }
  | { kind: "failed" }
> => {
  const selected = await deps.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Select Before Definition",
  });
  const beforeUri = selected?.[0];
  if (!beforeUri) {
    return { kind: "cancelled" };
  }

  try {
    return {
      kind: "ready",
      content: textDecoder.decode(await deps.readFile(beforeUri)),
    };
  } catch {
    return { kind: "failed" };
  }
};

const saveReportIfRequested = async (
  deps: SemanticDiffCommandDeps,
  report: string,
): Promise<SemanticDiffCommandResult> => {
  const action = await deps.showInformationMessage(
    "Semantic diff report copied to clipboard.",
    SAVE_ACTION,
  );
  if (action !== SAVE_ACTION) {
    return { ok: true, report, action: "copied" };
  }

  const saveUri = await deps.showSaveDialog({
    saveLabel: "Save Semantic Diff Report",
    filters: { Markdown: ["md"] },
  });
  if (!saveUri) {
    return { ok: true, report, action: "cancelled" };
  }

  try {
    await deps.writeFile(saveUri, textEncoder.encode(report));
    await deps.showInformationMessage("Semantic diff report saved.");
    return { ok: true, report, action: "saved" };
  } catch {
    const message = "Semantic diff report could not be saved.";
    await safeShowErrorMessage(deps, message);
    return commandError("save-failed", message);
  }
};

export const executeCompareSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<SemanticDiffCommandResult> => {
  const activeEditor = deps.getActiveEditor();
  if (!activeEditor) {
    const message = "Open a JP1/AJS definition before running semantic diff.";
    await safeShowErrorMessage(deps, message);
    return commandError("no-active-editor", message);
  }

  const beforeDefinition = await readBeforeDefinition(deps);
  if (beforeDefinition.kind === "cancelled") {
    return commandError("cancelled", "Semantic diff was cancelled.");
  }
  if (beforeDefinition.kind === "failed") {
    const message = "Selected before definition could not be read.";
    await safeShowErrorMessage(deps, message);
    return commandError("read-failed", message);
  }

  const reportResult = deps.buildSemanticDiffReport({
    beforeContent: beforeDefinition.content,
    afterContent: activeEditor.document.getText(),
  });
  if (!reportResult.ok) {
    const message =
      "Semantic diff could not parse one or both JP1/AJS definitions.";
    await safeShowErrorMessage(deps, message);
    return commandError("parse-failed", message);
  }
  const report = reportResult.report;

  try {
    await deps.writeClipboard(report);
  } catch {
    const message = "Semantic diff report could not be copied.";
    await safeShowErrorMessage(deps, message);
    return commandError("copy-failed", message);
  }

  return saveReportIfRequested(deps, report);
};
