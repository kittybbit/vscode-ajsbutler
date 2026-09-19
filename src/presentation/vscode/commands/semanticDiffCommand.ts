import type * as vscode from "vscode";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import type { SemanticDiffComparisonPeriod } from "../../../application/semantic-diff/semanticDiffDto";
import type {
  BuildSemanticDiffPresentationArtifacts,
  SemanticDiffPresentationArtifacts,
} from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffSourceHandleIdAllocator } from "../../../application/parsing/AjsParserWithSourceIndexPort";
import type { SemanticDiffSourceCaptureFactory } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import {
  buildSemanticDiffOutputContext,
  type SemanticDiffOutputContext,
} from "../../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffExplorerSessionId } from "../../../application/semantic-diff/semanticDiffExplorerDto";
import type { SemanticDiffExplorerSessionHandle } from "../semantic-diff/panel/semanticDiffExplorerPanel";
import {
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
  readyStep,
  safeShowErrorMessage,
  type CommandFailure,
  type CommandReportData,
  type CommandStep,
  type SemanticDiffCommandFailureResult,
} from "./semanticDiffCommandSteps";
import {
  presentSemanticDiffOutput,
  type SemanticDiffOutputDocument,
  type SemanticDiffOutputMode,
  type SemanticDiffOutputModeItem,
} from "../../semantic-diff/semanticDiffOutput";
import { getSemanticDiffCommandLocalization } from "./semanticDiffCommandLocalization";
import { commandExecution } from "./semanticDiffCommandWorkflowExecution";
import type { WorkflowExplorerResult } from "./semanticDiffCommandWorkflowArtifacts";

export type SemanticDiffGitHeadSnapshotReservation = Readonly<{
  uri: vscode.Uri;
  release(): void;
}>;

export type SemanticDiffGitHeadSnapshotProvider = Readonly<{
  reserve(content: string):
    | Readonly<{
        kind: "reserved";
        reservation: SemanticDiffGitHeadSnapshotReservation;
      }>
    | Readonly<{
        kind: "unavailable";
        reason: "capacity-exceeded";
      }>;
}>;

export const COMPARE_SEMANTIC_DIFF_COMMAND = "ajsbutler.compareSemanticDiff";

export { MAX_SEMANTIC_DIFF_SOURCE_BYTES } from "./semanticDiffCommandWorkflowInput";

export type SemanticDiffWorkflowQuickPickItem = Readonly<{
  workflowKind: "file" | "git-head" | "no-period" | "specify-period";
  label: string;
  description?: string;
}>;

export type SemanticDiffReportAction = "displayed";

export type SemanticDiffCommandResult =
  | {
      ok: true;
      sessionId: SemanticDiffExplorerSessionId;
      action: "explorer-opened";
      source: "file" | "git-head";
      period: "not-requested" | "evaluated";
    }
  | {
      ok: true;
      report: string;
      action: SemanticDiffReportAction;
    }
  | SemanticDiffCommandFailureResult;

export type SemanticDiffCommandDeps = {
  getActiveEditor: () => vscode.TextEditor | undefined;
  showQuickPick: (
    items: readonly SemanticDiffOutputModeItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffOutputModeItem | undefined>;
  showWorkflowQuickPick?: (
    items: readonly SemanticDiffWorkflowQuickPickItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffWorkflowQuickPickItem | undefined>;
  showInputBox?: (
    options?: vscode.InputBoxOptions,
  ) => Thenable<string | undefined>;
  showOpenDialog: (
    options: vscode.OpenDialogOptions,
  ) => Thenable<vscode.Uri[] | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  readFile: (uri: vscode.Uri) => Thenable<Uint8Array>;
  openTextDocument?: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  language?: string;
  buildSemanticDiffReportData: BuildSemanticDiffReportData;
  buildSemanticDiffPresentationArtifacts?: BuildSemanticDiffPresentationArtifacts;
  readGitHeadDefinition?: import("../../../application/semantic-diff/GitHeadDefinitionSourcePort").ReadGitHeadDefinition;
  gitHeadSnapshotProvider?: SemanticDiffGitHeadSnapshotProvider;
  scheduleComparisonPeriod?: SemanticDiffComparisonPeriod;
  beginSemanticDiffSourceCapture?: SemanticDiffSourceCaptureFactory;
  sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator;
  registerSemanticDiffSourceCapture?: (
    context: SemanticDiffOutputContext,
    entry: import("../semantic-diff/source/semanticDiffExplorerSourceTypes").SemanticDiffSourceCaptureEntry,
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
  openScheduleAwareExplorerSession?: (
    artifacts: SemanticDiffPresentationArtifacts,
  ) => Promise<SemanticDiffExplorerSessionHandle>;
  presentSemanticDiffOutput?: (
    context: SemanticDiffOutputContext,
    mode: SemanticDiffOutputMode,
    language?: string,
  ) => SemanticDiffOutputDocument;
};

export type CommandReadyReport = Extract<
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
  const message =
    failure.code === "cancelled"
      ? getSemanticDiffCommandLocalization(deps.language).cancelled
      : failure.message;
  if (failure.notify) await safeShowErrorMessage(deps, message);
  return commandError(failure.code, message, failure.reason);
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
        source: "file",
        period: "not-requested",
      };

const finalizeWorkflowExplorerCommand = async (
  deps: SemanticDiffCommandDeps,
  step: CommandStep<WorkflowExplorerResult>,
): Promise<SemanticDiffCommandResult> =>
  step.kind === "failed"
    ? finalizeCommandFailure(deps, step.error)
    : {
        ok: true,
        action: "explorer-opened",
        sessionId: step.value.handle.sessionId,
        source: step.value.source,
        period: step.value.period,
      };

export const executeCompareSemanticDiffCommand = async (
  deps: SemanticDiffCommandDeps,
): Promise<SemanticDiffCommandResult> =>
  commandExecution(deps, {
    finalizeWorkflow: finalizeWorkflowExplorerCommand,
    finalizeExplorer: finalizeExplorerCommand,
    finalizeReport: finalizeSemanticDiffCommand,
    runReport: runSemanticDiffCommand,
  })(deps);
