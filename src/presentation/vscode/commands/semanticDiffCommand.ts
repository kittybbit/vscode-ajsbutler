import type * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  pickSemanticDiffOutputMode,
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputMode,
  type SemanticDiffOutputModeItem,
} from "../../semantic-diff/semanticDiffOutput";

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
          | "active-editor-failed"
          | "cancelled"
          | "mode-picker-failed"
          | "read-failed"
          | "parse-failed"
          | "render-failed"
          | "display-failed";
        message: string;
      };
    };

export type SemanticDiffCommandDeps = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showQuickPick: (
    items: readonly SemanticDiffOutputModeItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffOutputModeItem | undefined>;
  showOpenDialog: (
    options: vscode.OpenDialogOptions,
  ) => Thenable<vscode.Uri[] | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  readFile: (uri: vscode.Uri) => Thenable<Uint8Array>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  language?: string;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  buildSemanticDiffOutputContext?: (
    result: Parameters<typeof buildSemanticDiffOutputContext>[0],
  ) => SemanticDiffOutputContext;
  presentSemanticDiffOutput?: (
    context: SemanticDiffOutputContext,
    mode: SemanticDiffOutputMode,
    language?: string,
  ) => SemanticDiffOutputDocument;
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
  try {
    await deps.showErrorMessage(message);
  } catch {
    // A notification failure must not replace the command's repository-owned result.
  }
};

const readBeforeDefinition = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "ready"; content: string }
  | { kind: "cancelled" }
  | { kind: "failed" }
> => {
  let selected: vscode.Uri[] | undefined;
  try {
    selected = await deps.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: "Select Before Definition",
    });
  } catch {
    return { kind: "failed" };
  }

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

const selectOutputMode = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "selected"; mode: SemanticDiffOutputMode }
  | { kind: "cancelled" }
  | { kind: "failed" }
> => {
  try {
    const mode = await pickSemanticDiffOutputMode((items, options) =>
      deps.showQuickPick(items, options),
    );
    return mode ? { kind: "selected", mode } : { kind: "cancelled" };
  } catch {
    return { kind: "failed" };
  }
};

export const executeCompareSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<SemanticDiffCommandResult> => {
  let activeEditor: vscode.TextEditor | undefined;
  try {
    activeEditor = deps.getActiveEditor();
  } catch {
    const message = "The active JP1/AJS definition could not be accessed.";
    await safeShowErrorMessage(deps, message);
    return commandError("active-editor-failed", message);
  }

  if (!activeEditor) {
    const message = "Open a JP1/AJS definition before running semantic diff.";
    await safeShowErrorMessage(deps, message);
    return commandError("no-active-editor", message);
  }

  const selectedMode = await selectOutputMode(deps);
  if (selectedMode.kind === "cancelled") {
    return commandError("cancelled", "Semantic diff was cancelled.");
  }
  if (selectedMode.kind === "failed") {
    const message = "Semantic diff output mode could not be selected.";
    await safeShowErrorMessage(deps, message);
    return commandError("mode-picker-failed", message);
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

  let reportInput: Parameters<BuildSemanticDiffReportData>[0];
  try {
    reportInput = {
      beforeContent: beforeDefinition.content,
      afterContent: activeEditor.document.getText(),
    };
  } catch {
    const message = "Active JP1/AJS definition could not be read.";
    await safeShowErrorMessage(deps, message);
    return commandError("read-failed", message);
  }

  let reportResult: ReturnType<BuildSemanticDiffReportData>;
  try {
    reportResult = deps.buildSemanticDiffReportData(reportInput);
  } catch {
    const message =
      "Semantic diff could not parse one or both JP1/AJS definitions.";
    await safeShowErrorMessage(deps, message);
    return commandError("parse-failed", message);
  }

  if (!reportResult.ok) {
    const message =
      "Semantic diff could not parse one or both JP1/AJS definitions.";
    await safeShowErrorMessage(deps, message);
    return commandError("parse-failed", message);
  }

  let output: SemanticDiffOutputDocument;
  try {
    const createContext =
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
    const present = deps.presentSemanticDiffOutput ?? presentSemanticDiffOutput;
    const context = createContext(reportResult.result);
    output = present(context, selectedMode.mode, deps.language);
  } catch {
    const message = "Semantic diff report could not be rendered.";
    await safeShowErrorMessage(deps, message);
    return commandError("render-failed", message);
  }

  try {
    await deps.openReport(output);
  } catch {
    const message = "Semantic diff report could not be displayed.";
    await safeShowErrorMessage(deps, message);
    return commandError("display-failed", message);
  }

  return { ok: true, report: output.content, action: "displayed" };
};
