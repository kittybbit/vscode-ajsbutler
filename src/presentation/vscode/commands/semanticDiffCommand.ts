import type * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import type { SemanticDiffSourceHandleIdAllocator } from "../../../application/parsing/AjsParserWithSourceIndexPort";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
  SemanticDiffSourceCaptureFactory,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffExplorerSessionId } from "../../../application/semantic-diff/semanticDiffExplorerDto";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/semanticDiffExplorerPanel";
import {
  readBeforeDefinitionStep,
  selectBeforeForCommand,
  selectModeForEditor,
} from "./semanticDiffCommandSelection";
import { readSemanticDiffActiveEditor } from "./semanticDiffCommandEditor";
import {
  buildSemanticDiffReportDataStep as buildReportDataStep,
  readSemanticDiffReportInputStep as readReportInputStep,
} from "./semanticDiffCommandBuild";
import {
  commandError,
  continueCommandStep,
  failedStep,
  mapCommandStep,
  readyStep,
  safeShowErrorMessage,
} from "./semanticDiffCommandSteps";
import type {
  CommandFailure,
  CommandReportData,
  CommandReportRequest,
  CommandStep,
} from "./semanticDiffCommandSteps";
import {
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
  sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator;
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

type CommandReadyReport = Extract<
  ReturnType<BuildSemanticDiffReportData>,
  { ok: true }
>["result"];

type CommandReadyExplorer = {
  readonly result: CommandReadyReport;
  readonly context: SemanticDiffOutputContext;
  readonly sourceCaptureRelease?: () => void;
};

type SourceBinding = Extract<SemanticDiffSourceCaptureBindResult, { ok: true }>;

type SourceBindingStep = CommandStep<void>;
type PreparedSourceBindingStep = CommandStep<SourceBinding | undefined>;

type SourceBindingOptions = Readonly<{
  deps: SemanticDiffCommandDeps;
  request: CommandReportData & { result: CommandReadyReport };
  context: SemanticDiffOutputContext;
  releaseSourceCapture: () => void;
}>;

const sourceBindingFailure = (message: string): CommandFailure =>
  failedStep("display-failed", message, true);

const rollbackSourceCapture = (options: SourceBindingOptions): void => {
  try {
    options.deps.unregisterSemanticDiffSourceCapture?.(options.context);
  } catch {
    // Release must still complete if a best-effort registry rollback fails.
  }
  options.releaseSourceCapture();
};

const prepareSourceBinding = (
  capture: SemanticDiffSourceCapture,
  context: SemanticDiffOutputContext,
): CommandStep<SourceBinding> => {
  try {
    const binding = capture.bind(context);
    return binding.ok
      ? readyStep(binding)
      : sourceBindingFailure(
          "Semantic diff source targets could not be prepared.",
        );
  } catch {
    return sourceBindingFailure(
      "Semantic diff source targets could not be prepared.",
    );
  }
};

const prepareAndValidateSourceBinding = (
  options: SourceBindingOptions,
): PreparedSourceBindingStep => {
  const capture = options.request.sourceCapture;
  if (!capture) {
    return readyStep(undefined);
  }
  const prepared = prepareSourceBinding(capture, options.context);
  return prepared.kind === "failed"
    ? prepared
    : validateSourceBinding(options, prepared.value);
};

const rollbackFailedBinding = (
  options: SourceBindingOptions,
  step: SourceBindingStep,
): SourceBindingStep => {
  if (step.kind === "failed") {
    rollbackSourceCapture(options);
  }
  return step;
};

const validateSourceBinding = (
  options: SourceBindingOptions,
  binding: SourceBinding,
): PreparedSourceBindingStep => {
  if (!options.deps.registerSemanticDiffSourceCapture) {
    return sourceBindingFailure(
      "Semantic diff source targets could not be registered.",
    );
  }
  return options.request.sourceDescriptors === undefined
    ? sourceBindingFailure(
        "Semantic diff source targets could not be registered.",
      )
    : readyStep(binding);
};

const registerSourceBinding = (
  options: SourceBindingOptions,
  binding: SourceBinding,
): SourceBindingStep => {
  try {
    options.deps.registerSemanticDiffSourceCapture?.(
      options.context,
      binding,
      options.request.sourceDescriptors as NonNullable<
        CommandReportData["sourceDescriptors"]
      >,
      options.releaseSourceCapture,
    );
    return readyStep(undefined);
  } catch {
    return sourceBindingFailure(
      "Semantic diff source targets could not be registered.",
    );
  }
};

const bindAndRegisterExplorerSources = (
  options: SourceBindingOptions,
): SourceBindingStep => {
  const prepared = prepareAndValidateSourceBinding(options);
  if (prepared.kind === "failed") {
    return rollbackFailedBinding(options, prepared);
  }
  if (!prepared.value) {
    return readyStep(undefined);
  }
  return rollbackFailedBinding(
    options,
    registerSourceBinding(options, prepared.value),
  );
};

const createSourceCaptureRelease = (
  sourceCapture: SemanticDiffSourceCapture | undefined,
): (() => void) => {
  let released = false;
  return (): void => {
    if (released) return;
    released = true;
    sourceCapture?.release();
  };
};

const createExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  result: CommandReadyReport,
  releaseSourceCapture: () => void,
): CommandStep<SemanticDiffOutputContext> => {
  try {
    const createContext =
      deps.buildSemanticDiffOutputContext ?? buildSemanticDiffOutputContext;
    return readyStep(createContext(result));
  } catch {
    releaseSourceCapture();
    return failedStep(
      "render-failed",
      "Semantic diff report could not be prepared.",
      true,
    );
  }
};

const buildExplorerContextStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData & { result: CommandReadyReport },
): CommandStep<CommandReadyExplorer> => {
  const releaseSourceCapture = createSourceCaptureRelease(
    request.sourceCapture,
  );
  const contextStep = createExplorerContextStep(
    deps,
    request.result,
    releaseSourceCapture,
  );
  if (contextStep.kind === "failed") return contextStep;
  const bindingStep = bindAndRegisterExplorerSources({
    deps,
    request,
    context: contextStep.value,
    releaseSourceCapture,
  });
  return bindingStep.kind === "failed"
    ? bindingStep
    : readyStep({
        result: request.result,
        context: contextStep.value,
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

const selectExplorerBefore = async (
  deps: SemanticDiffCommandDeps,
  activeEditor: vscode.TextEditor,
): Promise<CommandStep<CommandReportRequest>> => {
  return mapCommandStep(
    await readBeforeDefinitionStep(deps),
    (beforeDefinition): CommandReportRequest => ({
      activeEditor,
      mode: "full" as SemanticDiffOutputMode,
      beforeContent: beforeDefinition.content,
      beforeUri: beforeDefinition.uri,
      beforeVersion: beforeDefinition.version,
      afterUri: activeEditor.document.uri,
      afterVersion:
        typeof activeEditor.document.version === "number"
          ? activeEditor.document.version
          : null,
    }),
  );
};

const runExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  const activeEditor = readSemanticDiffActiveEditor(deps);
  const beforeDefinition = await continueCommandStep(activeEditor, (editor) =>
    selectExplorerBefore(deps, editor),
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
  const activeEditor = readSemanticDiffActiveEditor(deps);
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
