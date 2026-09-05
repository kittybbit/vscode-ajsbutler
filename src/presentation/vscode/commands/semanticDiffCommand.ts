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

type SemanticDiffCommandErrorCode = Extract<
  SemanticDiffCommandResult,
  { ok: false }
>["error"]["code"];

type CommandFailure = {
  kind: "failed";
  error: {
    code: SemanticDiffCommandErrorCode;
    message: string;
    notify: boolean;
  };
};

type CommandStep<T> = { kind: "ready"; value: T } | CommandFailure;

type CommandSelection = {
  activeEditor: vscode.TextEditor;
  mode: SemanticDiffOutputMode;
};

type CommandReportRequest = CommandSelection & {
  beforeContent: string;
};

type CommandReportData = CommandReportRequest & {
  input: Parameters<BuildSemanticDiffReportData>[0];
};

const readyStep = <T>(value: T): CommandStep<T> => ({
  kind: "ready",
  value,
});

const failedStep = (
  code: SemanticDiffCommandErrorCode,
  message: string,
  notify: boolean,
): CommandFailure => ({
  kind: "failed",
  error: { code, message, notify },
});

const continueCommandStep = async <T, U>(
  step: CommandStep<T>,
  next: (value: T) => CommandStep<U> | Promise<CommandStep<U>>,
): Promise<CommandStep<U>> =>
  step.kind === "failed" ? step : await next(step.value);

const mapCommandStep = <T, U>(
  step: CommandStep<T>,
  map: (value: T) => U,
): CommandStep<U> =>
  step.kind === "failed" ? step : readyStep(map(step.value));

const commandError = (
  code: SemanticDiffCommandErrorCode,
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

type BeforeSelection =
  | { kind: "selected"; uri: vscode.Uri }
  | { kind: "cancelled" }
  | { kind: "failed" };

const selectBeforeUri = async (
  deps: SemanticDiffCommandDeps,
): Promise<BeforeSelection> => {
  let result: BeforeSelection;
  try {
    const selected = await deps.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: "Select Before Definition",
    });
    const beforeUri = selected?.[0];
    result = beforeUri
      ? { kind: "selected", uri: beforeUri }
      : { kind: "cancelled" };
  } catch {
    result = { kind: "failed" };
  }
  return result;
};

const readBeforeFile = async (
  deps: SemanticDiffCommandDeps,
  beforeUri: vscode.Uri,
): Promise<{ kind: "ready"; content: string } | { kind: "failed" }> => {
  let result: { kind: "ready"; content: string } | { kind: "failed" };
  try {
    result = {
      kind: "ready",
      content: textDecoder.decode(await deps.readFile(beforeUri)),
    };
  } catch {
    result = { kind: "failed" };
  }
  return result;
};

const readBeforeDefinition = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "ready"; content: string }
  | { kind: "cancelled" }
  | { kind: "failed" }
> => {
  const selection = await selectBeforeUri(deps);
  return selection.kind === "selected"
    ? readBeforeFile(deps, selection.uri)
    : selection;
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

const readActiveEditorStep = (
  deps: SemanticDiffCommandDeps,
): CommandStep<vscode.TextEditor> => {
  let step: CommandStep<vscode.TextEditor>;
  try {
    const activeEditor = deps.getActiveEditor();
    step = activeEditor
      ? readyStep(activeEditor)
      : failedStep(
          "no-active-editor",
          "Open a JP1/AJS definition before running semantic diff.",
          true,
        );
  } catch {
    step = failedStep(
      "active-editor-failed",
      "The active JP1/AJS definition could not be accessed.",
      true,
    );
  }
  return step;
};

const outputModeFailures: Record<"cancelled" | "failed", CommandFailure> = {
  cancelled: failedStep("cancelled", "Semantic diff was cancelled.", false),
  failed: failedStep(
    "mode-picker-failed",
    "Semantic diff output mode could not be selected.",
    true,
  ),
};

const toOutputModeStep = (
  selectedMode: Awaited<ReturnType<typeof selectOutputMode>>,
): CommandStep<SemanticDiffOutputMode> =>
  selectedMode.kind === "selected"
    ? readyStep(selectedMode.mode)
    : outputModeFailures[selectedMode.kind];

const selectOutputModeStep = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffOutputMode>> =>
  toOutputModeStep(await selectOutputMode(deps));

const selectModeForEditor = async (
  deps: SemanticDiffCommandDeps,
  activeEditor: vscode.TextEditor,
): Promise<CommandStep<CommandSelection>> =>
  mapCommandStep(await selectOutputModeStep(deps), (mode) => ({
    activeEditor,
    mode,
  }));

const beforeDefinitionFailures: Record<"cancelled" | "failed", CommandFailure> =
  {
    cancelled: failedStep("cancelled", "Semantic diff was cancelled.", false),
    failed: failedStep(
      "read-failed",
      "Selected before definition could not be read.",
      true,
    ),
  };

const toBeforeDefinitionStep = (
  beforeDefinition: Awaited<ReturnType<typeof readBeforeDefinition>>,
): CommandStep<string> =>
  beforeDefinition.kind === "ready"
    ? readyStep(beforeDefinition.content)
    : beforeDefinitionFailures[beforeDefinition.kind];

const readBeforeDefinitionStep = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<string>> =>
  toBeforeDefinitionStep(await readBeforeDefinition(deps));

const selectBeforeForCommand = async (
  deps: SemanticDiffCommandDeps,
  selection: CommandSelection,
): Promise<CommandStep<CommandReportRequest>> =>
  mapCommandStep(
    await readBeforeDefinitionStep(deps),
    (beforeContent): CommandReportRequest => ({
      ...selection,
      beforeContent,
    }),
  );

const readReportInputStep = (
  request: CommandReportRequest,
): CommandStep<CommandReportData> => {
  let step: CommandStep<CommandReportData>;
  try {
    step = readyStep({
      ...request,
      input: {
        beforeContent: request.beforeContent,
        afterContent: request.activeEditor.document.getText(),
      },
    });
  } catch {
    step = failedStep(
      "read-failed",
      "Active JP1/AJS definition could not be read.",
      true,
    );
  }
  return step;
};

const buildReportDataStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): CommandStep<
  CommandReportData & {
    result: Extract<
      ReturnType<BuildSemanticDiffReportData>,
      { ok: true }
    >["result"];
  }
> => {
  let step: CommandStep<
    CommandReportData & {
      result: Extract<
        ReturnType<BuildSemanticDiffReportData>,
        { ok: true }
      >["result"];
    }
  >;
  try {
    const reportResult = deps.buildSemanticDiffReportData(request.input);
    step = reportResult.ok
      ? readyStep({ ...request, result: reportResult.result })
      : failedStep(
          "parse-failed",
          "Semantic diff could not parse one or both JP1/AJS definitions.",
          true,
        );
  } catch {
    step = failedStep(
      "parse-failed",
      "Semantic diff could not parse one or both JP1/AJS definitions.",
      true,
    );
  }
  return step;
};

type CommandReadyReport = Extract<
  ReturnType<BuildSemanticDiffReportData>,
  { ok: true }
>["result"];

const renderReportStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & { result: CommandReadyReport },
): CommandStep<SemanticDiffOutputDocument> => {
  let step: CommandStep<SemanticDiffOutputDocument>;
  try {
    const createContext =
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
    const present = deps.presentSemanticDiffOutput ?? presentSemanticDiffOutput;
    const context = createContext(request.result);
    step = readyStep(present(context, request.mode, deps.language));
  } catch {
    step = failedStep(
      "render-failed",
      "Semantic diff report could not be rendered.",
      true,
    );
  }
  return step;
};

const displayReportStep = async (
  deps: SemanticDiffCommandDeps,
  output: SemanticDiffOutputDocument,
): Promise<CommandStep<SemanticDiffOutputDocument>> => {
  let step: CommandStep<SemanticDiffOutputDocument>;
  try {
    await deps.openReport(output);
    step = readyStep(output);
  } catch {
    step = failedStep(
      "display-failed",
      "Semantic diff report could not be displayed.",
      true,
    );
  }
  return step;
};

const runSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffOutputDocument>> => {
  const activeEditor = readActiveEditorStep(deps);
  const selectedMode = await continueCommandStep(activeEditor, (editor) =>
    selectModeForEditor(deps, editor),
  );
  const beforeDefinition = await continueCommandStep(
    selectedMode,
    (selection) => selectBeforeForCommand(deps, selection),
  );
  const reportInput = await continueCommandStep(beforeDefinition, (request) =>
    readReportInputStep(request),
  );
  const reportData = await continueCommandStep(reportInput, (request) =>
    buildReportDataStep(deps, request),
  );
  const output = await continueCommandStep(reportData, (request) =>
    renderReportStep(deps, request),
  );
  return continueCommandStep(output, (report) =>
    displayReportStep(deps, report),
  );
};

const finalizeCommandFailure = async (
  deps: SemanticDiffCommandDeps,
  failure: CommandFailure["error"],
): Promise<SemanticDiffCommandResult> => {
  if (failure.notify) {
    await safeShowErrorMessage(deps, failure.message);
  }
  return commandError(failure.code, failure.message);
};

const finalizeSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
  step: CommandStep<SemanticDiffOutputDocument>,
): Promise<SemanticDiffCommandResult> =>
  step.kind === "failed"
    ? finalizeCommandFailure(deps, step.error)
    : { ok: true, report: step.value.content, action: "displayed" };

export const executeCompareSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<SemanticDiffCommandResult> =>
  finalizeSemanticDiffCommand(deps, await runSemanticDiffCommand(deps));
