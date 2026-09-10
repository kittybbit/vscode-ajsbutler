import type * as vscode from "vscode";
import type {
  GitHeadDefinitionResult,
  GitHeadDefinitionUnavailableReason,
  ReadGitHeadDefinition,
} from "../../../application/semantic-diff/GitHeadDefinitionSourcePort";
import type { BuildSemanticDiffReportData } from "../../../application/semantic-diff/buildSemanticDiffReportData";
import type { SemanticDiffComparisonPeriod } from "../../../application/semantic-diff/semanticDiffDto";
import {
  parseSemanticDiffComparisonPeriod,
  type SemanticDiffComparisonPeriodInvalidReason,
} from "../../../application/semantic-diff/parseSemanticDiffComparisonPeriod";
import type {
  BuildSemanticDiffPresentationArtifacts,
  BuildSemanticDiffPresentationArtifactsInput,
  BuildSemanticDiffPresentationArtifactsResult,
  SemanticDiffPresentationArtifacts,
} from "../../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffSourceHandleIdAllocator } from "../../../application/parsing/AjsParserWithSourceIndexPort";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCapture,
  SemanticDiffSourceCaptureBindResult,
  SemanticDiffSourceCaptureFactory,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import { isSemanticDiffSourceCaptureError } from "../../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffSourceCaptureEntry } from "../semantic-diff/source/semanticDiffExplorerSourceTypes";
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
import {
  getSemanticDiffCommandLocalization,
  localizeGitHeadUnavailableReason,
  type SemanticDiffCommandLocalization,
} from "./semanticDiffCommandLocalization";

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

export const MAX_SEMANTIC_DIFF_SOURCE_BYTES = 8 * 1024 * 1024;

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
  | {
      ok: false;
      error: {
        code:
          | "no-active-editor"
          | "active-editor-failed"
          | "after-non-text"
          | "after-too-large"
          | "source-picker-failed"
          | "git-head-unavailable"
          | "cancelled"
          | "before-file-read-failed"
          | "before-file-non-text"
          | "before-file-too-large"
          | "mode-picker-failed"
          | "read-failed"
          | "parse-failed"
          | "comparison-failed"
          | "source-capture-failed"
          | "render-failed"
          | "display-failed"
          | "explorer-open-failed";
        reason?: GitHeadDefinitionUnavailableReason;
        message: string;
      };
    };

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
  readGitHeadDefinition?: ReadGitHeadDefinition;
  gitHeadSnapshotProvider?: SemanticDiffGitHeadSnapshotProvider;
  scheduleComparisonPeriod?: SemanticDiffComparisonPeriod;
  beginSemanticDiffSourceCapture?: SemanticDiffSourceCaptureFactory;
  sourceHandleIdAllocator: SemanticDiffSourceHandleIdAllocator;
  registerSemanticDiffSourceCapture?: (
    context: SemanticDiffOutputContext,
    entry: SemanticDiffSourceCaptureEntry,
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

type CommandReadyReport = Extract<
  ReturnType<BuildSemanticDiffReportData>,
  { ok: true }
>["result"];

type CommandReadyExplorer = {
  readonly result: CommandReadyReport;
  readonly context: SemanticDiffOutputContext;
  readonly sourceCaptureRelease?: () => void;
  readonly presentation?: SemanticDiffPresentationArtifacts;
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
    const sources = options.request.sourceDescriptors;
    if (
      sources === undefined ||
      !options.deps.registerSemanticDiffSourceCapture
    ) {
      return sourceBindingFailure(
        "Semantic diff source targets could not be registered.",
      );
    }
    const entry: SemanticDiffSourceCaptureEntry = {
      binding,
      sources,
      release: options.releaseSourceCapture,
    };
    options.deps.registerSemanticDiffSourceCapture(options.context, entry);
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

type PresentationCommandData = CommandReportData & {
  readonly result: CommandReadyReport;
  readonly presentation: SemanticDiffPresentationArtifacts;
};

type WorkflowSourceDescriptor = ImmutableSourceDescriptor & {
  uri: vscode.Uri;
};

type WorkflowExplorerResult = {
  handle: SemanticDiffExplorerSessionHandle;
  source: "file" | "git-head";
  period: "not-requested" | "evaluated";
};

type WorkflowAfterSnapshot = {
  uri: vscode.Uri;
  version: number | null;
  text: string;
};

type WorkflowSourceRequest = {
  after: WorkflowAfterSnapshot;
  before: WorkflowSourceDescriptor;
  source: "file" | "git-head";
  providerReservation?: SemanticDiffGitHeadSnapshotReservation;
};

type WorkflowArtifactState = {
  artifacts: SemanticDiffPresentationArtifacts;
  capture: SemanticDiffSourceCapture;
  sources: {
    before: WorkflowSourceDescriptor;
    after: WorkflowSourceDescriptor;
  };
  source: "file" | "git-head";
  period: "not-requested" | "evaluated";
  release: () => void;
};

const workflowFailure = (
  code: Extract<SemanticDiffCommandResult, { ok: false }>["error"]["code"],
  message: string,
  notify = true,
  reason?: GitHeadDefinitionUnavailableReason,
): CommandFailure => failedStep(code, message, notify, reason);

const unregisterAndReleaseWorkflowCapture = (
  deps: SemanticDiffCommandDeps,
  context: SemanticDiffOutputContext,
  release: () => void,
): void => {
  try {
    deps.unregisterSemanticDiffSourceCapture?.(context);
  } catch {
    // Release must still complete if best-effort registry rollback fails.
  } finally {
    release();
  }
};

const sourceTextFailure = (
  text: string,
  side: "before" | "after",
  localization: SemanticDiffCommandLocalization,
): CommandFailure | undefined => {
  const failure = text.includes("\u0000")
    ? side === "after"
      ? ["after-non-text", localization.afterNonText]
      : ["before-file-non-text", localization.beforeFileNonText]
    : undefined;
  const byteLength = new TextEncoder().encode(text).byteLength;
  const sizeFailure =
    byteLength > MAX_SEMANTIC_DIFF_SOURCE_BYTES
      ? side === "after"
        ? ["after-too-large", localization.afterTooLarge]
        : ["before-file-too-large", localization.beforeFileTooLarge]
      : undefined;
  const selected = failure ?? sizeFailure;
  return selected
    ? workflowFailure(
        selected[0] as Extract<
          SemanticDiffCommandResult,
          { ok: false }
        >["error"]["code"],
        selected[1],
      )
    : undefined;
};

const parseFailureMessage = (
  result: Extract<BuildSemanticDiffPresentationArtifactsResult, { ok: false }>,
  localization: SemanticDiffCommandLocalization,
): string => {
  const beforeFailed = result.errors.before.length > 0;
  const afterFailed = result.errors.after.length > 0;
  const key =
    beforeFailed && afterFailed
      ? "both"
      : beforeFailed
        ? "before"
        : afterFailed
          ? "after"
          : "none";
  return {
    before: localization.parseFailedBefore,
    after: localization.parseFailedAfter,
    both: localization.parseFailedBoth,
    none: localization.parseFailed,
  }[key];
};

const readWorkflowAfterSnapshot = (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowAfterSnapshot> => {
  let activeEditor: vscode.TextEditor | undefined;
  try {
    activeEditor = deps.getActiveEditor();
  } catch {
    return workflowFailure(
      "active-editor-failed",
      localization.activeEditorFailed,
    );
  }
  if (!activeEditor) {
    return workflowFailure("no-active-editor", localization.noActiveEditor);
  }
  try {
    const document = activeEditor.document;
    const text = document.getText();
    const textFailure = sourceTextFailure(text, "after", localization);
    if (textFailure) return textFailure;
    if (!document.uri) {
      return workflowFailure(
        "active-editor-failed",
        localization.activeEditorFailed,
      );
    }
    return readyStep({
      uri: document.uri,
      version: typeof document.version === "number" ? document.version : null,
      text,
    });
  } catch {
    return workflowFailure(
      "active-editor-failed",
      localization.activeEditorFailed,
    );
  }
};

const workflowQuickPick = (
  deps: SemanticDiffCommandDeps,
  items: readonly SemanticDiffWorkflowQuickPickItem[],
  options: vscode.QuickPickOptions,
): Thenable<SemanticDiffWorkflowQuickPickItem | undefined> => {
  if (deps.showWorkflowQuickPick) {
    return deps.showWorkflowQuickPick(items, options);
  }
  return deps.showQuickPick(
    items as unknown as readonly SemanticDiffOutputModeItem[],
    options,
  ) as unknown as Thenable<SemanticDiffWorkflowQuickPickItem | undefined>;
};

type WorkflowSourceSelection =
  | { kind: "file" }
  | { kind: "git-head" }
  | { kind: "cancelled" }
  | { kind: "failed"; reason: "host" | "invalid" };

const selectWorkflowSource = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowSourceSelection> => {
  try {
    const selected = await workflowQuickPick(
      deps,
      [
        { workflowKind: "file", label: localization.selectDefinitionFile },
        { workflowKind: "git-head", label: localization.gitHead },
      ],
      {
        placeHolder: localization.sourcePicker,
        title: localization.sourcePickerTitle,
      },
    );
    if (!selected) return { kind: "cancelled" };
    return selected.workflowKind === "file"
      ? { kind: "file" }
      : selected.workflowKind === "git-head"
        ? { kind: "git-head" }
        : { kind: "failed", reason: "invalid" };
  } catch {
    return { kind: "failed", reason: "host" };
  }
};

type WorkflowPeriodSelection =
  | { kind: "not-requested" }
  | { kind: "evaluated"; period: SemanticDiffComparisonPeriod }
  | { kind: "cancelled" }
  | {
      kind: "failed";
      reason: "invalid-from" | "invalid-to" | "non-increasing" | "host";
    };

const periodValidationMessage = (
  localization: SemanticDiffCommandLocalization,
  reason: SemanticDiffComparisonPeriodInvalidReason,
): string => {
  switch (reason) {
    case "invalid-from":
      return localization.invalidFromDate;
    case "invalid-to":
      return localization.invalidToDate;
    case "non-increasing":
      return localization.nonIncreasingPeriod;
  }
};

const workflowCancellation = (
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  workflowFailure("cancelled", localization.cancelled, false);

const showWorkflowInput = (
  deps: SemanticDiffCommandDeps,
  options: vscode.InputBoxOptions,
): Thenable<string | undefined> =>
  deps.showInputBox ? deps.showInputBox(options) : Promise.resolve(undefined);

const selectWorkflowPeriod = async (
  deps: SemanticDiffCommandDeps,
  localization: SemanticDiffCommandLocalization,
): Promise<WorkflowPeriodSelection> => {
  try {
    const selected = await workflowQuickPick(
      deps,
      [
        { workflowKind: "no-period", label: localization.noSchedulePeriod },
        {
          workflowKind: "specify-period",
          label: localization.specifySchedulePeriod,
        },
      ],
      {
        placeHolder: localization.periodPicker,
        title: localization.periodPickerTitle,
      },
    );
    if (!selected) return { kind: "cancelled" };
    if (selected.workflowKind === "no-period") return { kind: "not-requested" };
    if (selected.workflowKind !== "specify-period" || !deps.showInputBox) {
      return { kind: "failed", reason: "invalid-from" };
    }

    const from = await showWorkflowInput(deps, {
      title: localization.fromDateTitle,
      prompt: localization.fromDatePrompt,
      placeHolder: localization.datePlaceholder,
      validateInput: (value) => {
        const parsed = parseSemanticDiffComparisonPeriod({
          from: value,
          to: "9999-12-31",
        });
        return parsed.kind === "invalid" && parsed.reason === "invalid-from"
          ? localization.invalidFromDate
          : undefined;
      },
    });
    if (from === undefined) return { kind: "cancelled" };

    const to = await showWorkflowInput(deps, {
      title: localization.toDateTitle,
      prompt: localization.toDatePrompt,
      placeHolder: localization.datePlaceholder,
      validateInput: (value) => {
        const parsed = parseSemanticDiffComparisonPeriod({ from, to: value });
        return parsed.kind === "invalid"
          ? periodValidationMessage(localization, parsed.reason)
          : undefined;
      },
    });
    if (to === undefined) return { kind: "cancelled" };

    const parsed = parseSemanticDiffComparisonPeriod({ from, to });
    return parsed.kind === "valid"
      ? { kind: "evaluated", period: parsed.period }
      : { kind: "failed", reason: parsed.reason };
  } catch {
    return { kind: "failed", reason: "host" };
  }
};

const workflowPeriodFailure = (
  selection: Extract<WorkflowPeriodSelection, { kind: "failed" }>,
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  selection.reason === "host"
    ? workflowFailure("comparison-failed", localization.comparisonFailed)
    : workflowFailure(
        "comparison-failed",
        periodValidationMessage(localization, selection.reason),
      );

const workflowSourceFailure = (
  selection: Extract<WorkflowSourceSelection, { kind: "failed" }>,
  localization: SemanticDiffCommandLocalization,
): CommandFailure =>
  selection.reason === "host"
    ? workflowFailure("comparison-failed", localization.comparisonFailed)
    : workflowFailure("source-picker-failed", localization.sourcePickerFailed);

const readWorkflowBefore = async (
  deps: SemanticDiffCommandDeps,
  uri: vscode.Uri,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceDescriptor>> => {
  if (!deps.openTextDocument) {
    return workflowFailure(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
  try {
    const document = await deps.openTextDocument(uri);
    const text = document.getText();
    const textFailure = sourceTextFailure(text, "before", localization);
    return (
      textFailure ??
      readyStep({
        side: "before",
        sourceHandleId: deps.sourceHandleIdAllocator(),
        text,
        version: typeof document.version === "number" ? document.version : null,
        uri,
      })
    );
  } catch {
    return workflowFailure(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

const readWorkflowSourceFile = async (
  deps: SemanticDiffCommandDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> => {
  try {
    const selected = await deps.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: localization.selectDefinitionFile,
    });
    if (!selected?.[0]) return workflowCancellation(localization);
    const before = await readWorkflowBefore(deps, selected[0], localization);
    return before.kind === "failed"
      ? before
      : readyStep({ after, before: before.value, source: "file" });
  } catch {
    return workflowFailure(
      "before-file-read-failed",
      localization.beforeFileReadFailed,
    );
  }
};

const readWorkflowGitHead = async (
  deps: SemanticDiffCommandDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> => {
  if (!deps.readGitHeadDefinition) {
    return workflowFailure(
      "git-head-unavailable",
      localization.gitHeadUnavailable,
      true,
      "extension-missing",
    );
  }
  if (!deps.gitHeadSnapshotProvider) {
    return workflowFailure(
      "git-head-unavailable",
      localization.gitHeadUnavailable,
      true,
      "api-unavailable",
    );
  }
  let result: GitHeadDefinitionResult;
  try {
    result = await deps.readGitHeadDefinition({
      documentUri: after.uri.toString(),
    });
  } catch {
    result = { kind: "unavailable", reason: "read-failed" };
  }
  if (result.kind === "unavailable") {
    return workflowFailure(
      "git-head-unavailable",
      localizeGitHeadUnavailableReason(localization, result.reason),
      true,
      result.reason,
    );
  }
  if (result.ref !== "HEAD") {
    return workflowFailure(
      "git-head-unavailable",
      localization.gitHeadUnavailable,
      true,
      "api-unavailable",
    );
  }
  const reservation = deps.gitHeadSnapshotProvider.reserve(result.content);
  if (reservation.kind === "unavailable") {
    return workflowFailure(
      "explorer-open-failed",
      localization.gitHeadSnapshotCapacity,
    );
  }
  try {
    return readyStep({
      after,
      before: {
        side: "before",
        sourceHandleId: deps.sourceHandleIdAllocator(),
        text: result.content,
        version: 1,
        uri: reservation.reservation.uri,
      },
      source: "git-head",
      providerReservation: reservation.reservation,
    });
  } catch {
    reservation.reservation.release();
    return workflowFailure(
      "git-head-unavailable",
      localization.gitHeadReadFailed,
      true,
      "read-failed",
    );
  }
};

const prepareWorkflowSource = async (
  deps: SemanticDiffCommandDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> => {
  const selection = await selectWorkflowSource(deps, localization);
  if (selection.kind === "cancelled") {
    return workflowCancellation(localization);
  }
  if (selection.kind === "failed") {
    return workflowSourceFailure(selection, localization);
  }
  if (selection.kind === "git-head") {
    return readWorkflowGitHead(deps, after, localization);
  }
  return readWorkflowSourceFile(deps, after, localization);
};

const beginWorkflowCapture = (
  deps: SemanticDiffCommandDeps,
  source: WorkflowSourceRequest,
  localization: SemanticDiffCommandLocalization,
): CommandStep<{
  before: WorkflowSourceDescriptor;
  after: WorkflowSourceDescriptor;
  capture: SemanticDiffSourceCapture;
}> => {
  if (
    !deps.beginSemanticDiffSourceCapture ||
    !deps.buildSemanticDiffPresentationArtifacts
  ) {
    source.providerReservation?.release();
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  try {
    const after: WorkflowSourceDescriptor = {
      side: "after",
      sourceHandleId: deps.sourceHandleIdAllocator(),
      text: source.after.text,
      version: source.after.version,
      uri: source.after.uri,
    };
    const capture = deps.beginSemanticDiffSourceCapture({
      before: {
        side: source.before.side,
        sourceHandleId: source.before.sourceHandleId,
        text: source.before.text,
        version: source.before.version,
      },
      after: {
        side: after.side,
        sourceHandleId: after.sourceHandleId,
        text: after.text,
        version: after.version,
      },
    });
    return readyStep({ before: source.before, after, capture });
  } catch {
    source.providerReservation?.release();
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
};

const buildWorkflowArtifacts = (
  deps: SemanticDiffCommandDeps,
  source: WorkflowSourceRequest,
  selection: Extract<
    WorkflowPeriodSelection,
    { kind: "not-requested" | "evaluated" }
  >,
  localization: SemanticDiffCommandLocalization,
): CommandStep<WorkflowArtifactState> => {
  const captureStep = beginWorkflowCapture(deps, source, localization);
  if (captureStep.kind === "failed") return captureStep;
  const releaseSourceCapture = createSourceCaptureRelease(
    captureStep.value.capture,
  );
  let released = false;
  const release = (): void => {
    if (released) return;
    released = true;
    releaseSourceCapture();
    source.providerReservation?.release();
  };
  const input: BuildSemanticDiffPresentationArtifactsInput =
    selection.kind === "evaluated"
      ? {
          beforeContent: source.before.text,
          afterContent: captureStep.value.after.text,
          options: { scheduleComparisonPeriod: selection.period },
        }
      : {
          beforeContent: source.before.text,
          afterContent: captureStep.value.after.text,
        };
  try {
    const result = deps.buildSemanticDiffPresentationArtifacts!(
      input,
      captureStep.value.capture.parser,
    );
    if ("ok" in result && result.ok === false) {
      release();
      return workflowFailure(
        "parse-failed",
        parseFailureMessage(result, localization),
      );
    }
    return readyStep({
      artifacts: result as SemanticDiffPresentationArtifacts,
      capture: captureStep.value.capture,
      sources: {
        before: captureStep.value.before,
        after: captureStep.value.after,
      },
      source: source.source,
      period: selection.kind === "evaluated" ? "evaluated" : "not-requested",
      release,
    });
  } catch (error: unknown) {
    release();
    return workflowFailure(
      isSemanticDiffSourceCaptureError(error)
        ? "source-capture-failed"
        : "comparison-failed",
      isSemanticDiffSourceCaptureError(error)
        ? localization.sourceCaptureFailed
        : localization.comparisonFailed,
    );
  }
};

const bindWorkflowCapture = (
  state: WorkflowArtifactState,
  localization: SemanticDiffCommandLocalization,
): CommandStep<SourceBinding> => {
  try {
    const binding = state.capture.bind(state.artifacts.context);
    return binding.ok
      ? readyStep(binding)
      : workflowFailure(
          "source-capture-failed",
          localization.sourceCaptureFailed,
        );
  } catch {
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
};

const openWorkflowArtifacts = async (
  deps: SemanticDiffCommandDeps,
  state: WorkflowArtifactState,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const binding = bindWorkflowCapture(state, localization);
  if (binding.kind === "failed") {
    state.release();
    return binding;
  }
  if (!deps.registerSemanticDiffSourceCapture) {
    state.release();
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  const entry: SemanticDiffSourceCaptureEntry = {
    binding: binding.value,
    sources: state.sources,
    release: state.release,
  };
  try {
    deps.registerSemanticDiffSourceCapture(state.artifacts.context, entry);
  } catch {
    unregisterAndReleaseWorkflowCapture(
      deps,
      state.artifacts.context,
      state.release,
    );
    return workflowFailure(
      "source-capture-failed",
      localization.sourceCaptureFailed,
    );
  }
  if (!deps.openScheduleAwareExplorerSession) {
    unregisterAndReleaseWorkflowCapture(
      deps,
      state.artifacts.context,
      state.release,
    );
    return workflowFailure(
      "explorer-open-failed",
      localization.explorerOpenFailed,
    );
  }
  try {
    const handle = await deps.openScheduleAwareExplorerSession(state.artifacts);
    return readyStep({
      handle,
      source: state.source,
      period: state.period,
    });
  } catch {
    unregisterAndReleaseWorkflowCapture(
      deps,
      state.artifacts.context,
      state.release,
    );
    return workflowFailure(
      "explorer-open-failed",
      localization.explorerOpenFailed,
    );
  }
};

const runFileComparisonWorkflow = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareWorkflowSource(deps, after, localization),
  );
  const periodStep = await continueCommandStep(sourceStep, async (source) => {
    const selection = await selectWorkflowPeriod(deps, localization);
    if (selection.kind === "cancelled") {
      source.providerReservation?.release();
      return workflowCancellation(localization);
    }
    if (selection.kind === "failed") {
      source.providerReservation?.release();
      return workflowPeriodFailure(selection, localization);
    }
    return readyStep({ source, selection });
  });
  const artifactStep = await continueCommandStep(
    periodStep,
    ({ source, selection }) =>
      buildWorkflowArtifacts(deps, source, selection, localization),
  );
  return continueCommandStep(artifactStep, (state) =>
    openWorkflowArtifacts(deps, state, localization),
  );
};

const prepareCalendarCompatibilitySource = async (
  deps: SemanticDiffCommandDeps,
  after: WorkflowAfterSnapshot,
  localization: SemanticDiffCommandLocalization,
): Promise<CommandStep<WorkflowSourceRequest>> =>
  readWorkflowSourceFile(deps, after, localization);

const runCalendarCompatibilityWorkflow = async (
  deps: SemanticDiffCommandDeps,
): Promise<CommandStep<WorkflowExplorerResult>> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const afterStep = readWorkflowAfterSnapshot(deps, localization);
  const sourceStep = await continueCommandStep(afterStep, (after) =>
    prepareCalendarCompatibilitySource(deps, after, localization),
  );
  const selection: Extract<
    WorkflowPeriodSelection,
    { kind: "not-requested" | "evaluated" }
  > =
    deps.scheduleComparisonPeriod === undefined
      ? { kind: "not-requested" }
      : { kind: "evaluated", period: deps.scheduleComparisonPeriod };
  const artifactStep = await continueCommandStep(sourceStep, (source) =>
    buildWorkflowArtifacts(deps, source, selection, localization),
  );
  return continueCommandStep(artifactStep, (state) =>
    openWorkflowArtifacts(deps, state, localization),
  );
};

const beginPresentationSourceCapture = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): SemanticDiffSourceCapture | undefined => {
  if (!deps.beginSemanticDiffSourceCapture) return undefined;
  if (request.beforeUri === undefined || request.afterUri === undefined) {
    throw new Error("Source capture requires source URIs.");
  }
  const before: ImmutableSourceDescriptor & { uri: vscode.Uri } = {
    side: "before",
    sourceHandleId: deps.sourceHandleIdAllocator(),
    text: request.input.beforeContent,
    version: request.beforeVersion,
    uri: request.beforeUri,
  };
  const after: ImmutableSourceDescriptor & { uri: vscode.Uri } = {
    side: "after",
    sourceHandleId: deps.sourceHandleIdAllocator(),
    text: request.input.afterContent,
    version: request.afterVersion,
    uri: request.afterUri,
  };
  request.sourceDescriptors = { before, after };
  return deps.beginSemanticDiffSourceCapture({
    before: {
      side: before.side,
      sourceHandleId: before.sourceHandleId,
      text: before.text,
      version: before.version,
    },
    after: {
      side: after.side,
      sourceHandleId: after.sourceHandleId,
      text: after.text,
      version: after.version,
    },
  });
};

const buildPresentationArtifactsStep = (
  deps: SemanticDiffCommandDeps,
  request: CommandReportData,
): CommandStep<PresentationCommandData> => {
  const localization = getSemanticDiffCommandLocalization(deps.language);
  const adapter = deps.buildSemanticDiffPresentationArtifacts;
  if (!adapter) {
    return failedStep(
      "display-failed",
      "Semantic diff calendar artifacts could not be prepared.",
      true,
    );
  }
  let sourceCapture: SemanticDiffSourceCapture | undefined;
  try {
    sourceCapture = beginPresentationSourceCapture(deps, request);
    const input: BuildSemanticDiffPresentationArtifactsInput =
      deps.scheduleComparisonPeriod === undefined
        ? request.input
        : {
            ...request.input,
            options: {
              scheduleComparisonPeriod: deps.scheduleComparisonPeriod,
            },
          };
    const result = adapter(input, sourceCapture?.parser);
    if ("ok" in result && result.ok === false) {
      sourceCapture?.release();
      return failedStep(
        "parse-failed",
        parseFailureMessage(result, localization),
        true,
      );
    }
    const presentation = result as SemanticDiffPresentationArtifacts;
    return readyStep({
      ...request,
      result: presentation.context.result,
      presentation,
      sourceCapture,
    });
  } catch (error: unknown) {
    sourceCapture?.release();
    return failedStep(
      isSemanticDiffSourceCaptureError(error)
        ? "display-failed"
        : "parse-failed",
      isSemanticDiffSourceCaptureError(error)
        ? "Semantic diff source capture could not be established."
        : localization.parseFailed,
      true,
    );
  }
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
  request: CommandReportData & {
    result: CommandReadyReport;
    presentation?: SemanticDiffPresentationArtifacts;
  },
): CommandStep<CommandReadyExplorer> => {
  const releaseSourceCapture = createSourceCaptureRelease(
    request.sourceCapture,
  );
  const contextStep = request.presentation
    ? readyStep(request.presentation.context)
    : createExplorerContextStep(deps, request.result, releaseSourceCapture);
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
        presentation: request.presentation,
        sourceCaptureRelease: releaseSourceCapture,
      });
};

const openExplorerStep = async (
  deps: SemanticDiffCommandDeps,
  request: CommandReadyExplorer,
): Promise<CommandStep<SemanticDiffExplorerSessionHandle>> => {
  if (request.presentation && deps.openScheduleAwareExplorerSession) {
    try {
      return readyStep(
        await deps.openScheduleAwareExplorerSession(request.presentation),
      );
    } catch {
      deps.unregisterSemanticDiffSourceCapture?.(request.context);
      request.sourceCaptureRelease?.();
      return failedStep(
        "display-failed",
        "Semantic diff Explorer could not be opened.",
        true,
      );
    }
  }
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
    deps.buildSemanticDiffPresentationArtifacts &&
    deps.openScheduleAwareExplorerSession
      ? buildPresentationArtifactsStep(deps, request)
      : buildReportDataStep(deps, request),
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
  const message =
    failure.code === "cancelled"
      ? getSemanticDiffCommandLocalization(deps.language).cancelled
      : failure.message;
  if (failure.notify) {
    await safeShowErrorMessage(deps, message);
  }
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
): Promise<SemanticDiffCommandResult> => {
  const hasCalendarAdapter =
    deps.buildSemanticDiffPresentationArtifacts !== undefined &&
    deps.openScheduleAwareExplorerSession !== undefined;
  const hasWorkflowUi =
    deps.showWorkflowQuickPick !== undefined || deps.showInputBox !== undefined;
  if (hasCalendarAdapter && hasWorkflowUi) {
    return finalizeWorkflowExplorerCommand(
      deps,
      await runFileComparisonWorkflow(deps),
    );
  }
  if (hasCalendarAdapter && !hasWorkflowUi) {
    return finalizeWorkflowExplorerCommand(
      deps,
      await runCalendarCompatibilityWorkflow(deps),
    );
  }
  return deps.openExplorer
    ? finalizeExplorerCommand(deps, await runExplorerCommand(deps))
    : finalizeSemanticDiffCommand(deps, await runSemanticDiffCommand(deps));
};
