import type * as vscode from "vscode";
import type { BuildSemanticDiffReport } from "../../../application/semantic-diff/buildSemanticDiffReport";

export const COMPARE_SEMANTIC_DIFF_COMMAND = "ajsbutler.compareSemanticDiff";

export type SemanticDiffReportAction = "displayed";

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
          | "display-failed";
        message: string;
      };
    };

export type SemanticDiffCommandDeps = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showOpenDialog: (
    options: vscode.OpenDialogOptions,
  ) => Thenable<vscode.Uri[] | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  readFile: (uri: vscode.Uri) => Thenable<Uint8Array>;
  openReport: (report: string) => Thenable<void>;
  buildSemanticDiffReport: BuildSemanticDiffReport;
};

const textDecoder = new TextDecoder("utf-8");

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
    await deps.openReport(report);
  } catch {
    const message = "Semantic diff report could not be displayed.";
    await safeShowErrorMessage(deps, message);
    return commandError("display-failed", message);
  }

  return { ok: true, report, action: "displayed" };
};
