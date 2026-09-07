import type * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import {
  createSemanticDiffSourceHandleIdAllocator,
  type SemanticDiffSourceHandleIdAllocator,
} from "../../../application/parsing/AjsParserWithSourceIndexPort";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
  SemanticDiffSourceCaptureFactory,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import { isSemanticDiffSourceCaptureError } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffExplorerSessionId } from "../../../application/semantic-diff/semanticDiffExplorerDto";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/semanticDiffExplorerPanel";
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
      sessionId: SemanticDiffExplorerSessionId;
      action: "explorer-opened";
    }
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
  openTextDocument?: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  language?: string;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  beginSemanticDiffSourceCapture?: SemanticDiffSourceCaptureFactory;
  sourceHandleIdAllocator?: SemanticDiffSourceHandleIdAllocator;
  registerSemanticDiffSourceCapture?: (
    context: SemanticDiffOutputContext,
    binding: Extract<SemanticDiffSourceCaptureBindResult, { ok: true }>,
    sources: Readonly<{
      before: ImmutableSourceDescriptor & { uri: vscode.Uri };
      after: ImmutableSourceDescriptor & { uri: vscode.Uri };
    }>,
    release: () => void,
  ) => void;
  unregisterSemanticDiffSourceCapture?: (
    context: SemanticDiffOutputContext,
  ) => void;
  buildSemanticDiffOutputContext?: (
    result: Parameters<typeof buildSemanticDiffOutputContext>[0],
  ) => SemanticDiffOutputContext;
  openExplorer?: (
    context: SemanticDiffOutputContext,
  ) => Promise<SemanticDiffExplorerSessionHandle>;
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
  beforeUri?: vscode.Uri;
  beforeVersion: number | null;
  afterUri?: vscode.Uri;
  afterVersion: number | null;
};

type CommandReportData = CommandReportRequest & {
  input: Parameters<BuildSemanticDiffReportData>[0];
  sourceCapture?: SemanticDiffSourceCapture;
  sourceDescriptors?: Readonly<{
    before: ImmutableSourceDescriptor & { uri: vscode.Uri };
    after: ImmutableSourceDescriptor & { uri: vscode.Uri };
  }>;
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
): Promise<
  | { kind: "ready"; content: string; version: number | null; uri: vscode.Uri }
  | { kind: "failed" }
> => {
  let result:
    | {
        kind: "ready";
        content: string;
        version: number | null;
        uri: vscode.Uri;
      }
    | { kind: "failed" };
  try {
    if (deps.openTextDocument) {
      const document = await deps.openTextDocument(beforeUri);
      result = {
        kind: "ready",
        content: document.getText(),
        version: typeof document.version === "number" ? document.version : null,
        uri: beforeUri,
      };
    } else {
      result = {
        kind: "ready",
        content: textDecoder.decode(await deps.readFile(beforeUri)),
        version: null,
        uri: beforeUri,
      };
    }
  } catch {
    result = { kind: "failed" };
  }
  return result;
};

const readBeforeDefinition = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  | { kind: "ready"; content: string; version: number | null; uri: vscode.Uri }
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
): CommandStep<
  Extract<Awaited<ReturnType<typeof readBeforeDefinition>>, { kind: "ready" }>
> =>
  beforeDefinition.kind === "ready"
    ? readyStep(beforeDefinition)
    : beforeDefinitionFailures[beforeDefinition.kind];

const readBeforeDefinitionStep = async (
  deps: SemanticDiffCommandDeps,
): Promise<
  CommandStep<
    Extract<Awaited<ReturnType<typeof readBeforeDefinition>>, { kind: "ready" }>
  >
> => toBeforeDefinitionStep(await readBeforeDefinition(deps));

const selectBeforeForCommand = async (
  deps: SemanticDiffCommandDeps,
  selection: CommandSelection,
): Promise<CommandStep<CommandReportRequest>> =>
  mapCommandStep(
    await readBeforeDefinitionStep(deps),
    (beforeDefinition): CommandReportRequest => ({
      ...selection,
      beforeContent: beforeDefinition.content,
      beforeUri: beforeDefinition.uri,
      beforeVersion: beforeDefinition.version,
      afterUri: selection.activeEditor.document.uri,
      afterVersion:
        typeof selection.activeEditor.document.version === "number"
          ? selection.activeEditor.document.version
          : null,
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
  let sourceCapture: SemanticDiffSourceCapture | undefined;
  let step: CommandStep<
    CommandReportData & {
      result: Extract<
        ReturnType<BuildSemanticDiffReportData>,
        { ok: true }
      >["result"];
    }
  >;
  try {
    if (deps.beginSemanticDiffSourceCapture && deps.openExplorer) {
      const sourceHandleIds =
        deps.sourceHandleIdAllocator ??
        createSemanticDiffSourceHandleIdAllocator();
      const before: ImmutableSourceDescriptor = {
        side: "before",
        sourceHandleId: sourceHandleIds(),
        text: request.input.beforeContent,
        version: request.beforeVersion,
      };
      const after: ImmutableSourceDescriptor = {
        side: "after",
        sourceHandleId: sourceHandleIds(),
        text: request.input.afterContent,
        version: request.afterVersion,
      };
      if (request.beforeUri === undefined || request.afterUri === undefined) {
        throw new Error("Source capture requires source URIs.");
      }
      request.sourceDescriptors = {
        before: { ...before, uri: request.beforeUri },
        after: { ...after, uri: request.afterUri },
      };
      sourceCapture = deps.beginSemanticDiffSourceCapture({ before, after });
    }
    const reportResult = deps.buildSemanticDiffReportData(
      request.input,
      sourceCapture?.parser,
    );
    step = reportResult.ok
      ? readyStep({ ...request, result: reportResult.result, sourceCapture })
      : (() => {
          sourceCapture?.release();
          return failedStep(
            "parse-failed",
            "Semantic diff could not parse one or both JP1/AJS definitions.",
            true,
          );
        })();
  } catch (error: unknown) {
    sourceCapture?.release();
    step = failedStep(
      isSemanticDiffSourceCaptureError(error)
        ? "display-failed"
        : "parse-failed",
      isSemanticDiffSourceCaptureError(error)
        ? "Semantic diff source capture could not be established."
        : "Semantic diff could not parse one or both JP1/AJS definitions.",
      true,
    );
  }
  return step;
};

type CommandReadyReport = Extract<
  ReturnType<BuildSemanticDiffReportData>,
  { ok: true }
>["result"];

type CommandReadyExplorer = {
  readonly result: CommandReadyReport;
  readonly context: SemanticDiffOutputContext;
  readonly sourceCaptureRelease?: () => void;
};

const buildExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & { result: CommandReadyReport },
): CommandStep<CommandReadyExplorer> => {
  let released = false;
  const releaseSourceCapture = (): void => {
    if (released) return;
    released = true;
    request.sourceCapture?.release();
  };
  const createContext =
    deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
  let context: SemanticDiffOutputContext;
  try {
    context = createContext(request.result);
  } catch {
    releaseSourceCapture();
    return failedStep(
      "render-failed",
      "Semantic diff report could not be prepared.",
      true,
    );
  }
  if (request.sourceCapture) {
    const rollbackSourceCapture = (): void => {
      try {
        deps.unregisterSemanticDiffSourceCapture?.(context);
      } catch {
        // Release must still complete if a best-effort registry rollback fails.
      }
      releaseSourceCapture();
    };
    try {
      const binding = request.sourceCapture.bind(context);
      if (!binding.ok) {
        rollbackSourceCapture();
        return failedStep(
          "display-failed",
          "Semantic diff source targets could not be prepared.",
          true,
        );
      }
      if (!deps.registerSemanticDiffSourceCapture) {
        rollbackSourceCapture();
        return failedStep(
          "display-failed",
          "Semantic diff source targets could not be registered.",
          true,
        );
      }
      if (request.sourceDescriptors === undefined) {
        rollbackSourceCapture();
        return failedStep(
          "display-failed",
          "Semantic diff source targets could not be registered.",
          true,
        );
      }
      deps.registerSemanticDiffSourceCapture(
        context,
        binding,
        request.sourceDescriptors,
        releaseSourceCapture,
      );
    } catch {
      rollbackSourceCapture();
      return failedStep(
        "display-failed",
        "Semantic diff source targets could not be registered.",
        true,
      );
    }
  }
  return readyStep({
    result: request.result,
    context,
    sourceCaptureRelease: releaseSourceCapture,
  });
};

const openExplorerStep = async (
  deps: SemanticDiffCommandDeps,
  request: CommandReadyExplorer,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  if (!deps.openExplorer) {
    request.sourceCaptureRelease?.();
    return failedStep(
      "display-failed",
      "Semantic diff Explorer could not be opened.",
      true,
    );
  }
  try {
    return readyStep(await deps.openExplorer(request.context));
  } catch {
    deps.unregisterSemanticDiffSourceCapture?.(request.context);
    request.sourceCaptureRelease?.();
    return failedStep(
      "display-failed",
      "Semantic diff Explorer could not be opened.",
      true,
    );
  }
};

const runExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  const activeEditor = readActiveEditorStep(deps);
  const beforeDefinition = await continueCommandStep(activeEditor, (editor) =>
    readBeforeDefinitionStep(deps).then((beforeDefinition) =>
      beforeDefinition.kind === "failed"
        ? beforeDefinition
        : readyStep({
            activeEditor: editor,
            mode: "full" as SemanticDiffOutputMode,
            beforeContent: beforeDefinition.value.content,
            beforeUri: beforeDefinition.value.uri,
            beforeVersion: beforeDefinition.value.version,
            afterUri: editor.document.uri,
            afterVersion:
              typeof editor.document.version === "number"
                ? editor.document.version
                : null,
          }),
    ),
  );
  const reportInput = await continueCommandStep(beforeDefinition, (request) =>
    readReportInputStep(request),
  );
  const reportData = await continueCommandStep(reportInput, (request) =>
    buildReportDataStep(deps, request),
  );
  const context = await continueCommandStep(reportData, (request) =>
    buildExplorerContextStep(deps, request),
  );
  return continueCommandStep(context, (request) =>
    openExplorerStep(deps, request),
  );
};

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

const finalizeExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
  step: CommandStep<SemanticDiffExplorerSessionHandle>,
): Promise<SemanticDiffCommandResult> =>
  step.kind === "failed"
    ? finalizeCommandFailure(deps, step.error)
    : {
        ok: true,
        action: "explorer-opened",
        sessionId: step.value.sessionId,
      };

export const executeCompareSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<SemanticDiffCommandResult> =>
  deps.openExplorer
    ? finalizeExplorerCommand(deps, await runExplorerCommand(deps))
    : finalizeSemanticDiffCommand(deps, await runSemanticDiffCommand(deps));
